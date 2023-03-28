<template>
  <div class="text-button">
    <div :class="ContainerClassName">
      <button
        :class="buttonClassName + getDisabled"
        :style="{
          fontSize: fontSize,
          fontWeight: fontWeight,
        }"
      >
        {{ $t(text) }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "TextButton",

  props: {
    // Style
    buttonStyle: {
      type: String,
      default: "primary", // "primary" | "sub1" | "sub2" | "sub3";
    },
    fontSize: {
      type: String,
      default: "12px",
    },
    fontWeight: {
      type: String,
      default: "normal",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },

    //contents
    text: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    let ContainerClassName = ref("text-button-container-" + props.buttonStyle);
    let buttonClassName = ref("text-button-button-" + props.buttonStyle);

    const getDisabled = computed(() => {
      return props.isDisabled ? " disabled" : "";
    });

    return {
      ContainerClassName,
      buttonClassName,

      getDisabled,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/button";

button {
  width: 100%;
  height: 100%;
}
</style>
