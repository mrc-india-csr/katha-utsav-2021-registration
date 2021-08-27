const router = require('express').Router();

router.get('/payment', async (req, res) => {
  try {
    res.send('payment');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
