const express = require('express');
const {getSesion, createSesion} = require('../controllers/sessions');
const router = express.Router();

router.get('/', getSesion);
router.post('/', createSesion);

module.exports = router;