define(function(require, exports, module) {
var weui = require('../common/weui');

var ue;
var current_active_ueitem = null;
var toolBorder=$('<section class="RankEditor-Select" style="z-index:100;"><section style="position: absolute; border-top:1px dashed #ff8c00; width: 100%; top: -5px; "></section><section style="position: absolute; border-top:1px dashed #ff8c00; width: 100%; bottom: -5px; "></section><section style="position: absolute; border-top:1px dashed #ff8c00; width: 5px; top: -5px; left: -5px; "></section><section style="position: absolute; border-top:1px dashed #ff8c00; width: 5px; top: -5px; right: -5px; "></section><section style="position: absolute; border-top:1px dashed #ff8c00; width: 5px; bottom: -5px; left: -5px; "></section><section style="position: absolute; border-top:1px dashed #ff8c00; width: 5px; bottom: -5px; right: -5px; "></section><section style="position: absolute; border-left:1px dashed #ff8c00; height: 100%; left: -5px; "></section><section style="position: absolute; border-right:1px dashed #ff8c00;height: 100%; right: -5px; "></section><section style="position: absolute; border-left:1px dashed #ff8c00; height: 5px; bottom: -5px; left: -5px; "></section><section style="position: absolute; border-left:1px dashed #ff8c00; height: 5px; top: -5px; left: -5px; "></section><section style="position: absolute; border-left:1px dashed #ff8c00; height: 5px; bottom: -5px; right: -5px; "></section><section style="position: absolute; border-left:1px dashed #ff8c00; height: 5px; top: -5px; right: -5px; "></section></section>');
var adjustType;//记录调整的类型 
var statu = false;
var handleOx = 0;
var handleLx = 0;
var dragbarBgleft = 0;
var handle_left=0;
var percent=0;
var angle=0;
var myTempName;//模板title
var isSetCoverPic;
//换色后的颜色值
var oColor;
var isChangeColor;
var pickerColor=$(".sp-preview-inner").css("background-color");
var article_uuid;

//alert(pickerColor);
var closeDialog=function(){
        $(".modal-backdrop").hide();
        $(".modal-dialog").hide();
        return false;
  }
var dragMousedown=function(obj,oprSection,angleInput,e){
    var draghandle=$(obj); 
    handleLx = draghandle.offset().left;
    handleOx = e.pageX - handle_left;
    statu = true;
}

 var dragMousemove=function(obj,oprSection,angleInput,e){
        var dragWrapper=$(obj);
        var draghandle=$(obj).find(".draghandle");
        var dragbar=$(obj).find(".dragbar");
        var maxWid=parseInt($(obj).find(".dragbarBg").width()-$(".draghandle").width());
        handle_left=maxWid;
        adjustType=$(obj).attr("data-type"); 
        if(statu){
             handle_left = e.pageX - handleOx;
             if(handle_left < 0){
                handle_left = 0;
             }
             if(handle_left > maxWid){
                handle_left = maxWid;
             }
             draghandle.css('left',handle_left);
             dragbar.width(handle_left);
             percent=(handle_left/maxWid*100).toFixed(0)+'%'; 
             
              if(adjustType == "ANGLE"){
                   var halfWid=maxWid/2;
                    if(handle_left < halfWid){
                       rotate= -((halfWid-handle_left)/halfWid*180).toFixed(0);
                    }else if(handle_left==halfWid){
                       rotate= 0;
                    }else{
                        rotate=((handle_left-halfWid)/halfWid*180).toFixed(0);
                    }
                    angleInput.val(rotate);
                    dragbar.text(rotate);
                    $(oprSection).css({
                        "transform":"rotatez("+rotate+"deg)",
                        "-webkit-transform":"rotatez("+rotate+"deg)"
                      });
                   
                    return;
             }
             $(oprSection).css({"width":percent,"margin":"0 auto"});
             dragbar.text(percent);


        }
 }

 var dragClickBar=function(obj,oprSection,angleInput,e){
    var dragbarBg=$(obj);
    var draghandle=$(obj).siblings(".draghandle");
    var dragbar=$(obj).find(".dragbar");
    var maxWid=parseInt($(obj).width()-$(".draghandle").width());
    adjustType=$(obj).parents(".dragWrapper").attr("data-type"); 
    if(!statu){
         dragbarBgleft = dragbarBg.offset().left;
         handle_left = e.pageX - dragbarBgleft;
         if(handle_left < 0){
            handle_left = 0;
         }
         if(handle_left > maxWid){
            handle_left = maxWid;
         }
         draghandle.css('left',handle_left);
         dragbar.stop().css({"width":handle_left});
         percent=(handle_left/maxWid*100).toFixed(0)+'%';
        
         if(adjustType == "ANGLE"){
                 var halfWid=maxWid/2;
                if(handle_left < halfWid){
                   rotate= -((halfWid-handle_left)/halfWid*180).toFixed(0);
                }else if(handle_left==halfWid){
                   rotate= 0;
                }else{
                    rotate=((handle_left-halfWid)/halfWid*180).toFixed(0);
                }
                angleInput.val(rotate);
                dragbar.text(rotate);
                $(oprSection).css({
                    "transform":"rotatez("+rotate+"deg)",
                    "-webkit-transform":"rotatez("+rotate+"deg)"
                  });
                return;
                
             }
             $(oprSection).css({"width":percent,"margin":"0 auto"});
            dragbar.text(percent);  
        
    }
 }

 var manualChangeStyle=function(obj,oprSection){
    var $oprSection=$(oprSection);
    var _type=$(obj).attr("data-type");
    var draghandle=$(obj).siblings(".draghandle");
    var dragbarBg=$(obj).siblings(".dragbarBg");
    var dragbar=dragbarBg.find(".dragbar");
    var maxWid=parseInt(dragbarBg.width()-$(".draghandle").width());
    var halfWid=maxWid/2;
    var sizeInputVal=$(obj).val();
    console.log("type"+_type);
    if(_type==1){
        console.log("改变宽度");
        if(sizeInputVal>100){
           $(obj).val('100');
           sizeInputVal=100;
        }
        if(sizeInputVal<0){
           $(obj).val('0');
           sizeInputVal=0;
        }
        var percent=sizeInputVal+'%'; 
        var _left=maxWid*(sizeInputVal/100);
         draghandle.css('left',_left);
         dragbar.width(_left);
         $oprSection.css({"width":percent,"margin":"0 auto"});
         dragbar.text(percent);
    }else{
        console.log("改变角度");
         if(sizeInputVal>=180 && sizeInputVal<=0){
            sizeInputVal=0;
            $(obj).val('0');
            return;
         }
         if(sizeInputVal ==''){
            sizeInputVal=0;
            dragbar.text('0');
            return;
         }
        var _left=halfWid+(sizeInputVal/180)*halfWid;
        var handle_left=_left;
        draghandle.css('left',handle_left);
        dragbar.width(_left);
        var rotate=sizeInputVal;
        dragbar.text(rotate);
        $oprSection.css({
            "transform":"rotatez("+rotate+"deg)",
            "-webkit-transform":"rotatez("+rotate+"deg)"
          }); 

    }
    
    
 }
//选中文本
 var selectText=function(element) {
    var text = element;
   // alert(text);
    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        alert("none");
    }
}

//清除样式
 var clearStyle=function(objHtml){
         var select_obj = $(objHtml);
         select_obj.removeAttr('style');
         select_obj.removeAttr('class');
         select_obj.find('*').not('img').each(function() {
              $(this).removeAttr('style');
              $(this).removeAttr('class');
              if($.trim($(this).html())==''){
                 $(this).remove();
                 return;
              }
         }); 

 }
//ue plugins
UE.plugins['wei_plugins'] = function() {
    var me = this,
    editor = this;
    var utils = baidu.editor.utils,
    Popup = baidu.editor.ui.Popup,
    Stateful = baidu.editor.ui.Stateful,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase;
    var domUtils = baidu.editor.dom.domUtils;

    var clickPop = new baidu.editor.ui.Popup({
        content: "",
        editor: me,
        _remove: function() {
            $(clickPop.anchorEl).remove();
            clickPop.hide();
        },
        _copy: function() {
            $(clickPop.anchorEl).prop('outerHTML');
            clickPop.hide();
        },
        _choose:function(){
            $(clickPop.anchorEl).text();
            clickPop.hide();
        },
        _blankAfter: function() {
            $('<p><br/></p>').insertAfter(clickPop.anchorEl);
            clickPop.hide();
        },
        _blankBefore: function() {
            $('<p><br/></p>').insertBefore(clickPop.anchorEl);
            clickPop.hide();
        },
         _onImgRemove: function() {
            $(clickPop.anchorEl).remove();
            clickPop.hide();
        },
        _onEditButtonClick:function () {
            this.hide();
            editor.ui._dialogs.linkDialog.open();
        },
        _onImgEditButtonClick:function (name) {
            this.hide();
            editor.ui._dialogs[name] && editor.ui._dialogs[name].open();

        },
        _onImgSetFloat:function (value) {
            this.hide();
            editor.execCommand("imagefloat", value);

        },
        _setIframeAlign:function (value) {
            var frame = popup.anchorEl;
            var newFrame = frame.cloneNode(true);
            switch (value) {
                case -2:
                    newFrame.setAttribute("align", "");
                    break;
                case -1:
                    newFrame.setAttribute("align", "left");
                    break;
                case 1:
                    newFrame.setAttribute("align", "right");
                    break;
            }
            frame.parentNode.insertBefore(newFrame, frame);
            domUtils.remove(frame);
            popup.anchorEl = newFrame;
            popup.showAnchor(popup.anchorEl);
        },
        className: 'edui-bubble'
    });

    me.addListener("click",
    function(t, evt) {
        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        var toolStr='';
        if(el.tagName == "IMG"){
            var dialogName = 'insertimageDialog';
            toolStr='<nobr class="otf-poptools">'+
            '<div class="line1">'+
            '<span class="edui-clickable copy">复制</span>&nbsp;&nbsp;' +
            '<span onclick=$$._onImgSetFloat("left") class="edui-clickable">左对齐</span>&nbsp;&nbsp;' +
            '<span onclick=$$._onImgSetFloat("center") class="edui-clickable">居中</span>&nbsp;&nbsp;'+
            '<span onclick=$$._onImgSetFloat("right") class="edui-clickable">右对齐</span>&nbsp;&nbsp;' +
            '<span onclick="$$._onImgEditButtonClick(\'' + dialogName + '\');" class="edui-clickable">编辑</span>'+
            '<span onclick=$$._onImgRemove() class="edui-clickable">删除</span></nobr>'+
            '</div>';
        }else{
         toolStr='<nobr class="otf-poptools">' + 
                    '<div class="line1">'+
                    '<span class="copy" stateful>复制</span>' + 
                    '<span class="cut" stateful>剪切</span>' + 
                    '<span class="changeColor" stateful><i class="fa fa-circle" aria-hidden="true"></i></span>' + 
                    '<span onclick="$$._remove()" stateful>删除</span>' +
                    '<span onclick="$$._blankAfter()" stateful>后空行</span>' + 
                    '<span onclick="$$._blankBefore()" stateful>前空行</span>' + 
                    '</div>'+
                    '<div class="line1">'+
                    '<span class="clear" stateful>清除样式</span>' +
                    '<span class="save" stateful>存为模板</span>' +
                    '</div>'+
                    '<div class="dragWrapper" data-type="SIZE">'+
                    '<div class="dragbarBg" style="width: 216px;">'+
                    '<span style="float:right;z-index: 5;color: #999;line-height: 16px;font-size: 10px;">调整宽度比例</span>'+
                    '<div class="dragbar adjustSize" style="width: 216px;">100%</div>'+
                    '</div>'+
                    '<div class="draghandle" style="left: 204px;width:12px;height:16px;"></div>'+
                    '<input data-type="1" type="text" data- max="100" style="-webkit-appearance:none;position: absolute;top: 0;right: 0; width:30px;border:0 none;height:16px;line-height:14px;color:#333;font-size:12px;text-align: right;padding:0 2px;" name="percent" placeholder="100" class="sizeInput">'+
                    '</div>'+
                    '<div class="dragWrapper" data-type="ANGLE" style="">'+
                    '<div class="dragbarBg" style="width: 216px;">'+
                    '<span style="float:right; z-index: 5;color: #999;line-height: 16px;font-size: 10px;">旋转角度（-180~180）</span>'+
                    '<div class="dragbar adjustAngle" style="width: 108px;">0</div>'+
                    '</div>'+
                    '<div class="draghandle" style="left: 108px;width:12px;height:16px;"></div>'+
                    '<input data-type="0" type="text" max="100" style="-webkit-appearance:none;position: absolute;top: 0;right: 0; width:30px;border:0 none;height:16px;line-height:14px;color:#333;font-size:12px;text-align: right;padding:0 2px;" name="percent" placeholder="0" class="angleInput">'+
                    '</div>'+
                    '</nobr>';
        }
        if ($(el).parents('.wemeEditor').length > 0){
            el = $(el).parents('.wemeEditor:first').get(0);
             if (current_active_ueitem) {
                 toolBorder.remove();
              }
            current_active_ueitem = $(el);
            current_active_ueitem.prepend(toolBorder);
            clickPop.render();
         
            var html = clickPop.formatHtml(toolStr);
            var content = clickPop.getDom('content');
            content.innerHTML = html;
            
            clickPop.anchorEl = el;
            clickPop.showAnchor(clickPop.anchorEl);
            //复制
            var client = new ZeroClipboard($(clickPop.getDom('content')).find('.copy'));
            client.on('ready',function(event) {
                client.on('copy',function(event) {
                    //$(clickPop.anchorEl).removeAttr('style');
                    toolBorder.remove();
                    event.clipboardData.setData('text/html', $(clickPop.anchorEl).prop('outerHTML'));
                    clickPop.hide();
                    weui.toast("已成功复制到剪切板","success");
                });
            });
            //剪切
            var cut_client = new ZeroClipboard($(clickPop.getDom('content')).find('.cut'));
            cut_client.on('ready', function(event) {
                cut_client.on('copy',function(event) {
                    //$(clickPop.anchorEl).removeAttr('style');
                    toolBorder.remove();
                    event.clipboardData.setData('text/html', $(clickPop.anchorEl).prop('outerHTML'));
                    clickPop.hide();
                    $(clickPop.anchorEl).remove();
                    weui.toast("已成功剪切到剪切板","success");
                });
            });
            
            //清除样式
            var clear=$(clickPop.getDom('content')).find('.clear');
            clear.on('click',function(event){
                var objHtml=$(clickPop.anchorEl);
                clearStyle(objHtml);
                clickPop.hide();
            });
           
           //保存模板
           var save=$(clickPop.getDom('content')).find('.save');
           save.on('click',function(event){
                if(!checkLogin()) return;
                myTempName=$(clickPop.anchorEl).prop('outerHTML')

                $(".saveTemplateDialog").show();
                $(".modal-backdrop").show();
                clickPop.hide();
            });
           
           $(document).mouseup(function(){
              statu = false;
            });
            //input事件
            var perInput=$(clickPop.getDom('content')).find('input');
            perInput.on('click',function(event){
                $(this).focus();
            });
            //手动调整宽度/角度
            perInput.on('keyup change',function(){
                var oprSection=$(clickPop.anchorEl);
                 manualChangeStyle($(this),oprSection);
            });

           //拖动调整宽度/角度
            var draghandle=$(clickPop.getDom('content')).find('.draghandle');
            draghandle.on("mousedown",function(e){
                 var oprSection=$(clickPop.anchorEl);
                 var angleInput=$(clickPop.getDom('content')).find(".angleInput");
                 dragMousedown($(this),oprSection,angleInput,e);
           });
            var dragWrapper=$(clickPop.getDom('content')).find('.dragWrapper');
            dragWrapper.on("mousemove",function(e){
                 var oprSection=$(clickPop.anchorEl);
                 var angleInput=$(clickPop.getDom('content')).find(".angleInput");
                 dragMousemove($(this),oprSection,angleInput,e);
           });
            
            var dragbarBg=$(clickPop.getDom('content')).find('.dragbarBg');
            dragbarBg.on("click",function(e){
                 var oprSection=$(clickPop.anchorEl);
                 var angleInput=$(clickPop.getDom('content')).find(".angleInput");
                 dragClickBar($(this),oprSection,angleInput,e);
           });

           

        }else {
            if (current_active_ueitem) {
                toolBorder.remove();
                current_active_ueitem = null;
            }
        }
    });
};

UE.registerUI('button', function(editor, uiName) {
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName, {
        execCommand: function() {
            alert('execCommand:' + uiName)
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name: 'insertArticle',
        //提示
        title: '导入图文',
        //添加额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-position: -724px -100px;',
        //点击时执行的命令
        onclick: function() {
            //这里可以不用执行命令,做你自己的操作也可
           // editor.execCommand(uiName);
            importArticle();

        }
    });
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function() {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
    //因为你是添加button,所以需要返回这个button
    return btn;
});

//导入图文
var importArticle=function(){
    $("#articleLink").val('');
    $('.importArticleDialog .err_tips').hide();
    $(".importArticleDialog").show();
    $(".modal-backdrop").show();
}
//导入图文确定
var importArticleNext=function(){
   var articleLink = $("#articleLink").val();
   if(articleLink==''){
      $('.importArticleDialog .err_tips').html("请输入微信素材链接！").show();
   }else{
      $('.importArticleDialog .err_tips').hide();
      $.ajax({
          type: "post",
          dataType: "json",
          url: "import_article?_dc="+Math.random(), //请求的url
          data: {
              "url":articleLink
          },
          success: function (result) {
             if(result.code==0){
                   var data=result.data;
                   //console.log(data);
                   closeDialog();
                   weui.toast("导入成功","success");
                   ue.execCommand('insertHtml',data.content);//正文
                  $("#title").val(data.title);//标题
                  //$("#author").val(data.author);//作者
                  $("#digest").val(data.digest);//摘要
                  $("#content_source_url").val(data.content_source_url);//原文链接
                  $("#js_setCoverPic").attr("style","background:#e6e6e6 url("+data.thumb_url+") no-repeat center center;background-size: cover;");//封面
                  $(".js_upload_cover").hide();
                  $(".js_del_cover").show();
             }else{
                 //weui.toast("导入失败,失败原因："+result.msg,'error');
                 $('.importArticleDialog .err_tips').html(result.msg).show();
             }
          }
        });
   }
}


//第几页
var page_index=0;
//每页条数
var page_size=20;
//素材分类
var category=1;
//样式类型（一级）
var style_type=1;
//二级类别
var second_type='';
//分类name
var cateName;
//总页数
var total_page;
var BOTTOM_OFFSET=0;
var canAjax=true;
//1 是初始化加载数据 0 是加载更多
var isInitData=1;
//获取当前二级菜单的三级菜单
var curThirdMenuHtml;
//1是请求我的图库 
var isInitMyImgs=1;


var initStyleList=function(){
     $(".style_select_wrap").show().siblings().hide();
     
     $(".load_tip").show().html("加载中...");
     $.ajax({
            type: "post",
            dataType: "html",
            url: "style_list?_dc="+Math.random(), 
            data: {
                "size":page_size,
                "page": page_index,
                "type":style_type,//分类（标题、正文...）
                "second_type":second_type //分类（纯色、线框...）
            },
            success: function (data) {
                $(".load_tip").hide();
                if(isInitData==1){
                    $(".materialWrap").html('').removeClass("imgsMaterialWrap");
                    $(".materialWrap").append('<ul class="style-lists scrollPanl clearfix"></ul><div class="load_tip" style="display:none;">加载中...</div>');
                    $(".materialWrap ul").html(data);
                    total_page=$("#totalPage").val(); 

                    oColor=$(".js_color_picker").attr("data-color");
                    if(oColor != undefined || oColor != null || oColor!=''){
                       changeThemColor();
                       return;
                    }                    
                
                }else{
                   $(".materialWrap .style-lists").append(data);
                   canAjax=true; 
                }
            }
        });
}

//换色
var changeThemColor=function(){
//console.log("oColor:"+oColor);
$(".scrollPanl").find(".wemeEditor *").each(function(){
     var _this=$(this);
     //有背景色改背景色
     if( !(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i).test(_this.css("background-color")) 
        && !(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i).test(_this.css("background-color"))  ){
          _this.css({"background-color":oColor});
     }
     
     
     //有字体颜色就改字体颜色
     if( !(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i).test(_this.css("color")) 
        && !(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i).test(_this.css("color"))   ){
          _this.css({"color":oColor});
     }

      //有border颜色就该border颜色
     if( !(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i).test(_this.css("border-color")) 
        && !(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i).test(_this.css("border-color")) ){
          _this.css({"border-color":oColor});
     }

     if( !(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i).test(_this.css("border-top-color")) 
        && !(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i).test(_this.css("border-top-color"))
        &&  (_this.css("border-top-color") !="transparent") ){
          _this.css({"border-top-color":oColor});
     }

     if( !(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i).test(_this.css("border-right-color")) 
        && !(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i).test(_this.css("border-right-color"))
        &&  (_this.css("border-right-color") !="transparent") ){
          _this.css({"border-right-color":oColor});
     }

     if( !(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i).test(_this.css("border-bottom-color")) 
        && !(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i).test(_this.css("border-bottom-color"))
        &&  (_this.css("border-bottom-color") !="transparent") ){
          _this.css({"border-bottom-color":oColor});
     }
     
     if( !(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i).test(_this.css("border-left-color")) 
        && !(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i).test(_this.css("border-left-color"))
        &&  (_this.css("border-left-color") !="transparent") ){
          _this.css({"border-left-color":oColor});
     }
     
});
}
//初始化请求模板列表
var initTemplateList=function(){
    $(".template_select_wrap").show().siblings().hide();
    console.log(cateName);
    $('.js_curtemp').html(cateName);
    $(".template_select_wrap li:nth-child(1)").addClass("cur").siblings().removeClass('cur');

    $(".load_tip").show().html("加载中...");
    $.ajax({
        type: "post",
        dataType: "html",
        url: "template_list?_dc="+Math.random(), 
        data: {
            "size":page_size,
            "page": page_index,
            "template_group_id":style_type
        },
        success: function (data) {
          //console.log(data);
            $(".load_tip").hide();
            if(isInitData==1){
                $(".materialWrap").html('').removeClass("imgsMaterialWrap");
                $(".materialWrap").append('<ul class="template-lists scrollPanl clearfix"></ul><div class="load_tip" style="display:none;">加载中...</div>');
                $(".materialWrap ul").html(data);
                total_page=$("#totalPage").val();
            }else{
                $(".materialWrap .template-lists").append(data);
                canAjax=true; 
            }
        }
    });
}
//初始化请求图片列表
var initMyImgList=function(){
    $(".img_search_wrap").show();
    $(".img_search_wrap .upload_img_wrap").show().siblings().hide();
    $(".img_select_wrap").show().siblings().hide();
    $(".img_select_wrap a:nth-child(1)").addClass('cur').siblings().removeClass('cur');
    $(".load_tip").show().html("加载中...");
    $.ajax({
        type: "post",
        dataType: "html",
        url: "myimg_list?_dc="+Math.random(), 
        data: {
            "size":page_size,
            "page": page_index
        },
        success: function (data) {
            $(".load_tip").hide();
            if(isInitData==1){
                $(".materialWrap").html('').addClass("imgsMaterialWrap");
                $(".imgsMaterialWrap").height($(".styleShow").height()-64);
                $(".materialWrap").append('<ul class="image-lists scrollPanl clearfix"></ul><div class="load_tip" style="display:none;">加载中...</div>');
                $(".materialWrap ul").html('');
                $(".materialWrap ul").html(data);
                total_page=$("#totalPage").val();
                console.log(">---------"+total_page);
            }else{
                $(".materialWrap .image-lists").append(data);
                canAjax=true; 
            }
        }
    });
}

var imgKeyWordStr='';
var imgKeyWord='风景';

//请求在线图库
var canLoadOnlineImgs=true;
var initOnlineImgs=function(){
     console.log("cateName:"+cateName);
     console.log("imgKeyWord:"+imgKeyWord);
     imgKeyWordStr=cateName+' '+imgKeyWord;
     console.log("imgKeyWordStr:"+imgKeyWordStr);
     //console.log("isInitData:"+isInitData);
    $(".img_select_wrap").show().siblings().hide();
    $(".img_search_wrap").show();
    $(".img_search_wrap .img_search_bar").show().siblings().hide();
    $(".load_tip").show().html("加载中...");
    $.ajax({
        type: "get",
        dataType: "html",
        url: "onlineimg_list?_dc="+Math.random(), 
        data: {
            "pageNum":page_index,
            "keyWord":encodeURI(encodeURI(imgKeyWordStr))
        },
        success: function (data) {
            $(".load_tip").hide();
            if(isInitData==1){
                $(".materialWrap").html('').addClass("imgsMaterialWrap");
                $(".imgsMaterialWrap").height($(".styleShow").height()-64);
                $(".materialWrap").append('<ul class="image-lists  scrollPanl clearfix"></ul><div class="load_tip" style="display:none;">加载中...</div>');
                $(".materialWrap ul").html(data);
                //total_page=$("#totalPage").val();
            }else{
                var onlineImgsLen=$(data).find(".no_data").length;
                //alert(onlineImgsLen);
                //没有数据
                if(onlineImgsLen >0){
                   canLoadOnlineImgs=false;
                   return;
                }
                canLoadOnlineImgs=true;
                $(".materialWrap .image-lists").append(data);
                canAjax=true; 
            }
        },
        error: function(){
           weui.toast("请求出错！","error");
        }
    });


}

//根据菜单切换请求素材
var reqMaterials=function(obj,type1,type2,type3){
   
    console.log("当前请求的分类是：（"+type1+","+type2+","+type3+"）");
     isInitData=1;
     page_index=0;
     canAjax=true;
     $(".img_search_wrap").hide();
     $(".materialWrap").html('').show();
     $(".load_tip").hide();
     $(".template_content").html('');
     $(".style_select_wrap .js_mycollects").removeClass("cur").html('<i class="fa fa-heart-o" aria-hidden="true"></i>收藏');
     if(type1==1){
         initStyleList();
     }else if(type1==2){
         initTemplateList();
     }else{
         isInitMyImgs=0;
         initOnlineImgs();
     }
}
//请求单个模板
var reqSingleTemplate=function(obj,useType){
     var templateId=$(obj).parents("li").attr("data-id");
     $.ajax({
        type: "post",
        dataType: "json",
        url: "single_template?_dc="+Math.random(), 
        data: {
            "id":templateId,
        },
        success: function (result) {
            if(result.code==0){
               var data=result.data.actual_content;
               var $content=$('<div>'+data+'</div>');

               if(useType==1){
                   var $section=$content.find(".wemeEditor");
                   var _html='';
                   $section.each(function(){
                       _html += '<li>'+
                                '<div class="style-mask"></div>'+
                                '<div class="style-oprs">'+
                                '<a href="javascript:;" class="opr_btn js_use_one">使用</a>'+
                                '</div>'+$(this).prop("outerHTML")+'</li>';
                   });
                    $(".materialWrap").hide();
                    $(".close_template").show().siblings().hide();
                    $(".template_content").html('<ul class="style-lists">'+_html+'</ul>');
                    var _h=$(".styleShow").height();
                    $(".template_content").height(_h);
                }else{
                   UE.getEditor('editor').execCommand('insertHtml', $content.html());  
                }
            }else{
                weui.toast(data.msg,"error");
            }
            
        }
    });
}
//自定义模板列表查询
var reqCustomTemplate=function(){
    if(!checkLogin()) return;

    $(this).addClass('cur').siblings("li").removeClass("cur");
    
    isInitData=1;
     page_index=0;
     canAjax=true;
     $(".materialWrap").html('');
     $(".load_tip").show().html("加载中...");
      $.ajax({
        type: "post",
        dataType: "html",
        url: "customTemplate_list?_dc="+Math.random(), 
        data: {
            "size":page_size,
            "page": page_index
        },
        success: function (data) {
            $(".load_tip").hide();
            if(isInitData==1){
                $(".materialWrap").html('');
                $(".materialWrap").append('<ul class="template-lists"></ul>');
                $(".materialWrap ul").html(data);
                $(".js_split_template").hide();
                total_page=$("#totalPage").val();
            }else{
                $(".materialWrap .template-lists").append(data);
                canAjax=true; 
            }
        }
    });
}

//请求样式收藏列表
var reqCollectedList=function(obj){
    if(!checkLogin()) return;

     var isReqStyle=$(obj).attr("data-isReqStyle");
     console.log("isReqStyle:"+isReqStyle);
     isInitData=1;
     page_index=0;
     canAjax=true;
     $(".materialWrap").html('');
     $(".load_tip").hide();
    if(isReqStyle==1){
       $(obj).addClass('cur').html('<i class="fa fa-heart" aria-hidden="true"></i>收藏');  
    }else{
       $(obj).addClass('cur').siblings('li').removeClass("cur"); 
    }

    $(".load_tip").show().html("加载中...");
     $.ajax({
            type: "post",
            dataType: "html",
            url: "collected_list?_dc="+Math.random(), 
            data: {
                "size":page_size,
                "page":page_index,
                "type":isReqStyle,
            },
            success: function (data) {

                $(".load_tip").hide();
                if(isReqStyle==1){
                    //渲染样式
                     if(isInitData==1){
                          $(".materialWrap").html('');
                          $(".materialWrap").append('<ul class="style-lists"></ul>');
                          $(".materialWrap ul").html(data);
                          total_page=$("#totalPage").val();
                      }else{
                         $(".materialWrap .style-lists").append(data);
                         canAjax=true; 
                      }
                }else{
                     //渲染模板
                     if(isInitData==1){
                          $(".materialWrap").html('');
                          $(".materialWrap").append('<ul class="template-lists"></ul>');
                          $(".materialWrap ul").html(data);
                          total_page=$("#totalPage").val();
                      }else{
                          $(".materialWrap .template-lists").append(data);
                          canAjax=true; 
                      }
                }
                  
            }
    });
}

var collectedThis=function(obj){
   var curId=$(obj).parents("li").attr("data-id");
   
   var dataType=$(obj).attr("data-type");
   //aleert(dataType);
    $.ajax({
        type: "post",
        dataType: "json",
        url: "collect_add?_dc="+Math.random(), 
        data: {
           "other_id":curId,
           "type":dataType
        },
        success: function (data) {
            if(data.code==0){
               weui.toast("收藏成功","success");
               $(obj).html('<i class="fa fa-heart" aria-hidden="true"></i>');
               if(dataType==0){
                   $(obj).parent().parent().attr("data-collected","1");
               }else{
                   $(obj).parent().attr("data-collected","1");
               }
              
            }else{
               weui.toast(data.msg,"error");
            }
        }
    });
}

//取消收藏
var removeCollectedThis=function(obj){
    var dataType=$(obj).attr("data-type");
    var curId=$(obj).parents("li").attr("data-id");
    
   
    $.ajax({
        type: "post",
        dataType: "json",
        url: "collection_del?_dc="+Math.random(), 
        data: {
           "other_id":curId,
           "type":dataType
        },
        success: function (data) {
            if(data.code==0){
               weui.toast("取消收藏成功","success");
               $(obj).html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
               //$(obj).parent().attr("data-collected","");
                $(obj).parents("li").attr("data-collected","");

               
                
                if(dataType==0){
                  //模板取消收藏
                   if($("a[id='templateCollection']").parent().hasClass('cur')){
                        $("a[id='templateCollection']").click();
                   }
                  
                }else{
                  //样式取消收藏
                  var myclass=$("a[data-isreqstyle=1]").children().eq(0).attr("class");
                  if(myclass=='fa fa-heart'){
                        $("a[data-isreqstyle=1]").click();
                  }
                }
                
                
              
            }else{
               weui.toast(data.msg,"error");
            }
        }
    });
    
}

//初始化请求菜单列表
var initMenuList=function(){
    $.ajax({
          type: "post",
          dataType: "html",
          url: "menu_list?_dc="+Math.random(), 
          data: {
          },
          success: function (result) {
              //console.log(result);
              $(".js_menuListWrap").html(result);
              $(".menu_li1").find(".menu_level2_items:nth-child(1)").addClass('cur');
              cateName=$(".menu_li2").find("li:nth-child(1)").attr("data-name");
              curThirdMenuHtml=$(".menu_li1").find(".menu_level3:nth-child(1)").html();
              $(".menu_li2 .menu_level1").attr("data-name",cateName);
              $(".third_select_wrap").html('<ul><li data-type="" class="cur">全部</li>'+curThirdMenuHtml+'</ul>');
              //初始化请求样式列表
              initStyleList();
          },
          error: function() {                         
              //alert("请求出错！");              
           }
    });
}

var inserSetions=function(obj){
   var _html='';
   var type=$(obj).attr("data-type");
   if(type=='DIV'){
      _html=$(obj).html()+'<p><br/></p>';
   }else{
      _html='<p>'+$(obj).html()+'</p><p><br/></p>';

   }
   ue.execCommand('insertHtml', _html);
}
 
var inserImg=function(obj){
     var _html='';
     var _src=$(obj).parents("li").attr("data-src");
      _html='<section class="wemeEditor">'+
            '<p style="text-align:center">'+
            '<img src="'+_src+'"  alt=""/>'+
            '</p></section></p>';
    ue.execCommand('insertHtml', _html);
}

var delMyimg=function(obj){
    var picId=$(obj).parents("li").attr("data-id");
    weui.confirm('删除之后将无法恢复，确认删除吗',function(bt){
        if(bt=='ok'){
             $.ajax({
                  type: "post",
                  dataType: "json",
                  url: "myimg_del?_dc="+Math.random(), 
                  data: {
                      "picture_id":picId
                  },
                  success: function (result) {
                     if(result.code==0){
                        $(obj).parents("li").remove();  
                     }else{
                        weui.toast(data.msg,"error");
                     }
                  }
           });
        }
   }); 
 
}

var delmyTemplate=function(obj){
    var templateId=$(obj).parents("li").attr("data-id");
    weui.confirm('删除之后将无法恢复，确认删除吗',function(bt){
        if(bt=='ok'){
             $.ajax({
                  type: "post",
                  dataType: "json",
                  url: "mytemplate_del?_dc="+Math.random(), 
                  data: {
                      "id":templateId
                  },
                  success: function (result) {
                     if(result.code==0){
                        $(obj).parents("li").remove();  
                     }else{
                        weui.toast(data.msg,"error");
                     }
                  },
                  error:function(){
                     weui.toast("请求出错","error");
                  }
           });
        }
   }); 
 
}



var saveArticle=function(){
  if(!checkLogin()) return;
  var coverPic=$("#coverPic").val();//图片封面URL
  var content = ue.getContent();//获取富文本筐的内容
  var title = $("#title").val();//获取标题字段
  var author= $("#author").val();//获取作者字段
  var digest= $("#digest").val();//获取摘要字段
  var content_source_url=$("#content_source_url").val();//原文链接
  var ascription=$("#ascription option:selected").val();//文章归属哪个公众号[不填的时候每个文章都有]
  if(content==''|| title=='' || author==''){
       weui.toast("正文、标题、作者均不能为空！","warn",800);
      return false;
  }
  if(title.length>64){
     weui.toast("标题过长！","warn",800);
    return false;
  }
  if(author != "" && author.length>8){
    weui.toast("作者过长！","warn",800);
    return false;
  }
  if(digest.length>120){
    weui.toast("摘要过长！","warn",800);
    return false;
  }

   //提交时如果摘要为空则截取正文前54个字
  if(digest==''){
      digest=ue.getContentTxt().substring(0,54);  
   }

  var url = article_uuid?"update_my_single_article":"add_my_single_article";
  $.ajax({
      type: "post",
      dataType: "json",
      url: url+"?_dc="+Math.random(), 
      data: {
          "uuid":article_uuid,
          "content":content,//内容
          "title": title,//标题
          "author":author,//作者
          "digest":digest,//摘要
          "content_source_url":content_source_url,//原文链接
          "show_cover_pic":1,//是否显示封面
          "article_ascription_num":ascription,//文章归属哪个公众号[不填的时候每个文章都有]
          "cover_pic":coverPic//封面图片地址
      },
      success: function (data) {  
          if(data.code==0){
              weui.toast("文章保存成功","success");
          }else{
              weui.toast(data.msg,"error");
          }

      }
  });
}

//下面用于多图片上传预览功能
// 用于保存当前选择的文件列表，用来提交
var curFiles = [];
var maxUpImg=5;
var upImgsLength=0;
var fileList;
var docObj;
var isUpLocalImg=1;
var onlineImgUrl;
var chooseFile;
var coverPicType=1;//1需要、2我的图库中图片不需要上传
var setImagePreviews=function(avalue) {
    var imgNums = parseInt($("#imgViewWrap").attr("num"));

    docObj = document.getElementById("imagesUp");
    fileList = docObj.files;
    // 先将全部文件赋给curFiles
    Array.prototype.push.apply(curFiles, fileList);
    $(".upload_picker").hide();
    $("#imgViewWrap").attr("num",imgNums+fileList.length);
    // 循环遍历文件
    for (var i = 0; i < fileList.length&&i<maxUpImg; i++) {
        $("#imgViewWrap").append('<li class="uploader_file"><img id="img'+(imgNums+i)+'" class="imgs"/><div class="selected_mask"><div class="selected_mask_icon"></div></div></li>');

          var imgObjPreview = document.getElementById("img"+(imgNums+i));
          //imgObjPreview.src = docObj.files[0].getAsDataURL();
          //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
          imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
          upImgsLength=$(".uploader_file").length;  
    }  
    $(".upload_picker").show().removeClass("absoluted"); 
    $(".js_imageupload").html('<i class="iconfont icon-tianjia1"></i>');
    return true;
}
var uploadOnlieImg=function(){
     $.ajax({
         type: "post",
         dataType: "json",
         url: "online_search?_dc="+Math.random(), 
         data: {
            "imgUrl":onlineImgUrl
         },
         success: function (data) {  
            if(data.code==0){
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "add_picture?_dc="+Math.random(), 
                    data: {
                        "urls":data.data,//内容
                        "type": "456",//标题
                        "label":"123"
                    },
                    success: function (data) {  
                        if(data.code==0){
                            
                            $(".menu_btn.cur").click();
                            closeDialog();//关闭窗口
                            weui.toast("上传成功","success");
                        }else{
                            weui.toast("上传失败","error");
                        }
                    }
                });
            }else{
               weui.toast(data.msg,"error");
            }
         }
     }); 
}
 //上传文章的封面
var  uploadCoverImg=function(){
    var file = document.getElementById("file").files;
    var fd = new FormData();
    fd.append('file', file[0]);
    console.log("要上传的文件对象列表："+fd);
    $.ajax({
         type: "post",
         url: "/upload/qiniu_upload_img?_dc="+Math.random(), //请求的url
         data: fd,
         processData: false,
         //必须false才会自动加上正确的Content-Type   
         contentType: false,
         success: function(rs) {
            var result=JSON.parse(rs);
            if(result.code==0){
                var myStyle="background: url("+result.data.file+") no-repeat center center;background-size: cover;";
                $("#js_setCoverPic").attr("style",myStyle);
                $("#coverPic").val(result.data.file);
                $(".js_upload_cover").hide();
                $(".js_del_cover").show();
                weui.toast("上传成功","success");
            }else{
                 weui.toast("上传失败","error");
            }
         },
         error: function(XMLHttpRequest, textStatus, errorThrown) {    
           console.log("ajax错误"); 
           console.log("XMLHttpRequest.status：" + XMLHttpRequest.status); 
           console.log("XMLHttpRequest.readyState：" + XMLHttpRequest.readyState);                         
           console.log("textStatus：" + textStatus);    
            weui.toast("上传失败","error");
          
         }
     });
}
var uploadLocalImg=function(){
   var htmlResult="";//返回结果集合
   var flag=1;//1表示上传成功  0表示上传失败
   var num=0;
   //遍历已选择的图片列表
   chooseFile.each(function(){
      //alert(curFiles.length);
      var _index=$(this).index();
      for(i=0;i<curFiles.length;i++){
        if(_index==i){
          // 构建FormData对象
          var fd = new FormData();
          fd.append('file', curFiles[i]);
          console.log("要上传的文件对象列表："+fd);
          $.ajax({
               type: "post",
               url: "/upload/qiniu_upload_img?_dc="+Math.random(), //请求的url
               data: fd,
               processData: false,
               //必须false才会自动加上正确的Content-Type   
               contentType: false,
               success: function(rs) {
                 console.log("中国"+rs); 
                 var result=JSON.parse(rs);

                 console.log("ajax成功"); 
                 console.log(result);
                 console.log(result.data);
                 var result=JSON.parse(rs);
                  if(result.code==0){
                     htmlResult+=result.data.file+",";
                 }else{
                     //alert('上传失败');
                     htmlResult+="第"+(i+1)+"个文件上传失败<br/>";
                      flag=0;
                 }
                 num++;
                 uploadCallBack(chooseFile,htmlResult,num,flag);
                 console.log("result.data.file:"+result.data.file);
                  if(isSetCoverPic && coverPicType==1){
                       var myStyle="background: url("+result.data.file+") no-repeat center center;background-size: cover;";
                       $("#js_setCoverPic").attr("style",myStyle);
                       $("#coverPic").val(result.data.file);
                       $(".js_upload_cover").hide();
                       $(".js_del_cover").show();
                       return;
                   }
                 
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {    
                 htmlResult+="第"+(i+1)+"个文件上传失败<br/>";
                 flag=0;
                 num++;
                 uploadCallBack(chooseFile,htmlResult,num,flag);                 
               }
           });

        } 
     } 

   });
}
var upImgs=function(){
    chooseFile=$(".uploader_file.cur");
    if(chooseFile.length==0){
       $(".uploadImgDialog .warn_Wrap").show().html('请选择要上传的文件！');
       setTimeout(function(){
           $(".uploadImgDialog .warn_Wrap").fadeOut();
        },800);
       return;
    }

    if(chooseFile.length>=10){
       $(".uploadImgDialog .warn_Wrap").show().html("单次最多可选10张");
       setTimeout(function(){
           $(".uploadImgDialog .warn_Wrap").fadeOut();
        },800);
       return;
    }

    console.log("isSetCoverPic："+isSetCoverPic);
     console.log("coverPicType:"+coverPicType);
    //确定时判断是上传图片还是设置封面，如果是上传图片则只上传图片，
    //如果是设置封面 判断选择的是本地图片还是我的图库图片，前者需先上传后者不需要
    if(isSetCoverPic){

        if(coverPicType ==1){
           //本地上传
           uploadLocalImg();
        }else{
           //不需要上传
           var _imgSrc=chooseFile.find("img").attr("src");
           console.log("_imgSrc:"+_imgSrc);
           closeDialog();
           var myStyle="background: url("+_imgSrc+") no-repeat center center;background-size: cover;";
           $("#js_setCoverPic").attr("style",myStyle);
           $("#coverPic").val(_imgSrc);
           $(".js_upload_cover").hide();
           $(".js_del_cover").show();

        }

    }else{
       if(isUpLocalImg==1){
           //上传本地图片
           uploadLocalImg();
        }else{
           //上传在线图片
           uploadOnlieImg();
        }  
    }

    
      
}
//多图片上传，失败或者成功的回调方法
function uploadCallBack(chooseFile,result,num,flag){
  
   if(num==chooseFile.length){
      if(flag==1){
          //往我的图片中插入记录
          $.ajax({
                type: "post",
                dataType: "json",
                url: "add_picture?_dc="+Math.random(), 
                data: {
                    "urls":result,//内容
                    "type": "456",//标题
                    "label":"123"
                },
                success: function (data) {  
                    if(data.code==0){
                         $(".menu_btn.cur").click();
                          closeDialog();//关闭窗口
                          isInitMyImgs=1;
                          alert(isInitMyImgs);
                          initMyImgList();
                          weui.toast("上传成功","success");
                    }else{
                        weui.toast("上传失败","error");
                    }
                }
            });

        
      }else{
        weui.toast("上传失败","error");
      }
      
   }
}


// 检测剩余字数
function wordNumLimit(obj,maxLen){

    wordLength = $(obj).val().length;
    if(wordLength > maxLen){
        // $(obj).val($(obj).val().substring(0,maxLen));
        // wordLength = maxLen;
        $(obj).siblings('.frm_counter').css("color","#f24d4d");
    }else{
        $(obj).siblings('.frm_counter').css("color","#ccc");
    }
    $(obj).siblings('.frm_counter').html(wordLength+'/'+maxLen);
};
function loadEditContent(){
  var uuid = getQueryByName("uuid");
  var url = getQueryByName("url");
  var type = getQueryByName("type");
  if(uuid){
    article_uuid = uuid;
    $.post("myArticle/my_single_article_detail",{
      uuid: uuid
    },function(result){
      if(result.code == 0){
        
        $("#title").val(result.data.title);
        $("#author").val(result.data.author);
        $("#digest").val(result.data.digest);
        $("#content_source_url").val(result.data.content_source_url);

        if(result.data.cover_pic){
          $("#js_setCoverPic").attr("style","background:#fff url("+result.data.cover_pic+") no-repeat center center;background-size: cover;");//封面
          $("#coverPic").val(result.data.cover_pic);
          $(".js_upload_cover").hide();
          $(".js_del_cover").show();
        }
        setTimeout(function(){
          var find = false;
          $("#ascription option").each(function(i,n){
            if($(n).text()==result.data.app_name)
            {
              $(n).attr("selected",true);
              find = true;
            }
          })
          if(!find){
            $("#ascription").append("<option>"+result.data.app_name+"</option>")
          }
        },500);
        
        //延迟一下，等它加载完成
        ue.ready(function(){
          ue.execCommand('insertHtml', result.data.content);
        });
      }
    });
  }else if(url){
    $.post("/import_article",{
      url: url
    },function(result){
      if(result.code == 0){
        
        $("#title").val(result.data.title);
        $("#author").val(result.data.author);
        $("#digest").val(result.data.digest);
        $("#content_source_url").val(result.data.content_source_url);
        if(result.data.thumb_url){
          $("#js_setCoverPic").attr("style","background:#fff url("+result.data.thumb_url+") no-repeat center center;background-size: cover;");//封面
          $("#coverPic").val(result.data.cover_pic);
          $(".js_upload_cover").hide();
          $(".js_del_cover").show();
        }
        setTimeout(function(){
          var find = false;
          $("#ascription option").each(function(i,n){
            if($(n).text()==result.data.app_name)
            {
              $(n).attr("selected",true);
              find = true;
            }
          })
          if(!find){
            $("#ascription").append("<option>"+result.data.app_name+"</option>")
          }
        },500);
        

        //延迟一下，等它加载完成
        ue.ready(function(){
          ue.execCommand('insertHtml', result.data.content);
        });
      }
    });
  }else{ 
    if(!window.localStorage){
      console.log("您的浏览器不支持localStorage");
    }else{
      ue.ready(function(){
        var content = localStorage.getItem("we-editor-local-content");
        if(!content || content.trim()==""){
          return;
        }
        ue.setContent(content);
      });
    }
  }
}

var initAppList = function(){
  $.get("/authorize/list",function(result){
    // result = JSON.parse(result);
    if(result.code == 0 && result.data!=null){
      for(var i in result.data){
        var app = result.data[i];
        $("#ascription").append("<option>"+app.nick_name+"</option>")
      }
    }
  });
}
var changeDivHeight=function(){
  var windowHeight=$(window).height();
  var headHeight=$(".header").height();
  var footHeight=$(".footer").height();
  var mainBodyHeight=windowHeight-headHeight-footHeight;
  console.log("mainBodyHeight:"+mainBodyHeight);
  $(".main_body").css("height",mainBodyHeight);
  ue.ready(function(){
      var editorWrapperHeight=$(".editorWrapper").height();
      var toolbarboxHeight=$(".edui-editor-toolbarbox").height();
      var eidtPanlHeight=editorWrapperHeight-toolbarboxHeight;
      $(".edui-editor-iframeholder").css("height",eidtPanlHeight);
  });
}
var autosave_timer;
var autoSaveContent = function(){
  if(!window.localStorage){
    console.log("您的浏览器不支持localStorage");
  }else{ 
    ue.ready(function(){
      autosave_timer = setInterval(function(){
        var content = ue.getContent();
        if(!content){
          content = "";
        }

        localStorage.setItem("we-editor-local-content",content)
        //console.log("自动保存："+content);
      },1000);  
    });
  }
}
var init = function(){
        ue = UE.getEditor('editor');
        //初始化布局高度设置
        changeDivHeight();
        //当浏览器窗口大小改变时，重置高度  
        window.onresize=function(){  
           changeDivHeight(); 
        }  
         //初始化请求菜单列表
        initMenuList();
        initAppList();
        autoSaveContent();

        loadEditContent();
        //菜单展开收起
         $(".select-menu").delegate('.js_fold','click',function(){
              var menu_level1= $(this).parents(".menu_level1");
              menu_level1.toggleClass("active").next(".menu_level2").slideToggle();
              menu_level1.parents(".menu_li").siblings(".menu_li").find(".menu_level1").removeClass("active");
              menu_level1.parents(".menu_li").siblings(".menu_li").find(".menu_level2").slideUp();
              $(".menu_level1").each(function(){
                  if($(this).hasClass("active")){
                      $(this).find(".js_fold").removeClass("icon-down").addClass("icon-h3");
                  }else{
                      $(this).find(".js_fold").addClass("icon-down").removeClass("icon-h3");
                      
                  }
              });
              
              return false;
         });
        
        //样式区滚动条滚动到底部时加载更多
        $(".materialWrap").scroll(function () {
            var bot=0;
            var currBox = $(this);
            var currBoxHeight = currBox.height();
            var scrollTop = currBox.scrollTop();
            var docHeight = currBox.find(".scrollPanl").height();
            //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
            //我们需要去异步加载数据了
            if ((bot + scrollTop) >= docHeight - currBoxHeight) {
                isInitData=0;
                console.log("滚动了该加载数据了");
                console.log(page_index+1);
                console.log(canAjax);
                console.log("isInitMyImgs:"+isInitMyImgs);

                if(canAjax){
                  setTimeout(function(){
                       if(canLoadOnlineImgs==false){
                         $(".load_tip").show().html("没有更多了！");
                          return false;
                       }
                       if(isInitMyImgs==1 && (page_index+1 >= total_page) ){
                          $(".load_tip").show().html("没有更多了！");
                          return false;
                        }
                        page_index++;
                       
                        if(category==1){
                             initStyleList();
                         }else if(category==2){
                             initTemplateList();
                         }else{
                            if(isInitMyImgs==1){
                               initMyImgList();
                            }else{
                               initOnlineImgs();
                            }

                         }
                        console.log('当前页数'+page_index);
                  },500);
                    canAjax=false;
                }
                      
                
                
            }
        });
       
       
       //一级菜单分类查询
       $(".select-menu").delegate('.menu_level1','click',function(){
              $(".menu_level1").removeClass("cur");
              $(".menu_level2 li").removeClass("cur");
              $(this).addClass("cur");
              category=$(this).attr("data-category");
              style_type=$(this).attr("data-type");
              cateName=$(this).attr("data-name");
              var curThirdMenu=$(this).siblings('.menu_level2').find('.menu_level3');
              curThirdMenuHtml=curThirdMenu.html();
              $(".third_select_wrap").html('<ul><li data-type="" class="cur">全部</li>'+curThirdMenuHtml+'</ul>');
               second_type='';
              reqMaterials($(this),category,style_type,second_type);
       });
      
       //二级菜单分类查询
       $(".select-menu").delegate('.menu_level2 li','click',function(){
              $(".menu_level1").removeClass("cur");
              $(".menu_level2 li").removeClass("cur");
              $(this).addClass("cur");
              category=$(this).parents("ul").siblings(".menu_level1").attr("data-category");
              style_type=$(this).attr("data-type");
              cateName=$(this).attr("data-name");
              var curThirdMenu=$(this).find('.menu_level3');
               curThirdMenuHtml=curThirdMenu.html();
               $(".third_select_wrap").html('<ul><li data-type="" class="cur">全部</li>'+curThirdMenuHtml+'</ul>');
               second_type='';
              reqMaterials($(this),category,style_type,second_type);
       });

       //样式三级分类查询
      $(".select-show-top").delegate('.menu_level3 li','click',function(){
             second_type=$(this).attr("data-type");
             $(this).addClass('cur').siblings().removeClass('cur');
             reqMaterials($(this),category,style_type,second_type);
      });
      
      //收藏列表查询（样式、模板）
      $(".select-show-top").delegate('.js_mycollects','click',function(){
          reqCollectedList($(this));
      });
      //模板分类查询
      $(".select-show-top").delegate('.template_select_wrap li:nth-child(1)','click',function(){
          $(this).addClass('cur').siblings("li").removeClass("cur");
          reqMaterials($(this),category,style_type,second_type);
      });
      
      //自定义模板查询
      $(".select-show-top").delegate('.template_select_wrap li:nth-child(3)','click',function(){
          $(this).addClass('cur').siblings("li").removeClass("cur");
          reqCustomTemplate();
           
      });
      //模板拆分击事件
      $(".styleShow").delegate('.js_split_template','click',function(){
            reqSingleTemplate($(this),1);
      });

      //点击整套模板
      $(".styleShow").delegate('.js_use_all','click',function(){
            reqSingleTemplate($(this),0);
      });
      
      //点击使用单个模板
      $(".styleShow").delegate('.js_use_one','click',function(){
            var curSection=$(this).parents("li").find(".wemeEditor");
            var _html=curSection.prop("outerHTML");
            ue.execCommand('insertHtml', _html);
      });

      //关闭单个模板
      $(".select-show-top").delegate('.js_close_template','click',function(){
            $(".close_template").hide().siblings("ul").show();
            $(".template_content").html('');
            $(".materialWrap").show();
      });

       //样式选择事件
       $(".styleShow").delegate('.style_pice','click',function(){
           inserSetions($(this));
       });
       //样式、模板收藏
       $(".styleShow").delegate('.js_collectedThis','click',function(){
          
          var collected=$(this).parent().attr("data-collected");
          if(collected==1){
            //alert("已经收藏");
          }else{
            collectedThis($(this));
          }
          
       });
      //我的模板删除
       $(".styleShow").delegate('.js_delmyTemplate','click',function(){
             delmyTemplate($(this));
       });

       //撤销换色
       $(".select-show-top").delegate('.js_reset_color','click',function(){
           console.log(category,style_type,second_type);
           $(".js_color_picker").removeAttr("data-color");
           isInitData=1;
           page_index=0;
           canAjax=true;
           initStyleList();

       });

       $(".styleShow").delegate('.collectedThis','click',function(){
            var dataType=$(this).attr("data-type");
            if(dataType==0){
                 //模板取消收藏
                var collected=$(this).parent().parent().attr("data-collected");
                if(collected==1){
                  removeCollectedThis($(this));
                }
            }else{
               //样式取消收藏
                var collected=$(this).parent().attr("data-collected");
                if(collected==1){
                  removeCollectedThis($(this));
                 }
            }
          
       });
  


       //图片检索tab切换
       $(".select-show-top").delegate('.img_tab_head .tab_btn','click',function(){
           if($(this).hasClass('cur')) return;

           $(this).addClass('cur').siblings(".tab_btn").removeClass("cur");
           var _index=$(this).index();
           isInitMyImgs=_index;
           console.log("isInitMyImgs----->:"+isInitMyImgs);
           $(".img_search_wrap .search_options").eq(_index).show().siblings(".search_options").hide();
           isInitData=1;
           page_index=0;
           canAjax=true;
           if(isInitMyImgs==1){
               initMyImgList();
           }else{
               initOnlineImgs();
           }

       });

       //关键字图片搜索
       $(".styleShow").delegate('#imgKeyWord','keyup',function(e){
            
            if(e.keyCode == 13){
              isInitData=1;
              page_index=0;
              canAjax=true;
              imgKeyWord=$(this).val();
              initOnlineImgs();
              }
       });
      //关键字图片搜索
       $(".styleShow").delegate('.js_searchImg','click',function(){
           isInitData=1;
            page_index=0;
            canAjax=true;
           initOnlineImgs();
       });

       //图片插入事件
       $(".styleShow").delegate('.pic_wrap','click',function(){
           inserImg($(this));
       });

       //我的图库图片删除
       $(".styleShow").delegate('.js_del_img','click',function(){
             delMyimg($(this));
       });
      $(".upload_head li").click(function(){
            $(this).addClass("cur").siblings("li").removeClass("cur");
            var _index=$(this).index();
            $(".img_con").eq(_index).show().siblings(".img_con").hide();
            $(".uploader_file").removeClass('cur');
            isUpLocalImg=_index+1;
            coverPicType=$(this).attr("data-type");
            console.log("当前上传的是本地图片？"+ isUpLocalImg);
       });
       //打开图片上传弹框时的一些操作
        var openUploadShowHide=function(){
            $(".uploadImgDialog").show();
            $(".modal-backdrop").show();
            $(".uploadImgDialog .upload_head li").hide().removeClass("cur");
            $(".uploadImgDialog .upload_head li:nth-child(1)").show().addClass("cur");
            $(".uploadImgDialog .img_con").hide();
            $(".uploadImgDialog .img_con1").show();
            $(".js_imageupload").html('<i class="iconfont icon-bendishangchuan"></i>');
            $("#imgViewWrap").html('').attr("num",0);
            $(".upload_picker").addClass("absoluted");
        }
       //打开图片上传弹框
       $(".js_open_upload").click(function(){
            if(!checkLogin()) return;
            isSetCoverPic=0;
            $(".uploadImgDialog .modal-head").text("图片上传");
            openUploadShowHide();
            $(".uploadImgDialog .upload_head li:nth-child(2)").show();
       });
        //点击封面设置
        var page_ind=0;
       $("#js_setCoverPic").click(function(){
             if(!checkLogin()) return;
             isSetCoverPic=1;
             $(".uploadImgDialog .modal-head").text("封面设置");
             openUploadShowHide();
             $(".uploadImgDialog .upload_head li:nth-child(3)").show();

       });


       //封面设置-本地图片请求
      $(".js_getMyImgs").click(function(){
          $.ajax({
              type: "post",
              dataType: "json",
              url: "myimg_select_list?_dc="+Math.random(), 
              data: {
                  "size":page_size,
                  "page": page_ind
              },
              success: function (result) {
                   //console.log(result);
                   if(result.code==0){
                        var data=result.data.list;
                        var _html='';
                        for(i=0;i<data.length;i++){
                            _html+='<li class="uploader_file" data-id="'+data[i].id+'"><img class="imgs" src='+data[i].url+'>'+
                                   '<div class="selected_mask"><div class="selected_mask_icon"></div></div></li>';
                        }
            
                        $("#myimg_select_wrap").html(_html);
                   }else{
                       weui.toast(weui.msg,'success');
                   }
              },
              error:function(){
                 weui.toast("请求出错！",'error');
              }
          });
      });
      
       //上传预览图片
       $("#imagesUp").on('change',function(){
           setImagePreviews();
       });
       
       //图片选择事件
       $(".upload_imgs").delegate('.uploader_file','click',function(){
            if(isSetCoverPic){
                $(this).addClass("cur").siblings(".uploader_file").removeClass("cur");
            }else{
              $(this).toggleClass("cur");
            }
            
       });
       
       //图片弹框确定事件
       $("#imgUpSure").click(function(){
           //ajax图片上传到七牛云
           upImgs();
       });
       //在线搜索
       $("#imgUrl").on('change keyup',function(){
           onlineImgUrl=$(this).val();
            
            var _html='<li class="uploader_file">'+
                      ' <img src="'+onlineImgUrl+'" alt="">'+
                      '<div class="selected_mask"><div class="selected_mask_icon"></div></div>'+
                      '</li>';
            $("#onlineImgVeiw").html(_html);
         
       });
     
        //清空
        $('#clear-editor').click(function(){  
             weui.confirm('是否确认清空内容，清空后内容将无法恢复',function(bt){
                if(bt=='ok'){
                    ue.setContent("");
                }
             });     
        });

        //复制
         var clientAll = new ZeroClipboard($('#copy-editor-html'));
         clientAll.on('ready',function(event) {
             clientAll.on('copy', function(event) {
                var _html=UE.getEditor('editor').getContent();
                //alert(_html);
                event.clipboardData.setData('text/html', _html);
                event.clipboardData.setData('text/plain', _html);
                 weui.toast("已成功复制到剪切板","success");
            });
        });
        //导入素材确定
        $("body").delegate('#importArticleSure','click',function(){
            importArticleNext();
        });

        //字数检测
        $(".pub_input").on("change keyup",function(){
            var max=parseInt($(this).attr("data-max"));
             wordNumLimit($(this),max);
        });
       
       //预览
       $("#preViewArctile").click(function(){
           $(".jsPhoneView").show();
           $(".phone_view_wrap").html('');
           $(".phone_view_wrap").html(ue.getContent());
       });

       //关闭预览
       $(".close_PhoneView").click(function(){
          $(".jsPhoneView").hide();
       });

       //删除封面
       $(".js_del_cover").click(function(){
           $(this).hide();
           $(".js_upload_cover").show();
           $("#coverPic").val('');
           $("#js_setCoverPic").attr("style","background:#fff url('') no-repeat center center;background-size: cover;");

       });
 
        //保存文章
        $(".js_saveArticle").click(function(){
            saveArticle();
        });

        //存为模板
        $("#save-template").click(function(){
          if(!checkLogin()) return;
          $("#myTempName").val('');
          $(".temp_name_wrap .err_tips").hide();
          var content = ue.getContent();//获取富文本筐的内容
          if(content==''){
            weui.toast("请填写模板内容","warn",800);
            return false;
          }
          
          $(".saveTemplateDialog").show();
          $(".modal-backdrop").show();
        });

       //存为模板确认
       $("body").delegate('#saveAsTemplate','click',function(){
             myTempName=$("#myTempName").val();//模板名称
             if(myTempName==''){
                $(".temp_name_wrap .err_tips").show();
                return false;
             }
              $(".temp_name_wrap .err_tips").hide();
              $.ajax({
                  type: "post",
                  dataType: "json",
                  url: "add_custom_template?_dc="+Math.random(), 
                  data: {
                      "title":myTempName,//标题
                      "actual_content": ue.getContent() //模板实际内容
                  },
                  success: function (data) {  
                      if(data.code==0){
                          weui.toast("保存成功","success");
                          closeDialog();
                      }else{
                          weui.toast(data.msg,"error");
                      }
                  }
              });
       });
      //关闭弹框
      $(".js-close-dialog").click(function(){
           closeDialog();
      });
      

};

exports.init = init;
});
