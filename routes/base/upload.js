var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/qiniu_upload_img',multipartMiddleware, function(reqq, res) {

	 var filefile = reqq.files.file;
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
            res.send(result)
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