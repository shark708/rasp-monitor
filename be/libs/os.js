const os = require('os');

function getStartuptime() {
    const uptimeSeconds = os.uptime();

    const days = Math.floor(uptimeSeconds / (24 * 3600));
    const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const remainingSeconds = Math.floor(uptimeSeconds % 60);

    return `${days}天${hours}小时${minutes}分${remainingSeconds}秒`;
}

function getOSInfo() {
    const info = {};
    const interfaces = os.networkInterfaces();
    const ipAddresses = [];

    for (const key in interfaces) {
        interfaces[key].forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddresses.push(iface.address);
            }
        });
    }

    info['ipAddresses'] = ipAddresses;

    try {
        const platform = os.platform();
        const release = os.release();
        const hostname = os.hostname();

        info['platform'] = platform;
        info['release'] = release;
        info['hostname'] = hostname;
    } catch (error) {
        console.error('获取系统版本信息时出错:', error);
    }

    return info;
};

module.exports = { getOSInfo, getStartuptime };
