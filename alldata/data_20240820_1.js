// data_20240820_1.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 1, // 唯一标识符
    title: "心灵鸡汤", // 微信分享标题
    description: "同的信念，决定不同的命运，别人能做到的事情，我也能做到。", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/zhandianIcon.jpg`, // 使用全局域名
    messageDate: "2024-08-20", // 消息日期
    sequence: 1, // 序号，表示当天的第几条消息
    records: [
        {
            user: "今天天气晴",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "不同的信念，决定不同的命运",
            time: "2024年8月5日 20:35"
        },
        {
            user: "你是好人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "别人能做到的事情，我也能做到。",
            time: "2024年8月6日 21:19"
        }
    ]
};

module.exports = shareConfig;
