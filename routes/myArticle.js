var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    // var request = require('./utils/httpclient').http(req, res);
    // request.post(global.config.api('my_single_article_count'),
    //     function(error, response, body){
            res.render('weeditor/myArticle', {
                title: "我的内容",
                // single_total: body.data
            }); 
 //        }    
	// );
});

//预览页
router.get('/view', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
    request.get(global.config.api('my_single_article_detail'),
       req.query,
        function(error, response, body){
            res.render('weeditor/article_view',
            {
                page: body.data,
            });
        }
    );
});

//请求单图文列表
 router.post('/my_single_article', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_single_article'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){
             res.render('tpl/my_single_article_list',
             {
                   page:body.data,
             });
         }
     );
 });
 //请求单图文列表总数
 router.post('/my_single_article_count', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_single_article_count'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){
             res.send(body);
         }
     );
 });

 //删除
 router.post('/del_my_single_article', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('del_my_single_article'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){ 
             res.send(body);
         }
     );
 });

 //获取一个单图文详情
 router.post('/my_single_article_detail', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_single_article_detail'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){ 
             res.send(body);
         }
     );
 });

/*********多图文  分割线*****************/

//请求单图文列表总数
 router.post('/my_multi_article_count', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_multi_article_count'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){
             res.json(body);
         }
     );
 });

//请求多图文列表
 router.post('/my_multi_article', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_multi_article'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){
            res.render('tpl/my_multi_article_list',
            {
                page:body.data,
            });
        }
     );
 });

 //删除多图文
router.post('/del_my_multi_article', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('del_my_multi_article'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){ 
             res.send(body);
         }
     );
 });

 //获取一个多图文详情
router.post('/my_multi_article_detail', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_multi_article_detail'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){ 
             res.send(body);
         }
     );
 });
//获取多图文的子图文详情
router.post('/my_multi_article_item_detail', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_multi_article_item_detail'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){ 
             res.send(body);
         }
     );
 });



//创建多图文时-请求单图文列表
 router.post('/single_msg_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_single_article'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){
             res.send(body);
         }
     );
 });
 //创建多图文时-获取当前多图文
router.post('/curmultimsg_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.post(global.config.api('my_multi_article_detail'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){ 
            res.render('tpl/curmultimsg_list',
            {
                page: body.data,
            });
         }
     );
 });


//多图文保存
router.get('/multi_article_add', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.get(global.config.api('multi_article_add'),
         req.query,
         function(error, response, body){ 
             res.send(body);
         }
     );

 });

//多图文更新
router.get('/multi_article_update', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
     request.get(global.config.api('multi_article_update'),
         req.query,
         function(error, response, body){ 
             res.send(body);
         }
     );

 });

//预览页
router.get('/view_multi_item', function(req, res, next) {
    var request = require('./utils/httpclient').http(req, res);
    request.get(global.config.api('my_multi_article_item_detail'),
       req.query,
        function(error, response, body){
            res.render('weeditor/article_view',
            {
                page: body.data,
            });
        }
    );
});

module.exports = router;