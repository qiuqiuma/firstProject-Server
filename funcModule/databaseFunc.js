const jwToken = require('jsonwebtoken')//引入token
const fs = require("fs")
const promisify = require('util').promisify;
let unlink = promisify(fs.unlink);
// token密钥
const secret = "mayongcan";
// 查询商品
async function findData(dbName, condition) {
    let data = {}, goods = [], parts = [];
    if (Object.keys(condition).length != 0) {
        await dbName.find(condition).then(res => data = res)
    } else {
        await dbName.find().then(res => {
            res.forEach((val, index, arr) => {
                if (val.parameter == null) {
                    parts.push(val);
                } else {
                    goods.push(val)
                }

            })
        })
        data.goods = goods;
        data.parts = parts;
    }
    return data;
}
// 查询用户，购物车信息
async function findMsg(dbName, condition) {
    let result = null;
    await dbName.find(condition)
        .then(val => {
            if (val.length != 0) {
                result = val
            }
        })
    return result;
}
// 注册
async function register(daName, username, pwd, nickName) {
    let resData = {};
    await daName.find({ userName: username })
        .then(res => {
            // console.log(res)
            if (res.length != 0) {
                resData.msg = "用户已经存在";
                resData.single = "repeat";
            } else {
                daName.create({
                    nickName: nickName,
                    userName: username,
                    passWord: pwd,
                    headImg: "http://8.130.99.124:8889/HeadImg/defult.png"
                })
                resData.msg = "注册成功";
                resData.single = "success";
            }
        })
    return resData
}
// 整理购物车信息
async function carMsg(dbName, msgArr) {
    let carArr = [], res_msg = {};
    for (let i = 0; i < msgArr.length; i++) {

        let b = await findMsg(dbName, { 'goodsId': msgArr[i].goodsId })
        b = b[0]
        b.number = msgArr[i].number
        b.color = msgArr[i].color;
        b.parameter = msgArr[i].parameter;
        b.orderTime = msgArr[i].orderTime;
        b.orderNumber = msgArr[i].orderNumber;
        // console.log(b)
        carArr.push(b);
    }
    return carArr;
}
// 加入购物车
async function addCart(dbName, data) {
    dbName.create({
        username: data.username,
        goodsId: data.goodsId,
        parameter: data.parameter,
        color: data.color,
        number: data.number,
    })
}
// 删除信息
async function deleteData(dbName, condition) {
    dbName.deleteOne(condition)
        .then(() => {
            console.log("删除成功")
        })
}
// 添加数据
async function addMsg(dbName, msgObj) {
    let addFlag;
    await dbName.create(msgObj)
        .then(() => addFlag = "success")
        .catch(() => addFlag = "error");
    return addFlag;
}
//生成token
function make_token(msg, time) {                      //密钥   根据的密钥      有效时间
    let tokenstr = jwToken.sign({ key: msg }, secret, { expiresIn: `${time}h` });
    return tokenstr;
}
//验证token
function verify_token(token_str) {
    let res = {};
    jwToken.verify(token_str, secret, (err, data) => {
        if (!err) {
            //token正确，做些事情
            //  console.log(data)
            res.single = "ok"
            res.key = data.key
        } else {
            //token不正确，返回401
            res.single = "failed"
        }
    })
    return res;
}
// 更新
async function updateData(dbName, condition, valObj) {
    dbName.updateMany(condition, { $set: valObj })
        .then(() => console.log("更新成功"))
        .catch(err => console.log(err))

}
// 换头像
async function changeHead(dbName, oldName, oldPath, newPath, username, headImg) {
 
    if (oldName != "defult.png") await unlink(oldPath);
    else {
        oldName = username + ".jpg"
        headImg = headImg.replace("defult.png", oldName);
        updateData(dbName, { userName: username }, { headImg })
        console.log("新头像的路径为",headImg)
    }
    fs.readFile(newPath, (er, val) => {
        if (er) console.log(er)
        else {
            fs.writeFile('./HeadImg/' + oldName, val, (err) => {
                if (err) console.log(err)
            })

        }
    })
}
module.exports = {
    findData,
    register,
    findMsg,
    carMsg,
    addCart,
    deleteData,
    addMsg,
    make_token,
    verify_token,
    updateData,
    changeHead
}