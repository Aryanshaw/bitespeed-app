import express from 'express';
import cors from 'cors';
import logger from './loaders/logger';
import { NODE_ENV, PORT } from './config';
import baseRouter from './routes/base_route';
import 'module-alias/register';

const app = express();

app.use(express.json());
app.use(cors());


export async function init() {
  try {
    console.log("starting the server")
    logger.info(`init in ${NODE_ENV} env`);

    // await initDB();
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
  app.get(`/health`, (req, res) => {
    res.send('OK');
  });

  //define your routes here
  app.use(`/`, baseRouter);
}

init();
