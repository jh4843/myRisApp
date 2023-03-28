<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Export"
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
          d="M21.08,14.27a.75.75,0,0,0-.75.75v4.35H3.67V15a.75.75,0,0,0-1.5,0v5.1a.75.75,0,0,0,.75.75H21.08a.75.75,0,0,0,.75-.75V15A.76.76,0,0,0,21.08,14.27Z"
        />
        <path
          d="M8.45,8.49l2.8-2.8V16.42a.75.75,0,0,0,1.5,0V5.68l2.81,2.81a.71.71,0,0,0,.53.22.74.74,0,0,0,.53-.22.75.75,0,0,0,0-1.06L12.53,3.34l-.16-.1-.08-.06a.83.83,0,0,0-.58,0,1.1,1.1,0,0,0-.21.14l0,0L7.39,7.43a.74.74,0,0,0,0,1.06A.75.75,0,0,0,8.45,8.49Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "Export",

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
