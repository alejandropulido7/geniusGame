const express = require('express');
const {getToken, getArtist, getSong} = require('../controllers/spotify');
const router = express.Router();
const {authRequired} = require('../validations/validateToken')

// router.get('/getToken', [authRequired], getToken);
// router.get('/getArtists', [authRequired], getArtist);
// router.get('/getSongs', [authRequired], getSong);

router.get('/getToken', getToken);
router.get('/getArtists', getArtist); 
router.get('/getSongs', getSong);

module.exports = router;