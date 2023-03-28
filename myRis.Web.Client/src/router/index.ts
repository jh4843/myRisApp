import { nextTick } from "vue";
import {
  createRouter,
  //createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
// MWL
import MwlView from "@/views/MwlView.vue";
// User Management
import SignIn from "@/views/SignInView.vue";
import SignUp from "@/views/SignUpView.vue";
// User Settings
import UserSetting from "@/views/UserSetting.vue";
import UserSettingSystemInfo from "@/views/userSetting/UserSettingSystemInfo.vue";
import UserSettingProfile from "@/views/userSetting/UserSettingProfile.vue";
import UserSettingProcPlan from "@/views/userSetting/UserSettingProcPlan.vue";
import UserSettingProtocol from "@/views/userSetting/UserSettingProtocol.vue";
import UserSettingBodypart from "@/views/userSetting/UserSettingBodypart.vue";
import UserSettingStation from "@/views/userSetting/UserSettingStation.vue";
import UserSettingOrdReason from "@/views/userSetting/UserSettingOrdReason.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "MwlView",
    component: MwlView,

    meta: {
      title: "[myRis Web] RIS-MWL",
    },
  },
  {
    path: "/sign-in",
    name: "SignInView",
    component: SignIn,
    meta: {
      title: "[myRis Web] Sign-In",
    },
  },
  {
    path: "/sign-up",
    name: "SignUpView",
    component: SignUp,
    meta: {
      title: "[myRis Web] Sign-Up",
    },
  },
  {
    path: "/user-setting",
    name: "UserSetting",
    redirect: "/user-setting/system-info",
    component: UserSetting,
    children: [
      {
        path: "system-info",
        component: UserSettingSystemInfo,
        meta: { title: "[myRis Web] Setting-SystemInfo" },
      },
      {
        path: "profile",
        component: UserSettingProfile,
        meta: { title: "[myRis Web] Setting-Profile" },
      },
      {
        path: "proc-plan",
        component: UserSettingProcPlan,
        meta: { title: "[myRis Web] Setting-ProcPlan" },
      },
      {
        path: "protocol",
        component: UserSettingProtocol,
        meta: { title: "[myRis Web] Setting-Protocol" },
      },
      {
        path: "bodypart",
        component: UserSettingBodypart,
        meta: { title: "[myRis Web] Setting-Bodypart" },
      },
      {
        path: "station",
        component: UserSettingStation,
        meta: { title: "[myRis Web] Setting-Station" },
      },
      {
        path: "ord-reason",
        component: UserSettingOrdReason,
        meta: { title: "[myRis Web] Setting Order-Reason" },
      },
    ],

    meta: {
      title: "User Setting",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  //history: createWebHashHistory(),  // For Local Static
  routes,
});

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title === undefined ? "myRis Web" : to.meta.title;
  });
});

export default router;
