/**
 * Authorization Middleware
 * Checks if user owns the resource or is admin
 */
const propertyModel = require('../models/Property');
const logger = require('../logger');

/**
 * Check if user owns the property or is admin
 * Admins can edit/delete any property
 */
const authorizeProperty = async (user, propertyId) => {
  try {
    // Get property
    const property = await propertyModel.getById(propertyId);

    if (!property) {
      return {
        error: {
          success: false,
          error: 'Property not found',
          statusCode: 404
        }
      };
    }

    // Admins can edit/delete any property
    if (user.role === 'admin') {
      return { property, authorized: true };
    }

    // Check ownership for non-admin users
    if (property.userId !== user.id) {
      return {
        error: {
          success: false,
          error: 'Not authorized to perform this action. You can only modify your own properties.',
          statusCode: 403
        }
      };
    }

    return { property, authorized: true };
  } catch (error) {
    logger.error('Authorization error:', error);
    return {
      error: {
        success: false,
        error: 'Authorization error',
        statusCode: 500
      }
    };
  }
};

/**
 * Check if user is admin
 */
const authorizeAdmin = (user) => {
  if (!user) {
    return {
      error: {
        success: false,
        error: 'Not authorized. Please login first.',
        statusCode: 401
      }
    };
  }

  if (user.role !== 'admin') {
    return {
      error: {
        success: false,
        error: 'Access denied. Admin privileges required.',
        statusCode: 403
      }
    };
  }

  return { authorized: true };
};

module.exports = {
  authorizeProperty,
  authorizeAdmin
};

