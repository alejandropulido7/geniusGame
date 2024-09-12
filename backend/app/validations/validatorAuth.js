const {validationResult, body} = require('express-validator');

const validatorAuthRegister = [
    body('username').exists().notEmpty(),
    body('email').exists().notEmpty().isEmail(),
    body('password').exists().notEmpty(),
    (req, res, next) => {
        try {
            validationResult(req).throw();
            return next();
        } catch (err){
            res.status(403);
            res.send({errors: err.array()});
        }
    }
];

const validatorAuthLogin = [
    body('email').exists().notEmpty().isEmail(),
    body('password').exists().notEmpty(),
    (req, res, next) => {
        try {
            validationResult(req).throw();
            return next();
        } catch (err){
            res.status(403);
            res.send({errors: err.array()});
        }
    }
];

module.exports = {validatorAuthRegister, validatorAuthLogin};