const express = require('express');
const createError = require('http-errors');

const Message = require('../../models/message');
const { version } = require('../../package.json');
const { route } = require('../utils');

const loadMessageById = route(async (req, res, next) => {

  req.message = await Message.findOne({ apiId: req.params.id }).exec();
  if (!req.message) {
    return next(createError(404));
  }

  next();
});

const router = express.Router();

// POST /api/messages
router.post('/', route(async (req, res) => {

  const message = new Message(req.body);
  await message.save();

  req.app.get('io').emit('message:created', message.toJSON());

  res.status(201).send(message);
}));

// GET /api/messages
router.get('/', route(async (req, res) => {
  res.send(await Message.find().limit(100).sort('-createdAt').exec());
}));

// DELETE /api/messages/:id
router.delete('/:id', loadMessageById, route(async (req, res) => {
  await req.message.remove();
  req.app.get('io').emit('message:removed', req.message.toJSON());
  res.sendStatus(204);
}));

module.exports = router;
