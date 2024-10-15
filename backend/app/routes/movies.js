const express = require('express');
const {getRandomMovie} = require('../controllers/movies');
const router = express.Router();

router.get('/random', getRandomMovie);

module.exports = router;