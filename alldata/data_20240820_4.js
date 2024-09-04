// data_20240820_3.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 4, // 唯一标识符
    title: "心灵鸡汤", // 微信分享标题
    description: "人生没有白走的路，你现在所有的努力，要么赚经历，要么赚阅历，要么赚财富", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/zhandianIcon.jpg`, // 使用全局域名
    messageDate: "2024-08-20", // 消息日期
    sequence: 4, // 序号，表示当天的第几条消息
    records: [
        {
            user: "心灵鸡汤",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "有些事，想多了头疼，想通了心疼。所以，想不开就别想，得不到就别要，干嘛要委屈自己。放下包袱，忘却一切烦恼，开心度过每一天",
            time: "2024年8月5日 20:35"
        },
        {
            user: "心灵鸡汤",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "你改变不了已经发生的，所以不要浪费时间想那么多了，前进，放手，忘了它，过后想想其实也就那么回事。",
            time: "2024年8月6日 21:19"
        }
    ]
};

module.exports = shareConfig;
