<template>
  <div class="layout-sign-in-container" @keyup.enter="onClickSignInButton()">
    <div class="layout-sign-in">
      <div class="layout-sign-in__title">
        <HomeIcon
          title="myRis Web"
          colorType="Dark"
          fontSize="18px"
          fontWeight="bold"
        />
      </div>
      <div class="layout-sign-in__body">
        <div class="layout-sign-in__body__title">
          <h2>{{ $t("Sign In") }}</h2>
        </div>
        <div class="layout-sign-in__body__inputs">
          <div class="layout-sign-in__body__inputs__container">
            <div class="layout-sign-in__body__inputs__row">
              <h3>{{ $t("ID") }}</h3>
              <TextInputBox
                placeholder=""
                v-model="inputID"
                :textMax="maxLengthId"
              />
            </div>
            <div class="layout-sign-in__body__inputs__row">
              <h3>{{ $t("Password") }}</h3>
              <TextInputBox
                placeholder=""
                v-model="inputPassword"
                inputType="password"
                :textMax="maxLengthPassword"
              />
            </div>
          </div>
        </div>
        <div class="layout-sign-in__body__err-msg">
          <span>{{ errMsg }}</span>
        </div>
        <div class="layout-sign-in__body__buttons">
          <TextButton
            class="layout-sign-in__body__buttons__signin"
            text="Sign-In"
            buttonStyle="primary"
            fontSize="16px"
            @click.prevent="onClickSignInButton()"
          />
          <router-link to="/sign-up"> {{ $t("Sign-Up") }} </router-link>
        </div>
      </div>
      <div class="layout-sign-in__footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import UserDataService from "@/service/UserService";
import { IUserSignInQueryCondition } from "@/types";

import { useStore } from "vuex";
import { useRouter } from "vue-router";
//
import HomeIcon from "@/components/icon/HomeIcon.vue";
import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
//
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SignInView",

  components: {
    HomeIcon,
    TextButton,
    TextInputBox,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    const maxLengthId = ref(16);
    const maxLengthPassword = ref(32);

    let inputID = ref("");
    let inputPassword = ref("");

    const errMsg = ref("");

    // stores
    const fetchSetCurUserInfo = (id: string) => {
      store.dispatch("UserModelModule/fetchSetCurUserById", id);
    };

    async function CanSignIn(id: string, pwd: string) {
      let reqQuery: IUserSignInQueryCondition = {
        user_id: id,
        user_pwd: pwd,
      };

      let res = await UserDataService.CanSignIn(reqQuery);

      const { result, err_code } = res.data;

      if (result === true) {
        fetchSetCurUserInfo(id);
        router.push("/");
      } else if (typeof err_code === "string") {
        console.log("Unknown Err: ", err_code);
        errMsg.value = "Unknown Error: ".concat(err_code);
      } else if (err_code != undefined && err_code > 0) {
        console.log("error code: ", err_code);

        errMsg.value =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);
      }
    }

    const onClickSignInButton = () => {
      CanSignIn(inputID.value, inputPassword.value);
    };

    return {
      maxLengthId,
      maxLengthPassword,
      //
      inputID,
      inputPassword,
      //
      errMsg,
      //
      onClickSignInButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/signInUp";
</style>
