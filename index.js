require("dotenv").config();
require("express-async-errors");
const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const signupRoute = require('./routes/signup')
const signinRoute = require('./routes/signin')
const refreshRoute = require('./routes/refresh')
const signoutRoute = require('./routes/signout')
const uploadImageRoute = require('./routes/uploadimage')

const app = express();

app.use([cookieParser()]);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cors({ origin: true, credentials: true }));

app.use('/signup', signupRoute);
app.use('/signin', signinRoute);
app.use('/refresh', refreshRoute);
app.use('/signout', signoutRoute);
app.use('/uploadimage', uploadImageRoute);


const port = process.env.PORT || 7000;
const start = async () => {
  try {
    app.listen(port);
  } catch (err) {
   
  }
};

start();
