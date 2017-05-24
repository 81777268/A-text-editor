var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('weeditor/editor',
	      {
	          title: "我的编辑器",
	      });
	
});

//获取菜单列表
router.post('/menu_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('menu_list'),{
            form: req.body,
            json:false
        },function(error, response, body){ 
            var result = body;
            res.render('tpl/menu_list',
            {
                  page:result.data,
            });
        }
    );
});

//获取样式列表
router.post('/style_list', function(req, res, next) {
    //console.log(">>>>>>global.api_domain:"+JSON.stringify(global.config.api_domain));
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('style_list'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.render('tpl/style_list',
            {
                  page:result.data,
            });
        }
    );
});

//获取模板列表
router.post('/template_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('template_list'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.render('tpl/template_list',
            {
                  page:result.data,
            });
        }
    );
});

//自定义模板列表查询
router.post('/customTemplate_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('customTemplate_list'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.render('tpl/custom_template_list',
            {
                  page:result.data,
            });
        }
    );
});

//样式收藏列表
router.post('/collected_list', function(req, res, next) {
    console.log("collected_list:"+global.config.api_domain);
    var request = require('./utils/httpclient').http(req,res);
    
     request.post(global.config.api('collected_list'),
         {
             form: req.body,
             json:false
         },
         function(error, response, body){ 
            var isReqStyle=req.body.type;
             var result = body;
              if(isReqStyle==1){
                 res.render('tpl/style_list',
                  {
                        page:result.data,
                  });
              }else{
                  res.render('tpl/template_list',
                  {
                        page:result.data,
                  });
              }
          
         }
     );
});

//样式收藏
router.post('/collect_add', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('collect_add'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.send(result);
        }
    );
});

//取消收藏
router.post('/collection_del', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('collection_del'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.send(result);
        }
    );
});

//根据模板id,获取单个模板
router.post('/single_template', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('single_template'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.send(result);
        }
    );
});

//我的模板删除
router.post('/mytemplate_del', function(req, res, next) {
   
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('mytemplate_del'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            res.send(result);
        }
    );
});


//获取我的图库图片列表
router.post('/myimg_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('myimg_list'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.render('tpl/myimg_list',
            {
                  page:result.data,
            });
        }
    );
});

//设置封面获取我的图片列表
router.post('/myimg_select_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('myimg_list'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            res.send(result);
        }
    );
});

//获取在线图库图片列表
router.get('/onlineimg_list', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.get(global.config.api('onlineimg_list')+"?keyWord="+req.query.keyWord+"&pageNum="+req.query.pageNum,
     function(error, response, body){ 
          console.log("--------"+body)
            var result = body;
            res.render('tpl/onlineimg_list',
            {
                  page:result.data,
            });
        }
    );
});



//shidajian
//弹出看内的图片搜索
router.get('/onlineimg_list_json', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.get(global.config.api('onlineimg_list_json')+"?keyWord="+req.query.keyWord+"&pageNum="+req.query.pageNum,
        function(error, response, body){ 
            var result = body;
            res.send(result);
        }
        
    );
});


        

//我的图库图片删除
router.post('/myimg_del', function(req, res, next) {
   
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('myimg_del'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.send(result);
        }
    );
});


//保存单图文
router.post('/add_my_single_article', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('add_my_single_article'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.send(result);
        }
    );
});
//更新单图文
router.post('/update_my_single_article', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('update_my_single_article'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            
            res.send(result);
        }
    );
});

//另存为模板
router.post('/add_custom_template', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('add_custom_template'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            res.send(result);
        }
    );
});

//添加我的图片
router.post('/add_picture', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('add_picture'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            res.send(result);
        }
    );
});


//网络图片搜索
router.post('/online_search', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('online_search'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            res.send(result);
        }
    );
});

//导入素材
router.post('/import_article', function(req, res, next) {
    var request = require('./utils/httpclient').http(req,res);
    request.post(global.config.api('import_article'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            var result = body;
            res.send(result);
        }
    );
});



module.exports = router;
