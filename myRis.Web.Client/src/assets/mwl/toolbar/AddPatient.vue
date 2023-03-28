<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Add Patient"
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
          d="M20.37,16.57H17.24V13.44a.75.75,0,0,0-1.5,0v3.13H12.61a.75.75,0,0,0,0,1.5h3.13v3.12a.75.75,0,0,0,1.5,0V18.07h3.13a.75.75,0,0,0,0-1.5Z"
        /><path
          d="M13.52,20.44H6a1,1,0,0,1-.79-.32,4.61,4.61,0,0,1-.79-2.84V17a5.66,5.66,0,0,1,5.35-5.88,5.1,5.1,0,0,1,3.67,1.6.75.75,0,0,0,1.09-1,6.41,6.41,0,0,0-1.8-1.34,4.51,4.51,0,1,0-5.29-.23,7.15,7.15,0,0,0-4.52,6.92v.21c0,.62.07,2.73,1.23,3.89A2.53,2.53,0,0,0,6,21.94h7.55a.75.75,0,0,0,0-1.5ZM10.2,3.65a3,3,0,1,1-3,3A3,3,0,0,1,10.2,3.65Z"
        />
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "AddPatient",

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
