const router = require('express').Router();
const FetchAnalysisData = require("../../middlewares/fetchAnalysisData");
const WriteAnalysisData = require("../../middlewares/writeAnalysisData");
const SendAnalysisEmail = require("../../middlewares/sendAnalysisEmail");
const config = require('../../config');
const FetchResultData = require("../../middlewares/fetchResultData");
const WriteResultData = require("../../middlewares/writeResultData");
const PublishResult = require("../../middlewares/publishResult");
const SendResultEmail = require("../../middlewares/sendResultEmail");

router.get(('/generate_report'), FetchAnalysisData, WriteAnalysisData, SendAnalysisEmail, async (req, res) => {
  try {
    const { contactUsNotify } = config;
    res.status(200).send(`Report generated successfully and sent to registered mail id ${contactUsNotify}!`);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!');
  }
});

router.get(('/publish_results'), FetchResultData, WriteResultData, PublishResult, SendResultEmail, async (req, res) => {
  try {
    const { contactUsNotify } = config;
    res.status(200).send(`Result generated successfully and saved to S3 and also sent to registered mail id ${contactUsNotify}!`);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!');
  }
});

exports.analysisRoutes = router;