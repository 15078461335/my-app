// data_20240820_2.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 2, // 唯一标识符
    title: "小钢炮的聊天记录", // 微信分享标题
    description: "小钢炮:02.26.24各5米\n小钢炮:12.36.48各5米\n聊天记录", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/zhandianIcon.jpg`, // 使用全局域名
    messageDate: "17:11", // 消息日期
    sequence: 2, // 序号，表示当天的第几条消息
    records: [
        {
            user: "小钢炮",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "02.26.24各5米 12.36.48各5米 14.38各25米，五连俏蛇狗鸡猴兔.....兔虎狗鸡蛇.....蛇鸡猴狗虎各10米",
            time: "19:05"
        },
        {
            user: "小钢炮",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "01-04-05-09-10-11-14-15-19-24-25-26-45-47-49各 5 米 39.40各20 米31.34.41各10米",
            time: "19:08"
        },
        {
            user: "小钢炮",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "38-02各号三十，，鼠猪号各5，虎龙牛蛇狗号各10，28-40-47-各5，34  45 各300#  36 48 40 42 31各 50#，04-16-28-40-10-22-34-46各10斤",
            time: "19:11"
        },
        {
            user: "小钢炮",
            avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
            numbers: "32.33.45.42.46.49.13.37.12.36.48.24.09.31.43.05各10井。三中三，03.29.11下20井，15.16.32。08.27.34。22.40.44。各组15井，21七十斤，45二50米",
            time: "19:18"
        },

        
    ]
};

module.exports = shareConfig;
