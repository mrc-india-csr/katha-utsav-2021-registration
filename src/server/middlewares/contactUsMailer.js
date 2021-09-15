const { SMTPtransport } = require('../utils/mailHelper');
const config = require('../config');

module.exports = (request, response, next) => {
    const { mailSender } = config;
    const { name, phone, email, message} = request.body;
    const subject = 'Contact Us Query Received';
    const body = `Name - ${name} <br/>
    Phone Number - ${phone} <br/>
    Email Id - ${email} <br/>
    Message - ${message}`;

    SMTPtransport.verify(function (error) {
        if (error) {
          console.log(error);
          response.status(503).json({
            status: 'Mail failed',
            message: 'Currently unable to send mail. Please contact us for more details'
          });
        } else {
          console.log("Server is ready to take our messages");
        }
      });

      let mailOptions = {
        from: mailSender,
        to: mailSender,
        subject: subject,
        html: body,
        text: body
    }

    SMTPtransport.sendMail(mailOptions, (error) => {
        if(error) {
            console.log(error);
            response.status(503).json({
                status: 'Mail failed',
                message: 'Currently unable to send mail. Please contact us for more details'
              });
        } else {
            next();
        }
    });
}