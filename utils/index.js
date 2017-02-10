/**
 * Created by gopain on 15/11/27.
 */
var crypto = require('crypto');

//MD5签名
exports.md5 = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

//加密
exports.encrypt = function (str , secret) {
    var cipher = crypto.createCipher('aes192' , secret);
    var enc    = cipher.update(str , 'utf8' , 'hex');
    enc += cipher.final('hex');
    return enc;
};

//解密
exports.decrypt = function (str , secret) {
    var decipher = crypto.createDecipher('aes192' , secret);
    var dec      = decipher.update(str , 'hex' , 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

/**
 * 对对象排序
 * @param para 排序前的对象
 * return 排序后的对象
 */
exports.argSort = function (para) {
    var result = new Object();
    var keys   = Object.keys(para).sort();
    for (var i = 0; i < keys.length; i++) {
        var k     = keys[i];
        result[k] = para[k];
    }
    return result;
}

/** 检查字符串是否以subStr开头 **/
String.prototype.startWith = function (subStr) {
    if (subStr.length > this.length) {
        return false;
    }
    else {
        return (this.indexOf(subStr) == 0);
    }
};

/** 检查字符串是否以subStr结尾 **/
String.prototype.endWith = function (subStr) {
    if (subStr.length > this.length) {
        return false;
    }
    else {
        return (this.lastIndexOf(subStr) == (this.length - subStr.length));
    }
};

/**
 * 获取随机数
 * @param length
 * @returns {string}
 */
exports.random = function (length) {
    length = isNaN(length) ? 10 : length;
    return Math.random().toString().substr(3 , length);
};

//格式化时间
var formatdate = exports.formatdate = function (date , style) {
    var y = date.getFullYear();
    var M = "0" + (date.getMonth() + 1);
    M     = M.substring(M.length - 2);
    var d = "0" + date.getDate();
    d     = d.substring(d.length - 2);
    var h = "0" + date.getHours();
    h     = h.substring(h.length - 2);
    var m = "0" + date.getMinutes();
    m     = m.substring(m.length - 2);
    var s = "0" + date.getSeconds();
    s     = s.substring(s.length - 2);
    return style.replace('yyyy' , y).replace('MM' , M).replace('dd' , d).replace('hh' , h).replace('mm' , m).replace('ss' , s);
};
//生成全球唯一的guid
var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

var generateGuid = exports.generateGuid = function () {
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}
/*
 从request肿获取用户ip地址
 */
exports.getClientIp      = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};
exports.stringToDateTime = function (postdate) {
    if (postdate) {
        var second  = 1000;
        var minutes = second * 60;
        var hours   = minutes * 60;
        var days    = hours * 24;
        var months  = days * 30;
        var years   = days * 365;
        var myDate  = new Date(Date.parse(postdate));
        if (isNaN(myDate)) {
            myDate = new Date(postdate.replace(/-/g , "/"));
        }
        var nowtime  = new Date();
        var longtime = nowtime.getTime() - myDate.getTime();
        var showtime = 0;
        if (longtime > years) {
            return (Math.floor(longtime / years) + "年前");
        }
        else if (longtime > months * 2) {

            if (myDate.getFullYear() == nowtime.getFullYear()) {
                return formatdate(myDate , 'MM月dd日');
            }
            else {
                return formatdate(myDate , 'yyyy年MM月dd日');
            }

//            return myDate.toDateString().replace(nowtime.getFullYear() + '年', '');
//            return myDate.getMonth() + '月' + myDate.getDate() + '日';
        }
        else if (longtime > months) {
            return "1个月前";
        }
        else if (longtime > days * 7) {
            return ("1周前");
        }
        else if (longtime > days) {
            return (Math.floor(longtime / days) + "天前");
        }
        else if (longtime > hours) {
            return (Math.floor(longtime / hours) + "小时前");
        }
        else if (longtime > minutes * 3) {
            return (Math.floor(longtime / minutes) + "分钟前");
        }
//    else if (longtime > second)
//    {
//        return(Math.floor(longtime/second)+"秒前");
//    }
        else {
        }
    }

    return '刚刚';
};

function formatFloat(src , pos) {
    return Math.round(src * Math.pow(10 , pos)) / Math.pow(10 , pos);
}

exports.meterToString = function (meter) {
    if (meter) {
        var km  = 1000;
        var h   = 100;
        var num = Number(meter);

        if (num > km * 100) {
            return "超过100公里";
        }
        else if (num > km * 10) {
            return (formatFloat(num / km , 0) + "公里");
        }
        else if (num > km) {
            return (formatFloat(num / km , 1) + "公里");
        }
        else if (num > h * 5) {
            return '1公里内';
        }
        else if (num > h * 2) {
            return '500米内';
        }
        else if (num > h) {
            return '200米内';
        }
        else {
            return '100米内';
        }
    }

    return '未知';
};

/**
 * Merge object source with object target.
 *
 *     var target = { foo: 'bar' }
 *       , source = { bar: 'baz' };
 *
 *     utils.merge(target, source);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 * @api private
 */

exports.merge = function (target , source) {
    if (target && source) {
        for (var key in source) {
            target[key] = source[key];
        }
    }
    return target;
};

//判断当前设备是否为移动设备
exports.isMobile   = function (userAgent) {
    if (/Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(userAgent)) {
        return true;
    }
    return false;
};
//判断是否为Iphone
exports.isIPhone   = function (userAgent) {
    if (/iPhone|iPod|iPad/i.test(userAgent)) {
        return true;
    }
    return false;
}
exports.HTMLEncode = function (str) {
    if (str.length == 0)
        return str;
    return str.replace(/&/g , "&amp;")
        .replace(/</g , "&lt;")
        .replace(/>/g , "&gt;")
        .replace(/    /g , "&nbsp;")
        .replace(/\'/g , "&#146;")
        .replace(/\"/g , "&quot;")
        .replace(/\n/g , "<br>");
};

exports.HTMLDecode = function (str) {
    if (str.length == 0)
        return str;
    return str.replace(/&amp;/g , "&")
        .replace(/&lt;/g , "<")
        .replace(/&gt;/g , ">")
        .replace(/&nbsp;/g , "    ")
        .replace(/'/g , "\'")
        .replace(/&quot;/g , "\"")
        .replace(/<br>/g , "\n");
};

// 地球半径
var earthRadius = 6378137.0; // m

// 计算距离在地球表面对应的弧度
// mongoDB中的maxDistance需要使用弧度
exports.getDistance = function (m) {
    return m / earthRadius;
};

/**
 * 求某个经纬度的值的角度值
 * @param {Object} d
 */
function calcDegree(d) {
    return d * Math.PI / 180.0;
}

/**
 * 根据两点经纬度值，获取两地的实际相差的距离
 * @param {Object} f    第一点的坐标位置[latitude,longitude]
 * @param {Object} t    第二点的坐标位置[latitude,longitude]
 */
exports.calcDistance = function (f , t) {
    if (f && t) {
        return getFlatternDistance(f[1] , f[0] , t[1] , t[0]);
    }
    else {
        return undefined;
    }
};
/**
 * approx distance between two points on earth ellipsoid CHECK
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getFlatternDistance(lat1 , lng1 , lat2 , lng2) {
    var f = calcDegree((lat1 + lat2) / 2);
    var g = calcDegree((lat1 - lat2) / 2);
    var l = calcDegree((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s , c , w , r , d , h1 , h2;
    var a  = earthRadius;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w  = Math.atan(Math.sqrt(s / c));
    r  = Math.sqrt(s * c) / w;
    d  = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

/**
 * 检查是否是手机号
 * @param v 待检查的号码
 * @returns {boolean}
 */
exports.checkPhoneNumber = function (v) {
    //var r = /(1(([35][0-9])|(47)|[8][0-9]))\d{8}/;
    var r = /(1([3578][0-9]))\d{8}/;
    return (r.test(v) && (v.length === 11));
};

exports.checkIDCard = function (v) {
    //身份证正则表达式(15位)
    var isIDCard15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    //身份证正则表达式(18位)
    var isIDCard18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
    //return (isIDCard15.test(v) && v.length === 15) || (isIDCard18.test(v) && v.length === 18);
    return isIdCardNo(v);
};

exports.replaceGtAndLt = function (str , params) {
    if (str) {
        params = [
            {str: '&gt;' , replace_to: '>'} ,
            {
                str: '&lt;' , replace_to: '<'
            } , {
                str: '&amp;' , replace_to: '&'
            } , {
                str: '&apos;' , replace_to: "'"
            } , {
                str: '&quot;' , replace_to: '"'
            }
        ];
        //for (var i in params) {
        //    var regex = '/' + params[i].str + '/g';
        //    str = str.replace(regex, params[i].replace_to);
        //    //str = str.replace(params[i].str, params[i].replace_to);
        //}
        //return str;
        return str.replace(/&amp;/g , "&")
            .replace(/&lt;/g , "<")
            .replace(/&gt;/g , ">")
            .replace(/'/g , "\'")
            .replace(/&quot;/g , "\"");
    } else {
        return null;
    }
};

function isIdCardNo(num) {

    num = num.toUpperCase();

    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        return false;
    }
//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
//下面分别分析出生日期和校验位
    var len , re;
    len = num.length;
    if (len == 15) {
        re           = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);
//检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay     = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        } else {
//将15位身份证转成18位
//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7 , 9 , 10 , 5 , 8 , 4 , 2 , 1 , 6 , 3 , 7 , 9 , 10 , 5 , 8 , 4 , 2);
            var arrCh  = new Array('1' , '0' , 'X' , '9' , '8' , '7' , '6' , '5' , '4' , '3' , '2');
            var nTemp  = 0 , i;
            num        = num.substr(0 , 6) + '19' + num.substr(6 , num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i , 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return num;
        }
    }
    if (len == 18) {
        re           = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);
//检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay     = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        } else {
//检验18位身份证的校验码是否正确。
//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7 , 9 , 10 , 5 , 8 , 4 , 2 , 1 , 6 , 3 , 7 , 9 , 10 , 5 , 8 , 4 , 2);
            var arrCh  = new Array('1' , '0' , 'X' , '9' , '8' , '7' , '6' , '5' , '4' , '3' , '2');
            var nTemp  = 0 , i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i , 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17 , 1)) {
                return false;
            }
            return num;
        }
    }
    return false;
}

/**
 * 生成订单号,9位数,到2050年增加到10位数
 * @param moment
 * @returns {string}
 */
exports.createOrderNo = function (moment) {
    if (!moment) {
        moment = require('moment');
    }
    var year    = (moment().format('YY') * 1 - 15);
    var seconds = moment().format('DDD') * 24 * 60 * 60 + moment().format('HH') * 60 * 60 + moment().format('mm') * 60 + moment().format('ss') * 1;

    var order  = seconds.toString(36);
    order      = seconds_format(order , 5);
    var ran    = ((Math.random() + '').substr(4 , 3) + moment().format('SSS'));
    var random = (ran * 1).toString(36);
    random     = seconds_format(random , 4);
    order      = year.toString(36) + order;
    order += random;
    return order.toUpperCase();
};

exports.createTransactionNo = function (moment) {
    if (!moment) {
        moment = require('moment');
    }
    var date = moment().format('YYYYMMDDHHmmss');
    var sss  = moment().format('SSS');
    sss      = seconds_format(sss , 3);
    var r1   = (Math.random() + '').substr(4 , 3);
    var r2   = (Math.random() + '').substr(4 , 3);
    var r3   = (Math.random() + '').substr(4 , 3);
    var r4   = (Math.random() + '').substr(4 , 3);
    return date + sss + r1 + r2 + r3 + r4;
};

function seconds_format(str , length) {
    if (str.length >= length)
        return str;
    else {
        for (; str.length < length;)
            str = '0' + str;
        return str;
    }
};

exports.seconds_format = function (str , length) {

};

/**
 * 获取医院中文排班
 * @param time
 */

exports.getAmPm = function (time) {
    var obj = {
        '1': "夜班1" ,  // "00:00~08:00"
        '2': "上午" ,   // "08:00~12:00"
        '3': "中午" ,   // "12:00~13:30"
        '4': "下午" ,   // "13:30~16:30"
        '5': "夜诊" ,   // "16:30~19:00"
        '6': "夜班"    // "16:30~23:59"
    };
    return obj[time] || "";
};