const router = require('express').Router();
const FetchAnalysisData = require("../../middlewares/fetchAnalysisData");
const WriteAnalysisData = require("../../middlewares/writeAnalysisData");
const SendAnalysisEmail = require("../../middlewares/sendAnalysisEmail");
const config = require('../../config');
const FetchResultData = require("../../middlewares/fetchResultData");
const WriteResultData = require("../../middlewares/writeResultData");
const PublishResult = require("../../middlewares/publishResult");

router.get(('/generate_report'), FetchAnalysisData, WriteAnalysisData, SendAnalysisEmail, async (req, res) => {
  try {
    const { contactUsNotify } = config;
    res.status(200).send(`Report generated successfully and sent to registered mail id ${contactUsNotify}!`);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!');
  }
});

router.get(('/publish_results'), FetchResultData, WriteResultData, PublishResult, async (req, res) => {
  try {
    res.set('Content-Type', 'text/html');
    res.status(200).send(Buffer.from(`Result generated successfully and saved to S3 and check the link for the results file <a href='${res.locals.resultLocation}' target="_blank">${res.locals.resultLocation}</a>`));
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!');
  }
});

exports.analysisRoutes = router;