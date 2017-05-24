var express = require('express');
var router = express.Router();
var httpclient = require('../utils/httpclient');

//微信扫码登陆
router.post('/wx_login', function(req, res, next) {
    //console.log(">>>>>>global.app:"+JSON.stringify(global.config));
    var request = httpclient.http(req, res);
    request.post(global.config.api('wx_login'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){  
            if(body.code==0 && body.data!=null){
                holdUser(req,body);
                copySetCookies(response,res);
            }
            res.send(body); 
        }
    );
});


//注册新账号并绑定当前微信号
router.post('/user_register', function(req, res, next) {
    var request = httpclient.http(req, res);
    request.post(global.config.api('user_register'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){ 
            console.log("user_register:"+body);
            if(body.code==0 && body.data!=null){
                holdUser(req,body);
                copySetCookies(response,res);
            } 
            res.send(body); 
        }
    );
});

//当前微信号绑定已有账号
router.post('/user_bind', function(req, res, next) {
    var request = httpclient.http(req, res);
    request.post(global.config.api('user_bind'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){  
            console.log("user_bind:"+body);
            if(body.data!=null){
                holdUser(req,body);
                copySetCookies(response,res);
            } 
            res.send(body); 
        }
    );
});
//当前微信号绑定已有账号
router.post('/logout', function(req, res, next) {
    var request = httpclient.http(req, res);
    request.post(global.config.api('logout'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){
            if(body.code==0){
                releaseUser(req,body);
                copySetCookies(response,res);
            } 
            res.send(body); 
        }
    );
});

//当前微信号绑定已有账号
router.get('/check_login', function(req, res, next) {
    var request = httpclient.http(req, res);
    request.get(global.config.api('check_login'),
        function(error, response, body){ 
            if(body.code==0){
                holdUser(req,body);
                copySetCookies(response,res);
            }else{
                req.session.user = {
                    isLogin : false
                }
            }
            res.send(body); 
        }
    );
});

//取消微信授权
router.post('/unbind_wx', function(req, res, next) {
    var request = httpclient.http(req,res);
    request.post(global.config.api('unbind_wx'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){
            if(body.code==3007){
                releaseUser(req,body);
                copySetCookies(response,res);
            }
            res.send(body);
        }
    );
});
//修改密码
router.post('/modify_pwd', function(req, res, next) {
    var request = httpclient.http(req,res);
    request.post(global.config.api('modify_pwd'),
        {
            form: req.body,
            json:false
        },
        function(error, response, body){
            if(body.code == 0){
                releaseUser(req,body);
                copySetCookies(response,res);
            }
            res.send(body);
        }
    );
});


function holdUser(req,body){
    req.session.user = {
        is_login    : true,
        wx_nick_name: body.data.nickname,
        wx_head_img : body.data.head_img_url,
        user_type   : body.data.user_type
    }
    //req.session.user.wxHeadImgUrl=body.data.head_img_url;   
}
function releaseUser(req,body){
    req.session.user = {
        is_login    : false,
        wx_nick_name: "",
        wx_head_img : "",
        user_type   : ""
    }
    //req.session.user.wxHeadImgUrl=body.data.head_img_url;   
}
function copySetCookies(response,res){
    //var cookies = [];

    //登录成功后，手动处理服务器的set-cookie
    var cookies = response.headers['set-cookie'];

    console.log("head set-cookie:"+cookies);
    // for(var i in response.headers['set-cookie']){
    //     var pairs = response.headers['set-cookie'][i].split(";");
    //     console.log("set-cookie:"+pairs);
    //     for(var j in pairs){
    //         var items = pairs[j].split("=");

    //         if(items[0]=="we_editor_token"){
    //             cookies.push("we_editor_token="+items[1]+";Path=/;maxAge=7200");
    //         }

    //     }
    // }   
    if(cookies && cookies.length>0){
        res.setHeader("set-cookie",cookies);
        console.log("set-cookie>>>>>>"+cookies);
    }
}

module.exports = router;