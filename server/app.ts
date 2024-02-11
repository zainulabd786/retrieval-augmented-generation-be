import '../env.js';
import express from 'express';
import type { Request, Response, NextFunction } from 'express'; 
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import cors from 'cors';
import { ensureCollectionsOnInit } from './utils/qdrant';

var app = express();

ensureCollectionsOnInit()
  .then(() => console.log('Collections ensured!'))
  .catch((e) => console.error('Unable to ensure collections', e));

app.use(logger('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', indexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error('Not Found!');
  error.status = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

export default app;
