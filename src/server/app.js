const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const publicPath = path.resolve(__dirname, 'public');
const {pool} = require('./database/index');
const routes = require('./routes/index');

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

const port = process.env.PORT || 3000;

app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use('/public', express.static(publicPath, { redirect: false }));

app.use('/katha', routes);

app.get('/api/healthy', (req, res) => {
  console.log('welcome');
  res.status(200).json({ message: ' Web is healthy!'+ process.env.NODE_ENV});
});

const indexFile = (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'ci') ? path.resolve(__dirname, 'index.html') : path.join(__dirname, 'public', 'index.html');

app.get('*',
  async (req, res) => {
    res.sendFile(indexFile);
  });


const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`running in port ${port}`);
});

module.exports = server;

