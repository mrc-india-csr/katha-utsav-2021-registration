const razorpay = require('../initializers/razorPay');
const { v4: uuidv4 } = require('uuid');

GenerateRegistrationOrder = async function ( req, res, next ) {

  //TODO write the sent data to db and send back the registration ids with response
  try {
    const { studentsList } = req.body;
    const options = {
      amount: (150 * 100 * studentsList.length).toString(),
      currency: 'INR',
      receipt: uuidv4(),
      payment_capture: 1
    };

    const response = await razorpay.orders.create(options);
    if(response.status === 'created') {
      res.locals.orderResponse = response;
      next();
    } else {
      res.status(500).json({
        status: 'failed',
        message: 'Payment gateway failed to initiate, Try again later'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'failed',
      message: 'Payment gateway failed to initiate, Try again later'
    });
  }
}

module.exports = GenerateRegistrationOrder;