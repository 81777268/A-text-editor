define( 'Authorize_manage/Authorize_manage', ['common/md5', 'common/weui'], function( require, exports, module){
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
define( 'common/md5', [], function( require, exports, module){
  var hexcase = 0;
  var b64pad  = "";
  var chrsz   = 8;
  function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
  function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
  function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
  function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
  function calcMD5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
  

  function md5_vm_test()
  {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
  }

  function core_md5(x, len)
  {

    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;
    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

  }

  function md5_cmn(q, a, b, x, s, t)
  {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
  }
  function md5_ff(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t)
  {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t)
  {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function core_hmac_md5(key, data)
  {
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
  }

  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function str2binl(str)
  {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
      bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
  }

  function binl2hex(binarray)
  {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++)
    {
      str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
             hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
  }

  function binl2b64(binarray)
  {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i += 3)
    {
      var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                  | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                  |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
        else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
      }
    }
    return str;
  }

  exports.hex_md5 = hex_md5;
  exports.b64_md5 = b64_md5;
  exports.hex_hmac_md5 = hex_hmac_md5;
  exports.b64_hmac_md5 = b64_hmac_md5;
  exports.calcMD5 = calcMD5;
  
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


