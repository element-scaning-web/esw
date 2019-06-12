var express = require("express");
var app = express();
var port = 8080

//端口修改后需修改iframe.html 下 elementPage src
//app.use(express.static("web")).listen(8080);
app.use(express.static("web"));
app.listen(port, ()=>{
    console.log("---------服务启动成功-----------");
})