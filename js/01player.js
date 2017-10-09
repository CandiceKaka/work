require(['/work/js/config.js'],function(){
	
	require(['jquery','jquery-ui'],function($,$1){
		
		var mapList = new Map();
		mapList.set("浅唱",{source:"vae/许嵩 - 浅唱.mp3",name:"浅唱",index:0})
		mapList.set("庐州月",{source:"vae/许嵩 - 庐州月.mp3",name:"庐州月",index:1})
		mapList.set("千古",{source:"vae/许嵩 - 千古.mp3",name:"千古",index:2})
		mapList.set("认错",{source:"vae/许嵩 - 认错.mp3",name:"认错",index:3})
		
		
		var player = $("#player").get(0);
		var on;		//播放状态  播放的时候为true
		var height;
		var storage = window.localStorage;
		var duration=247;
		
		//控制音乐进度
		$(".timeLine").on("click",function(ev){
			var mouseX = ev.pageX;
			var eleLeft = $(this).get(0).getBoundingClientRect().left;
			var colorWidth = mouseX-eleLeft;
			$(".colorTimeLine").css("width",colorWidth);
			player.onloadedmetadata = function(){
				progress(duration,player.currentTime);
				player.play();
				player.currentTime = (colorWidth/300) * duration;
				console.log(player.currentTime);
			}
			
		})
		
		//切换暂停播放状态的函数
		function togglePause() {
			//正在播放状态，要切换到暂停状态
			if(on) {
				isPause.get(0).className = "iconfont icon-zanting2 pause";
				player.pause();
				$(".stick").get(0).style.transform = "rotate(-30deg)";
				$(".playPeople").get(0).style.animation = "";
				on = false;
			}else {
				isPause.get(0).className = "iconfont icon-zanting pause";
				player.play();
				progress(duration);
				$(".stick").get(0).style.transform = "rotate(0deg)";
				$(".playPeople").get(0).style.animation = "round 4s infinite linear";
				on = true;
			}
		}
		
		//播放音乐的函数
		function myPlay(name) {
			on = false;
			//遍历循环map集合
			for(var [key,value] of mapList) {
				if(key === name) {
					$(".playText h2").text(name);
					player.src = mapList.get(key).source;
					player.onloadedmetadata = function(){
						duration = player.duration;
						progress(duration);
						togglePause();
					}
					$(".playPeople").get(0).style.animation = "round 4s infinite linear";
					$(".stick").get(0).style.transform = "rotate(0deg)";
					player.play();
				}
			}
		}
		
		//音乐播放进度条
		var timer;
		function progress(duration=247,cur=0) {
			var aM = parseInt(duration/60);
			var aS = duration%60;
			var sA = parseInt(aS/10);
			var gA = parseInt(aS%10);
			$(".all i:eq(1)").text(aM);
			$(".all i:eq(3)").text(sA);
			$(".all i:eq(4)").text(gA);
			
			//在调用定时器之前，要先把之前开启的定时器全部清理掉
			clearInterval(timer);
			timer = setInterval(function(){
				var cur = player.currentTime;
				var cM =parseInt(cur/60);
				var cS = cur%60;
				var sC = parseInt(cS/10);
				var gC = parseInt(cS%10);
				$(".cur i:eq(1)").text(cM);
				$(".cur i:eq(3)").text(sC);
				$(".cur i:eq(4)").text(gC);
				var scale = cur/duration;
				$(".colorTimeLine").css("width",300*scale);
			},1000);
		}
	
	//切换上下首的函数
		function tab(options) {
			var cur = mapList.get( $(".playText h2").text() ).index;
			var curName = $(".playText h2").text();
			for(var [key,value] of mapList) {
				if(eval(value.index+options +1) == cur) {
					curName = value.name;
					myPlay(curName);
					return false;
				}
			}
			
			if(options == "-") {
				if(cur == 3) {
					myPlay("浅唱");
				}
			}
			
			if(options == "+") {
				if(cur == 0) {
					myPlay("认错");
				}
			}
		}
	
	//上下首切换
		$(".pre").on("click",function(){
			tab("+");
		})
		
		$(".next").on("click",function(){
			tab("-");
		});
		
		//随机点击播放一首歌
		var aLi = $(".songsList ul li").on("click",function(){
			myPlay($(this).find("h3").text());
		});
		
		//暂停与播放
		var isPause = $(".pause");
		
		//点击播放按钮
		isPause.on("click",function(){
			togglePause();
		})
		
		//随机播放
		$(".randomPlay").on("click",function(){
			//随机生成一个要播放的音乐的索引值
			var randomNum =  parseInt(Math.random()*4);
			for(var [key,value] of mapList) {
				if(value.index === randomNum) {
					myPlay(value.name);
					return;
				}
			}
		});
		
		//重头播放
		$(".refresh").on("click",function(){
			var curName = $(".playText h2").text();
			myPlay(curName);
		});
		
		//音量是否静音的调节
		var isMute;	//默认有声音 undefined
		$(".voice").on("click",function(){
			if(isMute) {
				$(".voice").get(0).className = "iconfont icon-yinliang voice";
				isMute = false;
				player.muted = false;
				height = parseInt(storage.getItem("height")); 
				changeVoice(height);
				$(".volumeChange").css("top",100-height);
			}else {
				$(".voice").get(0).className = "iconfont icon-volumemute2 voice";
				height = 0;
				isMute = true;
				player.muted = true;
				changeVoice(height);
				$(".volumeChange").css("top",100-height);
			}
		})
		
		height = parseInt(storage.getItem("height"));  
		
		if(height) {
			changeVoice(height);
			$(".volumeChange").css("top",100-height);
		}
		
		
		//改变声音大小的函数
		function changeVoice(height) {
			$(".percent").text(height+"%");
			player.volume = height/100;
			$(".colorVolume").css("height",parseInt(height)+6);
		}
		
		//声音拖拽条
		$(".volumeChange").draggable({
			containment:"parent",
			axis:"y",
			drag:function(){
				$(".percent").show();
				height = 100-parseInt($(".volumeChange").css("top"));
				changeVoice(height);
				if(height == 0) {
					$(".voice").get(0).className = "iconfont icon-volumemute2 voice";
				}else {
					$(".voice").get(0).className = "iconfont icon-yinliang voice";
				}
			},
			stop:function() {
				//当结束的时候，吧此时的音量存到localstory中
				height = Math.min(100,height)
				storage.setItem("height",height);
				console.log("拖拽结束");
				$(".percent").hide();
			}
		});
		
		$(".volumeChange").on("mousemove",function(){
			$(".percent").show();
		});
		
		$(".volumeChange").on("mouseleave",function(){
			$(".percent").hide();
		});
		
		
	})
})
