<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Cancel Order"
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
        <path d="M12.71,8h-6a.75.75,0,0,0,0,1.5h6a.75.75,0,0,0,0-1.5Z" />
        <path
          d="M11.81,10.9H6.71a.75.75,0,1,0,0,1.5h5.1a.75.75,0,0,0,0-1.5Z"
        /><path
          d="M11.74,13.8h-5a.75.75,0,0,0,0,1.5h5a.75.75,0,0,0,0-1.5Z"
        /><path
          d="M11.93,19.25H5c-.24,0-.52-.17-.52-.86V5.31c0-.28.18-.53.56-.56h9.56A.41.41,0,0,1,15,5.2V9.85a.75.75,0,1,0,1.5,0V5.08A1.87,1.87,0,0,0,14.6,3.25H4.8A2,2,0,0,0,3,5.38v13a2.41,2.41,0,0,0,.65,1.79A2,2,0,0,0,5,20.75h7a.75.75,0,0,0,0-1.5Z"
        /><path
          d="M18.36,15.25l2.47-2.47a.75.75,0,0,0-1.06-1.06L17.3,14.19l-2.47-2.47a.75.75,0,0,0-1.06,1.06l2.47,2.47-2.47,2.47a.75.75,0,0,0,0,1.06.79.79,0,0,0,.53.22.75.75,0,0,0,.53-.22l2.47-2.47,2.47,2.47a.77.77,0,0,0,.53.22.79.79,0,0,0,.53-.22.75.75,0,0,0,0-1.06Z"
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
