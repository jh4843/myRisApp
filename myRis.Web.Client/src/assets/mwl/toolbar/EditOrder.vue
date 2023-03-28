<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Edit Order"
    width="20px"
    height="20px"
    :isDisable="isDisable"
    v-model="toggleValue"
    @update:modelValue="onUpdateValue"
  >
    <template v-slot:back-ground>
      <g>
        <path d="M0,0H24V24H0Z" />
      </g>
    </template>
    <template v-slot:default>
      <g>
        <g>
          <path d="M11.59,9.5h-6a.75.75,0,0,1,0-1.5h6a.75.75,0,0,1,0,1.5Z" />
        </g>
        <g>
          <path d="M11.59,12.4h-6a.75.75,0,0,1,0-1.5h6a.75.75,0,0,1,0,1.5Z" />
        </g>
        <g>
          <path d="M11.59,15.4h-6a.75.75,0,0,1,0-1.5h6a.75.75,0,0,1,0,1.5Z" />
        </g>
        <g>
          <path
            d="M3.83,20.75a2,2,0,0,1-1.34-.57,2.41,2.41,0,0,1-.65-1.79v-13A2,2,0,0,1,2.3,4a2,2,0,0,1,1.37-.71h9.81a1.87,1.87,0,0,1,1.86,1.83.91.91,0,0,1,0,.17v2.9a.75.75,0,1,1-1.5,0V5.2a.43.43,0,0,0-.38-.45H3.9a.56.56,0,0,0-.45.19.5.5,0,0,0-.12.37V18.39c0,.69.28.85.51.86h7.8a.75.75,0,0,1,0,1.5H3.83Z" /></g
        ><path
          d="M20.81,3.52a2,2,0,0,0-2.6,1l-4.55,11a.66.66,0,0,0-.06.27l-.11,3.75a.75.75,0,0,0,.47.72.69.69,0,0,0,.28.05.77.77,0,0,0,.56-.25l2.55-2.89a.77.77,0,0,0,.14-.21L22,6a1.43,1.43,0,0,0,.09-.27A1.85,1.85,0,0,0,20.81,3.52Zm-.55,1.39.14,0a.36.36,0,0,1,.25.46l-.22.52-1-.39.16-.39A.53.53,0,0,1,20.26,4.91ZM15.1,16v0l1,.38-1.05,1.18Zm1.59-1-1-.39,3.17-7.68,1,.39Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "EditOrder",

  components: {
    SvgBaseIcon,
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    isDisable: {
      type: Boolean,
      default: false,
    },

    isToggleType: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const toggleValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      () => {
        toggleValue.value = props.modelValue;
      }
    );

    const onUpdateValue = (val) => {
      context.emit("update:modelValue", val);
    };

    return {
      toggleValue,
      onUpdateValue,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/view/mwl";
</style>
