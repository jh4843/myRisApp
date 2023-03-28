<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="SPS base Table"
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
        <g>
          <path
            d="M20,8.5H4a1,1,0,0,1-1-1v-3a1,1,0,0,1,1-1H20a1,1,0,0,1,1,1v3A1,1,0,0,1,20,8.5ZM4.5,7h15V5H4.5Z"
          />
        </g>
        <g>
          <path
            d="M20,14.5H4a1,1,0,0,1-1-1v-3a1,1,0,0,1,1-1H20a1,1,0,0,1,1,1v3A1,1,0,0,1,20,14.5ZM4.5,13h15V11H4.5Z"
          />
        </g>
        <g>
          <path
            d="M20,20.5H4a1,1,0,0,1-1-1v-3a1,1,0,0,1,1-1H20a1,1,0,0,1,1,1v3A1,1,0,0,1,20,20.5ZM4.5,19h15V17H4.5Z"
          />
        </g>
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "TableSpsBase",

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
