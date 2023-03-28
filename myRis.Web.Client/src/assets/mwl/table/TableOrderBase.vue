<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Order base table"
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
          d="M11.91,9.08H6.05a.75.75,0,1,1,0-1.5h5.86a.75.75,0,0,1,0,1.5Z"
        />
      </g>
      <g>
        <path
          d="M11.91,12.4H6.05a.75.75,0,1,1,0-1.5h5.86a.75.75,0,0,1,0,1.5Z"
        />
      </g>
      <g>
        <path
          d="M11.81,15.71H6.05a.75.75,0,0,1,0-1.5h5.76a.75.75,0,1,1,0,1.5Z"
        />
      </g>
      <g>
        <path
          d="M4.13,3.65H15.05a.52.52,0,0,1,.38.15.58.58,0,0,1,.17.37V5.6a.75.75,0,0,0,1.5,0V4.33a1.28,1.28,0,0,0,0-.19,2.06,2.06,0,0,0-2.07-2H4.16a1.31,1.31,0,0,0-.28,0,2.17,2.17,0,0,0-2,2.32V19.36a2.67,2.67,0,0,0,.71,2,2.17,2.17,0,0,0,1.46.61H12a.75.75,0,0,0,0-1.5H4.07c-.26,0-.69-.16-.69-1.08V4.41A.7.7,0,0,1,4,3.65Z"
        />
      </g>
      <g>
        <path
          d="M21.13,11.94H14.81a1,1,0,0,1-1-1V9.1a1,1,0,0,1,1-1h6.32a1,1,0,0,1,1,1v1.84A1,1,0,0,1,21.13,11.94Zm-5.82-1.5h5.32V9.6H15.31Z"
        />
      </g>
      <g>
        <path
          d="M21.13,16.94H14.81a1,1,0,0,1-1-1V14.1a1,1,0,0,1,1-1h6.32a1,1,0,0,1,1,1v1.84A1,1,0,0,1,21.13,16.94Zm-5.82-1.5h5.32V14.6H15.31Z"
        />
      </g>
      <g>
        <path
          d="M21.13,21.94H14.81a1,1,0,0,1-1-1V19.1a1,1,0,0,1,1-1h6.32a1,1,0,0,1,1,1v1.84A1,1,0,0,1,21.13,21.94Zm-5.82-1.5h5.32V19.6H15.31Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "TableOrderBase",

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
