var con_signalr_State_all = 0; //使用用户的链接状态  不能连两个 登录后断开 重连带上token 即可区分
var hub_obj_all = null; //所有用户
var hubobj = null; //$.connection.hub 对象
var ischonglian = false;
/*
 * 适用于所有用户的普通连接
 */
function init_signalr_con_all() {

	$(function() { 
		$.support.cors = true;

		$.connection.hub.url = host_server + "/signalr";
		//$.connection.MessageHub, 这个与服务端对应。
		var hub = $.connection.MessageHub;

		//服务端调用方法在这声明
		hub.client.showMessage = rec_mes;
		//		$.connection.hub.logging = true;
		var cid = get_get_ipover();
		var token_info = get_token_info_no_ts();
		var tkstr = "";
		var userstr = "0";
		if(token_info == null) {
			tkstr = "";
			userstr = "-1";
		} else {
			tkstr = "";
			userstr = "-1";
		}
		$.connection.hub.qs = {
			'cid': "",
			'tk': tkstr,
			"us": userstr
		};
		$.connection.hub.disconnected(function(e) {
			if($.connection.hub.lastError) {

			}
			if(!ischonglian) {
				chonglian_signalr();
			}

		})
		//连接状态更改时引发。 提供的旧状态和新的状态 （连接、 已连接、 正在重新连接或已断开连接）
		$.connection.hub.stateChanged(function(e) {
			con_signalr_State_all = e.newState;
			console.log('stateChanged=' + JSON.stringify(e))
			console.log("con_signalr_State_all=" + con_signalr_State_all);
			if(e.oldState == $.signalR.connectionState.disconnected) {

			}
			if(e.newState == 4) {

			}
			if(e.oldState == $.signalR.connectionState.reconnecting) {

			}
			if(e.newState == 2) {

			}

			if(e.oldState == $.signalR.connectionState.connected) {

			}
			if(e.newState == 1) {
				//				console.log(JSON.stringify(e));
				//				if(e.oldState == 4) { 
				mui.toast("链接服务器成功");
				//				}
			} else {
				diaoxianle();
			}
			if(e.oldState == $.signalR.connectionState.connecting) {

			}
			if(e.newState == 0) {

			}
		});

		$.connection.hub.onDisconnect = function(e) {

		}
		$.connection.hub.start();
		hub_obj_all = hub; //取出对象
		hubobj = $.connection.hub;
	})
}

function diaoxianle() {
	var top = plus.webview.getTopWebview(); //如果房间时打开状态 就退出
	var roomview = plus.webview.getWebviewById("jucf_romm.html");

	if(roomview != null && roomview != undefined) {
		if(top.id == roomview.id) {
			if(roomview.isVisible()) {
				roomview.evalJS("tuichu_room()");
			}
		}
	}
}

function chonglian_signalr() {
	ischonglian = true;

	setTimeout(function() {
		var cid = get_get_ipover();
		var token_info = get_token_info_no_ts();
		var tkstr = "";
		var userstr = "0";
		if(token_info == null) {
			tkstr = "";
			userstr = "-1";
		} else {
			tkstr = "";
			userstr = "-1";
		}
		hubobj.qs = {
			'cid': "",
			'tk': tkstr,
			"us": userstr
		};
		hubobj.start();
		ischonglian = false;
	}, 100)
};
/*
 * 登录用户 登录时先断开 然后带token重连
 */
function init_signalr_con_user() {
	var token_info = get_token_info_no_ts();
	if(token_info == null) {
		return;
	}
	hubobj.stop();
	chonglian_signalr();
}

function clos_con_signalr() {
	if(hubobj != null) {
		hubobj.stop();
	}
	if(wsocket != null) {
		wsocket.close();
	}

}
/*
 * 调用服务端方法带返回值
 */
function invoke_server_fun_ret_user(messtr, callback) {
	if(hub_obj_all == null) { //未初始化
		console.log("未初始化")
		return;
	}

	if(con_signalr_State_all != 1) { //未连接
		console.log("未连接")
		mui.toast("正在重新链接服务器");
		return;
	}

	return hub_obj_all.invoke('NewContosoChatMessage', messtr).done(function(ret) {
		//		console.log(ret);
		callback(ret);
	}).fail(function(error) {
		console.log('Error: ' + error);
		mui.toast("获取数据异常，请检查网络设置");
	});

};

function rec_mes(messtr) {
	//			console.log(messtr)
	var obj = JSON.parse(messtr);
	if(typeof(messtr) == "object") {
		obj = messtr;
	} else {
		obj = JSON.parse(messtr);
	}
	switch(obj.type) {
		case 1:
			var roomview = plus.webview.getWebviewById("jucf_romm.html");
			if(roomview != null && roomview != undefined) {
				if(roomview.isVisible()) {
					roomview.evalJS("set_room_kj_mes(" + obj.mes + ")");
				}
			}
			break;
		case 4:
			var roomview = plus.webview.getWebviewById("jucf_romm.html");
			if(roomview != null && roomview != undefined) {
				if(roomview.isVisible()) {
					roomview.evalJS("set_xiazhu_messhow(" + obj.mes + ")");
				}
			}
			break;
		case 5:
			var roomview = plus.webview.getWebviewById("jucf_romm.html");
			if(roomview != null && roomview != undefined) {
				if(roomview.isVisible()) {
					roomview.evalJS("zhongjiangle(" + JSON.stringify(obj) + ")");
				}
			}
			break;
		case -2: //管理员弹窗消息提示
			mui.alert(obj.mes, "管理员提示您");
			break;
		default:
			break;
	}

}