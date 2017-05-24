define(function(require, exports, module) {
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