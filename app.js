var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var swig = require('swig');

var app = express();
var routes = require('./routes/routes');
var config = require('./config/config');

//
// 设置全局配置变量
//
global.config = config;
global.swig = swig;

// 扩展swig filters
var extFilters = require('./extend_swig/ext-filters');
extFilters(swig);

swig.setDefaults({ autoescape: false });


// 设置node执行环境
// development / production
app.set('env', config.env);

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.set('view cache', config.viewCache);
swig.setDefaults({cache : config.viewCache});

app.use(session(config.sessionOption));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', '/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: false ,"limit":"10000kb"}));
app.use(cookieParser());

// node 相对路径
app.use(config.basepath, express.static(path.join(__dirname, 'public')));

//
// 设置集成路由
//
routes(app);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(req.path+' Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') != 'production') {
   app.use(function(err, req, res, next) {
   	console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
    
     res.status(err.status || 500);
     res.render('error', {
       message: err.message,
       error: err
     });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
     message: err.message,
     error: {}
   });
});

//
//异常处理，防止node遇到未处理的异常，导致进程崩溃！
//
process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});

module.exports = app;
