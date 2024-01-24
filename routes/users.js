const express = require('express');
const userController = require('../controllers/users.controller');

const router = express.Router();

/* GET users listing. */
router.get('/:id', userController.getById);

module.exports = router;
