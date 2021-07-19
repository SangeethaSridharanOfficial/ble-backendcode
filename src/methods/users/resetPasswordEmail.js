const sgMail = require('@sendgrid/mail')

const resetPassword = (email) => {
    //sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    sgMail.setApiKey("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");
    //sgMail.setApiKey("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")
    const msg = {
        to: email, // Change to your recipient
        from: 'info@synnovate.ca', // Change to your verified sender
        subject: 'Password reset sent for sVAQ App',
        text: 'Password Reset',
        html: '<br/><strong>Your password has been reseted successfully.</strong><br/><br/>Thank you for using Gas Dispenser App.',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = resetPassword