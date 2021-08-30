const multer = require("multer");
const MulterUpload = require('../initializers/multer');

function MulterUploadFile(req, res, next) {
  const upload = MulterUpload.single('story');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({
        message: err
      }).send();
    } else if (err) {
      res.status(500).json({
        message: err
      }).send();
    } else {
      next();
    }
  })
}

exports.MulterUploadFile = MulterUploadFile;