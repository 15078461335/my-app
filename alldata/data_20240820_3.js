// data_20240820_3.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 3, // 唯一标识符
    title: "浪人", // 微信分享标题
    description: "浪人:02.26.24各5米\n浪人:12.36.48各5米\n聊天记录", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/20240905_1.jpg`, // 使用全局域名
    messageDate: "21:19", // 消息日期
    sequence: 3, // 序号，表示当天的第几条消息
    records: [
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "02.26.24各5米 12.36.48各5米",
            time: "20:19"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "13.15.26.04.35.09.26.37.34.39.47.45.03.07.09.21各号200",
            time: "20:22"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "38.26.24.28.23.43.47.42.32.27.19.25.09.29.03.34.32.39.28.25.17.46.10.13各号150",
            time: "20:24"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "05.39.48.07.26.34.27.16.33.45.43.15.18.42.31.03.09.22.26.18.11.17.36.39.42.14各号100",
            time: "20:27"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "33.25.47.36.18.24.06.39.18.43.48.02.31.10.09.16.30.1504.46.22各300",
            time: "20:29"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "41.36.04.38.20.39.12.16.24.29.17.23.40.21.01.18.44.42.35.45.18各330",
            time: "20:34"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "22.14.15.32.01.12.40.27.16.29.39.33.35.09.24.18.14.40各号240",
            time: "20:40"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "38.20.39.12.16.24.29.17.12.40.27.16.29.39.33.48.07.26.34.27.16各号75",
            time: "20:43"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "14.15.32.01.12.40.27.16.29.39.33.35.26.18.11.17.36.39.42各号50",
            time: "20:49"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "38.26.24.28.23.43.47.42.32.27.19.25.09.29.03.34.32.39.28.25.17.46.10.13各号90",
            time: "20:55"
        },
        {
            user: "浪人",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "05.39.48.07.26.34.27.16.33.45.43.15.18.42.31.03.09.22.26.18.11.17.36.39.42.14各号65",
            time: "20:59"
        },
    ]
};

module.exports = shareConfig;
