const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const User = require("../model/User");

const rService = require('../services/r.service');

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.get('/roomAllItems', rService.getItems);

router.get('/roomLatestItem', rService.getLastItem);

router.get('/roomSetpoints', rService.getSetpoints);

router.put('/roomSetpoints/:id', rService.updateSetpoints);

router.post('/user/signup', rService.signup);

router.post('/user/login', rService.login);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/user/me", auth, async(req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

module.exports = router;