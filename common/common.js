const express = require('express');
console.log("进入common")
const { commonUser, cart, goodsMsg, adress, order } = require('../database/init.js');
const {
    findData,
    addMsg,
    register,
    findMsg,
    carMsg,
    addCart,
    deleteData,
    make_token,
    verify_token,
    updateData,
    changeHead
} = require("../funcModule/databaseFunc")
const { parameter} = require("../funcModule/moduleFunc")
const url = require('url')
var uuid = require('uuid');
const formidable = require('formidable')
const multer = require('multer');
const fs = require("fs")
const path = require("path");

const Common = express.Router();
let resMsg;//验证码
let res_format = {
    resMsg: "",
    data: {}
}
let condition;
// 进行token验证
Common.use((req, res, next) => {

    if (typeof req.headers.authorization != "undefined" && req.url == "/index") {
        let res_verify = verify_token(req.headers.authorization.split(' ')[1]);
        // console.log("进入了token检查")
        if (res_verify.single != 'ok') {
            let msg = {
                single: "error",
                data: "身份过期，请重新登录"
            }
            res.send(msg)
        } else {
            condition = { userName: res_verify.key }
            findMsg(commonUser, condition)
                .then(e => {
                    res_format.resMsg = "success"
                    e[0].passWord = undefined
                    res_format.data = e[0];
                   // console.log(res_format.data)
                    res.send(res_format);
                })
        }
    } else {
        next();
    }
})
// 登录
Common.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    condition = { 'userName': username }
    findMsg(commonUser, condition)
        .then(e => {
            if (e != null) {
                e = e[0];
                // console.log(e)
                if (e.passWord == password) {
                    res_format.resMsg = "success"
                    let token_str = make_token(username, 300);
                    res_format.token = "Bearer " + token_str;
                    e.passWord = undefined
                    res_format.data = e;
                } else {
                    res_format.resMsg = "pwd_error"
                }
            } else {
                res_format.resMsg = "user_notFound"
            }
            res.send(res_format);
        })
});
// 验证码
Common.post("/yanz", (req, res) => {
   // console.log("进入验证码")
    let haoM = +new Date()
    haoM = haoM.toString()
    resMsg = haoM.substring(haoM.length - 5)
    res.send(resMsg)
})
// 手机号登录
Common.post("/phoneLogin", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    condition = { 'userName': username }
    findMsg(commonUser, condition)
        .then(val => {
            if (val != null) {
                val = val[0];
                if (password == resMsg) {
                    res_format.resMsg = "success"
                    let token_str = make_token(username, 300);
                    res_format.token = "Bearer " + token_str;
                    val.passWord = undefined
                    res_format.data = val;
                } else {
                    res_format.resMsg = "pwd_error"
                }
            } else {
                res_format.resMsg = "user_notFound"
            }
            res.send(res_format);
        })


})
// 注册
Common.post("/regist", (req, res) => {
    register(commonUser, req.body.username, req.body.password, req.body.nickName)
        .then(val => {
            res.send(val)
        })
})
// 展示购物车信息
Common.get("/disCart", (req, res) => {
    let username = req.query.username;
    console.log("收到的用户名：",username)
    condition = { 'username': username }
    findMsg(cart, condition)
        .then(val => {
            if (val != null) {
                carMsg(goodsMsg, val)
                    .then(p => {
                        res_format.resMsg = "success";
                        res_format.data = p
                        res.send(res_format)
                    })
            } else {
                res_format.resMsg = "notFound";
                res.send(res_format)
            }

        })
})
// 加入购物车
Common.get("/addCart", (req, res) => {
    addCart(cart, req.query)
        .then(() => console.log("加入购物车成功"))
})
// 删除购物车信息
Common.get("/deleteCart", (req, res) => {
    deleteData(cart, req.query).then(()=>res.send("ok"))
})
// 展示订单信息
Common.get("/disOrder", (req, res) => {
    condition = { 'username': req.query.username };
    findMsg(order, condition)
        .then(val => {
            if (val != null) {
                carMsg(goodsMsg, val)
                    .then(p => {
                        res_format.resMsg = "success";
                        res_format.data = p
                        res.send(res_format)
                    })
            } else {
                res_format.resMsg = "notFound";
                res_format.data = null
                res.send(res_format)
            }

        })

})
// 添加订单信息
Common.get("/addOrder", (req, res) => {
    let val = {
        username: req.query.username,
        goodsId: req.query.goodsId,
        parameter: req.query.parameter,
        orderTime: req.query.orderTime,
        orderNumber: req.query.orderNumber,
        color: req.query.color,
        number:req.query.number,
    }
    addMsg(order, val)
    .then(()=>res.send('ok'))
})
// 展示地址信息
Common.get("/disAdress", (req, res) => {
    condition = { 'username': req.query.username }
    findMsg(adress, condition)
        .then(val => {
            if (val != null) {
                res_format.resMsg = "success",
                    res_format.data = val
            } else {
                res_format.resMsg = "notFound",
                    res_format.data = null
            }
            res.send(res_format)
        })
})
// 添加地址信息
Common.get("/addAdress", (req, res) => {
    let msg = req.query;
    let msgObj = {
        adressId: uuid.v1(),
        username: msg.username,
        name: msg.name,
        phone: msg.phone,
        adress: msg.adress,
        detailedAdress: msg.detailedAdress,
        zipCode: msg.zipCode,
        province: msg.province,
        city: msg.city,
        county: msg.county
    }
    addMsg(adress, msgObj)
        .then(flag => res.send(flag))
        .catch(err => res.send(err))

})
// 删除地址信息
Common.get("/deleteAdress", (req, res) => {
    condition = { adressId: req.query.adressId };
    deleteData(adress, condition).then(() => res.send("ok"))
})
// 更新地址信息
Common.get("/upAdress", (req, res) => {
    condition = { adressId: req.query.adressId };
    //console.log(req.query)
    let val = {
        name: req.query.name,
        phone: req.query.phone,
        adress: req.query.adress,
        zipCode: req.query.zipCode,
        province: req.query.province,
        city: req.query.city,
        county: req.query.county,
        detailedAdress: req.query.detailedAdress,
    }
    updateData(adress, condition, val)
        .then(() => res.send("ok"))
})
// 更换头像
const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb) {
        cb(null, '/www/wwwroot/yibinServer/HeadImg/')
    },
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split('.')[1])
        // cb(null, Date.now() + file.originalname)
    }
})
let upload = multer({ storage })
Common.post("/upHead", upload.single('file'), (req, res) => {
    condition = { userName: req.body.username }
    findMsg(commonUser, condition)
        .then(val => {
            console.log(val)
            val = val[0];
            let oldName = val.headImg.split("HeadImg/")
            let oldPath = "/www/wwwroot/yibinServer/HeadImg/" + oldName[1];
            console.log("删除的路径：",oldPath)
            if (oldName != "defult.png")
                fs.unlink(oldPath, (err) => {
                    if (err) console.log(err)
                });
            let a = {
                headImg: oldName[0]+'HeadImg/'+req.file.filename
            }
            resMsg = a.headImg
            updateData(commonUser, condition, a)
            .then(()=>{
                res.send(resMsg)
            })
        })
})
// 更新昵称
Common.get("/nickname", (req, res) => {
   // console.log("跟新昵称：", req.query.nickname)
    condition = { 'userName': req.query.username };
    let val = {
        nickName: req.query.nickname
    }
    updateData(commonUser, condition, val)
        .then(() => res.send("ok"))
})

module.exports = Common;