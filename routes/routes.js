// 集成路由
module.exports = function(app) {
	var format = require("string-template");

	var isInWeixinApp = function(req) {
        return /MicroMessenger/.test(req.headers['user-agent']);
    };
    var initFilter = function(req, res, next) {
        var swig_local_variables = {};

        if(req.session.user){
            swig_local_variables = {
                is_login     : req.session.user.is_login,
                wx_nick_name : req.session.user.wx_nick_name,
                wx_head_img  : req.session.user.wx_head_img,
                user_type    : req.session.user.user_type,
            }
        }
    	global.swig.setDefaults({
            locals:swig_local_variables
        });
        next();
    };

    app.use(initFilter);
    app.use('/', require("./base/login"));//登录相关
    app.use('/upload', require("./base/upload")); //文件上传
    app.use('/ueditor', require("./base/ueditor"));//ueditor配置
    //业务路由
    app.use('/', require("./weeditor"));
    app.use('/authorize', require("./authorize"));
    app.use('/myArticle', require("./myArticle"));
	app.use('/Hotcontent',require('./Hotcontent'));
    app.use('/Authorize_manage',require('./Authorize_manage'));
    app.use('/article_sync_task',require('./article_sync_task'));
};
