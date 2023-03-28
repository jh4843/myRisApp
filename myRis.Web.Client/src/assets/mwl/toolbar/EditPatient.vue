<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Edit Patient"
    width="20px"
    height="20px"
    :isDisable="isDisable"
    :isToggleType="isToggleType"
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
        <path
          d="M11.65,10.39a4.52,4.52,0,1,0-5.29-.23,7.15,7.15,0,0,0-4.52,6.92v.21a5.9,5.9,0,0,0,1.22,3.89,2.57,2.57,0,0,0,1.86.76h6.67a.75.75,0,0,0,0-1.5H4.92a1,1,0,0,1-.79-.32,4.49,4.49,0,0,1-.79-2.84V17a5.66,5.66,0,0,1,5.35-5.88,5.11,5.11,0,0,1,3.67,1.6.75.75,0,0,0,1.06,0,.75.75,0,0,0,0-1.06A6.55,6.55,0,0,0,11.65,10.39ZM9.15,3.65a3,3,0,1,1-3,3A3,3,0,0,1,9.15,3.65Z"
        /><path
          d="M20.81,5.15a2,2,0,0,0-2.61,1l-4.54,11a.58.58,0,0,0-.06.26l-.11,3.76A.76.76,0,0,0,14,22a.87.87,0,0,0,.28.05.77.77,0,0,0,.56-.25l2.55-2.89a.77.77,0,0,0,.14-.21L22,7.63a1.43,1.43,0,0,0,.09-.27A1.86,1.86,0,0,0,20.81,5.15Zm-.55,1.4.14,0a.36.36,0,0,1,.25.46l-.22.52-1-.39.16-.39A.53.53,0,0,1,20.26,6.55ZM15.1,17.67v0l1,.38-1.05,1.18Zm1.59-1-1-.39,3.17-7.68,1,.39Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "EditPatient",

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
