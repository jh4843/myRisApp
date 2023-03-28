<template>
  <div class="text-inputbox">
    <div
      class="text-inputbox-container"
      :class="[inputStyle, { disabled: isDisabled, readonly: isReadonly }]"
      @mouseenter="onHandleMouseEnter()"
      @mouseleave="onHandleMouseLeave()"
    >
      <input
        class="text-inputbox-input"
        :class="[inputStyle, { disabled: isDisabled, readonly: isReadonly }]"
        :type="inputType"
        :value="modelValue"
        :disabled="isDisabled || isReadonly"
        :placeholder="transPlaceHolder"
        :max="numMax"
        :min="numMin"
        :maxlength="textMax"
        :minlength="textMin"
        @focus="onHandleFocus()"
        @blur="onHandleBlur()"
        @keyup="onHandleTextChanged()"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <SvgBaseIcon
        class="text-inputbox-clear-icon"
        v-show="isMouseOver"
        @click="onHanlderClear()"
        viewBox="0, 0, 8.5, 8.5"
        width="10px"
        height="10px"
      >
        <template v-slot:default>
          <EditClear />
        </template>
      </SvgBaseIcon>
    </div>
    <div v-show="isShowExpandTable" class="text-inputbox__expand">
      <PopupTable
        :style="{ width: expandWidth, height: extDisplayMaxHeight }"
        :columns="extTableCols"
        :rows="extTableRows"
        :isShowHeader="isShowExpandTableHeader"
        @onRowClick="onHandlerExpandRowClicked"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  watch,
  onMounted,
  onUnmounted,
} from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import EditClear from "@/assets/etc/EditClear.vue";
import PopupTable from "@/components/table/PopupTable.vue";
import * as myTypes from "@/types";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "TextInputBox",

  components: {
    SvgBaseIcon,
    EditClear,
    PopupTable,
  },

  emits: [
    "on-text-changed",
    "on-row-click",
    "update:modelValue",
    "blur",
    "focus",
    "popup",
  ],

  props: {
    // Binded Text
    modelValue: {
      type: [String, Number],
      default: "",
    },
    extTableCols: {
      type: Array as PropType<myTypes.IPopupTableColumn[]>,
      default: () => [],
    },
    extTableRows: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    extDisplayMaxHeight: {
      type: String,
      default: "84px",
    },
    messsage: {
      type: String,
      default: "",
    },
    inputType: {
      type: String, // "text" | "number" | "password" | "tel"
      default: "text",
    },
    numMax: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER,
    },
    numMin: {
      type: Number,
      default: Number.MIN_SAFE_INTEGER,
    },
    textMax: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER,
    },
    textMin: {
      type: Number,
      default: 0,
    },
    expandWidth: {
      type: String,
      default: "100%",
    },
    // Style
    inputStyle: {
      type: String,
      default: "primary", // "primary" | "table";
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isReadonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },

  setup(props, context) {
    const isMouseOver = ref(false);
    const isShowExpandTable = ref(false);
    const isShowExpandTableHeader = ref(true);
    const isFocused = ref(false);

    const { t } = useI18n({
      inheritLocale: true,
      warnHtmlMessage: false,
    });

    const transPlaceHolder = ref(t(props.placeholder));

    watch(
      () => props.extTableRows,
      (newVal) => {
        if (newVal === undefined) {
          isShowExpandTable.value = false;
        }

        if (newVal.length > 0 && isFocused.value) {
          isShowExpandTable.value = true;
        } else {
          isShowExpandTable.value = false;
        }

        context.emit("popup", isShowExpandTable.value);
      }
    );

    const clickDocument = () => {
      if (isShowExpandTable.value) {
        isShowExpandTable.value = false;
      }
    };

    const onHanlderClear = () => {
      context.emit("update:modelValue", "");
      context.emit("on-text-changed");
    };

    const onHandleMouseEnter = () => {
      if (!props.isDisabled && !props.isReadonly) isMouseOver.value = true;
    };

    const onHandleMouseLeave = () => {
      isMouseOver.value = false;
    };

    const onHandleFocus = () => {
      isFocused.value = true;
      context.emit("focus");
    };

    const onHandleBlur = () => {
      isFocused.value = false;
      context.emit("blur");
      if (props.inputType === "number") {
        let numVal = Number(props.modelValue);

        if (numVal > props.numMax) {
          context.emit("update:modelValue", props.numMax);
        } else if (numVal < props.numMin) {
          context.emit("update:modelValue", props.numMin);
        }
      }
    };

    onMounted(() => {
      document.addEventListener("click", clickDocument);
    });

    onUnmounted(() => {
      document.removeEventListener("click", clickDocument);
    });

    const onHandleTextChanged = () => {
      context.emit("on-text-changed");
    };

    const onHandlerExpandRowClicked = (params) => {
      context.emit("on-row-click", params);
    };

    return {
      transPlaceHolder,

      isMouseOver,
      isShowExpandTable,
      isShowExpandTableHeader,

      onHanlderClear,
      onHandleMouseEnter,
      onHandleMouseLeave,
      onHandleFocus,
      onHandleBlur,
      onHandleTextChanged,
      onHandlerExpandRowClicked,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/input";
</style>
