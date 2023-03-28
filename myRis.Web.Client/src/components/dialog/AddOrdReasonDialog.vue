<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="add-ord-reason-dialog">
        <div class="add-ord-reason-dialog__container">
          <div class="add-ord-reason-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="add-ord-reason-dialog__content" :style="getContentStyle">
            <!-- Type -->
            <LabelBase
              class="add-ord-reason-dialog__content__type-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Type") }}</h3>
              </template>
            </LabelBase>
            <DropDownBase
              class="add-ord-reason-dialog__content__type-input"
              v-model="selOrdReasonType"
              :options="ordReasonTypeOption"
              @update:modelValue="updateOrdReasonType"
              @popup="onHandlePopupDropDown"
            />

            <!-- Description -->
            <LabelBase
              class="add-ord-reason-dialog__content__desc-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("Reason") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-ord-reason-dialog__content__desc-input"
              v-model="inputOrdReason.ord_reason_desc"
              :textMax="maxLengthOrdReasonDesc"
            />
          </div>
          <div class="add-ord-reason-dialog__control-row">
            <div class="add-ord-reason-dialog__control-row__add">
              <TextButton
                :text="okButtonText"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickOkButton()"
              />
            </div>
            <div class="add-ord-reason-dialog__control-row__cancel">
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
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import LabelBase from "@/components/label/LabelBase.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";

export default defineComponent({
  name: "AddOrdReasonDialog",

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

    curOrdReason: {
      type: Object as PropType<myTypes.IDbOrdReason>,
      required: true,
    },

    ordReasonType: {
      type: Number as PropType<myTypes.eOrdReasonType>,
      default: myTypes.eOrdReasonType.CREATE,
    },
  },

  emits: ["on-ok", "on-cancel"],

  setup(props, context) {
    const isShowModal = computed(() => {
      if (props.show) {
        initControl();
      }

      return props.show;
    });

    const title = ref("Add OrdReason");

    const maxLengthOrdReasonDesc = ref(64);
    const selOrdReasonType = ref(
      myTypes.parseOrdReason(myTypes.eOrdReasonType.CREATE)
    );

    const popupState = ref(false);
    const onHandlePopupDropDown = (state: boolean): void => {
      popupState.value = state;
    };
    const getContentStyle = computed(() => {
      let styles = { overflow: "auto" };

      if (popupState.value == true) {
        styles.overflow = "visible";
      }

      return styles;
    });

    const inputOrdReason = reactive({
      ord_reason_key: -1,
      ord_reason_type: props.ordReasonType,
      ord_reason_desc: "",
    } as myTypes.IDbOrdReason);

    const ordReasonTypeOption = computed(() => {
      const options: string[] = [];

      options.push(myTypes.parseOrdReason(myTypes.eOrdReasonType.CREATE));
      options.push(myTypes.parseOrdReason(myTypes.eOrdReasonType.CANCEL));

      return options;
    });

    const updateOrdReasonType = (strType: string) => {
      inputOrdReason.ord_reason_type = myTypes.reverseOrdReason(strType);
      selOrdReasonType.value = myTypes.parseOrdReason(
        inputOrdReason.ord_reason_type
      );

      console.log("updateOrdReasonType", inputOrdReason.ord_reason_type);
    };

    const initControl = () => {
      if (props.isModify) {
        title.value = "Modify Order Reason";
        inputOrdReason.ord_reason_key = props.curOrdReason.ord_reason_key;
        inputOrdReason.ord_reason_type = props.curOrdReason.ord_reason_type;
        inputOrdReason.ord_reason_desc = props.curOrdReason.ord_reason_desc;

        okButtonText.value = "Modify";
      } else {
        title.value = "Add Order Reason";

        inputOrdReason.ord_reason_key = -1;
        inputOrdReason.ord_reason_type = props.ordReasonType;
        inputOrdReason.ord_reason_desc = "";

        okButtonText.value = "Add";
      }
    };

    const okButtonText = ref("Add");

    const onClickOkButton = () => {
      const ordReason: myTypes.IDbOrdReason = inputOrdReason;

      context.emit("on-ok", ordReason);
    };

    const onClickCancelButton = () => {
      context.emit("on-cancel");
    };

    // Style
    return {
      isShowModal,
      //
      title,
      maxLengthOrdReasonDesc,
      //
      inputOrdReason,
      selOrdReasonType,
      ordReasonTypeOption,
      updateOrdReasonType,
      onHandlePopupDropDown,
      getContentStyle,
      //
      okButtonText,
      onClickOkButton,
      onClickCancelButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
