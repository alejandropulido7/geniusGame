const {validToken} = require('../utils/jwt')

const authRequired = (req, res, next) => {
    const {token} = req.headers;
    console.log(req.headers)
    if(!token) return res.status(401).json({ message: "No token"});
    
    validToken(token)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            return res.status(403).json({ message: "Invalid token"});
        });
}

module.exports = {authRequired}