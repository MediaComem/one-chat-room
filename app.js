import express from 'express';
import createError from 'http-errors';
import mongoose from 'mongoose';
import logger from 'morgan';
import path from 'path';
import stylus from 'stylus';

import * as config from './config.js';
import apiRouter from './routes/api/index.js';
import indexRouter from './routes/index.js';

mongoose.set('debug', true);

const app = express();

// View engine setup
app.set('views', path.join(config.root, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(stylus.middleware(path.join(config.root, 'public')));
app.use(express.static(path.join(config.root, 'public')));

// Routes
app.use('/api', apiRouter);
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.start = async () => {
  await mongoose.connect(config.databaseUrl);
};

export default app;
