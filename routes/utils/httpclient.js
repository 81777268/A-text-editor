/***********************************************
 *
 *  扩展cookie-request,增加响应自动处理
 *  
 *  yantingjun@wemedia.cn
 *  2016.11.03
 *
 ***********************************************/

var request = require('./cookie-request');
var log_max_size = global.config.http_log_max_size; //日志长度

exports.http = function(req,res){
	var http = new Object();
	http.req=req,
	http.res=res,
	http.get=function(url,params,process,callback){
		var URL = require('url').parse(url);
		var domain = URL.domain;
		if(domain && domain.indexOf("http://")!=1 && domain.indexOf("https://")!=1){
			domain+="http://"; //必须带http://或者https://，否则请求时带不上cookie
		}
        if(typeof params == 'function'){
            callback = params;
            params = null;
            process=false;
        }else if(params=="true" || params=="false" || params==true || params==false){
            params = null;
            callback = process;
            process = params;
        }else if(typeof process == 'function'){
			callback = process;
			process=false;
		}

        if(params){
            url+="?"
            for(var key in params){
                //console.log("遍历属性  "+key+":"+params[key]);
                url+=(key+"="+params[key])+"&";
            }
        }
        if(url && (url.charAt(url.length-1)=='?' || url.charAt(url.length-1)=='&')){
        	url = url.substring(0,url.length-1);
        }


		// 保持与请求接口的session一致		
		request.init(req,domain).get(url,function(error, response, body){
			if(!body){
				console.log("服务器没有响应，请检查服务器地址是否正确！");
				return "";
			}
			if(global.config.http_log){
				var responseJson = body;
				if(typeof body!='string'){
					responseJson = JSON.stringify(body);
				}
				
				if(responseJson.length>log_max_size){
					responseJson = responseJson.substring(0,log_max_size)+"...";
				}
				console.log("GET请求地址："+url+" 响应数据："+responseJson);
			}
			
			 if(process){
				/**var result = JSON.parse(body);
				if(result.code==3002){//用户未登录
					req.session.user = null;
					res.redirect(global.config.basepath+"login");
					return;
				}else if(result.code==3003){//没有访问权限
					res.redirect(global.config.basepath+"unauth");
					return;
				}**/
			}
			if(typeof body =="string"){
				body = JSON.parse(body);
			}
			callback(error,response,body);
		})	
	},
	http.post=function(url,data,process,callback){
		var URL = require('url').parse(url);
		var domain = URL.domain;
		if(domain && domain.indexOf("http://")!=1 && domain.indexOf("https://")!=1){
			domain+="http://"; //必须带http://或者https://，否则请求时带不上cookie
		}

		if(typeof data == 'function'){
			callback = data;
			process=false;
			data = null;
		}else if(typeof process == 'function'){
			callback = process;
			process=false;
		}
		request.init(req,domain).post(url,data,function(error, response, body){
			if(!body){
				console.log("服务器没有响应，请检查服务器地址是否正确！");
				return "";
			}
			if(global.config.http_log){
				var requestJson = JSON.stringify(data);
				if(requestJson.length>log_max_size){
					requestJson = requestJson.substring(0,log_max_size)+"...";
				}


				var responseJson = body;
				if(typeof body!='string'){
					responseJson = JSON.stringify(body);
				}
				if(responseJson.length>log_max_size){
					responseJson = responseJson.substring(0,log_max_size)+"...";
				}

				console.log("POST请求地址："+url+" 请求体:"+requestJson+" 响应数据："+responseJson);
			}
			


			if(process && process==true){
				/**var result = JSON.parse(body);
				if(result.code==3002){
					req.session.user = null;
					res.redirect(global.config.basepath+"login");
					return;
				}else if(result.code==3003){
					res.redirect(global.config.basepath+"unauth");
					return;
				}**/
			}
			if(typeof body =="string"){
				body = JSON.parse(body);
			}
			callback(error,response,body);
		})
	}
	return http;
}




