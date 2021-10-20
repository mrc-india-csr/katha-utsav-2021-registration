const s3 = require('../initializers/awsS3');
const fs = require('fs');
const config = require('../config');

const { s3BucketName, s3Folder, s3ResultFolder } = config

function s3UploadResult(filePath) {
  const fileStream = fs.createReadStream(filePath).on('error', function (e) {
    return 'error';
  })

  const uploadParams = {
    Bucket: s3BucketName,
    Body: fileStream,
    Key: s3Folder + 'result/results.xlsx'
  }
  return s3.upload(uploadParams).promise()
}

function s3UploadFile(file) {
  const fileStream = fs.createReadStream(file.path).on('error', function (e) {
    return 'error';
  })

  const uploadParams = {
    Bucket: s3BucketName,
    Body: fileStream,
    Key: s3Folder + file.filename
  }
  return s3.upload(uploadParams).promise()
}

function s3GetFile(filePath) {
  const fileParams = {
    Key: filePath,
    Bucket: s3BucketName
  }
  return s3.getObject(fileParams).createReadStream();
}

async function s3RemoveFile(filePath) {
  let status = 'pending';
  const fileParams = {
    Key: filePath,
    Bucket: s3BucketName
  }
  await s3.deleteObject(fileParams, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      status = 'failed';
    }
    else {
      status = 'success';
    }
  }).promise();
  return status;
}

exports.s3UploadFile = s3UploadFile;
exports.s3GetFile = s3GetFile;
exports.s3RemoveFile = s3RemoveFile;
exports.s3UploadResult = s3UploadResult;