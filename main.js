function get_liked_user(origin_data){
	return origin_data.split(">")[16].split('"')[1].split("'");
}

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
<div id="send_like_div" onmouseenter="Utils.Sound.play(0);" class="selectHolderBoxItem selectHolderBoxItemIcon"><div class="mdi-account-cog" style="font-family:md;font-size:28px;text-align:center;line-height:100px;height:100px;width:100px;position:absolute;top:0;opacity:.7;left:0;"></div><span id="like_text">点赞</span><div id="send_like_touch" class="fullBox whoisTouch3"></div></div>`;
	selectholderbox.insertAdjacentHTML('beforeend',div);
	var send_like_touch=document.getElementById("send_like_touch");
	send_like_touch.addEventListener("click", function () {
        send_like_by_uid(uid);
    });

}
function getUsernameByUID(e) {
    var t = Objs.mapHolder.Assets.userlistUid.indexOf(e);
    if (-1 < t) {
      // 成功找到UID时的处理流程
      var o = Objs.mapHolder.Assets.userlistL[t];
      return o;
    }
    // 未找到用户的降级处理
    return console.warn("UID not found:" + e), null;
  }

//打印参数
function printParams(...param) {
    for (let i = 0; i < param.length; i++) {
        console.log(`参数 ${i}:`, param[i]);
    }
}
//当前查看的点赞用户的缓存
var now_add_like_user;
// 回调函数
function msgBtnClick(...param) {
	let type=arguments[0]
	printParams(...param)
	console.log("this为：",this)
	switch(type){
		case 7:
   			switch(arguments.length) {
     				case 1:
					    console.log(this instanceof Element);
					    if(this instanceof Element && this.hasAttribute("uid")){
						
                            var real_name=getUsernameByUID(this.getAttribute("uid"))
                            if(real_name==myself){
                                break;
                            }
                            add_like_btn_by_uid(this.getAttribute("uid"));
                            socket.send("+-"+real_name)
                        
					    }
        			    break;
    	 			case 2:
					    let name=arguments[1][0]
					    if(name==myself){
						    break;
					    }
                        now_add_like_user=name;
        			    let uid=arguments[1][4];
					    add_like_btn_by_uid(uid);
                        socket.send("+-"+name)
        			    break;
	        } 
        break;
    }
}


// 代理函数
function proxyFunction(targetFunction, callback) {
    return function(...param) {
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

function ws_message_get(...param){
    if (typeof arguments[0]=="string" && arguments[0].startsWith("+1")){
        var liked_persion=get_liked_user(arguments[0])
        console.log(liked_persion.toString())
        console.log(liked_persion.includes(myself).toString())
        if(liked_persion.includes(myself)){
            var like_text=document.getElementById("like_text");
            if(like_text!=null){
                like_text.textContent="已经赞啦";
                var button = document.getElementById("send_like_div");

                // 禁用按钮
                button.dataset.disabled = "true";  // 触发 CSS 样式
                button.onmouseenter = null; 
                var touchArea = document.getElementById("send_like_touch");
                touchArea.style.pointerEvents = "none";  // 冗余保障（CSS 已覆盖）
                touchArea.onclick = null;  
                touchArea.dataset.disabled = "true";    
            }
        }
    }

}
var target_function_cache_ws=socket._onmessage;

socket._onmessage=proxyFunction(ws_message_get,target_function_cache_ws)
