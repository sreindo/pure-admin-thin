import { Close } from "@iconify-icons/ep/close";
export default class MsWebSocket {
  websocket = null;
  reconnectNumber = 1;
  // 心跳是否正常
  isHeartbeat = false;
  // 判断是否手动关闭，如果手动关闭，则不重连
  isManualLock = false;
  // 心跳定时器
  heartbeatTimer = null;
  // 返回的数据
  callbackData = "";
  // 配置
  options = {
    url: "",
    // 连接事件类型： parking：停车检测框 parkingviolation：违规停车检测 vehicleinfos:车辆计数检测框 vehiclecount：车辆计数表格
    eventType: "",
    // 10秒检测一次
    heartbeatTime: 10000,
    // 无限重连
    loopReconnect: false,
    // 是否重连
    reconnectEnabled: true,
    // 最大重连次数
    maxReconnect: 3,
    // 5秒重连
    reconnectTime: 5000,
    heartbeatEnabled: false,
    heartbeatsendData: "ping",
    heartbeatCallbackData: "pong",
    handlerOpen: data => {},
    handlerMessage: data => {},
    handlerError: () => {},
    handlerClose: () => {}
  };
  constructor(options) {
    this.$getOptins(options);
    this.init();
  }
  $getUrl() {
    let url = window.location.protocol == "https:" ? "wss://" : "ws://";
    // 判断是否是完整路径
    if (this.options.url.indexOf(url) != -1) return this.options.url;
    // 拼接url
    url += `${window.location.host != 80 ? window.location.host : ""}${
      this.options.url
    }`;
    // if (CheckBrowserType().type == "Safari")
    //   url += `?${ASTGUI._getClientDigest(url)}`;
    this.options.url = url;
    return url;
  }
  $getOptins(options) {
    for (const key in this.options) {
      if (options[key]) {
        this.options[key] = options[key];
      }
    }
  }
  // 初始化
  init() {
    if (window.WebSocket) {
      const that = this;
      console.log(this.options);
      const url = that.$getUrl();
      console.log("websocket初始化:", url);
      const websocket = new WebSocket(url);
      websocket.onopen = function (event) {
        console.log("websockte连接开启!");
        that.$open(event);
      };
      websocket.onmessage = data => {
        that.$message(data);
      };
      websocket.onclose = function (e) {
        that.$autoClose(e);
      };
      websocket.onerror = e => {
        that.$error(e);
      };
      that.websocket = websocket;
    } else {
      alert("你的浏览器不支持 WebSocket!");
    }
  }
  // 监听连接是否成功
  $open(data) {
    console.log("连接成功");
    this.$heartbeat();
    if (this.options.handlerOpen) {
      this.options.handlerOpen(data);
    }
  }
  // 接受消息
  $message(data) {
    const dataJson = JSON.parse(data.data);
    if (data.data === this.options.heartbeatCallbackData) {
      this.isHeartbeat = data.data;
    } else {
      if (this.options.handlerMessage) {
        this.options.handlerMessage(dataJson);
      }
    }
  }
  // 发送消息
  send(data) {
    console.log("发送消息:", data);
    if (this.websocket && this.websocket.readyState === 1) {
      this.websocket.send(data);
    } else {
      this.$error();
    }
  }
  // 重连
  $reconnect() {
    console.log("重连次数:", this.reconnectNumber);
    this.options.reconnectEnabled =
      this.reconnectNumber <= this.options.maxReconnect;
    if (this.options.reconnectEnabled || this.options.loopReconnect) {
      this.reconnectNumber++;
      this.init();
    }
  }
  // 连接异常
  $error(e) {
    console.log("连接异常:", e);
    if (this.options.handlerError) {
      this.options.handlerError();
    }
    if (
      !this.isManualLock &&
      (this.options.reconnectEnabled || this.options.loopReconnect)
    ) {
      setTimeout(() => {
        this.$reconnect();
      }, this.options.reconnectTime);
      return;
    }
    // this.$autoClose()
  }
  // 心跳方法
  $heartbeat() {
    if (!this.options.heartbeatEnabled) return;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    if (this.heartbeatHandlerTimer) {
      clearInterval(this.heartbeatHandlerTimer);
    }
    console.log("心跳检测");
    this.heartbeatTimer = setInterval(() => {
      this.send(this.options.heartbeatData);
    }, this.options.heartbeatTime);
    this.heartbeatHandlerTimer = setInterval(() => {
      if (this.isHeartbeat !== this.options.heartbeatCallbackData) {
        clearInterval(this.heartbeatTimer);
        clearInterval(this.heartbeatHandlerTimer);
        this.$error(); // 没有返回pong 重启webSocket
      }
      this.isHeartbeat = false;
    }, this.options.heartbeatTime + 10000);
  }
  $clear() {
    // TODO 补充 Close的回调
    // event.close();
    this.heartbeat_timer && clearInterval(this.heartbeat_timer);
    this.heartbeatHandlerTimer && clearInterval(this.heartbeatHandlerTimer);
  }
  // 关闭连接
  $autoClose(e) {
    console.log("关闭连接:", e, this.isManualLock);
    if (!this.isManualLock) {
      this.$clear();
    }
    if (this.websocket) {
      this.websocket = null;
      if (
        !this.isManualLock &&
        (this.options.reconnectEnabled || this.options.loopReconnect)
      ) {
        setTimeout(() => {
          this.$reconnect();
        }, this.options.reconnectTime);
        return;
      }
    }
    if (this.options.handlerClose) {
      this.options.handlerClose();
    }
  }
  // 被外部调用关闭
  close() {
    console.log("被外部调用关闭");
    this.isManualLock = true;
    // 防止火狐关闭连接较慢，快速切换页面，导致出现bug
    this.$clear();
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
