const express = require('express');

const { baseUrl } = require('../config');

const router = express.Router();

// GET /
router.get('/', (req, res) => res.render('index', { baseUrl }));

module.exports = router;
