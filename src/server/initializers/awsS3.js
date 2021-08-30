const S3 = require("aws-sdk/clients/s3");
const config = require('../config');

const { s3BucketRegion, s3AccessKey, s3SecretKey} = config;

const s3 = new S3({
  region: s3BucketRegion,
  accessKeyId: s3AccessKey,
  secretAccessKey: s3SecretKey,
})

module.exports = s3;