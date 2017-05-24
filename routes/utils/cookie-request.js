var request = require('request');
var format = require("string-template");

exports.init = function(req, domain){
	// 保持与请求接口的session一致
	var url = domain || global.config.api_domain;
	
	var j = request.jar();
	if(req && req.cookies) {
		for(x in req.cookies){
			var cookie = request.cookie(format('{0}={1}', x, req.cookies[x]));
			j.setCookie(cookie, url);
		}
	}
	return request.defaults({jar:j});
};