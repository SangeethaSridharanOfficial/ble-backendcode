const express = require('express');
const router = express.Router();
/*
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const User = require("../model/User");
*/
const usersServices = require('../services/users.services');

router.post('/user/signup', usersServices.signup);
router.post('/user/login', usersServices.login);
router.post('/user/forgetPassword', usersServices.forgetPassword);
router.post('/user/resetPassword', usersServices.resetPassword);
router.post('/user/me', usersServices.me);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */
/*
router.get("/user/me", auth, async(req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});*/

module.exports = router;