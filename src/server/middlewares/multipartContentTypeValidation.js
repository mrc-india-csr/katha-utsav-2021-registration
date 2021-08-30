const MulterContentValidation = function (req, res, next) {

  if (req.headers['content-type'].includes('multipart/form-data')) {
    next();
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data submitted, Try again!'
    });
  }
}

module.exports = MulterContentValidation;