const router = require('express').Router();
const path  = require('path');
const ContentTypeValidation = require('../middlewares/contenTypeValidation');
const { validate } = require('express-validation');
const {contactValidation} = require('../utils/validationHelpers');
const SubmitQuery = require('../middlewares/submitQuery');

router.get(('/logo.png'), (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../assets/images/logo.png'));
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

router.post(('/submit_query'), ContentTypeValidation, validate(contactValidation, {}, {}), SubmitQuery, (req, res) => {
  const messageId = res.locals.messageId;
  res.status(200).json({
    status: 'success',
    queryId: messageId,
    message: `Query Submitted Successfully!`
  }).send();
});

exports.router = router;
