/**
 * Created by Txm on 2017/7/20.
 */
let path = require("path");
let qiniu = require("qiniu");

let upload = function (filePath, key) {
    let { accesskey, secretkey, bucket, cdn } = upload.config;

    // 上传到七牛上面的文件名
    key = key || `img/${path.basename(filePath)}`;

    // 设置上传策略
    let putPolicy = new qiniu.rs.PutPolicy({
        scope: bucket + ":" + key,

        // 指定对应的响应体
        // returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    });

    // 根据密钥创建鉴权对象mac，获取上传token
    let mac = new qiniu.auth.digest.Mac(accesskey, secretkey);
    let uploadToken= putPolicy.uploadToken(mac);

    // 配置对象
    let config = new qiniu.conf.Config();
    // 上传机房，z2是华南
    config.zone = qiniu.zone.Zone_z2;

    // 扩展参数，主要是用于文件分片上传使用的，这里可以忽略
    let putExtra = new qiniu.form_up.PutExtra();

    // 实例化上传对象
    let formUploader = new qiniu.form_up.FormUploader(config);

    return new Promise((resolve, reject)=>{
        formUploader.putFile(uploadToken, key, filePath, putExtra, function(respErr, respBody, respInfo) {
            if (respErr) { reject(respErr) }

            if (respInfo.statusCode === 200) {
                // 拼接服务器路径
                let filename = cdn + key;
                resolve(filename);
            }
        });
    })
};


module.exports = upload;

