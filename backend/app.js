const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const routes = require('./routes/index');

const app = express();
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

// Set header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

// Database setup
mongoose.set('strictQuery', false);
if (process.env.NODE_ENV === 'production') {
  const mongoDB = process.env.DB_URL_PROD;
  main(mongoDB).catch(err => console.log(err));
} else {
  const mongoDB = process.env.DB_URL;
  main(mongoDB).catch(err => console.log(err));
}

async function main(url) {
  mongoose.connect(url);
}

app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// listen at port number
const port = process.env.PORT || 3000;
app.listen(port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
