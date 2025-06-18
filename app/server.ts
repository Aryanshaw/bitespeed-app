import express from 'express';
import cors from 'cors';
import logger from './loaders/logger';
import { NODE_ENV, PORT } from './config';
import 'module-alias/register';
import { initDb } from './loaders/db';
import contactRouter from './routes/contact';
const app = express();

app.use(express.json());
app.use(cors());


export async function init() {
  try {
    console.log("starting the server")
    logger.info(`init in ${NODE_ENV} env`);

    await initDb();
    initRoutes();
    initServer();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

function initServer() {
  app.listen(PORT, () => {
    logger.info(`server is running at http://localhost:${PORT}`);
  });
}

function initRoutes() {
  app.get(`/api/health`, (req, res) => {
    res.send('OK');
  });

  //define routes here
  app.use(`/api`, contactRouter);
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message || err });
    next();
  });
}

init();
