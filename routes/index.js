import express from 'express';

import { baseUrl, maxMessageLength } from '../config.js';

const router = express.Router();

// GET /
router.get('/', (req, res) => res.render('index', { baseUrl, maxMessageLength }));

export default router;
