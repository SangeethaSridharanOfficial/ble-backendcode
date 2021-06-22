const express = require('express');
const router = express.Router();
/*
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const User = require("../model/User");
*/
const paymentServices = require('../services/payment.services');

router.post('/user/payment', paymentServices.payment);

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