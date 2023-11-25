const si = require('systeminformation');

async function getSystemInfo() {
  var info = {};
  try {
    const cpuInfo = await si.cpu();
    const memInfo = await si.mem();
    const diskInfo = await si.fsSize();
    const temperature = await si.cpuTemperature();

    await si.processes()
      .then(data => {
        info['processes'] = data.list
      })
      .catch(error => {
        console.error('获取进程信息时出错:', error);
      });

    info['cpuInfo'] = cpuInfo;
    info['memInfo'] = memInfo;
    info['diskInfo'] = diskInfo;
    info['temperature'] = temperature;

  } catch (error) {
    console.error('获取系统信息时出错:', error);
  }
  return info;
};

module.exports = { getSystemInfo };