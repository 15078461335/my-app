// data_20240820_3.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 3, // 唯一标识符
    title: "33333332忘词和大兜兜的聊天记录", // 微信分享标题
    description: "2222三中三：0698989, 三中三：35-29-30...", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/zhandianIcon.jpg`, // 使用全局域名
    messageDate: "2024-08-20", // 消息日期
    sequence: 3, // 序号，表示当天的第几条消息
    records: [
        {
            user: "你23333322是好人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "222219期 新澳三中三 16-19-30 03-22-33...",
            time: "2024年8月5日 20:35"
        },
        {
            user: "22222你是好人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "02222226-34-28 35-29-30 16-22-27 19-46-40...",
            time: "2024年8月6日 21:19"
        }
    ]
};

module.exports = shareConfig;
