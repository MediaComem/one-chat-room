import express from 'express';
import createError from 'http-errors';

import { version } from '../../config.js';
import messagesRouter from './messages.js';

const router = express.Router();

// GET /api
router.get('/', (req, res) => res.send({ version }));

// /messages
router.use('/messages', messagesRouter);

// Catch 404 and forward to error handler
router.use((req, res, next) => next(createError(404)));

// Error handler
router.use((err, req, res, next) => {
  const body = {
    message: getErrorMessage(err)
  };

  if (err.errors) {
    body.errors = err.errors;
  }

  res
    .set(err.headers || {})
    .status(getErrorStatus(err))
    .send(body);
});

export default router;

function getErrorMessage(err) {
  if (err.name === 'ValidationError') {
    return 'Data is invalid';
  } else if (err.expose) {
    return err.message;
  } else {
    return 'An unexpected error occurred';
  }
}

function getErrorStatus(err) {
  if (err.name === 'ValidationError') {
    return 422;
  } else if (err.status) {
    return err.status;
  } else {
    return 500;
  }
}
