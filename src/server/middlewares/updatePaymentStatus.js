var {pool} = require('../initializers/pgdb');
const config = require('../config');

async function updatePaymentSuccess(request, response, next) {
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

async function updatePaymentFailure(request, response, next) {
  const { id } = request.body;
  const text = `
    UPDATE ${config.pgDatabaseSchema}.payments SET payment_status = $1
    WHERE order_id_pgw = $2
    RETURNING payment_id
  `;
  const values = ['FAILURE', id];
  const updatedPaymentIds = await pool.query(text, values);
  next();
}


module.exports = {
  updatePaymentSuccess,
  updatePaymentFailure
}
