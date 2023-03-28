<template>
  <div :class="ContainerClassName">
    <button
      :class="buttonClassName"
      :style="{
        width: width,
        height: height,
      }"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SlotButton",

  props: {
    // Style
    buttonStyle: {
      type: String,
      default: "primary", // "primary" | "sub1" | "sub2";
    },
    width: {
      type: String,
      default: "auto",
    },
    height: {
      type: String,
      default: "auto",
    },
  },

  setup(props) {
    let ContainerClassName = ref("slot-button-container-" + props.buttonStyle);
    let buttonClassName = ref("slot-button-button-" + props.buttonStyle);

    return {
      ContainerClassName,
      buttonClassName,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/button";
</style>
