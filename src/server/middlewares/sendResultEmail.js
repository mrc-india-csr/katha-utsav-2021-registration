const fs = require("fs");
const config = require('../config');
const { SMTPtransport } = require('../utils/mailHelper');
const path = require("path");

const SendResultEmail = (req, res, next) => {
  try {
    const {contactUsNotify, mailSender} = config;

    SMTPtransport.verify(function (error) {
      if (error) {
        console.log(error);
        res.status(503).json({
          status: 'Mail failed',
          message: 'Currently unable to send mail. Please contact us for more details'
        });
      }
    });

    let mailOptions = {
      from: mailSender,
      to: contactUsNotify,
      subject: 'Result file for Katha Utsav 2021 Phase 1',
      html: '<h3>Result file for Katha Utsav 2021</h3>',
      text: 'Result file for Katha Utsav 2021',
      attachments: [
        {
          filename: 'results.xlsx',
          content: fs.createReadStream(path.resolve('./uploads/results.xlsx'))
        }
      ]
    }

    SMTPtransport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        res.status(503).json({
          status: 'Mail failed',
          message: 'Currently unable to send mail. Please contact us for more details'
        });
      } else {
        next();
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!\n' + e);
  }
}

module.exports = SendResultEmail;