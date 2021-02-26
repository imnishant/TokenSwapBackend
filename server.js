import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';

import Logger from './app/Helpers/Logger';
import Routes from './routes/routes';
import { createFoldersIfDoesntExist } from './app/Helpers/Common';

// MongoDB Config
import models, { connectDb } from './Config/Databse/Models';

require('dotenv').config();

connectDb();
const app = express();

// security middleware
createFoldersIfDoesntExist();
app.use(helmet());

// maximum request size limit middleware
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// custom model initilization middelware
app.use((req, res, next) => {
  req.context = {
    models,
  };
  next();
});

app.use('/api/health/', Routes.HealthApi);
app.use('/api/verify/', Routes.VerifyApi);
app.use('/api/transaction', Routes.TransactionApi);
app.use('/api/user', Routes.UserApi);

/**
 * uncaught exception handling
 */
process.on('uncaughtException', (reason) => {
  Logger.error('uncaughtException', new Error(reason));
});

// initalizing global required services and creating server
app.listen(process.env.SERVICE_PORT, () => {
  Logger.info(
    `Server started successfully on port ${process.env.SERVICE_PORT}`,
  );
});
