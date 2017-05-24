/**
 * swig filters extending
 */
module.exports = function(swig) {
    
	// 判断是否显示
    swig.setFilter('ifTrueHide', function (bool) {
        if(bool){
            return 'style=display:none'
        }else{
            return '';
        }
    });
    // 根据输入的表达式，判断是否需要添加指定的字符串
    swig.setFilter('ifTrueAppend', function (bool,text) {
        if(bool){
            return text;
        }else{
            return ''
        }
    });
    // 根据输入的表达式，判断是否需要添加指定的字符串
    swig.setFilter('choose', function (bool,text1,text2) {
        if(bool){
            return text1;
        }else{
            return text2;
        }
    });
    // 根据输入的表达式，判断是否需要添加指定的字符串
    swig.setFilter('chooses', function (value,text1,text2,defaultValue) {
        if(value==undefined || value==null || value===""){
            return defaultValue;
        }else if(value==0){
            return text1;
        }else if(value==1){
            return text2;
        }
    });
    //如果输入的值为空，则显示指定的默认值
    swig.setFilter('ifNullShow', function (value,defaultValue) {
        if(value==undefined || value==null || value===""){
            return defaultValue;
        }else{
            return value;
        }
    });
    //判断输入的值是否为空
    swig.setFilter('isNull', function (value) {
        if(value==undefined || value==null || value===""){
            return true;
        }else{
            return false;
        }
    });
    //判断输入的值是否为空
    swig.setFilter('isNotNull', function (value) {
        //console.log("isNotNull input value:"+value);
        if(value==undefined || value==null || value===""){
            //console.log("isNotNull :"+false);
            return false;
        }else{
            //console.log("isNotNull :"+true);
            return true;
        }
    });

    swig.setFilter('substring', function (str,start,end) {
        if(str=="" || str==null || str.length<start){
            return "";
        }
        if(end==null || end==undefined || str.length<end){
            return str.substring(start,str.length);
        }
        return str.substring(start,end)+"...";
    });

    //角色判断
    /**
     三种用法
     1. curr_user|isAdmin  返回true|false,用于if、elseif语句中
     2. curr_user|isAdmin("class1")  如果是管理员，则添加"class1"字符;否则什么也不做
     3. curr_user|isAdmin("class1","class2") 如果是管理员返回class1,否则返回class2
    **/     
    swig.setFilter('isAdmin', function (curr_user,text1,text2) {
        if(curr_user!=null && curr_user.roles!="" && curr_user.roles.indexOf("admin")>=0){
            if(text1==undefined){
                return true;
            }
            return text1;
        }
        if(text1==undefined){
            return false;
        }


        if(text2==undefined){
            return "";
        }
        return text2;       
    });
    swig.setFilter('isDepartLeader', function (curr_user,text1,text2) {
        if(curr_user!=null && curr_user.roles!="" && curr_user.roles.indexOf("depart_leader")>=0){
            if(text1==undefined){
                return true;
            }
            return text1;
        }
        if(text1==undefined){
            return false;
        }
        if(text2==undefined){
            return "";
        }
        return text2;
    });
    swig.setFilter('isGroupLeader', function (curr_user,text1,text2) {
        if(curr_user!=null && curr_user.roles!="" && curr_user.roles.indexOf("group_leader")>=0){
            if(text1==undefined){
                return true;
            }
            return text1;
        }
        if(text1==undefined){
            return false;
        }
        if(text2==undefined){
            return "";
        }
        return text2;      
    });
    swig.setFilter('isOperator', function (curr_user,text1,text2) {
        if(curr_user!=null && curr_user.roles!="" && curr_user.roles.indexOf("operator")>=0){
            if(text1==undefined){
                return true;
            }
            return text1;
        }
        if(text1==undefined){
            return false;
        }
        if(text2==undefined){
            return "";
        }
        return text2;      
    });

    //二维码
    swig.setFilter('biz_image', function (orig_id) {
        //return 'http://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=180&__biz='+biz;
		return 'http://open.weixin.qq.com/qr/code/?username='+orig_id;
    });

    //预览微信图片连接
    swig.setFilter('wx_url', function (url) {
        //return url.replace(/\?wx_fmt=.*$/g,"");
		return url.substring(0,url.indexOf("?"));
		
        //return "http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl="+url;
        //return url;
    });
    //预览微信图片media_id
    swig.setFilter('view_wx_image', function (app_info_id,media_id) {
        console.log("wwig-filter--view_wx_image:app_info_id:"+app_info_id);
        return "/view_image?app_info_id="+app_info_id+"&media_id="+media_id;
    });

    swig.setFilter('time_change', function (update_time) {
        // 时间戳取时间
        return new Date(parseInt(update_time) * 1000).toLocaleString().substr(0,16);
    });
    swig.setFilter('time_change2', function (update_time) {
        // 时间戳取时间
        return new Date(parseInt(update_time)).toLocaleString().substr(0,10);
    });
    //时间转换函数
    swig.setFilter('format_duration',function(seconds) {
        var min = Math.floor(seconds / 60),
            second = seconds % 60,
            hour, newMin, time;

        if (min > 60) {
            hour = Math.floor(min / 60);
            newMin = min % 60;
        }

        if (second < 10) { second = '0' + second;}
        if (min < 10) { min = '0' + min;}

        return time = hour? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
    });
    swig.setFilter('price', function (price) {
		price = parseInt(price);
		if(!price)
			return 0;
			
  		return (price / 100).toFixed(2);
	});
    //时间转换函数
    swig.setFilter('format_duration',function(seconds) {
        var min = Math.floor(seconds / 60),
            second = seconds % 60,
            hour, newMin, time;

        if (min > 60) {
            hour = Math.floor(min / 60);
            newMin = min % 60;
        }

        if (second < 10) { second = '0' + second;}
        if (min < 10) { min = '0' + min;}

        return time = hour? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
    });
    // 视频列表页面，判断是否有封面图
    
    swig.setFilter('judge_ifHave',function(pic) {
        if (pic == "") {
            return "../../images/onChecking.jpg";
        }else{
            return pic;
        };
    });
    swig.setFilter('short_name',function(name) {
        if (name.length > 12) {
            return name.substring(0, 11) + "...";
        }else{
            return name;
        };
    });
    swig.setFilter('for_short',function(name,num) {
        if (name.length > num) {
            return name.substring(0, num-1) + "...";
        }else{
            return name;
        };
    });
    swig.setFilter('replaceBlank2Br',function(name) {
        return name.replace(" ","<br/> ");
    });
    
    
}