const express = require('express');
const {getQuestionTrivia} = require('../controllers/trivia');
const router = express.Router();

router.get('/', getQuestionTrivia);

module.exports = router;