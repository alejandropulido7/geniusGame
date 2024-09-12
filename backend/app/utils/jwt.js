const jwt = require('jsonwebtoken')
require("dotenv").config();
const secretKey = process.env.SECRETKEY;

const createAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            secretKey,
            {
                expiresIn: "1d"
            },
            (err, token) => {
                if(err) reject(err);
                resolve(token)            
            }
        )
    })    
}

const validToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, user) => {
            if(err) reject({id:''});
            resolve(user);
        });
    })
    
}

module.exports = {createAccessToken, validToken}
