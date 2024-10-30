const express = require('express');
const {getRandomMovie} = require('../controllers/openapi');
const router = express.Router();
const {authRequired} = require('../validations/validateToken')

router.get('/movie', [authRequired], getRandomMovie);

module.exports = router;