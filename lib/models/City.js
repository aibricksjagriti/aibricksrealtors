const { getFirestore } = require('../database');
const logger = require('../logger');

class City {
  constructor() {
    this.collectionName = 'cities';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async getAll() {
    try {
      const snapshot = await this.collection.orderBy('name').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      logger.error('Error getting cities:', error);
      throw error;
    }
  }

  async getNames() {
    try {
      const snapshot = await this.collection.orderBy('name').select('name').get();
      return snapshot.docs.map(doc => doc.data().name);
    } catch (error) {
      logger.error('Error getting city names:', error);
      throw error;
    }
  }

  // Idempotent — called automatically when a locality is created with a new city
  async upsert(cityName, state = null) {
    if (!cityName?.trim()) return null;
    try {
      const slug = cityName.trim().toLowerCase().replace(/\s+/g, '-');
      const snapshot = await this.collection.where('slug', '==', slug).limit(1).get();
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      const docRef = await this.collection.add({
        name: cityName.trim(),
        slug,
        state: state || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error upserting city "${cityName}":`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const slug = data.slug || data.name.trim().toLowerCase().replace(/\s+/g, '-');
      const docRef = await this.collection.add({
        name: data.name.trim(),
        slug,
        state: data.state || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating city:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      await this.collection.doc(id).update({ ...data, updatedAt: new Date() });
      const doc = await this.collection.doc(id).get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error updating city ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      logger.error(`Error deleting city ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new City();
