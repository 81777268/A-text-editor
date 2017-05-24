define( 'common/header', ['common/base64', 'common/weui'], function( require, exports, module){

  var base64 = require('../common/base64');
  var weui = require('../common/weui');
  var code = getQueryByName("code");
  var state = getQueryByName("state");
  var isCreatNew = 1; //是否是绑定一个新账号
  var accoutFrom = $(".bind_account_wrap");
  var pre_code;

  var beforeSubmit = function() {
    var userName = accoutFrom.find("input[name='username']").val();
    var pwd = accoutFrom.find("input[name='pwd']").val();
    var repeatpwd = accoutFrom.find("input[name='repeatpwd']").val();
    var errorTip = accoutFrom.find(".error_tip");
    if (userName == '') {
      errorTip.html("请输入用户名！");
      return;
    }
    if ($.trim(pwd).length < 6 || $.trim(pwd).length > 18) {
      errorTip.html("请输入6-18位的有效密码！");
      return;
    }
    if (isCreatNew) {
      if (repeatpwd == '') {
        errorTip.html("请输入确认密码！");
        return;
      }

      if (repeatpwd != pwd) {
        errorTip.html("两次输入的密码不一致！");
        return;
      }
    }
    errorTip.addClass("success").html("输入正确");
    setTimeout(function() {
      errorTip.removeClass("success").html("");
    }, 800);

    //提交数据
    submitData(userName, pwd);
  }
  var logout = function(){
    $.post("/logout",function(result){
      if(result.code == 0){
        // setLogin(false);
        // $("#wx_login_btn").show();
        // $(".user_infos").hide();
        window.location.reload();
      }
    });
    $(".exit_wrap").fadeToggle();
  }
  var submitData = function(userName, pwd) {
    var _url = '';
    if (isCreatNew) {
      _url = '/user_register';
    } else {
      _url = '/user_bind';
    }
    $.ajax({
      type: "post",
      dataType: "json",
      url: _url,
      data: {
        pre_code: pre_code,
        username: userName,
        pwd: base64.encode(pwd)
      },
      success: function(result) {
        console.log(result);
        var data = result.data;
        if (result.code == 0) {
          var _html = '<a href="javascript:;" class="user_infos"><img src="' + data.head_img_url + '" alt="">' + data.nickname + '</a>';
          $(".login_rgister").html(_html);
          window.location.href = removeCodeState();
        } else {
          weui.toast(result.msg,"error",2000,function(){
            window.location.href = removeCodeState();
          });
        }

      }
    });
  }
  var closeDialog = function() {
    $(".modal-backdrop").hide();
    $(".modal-dialog").hide();
    return false;
  }
  function removeCodeState(){
    return window.location.href.replace(/[&\?]code=[^&]*(&state=[^&]*)?/g, "");
  }
  var init = function() {
    //动态布局
    var main_body_h = $("html,body").height() - $(".main_top").height();
    $(".main_body").css("height", main_body_h);

    if (code != null) {
      $.ajax({
        type: "post",
        dataType: "json",
        url: "/wx_login",
        data: {
          code: code,
          state: state
        },
        success: function(result) {
          console.log(result);
          if (result.code == 0) {
            var data = result.data;
            var _html = '<a href="javascript:;" class="user_infos"><img src="' + data.head_img_url + '" alt="">' + data.nickname + '</a>';
            $(".login_rgister").html(_html);
            location.href = removeCodeState();
          } else if (result.code == 3004) {
            console.log("需要绑定账号");
            pre_code = result.data;
            $(".code_wrap").hide();
            $(".bind_account_wrap").show();
            showLoginDialog();
          } else if (result.code == 3001) {
            weui.toast("网络不给力,登录超时","error",2000,function(){
              window.location.href = removeCodeState();
            });
          } else {
            weui.toast(result.msg,"error",2000,function(){
              window.location.href = removeCodeState();
            });
          }
        }
      });
    } else if (isLogin()==-1) {
      $.getJSON("/check_login", function(result) {
        if (result.code == 0) {
          var data = result.data;
          $("#user_head_img").attr("src",data.head_img_url);
          $("#user_nickname").html(data.nickname);
          $("#wx_login_btn").hide();
          $(".user_infos").show();
          setLogin(true)
        } else {
          setLogin(false);
        }
      });
    }

    //点击登陆
    $(".js_login").click(function() {
      showLoginDialog();
    });
    //点击退出登录
    $("#logout").click(function() {
      logout();
    });

    //点击账号管理
    $("#authorize_manage").click(function() {
      window.location.href="/Authorize_manage";
    });

    //绑定账号确定
    $("#bindSure").click(function() {
      beforeSubmit();
    });
    //点击用户头像
    $(".user_infos").click(function(){
      $(".exit_wrap").fadeToggle();
    });
    

    //点击立即绑定
    $(".js_fast_bind").click(function() {
      isCreatNew = 0;
      accoutFrom.find("input[name='username']").val('');
      accoutFrom.find("input[name='pwd']").val('');
      accoutFrom.find("input[name='repeatpwd']").val('');
      $(".pwd_confirm").hide();
      $(".bind_account_wrap .title").html("绑定已有账号");
      $(".has_account_tip").hide().siblings(".no_account_tip").show();
    });

    //点击立即创建
    $(".js_fast_creat").click(function() {
      isCreatNew = 1;
      accoutFrom.find("input[name='username']").val('');
      accoutFrom.find("input[name='pwd']").val('');
      accoutFrom.find("input[name='repeatpwd']").val('');
      $(".pwd_confirm").show();
      $(".bind_account_wrap .title").html("创建账号");
      $(".has_account_tip").show().siblings(".no_account_tip").hide();
    });
    //授权管理
    $("#auth_manage").click(function() {
      //if(!checkLogin()) return;
      window.location.href = "/authorize";  
    });
    //我的内容
    $("#my_article").click(function() {
      if(!checkLogin()) return;
      window.location.href = "/myArticle";
    });

    //热门文章
    $("#hot_article").click(function() {
      window.location.href = "/Hotcontent";
    });     
    //首页
    $(".logo_wrap").click(function(){
      window.location.href = "/";
    });
    

    //关闭弹框
    $(".js-close-dialog").click(function() {
      closeDialog();
    });


  }

  exports.init = init;
});
/**
 *create by 2012-08-25 pm 17:48
 *@author hexinglun@gmail.com
 *BASE64 Encode and Decode By UTF-8 unicode
 *可以和java的BASE64编码和解码互相转化
 */
define( 'common/base64', [], function( require, exports, module){

	var BASE64_MAPPING = [
		'A','B','C','D','E','F','G','H',
		'I','J','K','L','M','N','O','P',
		'Q','R','S','T','U','V','W','X',
		'Y','Z','a','b','c','d','e','f',
		'g','h','i','j','k','l','m','n',
		'o','p','q','r','s','t','u','v',
		'w','x','y','z','0','1','2','3',
		'4','5','6','7','8','9','+','/'
	];

	/**
	 *ascii convert to binary
	 */
	var _toBinary = function(ascii){
		var binary = new Array();
		while(ascii > 0){
			var b = ascii%2;
			ascii = Math.floor(ascii/2);
			binary.push(b);
		}
		/*
		var len = binary.length;
		if(6-len > 0){
			for(var i = 6-len ; i > 0 ; --i){
				binary.push(0);
			}
		}*/
		binary.reverse();
		return binary;
	};

	/**
	 *binary convert to decimal
	 */
	var _toDecimal  = function(binary){
		var dec = 0;
		var p = 0;
		for(var i = binary.length-1 ; i >= 0 ; --i){
			var b = binary[i];
			if(b == 1){
				dec += Math.pow(2 , p);
			}
			++p;
		}
		return dec;
	};

	/**
	 *unicode convert to utf-8
	 */
	var _toUTF8Binary = function(c , binaryArray){
		var mustLen = (8-(c+1)) + ((c-1)*6);
		var fatLen = binaryArray.length;
		var diff = mustLen - fatLen;
		while(--diff >= 0){
			binaryArray.unshift(0);
		}
		var binary = [];
		var _c = c;
		while(--_c >= 0){
			binary.push(1);
		}
		binary.push(0);
		var i = 0 , len = 8 - (c+1);
		for(; i < len ; ++i){
			binary.push(binaryArray[i]);
		}

		for(var j = 0 ; j < c-1 ; ++j){
			binary.push(1);
			binary.push(0);
			var sum = 6;
			while(--sum >= 0){
				binary.push(binaryArray[i++]);
			}
		}
		return binary;
	};

	var encode = function(str){
		var base64_Index = [];
		var binaryArray = [];
		for(var i = 0 , len = str.length ; i < len ; ++i){
			var unicode = str.charCodeAt(i);
			var _tmpBinary = _toBinary(unicode);
			if(unicode < 0x80){
				var _tmpdiff = 8 - _tmpBinary.length;
				while(--_tmpdiff >= 0){
					_tmpBinary.unshift(0);
				}
				binaryArray = binaryArray.concat(_tmpBinary);
			}else if(unicode >= 0x80 && unicode <= 0x7FF){
				binaryArray = binaryArray.concat(_toUTF8Binary(2 , _tmpBinary));
			}else if(unicode >= 0x800 && unicode <= 0xFFFF){//UTF-8 3byte
				binaryArray = binaryArray.concat(_toUTF8Binary(3 , _tmpBinary));
			}else if(unicode >= 0x10000 && unicode <= 0x1FFFFF){//UTF-8 4byte
				binaryArray = binaryArray.concat(_toUTF8Binary(4 , _tmpBinary));	
			}else if(unicode >= 0x200000 && unicode <= 0x3FFFFFF){//UTF-8 5byte
				binaryArray = binaryArray.concat(_toUTF8Binary(5 , _tmpBinary));
			}else if(unicode >= 4000000 && unicode <= 0x7FFFFFFF){//UTF-8 6byte
				binaryArray = binaryArray.concat(_toUTF8Binary(6 , _tmpBinary));
			}
		}

		var extra_Zero_Count = 0;
		for(var i = 0 , len = binaryArray.length ; i < len ; i+=6){
			var diff = (i+6)-len;
			if(diff == 2){
				extra_Zero_Count = 2;
			}else if(diff == 4){
				extra_Zero_Count = 4;
			}
			//if(extra_Zero_Count > 0){
			//	len += extra_Zero_Count+1;
			//}
			var _tmpExtra_Zero_Count = extra_Zero_Count;
			while(--_tmpExtra_Zero_Count >= 0){
				binaryArray.push(0);
			}
			base64_Index.push(_toDecimal(binaryArray.slice(i , i+6)));
		}

		var base64 = '';
		for(var i = 0 , len = base64_Index.length ; i < len ; ++i){
			base64 += BASE64_MAPPING[base64_Index[i]];
		}

		for(var i = 0 , len = extra_Zero_Count/2 ; i < len ; ++i){
			base64 += '=';
		}
		return base64;
	};
	/**
	 *BASE64  Decode for UTF-8 
	 */
	var decode = function(_base64Str){
		var _len = _base64Str.length;
		var extra_Zero_Count = 0;
		/**
		 *计算在进行BASE64编码的时候，补了几个0
		 */
		if(_base64Str.charAt(_len-1) == '='){
			//alert(_base64Str.charAt(_len-1));
			//alert(_base64Str.charAt(_len-2));
			if(_base64Str.charAt(_len-2) == '='){//两个等号说明补了4个0
				extra_Zero_Count = 4;
				_base64Str = _base64Str.substring(0 , _len-2);
			}else{//一个等号说明补了2个0
				extra_Zero_Count = 2;
				_base64Str = _base64Str.substring(0 , _len - 1);
			}
		}

		var binaryArray = [];
		for(var i = 0 , len = _base64Str.length; i < len ; ++i){
			var c = _base64Str.charAt(i);
			for(var j = 0 , size = BASE64_MAPPING.length ; j < size ; ++j){
				if(c == BASE64_MAPPING[j]){
					var _tmp = _toBinary(j);
					/*不足6位的补0*/
					var _tmpLen = _tmp.length;
					if(6-_tmpLen > 0){
						for(var k = 6-_tmpLen ; k > 0 ; --k){
							_tmp.unshift(0);
						}
					}
					binaryArray = binaryArray.concat(_tmp);
					break;
				}
			}
		}

		if(extra_Zero_Count > 0){
			binaryArray = binaryArray.slice(0 , binaryArray.length - extra_Zero_Count);
		}

		var unicode = [];
		var unicodeBinary = [];
		for(var i = 0 , len = binaryArray.length ; i < len ; ){
			if(binaryArray[i] == 0){
				unicode=unicode.concat(_toDecimal(binaryArray.slice(i,i+8)));
				i += 8;
			}else{
				var sum = 0;
				while(i < len){
					if(binaryArray[i] == 1){
						++sum;
					}else{
						break;
					}
					++i;
				}
				unicodeBinary = unicodeBinary.concat(binaryArray.slice(i+1 , i+8-sum));
				i += 8 - sum;
				while(sum > 1){
					unicodeBinary = unicodeBinary.concat(binaryArray.slice(i+2 , i+8));
					i += 8;
					--sum;
				}
				unicode = unicode.concat(_toDecimal(unicodeBinary));
				unicodeBinary = [];
			}
		}
		var str = '';  
		for(var i = 0 , len =  unicode.length ; i < len ;++i){  
		      str += String.fromCharCode(unicode[i]);  
		}  
		return str;
	}
	

	exports.encode = encode;
	exports.decode = decode;
});
define( 'common/weui', [], function( require, exports, module){

  
  //询问框
  var index = 0;
  var confirm = function(tip,callback){
    var confirm_index = index;
    var $weui_dialog=$('<div class="modal-backdrop" id="confirm_'+confirm_index+'"  style="display: block;"></div>'+
                      '<div class="modal-dialog confirmDialog" style="display: block;">'+
                      '<div class="modal-content absoluted">'+
                      '<div class="modal-body">'+
                      '<div class="icon_wrap"><i class="icon iconfont icon-jinggao"></i></div>'+
                      '<div class="msg">'+tip+'</div>'+
                      '</div>'+
                      '<div class="modal-foot clearfix">'+
                      '<a href="javascript:;" class="btn btn_default js-close-dialog closeDialogBtn">取消</a>'+
                      '<a href="javascript:;" class="btn btn_primary">确定</a>'+
                      '</div>'+
                      '</div>'+
                      '</div>');

    
    $("body").append($weui_dialog);
    index++;
    $weui_dialog.find(".closeDialogBtn").on("click",function(){
        callback("cancel");
        console.log('取消');
        $weui_dialog.remove();
    });
    $weui_dialog.find(".btn_primary").on("click",function(){
        callback("ok");
        console.log('确认');
        $weui_dialog.remove();
    });
    $weui_dialog.show();     
  }

  var default_error_toast_time = 2000;
  var default_toast_time = 1000;

  //提示框
   var toast=function(msg,type,time,callback){
      var default_time = default_error_toast_time;
      var toast_index = index;
      if(typeof type == 'number'){
          time = type;
          type='success';
      }
      var $weui_dialog;
      if(type=="error"){
        $weui_dialog =$('<div id="toast_'+toast_index+'"  class="dialog_tip_wrap error">'+
                        '<div class="tip_content">'+
                        '<div class="icon_wrap"><i class="icon iconfont icon-jinggao"></i></div>'+
                        '<div class="msg">'+msg+'</div>'+
                        '</div>'+
                        '</div>');  
      }else if(type == "warn"){
        $weui_dialog =$('<div id="toast_'+toast_index+'"  class="dialog_tip_wrap warn">'+
                        '<div class="tip_content">'+
                        '<div class="icon_wrap"><i class="icon iconfont icon-jinggao"></i></div>'+
                        '<div class="msg">'+msg+'</div>'+
                        '</div>'+
                        '</div>'); 
      }else{
        $weui_dialog =$('<div id="toast_'+toast_index+'"  class="dialog_tip_wrap success">'+
                       '<div class="tip_content">'+
                        '<div class="icon_wrap"><i class="icon iconfont icon-zhengque"></i></div>'+
                        '<div class="msg">'+msg+'</div>'+
                        '</div>'+
                        '</div>'); 
        default_time = default_toast_time;
      }
      if(typeof time !='number'){
         time = default_time;
      }
      $("body").append($weui_dialog);
      var $weui_dialog=$('#toast_'+toast_index);
      index++;

      setTimeout(function(){
           $weui_dialog.fadeOut(1000,function(){
             $weui_dialog.remove();
           });
           
           if(typeof callback == 'function'){
              callback();
           }
           
      },time);
   }

  //对话框
  var dialog = function(title,tip,inputText,callback){
    var dialog_index = index;
    var $weui_dialog =$('<div id="dialog_'+dialog_index+'" class="dialog_wrp  ui-draggable custom_dialog">'+
        '<div class="dialog" id="wxDialog_1">'+
        '<div class="dialog_hd">'+
        '<h3>'+title+'</h3> '+
        '<a href="javascript:;" class="pop_closed closeDialogBtn">关闭</a>'+
        '</div>'+
        '<div class="dialog_bd">'+
        '<div class="page_msg large asking_msg">'+
        '<div class="inner group custom_area add_step_page1"  style="display: block;">'+
        '<div class="title">'+tip+'</div>'+
        '<div class="frm_controls">'+
        '<span class="frm_input_box">'+
        '<input placeholder="" class="frm_input" id="frmInput" autofocus="autofocus">'+
        '</span>'+
        '<div class="err_tips">内容不能为空！</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div> '+
        '<div class="dialog_ft">'+
        '<a href="javascript:;" class="btn btn_primary js_btn"  >确定</a>'+
        '<a href="javascript:;" class="btn btn_default js_btn closeDialogBtn" >取消</a>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="mask"></div>');

    $("body").append($weui_dialog);
    $weui_dialog = $("#dialog_"+dialog_index);
    index++;

    if(inputText!=null && inputText!=""){
       $("#frmInput").val(inputText); 
    }
    if(typeof inputText=='function'){
      callback = inputText;
    }
    $('#frmInput').keydown(function(e){
      if(e.keyCode==13){
         $weui_dialog.find(".btn_primary").click();
      }
    });
    

    $weui_dialog.find(".closeDialogBtn").on("click",function(){
        callback("cancel");
        console.log('取消');
        $weui_dialog.remove();
    });
    $weui_dialog.find(".btn_primary").on("click",function(){
        var inputVal=$("#frmInput").val();
        if(inputVal==''){    
          $(".err_tips").show();
          return false;
        }

        $(".err_tips").hide();
        callback("ok",inputVal);

        console.log('确认');
        $weui_dialog.remove();
    });
    
    $weui_dialog.show();
        
  }

   exports.confirm = confirm;
   exports.toast = toast;
   exports.dialog = dialog;
});   


