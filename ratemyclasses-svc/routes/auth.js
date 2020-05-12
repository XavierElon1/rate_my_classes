const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const router = require('express').Router();

const validEmail = require('../helpers/helpers.js').validEmail
const verifyToken = require('../helpers/helpers.js').verifyToken
const constants = require('../helpers/constants.js')



const transporter = nodeMailer.createTransport({
    auth: {
        pass: process.env.EMAIL_PASSWORD,
        user: process.env.EMAIL_LOGIN
    },
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true
});

const emailTemplate = (username,link) => 
    "<p>" + constants.EMAIL_GREETING + ", " + username + "! " + constants.EMAIL_CALL_TO_ACTION + "</p></br><p>" + link + "</p>";

const generate = (email) => {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + constants.TOKEN_EXPIRATION);
    return jwt.sign({email, expiration}, process.env.JWT_SECRET);
}

router.route('/').post((req,res) => {
    if (!validEmail(req.body.email)) {
        return res.status(400).json({ Error: constants.INVALID_EMAIL }).send()
    }
    const email = req.body.email
    const redirect = req.body.redirect
    const token = generate(email)
    const mailOptions = {
        from: constants.EMAIL_FROM,
        html: emailTemplate(email, redirect + '/' + token),
        subject: constants.EMAIL_SUBJECT,
        to: email,
    }
    return transporter.sendMail(mailOptions, error => {
        if (error) {
            res.status(500).json(error).send()
        } else {
            res.status(200).send()
        }
    });
});

router.route('/:token').get((req,res) => {
    if (validEmail(verifyToken(req.params.token))) {
        res.status(200).json().send()
    } else {
        res.status(401).json().send()
    }    
});

module.exports = router;