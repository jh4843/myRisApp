<template>
  <svg
    class="svg-base-icon"
    :class="{ disabled: isDisable, hover: isHover, selected: isSelected }"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="transIconName"
    role="img"
    @mouseleave="mouseLeaveHandler"
    @mouseover="mouseOverHandler"
    @mousedown="clickHandler"
    @mouseup="mouseOverHandler"
  >
    <title :id="iconName" lang="en">{{ transIconName }}</title>
    <g class="svg-base-icon__background" :fill="getBkColor">
      <slot name="back-ground" />
    </g>
    <g class="svg-base-icon__icon" :fill="getIconColor">
      <slot />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

enum eSvgBaseState {
  Normal = 0,
  Hover,
  Selected,
  Disabled,
}

export default defineComponent({
  name: "SvgBaseIcon",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    viewBox: { type: String, default: "0 0 24 24" },
    iconName: { type: String, default: "" },
    width: { type: [Number, String], default: "100%" },
    height: { type: [Number, String], default: "100%" },
    isDisable: { type: Boolean, default: false },
    isToggleType: { type: Boolean, default: false },
    isReadOnly: { type: Boolean, default: false },

    iconColor: { type: String, default: "currentColor" },
    iconColorHover: { type: String, default: undefined },
    iconColorSelect: { type: String, default: undefined },
    iconColorDisable: { type: String, default: undefined },

    bkColor: { type: String, default: "transparent" },
    bkColorHover: { type: String, default: undefined },
    bkColorSelect: { type: String, default: undefined },
    bkColorDisable: { type: String, default: undefined },
  },

  setup(props, context) {
    const svgState = ref(
      props.isDisable ? eSvgBaseState.Disabled : eSvgBaseState.Normal
    );

    const { t } = useI18n({
      inheritLocale: true,
      warnHtmlMessage: false,
    });

    const transIconName = ref(t(props.iconName));

    const isHover = computed(() => {
      if (svgState.value == eSvgBaseState.Hover) {
        return true;
      }
      return false;
    });

    const isSelected = computed(() => {
      if (svgState.value == eSvgBaseState.Selected) {
        return true;
      }
      return false;
    });

    watch(
      () => props.modelValue,
      () => {
        if (props.isDisable) return;

        if (props.isToggleType) {
          if (props.modelValue) {
            svgState.value = eSvgBaseState.Selected;
          } else {
            svgState.value = eSvgBaseState.Normal;
          }
        }
      }
    );

    watch(
      () => svgState,
      () => {
        const stat = svgState.value == eSvgBaseState.Selected ? true : false;
        context.emit("update:modelValue", stat);
      }
    );

    const getBkColor = computed(() => {
      if (props.isDisable) return props.bkColorDisable;
      if (props.isReadOnly) return props.bkColor;

      let res = props.bkColor;

      switch (svgState.value) {
        case eSvgBaseState.Normal:
          res = props.bkColor;
          break;
        case eSvgBaseState.Hover:
          if (props.bkColorHover != undefined) {
            res = props.bkColorHover;
          }
          break;
        case eSvgBaseState.Selected:
          if (props.bkColorSelect != undefined) {
            res = props.bkColorSelect;
          }
          break;
      }

      return res;
    });

    const getIconColor = computed(() => {
      if (props.isDisable) return props.iconColorDisable;
      if (props.isReadOnly) return props.iconColor;

      let res = props.iconColor;

      switch (svgState.value) {
        case eSvgBaseState.Normal:
          res = props.iconColor;
          break;
        case eSvgBaseState.Hover:
          if (props.iconColorHover != undefined) {
            res = props.iconColorHover;
          }
          break;
        case eSvgBaseState.Selected:
          if (props.iconColorSelect != undefined) {
            res = props.iconColorSelect;
          }
          break;
      }

      return res;
    });

    const mouseLeaveHandler = () => {
      if (props.isDisable) {
        svgState.value = eSvgBaseState.Disabled;
      } else if (!props.isToggleType) {
        svgState.value = eSvgBaseState.Normal;
      }

      //iconColor.value = props.iconColor;
      //bkColor.value = props.bkColor;
    };

    const mouseOverHandler = () => {
      if (props.isDisable) {
        svgState.value = eSvgBaseState.Disabled;
      } else if (props.isReadOnly) {
        svgState.value = eSvgBaseState.Normal;
      } else if (!props.isToggleType) {
        svgState.value = eSvgBaseState.Hover;
      }
    };

    const clickHandler = () => {
      if (props.isDisable) {
        svgState.value = eSvgBaseState.Disabled;
      } else if (props.isReadOnly) {
        svgState.value = eSvgBaseState.Normal;
      } else if (!props.isToggleType) {
        svgState.value = eSvgBaseState.Selected;
      }
    };

    const initInstance = () => {
      if (props.isDisable) return;

      if (props.isToggleType) {
        if (props.modelValue) {
          svgState.value = eSvgBaseState.Selected;
        }
      }
    };

    onMounted(initInstance);

    return {
      transIconName,
      isHover,
      isSelected,

      getBkColor,
      getIconColor,

      mouseLeaveHandler,
      mouseOverHandler,
      clickHandler,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/asset/svgicons.scss";
</style>
