/***********************************************
 *
 *	api接口配置文件
 *	
 *	jihy@wemedia.cn
 *	2017.01.12
 *
 ***********************************************/

module.exports={
    // 微信登录
    "wx_login":"user/wx_login.do",  //微信登录
    "user_register":"user/register.do",   //注册新账号并绑定当前微信号
    "user_bind":"user/bind.do",   //当前微信号绑定已有账号
    "login":"user/login.do",//账号名、密码登录
    "check_login":"user/check_login.do",//检查用户登录状态
    "logout":"user/logout.do",//
    
    "menu_list":"constant/query_first_second_list.do",//加载编辑页面  三级菜单列表
    "style_list":"style/page_list.do",//获取样式列表
    "template_list":"template/page_list.do",//获取模板列表
    "single_template":"custom_template/get_by_id.do?",//根据模板id,获取单个模板
    "mytemplate_del":"custom_template/del_by_id.do",//自定义模板删除
    "myimg_list":"picture/page_list.do?",//我的图片列表
    "onlineimg_list":"load_image/list.do",//检索百度图片接口
    "onlineimg_list_json":"load_image/list.do",//检索百度图片接口
    "upload_files":"upload/upload_files.do",//多文件上传接口
    "qiniu_upload_img":"upload/qiniu_upload_img.do",//单文件上传接口
    "online_search":"upload/upload_url.do",//在线图片上传
    "collected_list":"collection/page_list.do",//样式收藏列表【type】[userid]  模板收藏列表【】[userid]同一个
    "collect_add":"collection/add.do",//样式收藏接口【操作两张表】和模板收藏接口【操作两张表】是同一个接口
    "customTemplate_list":"custom_template/page_list.do",//我的模板自定义列表。
    "import_article":"network_material/article_info.do",//导入图文

    //公众号授权
    "get_auth_url":"auth/get_auth_url.do",//获取公众号授权链接
    "auth_list":"auth/list.do",           //获取公众号授权列表


    //sdj  
    "add_my_single_article":"my_single_article/add.do",//添加单图文
    "update_my_single_article":"my_single_article/update.do",//更新单图文
    "add_custom_template":"custom_template/add_custom_template.do",//另存为模板
    "add_picture":"picture/add_picture.do",//上传图片后插入我的图片
    "myimg_del":"picture/del_picture.do",//删除我的图片
    "collection_del":"collection/del.do",//取消收藏  ?type=1&other_id=1

    //我的内容-单图文
    "my_single_article_count":"my_single_article/count.do",//我的图文-单图文-总数统计
    "my_single_article":"my_single_article/page_list.do",//我的图文-单图文
    "del_my_single_article":"my_single_article/del.do",
    "my_single_article_detail":"my_single_article/detail.do",//获取单图文详情

    //我的内容-多图文
    "my_multi_article_count":"my_multi_article/count.do",//我的图文-多图文-总数统计
    "my_multi_article":"my_multi_article/page_list.do",//我的图文-多图文
    "del_my_multi_article":"my_multi_article/del.do",//删除
    "my_multi_article_detail":"my_multi_article/detail.do",//获取多图文详情
    "my_multi_article_item_detail":"my_multi_article/item_detail.do",//获取多图文详情
    "multi_article_add":"my_multi_article/add.do",//保存
    "multi_article_update":"my_multi_article/update.do",//更新

    //图文同步
    "add_article_sync_task":"article_sync_task/add.do",  //添加同步任务
    "article_sync_task_detail":"article_sync_task/detail.do",  //获取同步任务详情

    //热文
    "network_material":"network_material/search.do",//所有热文
    "net_article_page_list":"collection/net_article_page_list.do",//收藏列表
    "add_net_article":"collection/add_net_article_collection.do",//添加收藏
    "del_net_article_collection":"collection/del_net_article_collection.do",//删除收藏

    //微信授权
    "bind_wx_list":"user/bind_wx_list.do",//获取绑定的微信号列表
    "unbind_wx":"user/unbind_wx.do",//取消微信号绑定
    "info":"user/info.do",//获取用户信息
    "modify_pwd":"user/modify_pwd.do"//修改密码
};

