const express = require('express');
const {createTeam, getTeam, getTeamByName, updatePositionTeam} = require('../controllers/teams');
const router = express.Router();

router.get('/', getTeam);
router.get('/byName', getTeamByName);
router.post('/', createTeam);
router.put('/', updatePositionTeam);

module.exports = router;