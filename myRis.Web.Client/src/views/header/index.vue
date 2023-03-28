<template>
  <div class="header">
    <header class="header__header">
      <span class="header__container">
        <div class="header__main">
          <HomeIcon title="myRis Web" />
        </div>
        <ul class="header__menu">
          <li v-show="!isSignedIn">
            <router-link to="/sign-in">
              <TextButton
                class="header__menu__sign-in"
                text="Sign-In"
                buttonStyle="sub2"
                fontSize="12px"
              />
            </router-link>
          </li>
          <li v-show="!isSignedIn">
            <router-link to="/sign-up">
              <TextButton
                class="header__menu__sign-up"
                text="Sign-Up"
                buttonStyle="sub2"
                fontSize="12px"
              />
            </router-link>
          </li>
          <li v-show="isSignedIn">
            <TextButton
              class="header__menu__sign-up"
              text="Sign-Out"
              buttonStyle="sub2"
              fontSize="12px"
              @click="onHandleClickSignOut()"
            />
          </li>
          <li>
            <router-link v-show="isSignedIn" to="/user-setting">
              <div class="header__menu__user-setting-icon">
                <SvgBaseIcon iconName="UserSetting" width="40px" height="40px">
                  <template v-slot:back-ground>
                    <CircleBackground />
                  </template>
                  <template v-slot:default>
                    <UserSettingIcon />
                  </template>
                </SvgBaseIcon>
              </div>
            </router-link>
          </li>
        </ul>
      </span>
    </header>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  reactive,
  watch,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import * as myTypes from "@/types";
//
import HomeIcon from "@/components/icon/HomeIcon.vue";
import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import TextButton from "@/components/button/TextButton.vue";

import UserSettingIcon from "@/assets/etc/UserSettingIcon.vue";
import CircleBackground from "@/assets/etc/CircleBackground.vue";

export default defineComponent({
  name: "LayoutHeader",
  components: {
    HomeIcon,
    SvgBaseIcon,
    TextButton,
    UserSettingIcon,
    CircleBackground,
  },

  props: {},

  setup() {
    const store = useStore();
    const router = useRouter();

    const msgType = ref(myTypes.eMsgBoxMsgType.MsgTypeCheck);

    const isSignedIn = computed(() => {
      return store.getters["UserModelModule/IS_SIGN_IN"];
    });

    const onHandleClickSignOut = () => {
      initMsgBoxInfo();
      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
    };

    // Message Box
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Sign Out",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok | myTypes.eMsgBoxResType.Cancel,
      style: "",

      msg: "Are you sure you want to sign-out?",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Sign Out";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType =
        myTypes.eMsgBoxResType.Ok | myTypes.eMsgBoxResType.Cancel;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = "Ae you sure you want to sign-out?";
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    // [TODO: NEED TO FIX] (message box -> Ask Box)
    watch(
      () => store.getters["AppModelModule/GET_MSG_BOX_INFO"].res,
      () => {
        if (MsgBoxInfo.isShow == true) {
          if (
            store.getters["AppModelModule/GET_MSG_BOX_INFO"].res ==
            myTypes.eMsgBoxRes.ResOk
          ) {
            console.log("Signed Out!!");
            //
            store.dispatch("UserModelModule/resetCurUser");
            store.dispatch("AppModelModule/completeMsgBoxInfo");
            initMsgBoxInfo();

            router.push("/");
          } else if (
            store.getters["AppModelModule/GET_MSG_BOX_INFO"].res ==
            myTypes.eMsgBoxRes.ResCancel
          ) {
            console.log("Signed Out Cancel!!");
            store.dispatch("AppModelModule/completeMsgBoxInfo");
            initMsgBoxInfo();
          }
        }
      }
    );

    const initInstance = () => {
      initMsgBoxInfo();
    };

    onMounted(initInstance);

    return {
      isSignedIn,
      msgType,

      onHandleClickSignOut,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/header";
</style>
