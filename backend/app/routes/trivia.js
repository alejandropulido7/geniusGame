const express = require('express');
const {getQuestionTrivia} = require('../controllers/trivia');
const router = express.Router();
const {authRequired} = require('../validations/validateToken')

router.get('/', [authRequired], getQuestionTrivia);

module.exports = router;