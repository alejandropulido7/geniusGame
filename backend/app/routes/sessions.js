const express = require('express');
const {getSesion, createSesion, updateBoardPositions} = require('../controllers/sessions');
const router = express.Router();

router.get('/', getSesion);
router.post('/', createSesion);
router.put('/updateBoard', updateBoardPositions);

module.exports = router;