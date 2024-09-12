const express = require('express');
const router = express.Router();
const {register, login, loginPlayer, validateUserToken, validateSessionToken} = require('../controllers/auth');
const {validatorAuthLogin, validatorAuthRegister} = require('../validations/validatorAuth');

router.post('/register', validatorAuthRegister, register);
router.post('/login', validatorAuthLogin, login);
router.post('/login-player', loginPlayer);
router.get('/validateUserToken/:token', validateUserToken);
router.get('/validateSessionToken/:token', validateSessionToken);

module.exports = router; 