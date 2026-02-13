// data_20240820_11.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 11, // 唯一标识符
    title: "逆鳞的聊天记录", // 微信分享标题
    description: "逆鳞:1.25.29.37\n逆鳞:3.15.23.35\n聊天记录", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/avatar1.jpg`, // 使用全局域名
    messageDate: "21:19", // 消息日期
    sequence: 11, // 序号，表示当天的第几条消息
    records: [
        {
            user: "逆鳞",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "1.25.29.37各十米  3.15.23.35.8.20.32.7.31.9.2.4.34.28.各五米",
            time: "20:08"
        },
        {
            user: "逆鳞",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "13，37，18，30，19，31，06各五米",
            time: "20:13"
        },
        {
            user: "逆鳞",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "37-25-05-10-22-03-15-23-04-16-11-30-18各五米",
            time: "20:20"
        },
        {
            user: "逆鳞",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "08 20 02 26 24 04 29 09各五米",
            time: "20:27"
        },
        {
            user: "逆鳞",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "03-15-27-39-06-18-30-42-02-14-26-38各10斤。03-30-42-14各300斤。澳03-15-27-39-30-42-02-14-26-38各25斤。",
            time: "20:28"
        },
        {
            user: "逆鳞",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "49二十14十块",
            time: "20:29"
        },
        {
            user: "逆鳞",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "04.16.28.40.各10米",
            time: "20:34"
        },

        
    ]
};

module.exports = shareConfig;
