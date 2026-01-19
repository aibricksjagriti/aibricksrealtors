/**
 * Firestore Database Configuration
 * Initializes and exports Firestore instance
 */

const { Firestore } = require('@google-cloud/firestore');
const config = require('./config');
const logger = require('./logger');
const path = require('path');
const fs = require('fs');

let firestore = null;

/**
 * Initialize Firestore connection
 */
const initializeFirestore = async () => {
  try {
    const firestoreConfig = {};

    // Set project ID
    if (config.firestore.projectId) {
      firestoreConfig.projectId = config.firestore.projectId;
      logger.info(`📋 Using GCP Project ID: ${config.firestore.projectId}`);
    } else {
      throw new Error('GCP_PROJECT_ID is not set in environment variables');
    }

    // Use key file if provided
    if (config.firestore.keyFilename) {
      // Resolve absolute path
      const keyPath = path.isAbsolute(config.firestore.keyFilename) 
        ? config.firestore.keyFilename 
        : path.resolve(process.cwd(), config.firestore.keyFilename);
      
      if (fs.existsSync(keyPath)) {
        firestoreConfig.keyFilename = keyPath;
        logger.info(`🔑 Using key file: ${keyPath}`);
      } else {
        logger.warn(`⚠️  Key file not found at: ${keyPath}`);
        logger.warn('   Will try to use default application credentials');
      }
    }

    // Use credentials JSON if provided
    if (config.firestore.credentials) {
      firestoreConfig.credentials = config.firestore.credentials;
      logger.info('🔑 Using credentials from environment variable');
    }

    // If neither key file nor credentials are provided, Firestore will use default credentials
    if (!config.firestore.keyFilename && !config.firestore.credentials) {
      logger.warn('⚠️  No key file or credentials provided. Using default application credentials.');
    }

    // Set database ID if specified
    if (config.firestore.databaseId && config.firestore.databaseId !== '(default)') {
      firestoreConfig.databaseId = config.firestore.databaseId;
      logger.info(`📊 Using Database ID: ${config.firestore.databaseId}`);
    }

    // Initialize Firestore
    firestore = new Firestore(firestoreConfig);

    // Test the connection
    try {
      const collections = await firestore.listCollections();
      logger.info(`✅ Firestore connected successfully. Found ${collections.length} collections.`);
    } catch (testError) {
      if (testError.code === 5) {
        logger.error('❌ Firestore database NOT_FOUND error.');
        throw new Error('Firestore database not found. Please create a Native mode Firestore database in your GCP project.');
      }
      throw testError;
    }

    return firestore;
  } catch (error) {
    logger.error('❌ Firestore connection error:', error.message);
    throw error;
  }
};

/**
 * Get Firestore instance
 */
const getFirestore = () => {
  if (!firestore) {
    const firestoreConfig = {};
    if (config.firestore.projectId) {
      firestoreConfig.projectId = config.firestore.projectId;
    }
    if (config.firestore.databaseId && config.firestore.databaseId !== '(default)') {
      firestoreConfig.databaseId = config.firestore.databaseId;
    }
    if (config.firestore.keyFilename) {
      const keyPath = path.isAbsolute(config.firestore.keyFilename) 
        ? config.firestore.keyFilename 
        : path.resolve(process.cwd(), config.firestore.keyFilename);
      if (fs.existsSync(keyPath)) {
        firestoreConfig.keyFilename = keyPath;
      }
    }
    if (config.firestore.credentials) {
      firestoreConfig.credentials = config.firestore.credentials;
    }
    firestore = new Firestore(firestoreConfig);
  }
  return firestore;
};

/**
 * Close Firestore connection
 */
const closeFirestore = async () => {
  if (firestore) {
    await firestore.terminate();
    firestore = null;
    logger.info('Firestore connection closed');
  }
};

module.exports = {
  getFirestore,
  initializeFirestore,
  closeFirestore
};
