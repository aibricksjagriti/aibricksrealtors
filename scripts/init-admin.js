/**
 * Initialize Admin User Script
 * Run this script to create the default admin user
 * Usage: node scripts/init-admin.js
 */

const path = require('path');

// Load environment variables - try multiple locations
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');

if (require('fs').existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
} else if (require('fs').existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

const { initializeFirestore } = require('../lib/database');
const { initAdmin } = require('../lib/utils/initAdmin');

(async () => {
  try {
    console.log('🚀 Initializing admin user...');
    console.log('📋 Current working directory:', process.cwd());
    console.log('📋 Script directory:', __dirname);
    
    // Check environment variables
    if (!process.env.GCP_PROJECT_ID) {
      console.error('❌ GCP_PROJECT_ID is not set in environment variables');
      console.error('   Please create a .env.local file with:');
      console.error('   GCP_PROJECT_ID=your-project-id');
      console.error('   GOOGLE_SERVICE_ACCOUNT_JSON=\'{ ...service account JSON... }\'');
      console.error('   JWT_SECRET=your-secret-key');
      process.exit(1);
    }
    
    // Initialize Firestore
    console.log('📡 Connecting to Firestore...');
    await initializeFirestore();
    
    // Initialize admin
    console.log('👤 Creating admin user...');
    const result = await initAdmin();
    
    if (result.exists) {
      console.log('✅ Admin user already exists');
      console.log(`   Email: ${result.user.email}`);
      console.log(`   Role: ${result.user.role}`);
    } else {
      console.log('✅ Admin user created successfully');
      console.log('   Email: admin@gmail.com');
      console.log('   Password: admin@123');
      console.log('   Role: admin');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
})();
