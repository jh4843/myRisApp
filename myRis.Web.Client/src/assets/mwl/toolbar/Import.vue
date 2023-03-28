<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Import"
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
          d="M21.07,19.38H2.93a.75.75,0,1,0,0,1.5H21.07a.75.75,0,0,0,0-1.5Z"
        />
        <path
          d="M11.47,17a.75.75,0,0,0,1.06,0l4.09-4.08a.75.75,0,0,0,0-1.06.74.74,0,0,0-1.06,0l-2.81,2.8V3.87a.75.75,0,0,0-1.5,0V14.61l-2.8-2.8a.75.75,0,0,0-1.06,1.06Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "Import",

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
