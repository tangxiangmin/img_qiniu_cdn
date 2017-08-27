/**
 * Created by admin on 2017/8/27.
 * 提取markdown文档中的图片路径
 * 并将其上传到七牛上
 */
let fs = require('fs-extra');
let path = require('path');

let parse = function (opts = {}) {
    let { filename, upload, output } = opts;

    // 文件目录
    let dir = path.dirname(filename),
        basename = path.basename(filename);

    // 判断是否为url
    function isURL(file) {
        let re = /^https?:]/;
        return re.test(file);
    }

    // 将当前文件路径作为key
    function setKey(filename, dir) {
        let absDir = path.resolve(dir);
        return filename.replace(absDir, '').replace(/^\\/g, '').replace(/\\/g, '/');
    }

    // todo 这里暂时没有解决直接在第一次匹配的时候异步上传文件并直接替换匹配url的方法
    function replacePath(data, img, url) {
        let re = new RegExp(img);
        return data.replace(re, url);
    }

    fs.readFile(filename, 'utf-8', function (err, data) {
        let re = /\!\[.*?\]\((.*?)\)/g;

        let result = null;
        let tasks = [];

        let imgs = [];
        while (result = re.exec(data)){
            let img = result[1];
            if (isURL(img)){
                continue;
            }
            imgs.push(img);
            let absPath = path.resolve(dir, img);
            let key = setKey(absPath, dir);
            // 获取返回的图片路径
            tasks.push(upload(absPath, key));
        }

        Promise.all(tasks).then(urls=>{
            urls.forEach((url, index)=>{
                let img = imgs[index];
                data = replacePath(data, img, url);
            });
            return data;
        }).then(data=>{
            fs.writeFile(`${output}/${basename}`, data, 'utf-8', function (err) {
                if (err) {
                    throw  err;
                }
                console.log("done....");
            })
        }).catch(function (err) {
            throw err;
        })
    })
};

module.exports = parse;