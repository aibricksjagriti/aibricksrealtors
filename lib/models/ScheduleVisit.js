/**
 * Schedule Visit Model
 * Handles all Firestore operations for property visit scheduling
 */
const { getFirestore } = require('../database');
const logger = require('../logger');

class ScheduleVisit {
  constructor() {
    this.collectionName = 'scheduleVisits';
    this.db = getFirestore();
    this.collection = this.db.collection(this.collectionName);
  }

  async create(data) {
    try {
      const visitDate = data.date || data.preferredDate;
      const visitData = {
        propertyId: data.propertyId || null,
        propertyTitle: data.propertyTitle || null,
        name: data.name,
        phone: data.phone || data.phoneNumber,
        email: data.email || null,
        preferredDate: visitDate instanceof Date ? visitDate : new Date(visitDate),
        preferredTime: data.time || data.preferredTime || null,
        message: data.message || null,
        status: data.status || 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await this.collection.add(visitData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('Error creating schedule visit:', error);
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
      logger.error(`Error getting schedule visit ${id}:`, error);
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
      const visits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return visits;
    } catch (error) {
      logger.error('Error getting all schedule visits:', error);
      throw error;
    }
  }

  async getByPropertyId(propertyId) {
    try {
      const snapshot = await this.collection
        .where('propertyId', '==', propertyId)
        .get();
      
      const visits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return visits.sort((a, b) => {
        const dateA = a.preferredDate?.toDate ? a.preferredDate.toDate() : new Date(a.preferredDate || 0);
        const dateB = b.preferredDate?.toDate ? b.preferredDate.toDate() : new Date(b.preferredDate || 0);
        return dateB - dateA;
      });
    } catch (error) {
      logger.error(`Error getting visits for property ${propertyId}:`, error);
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
      logger.error(`Error deleting schedule visit ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new ScheduleVisit();

