// data_20240820_4.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 4, // 唯一标识符
    title: "浪荡", // 微信分享标题
    description: "浪荡:02.26.24各5米\n浪荡:12.36.48各5米\n聊天记录", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/zhandianIcon.jpg`, // 使用全局域名
    messageDate: "21:19", // 消息日期
    sequence: 4, // 序号，表示当天的第几条消息
    records: [
        {
            user: "浪荡",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "三中三（01-17-45）（01-19-24）（02-17-26）（02-35-43）（05-06-12）（06-18-46）（06-24-47）（07-21-33）（08-17-30）（11-29-31）（13-32-46）（18-21-37）（20-26-27）（21-38-48）（31-37-45）各五米",
            time: "20:18"
        },
        {
            user: "浪荡",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "复试三中三26.09.37.12.35.42各2复试二中二36.09.37.12.35.42各5",
            time: "20:23"
        },
        {
            user: "浪荡",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "澳三中三每组五块23—26—39 16—17—32 32—23—14 46—23—14 14—23—34 31—44—03 24—19—16 23—11—14 35—37—38 35—17—08 17—08—20 34—37—43",
            time: "20:24"
        },
        {
            user: "浪荡",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "二中二08/33各20三中三24/37/18 41/04/27 33/22/46各组40",
            time: "20:27"
        },
        {
            user: "浪荡",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "新澳三中三复式19-04-20-16各组1012-32-04-16各组10，01-03-47-49各组10，43-44-01-49各组10",
            time: "20:29"
        },
        {
            user: "浪荡",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "新澳三中三复式19-04-20-16各组10 12-32-04-16-01-03-47-49-43-44各组10",
            time: "20:34"
        },
        
    ]
};

module.exports = shareConfig;
