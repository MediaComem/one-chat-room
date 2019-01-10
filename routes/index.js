const express = require('express');

const { baseUrl, maxMessageLength } = require('../config');

const router = express.Router();

// GET /
router.get('/', (req, res) => res.render('index', { baseUrl, maxMessageLength }));

module.exports = router;
