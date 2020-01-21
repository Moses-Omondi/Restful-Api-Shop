const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const User = require('../models/user');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.delete_user);

module.exports = router;