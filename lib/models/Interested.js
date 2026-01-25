/**
 * Interested Model
 * Handles all Firestore operations for "I am interested" form submissions
 */
const { getFirestore } = require('../database');
const logger = require('../logger');

class Interested {
  constructor() {
    this.collectionName = 'interested';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const interestedData = {
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || data.phoneNumber || null,
        propertyId: data.propertyId || null,
        propertyTitle: data.propertyTitle || data.propertyName || null,
        propertyName: data.propertyName || data.propertyTitle || null,
        propertyLocation: data.propertyLocation || data.location || null,
        message: data.message || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await this.collection.add(interestedData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating interested submission:', error);
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
      logger.error(`Error getting interested submission ${id}:`, error);
      throw error;
    }
  }

  async getAll(limit = 50, startAfter = null) {
    try {
      let query = this.collection.orderBy('createdAt', 'desc').limit(limit);
      
      if (startAfter) {
        const startAfterDoc = await this.collection.doc(startAfter).get();
        query = query.startAfter(startAfterDoc);
      }
      
      const snapshot = await query.get();
      const submissions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return submissions;
    } catch (error) {
      logger.error('Error getting all interested submissions:', error);
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
      logger.error(`Error deleting interested submission ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new Interested();

