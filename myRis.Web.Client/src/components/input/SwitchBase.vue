<template>
  <div class="switch-base">
    <div class="switch-base__control">
      <div
        class="switch-base__control__slider"
        :class="{ on: modelValue }"
        @click="onChangeSel"
      >
        <div class="switch-base__control__slider__bar" />
        <div class="switch-base__control__slider__dot" />
      </div>
    </div>
    <div class="switch-base__label">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SwitchBase",

  emits: ["on-text-changed", "update:modelValue"],

  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const onChangeSel = () => {
      console.log("(Switch) onChangeSel", props.modelValue);
      context.emit("update:modelValue", !props.modelValue);
    };

    return {
      onChangeSel,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/input";
</style>
