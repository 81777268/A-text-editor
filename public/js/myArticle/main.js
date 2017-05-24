define( 'myArticle/main', ['common/weui', 'common/jquery.pagination'], function( require, exports, module){

  var weui = require('../common/weui');
  var page_size=12;
  var page_index=0;
  var searchMsgVal="";
  var isReqSingle=1;
  var total = 0;
  var singleTotal=0;
  var cur_article_id;
  var canAjax=true;
  var canLoadMore=true;
  var isNeedSyn;//是否需要同步
  var isAddNewMsg;//是否是新增
  var type = getQueryByName("type");

  //初始化分页加载成功后渲染数据列表
  var pageselectCallback=function(page_index){
    var _url;
    if(isReqSingle==1){
      _url="myArticle/my_single_article?_dc="+Math.random();
    }else{
       _url="myArticle/my_multi_article?_dc="+Math.random();
    }
    $(".loading_wrap").show();
    $.ajax({
      type: "post",
      dataType: "html",
      url: _url,
      data: {
             "size":page_size,
              "page": page_index,
              "search":searchMsgVal
      },
      success: function (data) {
          $(".loading_wrap").hide();
          $(".article-lists").html(data);
           var browserWid=$(window).width();
           //alert(browserWid);
           $("#gallery-wrapper").pinterest_grid({
                    no_columns: 4,
                    padding_x: 15,
                    padding_y: 15,
                    margin_bottom:18,
                    single_column_breakpoint: 700
          });

      }
    });
    return false;
  }

  var reloadListData = function(){
    var _url;
    if(isReqSingle==1){
      _url="myArticle/my_single_article_count?_dc="+Math.random();
    }else{
       _url="myArticle/my_multi_article_count?_dc="+Math.random();
    }
    $.ajax({
      type: "post",
      dataType: "html",
      url: _url,
      data: {
        "search":searchMsgVal
      },
      success: function (result) {
        if(typeof result == "string"){
          result = JSON.parse(result);
        }
        if(isReqSingle == 1){
          $("#single_total_num").val(result.data);
          total = result.data;
          singleTotal= result.data;
         //alert(singleTotal);
        }else{
          $("#multi_total_num").val(result.data);
          total = result.data;
        }

        $("#pagination").pagination(result.data, {
           items_per_page:page_size,//0每页显示的条数
           num_edge_entries:2,//
           num_display_entries:8,//总共的页数
           current_page:0,//当前显示第几页数据
           prev_text:'上一页',
           next_text:'下一页',
           link_to:'#',
           callback: pageselectCallback//回调函数
        });
      }
    });
  }
  var loadTaskDetail = function(id,status){
    $.get("article_sync_task/detail?_dc"+Math.random(),{
      article_id:id,
      status: status,
      type : isReqSingle==1?1:0
    },function(result){
      $("#syncweixinCon").html(result);
    })

  }
  //画图文消息预览
  var multi_media_list='';
  var drawApp1=function(data){
     $(".wx_phone_bd").addClass(".wx_phone_preview_card_wrp");
      //遍历所有的图文消息
       var card_appmsg_str='';
       var rich_media_list='';
      for(i=0;i<data.length;i++){
         card_appmsg_str+='<div class="previewItem">'+
                       '<div class="card_cover_appmsg_item jsPhoneViewCard" data-index="'+i+'">'+
                       ' <div class="card_cover_appmsg_inner" style="background-image:url('+data[i].cover_pic+');">'+
                       ' </div>'+
                       ' <strong class="card_cover_title" title="'+data[i].title+'">'+data[i].title+'</strong>'+
                       ' </div>'+
                       ' <div class="card_appmsg_item jsPhoneViewCard" data-index="'+i+'">'+
                       ' <img class="card_appmsg_thumb" src="'+data[i].cover_pic+'">'+
                       ' <div class="card_appmsg_content" title="'+data[i].title+'">'+data[i].title+'</div>'+
                       ' </div>'+
                       ' </div>';
         rich_media_list+='<div class="rich_media">'+
                          '<div class="rich_media_area_primary">'+
                          '<h2 class="rich_media_title" title="'+data[i].title+'">'+data[i].title+'</h2>'+
                          '<div class="rich_media_meta_list">'+
                          '<em class="rich_media_meta rich_media_meta_text">'+data[i].update_time+'</em>'+
                          '<em class="rich_media_meta rich_media_meta_text">'+data[i].author+'</em>'+
                          '<span class="rich_media_meta rich_media_meta_link" title="请发送到手机查看完整效果">xxx</span>'+
                          '</div>'+
                          '<div class="rich_media_content">'+data[i].content+'</div>'+
                          '</div>'+
                          '</div> ';
      }
      multi_media_list=rich_media_list;
     var msgStrs='<div class="phone_view_wrap"><div class="msg_card wx_phone_preview_multi_card has_first_cover"><div class="msg_card_inner">'+card_appmsg_str+'</div></div></div>';
     $('.wx_phone_bd').html(msgStrs);
  }
  //画消息正文
  var drawApp2=function(){
      $(".wx_phone_bd").removeClass(".wx_phone_preview_card_wrp");
      //如果文章的内容小于2条的时候不显示翻页按钮
      $(".wx_article_crtl").show();

       var msgStrs='<div class="phone_view_wrap"><div class="wx_phone_preview_appmsg appmsg_wap">'+multi_media_list+'</div></div>';
      $('.wx_phone_bd').html(msgStrs);
  }
//当前页从0 开始
var page_ind=0;
var inInitSingleList=1;
var reqSingleMsgList=function(){
     $(".load_tip").show().html("加载中...");
     $.ajax({
          type: "post",
          dataType: "html",
          url: "myArticle/single_msg_list",
          data: {
              "size":page_size,
              "page": page_ind,
              "search":$("#single_msg_input").val()
          },
          success: function (result) {
            var data=JSON.parse(result);
            var items=data.data.list;
            if(data.code==0){
               $(".load_tip").hide();
                var _html='';
                 for(i=0;i<items.length;i++){
                    _html+='<div class="appmsg_item has_cover" data-id="'+items[i].id+'">'+
                          '<div class="appmsg_thumb_wrp js_appmsg_thumb" data-thumb="'+items[i].cover_pic+'" style="background-image:url('+items[i].cover_pic+');">'+
                          '<div class="appmsg_thumb default defaultImg" style="display: none;">'+
                          '<i class="icon_appmsg_thumb_small">缩略图</i>'+
                          '</div>'+
                          '</div>'+
                          '<h4 class="appmsg_title js_appmsg_title">'+items[i].title+'</h4>'+
                          '</div>'
                 }
                 if(inInitSingleList==1){
                     if(items.length==0){
                        $(".single_msg_lists").html('<div class="no_data" style="text-align:center;padding-top: 40%;">暂无图文消息</div>');
                        return;
                     }
                     $(".single_msg_lists").html(_html);
                 }else{
                    $(".single_msg_lists").append(_html);
                 }

            }else{
               weui.toast(data.msg,"warn");
            }

        }
    });
}
var curDiv;//移动的当前div
var prevDiv;//上一个
var nextDiv;//下一个
//下移
var moveDown=function(obj){
   curDiv=$(obj).parents(".js_appmsg_item");
   nextDiv=curDiv.next();
  //交换DIV
   nextDiv.after(curDiv);
}
//上移
var moveUp=function(obj){
   curDiv=$(obj).parents(".js_appmsg_item");
   prevDiv=curDiv.prev();
   //交换DIV
   curDiv.after(prevDiv);
}
//给左侧数据列表追加上移，下移，删除操作区
var addOprMask=function(){
    $(".appmsg_content .first_appmsg_item").each(function(){
        var maskStr='<div class="appmsg_edit_mask">'+
                     ' <a onclick="return false;" class="icon20_common sort_down_white js_down" data-id="0" href="javascript:;" title="下移">向下</a>'+
                     '<a class="icon20_common del_media_white js_del" href="javascript:;" title="删除">删除</a>'+
                     ' </div>';
           $(this).append(maskStr);
     });

      $(".appmsg_content .appmsg_item").each(function(){
        var maskStr='<div class="appmsg_edit_mask">'+
                     '<a class="icon20_common sort_up_white  js_up" href="javascript:;" title="上移">向上</a>'+
                     '<a class="icon20_common sort_down_white js_down"  href="javascript:;" title="下移" >向下</a>'+
                     '<a class="icon20_common del_media_white js_del" href="javascript:;" title="删除">删除</a>'+
                     '</div>';
           $(this).append(maskStr);
     });
}
var reqCurMultiMsg=function(groupId){

    $.ajax({
        type: "post",
        dataType: "html",
        url: "myArticle/curmultimsg_list",
        data: {
          "id":groupId,
        },
        success: function (result) {
            $(".editMultiMsgWrap .appmsg_content").html(result);
            addOprMask();
        },
        error:function(){
           weui.toast("请求出错！","error");
        }
    });
}

var multiMsgEditing=function(obj){
     var groupId=$(obj).attr("data-groupid");
     $("body").addClass("no_scroll");
     $(".editMultiMsgWrap").show();
     canLoadMore=true;
     inInitSingleList=1;
     page_ind=0;
     reqSingleMsgList();
     reqCurMultiMsg(groupId);

}

var noMsg=$('<div class="none_data" style="text-align:center;padding-top: 40%;"><img src="images/none.png" alt=""></div>');
var addThisSingleMsg=function(obj){
  if( $(".editing_wrap .none_data").length!=0){
       $(".editing_wrap .none_data").remove();
  }

  var curId=$(obj).attr("data-id");
  var title=$(obj).find(".js_appmsg_title").text();
  var cover_pic=$(obj).find(".js_appmsg_thumb").attr("data-thumb");
  var multiMsgLen=$(".editMultiMsgWrap .js_appmsg_item").length;
  var _ind=multiMsgLen+1;

   if(multiMsgLen>=8){
        $(".editMultiMsgWrap .warn_Wrap").fadeIn();
        setTimeout(function(){
           $(".editMultiMsgWrap .warn_Wrap").fadeOut();
        },800);
       return
   }
   var newappMsgStr=$('<div class="js_appmsg_item appmsg_item_wrp has_thumb" data-id="'+curId+'">'+
                      '<div class="js_news_item" data-uuid="{{items.uuid}}" data-idx="'+_ind+'">'+
                      '<div class="first_appmsg_item" title="第'+_ind+'篇图文">'+
                      '<div class="cover_appmsg_item">'+
                      '<h4 class="appmsg_title"><a class="js_appmsg_title" href="javascript:void(0);">'+title+'</a></h4>'+
                      '<div class="appmsg_thumb_wrp js_appmsg_thumb" style="background-image:url('+cover_pic+');">'+
                      '<div class="appmsg_thumb default defaultImg" style="display: none;">'+
                      '<i class="icon_appmsg_thumb">封面图片</i>'+
                      '</div>'+
                      '</div>'+
                      '</div>'+
                      '<div class="appmsg_edit_mask">'+
                      '<a onclick="return false;" class="icon20_common sort_down_white js_down" data-id="'+curId+'" href="javascript:;" title="下移" >向下</a>'+
                      '<a class="icon20_common del_media_white js_del" data-id="'+curId+'" href="javascript:;" title="删除">删除</a>'+
                      '</div>'+
                      '</div>'+
                      '<div class="appmsg_item has_cover">'+
                      '<div class="appmsg_thumb_wrp js_appmsg_thumb" style="background-image:url('+cover_pic+');">'+
                      '<div class="appmsg_thumb default defaultImg" style="display: none;">'+
                      '<i class="icon_appmsg_thumb_small">缩略图</i>'+
                      '</div>'+
                      '</div>'+
                      '<h4 class="appmsg_title js_appmsg_title">'+title+'</h4>'+
                      '<div class="appmsg_edit_mask">'+
                      '<a class="icon20_common sort_up_white  js_up" data-id="'+curId+'"  href="javascript:;" title="上移">向上</a>'+
                      '<a class="icon20_common sort_down_white js_down" data-id="'+curId+'"  href="javascript:;" title="下移" >向下</a>'+
                      '<a class="icon20_common del_media_white js_del" data-id="'+curId+'" href="javascript:;" title="删除">删除</a>'+
                      '</div>'+
                      '</div>'+
                      '</div>'+
                      '</div>');

  $(".js_appmsg_item").removeClass('current');
  $(".editMultiMsgWrap .appmsg_content").append(newappMsgStr);

}
var synToWechatAccount=function(){
    //alert(cur_article_id)
    $("#syncBacAll").show();
    if($("#weixinListCon").html().trim()==""){
        $.getJSON("/authorize/list",function(result){
            if(result.code == 0 && result.data !=null){
              var html = "";
              for(var i in result.data){
                var app = result.data[i];
                html +=
                  ('<li class="weixinList">'+
                    '<div class="weixinImg" style="background: url({head_img_url}) no-repeat; background-size: cover;"></div>'+
                    '<p class="weixinName">{app_name}</p>'+
                    '<div class="weixinChoose" data-choosed = 0 data-appinfoid = "{id}">'+
                      '<span class="choosed"></span>'+
                    '</div>'+
                  '</li>').format(
                  {
                    id: app.id,
                    head_img_url: app.head_img,
                    app_name: app.nick_name
                  });
              }
              $("#weixinListCon").html(html);
              $("#weixinAllNum").html(result.data.length);
            }
        });
    }
}
//保存多图文
var saveMultiMsg=function(){
    console.log("isAddNewMsg:"+isAddNewMsg);
    var $multiMsg=$(".editing_wrap .js_appmsg_item");
    var msgLen=$multiMsg.length;
    var _ids='';
    if( msgLen==0){
        return;
    }
    //遍历图文ids
    $multiMsg.each(function(){
        var curid=$(this).attr("data-id");
        _ids += curid+","
    });
    //alert(_ids);
    var _url;
    if(isAddNewMsg==1){
         _url="myArticle/multi_article_add";
         cur_article_id="";
    }else{
         _url="myArticle/multi_article_update";
    }
    if(canAjax){
       canAjax=false;
        $.ajax({
              type: "get",
              dataType: "json",
              url: _url,
              data:{
                "ids":_ids,
                "id" :cur_article_id
             },
              success: function (result) {
                  console.log(result);
                  console.log("isNeedSyn:"+isNeedSyn);
                  if(result.code==0){
                      if(isNeedSyn==1){
                           //保存后同步
                           $(".editMultiMsgWrap").hide();
                           synToWechatAccount();
                           console.log("保存并同步");
                      }else{
                          //只保存
                          console.log("保存");
                         $(".editMultiMsgWrap").hide(0,function(){
                            location.reload();
                            weui.toast("保存成功","success");
                         });
                      }


                  }else{
                     weui.toast(result.msg,"error");
                  }

                  canAjax=true;
              },
              error:function(){
                 weui.toast("请求出错！","error");
                 canAjax=true;
              }
        });
    }
}

var init = function() {
      if(type=="multi"){
        $(".js_check_msg.multi").addClass("cur");
        isReqSingle = 2;
      }else{
        $(".js_check_msg.single").addClass("cur");
        isReqSingle = 1;
      }
      $(".creatMultimMsg a").eq(isReqSingle-1).show().siblings().hide();

  	  //初始化请求单图文
      require("../common/jquery.pagination").init($);
      total = parseInt($("#single_total_num").val());
      var single_total_page= parseInt ((singleTotal+page_size-1)/page_size);
      console.log("单图文总条数："+singleTotal)
      console.log("单图文总页数:"+single_total_page);
      //初始化渲染数据
      reloadListData();

      //多图文/单图文图文搜索
      $("#search_msg_btn").click(function(){
          page_index = 0;
          searchMsgVal=$("#search_msg_input").val();
          reloadListData();
      });
      //多图文/单图文图文搜索
      $("#search_msg_input").on("keydown",function(event){
         page_index = 0;
         searchMsgVal=$("#search_msg_input").val();
         if(event.keyCode == "13") reloadListData();
      });

  	  //多图文/单图文标签切换
      $(".js_check_msg").click(function(){
        window.location.href="/myArticle?type="+$(this).attr("data-type");
          // $(this).addClass('cur').siblings(".js_check_msg").removeClass("cur");
          // var _index=$(this).index();
          // isReqSingle=$(this).index()+1;
          // page_index = 0;
          // $(".creatMultimMsg a").eq(_index).show().siblings().hide();
          // reloadListData();
      });
      // 单图文列表点击事件
      $("body").delegate(".single_msg_lists .appmsg_item","click",function(){
          addThisSingleMsg($(this));
      });
      //新建一个单图文
      $(".js_addSingleMsg").click(function(){
        if(!window.localStorage){
          console.log("您的浏览器不支持localStorage");
        }else{
          localStorage.setItem("we-editor-local-content","");
        }
        window.location.href = "/";
      });
      //新建一个多图文
      $(".js_addMulitMsg").click(function(){
           isAddNewMsg=1;
           inInitSingleList=1;
           page_ind=0;
           canLoadMore=true;
           $("body").addClass("no_scroll");
           $(".editMultiMsgWrap").show();
           $(".editMultiMsgWrap .appmsg_content").html('');
           $(".editMultiMsgWrap .appmsg_content").append(noMsg);
           reqSingleMsgList();

      });

     //创建多图文时-单图文图文搜索
      $("#single_msg_btn").click(function(){
          page_ind = 0;
          reqSingleMsgList();
      });
      //创建多图文时-单图文图文搜索
      $("#single_msg_input").on("keydown",function(event){
         page_ind = 0;
         if(event.keyCode == "13") reqSingleMsgList();
      });

      //创建多图文时-滚动加载更多单图文
      $(".js_single_list_view").scroll(function () {
            var bot=0;
            var currBox = $(this);
            var currBoxHeight = currBox.height();
            var scrollTop = currBox.scrollTop();
            var docHeight = currBox.find(".single_msg_lists").height();
            //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
            //我们需要去异步加载数据了
            if ((bot + scrollTop) >= docHeight - currBoxHeight) {
                inInitSingleList=0;
                console.log("滚动了该加载数据了");
                console.log("当前页："+ (page_ind+1));
                console.log("canLoadMore:"+canLoadMore);
                console.log("inInitSingleList:"+inInitSingleList);
                if(canLoadMore){
                  setTimeout(function(){
                      if( (page_ind+1) >= single_total_page ){
                          $(".load_tip").show().html("没有更多了！");
                          return false;
                      }
                      page_ind++;
                      //加载更多单图文数据
                      reqSingleMsgList();
                      console.log('当前页数：'+page_ind);
                  },500);
                  canLoadMore=false;
                }


            }
      });

      //编辑
      $(".article-lists").delegate(".edit_btn","click",function(){
          cur_article_id=$(this).parents(".js_appmsgitem").attr("data-id");
          if(isReqSingle==1){
            //编辑单图文
            var uuid = $(this).attr("data-uuid");
            window.location.href="/?uuid="+uuid;
          }else{
             //编辑多图文
             isAddNewMsg=0;
             multiMsgEditing($(this));
          }
      });
      //保存一条多图文
      $(".js_saveMultiMsg").click(function(){
            isNeedSyn=0;
            saveMultiMsg();
      });

      //保存并同步
       $(".js_saveAndSynMultiMsg").click(function(){
            isNeedSyn=1;
            saveMultiMsg();
      });
      //删除
      $(".article-lists").delegate(".del_btn","click",function(){
        var url = "myArticle/del_my_single_article";
        if($(this).hasClass("multi")){
          url = "myArticle/del_my_multi_article";
        }
        var this_item = $(this).parents(".newsItem");
        var id = this_item.attr("data-id");

         weui.confirm('确定要删除吗',function(bt){
              if(bt=='ok'){
                    $.post(url,{
                      id: id
                    },function(result){
                        if(result.code == 0){
                          weui.toast("删除成功",'success');
                          this_item.remove();
                          //调用瀑布流布局方法
                         $("#gallery-wrapper").pinterest_grid({
                              no_columns: 4,
                              padding_x: 15,
                              padding_y: 15,
                              margin_bottom:18,
                              single_column_breakpoint: 700
                         });

                      }
                    });
              }
          });

      });



      //点击同步按钮
      $(".article-lists").delegate(".sync_btn","click",function(){
          cur_article_id=$(this).parents(".js_appmsgitem").attr("data-id");
           synToWechatAccount();
      });
      var weixinChoosedNum = 0;
      // 点击微信公众号选中或者取消选中，样式变化，改data-choosed，选中数字改变
      $("body").delegate(".weixinChoose","click",function(){
        if ($(this).attr("data-choosed") == 0) {
          // 未选中
          // 样式变化
          $(this).addClass("weixinChooseAc");
          // 改data-choosed
          $(this).attr("data-choosed", "1");
          // 选中数字改变
          weixinChoosedNum++;
          $("#weixinChooseNum").html(weixinChoosedNum);
        }else{
          // 已选中
          // 样式变化
          $(this).removeClass("weixinChooseAc");
          // 改data-choosed
          $(this).attr("data-choosed", "0");
          // 选中数字改变
          weixinChoosedNum--;
          $("#weixinChooseNum").html(weixinChoosedNum);
        };
    });

      $("#weixinChooseAllBtn").click(function(){
        var checkbox = $(this).find(".weixinChooseAllBtnIcon");
        if(checkbox.hasClass("weixinChooseAllBtnIconAc")){
          $(".weixinChoose").removeClass("weixinChooseAc");
          checkbox.removeClass("weixinChooseAllBtnIconAc");
        }else{
          $(".weixinChoose").addClass("weixinChooseAc");
          checkbox.addClass("weixinChooseAllBtnIconAc");
        }
      });
      //查看同步任务详情
      $(".article-lists").delegate(".syncDesc","click",function(){
        var tab;
        if($(this).hasClass("syncDescTotal"))  tab = $("#syncTitleTabTotalBtn");
        else if($(this).hasClass("syncDescSuc")) tab = $("#syncTitleTabSucBtn");
        else if($(this).hasClass("syncDescFail")) tab = $("#syncTitleTabFailBtn");
        else tab = $("#syncTitleTabOnBtn");

        tab.addClass("syncTitleTabAc").siblings().removeClass("syncTitleTabAc");

        $("#syncBacTask").show();
        cur_article_id = $(this).parents(".newsItem").attr("data-id");
        var status = $(this).attr("data-status");
        loadTaskDetail(cur_article_id,status);
      });


      //任务详情窗口切换标签
      $(".syncTitleTab").click(function(){
        $(this).addClass("syncTitleTabAc").siblings().removeClass("syncTitleTabAc");

        var status = $(this).attr("data-synctype");
        loadTaskDetail(cur_article_id,status);
      });

      //关闭同步任务窗口
      $("#syncBacTaskClose").click(function(){
        $("#syncBacTask").hide();
      });
      //同步到公众号确定
      $("#syncSureBtn").click(function(){
        var app_info_ids = "";
        if($(".weixinChoose.weixinChooseAc").length<=0){
          weui.toast("请先选中公众号","warn");
          return;
        }

        $(".weixinChoose.weixinChooseAc").each(function(){
          app_info_ids += $(this).attr("data-appinfoid")+",";
        });

        $.post("article_sync_task/add",{
          article_id:cur_article_id,
          type:isReqSingle==1?"single":"multi",
          app_info_ids:app_info_ids
        },function(result){
          if(result.code==0){
               weui.toast("同步成功","success");
          }
        })
        $("#syncBacAll").hide();
      });
      //同步到公众号取消
      $("#syncCancelBtn").click(function(){
        $("#syncBacAll").hide();
      });



     //pc预览
     $("body").delegate('.js_pcView','click',function(){
         var uuid=$(this).attr("data-uuid");
         if(isReqSingle==1){
            window.open("myArticle/view?uuid="+uuid);
         }else{
            window.open("myArticle/view_multi_item?uuid="+uuid);
         }


     });

     //扫码预览
     $("body").delegate('.js_phoneView','click',function(){
         var _uuid=$(this).attr("data-uuid");
         var _url="http://"+window.location.host+"/myArticle/view?uuid="+_uuid;
         var $qrcodeWrap=$(this).parents(".js_preview").find(".qrcode_wrap");
         var $qrcode=$('<div class="js_qrcode"></div>');
         $qrcodeWrap.prepend($qrcode).show();
         $qrcode.qrcode({
                text:  _url,
              render: "canvas",//设置渲染方式
               width: '150',     //设置宽度
              height: '150',     //设置高度
          });
     });

     //关闭扫码预览
     $("body").delegate('.js_closeQrcode','click',function(){
         $(this).parents(".qrcode_wrap").hide();
         $(this).parents(".js_preview").find(".js_qrcode").remove();
     });


    //单图文详情预览
    $("body").delegate('.single_msg_wrap .js_contentView','click',function(){
           var _uuid=$(this).attr("data-uuid");
           $(".wx_view_list").hide();


           $.ajax({
              type: "post",
              dataType: "JSON",
              url: "myArticle/my_single_article_detail",
              data: {
                "uuid":_uuid,
              },
              success: function (result) {
                  console.log(result);
                  if(result.code==0){
                      var data=result.data;
                      $(".jsPhoneView").show();
                      $(".phone_view_wrap").html(data.content);
                  }else{
                      weui.toast(result.msg,"error");
                  }

              },
              error:function(){
                 weui.toast("请求出错！","error");
              }
          });
     });
      //多图文详情预览
      var articleLen;
      var curPage=0;
      $("body").delegate('.multi_msg_wrap .js_contentView','click',function(){
           var groupId=$(this).attr("data-groupid");
           //alert(groupId);
           $.ajax({
              type: "post",
              dataType: "JSON",
              url: "myArticle/my_multi_article_detail",
              data: {
                "id":groupId,
              },
              success: function (result) {
                  console.log(result);
                  if(result.code==0){
                      var data=result.data;
                      $(".jsPhoneView").show();
                      $(".wx_view_list").show();
                       drawApp1(data);
                       articleLen=data.length;
                       //预览图文消息
                       $(".wx_view_list li:nth-child(1)").click(function(){
                               drawApp1(data);
                       });
                  }else{
                      weui.toast(result.msg,"error");
                  }

              },
              error:function(){
                 weui.toast("请求出错！","error");
              }
          });
     });

     //预览切换
     $(".wx_view_list li").click(function(){
            $(this).addClass("selected").siblings().removeClass("selected");
            $(".wx_article_crtl").hide();
     });


     //多个图文消息列表点击切换到对应的图文信息
     $("body").delegate(".previewItem","click",function(){
            $(".wx_view_list li:nth-child(2)").addClass("selected").siblings().removeClass("selected");
            var _index=$(this).index();
            drawApp2();
            curPage=_index;
            $(".wx_phone_preview_appmsg .rich_media").eq(_index).show().siblings().hide();
     });

     //预览正文
      $(".wx_view_list li:nth-child(2)").click(function(){
             $(".wx_article_crtl").show();
             drawApp2();
     });
      //预览正文切换-下一页
      $(".crtl_next_btn").click(function(){
           $(this).removeClass("disabled");
           if(curPage< (articleLen-1)){
               curPage++;
               $(".rich_media").eq(curPage).show().siblings().hide();
               console.log(curPage);
           }else{
              $(this).addClass("disabled").siblings().removeClass("disabled");
           }

      });
       //预览正文切换-上一页
      $(".crtl_pre_btn").click(function(){
          $(this).removeClass("disabled");
         if(curPage>0){
             curPage--;
             $(".rich_media").eq(curPage).show().siblings().hide();
            console.log(curPage);
         }else{
            $(this).addClass("disabled").siblings().removeClass("disabled");
         }
      });


    //移动图文消息-删除
     $("body").delegate(".del_media_white","click",function(){
        $(this).parents(".js_appmsg_item").remove();
        var msglen=$(".editing_wrap .js_appmsg_item").length;
        if(msglen==0){
           $(".editMultiMsgWrap .appmsg_content").append(noMsg);
        }

    });

    //移动图文消息-下移
    $("body").delegate('.sort_down_white', 'click',  function(e){
        moveDown($(this));
        return false;
    });
     //移动图文消息-上移
    $("body").delegate('.sort_up_white', 'click',  function(e){
        moveUp($(this));
        e.stopPropagation();
    });

     $(".close_PhoneView").click(function(){
        $(".jsPhoneView").hide();
     });

     $(".editMultiMsgWrap .js_close").click(function(){
         $(".editMultiMsgWrap").hide();
         $("body").removeClass("no_scroll");
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


/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
define( 'common/jquery.pagination', [], function( require, exports, module){
	var init = function(jQuery){
		jQuery.fn.pagination = function(maxentries, opts){
			opts = jQuery.extend({
				items_per_page:10,
				num_display_entries:10,
				current_page:0,
				num_edge_entries:0,
				link_to:"#",
				prev_text:"Prev",
				next_text:"Next",
				ellipse_text:"...",
				prev_show_always:true,
				next_show_always:true,
				callback:function(){return false;}
			},opts||{});
			
			return this.each(function() {
				/**
				 * Calculate the maximum number of pages
				 */
				function numPages() {
					return Math.ceil(maxentries/opts.items_per_page);
				}
				
				/**
				 * Calculate start and end point of pagination links depending on 
				 * current_page and num_display_entries.
				 * @return {Array}
				 */
				function getInterval()  {
					var ne_half = Math.ceil(opts.num_display_entries/2);
					var np = numPages();
					var upper_limit = np-opts.num_display_entries;
					var start = current_page>ne_half?Math.max(Math.min(current_page-ne_half, upper_limit), 0):0;
					var end = current_page>ne_half?Math.min(current_page+ne_half, np):Math.min(opts.num_display_entries, np);
					return [start,end];
				}
				
				/**
				 * This is the event handling function for the pagination links. 
				 * @param {int} page_id The new page number
				 */
				function pageSelected(page_id, evt){
					current_page = page_id;
					drawLinks();
					var continuePropagation = opts.callback(page_id, panel);
					if (!continuePropagation) {
						if (evt.stopPropagation) {
							evt.stopPropagation();
						}
						else {
							evt.cancelBubble = true;
						}
					}
					return continuePropagation;
				}
				
				/**
				 * This function inserts the pagination links into the container element
				 */
				function drawLinks() {
					panel.empty();
					var interval = getInterval();
					var np = numPages();
					// This helper function returns a handler function that calls pageSelected with the right page_id
					var getClickHandler = function(page_id) {
						return function(evt){ return pageSelected(page_id,evt); }
					}
					// Helper function for generating a single link (or a span tag if it's the current page)
					var appendItem = function(page_id, appendopts){
						page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
						appendopts = jQuery.extend({text:page_id+1, classes:""}, appendopts||{});
						if(page_id == current_page){
							var lnk = jQuery("<span class='current'>"+(appendopts.text)+"</span>");
						}
						else
						{
							var lnk = jQuery("<a>"+(appendopts.text)+"</a>")
								.bind("click", getClickHandler(page_id))
								.attr('href', opts.link_to.replace(/__id__/,page_id));
								
								
						}
						if(appendopts.classes){lnk.addClass(appendopts.classes);}
						panel.append(lnk);
					}
					// Generate "Previous"-Link
					if(opts.prev_text && (current_page > 0 || opts.prev_show_always)){
						appendItem(current_page-1,{text:opts.prev_text, classes:"prev"});
					}
					// Generate starting points
					if (interval[0] > 0 && opts.num_edge_entries > 0)
					{
						var end = Math.min(opts.num_edge_entries, interval[0]);
						for(var i=0; i<end; i++) {
							appendItem(i);
						}
						if(opts.num_edge_entries < interval[0] && opts.ellipse_text)
						{
							jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
						}
					}
					// Generate interval links
					for(var i=interval[0]; i<interval[1]; i++) {
						appendItem(i);
					}
					// Generate ending points
					if (interval[1] < np && opts.num_edge_entries > 0)
					{
						if(np-opts.num_edge_entries > interval[1]&& opts.ellipse_text)
						{
							jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
						}
						var begin = Math.max(np-opts.num_edge_entries, interval[1]);
						for(var i=begin; i<np; i++) {
							appendItem(i);
						}
						
					}
					// Generate "Next"-Link
					if(opts.next_text && (current_page < np-1 || opts.next_show_always)){
						appendItem(current_page+1,{text:opts.next_text, classes:"next"});
					}
				}
				
				// Extract current_page from options
				var current_page = opts.current_page;
				// Create a sane value for maxentries and items_per_page
				maxentries = (!maxentries || maxentries < 0)?1:maxentries;
				opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;
				// Store DOM element for easy access from all inner functions
				var panel = jQuery(this);
				// Attach control functions to the DOM element 
				this.selectPage = function(page_id){ pageSelected(page_id);}
				this.prevPage = function(){ 
					if (current_page > 0) {
						pageSelected(current_page - 1);
						return true;
					}
					else {
						return false;
					}
				}
				this.nextPage = function(){ 
					if(current_page < numPages()-1) {
						pageSelected(current_page+1);
						return true;
					}
					else {
						return false;
					}
				}
				// When all initialisation is done, draw the links
				drawLinks();
		        // call callback function
		        opts.callback(current_page, this);
			});
		}
	}	
	exports.init = init;
});



