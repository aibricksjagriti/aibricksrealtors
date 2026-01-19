/**
 * Contact Model
 * Handles all Firestore operations for contact form submissions
 */
const { getFirestore } = require('../database');
const logger = require('../logger');

class Contact {
  constructor() {
    this.collectionName = 'contacts';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const contactData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await this.collection.add(contactData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating contact:', error);
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
      logger.error(`Error getting contact ${id}:`, error);
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
      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return contacts;
    } catch (error) {
      logger.error('Error getting all contacts:', error);
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
      logger.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new Contact();

