<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="message-box-base" :class="size">
        <div class="message-box-base__container" :class="size">
          <span class="message-box-base__title">
            <img
              alt="Message Box"
              style="
                 {
                  width: 25px;
                  height: 25px;
                }
              "
              class="message-box-base__title__icon"
              :src="iconSrc[getIconIndex]"
            />
            <h3>{{ $t(title) }}</h3>
          </span>
          <div class="message-box-base__content">
            <slot></slot>
          </div>
          <div class="message-box-base__buttons">
            <TextButton
              v-show="isShowOk"
              text="OK"
              buttonStyle="primary"
              fontSize="14px"
              @click="onHandleOk()"
            />
            <TextButton
              v-show="isShowCancel"
              text="Cancel"
              buttonStyle="sub3"
              fontSize="14px"
              @click="onHandleCancel()"
            />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType } from "vue";
import { useStore } from "vuex";
import TextButton from "@/components/button/TextButton.vue";
import * as myTypes from "@/types";

export default defineComponent({
  name: "MessageBoxBase",

  components: {
    TextButton,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "normal", // big, normal, small
    },

    msgType: {
      type: Number as PropType<myTypes.eMsgBoxMsgType>,
      default: myTypes.eMsgBoxMsgType.MsgTypeInfo, // info / error / warn / check
    },

    msg: {
      type: String,
      default: "",
    },

    resType: {
      type: Number as PropType<myTypes.eMsgBoxResType>, // Bit operation (eMsgBoxResType)
      default: myTypes.eMsgBoxResType.Ok,
    },
  },

  emits: ["on-ok", "on-cancel"],

  setup(props, context) {
    const store = useStore();
    const isShowModal = computed(() => {
      return props.show;
    });

    const iconSrc: string[] = reactive([
      require("@/assets/msgbox/info.svg"), // 0
      require("@/assets/msgbox/error.svg"), // 1
      require("@/assets/msgbox/warn.svg"), // 2
      require("@/assets/msgbox/check.svg"), // 3
    ]);

    const getIconIndex = computed(() => {
      if (props.msgType == myTypes.eMsgBoxMsgType.MsgTypeError) {
        return 1;
      } else if (props.msgType == myTypes.eMsgBoxMsgType.MsgTypeWarn) {
        return 2;
      } else if (props.msgType == myTypes.eMsgBoxMsgType.MsgTypeCheck) {
        return 3;
      }

      return 0;
    });

    const message = ref(props.msg);

    const isShowOk = computed(() => {
      if (
        (props.resType & myTypes.eMsgBoxResType.Ok) ==
        myTypes.eMsgBoxResType.Ok
      ) {
        return true;
      }

      return false;
    });

    const isShowCancel = computed(() => {
      if (
        (props.resType & myTypes.eMsgBoxResType.Cancel) ==
        myTypes.eMsgBoxResType.Cancel
      ) {
        return true;
      }

      return false;
    });

    const onHandleOk = () => {
      let msgBox: myTypes.IMessageBox = {
        isShow: false,
        title: "",
        msgType: myTypes.eMsgBoxMsgType.MsgTypeNone,
        resType: myTypes.eMsgBoxResType.None,
        style: "",

        msg: "",
        res: myTypes.eMsgBoxRes.ResOk,
      };
      store.dispatch("AppModelModule/setMsgBoxInfo", msgBox);

      context.emit("on-ok");
    };

    const onHandleCancel = () => {
      let msgBox: myTypes.IMessageBox = {
        isShow: false,
        title: "",
        msgType: myTypes.eMsgBoxMsgType.MsgTypeNone,
        resType: myTypes.eMsgBoxResType.None,
        style: "",

        msg: "",
        res: myTypes.eMsgBoxRes.ResCancel,
      };

      store.dispatch("AppModelModule/setMsgBoxInfo", msgBox);

      context.emit("on-cancel");
    };

    return {
      isShowModal,
      iconSrc,
      getIconIndex,
      message,
      //
      isShowOk,
      isShowCancel,
      //
      onHandleOk,
      onHandleCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
