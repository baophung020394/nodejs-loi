var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const multer = require('multer');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var path = require('path');
var busboy = require("then-busboy");
var fileUpload = require('express-fileupload');
var app = express();


/* CORS */
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
//   allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
// }));

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileUpload());

// Import Routes
const usersRouter = require('./routes/users');
const naptiensRouter = require('./routes/naptiens');
const ruttiensRouter = require('./routes/ruttiens');
const productsRouter = require('./routes/products');
const athRouter = require('./routes/auth');
const categoryRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');

app.use('/api/users', usersRouter);
app.use('/api/naptiens', naptiensRouter);
app.use('/api/ruttiens', ruttiensRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', athRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', ordersRouter);

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
  res.render('error');
});

module.exports = app;
