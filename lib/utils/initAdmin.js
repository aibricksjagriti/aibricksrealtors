/**
 * Initialize Default Admin User
 * Creates admin user if it doesn't exist
 */
const bcrypt = require('bcryptjs');
const userModel = require('../models/User');
const logger = require('../logger');

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';
const ADMIN_NAME = 'Admin';

/**
 * Initialize admin user
 */
const initAdmin = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await userModel.getByEmail(ADMIN_EMAIL);
    
    if (existingAdmin) {
      logger.info('✅ Admin user already exists');
      return { exists: true, user: existingAdmin };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const adminData = {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      isActive: true
    };

    const admin = await userModel.create(adminData);

    // Remove password from response
    delete admin.password;

    logger.info('✅ Default admin user created successfully');
    logger.info(`   Email: ${ADMIN_EMAIL}`);
    logger.info(`   Password: ${ADMIN_PASSWORD}`);
    logger.info(`   Role: admin`);

    return { exists: false, created: true, user: admin };
  } catch (error) {
    logger.error('❌ Error initializing admin user:', error);
    throw error;
  }
};

module.exports = {
  initAdmin
};

