/**
 * Created by wxq on 17-2-10.
 */
var fs = require("fs");
var unzip = require("unzip");
var csv = require('node-csv').createParser();
var iconv  = require('iconv-lite');
// var Buffer = require('Buffer');


  //unzip 解压
fs.createReadStream('./zip/20885215304321060156_20170120.csv.zip')
    .pipe(unzip.Extract({ path: 'unzip' }));



/**
 * 读取 csv 中的内容
 */
/*
var fileStr = fs.readFileSync('./unzip/20885215304321060156_20170120_ҵ����ϸ(����).csv', {encoding:'binary'});
var buf = new Buffer(fileStr, 'binary');
var str = iconv.decode(buf, 'GBK');
console.log(str);*/
