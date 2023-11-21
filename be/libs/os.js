const os = require('os');

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

    info['ipAddresses']=ipAddresses;

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

module.exports = { getOSInfo };
