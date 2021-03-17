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
var cors = require('cors')
var bodyParser = require('body-parser')

var app = express();

app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const apiKeyAuth = (req, res, next) => {

  //console.log('Checking API KEY',req.headers.authorization)

  let apiKey = req.headers.authorization;

  if (!apiKey || apiKey != 'Bearer '+Config.ApiKey) {

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
      description: "<h3>Supported Tokens</h3> ETH, VILA, USDT, NGNS, BNB, USDC, OKB, CRO, LEO, VEN, DAI, CEL, YFI, UNI, SNX, BUSD, PAX, LINK, OMG, BAT, NEXO, ZRX, BAND, LEND, TUSD, BKY <br><br>  <h3>Authentication:</h3> Ethapi offers one form of authentication which is an API Key. <br>",
      version: '0.5.0',
      "contact": {
        "email": "hello@davidoti.com",
        "name": "David Oti"
      },
      "license": {
        "name": "MIT",
        "url": "https://github.com/davmixcool/ethereum-wallet-api/blob/master/LICENSE"
      },
      "x-logo": {
        "url": "images/logo.png",
        "backgroundColor": "#FFFFFF",
        "altText": "Ethereum Wallet"
      }
  },
  "x-tagGroups": [
    {
      "name": "API",
      "tags": ['Ethereum','ERC20 token']
    }
  ],
  "tags": [
    {
      "name": "Ethereum",
      "description": "Create and manage an ethereum account"
    },
    {
      "name": "ERC20 token",
      "description": "Manage ERC20 Tokens"
    }
  ],
  "servers":[
    {
      "url": "https://localhost:3000",
      "description": "Development Server"
    }
  ],
  host: 'localhost:3000',
  basePath: '/',
  hideHostname: true,
  schemes: [
    'http',
    'https'
  ],
  securityDefinitions:{
    Bearer:{
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      required: true
    }
  }
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
