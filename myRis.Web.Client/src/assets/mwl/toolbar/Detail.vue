<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Detail"
    width="20px"
    height="20px"
    :isDisable="isDisable"
    :isToggleType="isToggleType"
    v-model="toggleValue"
    @update:modelValue="onUpdateValue">
    <template v-slot:back-ground>
      <g>
        <path d="M0,0H24V24H0Z" />
      </g>
    </template>
    <template v-slot:default>
      <g>
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18.5A8.5,8.5,0,1,1,20.5,12,8.51,8.51,0,0,1,12,20.5Z" />
        <path d="M12,10.5a.76.76,0,0,0-.75.75V16.5a.75.75,0,0,0,1.5,0V11.25A.76.76,0,0,0,12,10.5Z" />
        <circle cx="12" cy="8" r="1" />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "Detail",

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
