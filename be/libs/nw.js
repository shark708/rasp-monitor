const wifi = require('node-wifi');
const internetAvailable = require("internet-available");

async function getWifiInfo() {
  wifi.init();

  // 将 getCurrentConnections 封装成 Promise
  const getCurrentConnectionsAsync = () => {
    return new Promise((resolve, reject) => {
      wifi.getCurrentConnections((error, currentConnections) => {
        if (error) {
          reject(error);
        } else {
          resolve(currentConnections);
        }
      });
    });
  };

  try {
    const currentConnections = await getCurrentConnectionsAsync();
    if (currentConnections.length === 0) {
      console.log('当前没有连接到任何 WiFi 网络。');
    } else {
      console.log('当前连接的 WiFi 信息:', currentConnections);
      return {
        wifi: currentConnections
      };
    }
  } catch (error) {
    console.error('获取 WiFi 信息时出错:', error);
    // 在实际应用中你可能想要进行一些错误处理
    return {
      wifi: []
    };
  }
};


async function getNetworkInfo() {
  var info = {};

  await internetAvailable({
    port: 53,
    host: '114.114.114.114'
  }).then(() => {
    info['netAvailable'] = true;
  }).catch((e) => {
    info['netAvailable'] = false;
  });

  return info;
};


module.exports = { getNetworkInfo, getWifiInfo };