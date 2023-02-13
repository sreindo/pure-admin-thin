<script setup lang="ts">
import Logo from "./logo.vue";
import { useRoute } from "vue-router";
import { emitter } from "@/utils/mitt";
import SidebarItem from "./sidebarItem.vue";
import leftCollapse from "./leftCollapse.vue";
import { useNav } from "@/layout/hooks/useNav";
import { storageLocal } from "@pureadmin/utils";
import { ref, computed, watch, onBeforeMount } from "vue";
import { findRouteByPath, getParentPaths } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
const route = useRoute();
const showLogo = ref(
  storageLocal().getItem<StorageConfigs>("responsive-configure")?.showLogo ??
    true
);

const {
  routers,
  device,
  pureApp,
  isCollapse,
  menuSelect,
  toggleSideBar,
  username,
  logout
} = useNav();
const { t, locale, translationCh, translationEn } = useTranslationLang();
const subMenuData = ref([]);

const menuData = computed(() => {
  return pureApp.layout === "mix" && device.value !== "mobile"
    ? subMenuData.value
    : usePermissionStoreHook().wholeMenus;
});

function getSubMenuData(path: string) {
  // path的上级路由组成的数组
  const parentPathArr = getParentPaths(
    path,
    usePermissionStoreHook().wholeMenus
  );
  // 当前路由的父级路由信息
  const parenetRoute = findRouteByPath(
    parentPathArr[0] || path,
    usePermissionStoreHook().wholeMenus
  );
  if (!parenetRoute?.children) return;
  subMenuData.value = parenetRoute?.children;
}

getSubMenuData(route.path);

onBeforeMount(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});

watch(
  () => [route.path, usePermissionStoreHook().wholeMenus],
  () => {
    getSubMenuData(route.path);
    menuSelect(route.path, routers);
  }
);
</script>

<template>
  <div
    v-loading="menuData.length === 0"
    :class="['sidebar-container', showLogo ? 'has-logo' : '']"
  >
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :class="[device === 'mobile' ? 'mobile' : 'pc']"
    >
      <el-menu
        router
        unique-opened
        mode="vertical"
        class="select-none outer-most"
        :collapse="isCollapse"
        :default-active="route.path"
        :collapse-transition="false"
        @select="indexPath => menuSelect(indexPath, routers)"
      >
        <sidebar-item
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          :base-path="routes.path"
          class="select-none outer-most"
        />
      </el-menu>
    </el-scrollbar>
    <!-- <leftCollapse
      v-if="device !== 'mobile'"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    /> -->
    <!-- 退出登录 -->
    <el-dropdown trigger="click">
      <span class="select-none el-dropdown-link navbar-bg-hover">
        <p v-if="username" class="dark:text-white">{{ username }}</p>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="logout">
          <el-dropdown-item @click="logout">
            <IconifyIconOffline :icon="LogoutCircleRLine" style="margin: 5px" />
            {{ t("buttons.hsLoginOut") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
</style>
