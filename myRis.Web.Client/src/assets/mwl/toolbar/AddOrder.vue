<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Add Order"
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
        <path d="M13.06,8h-6a.75.75,0,1,0,0,1.5h6a.75.75,0,1,0,0-1.5Z" />
        <path
          d="M13.81,11.65a.75.75,0,0,0-.75-.75h-6a.75.75,0,0,0,0,1.5h6A.75.75,0,0,0,13.81,11.65Z"
        />
        <path d="M7.06,13.8a.75.75,0,1,0,0,1.5H9.7a.75.75,0,0,0,0-1.5Z" />
        <path
          d="M13.13,19.25H5.33c-.23,0-.51-.17-.51-.86V5.31a.55.55,0,0,1,.57-.56h9.56c.2,0,.37.16.37.45V9a.75.75,0,1,0,1.5,0V5.25a1,1,0,0,0,0-.17A1.88,1.88,0,0,0,15,3.25H5.15A2,2,0,0,0,3.32,5.38v13A2.41,2.41,0,0,0,4,20.18a2,2,0,0,0,1.34.57h7.82a.75.75,0,1,0,0-1.5Z"
        />
        <path
          d="M19.94,14.78H16.82V11.65a.75.75,0,1,0-1.5,0v3.13H12.19a.75.75,0,0,0,0,1.5h3.13V19.4a.75.75,0,0,0,1.5,0V16.28h3.12a.75.75,0,0,0,0-1.5Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "AddOrder",

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
