const express = require('express');
const {getSesion, createSesion, updateBoardPositions} = require('../controllers/sessions');
const {authRequired} = require('../validations/validateToken')
const router = express.Router();

router.get('/', [authRequired], getSesion);
router.post('/', [authRequired], createSesion);
router.put('/updateBoard', [authRequired], updateBoardPositions);

module.exports = router;