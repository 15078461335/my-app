// data_20240820_2.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 2, // 唯一标识符
    title: "遥遥和阴天的逼的聊天记录", // 微信分享标题
    description: "遥遥:14.38.43各号10斤\n遥遥:18.33.44各号20斤\n聊天记录", // 微信分享描述
    link: `/`, // 使用全局域名

    imgUrl: `${baseUrl}/images/share-thumb.jpg`, // 使用全局域名
    messageDate: "18:19", // 消息日期
    sequence: 2, // 序号，表示当天的第几条消息
    records: [
        {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "14.38.43各号10斤",
            time: "18:19"
        },
        {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "18.33.44各号20斤",
            time: "18:23"
        },
        {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "06.12.16.20.23.26.30.33.35.36.38.45各十元",
            time: "18:24"
        },
        {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "20.44.04.10.32.22.30.42.03.27.39.各20米，05.17.29.41.19.43.15.46.各10米，",
            time: "18:27"
        },
        {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "47   36   48各20 ,23   35   12各20,03.07.12.13.15.16.23 26.27.28.35.36.37.38.43各10 , 03   15   39各10",
            time: "18:29"
        },
        {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "特码09.21.33.45各20",
            time: "18:39"
        },   
            {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "11.12.各号40, 23.24.各号20,马羊狗各号10,兔虎各号5,共计280",
            time: "18:40"
        },    
            {
            user: "遥遥",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "02.38.04.40.30.42.34各数30, 35.45.05各数40; 14.28.18.15.各数20",
            time: "18:42"
        }
        
   
        
    ]
};

module.exports = shareConfig;
