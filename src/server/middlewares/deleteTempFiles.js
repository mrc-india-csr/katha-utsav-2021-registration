const fs = require('fs');

const DeleteTempFiles = function(req, res, next) {
  try {
    const file = req.file;
    fs.unlink(file.path, function () {});
  } catch (error) {
    console.log(error);
  }
  next();
}

module.exports = DeleteTempFiles;