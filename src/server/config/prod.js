module.exports = {
  pgDatabaseHost: process.env.PG_DATABASE_HOST,
  pgDatabasePort: process.env.PG_DATABASE_PORT,
  pgDatabaseName: process.env.PG_DATABASE_NAME,
  pgDatabaseUserName: process.env.PG_DATABASE_USERNAME,
  pgDatabasePassword: process.env.PG_DATABASE_PASSWORD,
  pgDatabaseSchema: process.env.PG_DATABASE_SCHEMA,
  s3BucketName: process.env.S3_BUCKET_NAME,
  s3BucketRegion: process.env.S3_BUCKET_REGION,
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
  s3Folder: process.env.S3_FOLDER,
  s3ResultFolder: process.env.S3_RESULT_FOLDER,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  mailSender: process.env.MAIL_SENDER,
  mailPassword: process.env.MAIL_PASSWORD,
  contactUsNotify: process.env.CONTACT_US_NOTIFY
}