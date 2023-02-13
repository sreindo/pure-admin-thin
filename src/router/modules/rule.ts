import { $t } from "@/plugins/i18n";

export default {
  path: "/rule",
  redirect: "/rule/index",
  meta: {
    icon: "informationLine",
    title: $t("menus.rule"),
    // showLink: false,
    rank: 2
  },
  children: [
    {
      path: "/rule/index",
      name: "rule",
      component: () => import("@/views/rule/index.vue"),
      meta: {
        title: $t("menus.rule")
      }
    }
  ]
} as RouteConfigsTable;
