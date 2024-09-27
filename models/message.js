/* eslint-disable no-invalid-this */
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

import * as config from '../config.js';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    apiId: {
      type: String,
      required: true,
      unique: true
    },
    author: {
      type: String,
      match: /\S+/u,
      minlength: 2,
      maxlength: 25,
      required: true
    },
    contents: {
      type: String,
      match: /\S+/u,
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
  },
  {
    timestamps: true
  }
);

messageSchema.pre('validate', setApiId);
messageSchema.post('save', removeOldMessages);
messageSchema.set('toJSON', { transform });

export default mongoose.model('Message', messageSchema);

async function removeOldMessages() {
  const firstOutdatedMessage = await this.constructor
    .findOne()
    .sort('-createdAt')
    .skip(config.maxMessages)
    .exec();
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

function transform(doc, { _id, __v, apiId, ...rest }) {
  return {
    ...rest,
    id: doc.apiId
  };
}
