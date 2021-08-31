const nodemailer = require('nodemailer');

module.exports = (request, response, next) => {

    const { studentsList, userEmail } = request.body.formData;
    const fromMail = process.env.MAIL_SENDER;
    console.log(request.body);
    const constructRegistrationIDText = () => {
        var regIdText = '';
        studentsList.forEach( student => {
            regIdText = regIdText + `, ${student.studentId}`;
        });
        return regIdText.slice(1);
    };

    const registrationId = constructRegistrationIDText();
    const subject = 'Registration successful';
    const body = `Congratulations! You have successfully registered for katha UTSAV 2021.<br/>Your registration id is <b>${registrationId}.</b>`;

    const SMTPtransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.MAIL_SENDER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    SMTPtransport.verify(function (error, success) {
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
        from: fromMail,
        to: userEmail,
        subject: subject,
        html: body
    }

    SMTPtransport.sendMail(mailOptions, (error, response) => {
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
