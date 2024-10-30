const express = require('express');
const {getRandomMovie} = require('../controllers/movies');
const router = express.Router();
const {authRequired} = require('../validations/validateToken')

router.get('/random', getRandomMovie);

module.exports = router;