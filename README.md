## markdown图片上传
> 这个插件用于将markdwon文件中的本地图片上传到[七牛CND](https://www.qiniu.com/)

## Config
七牛云配置
```json
{
    "accesskey": "your_accesskey",
    "secretkey": "your_secretkey",
    "bucket": "bucket_name",
    "cdn": "cdn_base_link"
}
```
## Step
使用步骤
```js
// 加载插件和配置参数
let plugin = require('../index');
let config = require('../config/qiniu.json');

// 配置七牛参数
let { upload, parse } = plugin;
upload.config = config;

// 解析
parse({
    filename: './test.md', // 文件名
    upload: upload, // 制定上传函数
    output: 'dist' // 输出目录
});
```

