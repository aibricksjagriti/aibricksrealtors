/**
 * Call Request Model
 * Handles all Firestore operations for call back requests
 */
const { getFirestore } = require('../database');
const logger = require('../logger');

class CallRequest {
  constructor() {
    this.collectionName = 'callRequests';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const requestData = {
        phoneNumber: data.phoneNumber,
        propertyId: data.propertyId || null,
        propertyTitle: data.propertyTitle || null,
        status: 'pending', // pending, called
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await this.collection.add(requestData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating call request:', error);
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
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return requests;
    } catch (error) {
      logger.error('Error getting all call requests:', error);
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      const docRef = this.collection.doc(id);
      await docRef.update({
        status,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      logger.error(`Error updating call request ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new CallRequest();
