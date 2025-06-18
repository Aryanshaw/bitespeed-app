import dotenv from 'dotenv';

dotenv.config();


export const PORT: number = parseInt(process.env.PORT || '3000');

export const {
  LOG_LEVEL,
  NODE_ENV = 'production',
  LOG_DIR = './logs',
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_DIALECT,
 
} = process.env;
