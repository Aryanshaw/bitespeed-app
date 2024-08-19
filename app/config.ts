import dotenv from 'dotenv';

dotenv.config();

const {
  MONGODB_URI,
  LOG_LEVEL,
  NODE_ENV = 'production',
  LOG_DIR = './logs',
  OPENAI_API_KEY,
  OPENAI_ORG_ID,
} = process.env;

const PORT = parseInt(process.env.PORT);

export { PORT, MONGODB_URI, LOG_LEVEL, NODE_ENV, LOG_DIR, OPENAI_API_KEY, OPENAI_ORG_ID };