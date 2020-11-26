var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var ethereumRouter = require('./routes/ethereum');
var villaRouter = require('./routes/vila');
var usdtRouter = require('./routes/usdt');
const swaggerJSDoc = require('swagger-jsdoc');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ethereum', ethereumRouter);
app.use('/villa', villaRouter);
app.use('/usdt', usdtRouter);


// -- setup up swagger-jsdoc --
const swaggerDefinition = {
  info: {
    title: 'Blockvila Ethereum Wallet',
    version: '1.0.0',
    description: 'Blockvila Ethereum Wallet',
  },
  host: 'localhost:3000',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  apis : ['./routes/ethereum.js',
        './routes/vila.js',
        './routes/usdt.js'
  ]
  //apis: [path.resolve(__dirname, 'ethereum.js')],
};
const swaggerSpec = swaggerJSDoc(options);

// -- routes for docs and generated swagger spec --
app.get('/swagger.json', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


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
