const express = require('express');
const {createTeam, getTeam, getTeamByName, updatePositionTeam, getTeamById} = require('../controllers/teams');
const router = express.Router();
const {authRequired} = require('../validations/validateToken')

router.get('/', [authRequired], getTeam);
router.get('/byName', [authRequired], getTeamByName);
router.get('/byId', [authRequired], getTeamById);
router.post('/', [authRequired], createTeam);
router.put('/', [authRequired], updatePositionTeam);

module.exports = router;