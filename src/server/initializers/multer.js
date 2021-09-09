const multer = require("multer");
const path = require('path')

let storage = multer.diskStorage(
  {
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, Date.now() + '__' + path.basename(file.originalname).replace(/[^a-zA-Z0-9.]/g, ''));
    },
  }
);

const MulterUpload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.pdf' && ext !== '.jpeg' && ext !== '.docx' && ext !== '.doc') {
      return callback(new Error('Unsupported file format!'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024 * 10
  }
})

module.exports = MulterUpload;