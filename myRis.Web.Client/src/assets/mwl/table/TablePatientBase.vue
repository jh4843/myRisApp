<template>
  <SvgBaseIcon
    class="toolbar-button__Icon"
    :class="{ disabled: isDisable }"
    iconName="Patient base table"
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
          d="M8,11.16a5.1,5.1,0,0,1,3.67,1.6.75.75,0,0,0,1.06,0,.76.76,0,0,0,0-1.06A6.55,6.55,0,0,0,11,10.39a4.52,4.52,0,1,0-5.3-.23,7.15,7.15,0,0,0-4.52,6.92v.21c0,.62.07,2.73,1.23,3.89a2.53,2.53,0,0,0,1.85.76h8a.75.75,0,1,0,0-1.5h-8a1,1,0,0,1-.79-.32,4.6,4.6,0,0,1-.79-2.83V17A5.66,5.66,0,0,1,8,11.16Zm.46-7.51a3,3,0,1,1-3,3A3,3,0,0,1,8.45,3.65Z"
        />
        <g>
          <path
            d="M20.86,21.94h-5a2,2,0,0,1-2-2v-8a2,2,0,0,1,2-2h5a2,2,0,0,1,2,2v8A2,2,0,0,1,20.86,21.94Zm-5-10.5a.51.51,0,0,0-.5.5v8a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5v-8a.5.5,0,0,0-.5-.5Z"
          />
        </g>
        <g>
          <g>
            <g>
              <path
                d="M19.51,14.2H16.77a.75.75,0,0,1,0-1.5h2.74a.75.75,0,0,1,0,1.5Z"
              />
            </g>
            <g>
              <path
                d="M19.51,16.69H16.77a.75.75,0,0,1,0-1.5h2.74a.75.75,0,0,1,0,1.5Z"
              />
            </g>
            <g>
              <path
                d="M19.51,19.19H16.77a.75.75,0,0,1,0-1.5h2.74a.75.75,0,0,1,0,1.5Z"
              />
            </g> </g
        ></g>
      </g>
    </template>
  </SvgBaseIcon>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";

export default defineComponent({
  name: "TablePatientBase",

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
