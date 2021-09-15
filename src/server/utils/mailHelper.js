const nodemailer = require('nodemailer');
const config = require('../config');

const { mailSender, mailPassword } = config;

const SMTPtransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: false,
    requireTLS: true,
    auth: {
        user: mailSender,
        pass: mailPassword
    }
});

module.exports = {SMTPtransport};

    
