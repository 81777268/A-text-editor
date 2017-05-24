define( 'auth/main', [], function( require, exports, module){

	var init = function(){
		var H = (window.innerHeight) - 163;
		$('.wrap').css('height', H + 'px');


		$("#add_auth").click(function(){
			$.get("/authorize/get_auth_url",function(result){
				if(result.code ==0 && result.data!=null){
					window.location.href = result.data;
				}
			})
		});
if (isLogin()!=true) {
	$('section').html('');
	$('section').append('<div class="container"><div class="container_title"><span></span><span>微信公众平台授权</span></div><div class="container_content"><span>该功能需要登录后才能使用，</span><span class="log_in_btn">立即登录</span></div></div>');

	$('.log_in_btn').click(function() {
		!checkLogin()
	});

}


console.log(window.innerHeight);

	}

	exports.init = init;
});

