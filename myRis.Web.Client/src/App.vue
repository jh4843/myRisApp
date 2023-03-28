<template>
  <Header class="layout-header" />
  <main id="myRisWebApp">
    <router-view></router-view>
  </main>

  <MessageBoxBase
    :show="getMsgBoxInfo.isShow"
    :resType="getMsgBoxInfo.resType"
    :msgType="getMsgBoxInfo.msgType"
    :title="getMsgBoxInfo.title"
  >
    <template v-slot:default>
      <div :style="getMsgBoxInfo.style" v-html="getMsgBoxInfo.msg" />
    </template>
  </MessageBoxBase>
</template>

<script lang="ts">
import Header from "@/views/header/index.vue"; // @ is an alias to /src
import { defineComponent, onMounted, ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import * as myTypes from "@/types";

import MessageBoxBase from "@/components/dialog/MessageBoxBase.vue";

export default defineComponent({
  name: "App",
  components: { Header, MessageBoxBase },
  setup() {
    const isVerticalSplitter = ref(false);
    const store = useStore();

    const { t } = useI18n({
      inheritLocale: true,
      warnHtmlMessage: false,
    });

    const InitializeApp = () => {
      store.dispatch("UserModelModule/loadCurUserFromLocalStorage");
      store.dispatch("AppModelModule/fetServerInfo");
    };

    // Message Box
    const getMsgBoxInfo = computed(() => {
      let res: myTypes.IMessageBox =
        store.getters["AppModelModule/GET_MSG_BOX_INFO"];

      if (store.getters["AppModelModule/GET_MSG_BOX_INFO"] == undefined) {
        return {
          isShow: false,
          title: "",
          msgType: myTypes.eMsgBoxMsgType.MsgTypeNone,
          resType: myTypes.eMsgBoxResType.None,
          style: "",

          msg: "",
          res: "",
        };
      }

      res.msg = t(res.msg.split("\n").join("<br />"));
      return res;
    });

    watch(
      () => store.getters["AppModelModule/GET_MSG_BOX_INFO"].isShow,
      (newValue, oldValue) => {
        if (oldValue == false && newValue == true) {
          let msgBox = store.getters["AppModelModule/GET_MSG_BOX_INFO"];
          msgBox.res = myTypes.eMsgBoxRes.ResIng;
        }
      }
    );

    onMounted(InitializeApp);

    return {
      isVerticalSplitter,
      //
      getMsgBoxInfo,
    };
  },
});
</script>

<style lang="scss">
@font-face {
  font-family: "NotoSans";
  src: local("NotoSans"),
    url(./assets/fonts/NotoSans-Regular.ttf) format("truetype");
}

#app {
  font-family: $common-font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  width: 100%;
  height: 100%;

  margin: 0;
  padding: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #cc53ae;
}

.layout-header {
  width: $layout-header-width;
  height: $layout-header-height;
}

main {
  width: 100%;
  height: calc(100% - $layout-header-height);

  padding: 0px;
  margin: 0px;
}
</style>
