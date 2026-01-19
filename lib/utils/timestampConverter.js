/**
 * Utility to convert Firestore Timestamp objects to ISO strings
 * Handles both Firestore Timestamp objects and serialized JSON timestamps
 */
const convertTimestamps = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestamps(item));
  }
  
  const converted = { ...obj };
  
  // Convert createdAt
  if (converted.createdAt) {
    if (converted.createdAt.toDate && typeof converted.createdAt.toDate === 'function') {
      converted.createdAt = converted.createdAt.toDate().toISOString();
    } else if (converted.createdAt._seconds !== undefined) {
      converted.createdAt = new Date(converted.createdAt._seconds * 1000).toISOString();
    }
  }
  
  // Convert updatedAt
  if (converted.updatedAt) {
    if (converted.updatedAt.toDate && typeof converted.updatedAt.toDate === 'function') {
      converted.updatedAt = converted.updatedAt.toDate().toISOString();
    } else if (converted.updatedAt._seconds !== undefined) {
      converted.updatedAt = new Date(converted.updatedAt._seconds * 1000).toISOString();
    }
  }
  
  // Convert preferredDate (for schedule visits)
  if (converted.preferredDate) {
    if (converted.preferredDate.toDate && typeof converted.preferredDate.toDate === 'function') {
      converted.preferredDate = converted.preferredDate.toDate().toISOString();
    } else if (converted.preferredDate._seconds !== undefined) {
      converted.preferredDate = new Date(converted.preferredDate._seconds * 1000).toISOString();
    }
  }
  
  // Recursively convert nested objects
  Object.keys(converted).forEach(key => {
    if (converted[key] && typeof converted[key] === 'object' && !Array.isArray(converted[key])) {
      // Skip if it's already a Date object or ISO string
      if (!(converted[key] instanceof Date) && typeof converted[key] !== 'string') {
        converted[key] = convertTimestamps(converted[key]);
      }
    }
  });
  
  return converted;
};

module.exports = { convertTimestamps };

