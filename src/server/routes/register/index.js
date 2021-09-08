const router = require('express').Router();
const { validate } = require('express-validation')

const ContentTypeValidation = require('../../middlewares/contenTypeValidation');
const PaymentVerification = require('../../middlewares/paymentVerification');
const GenerateRegistrationOrder = require('../../middlewares/generateRegistrationOrder');
const GenerateRegistrationNumber = require('../../middlewares/GenerateRegistrationNumber');
const ConstructOrderResponse = require('../../middlewares/constructOrderResponse');
const mailer = require('../../middlewares/mailer');
const { registerValidation, successValidation, failureValidation } = require('../../utils/validationHelpers');
const { updatePaymentSuccess, updatePaymentFailure } = require('../../middlewares/updatePaymentStatus');

router.post(('/generate_order'), ContentTypeValidation, validate(registerValidation, {}, {}), GenerateRegistrationOrder, GenerateRegistrationNumber, ConstructOrderResponse, async (req, res) => {
  //TODO write the form data to DB
  res.status(200).json(res.locals.orderResponse);
});

router.post('/complete_registration', ContentTypeValidation, validate(successValidation, {}, {}), PaymentVerification, updatePaymentSuccess, mailer, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Congratulations registration success, Check mail for further instructions'
  })
});

router.post('/registration_failed', ContentTypeValidation, validate(failureValidation, {}, {}), updatePaymentFailure, (req, res) => {
  res.status(200).json({
    status: 'Payment Failed',
    paymentId: req.body.paymentId
  });
});

exports.registerRoutes = router;
