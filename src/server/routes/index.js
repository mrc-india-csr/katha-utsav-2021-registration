const router = require('express').Router();
const path  = require('path');


router.get(('/logo.png'), (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../assets/images/logo.png'));
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

exports.router = router;
