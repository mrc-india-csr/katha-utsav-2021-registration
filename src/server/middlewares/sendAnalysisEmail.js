const fs = require("fs");
const config = require('../config');
const { SMTPtransport } = require('../utils/mailHelper');
const path = require("path");

const SendAnalysisEmail = (req, res, next) => {
  try{
    const {contactUsNotify, mailSender} = config;

    SMTPtransport.verify(function (error) {
      if (error) {
        console.log(error);
        res.status(503).json({
          status: 'Mail failed',
          message: 'Currently unable to send mail. Please contact us for more details'
        });
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    let mailOptions = {
      from: mailSender,
      to: contactUsNotify,
      subject: 'Registration data for Katha Utsav 2021',
      html: '<h3>Student registration data as per request</h3>',
      text: 'Student registration data as per request',
      attachments: [
        {
          filename: 'Student Data.xlsx',
          content: fs.createReadStream(path.resolve('./uploads/Student Data.xlsx'))
        }
      ]
    }

    SMTPtransport.sendMail(mailOptions, (error) => {
      if(error) {
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
    res.status(500).send('Something went wrong, During email triggering Try Again!');
  }
}

module.exports = SendAnalysisEmail;