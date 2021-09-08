var {pool} = require('../initializers/pgdb');
const config = require('../config');

async function updatePaymentSuccess(request, response, next) {
  try {
    const { paymentId, id } = request.body;
    const text = `
      UPDATE ${config.pgDatabaseSchema}.payments SET payment_id_pgw = $1, payment_status = $2
      WHERE order_id_pgw = $3
      RETURNING payment_id
    `;
    const values = [paymentId, 'SUCCESS', id];
    const updatedPaymentIds = await pool.query(text, values);
    next();
  }
  catch (err) {
    console.log(err);
    response.status(500).json({
      status: 'Payment db storage failed',
      message: err.message
    });
  }
}

async function updatePaymentFailure(request, response, next) {
  try {
    const { paymentId, id } = request.body;
    const text = `
      UPDATE ${config.pgDatabaseSchema}.payments SET payment_id_pgw = $1, payment_status = $2
      WHERE order_id_pgw = $3
      RETURNING payment_id
    `;
    const values = [paymentId, 'FAILURE', id];
    const updatedPaymentIds = await pool.query(text, values);
    next();
  }
  catch (err) {
    console.log(err);
    response.status(500).json({
      status: 'Payment db storage failed',
      message: err.message
    });
  }
}


module.exports = {
  updatePaymentSuccess,
  updatePaymentFailure
}
