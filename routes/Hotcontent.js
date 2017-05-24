// //后端路由js

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('weeditor/Hotcontent', {
		title: "我的内容"
	});
});
//抓取全部
router.post('/network_material', function(req, res, next) {
   var request = require('./utils/cookie-request').init(req,global.config.api_domain);

	// var path='network_material'+req.body.url
	// console.log(req.body+'mkmkmkmkmkmkmkmkmkm')
    request.post(global.config.api('network_material'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){
            res.json(body);
            console.log(body);
        }
    );
});
//抓取收藏列表
router.post('/net_article_page_list',function (req,res,next) {
	var request=require('./utils/cookie-request').init(req,global.config.api_domain);
	request.post(global.config.api('net_article_page_list'),
	{
		form: req.body,
		json:false
	},
	function (error, response, body) {
		res.json(body);
		// console.log(body);
	}
);
});
router.post('/add_net_article', function(req, res, next) {

    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('add_net_article'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){
					console.log(body);
            res.send(body);
        }
    );
});
router.post('/del_net_article_collection', function(req, res, next) {

    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('del_net_article_collection'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){
					// console.log(body);
            res.send(body);
        }
    );
});



module.exports = router;
