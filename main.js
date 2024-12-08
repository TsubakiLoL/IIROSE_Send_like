
//通过UID给用户点赞
function send_like_by_uid(uid){
	socket.send("+*"+uid);

};
//建立绑定到指定uid的点赞按钮
function add_like_btn_by_uid(uid){
	var selectholderbox = document.getElementById("selectHolderBox");
	var div=`
<div id="send_like_div" onmouseenter="Utils.Sound.play(0);" class="selectHolderBoxItem selectHolderBoxItemIcon"><div class="mdi-account-cog" style="font-family:md;font-size:28px;text-align:center;line-height:100px;height:100px;width:100px;position:absolute;top:0;opacity:.7;left:0;"></div>点赞<div id="send_like_touch" class="fullBox whoisTouch3"></div></div>`;
	selectholderbox.insertAdjacentHTML('beforeend',div);
	var send_like_touch=document.getElementById("send_like_touch");
	send_like_touch.addEventListener("click", function () {
        send_like_by_uid(uid);
        _alert("点赞成功！");
    });

}


//树更改时进行的回调
function callback (mutationList, observer) {
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case 'childList':
          /* 从树上添加或移除一个或更多的子节点；参见 mutation.addedNodes 与
             mutation.removedNodes */
	         for (let i = 0; i <mutation.addedNodes.length; i++) {
		          var node=mutation.addedNodes[i];
		          if(node.classList.contains("msg") && node.hasAttribute("data-id") ){
			            var data_id=node.getAttribute("data-id");
  			          var uid=data_id.slice(0,13);
			            var whoistouccbtn=node.children[0].children[1];
			            whoistouccbtn.addEventListener("click", function () {
				              add_like_btn_by_uid(uid);
			            });
		          }
	         }	
          break
      }
    })
  };

var fullboxholder= document.getElementById("msgholder");
 let observerOptions = {
    childList: true, // 观察该元素的子元素新增或者删除
    subtree: true, //该元素的所有子元素新增或者删除

  };

let observer = new MutationObserver(callback);

observer.observe(fullboxholder, observerOptions);
