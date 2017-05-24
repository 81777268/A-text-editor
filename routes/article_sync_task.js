var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/detail', function(req, res, next) {
	var request = require('./utils/httpclient').http(req, res);
	request.get(global.config.api('article_sync_task_detail'),
		req.query,
		function(error, response, body) {
			res.render("tpl/sync_detail_list",{
				items: body.data
			});
		}
	);

});
router.post('/add', function(req, res, next) {
	var request = require('./utils/httpclient').http(req, res);
	request.post(global.config.api('add_article_sync_task'),
		{
			form: req.body,
			json:false
		},
		function(error, response, body) {
			res.send(body);
		}
	);

});

module.exports = router;