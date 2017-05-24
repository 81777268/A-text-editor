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


