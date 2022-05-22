
async function pro(req) {
    let str = ''
    return new Promise((resolve, reject) => {
        req.on('data', buffer => {
            str += buffer;	//创建一个数组，把每次传递过来的数据保存
        });
        req.on('end', () => {
            //console.log(str)
            resolve(JSON.parse(str));
        });
    })
}
async function parameter(req) {
    let result;
    req.on('data', buffer => {
        str += buffer;	//创建一个数组，把每次传递过来的数据保存
    });
    req.on('end', () => {
        //console.log(str)
        // resolve(JSON.parse(str));
    });
    // console.log(req)
    // await pro(req)
    //     .then(val => {

    //         result = val
    //     })
    return 1;
}
module.exports = {
    parameter,
}