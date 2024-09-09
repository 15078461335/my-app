// data_20240820_12.js

const { baseUrl } = require('../config');

const shareConfig = {
    id: 12, // 唯一标识符
    title: "逆天的聊天记录", // 微信分享标题
    description: "逆天:二中二复式\n逆天:32.48.18.2\n聊天记录", // 微信分享描述
    link: `${baseUrl}/path/to/page`, // 使用全局域名
    imgUrl: `${baseUrl}/images/zhandianIcon.jpg`, // 使用全局域名
    messageDate: "21:19", // 消息日期
    sequence: 12, // 序号，表示当天的第几条消息
    records: [
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "二中二复式32.48.18.22.30.09.05共二十一组各组3米",
            time: "20:08"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "二中二49/36各10 ,三中三23/46/07 ,30/17/40 各5，",
            time: "20:11"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "平特二连肖，马鸡100",
            time: "20:14"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "三中三，31-24-06，24-06-13，06-13-31，13-31-24。每组5斤",
            time: "20:17"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "40.38.18.48三中三复试各组5",
            time: "20:18"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "26 02 16 36 37 44 18 09 复试三中三各组10",
            time: "20:19"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "虎兔龙猪马羊个号五。马猴羊猪鼠虎各号五 ，04.10.15.17.25.27.48各十米",
            time: "20:22"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "12.09.21.10.34.32.18.30.05.29.41.31.43.各25#",
            time: "20:24"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "新08.各35 ,20.32.36.48.10.46.02.26.13.25.27各15，门：37.09.17.28.各300狗猪各数10,08.20.49.36.37.32.33.19各5,鸡鼠猴各数5，蛇鸡个号五十",
            time: "20:26"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "龙猴兔。各号码五米马牛猪。各号码十米，252期03.02.25.12.21.18.27.13.09.06.26.15.01～各15",
            time: "20:34"
        },
        {
            user: "逆天",
            avatar: "/images/20240905_1.jpg", // 本地图片路径
            numbers: "狗鸡蛇个号三十，19/20/24各一百，20.各20米。22.32.28.16.34.17.29各5米，鸡鼠肖10米，",
            time: "20:35"
        },

        
    ]
};

module.exports = shareConfig;
