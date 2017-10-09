
//加载gulp
var gulp = require("gulp");

var babel = require("gulp-babel"); //编译ES6

var sass = require("gulp-ruby-sass"); //编译scss

var uglify = require("gulp-uglify"); //压缩JS

const webserver = require("gulp-webserver");

const proxy = require("http-proxy-middleware");
//反向代理
gulp.task("webserver",function(){
	gulp.src('./')
		.pipe(
			webserver({
				host : "localhost",
				port : 8000,
				livereload : true,
				directoryListing : {
					enable : true,
					path : './'
				},
				//跨域AJAX反向代理地址
				middleware : [
					proxy("/api", {//不增加全部走代理
						target : "https://item.m.jd.com",
						changeOrigin : true,
						pathRewrite : {
							"^/api" : ""
						}
					}),
					proxy("/interface", {//不增加全部走代理
						target : "http://datainfo.duapp.com",
						changeOrigin : true,
						pathRewrite : {
							"^/interface" : ""
						}
					})
				]
			})
		)
})


gulp.task("js", function(){
	gulp.src("./js/*.js")
		.pipe( babel({
			presets : ["es2015"]
		}) )
		.pipe( uglify() )
		.pipe( gulp.dest("./minjs/") );
})

gulp.task("compilesass", function(){
	sass("./scss/*.scss", {
		style : "expanded"
	}).pipe( gulp.dest("./css/") );
})
//设置默认执行的任务
gulp.task("default",["listening","webserver"],function(){
	console.log("done.");
});

gulp.task("listening", function(){
	gulp.watch("./scss/*.scss", ["compilesass"]);
	gulp.watch("./js/*.js", ["js"]);
})


