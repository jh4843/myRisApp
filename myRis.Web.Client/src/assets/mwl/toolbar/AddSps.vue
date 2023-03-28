<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Add SPS"
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
          d="M21.92,16.89H18.5V13.47a.75.75,0,1,0-1.5,0v3.42H13.58a.75.75,0,1,0,0,1.5H17v3.42a.75.75,0,1,0,1.5,0V18.39h3.42a.75.75,0,0,0,0-1.5Z"
        />
        <path
          d="M9.63,14.81h-3a1.32,1.32,0,0,0-1.31,1.32v.75H2.83V5H5.31v.76A1.32,1.32,0,0,0,6.62,7.09H18.46a1.32,1.32,0,0,0,1.32-1.32v-3a1.32,1.32,0,0,0-1.32-1.32H6.62A1.32,1.32,0,0,0,5.31,2.76v.75H2.08a.75.75,0,0,0-.75.75V17.63a.74.74,0,0,0,.75.75H5.31v.76a1.32,1.32,0,0,0,1.31,1.32h3A1.32,1.32,0,0,0,11,19.14v-3A1.32,1.32,0,0,0,9.63,14.81ZM6.81,2.94H18.28V5.59H6.81ZM9.45,19H6.81V16.31H9.45Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "AddSps",

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
