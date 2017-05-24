var express = require('express');
var router = express.Router();
var httpclient = require('./utils/httpclient');

//获取微信授权列表
router.get('/', function(req, res, next) {
	var request = httpclient.http(req, res);
	request.post(global.config.api('bind_wx_list'),
		function(error, response, body) {

      request.post(global.config.api('info'),
        function(error, response, bodys) {
          res.render('weeditor/Authorize_manage', {
            title: "公众号授权",
            page: body.data,
            info:bodys.data
          })

        })
		}
  );
});

module.exports = router;
