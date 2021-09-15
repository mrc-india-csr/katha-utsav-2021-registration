const nodemailer = require('nodemailer');
const config = require('../config')

module.exports = (request, response, next) => {

    const { mailSender, mailPassword } = config;
    const {  paymentId, amount } = request.body;
    const { studentsList, userEmail, userName, userSchool, userPhone } = request.body.formData;
    const fromMail = 'event@katha.org';
    const isSchoolRegistration = studentsList.length > 1 ? true : false;

    const schoolRegistratonTable = () => {
        var regIdText = '';
        const amountIndividual = amount/studentsList.length; 
        studentsList.forEach( student => {
            regIdText = regIdText + `<tr><td>${student.studentName}</td>
            <td>${userSchool}</td>
            <td>${student.studentPhone}</td>
            <td>${student.studentEmail}</td>
            <td>${amountIndividual}</td>
            <td>${paymentId}</td>
            <td>${student.studentId}</td></tr>`;
        });
        return regIdText;
    };

    const subject = 'Successful Registration for KATHA Utsav 2021';
    const body = `Dear ${userName},<br/><br/>Greetings of the day!<br/><br/>
    You have made a successful registration with the following details:<br/><br/>

    <table border=1 cellspacing="0">
        <tr>
            <th>Name</th>
            <th>School</th>
            <th>Number</th>
            <th>Email ID</th>
            <th>Amount</th>
            <th>transaction ID</th>
            ${ isSchoolRegistration ? '<th>Katha UTSAV ID</th>' : ''}
        </tr>
        ${ isSchoolRegistration ? schoolRegistratonTable() : `<tr>
            <td>${userName}</td>
            <td>${userSchool}</td>
            <td>${userPhone}</td>
            <td>${userEmail}</td>
            <td>${amount}</td>
            <td>${paymentId}</td>
        </tr>`}
    </table><br/>
    ${isSchoolRegistration ? '' : `Your unique Katha Utsav'21 ID:<b>${studentsList[0].studentId}.</b><br/><br/>`}
    Request you to keep a tab on www.utsav.katha.org for more updates and results.<br/><br/>
    We wish you all the best.<br/><br/>
    Let us know if you have any other queries or concerns. Happy to help!`;

    const SMTPtransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: false,
        requireTLS: true,
        auth: {
            user: mailSender,
            pass: mailPassword
        }
    });

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
        from: fromMail,
        to: userEmail,
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
