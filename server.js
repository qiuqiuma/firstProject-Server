
const express = require('express');
const Admin = require("./admin/admin");
const Common = require("./common/common");
const { commonUser, goodsMsg} = require("./database/init")
const {findData} = require("./funcModule/databaseFunc")
const fs = require('fs')
const url = require('url')
const path = require('path')
var bodyParser  =  require("body-parser");  
let contentType = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
   }

    let app = express();
    app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));  
app.all("*", function(req, res, next) {
    if (!req.get("Origin")) return next();
     // use "*" here to accept any origin
     res.set("Access-Control-Allow-Origin",req.headers.origin);  
        //  这里除了req.headers.origin外还可以是:"http://localhost:3000"
     res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
     res.set("Access-Control-Allow-Headers", "Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization");
     res.header('Access-Control-Allow-Credentials', 'true');
     // res.set('Access-Control-Allow-Max-Age', 3600);
     if ("OPTIONS" === req.method) return res.sendStatus(200);
     next();
});


// 访问头像
// app.use("/HeadImg",(req,res)=>{
// //设置请求的返回头type,content的type类型列表见上面
// res.setHeader("Content-Type", contentType);
//     let dir = __dirname+'/HeadImg'+req.url
//     fs.readFile(dir,'binary',(err,data)=>{
//         //格式必须为 binary 否则会出错
//         res.writeHead(200, "Ok");
//         res.write(data,"binary"); //格式必须为 binary，否则会出错
//         res.end();
//     })
// })
// 访问商品信息
    app.use("/goodsmsg",(req,res)=>{
     let condition = req.query;
     findData(goodsMsg,condition)
        .then(val=>{
                res.send(val) 
        })
        })
// app.use("/GoodsImg",(req,res)=>{
//     //设置请求的返回头type,content的type类型列表见上面
//     let dir = __dirname+'/GoodsImg'+req.url
//     fs.readFile(dir,'binary',(err,data)=>{
//     res.setHeader("Content-Type", contentType);
//     console.log("访问商品图片完成")
//     res.writeHead(200, "Ok");
//     res.write(data,"binary"); //格式必须为 binary，否则会出错
//     res.end();
//   });
//     })
app.use('/common',Common);
app.use('/admin',Admin);

const listener = app.listen(8889)

