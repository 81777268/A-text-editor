/***********************************************
 *
 *	node app 配置文件，
 *	共用的配置信息都写在本文件中
 *	本文件不得填写与开发环境或者生成环境依赖的配置信息
 *	
 *	zhangsy@wemedia.cn
 *	2016.11.02
 *
 ***********************************************/

/**
** 运行环境   
** 1. development  开发环境
** 2. test         测试环境
** 3. production   线上环境
**/
const env = "test";//默认测试环境

const viewCache = false;
const sessionOption = {
  resave: false,
  saveUninitialized: true,
  secret: '8ed2e45c-fa76-4408-94a9-5d4c63b684ef',
  cookie: { secure: false } // 必须为false，https协议才可以为true
};

var api = require('./api');
var app = (env=="development" ? require('./app-development') : (env=="production" ?require('./app-production'):require('./app-test')));

exports.env = env;
exports.app = app;
exports.api = function(name) {
	return app.api_domain + api[name];
};
exports.api_domain = app.api_domain;

exports.title = "WeEditor";

exports.file_server_host = app.file_server_host;
exports.file_server_port = app.file_server_port;

exports.viewCache = viewCache;
exports.sessionOption = sessionOption;

//项目根路径
exports.basepath = "/";

exports.http_log=true;//是否打印http请求日志

exports.http_log_max_size = 5000;

