const crypto = require('crypto');

const PaymentVerification = function (req, res, next) {
  const formData = req.body;
  try {
    const hmac = new crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(formData.id + "|" + formData.paymentId);
    let generatedSignature = hmac.digest('hex');
    let isSignatureValid = generatedSignature === formData.signature;

    if (isSignatureValid) {
      next();
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'Something went wrong during payment process, Contact us if amount deducted from your account'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'failed',
      message: 'Payment verification failed, Contact us if the amount deducted from your account'
    });
  }
};

module.exports = PaymentVerification;