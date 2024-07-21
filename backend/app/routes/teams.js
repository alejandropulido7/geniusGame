const express = require('express');
const {createTeam, getTeam, getTeamByName, updatePositionTeam, getTeamById} = require('../controllers/teams');
const router = express.Router();

router.get('/', getTeam);
router.get('/byName', getTeamByName);
router.get('/byId', getTeamById);
router.post('/', createTeam);
router.put('/', updatePositionTeam);

module.exports = router;