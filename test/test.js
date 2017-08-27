/**
 * Created by admin on 2017/8/27.
 */

let plugin = require('../index');
let config = require('../config/qiniu.json');

let { upload, parse } = plugin;
// 配置七牛参数
upload.config = config;

// 解析
parse({
    filename: './test.md',
    upload: upload,
    output: 'dist'
});
