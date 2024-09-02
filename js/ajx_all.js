/*
 * 统一封装ajax请求
 */
function ajax_all(datain, rq_url, fun_ok, errcall) {
	var tokon_info = get_token_info();
	if(tokon_info == null) {
		return;
	}
	var userid = tokon_info.userid;
	mui.ajax(rq_url, {
		data: datain,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			"Token": tokon_info.token1h
		},
		success: function(datain) {
			fun_ok(datain);

		},
		error: function(xhr, type, errorThrown) {
			errcall(errorThrown);
		}
	})
}
/*
 * 统一封装ajax请求
 */
function ajax_all_notoken(datain, rq_url, fun_ok, errcall) {
	mui.ajax(rq_url, {
		data: datain,
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 5000,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		crossDomain: true,
		success: function(datain) {
			fun_ok(datain);
		},
		error: function(xhr, type, errorThrown) {
			errcall();
		}
	})
}

function demo() {
	var datain = {
		userid: tokon_info.userid,
		qflx: takeinfo.qflx,
		qyz_name: takeinfo.qyz_name,
		qfdx_name: takeinfo.qfdx_name,
		qfnr_text: takeinfo.qfnr_text,
		show_dx_name: takeinfo.show_dx_name
	};
	ajax_all_notoken(datain, rq_url, function(retstr) {
		var data = JSON.parse(retstr);
		if(data.Retflag != -1) {
			if(data.Retflag == 1) {
				okfun(data.Retstr);
			}

		}
	}, function() {
		mui.alert("数据异常,请检查网络设置");
	});
}