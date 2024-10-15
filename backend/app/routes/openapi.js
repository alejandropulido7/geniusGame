const express = require('express');
const {getRandomMovie} = require('../controllers/openapi');
const router = express.Router();

router.get('/movie', getRandomMovie);

module.exports = router;