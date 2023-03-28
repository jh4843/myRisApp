<template>
  <div class="layout-sign-up-container" @keyup.enter="onClickCreateButton()">
    <div class="layout-sign-up">
      <div class="layout-sign-up__title">
        <HomeIcon
          title="myRis Web"
          colorType="Dark"
          fontSize="18px"
          fontWeight="bold"
        />
      </div>
      <div class="layout-sign-up__body">
        <div class="layout-sign-up__body__title">
          <h2>Create account</h2>
        </div>
        <div class="layout-sign-up__body__inputs">
          <div class="layout-sign-up__body__inputs__row">
            <h3>{{ $t("Class") }}</h3>
            <DropDownBase
              placeholder=""
              v-model="inputClass"
              :options="classOptions"
            />
          </div>
          <div class="layout-sign-up__body__inputs__row">
            <h3>{{ $t("ID") }}</h3>
            <TextInputBox
              placeholder=""
              v-model="inputID"
              :textMax="maxLengthId"
            />
          </div>
          <div class="layout-sign-up__body__inputs__row">
            <h3>{{ $t("Name") }}</h3>
            <TextInputBox
              placeholder=""
              v-model="inputName"
              :textMax="maxLengthUserName"
            />
          </div>
          <div class="layout-sign-up__body__inputs__row">
            <h3>{{ $t("Password") }}</h3>
            <TextInputBox
              placeholder=""
              v-model="inputPassword"
              inputType="password"
              :textMax="maxLengthPassword"
            />
          </div>
          <div class="layout-sign-up__body__inputs__row">
            <h3>{{ $t("Confirm Password") }}</h3>
            <TextInputBox
              placeholder=""
              v-model="inputConfirmPassword"
              inputType="password"
              :textMax="maxLengthPassword"
            />
          </div>
        </div>
        <div class="layout-sign-up__body__err-msg">
          <span>{{ errMsg }}</span>
        </div>
        <div class="layout-sign-up__body__buttons">
          <TextButton
            class="layout-sign-up__body__buttons__create"
            text="Create"
            buttonStyle="primary"
            fontSize="16px"
            @click.prevent="onClickCreateButton()"
          />
          <router-link to="/sign-in"> Sign-In </router-link>
        </div>
      </div>
      <div class="layout-sign-up__footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import UserDataService from "@/service/UserService";
import * as myTypes from "@/types";
//
import { useStore } from "vuex";
import { useRouter } from "vue-router";
//
import HomeIcon from "@/components/icon/HomeIcon.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";
import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
//
import { defineComponent, ref, reactive, onMounted } from "vue";

export default defineComponent({
  name: "SignUpView",

  components: {
    HomeIcon,
    DropDownBase,
    TextButton,
    TextInputBox,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    let inputClass = ref("Admin");
    let inputID = ref("");
    let inputName = ref("");
    let inputPassword = ref("");
    let inputConfirmPassword = ref("");

    const maxLengthId = ref(16);
    const maxLengthUserName = ref(64);
    const maxLengthPassword = ref(32);

    // Configuration
    let classOptions = reactive([
      "Admin",
      "Physician",
      "Nurse",
      "Engineer",
      "Radiologist",
    ]);

    const errMsg = ref("");

    // Message Box
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Sign Up Result",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: "Sign up successfully.",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Sign Up Result";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = "Sign up successfully.";
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    async function SignUp(
      level: string,
      id: string,
      name: string,
      pwd: string
    ) {
      let reqQuery: myTypes.IUserSignUpQueryCondition = {
        user_level: level,
        user_name: name,
        user_id: id,
        user_pwd: pwd,
      };

      const res = await UserDataService.SignUpUser(reqQuery);

      const { result, err_code } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = `Sign up successfully.\n`;
        router.push("/sign-in");
      } else if (typeof err_code === "string") {
        console.log("Unknown Err: ", err_code);
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Unknown Error: ${err_code}\n`;
      } else if (err_code != undefined && err_code > 0) {
        console.log("error code: ", err_code);
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add sps.\n(Reason: ${errDesc} )`;
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to sign up.\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      console.log(res);
    }

    const onClickCreateButton = () => {
      console.log("Clicked Create button");

      if (inputPassword.value != inputConfirmPassword.value) {
        errMsg.value =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](11006);
        console.log("Failed to confirm entered password");
        return;
      }

      SignUp(
        inputClass.value,
        inputID.value,
        inputName.value,
        inputPassword.value
      );
    };

    const initInstance = () => {
      initMsgBoxInfo();
    };

    onMounted(initInstance);

    return {
      //
      maxLengthId,
      maxLengthUserName,
      maxLengthPassword,
      //
      inputClass,
      inputID,
      inputName,
      inputPassword,
      inputConfirmPassword,
      //
      classOptions,
      //
      errMsg,

      onClickCreateButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/signInUp";
</style>
