# Rasp-Monitor 树莓派监控器

用于监控树莓派资源，如CPU、内存、进程、GPIO、网络、USB等使用情况。

![image](images/overview.png)

## 安装

### 直接安装


#### 1. 登录树莓派

##### 安装git

```
# CentOS
> sudo yum install git


# Debian
> sudo apt install git

# 验证
> git -v
git version 2.39.2
```

##### 安装nodejs

```
# CentOS
> curl --silent --location https://rpm.nodesource.com/setup_20.x | sudo bash

# Debian
> curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 验证
> node -v
v20.5.1

> npm -v
9.8.0
```

#### 2. 下载项目

```
git clone git@github.com:shark708/rasp-monitor.git
```

#### 3. 启动

```
# 默认启动后是80端口，也可以指定其他端口
> ./startup.sh 80
```

#### 4. 查看

```
> pm2 list

┌────┬─────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name            │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ rasp-monitor    │ default     │ 1.0.0   │ fork    │ 0        │ 0      │ 15   │ online    │ 0%       │ 0b       │ shark    │ enabled  │
└────┴─────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

```

登录页面查看：http://xxx.xxx.xxx.xxx