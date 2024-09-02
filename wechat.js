// wechat.js

const crypto = require('crypto');
const jsSHA = require('jssha');

// 微信服务器验证签名的逻辑
function validateSignature(token, queryObject) {
    const { signature, timestamp, nonce } = queryObject;
    const hash = crypto.createHash('sha1');
    const arr = [token, timestamp, nonce].sort();
    hash.update(arr.join(''));
    const sha1 = hash.digest('hex');
    return sha1 === signature;
}

// JSSDK签名生成的逻辑
function generateSignature(jsapi_ticket, url) {

    const nonceStr = 'randomString'; // 生成随机字符串
    const timestamp = Math.floor(Date.now() / 1000);
    // 解码 URL 确保使用原始 URL 进行签名
    const decodedUrl = decodeURIComponent(url);
    // 打印所有关键变量
    console.log('jsapi_ticket:', jsapi_ticket);
    console.log('nonceStr:', nonceStr);
    console.log('timestamp:', timestamp);
    console.log('decodedUrl:', decodedUrl);
    const string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    const shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(string1);
    return {
        timestamp,
        nonceStr,
        signature: shaObj.getHash('HEX')
    };
}

module.exports = {
    validateSignature,
    generateSignature
};
