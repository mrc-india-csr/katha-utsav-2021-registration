const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {pool} = require('./initializers/pgdb');
const { ValidationError } = require('express-validation')


//Router Imports
const { router } = require('./routes/index');
const {registerRoutes} = require("./routes/register");
const { storyRoutes } = require("./routes/stories");


//Port Assigning
const port = process.env.PORT || 3010;


//App Initialization
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


//Service Initializers
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})


//Routes
app.use('/katha_utsav/v1', router);
app.use('/katha_utsav/v1/story', storyRoutes);
app.use('/katha_utsav/v1/register', registerRoutes);

app.get('/api/healthy', (req, res) => {
  res.status(200).json({ message: ' Web is healthy!'+ process.env.NODE_ENV});
});


app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
  console.log(err);
  return res.status(500).json(err)
})


//Server
const server = app.listen(port, () => {
  console.log(`running in port ${port}`);
});

module.exports = server;