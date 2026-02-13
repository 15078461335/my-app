// data_20240820_9.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 9, // 唯一标识符
    title: "逆迹的聊天记录", // 微信分享标题
    description: "逆迹:兔牛猪羊\n逆迹:04-46-18\n聊天记录", // 微信分享描述
    link: `/`, // 使用全局域名
    imgUrl: `${baseUrl}/images/share-thumb.jpg`, // 使用全局域名
    messageDate: "21:19", // 消息日期
    sequence: 9, // 序号，表示当天的第几条消息
    records: [
        {
            user: "逆迹",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "兔牛猪羊号各十  04-46-18各十  04-18各十",
            time: "20:18"
        },
        {
            user: "逆迹",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "04 11 29 12 24 08 13 35 09 10 22 06 26 36#1米 01 07 19 45 40#3米 02 30 34 16#5米 18 46#20米 新澳共89",
            time: "20:23"
        },
        {
            user: "逆迹",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "33-43各15米02一150米共 180",
            time: "20:24"
        },
        {
            user: "逆迹",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "龙猪狗蛇牛个号三十12/36/13/49各三十，34.各30米，30.14.26各300米，猪羊肖10米，14.21.13.39.38.30.26.18.33～各20",
            time: "20:27"
        },
        {
            user: "逆迹",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "羊各号20 , 34---20斤 , 澳，共100",
            time: "20:29"
        },
        {
            user: "逆迹",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "兔各号10 米，02.38各20 共 80",
            time: "20:29"
        },

        
    ]
};

module.exports = shareConfig;
