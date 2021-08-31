const MulterContentValidation = function (req, res, next) {
 // TODO: check if particular form field is present or not
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