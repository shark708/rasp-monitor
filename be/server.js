const express = require('express');
const path = require('path');
const cors = require('cors');
const { getOSInfo, getStartuptime } = require('./libs/os.js');
const { getSystemInfo } = require('./libs/si.js');
const { getNetworkInfo, getWifiInfo } = require('./libs/nw.js');
const app = express();
const port = process.env.PORT || 80;


app.get('/api/startupTime', (req, res) => {
  try {
    const startupTime = getStartuptime();
    res.json({
      startupTime
    });
  } catch (error) {
    console.error('获取启动时间时出错:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/osInfo', (req, res) => {
  try {
    const osInfo = getOSInfo();
    res.json(osInfo);
  } catch (error) {
    console.error('获取操作系统信息时出错:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/systemInfo', async (req, res) => {
  try {
    const systemInfo = await getSystemInfo();
    res.json(systemInfo);
  } catch (error) {
    console.error('获取系统信息时出错:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/networkInfo', async (req, res) => {
  try {
    const networkInfo = await getNetworkInfo();
    res.json(networkInfo);
  } catch (error) {
    console.error('获取网络信息时出错:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/wifiInfo', async (req, res) => {
  try {
    const wifiInfo = await getWifiInfo();
    res.json(wifiInfo);
    console.log("wifi", wifiInfo);
  } catch (error) {
    console.error('获取WIFI信息时出错:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
