/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/User');
const logger = require('../logger');

/**
 * Protect routes - requires authentication
 */
const protect = async (req) => {
  try {
    let token;

    // Next.js API routes use Headers object, not plain object
    // Check for token in Authorization header
    const authHeader = req.headers.get ? req.headers.get('authorization') : req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return {
        error: {
          success: false,
          error: 'Not authorized to access this route. Please provide a token.',
          statusCode: 401
        }
      };
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Get user from token
      const user = await userModel.getById(decoded.id);
      
      if (!user) {
        return {
          error: {
            success: false,
            error: 'User not found',
            statusCode: 401
          }
        };
      }

      // Return user
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user'
        }
      };
    } catch (error) {
      return {
        error: {
          success: false,
          error: 'Invalid or expired token',
          statusCode: 401
        }
      };
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return {
      error: {
        success: false,
        error: 'Authentication error',
        statusCode: 500
      }
    };
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req) => {
  try {
    let token;

    // Next.js API routes use Headers object, not plain object
    const authHeader = req.headers.get ? req.headers.get('authorization') : req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await userModel.getById(decoded.id);
        
        if (user) {
          return {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role || 'user'
            }
          };
        }
      } catch (error) {
        // Ignore token errors for optional auth
      }
    }

    return { user: null };
  } catch (error) {
    return { user: null };
  }
};

module.exports = {
  protect,
  optionalAuth
};

