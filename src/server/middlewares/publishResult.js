const {s3UploadResult} = require("../utils/s3Helpers");

const PublishResult = async (req, res, next) => {
  try {
    const result = await s3UploadResult('./uploads/results.xlsx');
    console.log(result);
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!\n' + e);
  }
};

module.exports = PublishResult;