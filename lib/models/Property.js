const { getFirestore } = require('../database');
const logger = require('../logger');
const cityModel = require('./City');

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

class Property {
  constructor() {
    this.collectionName = 'properties';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const propertyData = { ...data, createdAt: new Date(), updatedAt: new Date() };
      const docRef = await this.collection.add(propertyData);
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
      await docRef.update({ ...data, updatedAt: new Date() });
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

      if (filters.propertyType)   base = base.where('propertyType',   '==', filters.propertyType);
      if (filters.propertyStatus) base = base.where('propertyStatus', '==', filters.propertyStatus);
      if (filters.city)           base = base.where('city',           '==', filters.city);
      if (filters.locality)       base = base.where('locality',       '==', filters.locality);
      if (filters.state)          base = base.where('state',          '==', filters.state);

      const activeStatus = filters.activeStatus !== undefined ? filters.activeStatus : 'Yes';
      base = base.where('activeStatus', '==', activeStatus);

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

      // Price filter — in memory until schema has a single normalised price field
      if (filters.minPrice !== undefined) {
        const min = parseFloat(filters.minPrice);
        results = results.filter(p => (p.totalPrice || p.monthlyRent || 0) >= min);
      }
      if (filters.maxPrice !== undefined) {
        const max = parseFloat(filters.maxPrice);
        results = results.filter(p => (p.totalPrice || p.monthlyRent || 0) <= max);
      }

      // Developer / builder — in memory (Firestore has no full-text search)
      if (filters.developer) {
        const dev = filters.developer.toLowerCase();
        results = results.filter(p =>
          (p.builderName || '').toLowerCase().includes(dev) ||
          (p.projectName || '').toLowerCase().includes(dev) ||
          (p.seller?.companyName || '').toLowerCase().includes(dev) ||
          (p.seller?.sellerName  || '').toLowerCase().includes(dev)
        );
      }

      // Text search — in memory
      if (filters.searchText) {
        const term = filters.searchText.toLowerCase();
        results = results.filter(p =>
          (p.propertyTitle || p.title || '').toLowerCase().includes(term) ||
          (p.locality      || '').toLowerCase().includes(term) ||
          (p.city          || '').toLowerCase().includes(term) ||
          (p.projectName   || '').toLowerCase().includes(term) ||
          (p.builderName   || '').toLowerCase().includes(term) ||
          (p.subType       || '').toLowerCase().includes(term) ||
          (p.landmark      || '').toLowerCase().includes(term)
        );
      }

      // In-memory sort only for price (default sort already handled above)
      if (filters.sortBy === 'price_asc') {
        results.sort((a, b) => (a.totalPrice || a.monthlyRent || 0) - (b.totalPrice || b.monthlyRent || 0));
      } else if (filters.sortBy === 'price_desc') {
        results.sort((a, b) => (b.totalPrice || b.monthlyRent || 0) - (a.totalPrice || a.monthlyRent || 0));
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
