<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import VsVideo from "@/views/dashboard/vs-video.vue";
import { $t } from "@/plugins/i18n";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import h5Player from "@/utils/draw/h5player.js";
defineOptions({
  name: "Welcome"
});
const installForm = ref({
  userName: "test",
  company: "sdsd"
});
const installRules: FormRules = {
  userName: [
    {
      required: true,
      trigger: "blur",
      message: $t("requiredField")
    }
  ]
};
let playerApi;
const isDrawing = ref(false);
const drawEntranceArea = function () {
  playerApi.SetPolygonMap(
    1,
    1,
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:",
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:"
  );
  isDrawing.value = true;
};

const drawExitArea = function () {
  playerApi.SetPolygonMap(
    1,
    1,
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:",
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:"
  );
  isDrawing.value = true;
};
function clearCanvas() {
  playerApi.SetPolygonMap(
    1,
    1,
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:",
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:"
  );
}

function discardArea() {
  playerApi.SetPolygonMap(
    1,
    1,
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:",
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:"
  );
  playerApi.SetPolygonMap(
    0,
    1,
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:",
    "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:"
  );
  isDrawing.value = false;
}

function setArea() {
  alert("setArea");
}

onMounted(() => {
  playerApi = new h5Player();
  // playerApi.SetPolygonMap(
  //   1,
  //   1,
  //   "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:",
  //   "-1:-1:-1:-1:-1:-1:-1:-1:-1:-1:"
  // );
});
</script>

<template>
  <div class="card-container">
    <el-card class="box-card mid-card left-card" shadow="always">
      <div class="video-box">
        <VsVideo />
      </div>
      <div class="btn-div">
        <div v-show="!isDrawing">
          <el-button @click="drawEntranceArea">Draw Entrance Area</el-button>
          <el-button @click="drawExitArea">Draw Exit Area</el-button>
        </div>
        <div v-show="isDrawing">
          <el-button @click="clearCanvas">Clear</el-button>
          <el-button @click="discardArea">Discard</el-button>
          <el-button @click="setArea">Set Entrance Area</el-button>
        </div>
      </div>
      <div class="multi-form">
        <el-form
          ref="installForm"
          name="installForm"
          :model="installForm"
          :rules="installRules"
          label-width="100px"
        >
          <el-form-item prop="userName" :label="$t('userName')">
            <el-input
              v-model="installForm.userName"
              maxlength="16"
              show-word-limit
            />
          </el-form-item>
          <el-form-item prop="company" :label="$t('company')">
            <el-select
              v-model="installForm.company"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              class="w-full"
            >
              <!-- <el-option
                v-for="item in companyOptions"
                :key="item.company"
                :label="item.company"
                :value="item.company"
              /> -->
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mid-card right-card" shadow="always" />
  </div>
</template>

<style scoped lang="scss">
.card-container {
  width: 100%;
  // height: 100%;
  display: flex;
}
// 半屏卡片样式
.mid-card {
  flex: 1;
  margin: 20px;
  // height: 100%;
  display: inline-block;
  .btn-div {
    width: 100%;
    margin: 20px 0;
    text-align: center;
  }
}
</style>
