<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="add-bodypart-dialog">
        <div class="add-bodypart-dialog__container">
          <div class="add-bodypart-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="add-bodypart-dialog__content">
            <!-- Sub Type -->
            <LabelBase class="add-bodypart-dialog__content__subtype-label">
              <template v-slot:label>
                <h3>{{ $t("Sub Type") }}</h3>
              </template>
            </LabelBase>
            <DropDownBase
              class="add-bodypart-dialog__content__subtype-input"
              :isDisabled="isHumanLicense"
              v-model="inputSubType"
              :options="getSubTypeList"
              @onTextChanged="onHandleTextChanged('SubType')"
            />

            <!-- Meaning -->
            <LabelBase
              class="add-bodypart-dialog__content__code-meaning-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("Code Meaning") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-bodypart-dialog__content__code-meaning-input"
              v-model="inputBodypart.bp_code_meaning"
              :textMax="maxLengthBodypartMeaning"
            />
          </div>
          <div class="add-bodypart-dialog__control-row">
            <div class="add-bodypart-dialog__control-row__add">
              <TextButton
                :text="okButtonText"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickOkButton()"
              />
            </div>
            <div class="add-bodypart-dialog__control-row__cancel">
              <TextButton
                text="Cancel"
                buttonStyle="sub3"
                fontSize="16px"
                @click.prevent="onClickCancelButton()"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType } from "vue";
import { useStore } from "vuex";
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import LabelBase from "@/components/label/LabelBase.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";

type TInputType = "SubType" | "CodeValue" | "ScmDesign" | "CodeMeaning";

export default defineComponent({
  name: "AddBodypartDialog",

  components: {
    TextButton,
    TextInputBox,
    LabelBase,
    DropDownBase,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    isModify: {
      type: Boolean,
      default: false,
    },

    curBodypart: {
      type: Object as PropType<myTypes.IDbBodypart>,
      required: true,
    },
  },

  emits: ["on-ok", "on-cancel"],

  setup(props, context) {
    const store = useStore();

    const isShowModal = computed(() => {
      if (props.show) {
        initControl();
      }

      return props.show;
    });

    const title = ref("Add Bodypart");

    const isReadOnly = ref(true);
    const maxLengthBodypartMeaning = ref(64);

    const isHumanLicense = computed(() => {
      const srvInfo: myTypes.IWebServerInfo =
        store.getters["AppModelModule/GET_SERVER_INFO"];

      return srvInfo.license_type == myTypes.eLicenseType.Human ? true : false;
    });

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Bodypart",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeError,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: "Invalid input data.",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const inputBodypart = ref({
      bp_key: -1,
      bp_type: isHumanLicense.value
        ? myTypes.eBodypartType.HUMAN
        : myTypes.eBodypartType.VETERINARY,
      bp_code_value: "",
      bp_scm_design: "", // use Server's Alias(name)
      bp_code_meaning: "",
    } as myTypes.IDbBodypart);

    const onHandleTextChanged = (type: TInputType) => {
      switch (type) {
        case "SubType":
          if (
            inputSubType.value == undefined ||
            inputSubType.value == "" ||
            inputSubType.value == "NONE" ||
            inputSubType.value == "END"
          ) {
            inputBodypart.value.bp_sub_type = myTypes.eBodypartSubType.NONE;
          } else {
            inputBodypart.value.bp_sub_type = myTypes.reverseBodypartSubType(
              inputSubType.value
            );
          }

          break;
        case "CodeValue":
          console.log(
            "Changed Code Value: ",
            inputBodypart.value.bp_code_value
          );
          break;
        case "CodeMeaning":
          console.log(
            "Changed Code Meaning: ",
            inputBodypart.value.bp_code_meaning
          );
          break;
      }
    };

    const inputSubType = ref(
      myTypes.parseBodypartSubType(myTypes.eBodypartSubType.NONE)
    );
    const getSubTypeList = computed(() => {
      let typeList: string[] = [];

      typeList.push(myTypes.eBodypartSubType[myTypes.eBodypartSubType.NONE]);
      typeList.push(myTypes.eBodypartSubType[myTypes.eBodypartSubType.LARGE]);
      typeList.push(myTypes.eBodypartSubType[myTypes.eBodypartSubType.SMALL]);

      return typeList;
    });

    const okButtonText = ref("Add");

    const initControl = () => {
      if (props.isModify) {
        title.value = "Modify Bodypart";

        inputBodypart.value = props.curBodypart;

        if (inputBodypart.value.bp_sub_type == undefined) {
          inputSubType.value = myTypes.parseBodypartSubType(
            myTypes.eBodypartSubType.NONE
          );
        } else {
          inputSubType.value = myTypes.parseBodypartSubType(
            inputBodypart.value.bp_sub_type
          );
        }

        okButtonText.value = "Modify";

        console.log(
          "[Add Bodypart Dialog] initControl(Modify)",
          props.curBodypart,
          inputBodypart.value
        );
      } else {
        title.value = "Add Bodypart";

        inputBodypart.value.bp_key = -1;

        if (isHumanLicense.value) {
          inputBodypart.value.bp_type = myTypes.eBodypartType.HUMAN;
        } else {
          inputBodypart.value.bp_type = myTypes.eBodypartType.VETERINARY;
        }

        inputBodypart.value.bp_code_value = "";
        inputBodypart.value.bp_scm_design = "";
        inputBodypart.value.bp_code_meaning = "";
        inputBodypart.value.bp_sub_type = myTypes.eBodypartSubType.NONE;

        inputSubType.value = myTypes.parseBodypartSubType(
          myTypes.eBodypartSubType.NONE
        );
        //
        okButtonText.value = "Add";
      }
    };

    const isValidInput = () => {
      if (
        inputBodypart.value.bp_type <= myTypes.eBodypartType.NONE ||
        inputBodypart.value.bp_type >= myTypes.eBodypartType.END
      ) {
        return false;
      }

      if (
        inputBodypart.value.bp_code_meaning == undefined ||
        inputBodypart.value.bp_code_meaning == ""
      ) {
        return false;
      }

      return true;
    };

    const onClickOkButton = () => {
      const bp: myTypes.IDbBodypart = inputBodypart.value;

      if (isValidInput() == false) {
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
        return;
      }

      context.emit("on-ok", bp);
    };

    const onClickCancelButton = () => {
      context.emit("on-cancel");
    };

    // Style
    return {
      isShowModal,
      //
      title,
      isReadOnly,
      maxLengthBodypartMeaning,
      //
      isHumanLicense,
      inputBodypart,
      onHandleTextChanged,
      //
      /////////////
      // Type
      /////////////
      inputSubType,
      getSubTypeList,
      //
      okButtonText,
      //
      onClickOkButton,
      onClickCancelButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
