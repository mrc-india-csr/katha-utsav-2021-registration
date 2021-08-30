const ContentTypeValidation = function (req, res, next) {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data submitted, Try again!'
    });
  } else {
    next();
  }
}

module.exports = ContentTypeValidation;