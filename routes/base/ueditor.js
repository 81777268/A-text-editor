var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//加载配置
router.get('/loadconfig', function(req, res, next) {
    res.send({
        "imageActionName": "uploadimage",
        "imageFieldName": "upfile",
        "imageMaxSize": 2048000,
        "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
        "imageCompressEnable": true,
        "imageCompressBorder": 1600,
        "imageInsertAlign": "none",
        "imageUrlPrefix": "",
        "imagePathFormat": "\/server\/ueditor\/upload\/image\/{yyyy}{mm}{dd}\/{time}{rand:6}",
        "scrawlActionName": "uploadscrawl",
        "scrawlFieldName": "upfile",
        "scrawlPathFormat": "\/server\/ueditor\/upload\/image\/{yyyy}{mm}{dd}\/{time}{rand:6}",
        "scrawlMaxSize": 2048000,
        "scrawlUrlPrefix": "",
        "scrawlInsertAlign": "none",
        "snapscreenActionName": "uploadimage",
        "snapscreenPathFormat": "\/server\/ueditor\/upload\/image\/{yyyy}{mm}{dd}\/{time}{rand:6}",
        "snapscreenUrlPrefix": "",
        "snapscreenInsertAlign": "none",
        "catcherLocalDomain": ["127.0.0.1", "localhost", "img.baidu.com"],
        "catcherActionName": "catchimage",
        "catcherFieldName": "source",
        "catcherPathFormat": "\/server\/ueditor\/upload\/image\/{yyyy}{mm}{dd}\/{time}{rand:6}",
        "catcherUrlPrefix": "",
        "catcherMaxSize": 2048000,
        "catcherAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
        "videoActionName": "uploadvideo",
        "videoFieldName": "upfile",
        "videoPathFormat": "\/server\/ueditor\/upload\/video\/{yyyy}{mm}{dd}\/{time}{rand:6}",
        "videoUrlPrefix": "",
        "videoMaxSize": 102400000,
        "videoAllowFiles": [".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"],
        "fileActionName": "uploadfile",
        "fileFieldName": "upfile",
        "filePathFormat": "\/server\/ueditor\/upload\/file\/{yyyy}{mm}{dd}\/{time}{rand:6}",
        "fileUrlPrefix": "",
        "fileMaxSize": 51200000,
        "fileAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid", ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"],
        "imageManagerActionName": "listimage",
        "imageManagerListPath": "\/server\/ueditor\/upload\/image\/",
        "imageManagerListSize": 20,
        "imageManagerUrlPrefix": "",
        "imageManagerInsertAlign": "none",
        "imageManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
        "fileManagerActionName": "listfile",
        "fileManagerListPath": "\/server\/ueditor\/upload\/file\/",
        "fileManagerUrlPrefix": "",
        "fileManagerListSize": 20,
        "fileManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid", ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"]
    });
});


//文件上传
router.post('/loadconfig',multipartMiddleware, function(reqq, res, next) {

    //console.log("reqq"+reqq.files.upfile);
    var filefile = reqq.files.upfile;
     //console.log(filefile);
     var http = require('http');
     var fs= require('fs');
     var boundaryKey = '----' + new Date().getTime();
     //console.log("file_server_host:"+global.config.file_server_host);
     //console.log("file_server_port:"+global.config.file_server_port);

     var options = {
             host:global.config.file_server_host,//远端服务器域名
             port:global.config.file_server_port,//远端服务器端口号
             method:'POST',
             path:'/upload/qiniu_upload_img.do',//上传服务路径
             headers:{
                'Content-Type':'multipart/form-data; boundary=' + boundaryKey,
                 'Connection':'keep-alive'
             }
         };
     var payload =
         '--' + boundaryKey + '\r\n'
        + 'Content-Disposition:form-data; name="file"; filename="'+filefile.originalFilename+'"\r\n'
        + 'Content-Type:octet-stream'+"\r\n\r\n";
        //http://tool.oschina.net/commons/  Content-Type 各文件类型对照表

    //发送请求
    var req = http.request(options, function (res1) {
        var result = '';
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) {
            result += chunk;
        });
        res1.on('end', function() {
            //console.log('result:' + result);
            var json = JSON.parse(result);
            //res.send(result)
            res.send({"original":"demo.jpg","name":"demo.jpg",
                "url":json.data.file,
                "size":"99697","type":".jpg","state":"SUCCESS"});
        })

    });
    req.on('error', function(e) {
        console.error("error:"+e);
    });

    req.write(payload);
    //使用流上传图片
    var fileStream = fs.createReadStream(filefile.path,{bufferSize:1024 * 1024});
    fileStream.pipe(req,{end:false});
    fileStream.on('end',function(){
        req.end('\r\n--' + boundaryKey + '--');
    });
});



module.exports = router;