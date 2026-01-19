/**
 * Configuration
 * Loads environment variables and exports config
 */

// Load environment variables - try .env.local first, then .env
const fs = require('fs');
const path = require('path');

// Try to load .env.local first, then .env
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: '.env.local' });
} else if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: '.env' });
} else {
  // Try default dotenv behavior
  require('dotenv').config();
}

const env = process.env.NODE_ENV || 'development';

// Helper to resolve key file path - checks multiple locations
const resolveKeyFile = (keyFile) => {
  if (!keyFile) {
    // If no key file specified, check for default location
    const defaultKeyFile = path.join(process.cwd(), 'ai-bricks-484018-faf4b394daad.json');
    if (fs.existsSync(defaultKeyFile)) {
      return defaultKeyFile;
    }
    return undefined;
  }
  
  // If it's an absolute path, use it as is
  if (path.isAbsolute(keyFile)) {
    return fs.existsSync(keyFile) ? keyFile : undefined;
  }
  
  // Try to resolve relative paths
  const possiblePaths = [
    path.resolve(process.cwd(), keyFile), // Relative to project root
    path.join(process.cwd(), keyFile), // In project root
    path.join(process.cwd(), '..', keyFile), // In parent directory (backend folder)
    path.join(process.cwd(), '..', 'backend', keyFile), // In backend folder
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }
  
  // If not found, return undefined (will use default credentials)
  return undefined;
};

module.exports = {
  env: env,
  port: parseInt(process.env.PORT, 10) || 3000,
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100 // limit each IP to 100 requests per windowMs
  },
  
  // Firestore configuration
  firestore: {
    projectId: process.env.GCP_PROJECT_ID,
    databaseId: process.env.GCP_DATABASE_ID || '(default)',
    keyFilename: resolveKeyFile(process.env.GCP_KEY_FILE),
    credentials: process.env.GCP_CREDENTIALS ? JSON.parse(process.env.GCP_CREDENTIALS) : undefined
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  }
};
