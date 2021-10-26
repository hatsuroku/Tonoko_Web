/*-------------------------------------------------------
这个文件主要处理各种按钮的事件和校验，请求逻辑,还有几个辅助函数
定制一般不需要改这个文件
---------------------------------------------------------*/
//全局变量(g_前缀,这些做定制时都不能变)
var g_pstrength,//修改密码时用的密码强度，由initPstrength初始化
	g_querylogutUrl = "/out.htm",
	g_querytTime = 3,//3秒心跳
	g_remberTime = 2592000,//30*24*3600 s
	g_smsackUrl = "/sms_ack/",
	g_url = "../login.php";
	g_ipv4or6 = ""
//cookie
var cookie = {
	set : function(name,value,time){
		var cur=new Date();
		/*cookie的生命时长设置为60秒*/
		if(time === undefined){
			time = 60;
		}
		cur.setTime(cur.getTime() + time*1000);
		document.cookie = name + "=" + escape(value)+";expires=" + cur.toGMTString();
	},
	get : function(name){
		if (document.cookie.length>0){
			var arrStr = document.cookie.split(";");
			for(var i = 0; i< arrStr.length; i++){
				var temp = arrStr[i].split("=");
				if($.trim(temp[0]) === name)
				{
					return unescape(temp[1]);
				}
			}
		}
		return "";
	}
};
//ie6,7不支持indexof,加上这个功能
Array.prototype.indexOf = function(obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++) {
         if (this[i] === obj) { return i; }
     }
     return -1;
}
//html编码
function htmlEncode(value){
	return !value?value:String(value).replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
}	

// 简写方法
function $id(id){
	return document.getElementById(id);
}

//转换json
function json_decode(str){
	var json = null;
	try{
		json = eval("(" + str + ')'); 
	}catch(e){}
	return json;
}

//获取url参数
function getUrlParam(val){
	var reg = new RegExp("(^|\\?|&)"+ val +"=([^&#]*)(\\s|&|$|#)", "i");
	if (reg.test(location.href)) return unescape(RegExp.$2); 
	return "";
}


	
//---------------校验代码------------->>

//初始化修改密码强度变量(不用改动)
function initPstrength(){
	$.ajax({
		url: "/passwordstrength",
		type : "GET",
		success: function(resp){
			var json= json_decode(resp);
			if(json){
				g_pstrength = json;
			}else{
				alert(_("修改密码强度信息格式不正确"));
			}
		},
		error : function(o){
			//alert(_("无法获取修改密码强度信息，网络异常"));
		}
	})
}

//修改密码的提示方法
function setChangePwdTips(msg){
	js_alert("mode_changePwd", msg);
}
//修改密码的提示方法
function setSmsTips(msg){
	js_alert("mode_sms", msg);
}
//修改密码的提示方法
function setPasswordTips(msg){
	js_alert("mode_password", msg);
}

//密码登录的校验
function pwdValidtor(){
	var user = $id("password_name"),
		checked = $id("password_disclaimer")?$id("password_disclaimer").checked:false,
		pwd = $id("password_pwd");

	if((user.value.length <= 0) || (pwd.value.length <= 0)){
		valid = false;
		setPasswordTips(_("用户账户和密码不能为空！"));
		return false;
	}else if(user.value.length > 95){
		setPasswordTips(_("用户账户长度不能超过95个字节！"));
		return false;
	}else if(window.g_hasDisclaimer && !checked){
		setPasswordTips(_("请先阅读免责声明，并勾选!"));
		return false;
	}
	setPasswordTips("");
	return true;
}

//获取验证码时的校验,主要检查手机号格式
function getSmsCodeValidtor(){
	var user = $id("sms_name"),
		Regx = /^[0-9]*$/;

	if(user.value.length <= 0){
		setSmsTips(_("手机号码不能为空！"));
		return false;
	}else if(user.value.length > 20){
		setSmsTips(_("手机号码最大长度为20！"));
		return false;
	}else if(!Regx.test(user.value)){
		setSmsTips(_("手机号码不能含有非数字字符！"));
		return false;
	}
	return true;
}

//短信认证时的校验
function smsValidtor(){
	if(!getSmsCodeValidtor())return false;
	var pwd = $id("sms_pwd").value;
	var checked = $id("sms_disclaimer")?$id("sms_disclaimer").checked:false;
	if(pwd === ""){
		setSmsTips(_("验证码不能为空！"));
		return false;
	}
	if(window.g_hasDisclaimer && !checked){
		setSmsTips(_("请先阅读免责声明，并勾选!"));
		return false;
	}
	setSmsTips("");
	return true;
}

//修改新密码的时候，对密码强度的修改
function validatePasswordStrength() {
    if (g_pstrength && g_pstrength.enable) {
        var user = $id("changePwd_name").value.toLowerCase();
        var pwd  = $id("changePwd_oldPwd").value;
		var pwd1 = $id("changePwd_newPwd").value;
        if (g_pstrength.noequalname) {
            if (user && pwd1 == user) {
                setChangePwdTips(_("密码不能等于用户名"));
                return false;
            }
        }
        if (g_pstrength.noequalold) {
            if (pwd && pwd1 == pwd) {
                setChangePwdTips(_("新密码不能与旧密码相同"));
                return false;
            }
        }
        if (g_pstrength.limit.enable && g_pstrength.limit.minlen > 1) {
            if (pwd1.length < g_pstrength.limit.minlen) {
                setChangePwdTips(_("密码最小长度为") + g_pstrength.limit.minlen + _("个字符"));
                return false;
            }
        }
        if (g_pstrength.must.enable) {
            if (g_pstrength.must.num && pwd1.search(/\d/) == -1) {
                setChangePwdTips(_("密码必须包含数字"));
                return false;
            }
            if (g_pstrength.must.alph && pwd1.search(/[A-Za-z]/) == -1) {
                setChangePwdTips(_("密码必须包含字母"));
                return false;
            }
            if (g_pstrength.must.special && pwd1.search(/[!@#\$%\^&\*\(\)]/) == -1) {
                setChangePwdTips(_("密码必须包含特殊字符（shift+数字）"));
                return false;
            }
        }
        return true;
    } else {
		return true;	
	}
}

//修改密码时的校验
function changePwdValidtor(){
	var user = $id("changePwd_name"),
		password = $id("changePwd_oldPwd"),
		pwd1 = $id("changePwd_newPwd"),
		pwd2 = $id("changePwd_newPwd2");
	if(user.value.length <= 0){
		setChangePwdTips(_("用户名不能为空！"));
		return false;
	}else if(user.value.length > 95)
	{
		setChangePwdTips(_("用户名长度不能超过95个字节！"));
		return false;
	} else  if(pwd1.value.length >= 40 || pwd1.value.length ===0){
		setChangePwdTips(_("密码不能为空且长度必须小于40个字符！"));
		return false;
	} else  if(pwd1.value !== pwd2.value){
		setChangePwdTips(_("确认密码不一致！"));
		return false;
	} 
    //密码强度校验
	if (validatePasswordStrength() === false){
		return false;
	} 
	setChangePwdTips("");
	return true;
}

//<<---------------校验代码-------------

//---------------按钮事件和请求的绑定(定制一般不用改动)------------->>
//初始化检查用户是否登录
function onInitUserLogin() {
	function fn(o){
		if(!o.success){
			js_alert(formid, "请求失败,请先检查网络");
			return;
		}
		
		if (o.online) {
			var template = getUrlParam("template") || "default";
			var username = o.username;
			var tab = getUrlParam("tabs") || "pwd";
			window.location = "/ac_portal/proxy.html?template="+template+"&type=logout&username="+username+"&tabs="+tab;
		} else {
			js_alert(formid, _("当前用户不在线,请先认证"));
		}
		enablePop(false);
	}
	var params = {
		opr:'online_check'
	}
	formid = "mode_password";
	$ajax(params,formid,fn);
}

// 获取用户流量信息
function onGetUserFlux() {
	$.ajax({
		url: "../userflux",
		type : "POST",
		success: function(resp){
			var content = resp;
			flux_show(content);
		},
		error : function(o){
			error(_("网络异常"));
		}
	})
}
	
//密码登录，密码登录按钮事件
function onPwdLogin(){
	window.location.href='login_success.com';
/*	if(!pwdValidtor())return;
	var params = {
		opr:'pwdLogin',//smsLogin表示短信认证登录,pwdLogin表示密码认证登录
		userName : $id("password_name").value,
		pwd : $id("password_pwd").value,
		ipv4or6 : g_ipv4or6,
		rememberPwd : $id("rememberPwd").checked ? '1':'0'
	};
	loginRequest(params,"mode_password",$id("password_submitBtn"));
	*/
}

//修改密码，确定按钮事件
function onChangePwd(){
	if(!changePwdValidtor())return;
	var params = {
		opr:'changePwd',
		userName:$id("changePwd_name").value,
		oldPwd:$id("changePwd_oldPwd").value,
		newPwd:$id("changePwd_newPwd").value
	};
	changePwdRequest(params,"mode_changePwd",$id("changePwd_submitBtn"))
}

//获取验证码，点击获取验证码按钮事件
function onGetSmsCode(){
	if(!getSmsCodeValidtor())return;
	var checked = $id("sms_disclaimer")?$id("sms_disclaimer").checked:false;
	if(window.g_hasDisclaimer && !checked){
		setSmsTips(_("请先阅读免责声明，并勾选!"));
		return false;
	}
	cookie.set("phoneNumber",$id("sms_name").value,g_remberTime);
	var params = {
		opr:'getSmsCode',
		userName : $id("sms_name").value
	};
	getSmsCodeRequest(params,"mode_sms",$id("sms_getCodeBtn"));
}

//短信登录，点击短信登录按钮事件
function onSmsLogin(){
	if(!smsValidtor())return;
	var params = {
		opr:'smsLogin',
		userName : $id("sms_name").value,
		pwd : $id("sms_pwd").value,
		rememberPwd : $id("rememberSms").checked ? '1':'0'
	};
	loginRequest(params,"mode_sms",$id("sms_submitBtn"));
}

//免责声明的登录
function onDisclaimerLogin(){
	//成功后干啥
	function fn(o){
		btn.disabled = false;
		var formid = "mode_disclaimer";
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			return;
		}

		var action = o.action,interval,i = 3;
		switch (action)
		{
			case "location":
				btn.disabled = true;
				js_alert(formid, _("认证成功，")+"<b>"+(i)+"</b>"+_("秒后将跳转页面。"));
				interval = setInterval(function (){
				if (i > 0) {
					js_alert(formid, _("认证成功，")+"<b>"+(i--)+"</b>"+_("秒后将跳转页面。"));
				} else {
					clearInterval(interval);
					js_alert(formid, "");
					
					var reg = RegExp(
						"^http://www\.airport\.us/" +
						"\|^http://www\.thinkdifferent\.us/" +
						"\|^http://captive\.apple\.com/" +
						"\|^http://www\.appleiphonecell\.com/" +
						"\|^http://www\.ibook\.info/" +
						"\|^http://www\.itools\.info/" +
						"\|^http://www\.gstatic\.com/generate_204" +
						"\|^http://clients[0-9]\.google\.com/generate_204",
						"i");
					if (reg.test(o.location)) {
						var url = window.location.href;
						if(url.indexOf("&type=logout&username=") < 0) {
							url = url + "&type=logout&username=" + o.userName;
						}
						window.location = url;
					}
					else {
						window.location = o.location;
					}
				}
			},1*1000);
			break;
		}
		//登录成功后启用或关闭心跳状态
		enablePop(o.pop);
	}
	
	var checked = $id("dis_disclaimer")?$id("dis_disclaimer").checked:false,
		btn = $id("dis_submitBtn");
	if(window.g_hasDisclaimer && !checked){
		js_alert("mode_disclaimer",_((_("请先阅读免责声明，并勾选!"))));
		return false;
	}
	btn.orgValue = btn.value;
	btn.value = _("请稍后...");
	btn.disabled = true;
	$ajax({
		opr : 'noAuthlogin'
	},"mode_disclaimer",fn,btn);
}

//免认证登录
function onFreeauthLogin(){
	//成功后干啥
	function fn(o){
		btn.disabled = false;
		var formid = "mode_freeauth";
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			return;
		}

		var action = o.action,interval,i = 3;
		switch (action)
		{
			case "location":
				btn.disabled = true;
				js_alert(formid, _("认证成功，")+"<b>"+(i)+"</b>"+_("秒后将跳转页面。"));
				interval = setInterval(function (){
				if (i > 0) {
					js_alert(formid, _("认证成功，")+"<b>"+(i--)+"</b>"+_("秒后将跳转页面。"));
				} else {
					clearInterval(interval);
					js_alert(formid, "");
					
					var reg = RegExp(
						"^http://www\.airport\.us/" +
						"\|^http://www\.thinkdifferent\.us/" +
						"\|^http://captive\.apple\.com/" +
						"\|^http://www\.appleiphonecell\.com/" +
						"\|^http://www\.ibook\.info/" +
						"\|^http://www\.itools\.info/" +
						"\|^http://www\.gstatic\.com/generate_204" +
						"\|^http://clients[0-9]\.google\.com/generate_204",
						"i");
					if (reg.test(o.location)) {
						var url = window.location.href;
						if(url.indexOf("&type=logout&username=") < 0) {
							url = url + "&type=logout&username=" + o.userName;
						}
						window.location = url;
					}
					else {
						window.location = o.location;
					}
				}
			},1*1000);
			break;
			case "logout":
				activatePage('logout',o.userName);
			break;
		}
		//登录成功后启用或关闭心跳状态
		enablePop(o.pop);
	}
	
	var checked = $id("freeauth_disclaimer")?$id("freeauth_disclaimer").checked:false,
		btn = $id("freeauth_submitBtn");
	if(window.g_hasDisclaimer && !checked){
		js_alert("mode_freeauth",_((_("请先阅读免责声明，并勾选!"))));
		return false;
	}
	btn.orgValue = btn.value;
	btn.value = _("请稍后...");
	btn.disabled = true;
	$ajax({
		opr : 'freeauth'
	},"mode_freeauth",fn,btn);
}

function onLogout(){
	logoutRequest({opr:'logout','ipv4or6':g_ipv4or6},'mode_logout',$id('logout_submitBtn'))
}



//通用ajax请求，会转成json参数给到successFn
function $ajax(params,formid,successFn,btn)
{
	function error(msg){
		if(btn){
			btn.disabled = false;
			btn.value = btn.orgValue;
		}
		js_alert(formid, msg);
	}
	$.ajax({
		url: g_url,
		data: params,
		type : "POST",
		success: function(resp){
			var json= json_decode(resp);
			if(json){
				successFn(json);
			}else{
				error(_("响应数据格式不正确"));
			}
		},
		error : function(o){
			error(_("网络异常"));
		}
	})
}

//通用登录请求
function loginRequest(params,formid,btn){
	//成功后干啥
	function fn(o){
		btn.disabled = false;
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			return;
		}
		//做下特殊处理，登录成功后应该恢复获取短信验证码的按钮
		var getCodeBtn = $id("sms_getCodeBtn");
		cookie.set("remainTime","");
		clearInterval(getCodeBtn.interval);
		getCodeBtn.value = _("重新获取");
		getCodeBtn.disabled = false;

		var action = o.action,interval,i = 3;
		switch (action)
		{
			case "changePwd":
				activatePage('changePwd',o.userName);
			break;
			case "location":
				btn.disabled = true;
				js_alert(formid, _("认证成功，")+"<b>"+(i)+"</b>"+_("秒后将跳转页面。"));
				interval = setInterval(function (){
				if (i > 0) {
					js_alert(formid, _("认证成功，")+"<b>"+(i--)+"</b>"+_("秒后将跳转页面。"));
				} else {
					clearInterval(interval);
					js_alert(formid, "");
					
					var reg = RegExp(
						"^http://www\.airport\.us/" +
						"\|^http://www\.thinkdifferent\.us/" +
						"\|^http://captive\.apple\.com/" +
						"\|^http://www\.appleiphonecell\.com/" +
						"\|^http://www\.ibook\.info/" +
						"\|^http://www\.itools\.info/" +
						"\|^http://www\.gstatic\.com/generate_204" +
						"\|^http://clients[0-9]\.google\.com/generate_204",
						"i");
					if (reg.test(o.location)) {
						var url = window.location.href;
						if(url.indexOf("&type=logout&username=") < 0) {
							url = url + "&type=logout&username=" + o.userName;
						}
						window.location = url;
					}
					else {
						window.location = o.location;
					}
				}
			},1*1000);
			break;
			case "logout":
				activatePage('logout',o.userName);
			break;
		}
		//登录成功后启用或关闭心跳状态
		enablePop(o.pop);
	}
	btn.orgValue = btn.value;
	btn.value = _("请稍后...");
	btn.disabled = true;
	
	$ajax(params,formid,fn,btn);
}

//获取短信认证码后的状态
function afterGetSmsCodeSate(o,params,formid,btn,cdtime)
{
	if(!o.success){
		js_alert(formid, o.msg);
		btn.value = _("重新获取");
		btn.disabled = false;
		return;
	}
	js_alert(formid, _("短信验证码发送成功"));
	//cookie.set("phoneNumber",params.userName);
	clearInterval(btn.interval);
	cookie.set("remainTime",cdtime);
	cookie.set("remainTimespan",(new Date()).getTime());
	var i = cdtime;//60s后重新获取
	btn.interval = setInterval(function (){
		if (i > 0) {
			i--;
			btn.value = _("重新获取")+"("+i+")";
			btn.disabled = true;
			cookie.set("remainTimespan",(new Date()).getTime());
			cookie.set("remainTime",i);
		} else {
			clearInterval(btn.interval);
			cookie.set("remainTime","");
			btn.value = _("重新获取");
			btn.disabled = false;
		}
	},1*1000);
}

//获取短信验证码的请求
function getSmsCodeRequest(params,formid,btn){
	//成功后干啥
	function fn(o){
		afterGetSmsCodeSate(o,params,formid,btn,60);
	}
	
	btn.orgValue = btn.value;
	btn.value = _("请稍后...");
	btn.disabled = true;
	$ajax(params,formid,fn,btn);
}

//修改密码的请求
function changePwdRequest(params,formid,btn){
	//成功后干啥
	function fn(o){
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			btn.disabled = false;
			return;
		}
		var i = 3;
		js_alert(formid, _("修改密码成功，")+"<b>"+(i)+"</b>"+_("秒后将返回登录页面。"));
		var interval = setInterval(function (){
			if (i > 0) {
				js_alert(formid, _("修改密码成功，")+"<b>"+(i--)+"</b>"+_("秒后将返回登录页面。"));
			} else {
				clearInterval(interval);
				btn.disabled = false;
				js_alert(formid, "");
				activatePage('login','fromChangePwd');
			}
		},1*1000);
	}
	
	btn.orgValue = btn.value;
	btn.value = _("请稍后...");
	btn.disabled = true;
	$ajax(params,formid,fn,btn);
}

function syncGetIpv4or6(params,formid,fn,btn){
	var hostname = location.hostname;
	if (hostname.indexOf(":") >= 0) { //ipv6
		url = "http://1.1.1.2/ac_portal/login.php";
		//url = "http://192.168.89.1/ac_portal/login.php";
	}else { //ipv4
		url = "http://[1::2]/ac_portal/login.php";
		//url = "http://[2001:4008::e]/ac_portal/login.php";
	}
	var userAgent = navigator.userAgent;
	var regStr_ie = /msie [\d.]+;/gi;
	if (userAgent.indexOf("MSIE") != -1 && parseInt((userAgent.match(regStr_ie)+"").replace(/[^0-9.]/ig,""), 10) <= 9.0 && window.XDomainRequest) {
		jQuery.support.cors = true;
		url = url + "?opr=ipv4or6online&onlygetip=1";
        var xdr = new XDomainRequest();
		if (xdr){
			xdr.timeout = 5000;
			xdr.open("post", url);
			xdr.onload = function () {
				var json = json_decode(xdr.responseText);
				if(json){
					if (json.success){
						g_ipv4or6 = json.ip;
					}
					params.ipv4or6 = g_ipv4or6;	
					$ajax(params,formid,fn,btn);
				}	
			}
			xdr.onerror = function(){
				params.ipv4or6 = g_ipv4or6;	
				$ajax(params,formid,fn,btn);
			}
			xdr.ontimeout  = function(){
				params.ipv4or6 = g_ipv4or6;	
				$ajax(params,formid,fn,btn);
			}
			xdr.send();
		}
    } else {
		var ajaxTimeoutTest = $.ajax({
			url: url,
			type : "POST",
			data : {
				opr : "ipv4or6online"
			},
			timeout : 5000,
			success: function(resp){
				var json = json_decode(resp);
				if(json){
					if (json.success){
						g_ipv4or6 = json.ip;
					}
					
				}
				params.ipv4or6 = g_ipv4or6;	
				$ajax(params,formid,fn,btn);
			},
			error : function(resp){
				params.ipv4or6 = g_ipv4or6;	
				$ajax(params,formid,fn,btn);
			}
		})
	}
}

//注销请求
function logoutRequest(params,formid,btn)
{
	//成功后干啥
	function fn(o){
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			btn.disabled = false;
			return;
		}
		var i = 3;
		js_alert(formid, _("注销成功，")+"<b>"+(i)+"</b>"+_("秒后将返回登录页面。"));
		var interval = setInterval(function (){
			if (i > 0) {
				js_alert(formid, _("注销成功，")+"<b>"+(i--)+"</b>"+_("秒后将返回登录页面。"));
			} else {
				clearInterval(interval);
				btn.disabled = false;
				js_alert(formid, "");
				activatePage('login');
			}
		},1*1000);
		enablePop(false);
	}
	
	btn.orgValue = btn.value;
	btn.value = _("请稍后...");
	btn.disabled = true;
	syncGetIpv4or6(params,formid,fn,btn);
	//params.ipv4or6 = g_ipv4or6;
	//$ajax(params,formid,fn,btn);
}
//<<---------------按钮事件和请求的绑定-------------


//logout页面当pop=1的时候需要发心跳，同时在离开页面时需要提示
var enablePop = (function(){
	var pop = false,interval;
	function stratQuery(){
		clearInterval(interval);
		interval = setInterval(request,g_querytTime*1000);
	}
	//心跳请求
	function request(){
		$.ajax({
			url: g_querylogutUrl,
			type : "GET",
			success: function(resp){
				if(window.console && window.console.log){
					console.log("tick");
				}
			}
		});
	}
	window.onbeforeunload = function(e){
		e = e || window.event;
		if(pop){
			var msg = _("温馨提示：离开本页面将注销此次登录。");
			e.returnValue = msg;
			return msg;
		}
	};
	return function(enable){
		pop = enable;
		if(pop){
			stratQuery();
		}else{
			clearInterval(interval);
		}
	}
})();

//实现html中英文替换
function doLocalHtml(){
	$('*').each(function(){
		if($(this).attr("_html")){
			$(this).html(_($(this).attr("_html")));
		}
		if($(this).attr("_value")){
			$(this).attr("value",_($(this).attr("_value")));
		}
		if($(this).attr("_title")){
			$(this).attr("title",_($(this).attr("_title")));
		}
	});
}
//实现js中英文替换
function _(str){
	//如果是中文则不处理。
	if(parseInt(getUrlParam("lang")) !== 1){
		return str;
	}
	var argus = Array.prototype.slice.call(arguments, 1);
	str = g_Language.hasOwnProperty(str) ? g_Language[str] : str;
	return str.replace(/\{(\d+)\}/g, function (m, i) {
		i = parseInt(i, 10);
		if (i >= 0 && i < argus.length) {
			return argus[i];
		} else {
			return m;
		}
	});
}

//定时请求后台,二维码认证
function ajaxQCode(){
	$.ajax({
		type:'GET',
		url : '/ac_portal/qcode_test.html?'+new Date().getTime(),
		success : function(json){			
			if(json == 1){
				js_alert("mode_qrcode", _("认证成功"));
				clearInterval(window.g_setInter); 
			}
		},
		error : function(json){
			//js_alert("mode_qrcode", _("认证失败"));
		}		
	});
}

//判断是否是IPv4，v6，返回处理后的location.host
function locationHost(){
	var hostname = location.hostname,
	 	host = location.host,
		port = location.port;
	// 如果是IPv6，并且没有中括号，则加上
	if(hostname.indexOf(":")>=0){
		// 如果有中括号
		if(/^\[.*\]$/.test(hostname)){
			//hostname = hostname.slice(1, hostname.length-1);
		}else{
			hostname = "[" + hostname + "]";
		}
		// IE在IPv6下host有误，IP不带中括号
		host = hostname + (port ? (":" + port) : "");		
	}
	return host;
}

//生成跳转登陆页面的url,端口为80
function createLoginUrl(){
	var hostname = location.hostname,
	 	host,
		port = location.port;
	// 如果是IPv6，并且没有中括号，则加上
	if(hostname.indexOf(":")>=0){
		// 如果有中括号
		if(/^\[.*\]$/.test(hostname)){
			//hostname = hostname.slice(1, hostname.length-1);
		}else{
			hostname = "[" + hostname + "]";
		}
				
	}
	
	host = hostname;
	
	return "http://"+host;	
}

//生成二维码url
function create_qrcode_url(){
	var urlIp = getUrlParam("ip"),
		urlR = getUrlParam("r"),
		urlT = getUrlParam("t"),
		urlVlanid = getUrlParam("vlanid"),
		urlc = getUrlParam("c"),
		url;
	
	url = createLoginUrl()+"/ac_portal/qcode.html?ip="+urlIp+"&r="+urlR+"&t="+urlT+"&c="+urlc+"&vlanid="+urlVlanid;
	
	return url;
}

//生成2维码
function create_qrcode (text, typeNumber, errorCorrectLevel, table) {
	var qr = qrcode(typeNumber || 10, errorCorrectLevel || 'M');
	qr.addData(text);
	qr.make();
	var ua = window.navigator.userAgent;
	//ie6,ie7使用tab
	if(ua.indexOf("MSIE 7")>-1 || ua.indexOf("MSIE 6")>-1){
		return qr.createTableTag();
	}
	return qr.createImgTag();
};

// 获取当前设备相关信息
function getDeviceInfo() {
        var UA = (navigator.userAgent).toLowerCase();
        return {
            ratio: window.devicePixelRatio || 1,
            isMobile: /(android|mobile|windows (ce|phone)|kindle|blackberry|psp|palm|symbian)/.test(UA),
            isIpad: /ipad/.test(UA),
            isIOS: /(iphone|ipad|ipod|mac os)/.test(UA),
            isAndroid: /android/.test(UA),
            isMQQBrowser: /mqqbrowser/.test(UA),
            isWeChat: /micromessenger/.test(UA)
        }
}

function initWechatLink(){
	var deviceInfo = getDeviceInfo(),
        isPreview = getUrlParam("ispreview");
        
    if(!deviceInfo.isWeChat && (deviceInfo.isIOS || (deviceInfo.isMQQBrowser && deviceInfo.isAndroid) || isPreview)) {
        var href = deviceInfo.isIOS ? "weixin://" : "http://weixin.qq.com/r/" ; 
        $("#wechat_link").attr("href", href);
        $("#wechat_link").show();
    } else{
        $("#wechat_link").hide();
    }
}

//上线并跳转
function ajaxLogonOtherIp(rmtIp){
	var url = "../login.php"
	$.ajax({
		url: url,
		type : "POST",
		data : {
			opr : "logonipv4or6",
			ipv4or6 : rmtIp
		},
		success : function(resp){
			var json = json_decode(resp);
			if(json){
				if (json.success){
					if(json.url == "")
						activatePage('logout', json.name);
					else
						window.location = json.url;
				}	
			}
		}	
	});
}

function ajaxCustom(url){
	var userAgent = navigator.userAgent;
	var regStr_ie = /msie [\d.]+;/gi;
	if (userAgent.indexOf("MSIE") != -1 && parseInt((userAgent.match(regStr_ie)+"").replace(/[^0-9.]/ig,""), 10) <= 9.0 && window.XDomainRequest) {
		jQuery.support.cors = true;
		url = url + "?opr=ipv4or6online";
        var xdr = new XDomainRequest();
		if (xdr){
			xdr.open("post", url);
			xdr.onload = function () {
				var json = json_decode(xdr.responseText);
				if(json){
					if (!json.success){
						js_alert("mode_password", _("获取ipv4或ipv6地址失败"));
						return;
					}
					g_ipv4or6 = json.ip;
					if(json.isOnline)
						ajaxLogonOtherIp(json.ip);
				}	
			}
			xdr.send();
		}
    } else {
		$.ajax({
			url: url,
			type : "POST",
			data : {
				opr : "ipv4or6online"
			},
			success: function(resp){
				var json = json_decode(resp);
				if(json){
					if (!json.success){
						js_alert("mode_password", _("获取ipv4或ipv6地址失败"));
						return;
					}
					g_ipv4or6 = json.ip;
					if(json.isOnline)
						ajaxLogonOtherIp(json.ip);
					
				}else{
					js_alert("mode_password", _("获取ipv4或ipv6地址失败"));
				}
			},
			error : function(o){
				js_alert("mode_password", _("获取ipv4或ipv6地址失败"));
			}
		})
	}
}

function initCustom(){
	var hostname = location.hostname;
	if (hostname.indexOf(":") >= 0) { //ipv6
		url = "http://1.1.1.2/ac_portal/login.php";
		//url = "http://192.168.89.1/ac_portal/login.php";
	}else { //ipv4
		url = "http://[1::2]/ac_portal/login.php";
		//url = "http://[2001:4008::e]/ac_portal/login.php";
	}
	
	ajaxCustom(url);
}

$(document).ready(function(){
	doLocalHtml();
	var pop = getUrlParam("pop"),type = getUrlParam("type"),remainTime,phoneNumber,timespan;
	if(pop === "1" && type === "logout"){
		enablePop(true);
	}
	//定时请求后台,二维码认证才会发请求
	if(getUrlParam('tabs').indexOf('qrcode')>-1){
		window.g_setInter = setInterval(ajaxQCode,5000);
	}
	remainTime = parseInt(cookie.get("remainTime"));
	phoneNumber = cookie.get("phoneNumber");
	if(remainTime){
		timespan = remainTime - Math.floor(((new Date()).getTime() - parseInt(cookie.get("remainTimespan")))/1000);
		if(timespan>0){
			$id("sms_getCodeBtn").disabled = true;
			$id("sms_name").value = phoneNumber;
			afterGetSmsCodeSate({success:true},{userName:phoneNumber},"mode_sms",$id("sms_getCodeBtn"),timespan);
		}
	}else if(phoneNumber){
		$id("sms_name").value = phoneNumber;
	}
	//如果是通过直接请求的logout页面，需要发个请求通知服务端
	if(type === "logout"){
		$.ajax({
			url: g_smsackUrl,
			type : "GET",
			success: function(resp){
				if(window.console && window.console.log){
					console.log("sms_ack");
				}
			}
		});
	}
	//ipv4,ipv6一次认证
	initCustom();
});