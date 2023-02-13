import { $t } from "@/plugins/i18n";

export default {
  path: "/report",
  redirect: "/report/index",
  meta: {
    icon: "informationLine",
    title: $t("menus.report"),
    // showLink: false,
    rank: 4
  },
  children: [
    {
      path: "/report/index",
      name: "report",
      component: () => import("@/views/error/403.vue"),
      meta: {
        title: $t("menus.report")
      }
    }
  ]
} as RouteConfigsTable;
