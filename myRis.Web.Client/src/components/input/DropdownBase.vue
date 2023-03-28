<template>
  <div
    class="dropdown-base"
    :class="{ toggled: getShowExpandItems }"
    @blur="setShowExpandItems(false)"
  >
    <div class="dropdown-base__container">
      <div
        class="dropdown-base__label"
        :class="{ disabled: isDisabled, 'is-none-border': isNoneBorder }"
      >
        <input
          v-if="isEditable"
          class="dropdown-base__label__input"
          placeholder="placeholder"
        />
        <span v-else-if="modelValue" class="dropdown-base__label__text">{{
          $t(modelValue.toString())
        }}</span>
        <span v-else class="dropdown-base__label__placeholder">{{
          $t(placeholder.toString())
        }}</span>

        <i class="expand-icon" v-show="!isDisabled">
          <SvgBaseIcon
            @click="setShowExpandItems(!isExpanded)"
            viewBox="0, 0, 9.42, 5.46"
          >
            <template v-slot:default>
              <DownArrow />
            </template>
          </SvgBaseIcon>
        </i>
      </div>

      <div
        class="dropdown-base__expand"
        v-show="getShowExpandItems"
        :style="optionContainerStyle"
      >
        <div
          v-for="(option, index) in getFilteredOptions"
          :key="'option-' + index"
          class="dropdown-base__expand__option"
          :style="optionStyle"
          @click="setSelectOption(option)"
        >
          {{ $t(option.toString()) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import DownArrow from "@/assets/etc/DownArrow.vue";

export default defineComponent({
  name: "DropDownBase",

  components: {
    SvgBaseIcon,
    DownArrow,
  },

  emits: ["on-text-changed", "update:modelValue", "popup"],

  props: {
    modelValue: {
      type: String,
      default: "",
    },

    options: {
      type: Array as PropType<string[] | number[]>,
      required: true,
    },

    placeholder: {
      type: String,
      default: "",
    },

    isNoneBorder: {
      type: Boolean,
      default: false,
    },

    isEditable: {
      type: Boolean,
      default: false,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },

    maxItemCount: {
      type: Number,
      default: 5,
    },

    optionItemHeight: {
      type: Number,
      default: 25,
    },

    optionItemHeightUnit: {
      type: String,
      default: "px",
    },
  },

  setup(props, context) {
    const isExpanded = ref(false);
    const isClickedExpandButton = ref(false);

    const optionFilterWords = ref("");

    const getFilteredOptions = computed(() => {
      if (optionFilterWords.value == undefined || optionFilterWords.value == "")
        return props.options;

      let filteredOptions: Array<number | string> = [];
      const filterWord = optionFilterWords.value.toLowerCase();

      for (const option of props.options) {
        let stringValue = option.toString();

        if (stringValue.toLowerCase().includes(filterWord)) {
          filteredOptions.push(option);
        }
      }

      return filteredOptions;
    });

    const optionContainerStyle = computed(() => {
      let styles = { height: "125px" };

      //
      if (props.options.length > props.maxItemCount) {
        styles.height =
          props.optionItemHeight * props.maxItemCount +
          5 +
          props.optionItemHeightUnit;
      }

      // Return the styles
      return styles;
    });

    const optionStyle = computed(() => {
      let styles = { minHeight: "125px" };

      //
      styles.minHeight =
        props.optionItemHeight.toString() + props.optionItemHeightUnit;

      return styles;
    });

    const setSelectOption = (newVal: string | number) => {
      if (newVal === "*") {
        newVal = "";
      }

      const oldVal = props.modelValue;

      context.emit("update:modelValue", newVal, oldVal);
      setShowExpandItems(false);
      context.emit("on-text-changed", newVal);
    };

    const keyupMonitor = (event) => {
      if (event.key == "Escape") {
        setShowExpandItems(false);
      } else if (event.key == "Backspace") {
        if (optionFilterWords.value.length > 0) {
          const str = optionFilterWords.value;
          optionFilterWords.value = str.slice(0, -1);
        }
      } else {
        optionFilterWords.value += event.key;
      }
    };

    const clickDocument = () => {
      if (isExpanded.value && !isClickedExpandButton.value) {
        isExpanded.value = false;
      }

      isClickedExpandButton.value = false;
    };

    const setShowExpandItems = (isShow: boolean) => {
      isExpanded.value = isShow;
      isClickedExpandButton.value = true;

      optionFilterWords.value = "";
    };

    const getShowExpandItems = computed(() => {
      context.emit("popup", isExpanded.value);
      return isExpanded.value;
    });

    onMounted(() => {
      document.addEventListener("click", clickDocument);
      document.addEventListener("keyup", keyupMonitor);
    });

    onUnmounted(() => {
      document.removeEventListener("click", clickDocument);
      document.removeEventListener("keyup", keyupMonitor);
    });

    return {
      isExpanded,
      isClickedExpandButton,

      getFilteredOptions,
      optionContainerStyle,
      optionStyle,
      setSelectOption,
      setShowExpandItems,
      getShowExpandItems,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/input";
</style>
