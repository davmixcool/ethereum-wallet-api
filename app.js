var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Config = require('./common/config');
var indexRouter = require('./routes/index');
var ethereumRouter = require('./routes/ethereum');
var tokenRouter = require('./routes/token');
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


const apiKeyAuth = (req, res, next) => {

  console.log('Checking API KEY')

  let apiKey = req.body.api_key;

  if (!apiKey || apiKey != Config.ApiKey) {

    res.status(401).json({
      message:"Invalid API KEY",
    });
    res.end();

  }else{

    next()
  }
}

app.use('/', indexRouter);

// -- setup up swagger-jsdoc --
const swaggerDefinition = {
  info: {
    title: 'Ethereum Wallet API',
    version: '0.1.0',
    description: 'Ethereum Wallet API is a service used for creating and managing an ethereum wallet using web3. \n\n\n\n Supported Wallets include: ETH, VILA, USDT, NGNS. \n\n\n\n  Supported ERC20 Token include: VILA, USDT, NGNS.',
  },
  host: 'localhost:3000',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  apis : ['./routes/ethereum.js',
        './routes/token.js'
  ]
  //apis: [path.resolve(__dirname, 'ethereum.js')],
};
const swaggerSpec = swaggerJSDoc(options);

// -- routes for docs and generated swagger spec --
app.get('/swagger.json', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


app.use(apiKeyAuth);
app.use('/ethereum', ethereumRouter);
app.use('/token', tokenRouter);

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
