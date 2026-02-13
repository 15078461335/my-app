// data_20240820_13.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 13, // 唯一标识符
    title: "逆袭的聊天记录", // 微信分享标题
    description: "逆袭:07.09.33.37\n逆袭:10.30.40.08\n聊天记录", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/avatar1.jpg`, // 使用全局域名
    messageDate: "21:19", // 消息日期
    sequence: 13, // 序号，表示当天的第几条消息
    records: [
        {
            user: "逆袭",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "07.09.33.37.03各15元。10.30.40.08.各5元‘。共 95",
            time: "19:40"
        },
        {
            user: "逆袭",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "21 六十 ，29  35  42  18  19  42  43  49  27  20  13  09    33  45  各十共 200",
            time: "19:42"
        },
        {
            user: "逆袭",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "澳18--30--09--45各十 06--42--21--33各五共 60",
            time: "19:47"
        },
        {
            user: "逆袭",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "29，42，24，34，40，35各2米共 12",
            time: "19:49"
        },
        {
            user: "逆袭",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "34 47 37 38 各5块 35 45 各10块 41 42 43 44 49  各20快 46 48 各50块 共 240",
            time: "19:51"
        },
        {
            user: "逆袭",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "26-210 米 0 头各号 110 共 1200",
            time: "19:54"
        },


        
    ]
};

module.exports = shareConfig;
