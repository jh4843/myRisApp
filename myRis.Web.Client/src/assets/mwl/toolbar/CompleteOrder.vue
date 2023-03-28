<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Complete Order"
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
          <path d="M12.86,9.5h-6a.75.75,0,1,1,0-1.5h6a.75.75,0,0,1,0,1.5Z" />
        </g>
        <g>
          <path d="M12,12.4H6.86a.75.75,0,0,1,0-1.5H12a.75.75,0,0,1,0,1.5Z" />
        </g>
        <g>
          <path d="M9.5,15.3H6.86a.75.75,0,1,1,0-1.5H9.5a.75.75,0,0,1,0,1.5Z" />
        </g>
        <g>
          <path
            d="M5.11,20.75a2,2,0,0,1-1.34-.57,2.38,2.38,0,0,1-.66-1.79v-13A2,2,0,0,1,5,3.26h9.81a1.87,1.87,0,0,1,1.85,1.83,1,1,0,0,1,0,.17v7.51a.75.75,0,0,1-1.5,0V5.2a.41.41,0,0,0-.38-.45H5.18a.55.55,0,0,0-.57.56V18.39c0,.69.28.85.52.86h7.8a.75.75,0,0,1,0,1.5H5.11Z"
          />
        </g>
        <g>
          <path
            d="M15.55,19h0a.73.73,0,0,1-.57-.26l-2.69-3.2a.75.75,0,0,1,.09-1.06.76.76,0,0,1,1.06.09l2.11,2.52,4-4.77a.75.75,0,0,1,1.06-.09.77.77,0,0,1,.09,1.06l-4.59,5.45A.77.77,0,0,1,15.55,19Z"
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
  name: "CompleteOrder",

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
