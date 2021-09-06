const router = require('express').Router();
const path  = require('path');
const ContentTypeValidation = require('../middlewares/contenTypeValidation');
const { validate } = require('express-validation');
const {contactValidation} = require('../utils/validationHelpers');
const SubmitQuery = require('../middlewares/submitQuery');

router.post(('/submit_query'), ContentTypeValidation, validate(contactValidation, {}, {}), SubmitQuery, (req, res) => {
  const messageId = res.locals.messageId;
  res.status(200).json({
    status: 'success',
    queryId: messageId,
    message: `Query Submitted Successfully!`
  }).send();
});

exports.router = router;