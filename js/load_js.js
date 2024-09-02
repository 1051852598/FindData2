function load_js(src_str_url,loadoverfun) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = src_str_url;
	
	document.getElementsByTagName('head')[0].appendChild(script);

	script.onload = function() {
		loadoverjs = true;
		loadoverfun();
		//mui.alert("加载完成");
	} //js加载完成执行方法
}