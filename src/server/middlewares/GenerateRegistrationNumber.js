
function GenerateRegistrationNumber( req, res, next) {
  res.locals.regIds = [1243823, 1423442, 8768768, 8768789];
  res.locals.paymentId = 2398474;
  next();
}

module.exports = GenerateRegistrationNumber;