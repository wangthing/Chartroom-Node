const fs = require('fs')

const http = require('http')
const path = require('path')
const mime = require('mime')
//缓存文件内容
let cache = {};

// 1.发送文件数据及错误响应
function send404 (res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("Error 404 not found");
    res.end;
}

function sendFile(res, filePath, fileContents) {
    res.writeHead(
        200,
        {"Content-Type": mime.lookup(path.basename(filePath))}
    );
    res.end(fileContents);
}

function serverStatic (res, cache, absPath) {
    if(cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        //判断文件是否存在
        fs.exists(absPath, function (exits) {
            if(exits) {
                fs.readFile (absPath, function (err, data) {
                    if(err) {
                        send404(res);
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                })
                //不存在  发送404
            } else {
                send404(res);
            }

        })
    }
}


var server = http.createServer(function (req, res) {
    var filePath = false;
    console.log(req.url);
    if(req.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }

    var absPath = './' + filePath

    serverStatic(res, cache, absPath);  
})

server.listen(3000, function () {
    console.log("your server is running on http://localhost:3000");
})