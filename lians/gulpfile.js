/*
 * @Author: 赵鹏鹏 
 * @Date: 2018-10-15 14:00:09 
 * @Last Modified by: 赵鹏鹏
 * @Last Modified time: 2018-10-16 15:45:15
 */
var gulp = require("gulp");
var web = require("gulp-webserver");
var sass = require("gulp-sass");

var fs = require("fs");
var url = require("url");
var path = require("path");
var query = require("querystring");

var data = require("./src/moke/list.json"); //数据
var len = data.length;
// 起服务
gulp.task("web", function() {
        return gulp.src("src")
            .pipe(web({
                port: 8080,
                middleware: function(req, res, next) {
                    if (req.url == "/favicon.ico") {
                        return res.end();
                    }
                    var pathname = url.parse(req.url, true).pathname;
                    if (pathname == "/api/add") {
                        res.end(JSON.stringify({ code: 0, data: data }))
                    } else if (pathname == "/api/list") {
                        var arr = [];
                        req.on("data", function(chunk) {
                            arr.push(chunk);
                        })
                        req.on("end", function() {
                            var urls = query.parse(Buffer.concat(arr).toString());
                            data.unshift(urls);
                            fs.writeFileSync(path.join(__dirname, "src", "./moke/list.json"), JSON.stringify(data))
                            res.end(JSON.stringify({ code: 1, data: "成功" }));
                        })
                    } else {
                        pathname = pathname == "/" ? "index.html" : pathname;
                        res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                    }
                }
            }))
    })
    // sass
gulp.task("csstask", function() {
        return gulp.src("./src/scss/*.scss")
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest("./src/css/"))
    })
    // 监听
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("csstask"));
})
gulp.task("dev", gulp.series("csstask", "web", "watch"));