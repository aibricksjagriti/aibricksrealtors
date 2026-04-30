const { getFirestore } = require('../database');
const logger = require('../logger');

const removeUndefinedValues = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => (item === undefined ? null : removeUndefinedValues(item)));
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

class LocationPage {
  constructor() {
    this.collectionName = 'locationPages';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const sanitizedData = removeUndefinedValues(data);
      const docRef = await this.collection.add({
        ...sanitizedData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating location page:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error getting location page ${id}:`, error);
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
      logger.error(`Error getting location page by slug ${slug}:`, error);
      throw error;
    }
  }

  async getAll() {
    try {
      const snapshot = await this.collection.get();
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return docs.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
    } catch (error) {
      logger.error('Error getting all location pages:', error);
      throw error;
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
      logger.error(`Error updating location page ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      logger.error(`Error deleting location page ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new LocationPage();
