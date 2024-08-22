const express = require('express');
const {getGameState} = require('../classes/GameState');
const {getUsersInRoom} = require('../classes/RoomStore');
const router = express.Router();

router.get('/:idRoom', getGameState);

module.exports = router;