

//通过UID给用户点赞
function send_like_by_uid(uid){
	_alert("点赞UID："+uid);
	socket.send("+*"+uid);

};


//建立绑定到指定uid的点赞按钮
function add_like_btn_by_uid(uid){
	console.log("添加点赞按钮"+uid);
	var selectholderbox = document.getElementById("selectHolderBox");
	var div=`
<div id="send_like_div" onmouseenter="Utils.Sound.play(0);" class="selectHolderBoxItem selectHolderBoxItemIcon"><div class="mdi-account-cog" style="font-family:md;font-size:28px;text-align:center;line-height:100px;height:100px;width:100px;position:absolute;top:0;opacity:.7;left:0;"></div>点赞<div id="send_like_touch" class="fullBox whoisTouch3"></div></div>`;
	selectholderbox.insertAdjacentHTML('beforeend',div);
	var send_like_touch=document.getElementById("send_like_touch");
	send_like_touch.addEventListener("click", function () {
        send_like_by_uid(uid);
    });

}


//打印参数
function printParams(...param) {
    for (let i = 0; i < param.length; i++) {
        console.log(`参数 ${i}:`, param[i]);
    }
}

// 回调函数
function msgBtnClick(...param) {
	let type=arguments[0]
	printParams(...param)
	console.log("this为：",this)
	switch(type){
		case 7:
   			switch(arguments.length) {
     				case 1:
        				console.log("参数长度为1");
					console.log(this instanceof Element);
					if(this instanceof Element && this.hasAttribute("uid")){
						add_like_btn_by_uid(this.getAttribute("uid"));
					}
        			break;
    	 			case 2:
					console.log("参数长度为2");
        				let uid=arguments[1][5]
					add_like_btn_by_uid(uid)
        			break;
	        } 
        break;
    }
}


// 代理函数
function proxyFunction(targetFunction, callback) {
    return function(...param) {
        console.log("代理函数被调用！参数为", param);
	let return_v=targetFunction.call(this,...param);
        // 调用回调函数
        callback.call(this,...param);
        return return_v;
    };
}

// 缓存 
var target_function_cache = Objs.mapHolder.function.event;

// 绑定代理函数
Objs.mapHolder.function.event = proxyFunction(
    target_function_cache, // 原始 Native Code
    msgBtnClick, // 回调函数
);


console.log(Objs.mapHolder.function.event==target_function_cache);
