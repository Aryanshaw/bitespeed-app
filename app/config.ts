import dotenv from 'dotenv';

dotenv.config();


export const {
  LOG_LEVEL,
  NODE_ENV = 'production',
  LOG_DIR = './logs',
  PORT,
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_DIALECT,
 
} = process.env;
