var oC = document.getElementById("canvas");
var oGc = oC.getContext("2d");

function drawClock() {
	oGc.clearRect(0,0,610,610)
	var now = new Date();
	var second = now.getSeconds();
	var minute = now.getMinutes();
	var hour1 = now.getHours();
	var hour = hour1 + minute/60;
	hour = hour>12?hour-12:hour;
	var time = now.toLocaleString();
	console.log(second,minute,hour,time);
	
	oGc.font = "20px 微软雅黑 ";
	oGc.fillStyle = "#F1A899";
	oGc.fillText(time,200,180)
	//画一个表的外轮廓
	oGc.beginPath();
	oGc.strokeStyle = "pink";
	oGc.lineWidth = 10;
	oGc.arc(305,305,300,0,2*Math.PI,true);
	oGc.stroke();
	oGc.closePath();
	
	//画表的刻度
	for(var i=0;i<60;i++) {
		oGc.save();
		oGc.lineWidth = 6;
		oGc.strokeStyle = "#35B1D6";
		
		oGc.translate(305,305);
		oGc.rotate(i*6*Math.PI/180);
		oGc.beginPath();
		oGc.moveTo(0,-296);
		oGc.lineTo(0,-280);
		if(i%5==0) {
			oGc.strokeStyle = "red";
			oGc.lineWidth = 10;
			oGc.lineTo(0,-275)
		}
		oGc.closePath();
		oGc.stroke();
		oGc.restore()
	}
	
	//表盘中心：
	oGc.save();
	oGc.beginPath();
	oGc.fillStyle = "red"
	oGc.arc(305,305,10,0,2*Math.PI,false);
	oGc.fill()
	oGc.restore()
	
	//时针
	oGc.save();
	oGc.beginPath();
	oGc.strokeStyle = "#ccc";
	oGc.lineWidth = 9;
	oGc.translate(305,305)
	oGc.rotate(hour*30*Math.PI/180);
	oGc.moveTo(0,-120);
	oGc.lineTo(0,10);
	oGc.stroke()
	oGc.restore();
	
	//分针
	oGc.save();
	oGc.beginPath();
	oGc.strokeStyle = "#ccc";
	oGc.lineWidth = 6;
	oGc.translate(305,305);
	oGc.rotate(minute*Math.PI/180*6);
	oGc.moveTo(0,-160);
	oGc.lineTo(0,14);
	oGc.stroke();
	oGc.restore();
	
	//秒针
	oGc.save();
	oGc.beginPath();
	oGc.strokeStyle = "red";
	oGc.lineWidth = 4;
	oGc.translate(305,305);
	oGc.rotate(second*Math.PI/180*6);
	oGc.moveTo(0,-200);
	oGc.lineTo(0,20);
	oGc.stroke()
	oGc.restore();
}
setInterval(drawClock,1000)