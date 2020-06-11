var fs = require("fs");
var sep = require("path").sep;
var xlsx = require("node-xlsx");
var uuid = require("node-uuid");

/**
 * 递归打印文件目录、文件名
 */
 // 10万条一个批次
let splitExcelNum = 100000
let data = [];
// 10W 条新增一个Excel
let listNum = 0;
// 第几个EXCEL的表示
let conut = 0;
// excel 标注
let excelNameNum = 0;
let excelTitle = [
    "FILE_ID",
    "APPID",
    "USERID",
    "CREATE_DATE",
    "CREATE_BY",
    "UPDATE_DATE",
    "UPDATE_BY",
    "SOURCE",
    "ISTRANSFERED",
    "FILE_NAME",
    "FILE_PATH",
];
var readDir = function(path) {
    var exists = fs.existsSync(path),
        stat = fs.statSync(path);
    let dirpath = "";
    if (exists && stat) {
        //判断文件、文件目录是否存在
        if (stat.isFile()) {
            let item = [];
            var fpath = path.split(sep);
            // 截取名称
            fpath.splice(0, 2);
            // 特殊处理~~MAC有一个特殊文件夹要过滤
            if (fpath[fpath.length - 1] !== ".DS_Store") {
                item = [
                    "WION-" + uuid.v1(),
                    "WION_order_" + excelNameNum,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ];
                item.push(fpath[fpath.length - 1]);
                item.push("/" + fpath.join("/"));
                data.push(item);
                conut++;
                listNum++;
                if (listNum === splitExcelNum) {
                    data.unshift(excelTitle);
                    let buf = xlsx.build([{ data: data }]);
                    // 将 buffer 写入到 my.xlsx 中（导出）
                    fs.writeFileSync("imageData" + excelNameNum + ".xlsx", buf);
                    console.log("第" + excelNameNum + "个Excel生成：" + new Date())
                    excelNameNum++;
                    listNum = 0;
                    data = [];
                }
            }
        } else if (stat.isDirectory()) {
            var fpath = path.split(sep);
            var files = fs.readdirSync(path);
            if (files && files.length > 0) {
                files.forEach(function(file) {
                    readDir(path + sep + file); //递归文件夹
                });
            }
        }
    } else {
        console.info("根目录不存在.");
    }
};
console.log(new Date())
readDir("./images")
// console.log(data)
if (data.length !== 0) {
    data.unshift(excelTitle);
    let buf = xlsx.build([{ data: data }]);
    // 将 buffer 写入到 my.xlsx 中（导出）
    fs.writeFileSync("imageData" + excelNameNum + ".xlsx", buf);
    console.log("第" + excelNameNum + "个Excel生成：" + new Date())
    excelNameNum++;
    listNum = 0;
    data = [];
}
console.log(new Date())