const router = require('express').Router();
const FetchAnalysisData = require("../../middlewares/fetchAnalysisData");
const WriteAnalysisData = require("../../middlewares/writeAnalysisData");
const SendAnalysisEmail = require("../../middlewares/sendAnalysisEmail");

router.get(('/generate_report'), FetchAnalysisData, WriteAnalysisData, SendAnalysisEmail, async (req, res) => {
  try {
    res.status(200).send('Report generated successfully and sent to registered mail id!');
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!');
  }
});

exports.analysisRoutes = router;