const { getFirestore } = require('../database');
const logger = require('../logger');

class UpcomingProject {
  constructor() {
    this.collection = getFirestore().collection('upcomingProjects');
  }

  async getAll({ activeOnly = false } = {}) {
    try {
      let query = this.collection;
      if (activeOnly) query = query.where('isActive', '==', true);
      const snapshot = await query.get();
      return snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch (error) {
      logger.error('Error getting upcoming projects:', error);
      throw error;
    }
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async create(data) {
    const now = new Date();
    const ref = await this.collection.add({ ...data, createdAt: now, updatedAt: now });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  async update(id, data) {
    const ref = this.collection.doc(id);
    if (!(await ref.get()).exists) return null;
    await ref.update({ ...data, updatedAt: new Date() });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }
}

module.exports = new UpcomingProject();
