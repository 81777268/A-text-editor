define(function(require, exports, module) {
  var md5 = require("../common/md5");
  var weui = require('../common/weui');

  function modifyPwd(){
    var used_psw = document.getElementById('used_psw').value;
    var new_pwd = document.getElementById('new_pwd').value;
    var repeatpwd = document.getElementById('repeatpwd').value;

    if (used_psw.length == 0) {
      return $('.errs').html('密码不能为空')
    }
    if (new_pwd.length == 0 && repeatpwd.length == 0) {
      $('.errs').html('')
      return $('.errn').html('新密码不能为空')
    }
    if (new_pwd != repeatpwd) {
      return $('.errn').html('两次密码不一致')
    } 

    $('.errs').html('');
    $('.errno').html('');
    $('.errn').html('');
    var used_psws = md5.hex_md5(used_psw)
    var new_pwds = md5.hex_md5(new_pwd)

    $.ajax({
      type: "post",
      dataType: "json",
      url: '/modify_pwd',
      data: {
        'old_pwd': used_psws,
        'new_pwd': new_pwds
      },
      success: function(data) {
        if (data.code == 0) {
          $('#modal-backdrop').css('display', 'none');
          $('#login-dialog').css('display', 'none');
          weui.toast("密码更改成功,请重新登录", "success",2000,
            function() {
              window.location.reload();
            }
          );
        } else {
          $('.errs').html('密码输入错误')
        }

      }
    });
  }

  function unbindWx(ele){
    var s = ele.attr('mem_id');
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/unbind_wx',
      data: {
        'mem_id': s
      },
      success: function(data) {
        ele.parent('td').parent('tr').hide('slow/400/fast');
        if(data.code == 3007){
            weui.toast("当前微信号已解绑,请重新登录", "success",2000,
            function() {
              window.location.reload();
            });
        }
      }
    })
  }
  var init = function() {
    var H = (window.innerHeight) - 163;
    $('.wrap').css('height', H + 'px');



    //不登陆下的状态
    if (isLogin() != true) {
      $('section').html('');
      $('section').append('<div class="container"><div class="container_title"><span></span><span>微信公众平台授权</span></div><div class="container_content"><span>该功能需要登录后才能使用，</span><span class="log_in_btn">立即登录</span></div></div>');

      $('.log_in_btn').click(function() {
        showLoginDialog();
      });
      return;
    }

    //点击取消绑定
    $('td').on('click', '.cancel', function() {
      var b = $(this);

      weui.confirm('确定取消该绑定账号吗？', function(bt) {
        if (bt == 'ok') {
          unbindWx(b);
        }
      });
    });

    //修改密码_弹框
    $('.msg_show').on('click', '.longin_psw', function() {
      $('#modal-backdrop').css('display', 'block');
      $('#login-dialog').css('display', 'block');
    });
    //修改密码_确认
    $('.bind_account_wrap').on('click', '#submit_psw', function() {
      modifyPwd();
    });
    //绑定账号
    $('.right_adduser').on('click', '.add_id', function() {
      showLoginDialog();
    });


    if (isAdmin() == 1) {
      $('.cancel').css('display', 'block');
    }
    

  }//init方法 结束

  exports.init = init;

});