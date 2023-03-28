<template>
  <div class="user-profile">
    <div class="user-profile__title">
      <h2>{{ $t("User Profile") }}</h2>
    </div>
    <div class="user-profile__content-container">
      <LabelBase
        class="user-profile__content-container__class-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Class") }}</h3>
        </template>
      </LabelBase>
      <DropDownBase
        class="user-profile__content-container__class-input"
        v-model="userClass"
        :options="classOptions"
        :isDisabled="isManager"
      />

      <div class="user-profile__content-container__image">
        <SvgBaseIcon
          class="user-profile__content-container__image__user-icon"
          iconName="UserSetting"
          width="50%"
          height="50%"
          :isReadOnly="readOnlyTrue"
        >
          <template v-slot:back-ground>
            <CircleBackground />
          </template>
          <template v-slot:default>
            <UserSettingIcon />
          </template>
        </SvgBaseIcon>
      </div>

      <LabelBase
        class="user-profile__content-container__id-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("ID") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="user-profile__content-container__id-input"
        v-model="userId"
        :isReadonly="readOnlyTrue"
      />

      <LabelBase
        class="user-profile__content-container__name-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Name") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="user-profile__content-container__name-input"
        v-model="userName"
      />

      <LabelBase
        class="user-profile__content-container__old-password-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Old Password") }}</h3>
        </template>
      </LabelBase>

      <TextInputBox
        class="user-profile__content-container__old-password-input"
        inputType="password"
        v-model="userOldPassword"
      />

      <LabelBase
        class="user-profile__content-container__new-password-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("New Password") }}</h3>
        </template>
      </LabelBase>

      <TextInputBox
        class="user-profile__content-container__new-password-input"
        inputType="password"
        v-model="userNewPassword"
      />
      <LabelBase
        class="user-profile__content-container__confirm-password-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Confirm Password") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="user-profile__content-container__confirm-password-input"
        inputType="password"
        v-model="userConfirmPassword"
      />

      <LabelBase
        class="user-profile__content-container__description-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Description") }}</h3>
        </template>
      </LabelBase>

      <TextInputBox
        class="user-profile__content-container__description-input"
        v-model="userDescription"
      />
    </div>

    <div class="user-profile__control-row">
      <div class="user-profile__control-row__apply">
        <TextButton
          text="Apply"
          buttonStyle="primary"
          fontSize="16px"
          @click.prevent="onClickApplyButton()"
        />
      </div>
      <div class="user-profile__control-row__cancel">
        <TextButton
          text="Cancel"
          buttonStyle="sub3"
          fontSize="16px"
          @click.prevent="onClickCancelButton()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  watch,
} from "vue";
import { useStore } from "vuex";
import * as myTypes from "@/types";
import UserDataService from "@/service/UserService";

import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";
import LabelBase from "@/components/label/LabelBase.vue";
import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

import UserSettingIcon from "@/assets/etc/UserSettingIcon.vue";
import CircleBackground from "@/assets/etc/CircleBackground.vue";

export default defineComponent({
  name: "UserSettingProfile",

  components: {
    TextButton,
    TextInputBox,
    DropDownBase,
    LabelBase,
    SvgBaseIcon,
    UserSettingIcon,
    CircleBackground,
  },

  setup() {
    const store = useStore();
    const successMsg = "Modified user information successfully.";

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Edit Profile",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: "Modified user information successfully.",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Edit Profile";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = "Modified user information successfully.";
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const readOnlyTrue = ref(true);

    //const curUserInfo = ref<myTypes.IDbUser>();
    const curUserInfo = computed(() => {
      const res: myTypes.IDbUser =
        store.getters["UserModelModule/GET_CUR_USER"];

      return res;
    });

    const isManager = computed(() => {
      const res: myTypes.IDbUser =
        store.getters["UserModelModule/IS_CUR_USER_MANAGER"];

      return res;
    });

    const userClass = ref("Admin");
    const userId = ref("");
    const userName = ref("");
    const userOldPassword = ref("");
    const userNewPassword = ref("");
    const userConfirmPassword = ref("");
    const userDescription = ref("");

    watch(curUserInfo, () => {
      userClass.value = myTypes.parseUserLevel(curUserInfo.value.user_level);
      userId.value = curUserInfo.value.user_id;
      userName.value = curUserInfo.value.user_name;

      if (curUserInfo.value.user_desc != undefined) {
        userDescription.value = curUserInfo.value.user_desc;
      }
    });

    const classOptions = reactive([
      "Admin",
      "Physician",
      "Nurse",
      "Engineer",
      "Radiologist",
    ]);

    const initInstance = () => {
      store.dispatch("UserModelModule/fetCurUser");
      initMsgBoxInfo();
    };

    async function AsyncEditUser(
      id: string,
      level: string,
      name: string,
      oldPassword: string,
      newPassword: string,
      confirmPassword: string,
      desc: string
    ) {
      let reqQuery: myTypes.IUserEditUserQueryCondition = {
        user_id: id,
        user_level: level,
        user_name: name,
        user_old_pwd: oldPassword,
        user_new_pwd: newPassword,
        user_confirm_pwd: confirmPassword,
        user_desc: desc,
      };

      const res = await UserDataService.EditUser(reqQuery);

      const { result, err_code } = res.data;

      if (result == true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successMsg;

        store.dispatch("UserModelModule/fetCurUser");
        console.log("(After)EditUser", curUserInfo.value);
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to modify user information.\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        console.log("error code: ", err_code);
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to modify user information.\n(Reason: ${errDesc} )`;
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to modify user information.\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      userOldPassword.value = "";
      userNewPassword.value = "";
      userConfirmPassword.value = "";

      console.log(res);
    }

    const onClickApplyButton = () => {
      if (curUserInfo.value != undefined) {
        const curUser: myTypes.IDbUser = curUserInfo.value;
        console.log("onClickApplyButton", curUser);
      }

      AsyncEditUser(
        userId.value,
        userClass.value,
        userName.value,
        userOldPassword.value,
        userNewPassword.value,
        userConfirmPassword.value,
        userDescription.value
      );

      return;
    };

    const onClickCancelButton = () => {
      return "";
    };

    onMounted(initInstance);

    return {
      readOnlyTrue,
      isManager,

      userClass,
      userId,
      userName,
      userOldPassword,
      userNewPassword,
      userConfirmPassword,
      userDescription,

      classOptions,

      onClickApplyButton,
      onClickCancelButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/userSetting.scss";
</style>
