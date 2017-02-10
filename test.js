/**
 * Project:api-server
 * FileName:test.js
 * Date:2016/12/31(20:10)
 * User:gopain
 * Description:....
 */

var NodeRSA = require('node-rsa');
var request = require("request");
var utils   = require('./utils');
var crypto  = require('crypto');
var fs      = require('fs');
var unzip   = require("unzip");
var iconv  = require('iconv-lite');
// var key     = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----' +
//     'MIICWwIBAAKBgQCqwtUyn87Rmh0xu5919fdI6PqNYTTseDD+WW1tH/yJe0/0UWX9' +
//     'UXkIHTjYnOxeWjO+0AOC7KCqiOT/9rc9kohf7LGVWEaCue2ZDl05YaMLadJYdwsz' +
//     'UBjxbvUYIp/DE4Q8cZaMjtoiExs06Z3d/Lvp2RBTjh/zoLObRuJBsRgtiQIDAQAB' +
//     'AoGADgnulTbmPf05oTkXpw8NwYTF9JGlVDuda4vWnz4d+P+WVzPJ+sWT+cLNRaHB' +
//     'HRC1aF6Zq03g96RBj3mtHvbJF1duJSnMEM+7CpWmMQvIdWCJe/U5hKkP+CGcEb2R' +
//     'vPUq5pjNl/h1Ms/XH3A3FSCXyVEd4A+2IZCPpsjZ+kDjnDECQQDWxgJkD1iVsDiY' +
//     'kp3VNMMmGSWQwpZ8YMbGGlGApXhEEFBjp9OYQVyHBVYp6Phs2/YnonJQ5gbji3Mn' +
//     'X/FpxCVzAkEAy4oMlwgZC+uLYQn0+B5nxBAHcGGcIl75vcAzExVZfxFL2syqnKWK' +
//     'M56NP33obZ8+VzFjKMladgUHOF6gWCeCEwJAJxOX08THBVUutvPWK7iR2RiyMQh2' +
//     'gOLKx7h6I8H3g8rEFZ2vbgBWaWqbJrzwlj3fJ47y5a00i6oPpZZbQjch6QJANDte' +
//     '87seQlLV17coaCvVURkT76D84k0hJbKW6MTHzLXxk1qGReCtUIXVlX+ID+mXo+SG' +
//     'n8bcMgEkUzDlUPoChQJAbWoBWf5CAcCH+4prsgx10NiKqsQKY7eK/JfPpYNeTOUr' +
//     '/+3b3Hrw1D723AQb035DdhwKf+krYMPd2qNyJOdSGQ==' +
//     '-----END RSA PRIVATE KEY-----');
// var key = new NodeRSA(fs.readFileSync('../libs/alipay/key/founder_rsa_private_key.pem'));

// var text      = 'Hello RSA!88888';
//fVrov1zz8ERT41CYd5A1QxUDT8dTtcHNpEKYy7vH2DLqPJBRnA4JhFWV80G2EqwiONq2kM09LskxrHCZ/JUX4WYQ6FX+HVQBWJ/PIihFOfHsH9tyxFf8FT9nH8BNCniBTWADDp9r6ibEWM2L873fUnDpcUmYxd5uNf5H8c7xHGY=
//fVrov1zz8ERT41CYd5A1QxUDT8dTtcHNpEKYy7vH2DLqPJBRnA4JhFWV80G2EqwiONq2kM09LskxrHCZ/JUX4WYQ6FX+HVQBWJ/PIihFOfHsH9tyxFf8FT9nH8BNCniBTWADDp9r6ibEWM2L873fUnDpcUmYxd5uNf5H8c7xHGY=
//j5ZSMyHtoNR/BxexbXtOzZi6gTknZ279gAoEww2q2cvIOXBEUGPFxdiDPGyBFkbw1r6EspJ97I5+WAJvmztBSr0EwPxqdAi17R06UtZBiiPXEMnlZOUiwjzCSfJPpx0CduZ8ZmtPTgRz58bJvQOcHllXRHScmSfatBYKqmBIzpA=
// var encrypted = key.encrypt(text , 'base64');
// console.log('encrypted: ' , encrypted.length , encrypted);

var form_data = {
    app_id     : '2016123004733128' ,
    biz_content: '{"bill_type":"trade","bill_date":"2017-01-20"}' ,
    charset    : 'UTF-8' ,
    method     : 'alipay.data.dataservice.bill.downloadurl.query' ,
    sign_type  : 'RSA' ,
    timestamp  : '2017-01-22 15:26:33' ,
    version    : '1.0'
};

var sort_data   = utils.argSort(form_data);
var querystring = Object.keys(sort_data).sort().map(function (key) {
    return key + '=' + sort_data[key];
}).join("&");
console.log(querystring);
// form_data.sign  = key.sign(querystring , 'base64');
// console.log('form_data.sign' , form_data.sign);
var verify = crypto.createSign('RSA-SHA1');
verify.update(querystring , 'utf-8');
form_data.sign = verify.sign(fs.readFileSync('./libs/alipay/key/rsa_private_key_jilin.pem') , 'base64');
// console.log('form_data.sign' , form_data.sign);
// console.log(form_data);


var options = {
    method : 'POST' ,
    url    : 'https://openapi.alipay.com/gateway.do' ,
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    } ,
    form   : form_data
};

request(options , function (error , response , body) {
    if (error) throw new Error(error);
    var b = JSON.parse(body);
    // console.log(b);
    var url_path = b.alipay_data_dataservice_bill_downloadurl_query_response.bill_download_url;
    var url_path_array = url_path.split('&');
    console.log('zip 下载路径：%s',url_path);
    var downloadFileName = '';
    url_path_array.map(function(val){
        downloadFileName = val.split('=');
        if(downloadFileName[0] === 'downloadFileName'){
            console.log('downloadFileName:' + downloadFileName[1]);
            //读网络文件并写本地
            var d = request(url_path)
                .pipe(fs.createWriteStream('./zip/' + downloadFileName[1],{
                    flags: 'w',
                    mode : 0777  //设置文件权限
                }));
            if(d.autoClose){
                console.log('下载成功');
                //unzip 解压
                var inteval = setInterval(
                    function(){
                        if(fs.existssync('./zip/' + downloadFileName[1])){
                            fs.createReadStream('./zip/' + downloadFileName[1])
                                .pipe(unzip.Extract({ path: 'unzip' }));
                        }
                    },500
                );



                /**
                 * 读取 csv 中的内容
                 */
                 /*var fileStr = fs.readFileSync('./unzip/20885215304321060156_20170120_ҵ����ϸ(����).csv', {encoding:'binary'});
                 var buf = new Buffer(fileStr, 'binary');
                 var str = iconv.decode(buf, 'GBK');
                 console.log(str);*/
            }
        }

    });
});













// var decrypted = key.decryptPublic(encrypted , 'utf8');
// console.log('decrypted: ' , decrypted);

// var easemob = require('../libs/easemob/easemob');

// easemob.getToken(function (token) {
// console.log(token);
// });
/*
 {
 "action" : "post",
 "application" : "74d7df50-8f57-11e6-9c24-ed1cf9789ebc",
 "uri" : "http://a1.easemob.com/uthealth/jilin-zsyy/chatgroups",
 "entities" : [ ],
 "data" : {
 "groupid" : "5572913070082"
 },
 "timestamp" : 1484713144744,
 "duration" : 0,
 "organization" : "uthealth",
 "applicationName" : "jilin-zsyy"
 }
 */
// easemob.createGroup({
//     groupname: '测试群组' ,
//     desc     : '测试一下啦' ,
//     public   : true ,
//     maxusers : 2000 ,
//     approval : false ,
//     owner    : '18612233895' ,
//     callback:function (result) {
//         console.log(result);
//     }
// });

//
// function createPromiseCallback() {
//     var cb;
//     var promise = new Promise(function (resolve , reject) {
//         cb = function (err , data) {
//             if (err) return reject(err);
//             console.log(err,data);
//             return resolve(data);
//         };
//     });
//     cb.promise  = promise;
//     return cb;
// }
//
// for (var i = 0; i < 100; i++) {
//     func(i , createPromiseCallback());
// }
//
// function func(i , fn) {
//     return fn(null , i);
// }

// var utils = require('../utils');
// for (var i = 0; i < 10; i++)
//     console.log(utils.createOrderNo() , utils.createTransactionNo());
// var async = require('async');
// var arr   = [{name: 'Jack' , delay: 200} ,
//     {name: 'Mike' , delay: 100} ,
//     {name: 'Freewind' , delay: 300}];
// var data = '';
// async.map(arr , function (item , callback) {
//     console.log('1.1 enter: ' + item.name);
//     console.log('1.1 handle: ' + item.name);
//     callback(null , item);
// } , function (err , data) {
//     console.log('1.1 err: ' + err);
//     console.log('1.1 data: ' + JSON.stringify(data));
// });

// var request = require("request");
//
// var options = {
//     method : 'POST' ,
//     url    : 'https://49.141.23.23:9107/system/refund' ,
//     headers: {
//         'cache-control': 'no-cache' ,
//         'content-type' : 'application/x-www-form-urlencoded'
//     } ,
//     rejectUnauthorized: false,
//     form   : {
//         order_no  : '2020OXNR9I41' ,
//         type      : '0' ,
//         refund_fee: '3' ,
//         total_fee : '3' ,
//         patient_id: '龚平'
//     }
// };
//
// request(options , function (error , response , body) {
//     if (error) throw new Error(error);
//
//     console.log(body);
// });

// ObjectId("56c56dd4ca446fab71e4c38a").getTimestamp();

// var dao    = require('../daos');
// var doctor = require('../models').getModel('fd_doctor');

// dao.save(doctor , {
//     name             : 'test' ,//姓名
//     nickname         : 'test' ,//String ,//昵称
//     phone            : 'test' ,// String ,//手机号,用于重置密码
//     password         : 'test' ,//String ,//密码
//     avatar           : 'test' ,//String ,//头像
//     code             : 'test' ,//String ,//编号
//     organization     : 'test' ,//String ,//机构名称
//     organization_code: 'test' ,//String ,//机构编码或者id
//     department       : 'test' ,//String ,//科室名称
//     department_code  : 'test' ,//String ,//科室编码或者id
//     token            : 'test' ,//String ,//
//     summary          : 'test' ,//String ,//简介
//     title            : 'test' ,//String ,//职称
//     major            : 'test' ,//String ,//专业
// } , function (err , data) {
//     console.log(err , data);
// });
//586a1d546fa5344f90d0a4d7
//
// dao.fd_findByOps(doctor,{},function (err,datas) {
//     console.log(datas);
// },'name nickname');

// dao.findOneByOps(doctor,{},function (err,datas) {
//     console.log(datas);
// },'name nickname');

// var WXPay  = require('../libs/wechat/weixin-pay/');
// var fs     = require('fs');
// var path   = require('path');
// var config = require('../config') , settings = config.setting;
// var utils  = require('../utils');
// var wxpay  = WXPay({
//     appid      : settings.appid ,
//     mch_id     : settings.weixin_mch_id ,
//     partner_key: settings.weixin_partner_key , //微信商户平台API密钥
//     pfx        : fs.readFileSync(path.join(__dirname , '../controllers/trade/' + settings.weixin_pfx)) //微信商户平台证书
// });

// wxpay.refund({
//     transaction_id: '4008012001201701126044695168' ,
//     total_fee     : 1 ,
//     refund_fee    : 1 ,
//     op_user_id    : settings.weixin_mch_id ,
//     out_refund_no : utils.createOrderNo()
// } , function (err , data) {
//     console.log(err , data);
// });

/**
 { return_code: 'SUCCESS',
  return_msg: 'OK',
  appid: 'wxaf67330ccf5ac7a3',
  mch_id: '1413033602',
  nonce_str: 'ThiAr4ckzJbXWfe1',
  sign: '5F3E7D16872079A183217B6AB310481A',
  result_code: 'SUCCESS',
  prepay_id: 'wx20170110114121b7b7b210ee0629536690',
  trade_type: 'APP' }

 20JU8C2G68
 null { return_code: 'SUCCESS',
  return_msg: 'OK',
  appid: 'wxaf67330ccf5ac7a3',
  mch_id: '1413033602',
  nonce_str: 'cZXuEC4TfjMKrwDH',
  sign: '7D665CCED12B1A852AAB79CFD6A8DF4A',
  result_code: 'SUCCESS',
  prepay_id: 'wx2017011017072493731a6e030939315697',
  trade_type: 'APP' }
 */
// var order_no = utils.createOrderNo();
// console.log(order_no);
// var nonce_str = wxpay.Util.generateNonceString(10);
// wxpay.createUnifiedOrder({
//     body            : '测试一下哇' ,
//     out_trade_no    : order_no ,
//     total_fee       : Math.ceil(0.22 * 100) ,
//     spbill_create_ip: settings.weixin_spbill_create_ip ,
//     notify_url      : settings.weixin_notify_url ,
//     trade_type      : 'APP' ,
//     nonce_str       : nonce_str
//     // timestamp       : new Date().getTime()
// } , function (err , order) {
//     console.log(err , order);
//     order.timestamp = Math.floor(Date.now() / 1000) + '';
//     var sign_data   = {
//         appid    : settings.appid ,
//         partnerid: settings.weixin_mch_id ,
//         prepayid : order.prepay_id ,
//         noncestr : order.nonce_str ,
//         timestamp: order.timestamp ,
//         package  : 'Sign=WXPay'
//     };
//     console.log(sign_data);
//     utils.argSort(sign_data);
//     console.log(sign_data);
//     var sign = wxpay.sign(sign_data);
//
//     console.log(sign);
// });

/*
 null { return_code: 'SUCCESS',
 return_msg: 'OK',
 appid: 'wxaf67330ccf5ac7a3',
 mch_id: '1413033602',
 nonce_str: 'TzyqokgiU4GwGWaY',
 sign: '5D408C2A29D685DCD946649B2DF5E628',
 result_code: 'SUCCESS',
 out_trade_no: '20JU8C2G68',
 trade_state: 'NOTPAY',
 trade_state_desc: '订单未支付' }
 */
// wxpay.queryOrder({
//     out_trade_no: '20JU8C2G68-' ,
// } , function (err , data) {
//     console.log(err , data);
// });

// var request = require("request");
//
// var options = {
//     method : 'POST' ,
//     url    : 'https://openapi.alipay.com/gateway.do' ,
//     headers: {
//         'postman-token': 'a13d6ff7-fc88-01ab-46f9-4b6e274865d6' ,
//         'cache-control': 'no-cache' ,
//         'content-type' : 'application/x-www-form-urlencoded'
//     } ,
//     form   : {
//         out_trade_no: '2020JOF3GPZS' ,
//         app_id      : '2016123004733128' ,
//         method      : 'alipay.trade.query' ,
//         charset     : 'utf-8' ,
//         sign_type   : 'RSA' ,
//         version     : '1.0' ,
//         biz_content : 'biz_content' ,
//         timestamp   : '2017-01-10 17:48:55' ,
//         sign        : ''
//     }
// };
//
// request(options , function (error , response , body) {
//     if (error) throw new Error(error);
//
//     console.log(body);
// });
/*
 var data = {
 appId    : 'appId' ,//settings.appid ,
 partnerId: 'partnerId' ,//settings.weixin_mch_id ,
 prepayId : 'prepayId' ,
 nonceStr : 'nonceStr' ,
 timeStamp: 'timeStamp' ,
 package  : 'Sign=WXPay'
 };
 console.log(data);
 utils.argSort(data);
 console.log(data);
 var sign = wxpay.sign(data);

 console.log(sign);
 */