const { getFirestore } = require('../database');
const logger = require('../logger');
const cityModel = require('./City');
const { slugifyProperty } = require('../utils/propertySlug');

// Firestore throws code 9 (FAILED_PRECONDITION) when a composite index is missing.
// This helper retries without orderBy so the app works while indexes are being created.
const executeQuery = async (sortedQuery, baseQuery, inMemorySort) => {
  try {
    const snapshot = await sortedQuery.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    const isMissingIndex = e.code === 9 || (e.message || '').toLowerCase().includes('index');
    if (isMissingIndex) {
      logger.warn('Composite index missing — falling back to in-memory sort. Run: firebase deploy --only firestore:indexes');
      const snapshot = await baseQuery.get();
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return inMemorySort(docs);
    }
    throw e;
  }
};

const sortByDateDesc = (docs) =>
  docs.sort((a, b) => {
    const toMs = (v) => v?.toDate ? v.toDate().getTime() : new Date(v || 0).getTime();
    return toMs(b.createdAt) - toMs(a.createdAt);
  });

const normaliseText = (value) => String(value ?? '').trim().toLowerCase();
const normalisePropertyType = (value) => {
  const type = normaliseText(value);
  const aliases = {
    apartments: 'apartment',
    villas: 'villa',
    penthouses: 'penthouse',
    commercials: 'commercial',
    plots: 'plot',
  };
  return aliases[type] || type;
};
const normaliseDeveloper = (value) => normaliseText(value)
  .replace(/\b(developers?|properties|real estate|group|housing|development|company|limited|ltd)\b/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const numericValue = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/,/g, '');
  const parsed = Number(cleaned.replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(parsed)) return 0;
  if (/\b(cr|crore)s?\b/i.test(cleaned)) return parsed * 10000000;
  if (/\b(lac|lakh)s?\b/i.test(cleaned)) return parsed * 100000;
  return Number.isFinite(parsed) ? parsed : 0;
};
const propertyPrice = (property) => numericValue(
  property.priceRangeMin ?? property.totalPrice ?? property.monthlyRent ?? property.price
);

class Property {
  constructor() {
    this.collectionName = 'properties';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const docRef = this.collection.doc();
      const baseSlug = slugifyProperty(data.slug || data.propertyTitle || data.projectName || data.title);
      const existing = await this.getBySlug(baseSlug);
      const slug = existing ? `${baseSlug}-${docRef.id.slice(0, 6).toLowerCase()}` : baseSlug;
      const propertyData = { ...data, slug, createdAt: new Date(), updatedAt: new Date() };
      await docRef.set(propertyData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating property:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error getting property ${id}:`, error);
      throw error;
    }
  }

  async getBySlug(slug) {
    try {
      const snapshot = await this.collection.where('slug', '==', slug).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error getting property slug ${slug}:`, error);
      throw error;
    }
  }

  async getByIdentifier(identifier) {
    const byId = await this.getById(identifier);
    if (byId) return byId;
    const bySlug = await this.getBySlug(identifier);
    if (bySlug) return bySlug;

    // Legacy records may predate the slug field. Keep their title-derived URL
    // working until the record is edited or a data backfill is run.
    const snapshot = await this.collection.get();
    const match = snapshot.docs.find((doc) => {
      const data = doc.data();
      return slugifyProperty(data.propertyTitle || data.projectName || data.title) === identifier;
    });
    return match ? { id: match.id, ...match.data() } : null;
  }

  async getAll(filters = {}) {
    try {
      let base = this.collection;

      if (filters.propertyType)   base = base.where('propertyType',   '==', filters.propertyType);
      if (filters.listingType)    base = base.where('listingType',    '==', filters.listingType);
      if (filters.propertyStatus) base = base.where('propertyStatus', '==', filters.propertyStatus);
      if (filters.city)           base = base.where('city',           '==', filters.city);
      if (filters.locality)       base = base.where('locality',       '==', filters.locality);
      if (filters.activeStatus)   base = base.where('activeStatus',   '==', filters.activeStatus);

      const hasPriceFilter = filters.minPrice !== undefined || filters.maxPrice !== undefined;
      const sorted = !hasPriceFilter && filters.limit
        ? base.orderBy('createdAt', 'desc').limit(parseInt(filters.limit, 10))
        : base.orderBy('createdAt', 'desc');

      let results = await executeQuery(sorted, base, sortByDateDesc);

      if (filters.minPrice !== undefined) {
        const min = parseFloat(filters.minPrice);
        results = results.filter(p => (p.totalPrice || p.monthlyRent || p.price || 0) >= min);
      }
      if (filters.maxPrice !== undefined) {
        const max = parseFloat(filters.maxPrice);
        results = results.filter(p => (p.totalPrice || p.monthlyRent || p.price || 0) <= max);
      }
      if (hasPriceFilter && filters.limit) {
        results = results.slice(0, parseInt(filters.limit, 10));
      }

      return results;
    } catch (error) {
      logger.error('Error getting all properties:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return null;
      const existingData = doc.data();
      const slug = existingData.slug || slugifyProperty(
        data.propertyTitle || existingData.propertyTitle || data.projectName || existingData.projectName
      );
      await docRef.update({ ...data, slug, updatedAt: new Date() });
      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      logger.error(`Error updating property ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return false;
      await docRef.delete();
      return true;
    } catch (error) {
      logger.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  }

  async getByUserId(userId) {
    try {
      const base = this.collection.where('userId', '==', userId);
      const sorted = base.orderBy('createdAt', 'desc');
      return await executeQuery(sorted, base, sortByDateDesc);
    } catch (error) {
      logger.error(`Error getting properties for user ${userId}:`, error);
      throw error;
    }
  }

  // Uses Firestore count() aggregation — 1 read regardless of collection size
  async getCount(filters = {}) {
    try {
      let query = this.collection;

      if (filters.propertyType)   query = query.where('propertyType',   '==', filters.propertyType);
      if (filters.listingType)    query = query.where('listingType',    '==', filters.listingType);
      if (filters.propertyStatus) query = query.where('propertyStatus', '==', filters.propertyStatus);
      if (filters.city)           query = query.where('city',           '==', filters.city);
      if (filters.locality)       query = query.where('locality',       '==', filters.locality);
      if (filters.activeStatus)   query = query.where('activeStatus',   '==', filters.activeStatus);

      const snapshot = await query.count().get();
      return snapshot.data().count;
    } catch (error) {
      logger.error('Error getting property count:', error);
      throw error;
    }
  }

  // Reads from the dedicated cities collection — no property scan needed
  async getCities() {
    try {
      return await cityModel.getNames();
    } catch (error) {
      logger.error('Error getting cities:', error);
      return [];
    }
  }

  // Sorted and limited at DB level; falls back gracefully if index is missing
  async getTrendingProjects(limit = 10) {
    try {
      const base = this.collection.where('activeStatus', '==', 'Yes');
      const sorted = base.orderBy('totalViews', 'desc').limit(limit);

      return await executeQuery(
        sorted,
        base,
        (docs) => docs.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0)).slice(0, limit)
      );
    } catch (error) {
      logger.error('Error getting trending projects:', error);
      throw error;
    }
  }

  async searchByTitle(searchTerm) {
    try {
      const snapshot = await this.collection
        .orderBy('propertyTitle')
        .startAt(searchTerm)
        .endAt(searchTerm + '')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      logger.error('Error searching properties:', error);
      throw error;
    }
  }

  async advancedSearch(filters = {}) {
    try {
      let base = this.collection;

      if (filters.propertyStatus) base = base.where('propertyStatus', '==', filters.propertyStatus);
      if (filters.locality)       base = base.where('locality',       '==', filters.locality);
      if (filters.state)          base = base.where('state',          '==', filters.state);

      const activeStatus = filters.activeStatus !== undefined ? filters.activeStatus : 'Yes';

      const priceSortNeeded = filters.sortBy === 'price_asc' || filters.sortBy === 'price_desc';

      // For default/newest sort push orderBy to Firestore with fallback; price sort stays in memory
      let results;
      if (!priceSortNeeded) {
        results = await executeQuery(
          base.orderBy('createdAt', 'desc'),
          base,
          sortByDateDesc
        );
      } else {
        const snapshot = await base.get();
        results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      // Older records use "yes", true, or omit this field. A strict Firestore
      // equality query made every filter appear empty for those valid records.
      if (normaliseText(activeStatus) === 'yes') {
        results = results.filter(p => {
          const status = normaliseText(p.activeStatus);
          return p.activeStatus === true || !status || status === 'yes' || status === 'active';
        });
      } else if (activeStatus !== undefined && activeStatus !== '') {
        const requestedStatus = normaliseText(activeStatus);
        results = results.filter(p => normaliseText(p.activeStatus) === requestedStatus);
      }

      // Keep type and city matching in memory so legacy plural/case variants
      // still return results (for example "Plots" and "plot").
      if (filters.propertyType) {
        const requestedType = normalisePropertyType(filters.propertyType);
        results = results.filter(p => normalisePropertyType(p.propertyType) === requestedType);
      }
      if (filters.city) {
        const requestedCity = normaliseText(filters.city);
        results = results.filter(p => {
          const propertyCity = normaliseText(p.city);
          return propertyCity === requestedCity || propertyCity.includes(requestedCity);
        });
      }

      // Price filter — in memory until schema has a single normalised price field
      if (filters.minPrice !== undefined) {
        const min = parseFloat(filters.minPrice);
        results = results.filter(p => propertyPrice(p) >= min);
      }
      if (filters.maxPrice !== undefined) {
        const max = parseFloat(filters.maxPrice);
        results = results.filter(p => propertyPrice(p) <= max);
      }

      // Developer / builder — in memory (Firestore has no full-text search)
      if (filters.developer) {
        const dev = normaliseDeveloper(filters.developer) || normaliseText(filters.developer);
        results = results.filter(p =>
          normaliseDeveloper(p.builderName).includes(dev) ||
          normaliseDeveloper(p.projectName).includes(dev) ||
          normaliseDeveloper(p.seller?.companyName).includes(dev) ||
          normaliseDeveloper(p.seller?.sellerName).includes(dev)
        );
      }

      // Text search — in memory
      if (filters.searchText) {
        const term = normaliseText(filters.searchText);
        results = results.filter(p =>
          normaliseText(p.propertyTitle || p.title).includes(term) ||
          normaliseText(p.locality).includes(term) ||
          normaliseText(p.city).includes(term) ||
          normaliseText(p.projectName).includes(term) ||
          normaliseText(p.builderName).includes(term) ||
          normaliseText(p.subType).includes(term) ||
          (Array.isArray(p.subTypes) && p.subTypes.some(value => normaliseText(value).includes(term))) ||
          normaliseText(p.landmark).includes(term)
        );
      }

      // In-memory sort only for price (default sort already handled above)
      if (filters.sortBy === 'price_asc') {
        results.sort((a, b) => propertyPrice(a) - propertyPrice(b));
      } else if (filters.sortBy === 'price_desc') {
        results.sort((a, b) => propertyPrice(b) - propertyPrice(a));
      }

      const page  = parseInt(filters.page,  10) || 1;
      const limit = parseInt(filters.limit, 10) || 20;
      const startIndex = (page - 1) * limit;

      return {
        results:    results.slice(startIndex, startIndex + limit),
        total:      results.length,
        page,
        limit,
        totalPages: Math.ceil(results.length / limit),
      };
    } catch (error) {
      logger.error('Error in advanced search:', error);
      throw error;
    }
  }
}

module.exports = new Property();
