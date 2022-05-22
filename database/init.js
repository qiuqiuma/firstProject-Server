const mongoose = require('mongoose');
var uuid = require('uuid');
mongoose.connect("mongodb://root:admin_mima@8.130.99.124:27017/yibin_db?authMechanism=DEFAULT&authSource=admin")
    .then(() => console.log("数据库连接成功"))
    .catch(() => console.log("数据库连接失败"));
let headurl = "http://8.130.99.124:8889/HeadImg/"
// 普通用户信息表
const commonSchema = new mongoose.Schema({
    userName: String,
    passWord: String,
    nickName: String,
    headImg: String
})
// 商品信息表
const goodsSchema = new mongoose.Schema({
    goodsId: String,
    goodsName: String,
    price: String,
    goodsImg: String,
    color: Array,
    parameter: Array,
    number:Number,
    orderTime:String,
    orderNumber:String,
})
// 购物车
const cartSchema = new mongoose.Schema({
    username:String,
    goodsId: String,
    parameter: String,
    color: String,
    number:Number,
})
// 地址
const adressSchema = new mongoose.Schema({
    adressId:String,
    username:String,
    name:String,
    phone:String,
    adress: String,
    zipCode:String,
    province:String,
    city:String,
    county:String,
    detailedAdress:String
})
// 订单
const orderSchema = new mongoose.Schema({
    username:String,
    goodsId: String,
    parameter: String,
    orderTime:String,
    orderNumber:String,
    color: String,
    number:Number,
})
const commonUser = mongoose.model('commonUser', commonSchema);
const goodsMsg = mongoose.model('goodsMsg', goodsSchema);
const  cart = mongoose.model(' cart', cartSchema);
const  adress = mongoose.model(' adress', adressSchema);
const  order = mongoose.model(' order', orderSchema);
module.exports = {
    commonUser,
    goodsMsg,
    cart,
    adress,
    order
}