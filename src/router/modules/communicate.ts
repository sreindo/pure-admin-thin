import { $t } from "@/plugins/i18n";

export default {
  path: "/communicate",
  redirect: "/communicate/index",
  meta: {
    icon: "informationLine",
    title: $t("menus.communication"),
    // showLink: false,
    rank: 3
  },
  children: [
    {
      path: "/communicate/index",
      name: "communicate",
      component: () => import("@/views/error/403.vue"),
      meta: {
        title: $t("menus.communication")
      }
    }
  ]
} as RouteConfigsTable;
