const { omit } = require('lodash');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const config = require('../config');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  apiId: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    match: /[^\s]+/,
    minlength: 2,
    maxlength: 25,
    required: true
  },
  contents: {
    type: String,
    match: /[^\s]+/,
    minlength: 1,
    maxlength: config.maxMessageLength,
    required: true
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

messageSchema.pre('validate', setApiId);
messageSchema.post('save', removeOldMessages);
messageSchema.set('toJSON', { transform });

module.exports = mongoose.model('Message', messageSchema);

async function removeOldMessages() {
  const firstOutdatedMessage = await this.constructor.findOne().sort('-createdAt').skip(config.maxMessages).exec();
  if (firstOutdatedMessage) {
    await this.constructor.remove({
      createdAt: {
        $lte: firstOutdatedMessage.createdAt
      }
    });
  }
}

function setApiId(next) {
  if (this.isNew) {
    this.apiId = uuid();
  }

  next();
}

function transform(doc, json, options) {
  return {
    ...omit(json, '_id', '__v', 'apiId'),
    id: doc.apiId
  };
}
