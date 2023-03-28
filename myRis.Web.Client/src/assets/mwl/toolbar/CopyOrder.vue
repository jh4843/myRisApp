<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Copy Order"
    width="20px"
    height="20px"
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
          d="M19.33,1.93H8.72A2.74,2.74,0,0,0,6,4.67V6H4.67A2.74,2.74,0,0,0,1.93,8.72V19.33a2.74,2.74,0,0,0,2.74,2.74H15.28A2.74,2.74,0,0,0,18,19.33V18h1.32a2.74,2.74,0,0,0,2.74-2.74V4.67A2.74,2.74,0,0,0,19.33,1.93Zm-2.82,17.4a1.24,1.24,0,0,1-1.23,1.24H4.67a1.25,1.25,0,0,1-1.24-1.24V8.72A1.24,1.24,0,0,1,4.67,7.49H15.28a1.23,1.23,0,0,1,1.23,1.23Zm4.06-4.06a1.25,1.25,0,0,1-1.24,1.24H18V8.72A2.74,2.74,0,0,0,15.28,6H7.49V4.67A1.24,1.24,0,0,1,8.72,3.43H19.33a1.25,1.25,0,0,1,1.24,1.24Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "CopyOrder",

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
