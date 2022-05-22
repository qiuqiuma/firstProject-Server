const express = require('express');
const Admin = express.Router();
Admin.post("/",(req,res)=>{
    console.log(req.body)
    res.send("ok")
})
module.exports = Admin;