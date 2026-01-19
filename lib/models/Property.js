/**
 * Property Model
 * Handles all Firestore operations for properties
 */
const { getFirestore } = require('../database');
const logger = require('../logger');

class Property {
  constructor() {
    this.collectionName = 'properties';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const propertyData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
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
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error getting property ${id}:`, error);
      throw error;
    }
  }

  async getAll(filters = {}) {
    try {
      let query = this.collection;
      
      if (filters.propertyType) {
        query = query.where('propertyType', '==', filters.propertyType);
      }
      if (filters.listingType) {
        query = query.where('listingType', '==', filters.listingType);
      }
      if (filters.propertyStatus) {
        query = query.where('propertyStatus', '==', filters.propertyStatus);
      }
      if (filters.city) {
        query = query.where('city', '==', filters.city);
      }
      if (filters.locality) {
        query = query.where('locality', '==', filters.locality);
      }
      if (filters.activeStatus) {
        query = query.where('activeStatus', '==', filters.activeStatus);
      }

      const snapshot = await query.get();
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply range filters in memory
      if (filters.minPrice !== undefined) {
        results = results.filter(p => {
          const price = p.totalPrice || p.monthlyRent || p.price || 0;
          return price >= parseFloat(filters.minPrice);
        });
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter(p => {
          const price = p.totalPrice || p.monthlyRent || p.price || 0;
          return price <= parseFloat(filters.maxPrice);
        });
      }

      // Sort by createdAt descending
      results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

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
      
      if (!doc.exists) {
        return null;
      }

      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      await docRef.update(updateData);
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
      
      if (!doc.exists) {
        return false;
      }
      
      await docRef.delete();
      return true;
    } catch (error) {
      logger.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  }

  async getByUserId(userId) {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .get();
      
      const properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return properties.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
    } catch (error) {
      logger.error(`Error getting properties for user ${userId}:`, error);
      throw error;
    }
  }

  async getTrendingProjects(limit = 10) {
    try {
      const snapshot = await this.collection
        .where('activeStatus', '==', 'Yes')
        .get();
      
      const properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const propertiesWithScore = properties.map(property => ({
        ...property,
        trendingScore: property.totalViews || 0
      }));

      return propertiesWithScore
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit);
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
        .endAt(searchTerm + '\uf8ff')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      logger.error('Error searching properties:', error);
      throw error;
    }
  }

  /**
   * Advanced search with multiple filters
   * Supports: propertyType, location, developer, price, handover, and text search
   */
  async advancedSearch(filters = {}) {
    try {
      let query = this.collection;
      
      // Apply equality filters (Firestore queries)
      if (filters.propertyType) {
        query = query.where('propertyType', '==', filters.propertyType);
      }
      if (filters.propertyStatus) {
        query = query.where('propertyStatus', '==', filters.propertyStatus);
      }
      if (filters.city) {
        query = query.where('city', '==', filters.city);
      }
      if (filters.locality) {
        query = query.where('locality', '==', filters.locality);
      }
      if (filters.state) {
        query = query.where('state', '==', filters.state);
      }
      if (filters.activeStatus !== undefined) {
        query = query.where('activeStatus', '==', filters.activeStatus);
      } else {
        // Default to active properties only
        query = query.where('activeStatus', '==', 'Yes');
      }

      // Get all results first
      const snapshot = await query.get();
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply range filters in memory (price)
      if (filters.minPrice !== undefined) {
        results = results.filter(p => {
          const price = p.totalPrice || p.monthlyRent || 0;
          return price >= parseFloat(filters.minPrice);
        });
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter(p => {
          const price = p.totalPrice || p.monthlyRent || 0;
          return price <= parseFloat(filters.maxPrice);
        });
      }

      // Filter by developer/builder (searches builderName field in database)
      // Note: "developer" and "builder" are the same - both refer to builderName
      if (filters.developer) {
        const developerLower = filters.developer.toLowerCase();
        results = results.filter(p => {
          const builderName = (p.builderName || '').toLowerCase();
          const projectName = (p.projectName || '').toLowerCase();
          const sellerCompanyName = (p.seller?.companyName || '').toLowerCase();
          const sellerName = (p.seller?.sellerName || '').toLowerCase();
          return builderName.includes(developerLower) || 
                 projectName.includes(developerLower) ||
                 sellerCompanyName.includes(developerLower) ||
                 sellerName.includes(developerLower);
        });
      }

      // Text search across multiple fields
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        results = results.filter(p => {
          const title = (p.propertyTitle || p.title || '').toLowerCase();
          const locality = (p.locality || '').toLowerCase();
          const city = (p.city || '').toLowerCase();
          const projectName = (p.projectName || '').toLowerCase();
          const builderName = (p.builderName || '').toLowerCase();
          const subType = (p.subType || '').toLowerCase();
          const landmark = (p.landmark || '').toLowerCase();
          
          return title.includes(searchLower) ||
                 locality.includes(searchLower) ||
                 city.includes(searchLower) ||
                 projectName.includes(searchLower) ||
                 builderName.includes(searchLower) ||
                 subType.includes(searchLower) ||
                 landmark.includes(searchLower);
        });
      }

      // Sort by relevance or date
      if (filters.sortBy === 'price_asc') {
        results.sort((a, b) => {
          const priceA = a.totalPrice || a.monthlyRent || 0;
          const priceB = b.totalPrice || b.monthlyRent || 0;
          return priceA - priceB;
        });
      } else if (filters.sortBy === 'price_desc') {
        results.sort((a, b) => {
          const priceA = a.totalPrice || a.monthlyRent || 0;
          const priceB = b.totalPrice || b.monthlyRent || 0;
          return priceB - priceA;
        });
      } else if (filters.sortBy === 'newest') {
        results.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      } else {
        // Default: sort by createdAt descending
        results.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      }

      // Apply pagination
      const page = parseInt(filters.page, 10) || 1;
      const limit = parseInt(filters.limit, 10) || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedResults = results.slice(startIndex, endIndex);

      return {
        results: paginatedResults,
        total: results.length,
        page,
        limit,
        totalPages: Math.ceil(results.length / limit)
      };
    } catch (error) {
      logger.error('Error in advanced search:', error);
      throw error;
    }
  }
}

module.exports = new Property();

