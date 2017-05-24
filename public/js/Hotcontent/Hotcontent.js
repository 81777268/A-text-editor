define( 'Hotcontent/Hotcontent', ['common/weui'], function( require, exports, module){
var arr1=['全部','生活民生','流行时尚','情感励志','娱乐影视','餐饮美食','金融理财','搞笑幽默','IT互联网','汽车机车','健康养生','美容美妆','母婴育儿','文学艺术','运动健康','游戏动漫','星座命理','广告营销','创业管理','时事咨询','文化教育','家具房产','职场管理','摄影','旅游','宠物','军事','两性','学术',
'政务','地方'];

var arr2=['3天内','7天内'];

var arr3=['阅读数','点赞数','发布时间'];
var arr4=['文章标题','摘要','阅读数','赞数','公众号名称','发布时间','文章类型','操作'];

function GetDateStr(AddDayCount) {
   var dd = new Date();
   dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
   var y = dd.getFullYear();
   var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
   var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
   return y+"-"+m+"-"+d;
}

$('#lasttime').html(GetDateStr(-1)) //事件选择初始化


  var init = function() {//********************
var weui = require('../common/weui');
$('.btn').click(function() {  //测试数据

      $.ajax({
        type: "post",
        dataType: "json",
        url:'Hotcontent/network_material',
        success: function (data) {
            var text=JSON.parse(data)
          console.log(text.data.items[0].title);
        }
      });
      console.log(arr2);
});

for (let i = 0; i < arr1.length; i++) { //遍历导航栏
  $('.nav_class_content').append('<input type="radio" name="class" id="Class'+i+'" value="X" class="radio"><label for="Class'+i+'" class="radio">'+arr1[i]+'</label>')
};
for (let j = 0; j < arr2.length; j++) { //遍历导航栏
  $('.nav_time_content').prepend('<input type="radio" name="time" id="Time'+j+'" value="" class="radio"><label for="Time'+j+'" class="radio">'+arr2[j]+'</label><em id="id_'+j+'"></em>')
}
for (let i = 0; i < arr3.length; i++) {//遍历导航栏
  $('.nav_order_content').append('<input type="radio" name="order" id="Order'+i+'" value="X" class="radio"><label for="Order'+i+'" class="radio">'+arr3[i]+'</label>')
}

function GetDateStr(AddDayCount) {
   var dd = new Date();
   dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
   var y = dd.getFullYear();
   var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
   var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
   return y+"-"+m+"-"+d;
}

  //获取前七天数组
  var  dateArr=[GetDateStr(-1),GetDateStr(-2),GetDateStr(-3),GetDateStr(-4),GetDateStr(-5),GetDateStr(-6),GetDateStr(-7)];

  for (let i = 0; i < dateArr.length; i++) {  //添加时间选项列表
    $('#dateul').append('<li>'+dateArr[i]+'</li>')
  }

$('input').click(function() {  //添加点击checked
  var cm=$(this).attr("name")
  var input=document.getElementsByName(cm);
  for (let i = 0; i < input.length; i++) {
    input[i].removeAttribute('checked');
  }
  $(this).attr('checked', 'checked');

  if ($('#Time2')[0].checked!=true) {
    $('#dateul').css('display', 'none');
    $('#id_2').css('background-image', 'url(../../images/up_btn.png)');
  }



});

$('.nav_time_content').on('click', '#id_2', function() {
  $('#dateul').css('display', 'block');
      $('#id_2').css('background-image', 'url(../../images/down_btn.png)');
});
$('#Time2').click();
$('#dateul').on('click', 'li', function() {
$('#Time2').trigger('click')
console.log(123);
});





$('#dateul li').click(function() {  //得到事件选项
  var news=$(this).html();
  $('#lasttime').html(news)
  $('#dateul').css('display', 'none');
});

for (let i = 0; i < arr4.length; i++) {
  $('.hottext_title ul').append('<li>'+arr4[i]+'</li>')
}

$('#Class0').attr('checked', 'checked');
$('#Time1').attr('checked', 'checked');
$('#Order0').attr('checked', 'checked');
//<><><><><><><><><>//

//isLogin()   判断登陆函数
if (isLogin()==true) {
  $.ajax({
    url: 'Hotcontent/net_article_page_list',
    type: 'post',
    dataType: 'json',
    success: function (data) {

     var items=JSON.parse(data).data.list;
// console.log(items);
        for (let i = 0; i < items.length; i++) {
          $('.log_in_over').append('<div id="cover" class="cover"><div class="collect_btn"><div class="three three_see"><img src="../images/see_text.png" alt="" id="see_text" class="'+items[i].content_url+'"><span>查看原文</span></div><div class="three three_into"><img src="../images/lead_text.png" alt="" id="lead_text" url="'+items[i].content_url+'"><span>导入此文</span></div><div class="three three_noco"><img src="../images/collect_no.png" alt="" id="collect_no" uid="'+items[i].uid+'"><span>取消收藏</span></div></div></div><div id="module"><span id="titles">'+items[i].title+'</span><br/><span id="contents">'+items[i].digest+'</span><div id="author"><span>'+items[i].wechat_name+'</span><span>'+items[i].date+'</span></div></div>')
        }
        if (items.length==0) {

          $('.log_in_over').css({'background':'#F2F2F2 url(../images/none.png) no-repeat','background-position':'50% 20%'});

          $('.log_in_over').html('<div class="text"><div>您还没有收藏过任何热门文章</div><div>多去看看吧</div></div>')

          $('.text').css({'color':'#888888','text-align':'center','margin-top':'210px'});
        }
    }

  });

$('.collectBtn').mouseover(function() {
  $('.log_in_over').css('display', 'block');
});
  $('.log_in_over').on('mouseover', '#module', function() {
  var s=$(this).prev('div')[0].style.width='228px'
});
  $('.log_in_over').on('mouseover', '.cover', function() {
    var s=$(this)[0].style.width='228px'
});
  $('.log_in_over').on('mouseleave', '#module', function() {
  var s=$(this).prev('div')[0].style.width='0'
});
$('.log_in_over').on('mouseleave', '.cover', function() {
  var s=$(this)[0].style.width='0'
});

$('.log_in_over').on('click', '#see_text', function() {
  var url=$(this)[0].className;
  window.location.href=url;
});
$('.log_in_over').on('click', '#lead_text', function() {
  var urls=$(this).attr('url');
  var url = encodeURIComponent(urls);
  window.location.href="/?url="+url;
});

$('.log_in_over').on('click', '#collect_no', function() {
  var fy=$(this).parents('.cover').siblings('div')
  var del=$(this).parents('div').next()[0];
  var dels=$(this).parents('div')[2];
  var uid=$(this).attr('uid');
  $.ajax({
    type: "post",
    dataType: "json",
    url: 'Hotcontent/del_net_article_collection',
    data: {
           "uid":uid,
    },
    success: function (data) {

      $(dels).animate({height: '0',opacity:0});
      $(del).animate({height: '0',opacity:0});

if (fy.length==1) {
  $('.log_in_over').css({'background':'#F2F2F2 url(../images/none.png) no-repeat','background-position':'50% 20%'});

  $('.log_in_over').html('<div class="text"><div>您还没有收藏过任何热门文章</div><div>多去看看吧</div></div>')

  $('.text').css({'color':'#888888','text-align':'center','margin-top':'210px'});
}
    },
    error:function(err) {
      console.log(err);
    }
  });

});
//收藏后传
$('.hottext_cot').on('click', '#collect', function() {

  var uid=$(this).parents('ul')[0].id
  var url=$(this)[0].className


  var code = encodeURI(url);
console.log($(this)[0]);

  $(this).css('background-image', 'url(../../images/collect_over.png)');

       $.ajax({
         type: "post",
         dataType: "json",
         url: 'Hotcontent/add_net_article',
         data: {
                "uuid":uid,
                 "url":code
         },
         success: function (data) {
             weui.toast(data.msg,"success");
           $('.log_in_over').empty();
           $.ajax({
             url: 'Hotcontent/net_article_page_list',
             type: 'post',
             dataType: 'json',
             success: function (data) {
              // weui.toast("密码更改成功","success");
              var items=JSON.parse(data).data.list;
                 for (let i = 0; i < items.length; i++) {
                   $('.log_in_over').append('<div id="cover" class="cover"><div class="collect_btn"><div class="three three_see"><img src="../images/see_text.png" alt="" id="see_text" class="'+items[i].content_url+'"><span>查看原文</span></div><div class="three three_into"><img src="../images/lead_text.png" alt="" id="lead_text" url="'+items[i].content_url+'"><span>导入此文</span></div><div class="three three_noco"><img src="../images/collect_no.png" alt="" id="collect_no" uid="'+items[i].uid+'"><span>取消收藏</span></div></div></div><div id="module"><span id="titles">'+items[i].title+'</span><br/><span id="contents">'+items[i].digest+'</span><div id="author"><span>'+items[i].wechat_name+'</span><span>'+items[i].date+'</span></div></div>')
                 }
                 if (items.length==0) {

                   $('.log_in_over').css({'background':'#F2F2F2 url(../images/none.png) no-repeat','background-position':'50% 20%'});

                   $('.log_in_over').html('<div class="text"><div>您还没有收藏过任何热门文章</div><div>多去看看吧</div></div>')

                   $('.text').css({'color':'#888888','text-align':'center','margin-top':'210px'});
                 }

             }

           });



         },
         error:function(err) {
           console.log(err);
         }
       });

});

};

if (isLogin()==false) {
  $('.collectBtn').mouseover(function() {
    $('.log_in_no').css('display', 'block');
  });

$('.hottext_cot').on('click', '#collect', function() {
  if(!checkLogin()) return;
});



}

// console.log(isLogin());


$('.log_in_no').mouseleave(function() {
  $('.log_in_no').css('display', 'none');
});
$('.log_in_over').mouseleave(function() {
  $('.log_in_over').css('display', 'none');
});




//go
var j = 1; //设置当前页数
//滚动加载
$(function(){
    var winH = $(window).height(); //页面可视区域高度

    $(window).scroll(function () {
        var pageH = $(document.body).height();
        var scrollT = $(window).scrollTop(); //滚动条top
        var aa = (pageH-winH-scrollT)/winH;
        if(aa<0.0422){



          var ipt=$('input')
          var nes=[];
          var sss=$('#Class0')
          ipt.each(function(index, el) {
          nes.push(el)
          });

          var sss=[];
          for (let i = 0; i < nes.length; i++) {
            if (nes[i].checked==true) {
              sss.push(nes[i])
            }
          };

          var clas=sss[0].nextSibling.innerHTML;
          var time=sss[1].nextSibling.innerHTML;
          var order=sss[2].nextSibling.innerHTML;

          switch (order) {
          case '阅读数':
            order='read_num'
            break;
          case '点赞数':
          order='fav_num'
            break;
          case '发布时间':
          order='date'
            break;
          default:

          };


          switch (time) {
          case '7天内':
            time='7d'
            break;
          case '3天内':
          time='3d'
            break;
          default:

          var search_date=time;
          time='';

          };

          $.ajax({
          type: 'post',
          dataType: 'json',
          url: 'Hotcontent/network_material',
          data:
            {'search':'',
             'content_type':'',
             'search_date':search_date,
             'date_range':time,
             'tags':clas,
             'sort':order,
             'page':j
              },
              beforeSend:function () {
                  if (scrollT>100) {
                       $('.none_texts').append('<div class="wrap_texts">数据正在加载中，请稍等……</div>')

                  }
                },
          success:function (data) {
            var s=JSON.parse(data);
            var comment=s.data.items;
            for (let i = 0; i < comment.length; i++) {
              if (comment[i].video_num==0) {
                comment[i].video_num='视频';
              }else {
                comment[i].video_num='图文';
              };
              $('.hottext_cot').append('<ul id="'+comment[i].uid+'"><li><a href="'+comment[i].content_url+'">'+comment[i].title+'</a></li><li><a href="'+comment[i].content_url+'">'+comment[i].content+'</a></li><li><a href="'+comment[i].content_url+'">'+comment[i].read_num+'</li><li>'+comment[i].fav_num+'</a></li><li>'+comment[i].wechat_name+'</li><li>'+comment[i].date+'</li><li>'+comment[i].video_num+'</li><li><i id="collect" class="'+comment[i].content_url+'" bg="'+comment[i].collected+'"></i><span id="intotext" class="'+comment[i].content_url+'">导入文本</span></li></a></ul>');

          };
          var ht=$("i[id='collect']");

          ht.each(function(index, el) {

            // console.log();
            if (el.getAttribute("bg")==1) {
              el.style.backgroundImage='url(../../images/collect_over.png)'
            }else{
            el.style.backgroundImage='url(../../images/collect.png)'
            }
          });


        },
        complete:function(){
          $('.none_texts').html('')
    }
          })

          j++;

        }else{
          console.log(123);
        }

    });

});
//end



















$('.wrap').on('click', 'input', function() {
  var ipt=$('input')
  var nes=[];
  var sss=$('#Class0')
  ipt.each(function(index, el) {
  nes.push(el)
  });

  var sss=[];
  for (let i = 0; i < nes.length; i++) {
    if (nes[i].checked==true) {
      sss.push(nes[i])
    }
  };

  var clas=sss[0].nextSibling.innerHTML;
  var time=sss[1].nextSibling.innerHTML;
  var order=sss[2].nextSibling.innerHTML;

switch (order) {
  case '阅读数':
    order='read_num'
    break;
  case '点赞数':
  order='fav_num'
    break;
  case '发布时间':
  order='date'
    break;
  default:

};


switch (time) {
  case '7天内':
    time='7d'
    break;
  case '3天内':
  time='3d'
    break;
  default:

  var search_date=time;
  time='';

};

// console.log(search_date);

$.ajax({
  type: 'post',
  dataType: 'json',
  url: 'Hotcontent/network_material',
  data:
    {'search':'',
     'content_type':'',
     'search_date':search_date,
     'date_range':time,
     'tags':clas,
     'sort':order,
      },
  success:function (data) {
    $('.hottext_cot').html('');
    var s=JSON.parse(data);
    if (s.data==null) {
      $('.hottext_cot').append('<div class="none_text"><div class="wrap_text">该选项下没有更多内容，我们正在努力补充中，试试其他选项吧</div></div>')
    }
    var comment=s.data.items;

    for (let i = 0; i < comment.length; i++) {
      if (comment[i].video_num==0) {
        comment[i].video_num='视频';
      }else {
        comment[i].video_num='图文';
      };
      $('.hottext_cot').append('<ul id="'+comment[i].uid+'"><li><a href="'+comment[i].content_url+'">'+comment[i].title+'</a></li><li><a href="'+comment[i].content_url+'">'+comment[i].content+'</a></li><li><a href="'+comment[i].content_url+'">'+comment[i].read_num+'</li><li>'+comment[i].fav_num+'</a></li><li>'+comment[i].wechat_name+'</li><li>'+comment[i].date+'</li><li>'+comment[i].video_num+'</li><li><i bg="'+comment[i].collected+'" id="collect" class="'+comment[i].content_url+'"></i><span id="intotext" class="'+comment[i].content_url+'">导入文本</span></li></a></ul>');

  }
  }
})



});



  $.ajax({
    type: "post",
    dataType: "json",
    url: 'Hotcontent/network_material',
    beforeSend:function () {

    $('.hottext_cot').before('<ul class="loade_text"><li>数据加载中……</li></ul>');

    $('.loade_text li').css({'width':'100%','height':'100%','background-color':'#fff','text-align':'content'});

    },
    success: function (data) {
      // console.log(data);
      var s=JSON.parse(data);
      var comment=s.data.items;
      for (let i = 0; i < comment.length; i++) {
        if (comment[i].video_num==0) {
          comment[i].video_num='视频';
        }else {
          comment[i].video_num='图文';
        };
        $('.hottext_cot').append('<ul id="'+comment[i].uid+'"><li><a href="'+comment[i].content_url+'">'+comment[i].title+'</a></li><li><a href="'+comment[i].content_url+'">'+comment[i].content+'</a></li><li><a href="'+comment[i].content_url+'">'+comment[i].read_num+'</li><li>'+comment[i].fav_num+'</a></li><li>'+comment[i].wechat_name+'</li><li>'+comment[i].date+'</li><li>'+comment[i].video_num+'</li><li><i id="collect" class="'+comment[i].content_url+'" bg="'+comment[i].collected+'"></i><span id="intotext" class="'+comment[i].content_url+'">导入文本</span></li></a></ul>');


$('#log_inBtn').click(function() {  //未登陆状态下点击登陆
  $('.log_in_no').css('display', 'none');
  if(!checkLogin()) return;
});

}
$('li').on('click', '#intotext', function() {

  var urls=$(this)[0].className;
  var url = encodeURIComponent(urls);
  console.log(url);
  window.location.href="/?url="+url;
})


var ht=$("i[id='collect']");

ht.each(function(index, el) {

  // console.log();
  if (el.getAttribute("bg")==1) {
    el.style.backgroundImage='url(../../images/collect_over.png)'
  }else{
    el.style.backgroundImage='url(../../images/collect.png)'
  }
});




    },
    complete:function(){
      $('.loade_text').remove()
    }
  });



$('section').on('mouseleave', '#dateul', function() {
  $('#dateul').css('display','none');
  $('#id_2').css('background-image','url(../../images/up_btn.png)');
});

  }

  exports.init = init;
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


