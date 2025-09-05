import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const ENV = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  API_VERSION: process.env.API_VERSION || 'v1',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/yieldmax',
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/yieldmax_test',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_EXPIRES: parseInt(process.env.JWT_COOKIE_EXPIRES || '7'),

  // External API Keys
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',
  DEFILLAMA_API_URL: process.env.DEFILLAMA_API_URL || 'https://api.llama.fi',
  COINBASE_API_KEY: process.env.COINBASE_API_KEY || '',
  COINBASE_API_SECRET: process.env.COINBASE_API_SECRET || '',

  // Blockchain Configuration
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID || '',
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || '',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || './logs/app.log',

  // Security
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
  
  // CORS Origins
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001'
  ]
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  if (ENV.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export default ENV;
