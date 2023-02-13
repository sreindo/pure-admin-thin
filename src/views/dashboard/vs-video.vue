<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import VsWebSocket from "@/utils/websocket/index";
const imgSrc = ref();
let wsObject = null;
defineOptions({
  name: "VsVideo"
});

onMounted(() => {
  initWebsocket();
});

/**
 * 连接请求图像数据
 */
function initWebsocket() {
  if (wsObject) return;
  const wsOption = {
    // url: "/counting/frame/",
    url: "ws://192.168.63.171/counting/frame/", // debug url
    handlerMessage: data => {
      if (!data) return;
      if (data.status != 0) {
        return;
      }
      if (data.action == "transmit") {
        if (data.message == "frame") {
          // 更新图像
          imgSrc.value = data["img"];
        } else {
          if (data.message == "result") {
            // 更新计数
            // oResult.iInner = parseInt(data.result.enter);
            // oResult.iOutter = parseInt(data.result.leave);
            // $scope.oResult.iInner = parseInt(oResult.iInner);
            // $scope.$apply();
          }
        }
      }
    }
  };
  wsObject = new VsWebSocket(wsOption);
}
</script>

<template>
  <div id="VideoAxRoom" name="VideoAxRoom">
    <img class="h5canvas" :src="imgSrc" />
    <canvas id="selCanvas" name="selCanvas" />
  </div>
</template>

<style lang="scss" scoped>
#VideoAxRoom {
  // position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: rgba(50, 50, 50, 0.6);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  canvas#selCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(226, 65, 65, 0.6);
  }
}
</style>
