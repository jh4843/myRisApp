<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Delete Order"
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
          d="M9,10a.75.75,0,0,0-.75.75v6.11a.75.75,0,0,0,1.5,0V10.74A.75.75,0,0,0,9,10Z"
        />
        <path
          d="M12,10a.75.75,0,0,0-.75.75v6.11a.75.75,0,0,0,1.5,0V10.74A.75.75,0,0,0,12,10Z"
        />
        <path
          d="M15,10a.75.75,0,0,0-.75.75v6.11a.75.75,0,0,0,1.5,0V10.74A.75.75,0,0,0,15,10Z"
        />
        <path
          d="M21.05,5.24H17.29l-.07-1.09A2.17,2.17,0,0,0,15.05,2H8.93a2.16,2.16,0,0,0-1.54.63,2.12,2.12,0,0,0-.63,1.49L6.7,5.24H3a.75.75,0,0,0,0,1.5H4.23l.83,13.11A2.17,2.17,0,0,0,7.23,22h9.71a2.16,2.16,0,0,0,2.17-2.12l.67-13.15h1.27a.75.75,0,0,0,0-1.5ZM8.26,4.15a.68.68,0,0,1,.19-.47.66.66,0,0,1,.48-.19h6.12a.68.68,0,0,1,.67.72l.07,1H8.2Zm9.35,15.7a.66.66,0,0,1-.67.66H7.23a.68.68,0,0,1-.67-.71L5.73,6.74H18.28Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "DeleteOrder",

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
