const User = require('../models/user')
const bcrypt = require('bcryptjs')
const {createAccessToken, validToken} = require('../utils/jwt');
const Session = require('../models/session');
const {generateUUID} = require('../utils/shared')

const register = async (req, res) => {
    const {email, password, username, name} = req.body;
    try {
        const userFound = await User.findOne({where: {email}});
        if(userFound) res.status(400).json(['The email already registered']);
        
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: passwordHash,
            username,
            name
        });
        if(!newUser) res.status(400).json(['It couldnt create a new user']);
        
        const token = await createAccessToken({
            id: newUser.id,
            username: newUser.username
        });            
        res.cookie('token', token);
        res.status(200).send({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token
        });    
    } catch (error) {
        res.status(500).json({error});
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;
    try {

        const userFound = await User.findOne({where: {email}});
        if(!userFound) return res.status(400).json({message: "User not found"});

        const passwordIsValid = await bcrypt.compare(password, userFound.password);
        if(!passwordIsValid) return res.status(400).json({message: "Incorrect password"});
        
        const token = await createAccessToken({
            idUser: userFound.id,
            email: userFound.email
        });
        res.cookie('token', token);            
        res.send({
            id: userFound.id,
            username: userFound.username,
            email: userFound.email,
            token
        });    
    } catch (error) {
        res.status(500).json({ error });
    }
}

const loginPlayer = async (req, res) => {
    const {idRoom, tokenAdmin} = req.body;
    try {
        const payload = await validToken(tokenAdmin);
        if(!payload) return res.status(400).json({message: "Token del administrador no valido"});

        const sessionActive = await Session.findOne({
            where: {
                id_user: payload.id,
                id: idRoom
            }
        });

        if(!sessionActive) return res.status(400).json({message: "Room no ha sido creada"});
        
        const idPlayer = generateUUID(10);

        const token = await createAccessToken({
            idPlayer,
            idRoom
        });
        res.cookie('token', token);            
        res.send({
            idPlayer,
            token
        });    
    } catch (error) {
        res.status(500).json({ error });
    }
}

const logout = async (req, res) => {
    res.cookie("token", "", {expires: new Date(0)});
    res.sendStatus(200);
}

const validateUserToken = async (req, res) => {
    try {
        const payload =  await validToken(req.params.token);
        if(payload.idUser == '') return res.status(400).json({message: "Token not valid"});
        const userFound = await User.findByPk(payload.idUser);
        if(!userFound) return res.status(400).json({message: "User not found"});
        res.send({
            username: userFound.username,
            email: userFound.email,
        });
    } catch (err) {
        res.status(403).json({error: "Error validando token: "+err});
    }
}

const validateSessionToken = async (req, res) => {
    try {
        const payload =  await validToken(req.params.token);
        if(payload.idRoom == '') return res.status(400).json({message: "Token not valid"});
        const roomFound = await Session.findByPk(payload.idRoom);
        if(!roomFound) return res.status(400).json({message: "Room not found"});
        res.send({
            idRoom: roomFound.id,
            idHost: roomFound.idHost,
            idUser: roomFound.id_user
        });
    } catch (err) {
        res.status(403).json({error: "Error validando token: "+err});
    }
}

const validatePlayerToken = async (req, res) => {
    try {
        const payload =  await validToken(req.params.token);
        if(payload.idRoom == '') return res.status(400).json({error: "Token not valid"});
        const roomFound = await Session.findByPk(payload.idRoom);
        if(!roomFound) return res.status(400).json({error: "Room not found"});
        res.send({
            idRoom: roomFound.id,
            idHost: roomFound.idHost,
            idUser: roomFound.id_user
        });
    } catch (err) {
        res.status(403).json({error: "Error validando token: "+err});
    }
    
}

module.exports = {
    register, 
    login, 
    logout, 
    validateUserToken, 
    validateSessionToken,
    validatePlayerToken,
    loginPlayer}