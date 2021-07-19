const { check, validationResult } = require("express-validator/check");
const stripe = require('stripe')('sk_test_51IZNXDEpsLVtl1KC3UHkBvlRNc1bhFK7PHAs8H7b24VVCqaO3CIUbHM93flnbuE5rg2uVf6wRWTYwppDTLOq20A100FgCBhYyo');
const sendPaymentEmail = require("../methods/payments/sendPaymentEmail")

const Payment = require("../model/Payment");

async function savePaymentToMongo(email, amount, paymentId) {
    let payment = new Payment({
        email: email,
        amount: amount,
        payment_id: paymentId
    });
    await payment.save();
    sendPaymentEmail(email, amount)
}

module.exports = {
    payment: async(req, res) => {
        try {
            console.log('data from client : amount : ' + req.body.amount + ' ' );
            stripe.paymentIntents.create({
                    amount: req.body.amount,
                    currency: 'cad',
                    payment_method_types: ['card'],
                }).then((charge) => {
                    savePaymentToMongo(req.body.email, req.body.amount, charge["id"]);
                    res.send({
                        "message":"Your Payment is successfully Accepted.Please check your email for a receipt.",
                        "success":"true"
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        } catch (e) {
            res.send({ message: "Error in Fetching " });
        }
    }
}