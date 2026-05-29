const { getFirestore } = require('../database');
const logger = require('../logger');
const cityModel = require('./City');

const removeUndefinedValues = (value) => {
  if (Array.isArray(value)) {
    return value.map(item => (item === undefined ? null : removeUndefinedValues(item)));
  }
  if (value && Object.prototype.toString.call(value) === '[object Object]') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefinedValues(item)])
    );
  }
  return value;
};

class Locality {
  constructor() {
    this.collectionName = 'localities';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  // Auto-registers the city in the cities collection so getCities() never needs to scan localities
  async create(data) {
    try {
      const sanitizedData = removeUndefinedValues(data);
      const docRef = await this.collection.add({
        ...sanitizedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const doc = await docRef.get();

      if (sanitizedData.city) {
        cityModel.upsert(sanitizedData.city, sanitizedData.state || null).catch(err =>
          logger.warn(`Could not auto-register city "${sanitizedData.city}":`, err.message)
        );
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating locality:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error getting locality ${id}:`, error);
      throw error;
    }
  }

  async getAll(filters = {}) {
    try {
      let query = this.collection;
      if (filters.city)  query = query.where('city',  '==', filters.city);
      if (filters.state) query = query.where('state', '==', filters.state);

      // Sorted at DB level — requires composite index on (city, name) when city filter is used
      query = query.orderBy('name');

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      logger.error('Error getting all localities:', error);
      throw error;
    }
  }

  // Reads from the dedicated cities collection — no locality scan needed
  async getCities() {
    try {
      return await cityModel.getNames();
    } catch (error) {
      logger.error('Error getting cities from localities:', error);
      return [];
    }
  }

  async update(id, data) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return null;
      const sanitizedData = removeUndefinedValues(data);
      await docRef.update({ ...sanitizedData, updatedAt: new Date() });
      const updated = await docRef.get();
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      logger.error(`Error updating locality ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      logger.error(`Error deleting locality ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new Locality();
