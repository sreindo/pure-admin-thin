import { $t } from "@/plugins/i18n";

export default {
  path: "/system",
  redirect: "/system/index",
  meta: {
    icon: "informationLine",
    title: $t("menus.system"),
    // showLink: false,
    rank: 5
  },
  children: [
    {
      path: "/system/index",
      name: "System",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: $t("menus.system")
      }
    }
  ]
} as RouteConfigsTable;
