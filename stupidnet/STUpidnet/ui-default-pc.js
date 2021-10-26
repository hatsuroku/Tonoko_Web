/*--------------------------------------------------
这个文件主要处理ui上的效果,布局初始化等，一般定制可能会
改这个文件
----------------------------------------------------*/
/*
	pc版的在ipad的qq浏览器下面会有问题，所以统一转到手机版浏览
*/
//没有屏蔽以下代码，ipad出现死循环跳转的问题（2016-8-15）
//if(navigator.userAgent.toLowerCase().indexOf('ipad') > -1 && $("link")[0].href.indexOf("mobile.css")<0)
//{
//	window.location = window.location.href.replace("pc.html","mobile.html");
//}

/*
	初始化tab状态,处理是一个tab还是多个tab的页面布局,
	这个函数只会运行一次(根据不同的布局可自行修改下面代码)
*/
function initTabs(){
	var tabs = getUrlParam("tabs");
	if(tabs === "")tabs = "sms";
	tabs = tabs.split("-");
	/*if(tabs.length > 1){
		jQuery(".other").show();
		jQuery(".other_x").show();
	}else if(tabs[0] === "sms"){
		$("#login_tools_changePwd").hide();
	}*/
	//activateTab(tabs[0]);
	createTabs(tabs);
}


//动态生成tabs
function createTabs(tabs){
	var html = [];
	for(var i=0;i<tabs.length;i++){
		var urlCss = '';
		if(tabs[i] == 'pwd'){
			window.pwdTabIndex = i;
			urlCss = "background:url(../share/default-tpl/res/img/i_b_bg_new.png) no-repeat;background-position:-382px 0";
		}else if(tabs[i] == 'sms'){
			urlCss = "background:url(../share/default-tpl/res/img/i_b_bg_new.png) no-repeat;background-position:-347px 0";
		}else if(tabs[i] == 'wechat'){
			urlCss = "background:url('../share/default-tpl/res/img/wechat.png') no-repeat;";
		}else if(tabs[i] == 'freeauth'){
			urlCss = "background:url('../share/default-tpl/res/img/freeauth.png') no-repeat;";
		}else{
			urlCss = "background:url('../share/default-tpl/res/img/erweima.png') no-repeat;";
		}
		html += '<li style="height:50px;padding:10px 0 0 20px">';
		html += '<div onclick="activateTab(&quot;'+tabs[i]+'&quot;,'+i+')" style="cursor:pointer;width:35px;height:40px;'+urlCss+'">';
		html +=	'</div></li>';		
	}
	$("#tabsUl").html(html);
	activateTab(tabs[0],0);
}

/*
	实现mode_password显示密码认证的方法，
	mode_sms显示短信认证的方法，主要提供给activateTab使用,
	这个函数只会运行一次(根据不同的布局可自行修改下面代码)
*/
function initChangeTabMethod(){
	var mode_password, mode_sms,mode_wechat,mode_qrcode,mode_freeauth;
		if (/IE/.test(navigator.userAgent) || /MQQBrowser/.test(navigator.userAgent)) {
			mode_password = function () {
				$("#mode_sms").hide();
				$("#mode_qrcode").hide();
				$("#mode_wechat").hide();
				$("#mode_freeauth").hide();	
				$("#mode_password").show();				
				$(".username .focus").focus();
				$("#login_tools_changePwd").show();
			}
			
			mode_sms = function () {
				$("#mode_password").hide();
				$("#mode_qrcode").hide();
				$("#mode_wechat").hide();
				$("#mode_freeauth").hide();	
				$("#mode_sms").show();
				$(".phone .focus").focus();
				$("#login_tools_changePwd").hide();
			} 
			
			mode_qrcode = function () {
				$("#mode_password").hide(); 
				$("#mode_sms").hide();
				$("#mode_wechat").hide();
				$("#mode_freeauth").hide();	
				$("#mode_qrcode").show();				
			}
			
			mode_wechat = function () {
				$("#mode_password").hide(); 
				$("#mode_sms").hide();
				$("#mode_qrcode").hide();
				$("#mode_freeauth").hide();	
				$("#mode_wechat").show();					
			}
			
			mode_freeauth = function(){
				$("#mode_password").hide(); 
				$("#mode_sms").hide();
				$("#mode_qrcode").hide();
				$("#mode_wechat").hide();	
				$("#mode_freeauth").show();	
			}
		} else {
		//切换
			mode_password = function () { 
				$("#mode_sms").hide();
				$("#mode_qrcode").hide();
				$("#mode_wechat").hide();
				$("#mode_freeauth").hide();
				$("#mode_password").fadeIn();
				$(".username .focus").focus(); 
				$("#login_tools_changePwd").show();
			}
			
			mode_sms = function () {
				$("#mode_password").hide(); 
				$("#mode_qrcode").hide();
				$("#mode_wechat").hide();
				$("#mode_freeauth").hide();
				$("#mode_sms").fadeIn();
				$(".phone .focus").focus();
				$("#login_tools_changePwd").hide();				
			}
			
			mode_qrcode = function () {
				$("#mode_password").hide(); 
				$("#mode_sms").hide();
				$("#mode_wechat").hide();
				$("#mode_freeauth").hide();
				$("#mode_qrcode").fadeIn();				
			}
			
			mode_wechat = function () {
				$("#mode_password").hide(); 
				$("#mode_sms").hide();
				$("#mode_qrcode").hide();
				$("#mode_freeauth").hide();
				$("#mode_wechat").fadeIn();					
			}
			
			mode_freeauth = function(){
				$("#mode_password").hide(); 
				$("#mode_sms").hide();
				$("#mode_qrcode").hide();
				$("#mode_wechat").hide();	
				$("#mode_freeauth").fadeIn();	
			}
		}
		window.mode_password = mode_password;
		window.mode_sms = mode_sms;
		window.mode_qrcode = mode_qrcode;
		window.mode_wechat = mode_wechat;
		window.mode_freeauth = mode_freeauth;
}

//激活短信认证，或密码认证tab取值sms/pwd(跟initChangeTabMethod关联，只要改initChangeTabMethod即可,定制一般不用改动)
function activateTab(tab,index){
	
	if(!index){
		$("#tabsDiv").css({
			background : 'url("../share/default-tpl/res/img/firstTab.png")',
			backgroundPosition: '-20px -20px'
		});
	}else if(1 == index){
		$("#tabsDiv").css({
			background : 'url("../share/default-tpl/res/img/secondTab.png")',
			backgroundPosition: '-20px -20px'
		});
	}else if(2 == index){
		$("#tabsDiv").css({
			background : 'url("../share/default-tpl/res/img/thirdTab.png")',
			backgroundPosition: '-20px -20px'
		});
	}else if(3 == index){
		$("#tabsDiv").css({
			background : 'url("../share/default-tpl/res/img/fourTab.png")',
			backgroundPosition: '-20px -20px'
		});
	}
	if(tab === "sms"){
		mode_sms()
	}else if(tab === 'qrcode'){
		mode_qrcode();
	}else if(tab === 'wechat'){
		mode_wechat();
	}else if(tab === 'freeauth'){
		mode_freeauth();
	}else{ 
		mode_password();
	}
}

//显示微信
function showWechatImg(type){
	var h = $(document).height();
	var w = $(document).width();
	var navStr = navigator.userAgent.toLowerCase(),
		isIE = navStr.indexOf("msie")>0,
		isIE8 = navStr.indexOf("msie 8")>0,
		isIE7 = navStr.indexOf("msie 7")>0,
		isIE6 = navStr.indexOf("msie 6")>0;
	if(isIE8 || isIE8 || isIE6)
	{
		h = h-10;
	}
	$('#statement_'+type).height(h);
	$('#statement_'+type).fadeIn('fast');
}

function hideWechatImg(type){
	$('#statement_'+type).fadeOut('fast');
}

//激活登录，修改密码，注销页面(根据不同的布局可自行修改下面代码)
function activatePage(type,username,isByUrl){
	$("#mode_logout").hide();
	$("#mode_changePwd").hide();
	$("#mode_login").hide();
	$("#mode_freeauth").hide();
	//针对手机隐藏
	$("#logoHead").show();
	
	$("#login_tools").hide();
	$("#changePwd_tools").hide();
	$("#logout_tools").hide();
	
	if (type != "logout") {
		onInitUserLogin();
	}
	
	switch (type)
	{
		case "logout" : 
			$("#mode_logout").show();
			$("#logout_tools").show();
			if(username){
				$("#logout_name").html(htmlEncode(username));
			}
			onGetUserFlux();
			break;
		case "changePwd" : 
			$("#mode_changePwd").show();
			$("#changePwd_tools").show();
			if(username){
				$("#changePwd_name").val(username);
				$("#changePwd_name").siblings('label').css('opacity',0);
				if(!isByUrl){
					$id("changePwd_name").readOnly = true;
					$("#changePwd_first").html("首次登录必须先修改初始密码。");
				}
				return;
			}
			$("#changePwd_first").html("");
			$id("changePwd_name").readOnly = false;
			break;
		case "login" :
			window.location = createLoginUrl()+"/ac_portal/needauth.html?vlanid="+getUrlParam("vlanid")+"&url="+getUrlParam("url");
			break;
		case "frontLogin" : 
			activateTab('pwd',window.pwdTabIndex);
			$("#login_tools").show();
			$("#mode_login").show();
			break;
		default : 
			$("#login_tools").show();
			$("#mode_login").show();
	}
}


//初始化页面，这个函数只会运行一次(定制不用改动)
function initPage(){
	initChangeTabMethod();
	var type = getUrlParam("type"),firstTab='';
	var username = getUrlParam("username");
	activatePage(type,username,true);
	initTabs();
	var url = create_qrcode_url();
	
	$("#qrcodeImg").html(create_qrcode(url,"10"));
	initPstrength();
}

$(document).ready(function(){initPage();}); 

//下面这块主要处理输入框，按钮，提示信息的样式变化(不用动)
(function ($) {
	function js_alert(divid, msg) {
		var msg_box = $("#"+divid + " .login_box_msg");
		if (msg == "") {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.hide();
			} else {
				msg_box.slideUp();
			}
			
		} else {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.show();
			} else {
				msg_box.slideDown();
			}
			
		}
		msg_box.find("dd").html(msg);
	}
	
	window.js_alert = js_alert;
	
	// 显示流量信息
	function flux_show(msg) {
		var msg_box = $("#mode_flux_info .flux_msg");
		if (msg == "") {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.hide();
			} else {
				msg_box.slideUp();
			}
			
		} else {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.show();
			} else {
				msg_box.slideDown();
			}
			
		}
		msg_box.find("dd").html(msg);
	}
	window.flux_show = flux_show;
	
	// JavaScript Document
	$(document).ready(function(){
		login_operate();
		btn();
		//输入框大小写提示
		$(":password").keypress(detectCapsLock);
		//输入框回车提交
		$("input").keyup(onInputKeyUp);
	}); 
		
	//输入框
	function login_operate() {
		var li = $(".login_operate ul li");
		var input = $(".login_operate ul li.password input");
		var li_hover = "li_hover";
		var li_press = "li_press";
		var phone_input = $(".phone input");
		var sms_input = $(".sms input");
		var username_input = $(".username input");
		var password_input = $(".password input");
		var password_input_new = $(".password_new input");
		var password_input_n = $(".password_n input");

		/*聚焦*/
		$(".focus").focus();
		/*选中*/
		$(input).click(function(){
			$(this).select();
		});
		
		//提示
		var inputs = $('.input');
		var showLabel = function(opacity){
			var v = this.value;
			if(this.type !== "password")
			{
				v = $.trim(v);
			}
			if(v === ''){
				$(this).siblings('label').show();
				$(this).siblings('label').css('opacity',opacity);
			}else{
				$(this).siblings('label').hide();
			}
		}
		
		inputs.bind('focus',function(){
			showLabel.call(this,0.5);
		}).bind('keydown',function(){
			$(this).siblings('label').hide();
		}).bind('blur',function(){
			var v = this.value;
			if(this.type !== "password")
			{
				v = $.trim(v);
			}
			if(v === ''){
				this.value = v;
			}
			showLabel.call(this,1);
		});
		setTimeout(function (){
			$.each(inputs, function (index, item){
				if ($.trim(this.value) !== ''){
					$(item).siblings('label').css('opacity',0);
				}
			});
		}, 800);
				
		if(!/(Mobile|Android|Windows Phone)/.test(navigator.userAgent))
		{
			/*悬停与聚焦后效果*/
			li.hover(function(){
				$(this).addClass(li_hover);
			  },function(){
				$(this).removeClass(li_hover);
			});
		}
		$(".sms_go").hover(function(){
			$(this).removeClass(li_hover);
		  });
		
		$(phone_input).focus(function(){
			$(".phone").addClass(li_press);
			  });
		$(phone_input).blur(function(){
			$(".phone").removeClass(li_press);
			  });
			  
		$(sms_input).focus(function(){
			$(".sms").addClass(li_press);
			  });
		$(sms_input).blur(function(){
			$(".sms").removeClass(li_press);
			  });
			  
		$(username_input).focus(function(){
			$(".username").addClass(li_press);
			  });
		$(username_input).blur(function(){
			$(".username").removeClass(li_press);
			  });
			  
		$(password_input).focus(function(){
			$(".password").addClass(li_press);
			  });
		$(password_input).blur(function(){
			$(".password").removeClass(li_press);
			  });
			  
		$(password_input_new).focus(function(){
			$(".password_new").addClass(li_press);
			  });
		$(password_input_new).blur(function(){
			$(".password_new").removeClass(li_press);
			  });
			  
		$(password_input_n).focus(function(){
			$(".password_n").addClass(li_press);
			  });
		$(password_input_n).blur(function(){
			$(".password_n").removeClass(li_press);
			  });
			  	   
	};
	//按钮
	function btn() { 
		var btn = $(".login_btn");
		$(btn).hover(function(){
			$(this).addClass("login_btn_hover");
		  },function(){
			$(this).removeClass("login_btn_hover");
		});
		$(btn).mousedown(function(){
			$(this).addClass("login_btn_press");
		});
		$(btn).mouseup( function (){
			$(this).removeClass("login_btn_press");
		});	
	}; 
	/*检测大写锁定*/
	function detectCapsLock(ae){
		var uO=ae.keyCode||ae.charCode,
			formid = "mode_password",
			Uc=ae.shiftKey;
		if(this.id.indexOf("changePwd")>-1){
			formid = "mode_changePwd";
		}
		if((uO>=65&&uO<=90&&!Uc)||(uO>=97&&uO<=122&&Uc))
			{
				js_alert(formid, "大写锁定已打开");
			}
			else if((uO>=97&&uO<=122&&!Uc)||(uO>=65&&uO<=90&&Uc))
			{
				js_alert(formid, "");
			}
			else
			{
				js_alert(formid, "");
			}
	};
	//处理输入框回车事件
	function onInputKeyUp(e){
		if (e.keyCode === 13 ){//enter事件
			var submitBtn = $("#"+this.id.split("_")[0]+"_submitBtn");
			if (submitBtn && submitBtn.length>0){//sms可见 
				submitBtn.click(); 
				return false;
			}
		}
	}
})(jQuery);
