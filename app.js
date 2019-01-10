const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const stylus = require('stylus');

const config = require('./config');
const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');

mongoose.set('debug', true);

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

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
  await mongoose.connect(config.databaseUrl, { useNewUrlParser: true });
};

module.exports = app;
