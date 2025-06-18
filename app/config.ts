import dotenv from 'dotenv';

dotenv.config();


export const {
  LOG_LEVEL,
  NODE_ENV = 'production',
  LOG_DIR = './logs',
  PORT,
  DATABASE_URL
 
} = process.env;
