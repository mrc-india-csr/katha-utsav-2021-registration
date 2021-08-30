const router = require('express').Router();
const { MulterUploadFile } = require('../../middlewares/multerUpload');
const { s3UploadFile, s3GetFile, s3RemoveFile } = require('../../utils/s3Helpers');
const MulterContentValidation = require('../../middlewares/multipartContentTypeValidation');
const DeleteTempFiles = require('../../middlewares/deleteTempFiles');

router.post('/upload_story', MulterContentValidation, MulterUploadFile, async (req, res, next) => {
  try {
    const file = req.file;
    const result = await s3UploadFile(file);
    res.status(200).json({
      status: 'success',
      path: '/katha_utsav/v1/story/get_story/' + result.Key
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      error: error
    });
  }
}, DeleteTempFiles);

router.get('/get_story/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const readStream = s3GetFile(key);
    readStream.on('error', function(e) {
      res.status(404).send();
    }).pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/remove_story/:key', async (req, res) => {
  //TODO Add middleware to check if the file is being used
  try {
    const key = req.params.key;
    const response = await s3RemoveFile(key);
    if(response === 'success') {
      res.status(200).json();
    } else {
      res.status(500).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

exports.storyRoutes = router;