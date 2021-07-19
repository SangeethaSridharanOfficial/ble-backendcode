const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../model/User");

sendResetPasswordEmail = require("../methods/users/resetPasswordEmail")
sendForgotPasswordEmail = require("../methods/users/forgotPasswordEmail")

module.exports = {

    signup: async(req, res) => {
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        });
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    },

    login: async(req, res) => {
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(200).json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(200).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    },

    forgetPassword: async(req, res) => {
        check("email", "Please enter a valid email").isEmail()
      
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email } = req.body;
        console.log("Sending forget password for :"+req.body.email);
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(200).json({
                    message: "User Not Exist"
                });

            let resetToken = crypto.randomBytes(4).toString("hex");
            const salt = await bcrypt.genSalt(10);
            var newPassword = await bcrypt.hash(resetToken, salt);
            await User.updateOne({ "email": email }, { $set: { "password": newPassword } });
            console.log('reset token: ' + resetToken)
            word(email, resetToken)
            res.status(200).json({
                "message": "Your Password is set to temporary. Please check your email for the new Password. It is recommended that you reset password.",
                "password": resetToken
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    },

    resetPassword: async(req, res) => {
        check("password", "Please enter an old password").isLength({
            min: 6
        }),
        check("newPassword", "Please enter a new password").isLength({
            min: 6
        })

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password, newPassword } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(200).json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(200).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };
            const salt = await bcrypt.genSalt(10);
            var newHashPassword = await bcrypt.hash(newPassword, salt);

            await User.updateOne({ "email": email }, { $set: { "password": newHashPassword } });
            sendResetPasswordEmail(email)
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    },

    me: async(req, res) => {
        try {
            const user = await User.find({"email":req.body.email});
            res.json(user[0]);
        } catch (e) {
            res.send({ message: "Error in Fetching user" });
        }
    },
}