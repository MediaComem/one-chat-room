import express from 'express';
import createError from 'http-errors';

import Message from '../../models/message.js';
import { route } from '../utils.js';

const loadMessageById = route(async (req, res, next) => {
  // eslint-disable-next-line require-atomic-updates
  req.message = await Message.findOne({ apiId: req.params.id }).exec();
  if (!req.message) {
    next(createError(404));
    return;
  }

  next();
});

const router = express.Router();

// POST /api/messages
router.post(
  '/',
  route(async (req, res) => {
    const message = new Message(req.body);
    await message.save();

    req.app.get('io').emit('message:created', message.toJSON());

    res.status(201).send(message);
  })
);

// GET /api/messages
router.get(
  '/',
  route(async (req, res) => {
    res.send(await Message.find().limit(100).sort('-createdAt').exec());
  })
);

// DELETE /api/messages/:id
router.delete(
  '/:id',
  loadMessageById,
  route(async (req, res) => {
    await Message.deleteOne({ _id: req.message._id });
    req.app.get('io').emit('message:removed', req.message.toJSON());
    res.sendStatus(204);
  })
);

export default router;
