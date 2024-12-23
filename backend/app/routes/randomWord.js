const express = require('express');
const {getRandomWords} = require('../controllers/randomWord');
const router = express.Router();
const {authRequired} = require('../validations/validateToken')

router.get('/', [authRequired], getRandomWords);

module.exports = router;