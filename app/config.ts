import dotenv from 'dotenv';

dotenv.config();

const {
  LOG_LEVEL,
  NODE_ENV = 'production',
  LOG_DIR = './logs',
  DATABASE_NAME,
  DATABASE_USER_NAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT
 
} = process.env;

const PORT = parseInt(process.env.PORT);

export { 
  LOG_LEVEL,
  PORT,
  NODE_ENV, 
  LOG_DIR, 
  DATABASE_NAME,
  DATABASE_USER_NAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT
};