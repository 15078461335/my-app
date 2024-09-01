// data_20240820_1.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 1, // 唯一标识符
    title: "大痘痘的聊天记录", // 微信分享标题
    description: "43.20.21.17.18.10.15.11/各15米31.29.33.06.05.03.07.32.22.25.12.24各5米", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/zhandianIcon.jpg`, // 使用全局域名
    messageDate: "2024-08-20", // 消息日期
    sequence: 1, // 序号，表示当天的第几条消息
    records: [
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "43.20.21.17.18.10.15.11/各15米31.29.33.06.05.03.07.32.22.25.12.24各5米",
            time: "2024年9月1日 12:35"
        },
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "40 35各二十米，23 02 34 29 04 05 09 20 22 25 28 47 42 44 45 49 11 16各十米",
            time: "2024年9月1日 12:36"
        },
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "19.31.34.各80米,01.13.21.43.各20米,03.09.15.25.32.33.39.44.45.49.各30米",
            time: "2024年9月1日 12:37"
        },
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "11-23-35-47-12-24-36-48-04-16-28-40各30斤,11-23-35-47-12-36-48各50斤。47-48各100斤。澳",
            time: "2024年9月1日 12:38"
        },
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "04,11,12,16,23,24,28,35,36,40,47,48各50#。11,12,23,24,35,36,47,48各30#。11,23,24,36,35.各100#。,47,48各50#。",
            time: "2024年9月1日 12:39"
        },
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "09.21.01.13.37.49.10.22.34.46.02.14.26.38.03.15.27.04.16.28.40各10米",
            time: "2024年9月1日 12:40"
        },
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "08 12 16 22 28 32 36 46 48复试三中三各组5",
            time: "2024年9月1日 12:41"
        },
        {
            user: "大痘痘",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "01.02.03.04.05.06.07.08.09 各十斤",
            time: "2024年9月1日 12:42"
        }
    ]
};

module.exports = shareConfig;
