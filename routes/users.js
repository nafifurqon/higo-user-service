const express = require('express');
const userController = require('../controllers/users.controller');

const router = express.Router();

router.get('/summary', userController.getSummary);
router.get('/segment', userController.getSegment);
router.get('/:id', userController.getById);

module.exports = router;
