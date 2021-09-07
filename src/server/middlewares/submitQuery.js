const { pool } = require('../initializers/pgdb');
const config = require('../config');

const SubmitQuery = async function (req, res, next) {
  try {
    const { name, phone, email, message} = req.body;
    const queryString = `
    INSERT INTO ${config.pgDatabaseSchema}.contact_messages (name, phone_number, email_id, message_text, message_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
    const valueArray = [name, phone, email, message, 'Created'];
    const response = await pool.query(queryString, valueArray);
    res.locals.messageId = response.rows[0]['message_id'];
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
  next();
}

module.exports = SubmitQuery;