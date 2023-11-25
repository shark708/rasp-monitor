<template>
  <div class="header">
    <a-row :gutter="[16, 16]" style="padding: 20px;">
      <a-col :span="2">
        <div style="display: flex; align-items: center;">
          <a-space>
            <a-image :width="20" src="logo.png" />
            <h3 style="margin-bottom: 0;">树莓派监控面板</h3>
          </a-space>
        </div>
      </a-col>
      <a-col :span="5">
        <a-space>内存使用率：
          <a-tooltip>
            <template #title>{{ Math.round(systemInfo.memInfo.used / 1024 / 1024 / 1024, 2) }}
              GB/{{ Math.round(systemInfo.memInfo.total / 1024 / 1024 / 1024, 2) }} GB</template>
            <a-progress :steps="10" :percent="memUsageRatio" :strokeColor="getStatusColorFromRatio(memUsageRatio)"
              status="active" />
          </a-tooltip>
        </a-space>
      </a-col>
      <a-col :span="5">
        <a-space>SWAP使用率：
          <a-tooltip>
            <template #title>{{ Math.round(systemInfo.memInfo.swapused / 1024 / 1024 / 1024, 2) }}
              GB/{{ Math.round(systemInfo.memInfo.swaptotal / 1024 / 1024 / 1024, 2) }} GB</template>
            <a-progress :steps="10" :percent="swapUsageRatio" :strokeColor="getStatusColorFromRatio(swapUsageRatio)"
              status="active" />
          </a-tooltip>
        </a-space>
      </a-col>
      <a-col :span="4">
        <a-space>CPU温度：<a-tag :color="getStatusColorFromTemperature(systemInfo.temperature.main || 0)">{{
          systemInfo.temperature.main || '--' }}</a-tag></a-space>
      </a-col>
      <a-col :span="4">
        <a-space>WIFI: <a-tag color="green" v-if="wifiInfo.wifi">{{ wifiInfo.wifi[0].ssid || '--' }}</a-tag>
        </a-space>
      </a-col>
      <a-col :span="4">
        <a-space>网络: <a-tag color="green" v-if="networkInfo.netAvailable">联网</a-tag> <a-tag color="red"
            v-if="!networkInfo.netAvailable">未联网</a-tag>
        </a-space>
      </a-col>
    </a-row>
  </div>

  <div class="content">
    <a-row :gutter="[16, 16]">
      <a-col :span="6">
        <div style="padding: 10px">
          <a-card title="主机信息" :bordered="false" style="text-align: left;">
            <p>启动时长: {{ startupTime }}</p>
            <p>IP: {{ osInfo.ipAddresses.join(",") }}</p>
            <p>主机名：{{ osInfo.hostname }}</p>
            <p>系统版本：{{ osInfo.platform }} {{ osInfo.release }}</p>
            <a-divider dashed>CPU</a-divider>
            <p>芯片: {{ systemInfo.cpuInfo.manufacturer }} {{ systemInfo.cpuInfo.brand }}</p>
            <p>核数：{{ systemInfo.cpuInfo.physicalCores }} vCores {{ systemInfo.cpuInfo.speed }} GHz</p>
            <a-divider dashed>内存</a-divider>
            <p>总内存：{{ totalMemGB }} GB</p>
            <p>可用内存：{{ freeMemGB }} GB</p>
            <a-divider dashed>磁盘</a-divider>
            <li v-for="disk in systemInfo.diskInfo" v-bind:key="disk.fs">
              <div>
                <p>{{ disk.type }}:{{ disk.mount }}</p>
                <p>
                  <a-tooltip>
                    <template #title>
                      {{ Math.round(disk.used / 1024 / 1024 / 1024, 2) }} GB/{{ Math.round(disk.size / 1024 / 1024 / 1024,
                        2) }} GB
                    </template>
                    <a-progress :steps="10" :percent="Math.round(disk.used / disk.size * 100, 2)" status="active"
                      :strokeColor="getStatusColorFromRatio(Math.round(disk.used / disk.size * 100, 2))" />
                  </a-tooltip>
                </p>
              </div>
            </li>
          </a-card>
        </div>
      </a-col>
      <a-col :span="18">
        <div style="padding: 10px">
          <a-table :columns="columns" :data-source="systemInfo.processes" :pagination="{ defaultPageSize: 20 }" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

const columns = ref([
  {
    title: '进程名',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  }, {
    title: '进程ID',
    dataIndex: 'pid',
    key: 'pid',
    sorter: (a, b) => a.pid - b.pid,
  }, {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    sorter: (a, b) => a.cpu - b.cpu,
  }, {
    title: '内存',
    dataIndex: 'mem',
    key: 'mem',
    sorter: (a, b) => a.mem - b.mem,
  }, {
    title: '用户',
    dataIndex: 'user',
    key: 'user',
    sorter: (a, b) => a.user.localeCompare(b.user),
  },
]);

const getStatusColorFromRatio = function (ratio) {
  if (ratio < 50) {
    return "green";
  } else if (ratio < 70) {
    return "orange";
  } else {
    return "red";
  }
}

const getStatusColorFromTemperature = function (temperature) {
  if (temperature == 0) {
    return "red"
  }
  else if (temperature < 40) {
    return "green";
  } else {
    return "red";
  }
}

export default {
  name: 'App',
  setup() {
    const intervals = [];
    const startupTime = ref('- 天 - 小时 - 分');

    const osInfo = ref({
      ipAddresses: [],
      hostname: '',
      platform: '',
      release: ''
    });

    const systemInfo = ref({
      cpuInfo: {},
      memInfo: {},
      diskInfo: [],
      temperature: {},
      processes: []
    });

    const networkInfo = ref({
      netAvailable: false
    });

    const wifiInfo = ref({
      wifi: [{ ssid: '' }]
    });

    const fetchStartupTime = async () => {
      try {
        const response = await axios.get('/api/startupTime');
        startupTime.value = response.data['startupTime'];
      } catch (error) {
        console.error('调用API时出错:', error);
      }
    };

    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get('/api/systemInfo');
        systemInfo.value = response.data;
        console.log("系统", systemInfo.value);
      } catch (error) {
        console.error('调用API时出错:', error);
      }
    };

    const fetchNetworkInfo = async () => {
      try {
        const response = await axios.get('/api/networkInfo');
        networkInfo.value = response.data;
        console.log("网络", networkInfo.value);
      } catch (error) {
        console.error('调用API时出错:', error);
      }
    };

    const fetchWifiInfo = async () => {
      try {
        const response = await axios.get('/api/wifiInfo');
        wifiInfo.value = response.data;
        console.log("WIFI", wifiInfo.value);
      } catch (error) {
        console.error('调用API时出错:', error);
      }
    };

    onMounted(async () => {

      try {
        const response = await axios.get('/api/osInfo');
        osInfo.value = response.data;
        console.log("操作系统", osInfo.value);
      } catch (error) {
        console.error('调用API时出错:', error);
      }

      fetchSystemInfo();
      fetchNetworkInfo();
      fetchWifiInfo();
      fetchStartupTime();

      intervals.push(setInterval(fetchSystemInfo, 5000));
      intervals.push(setInterval(fetchNetworkInfo, 10000));
      intervals.push(setInterval(fetchWifiInfo, 5000));
      intervals.push(setInterval(fetchStartupTime, 2000));
    });

    onBeforeUnmount(() => {
      intervals.forEach(clearInterval);
    });

    return { startupTime, osInfo, systemInfo, networkInfo, wifiInfo };
  },
  computed: {
    memUsageRatio() {
      return Math.round(this.systemInfo.memInfo.used / this.systemInfo.memInfo.total * 100, 2);
    },
    swapUsageRatio() {
      return Math.round(this.systemInfo.memInfo.swapused / this.systemInfo.memInfo.swaptotal * 100, 2);
    }, totalMemGB() {
      return Math.round(this.systemInfo.memInfo.total / 1024 / 1024 / 1024, 2);
    }, freeMemGB() {
      return Math.round(this.systemInfo.memInfo.free / 1024 / 1024 / 1024, 2);
    }
  },
  data() {
    return {
      columns,
      getStatusColorFromRatio,
      getStatusColorFromTemperature
    };
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  padding-top: 80px;
  overflow-y: auto;
}
</style>
