var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var request = require('./utils/httpclient').http(req, res);
	request.post(global.config.api('auth_list'),
		function(error, response, body) {
			res.render('weeditor/authorize', {
				title: "公众号授权",
				page: body.data
			});
		}
	);

});
router.get('/list', function(req, res, next) {
	var request = require('./utils/httpclient').http(req, res);
	request.post(global.config.api('auth_list'),
		function(error, response, body) {
			res.send(body);
		}
	);
});
router.get('/get_auth_url', function(req, res, next) {
	var request = require('./utils/httpclient').http(req, res);
	request.post(global.config.api('get_auth_url'),
		function(error, response, body) {
			res.send(body);
		}
	);

});



module.exports = router;
