const express = require('express');
const router = express.Router();
const usersServices = require('../services/users.services');

router.post('/user/signup', usersServices.signup);
router.post('/user/login', usersServices.login);
router.post('/user/forgetPassword', usersServices.forgetPassword);
router.post('/user/resetPassword', usersServices.resetPassword);
router.post('/user/me', usersServices.me);

module.exports = router;