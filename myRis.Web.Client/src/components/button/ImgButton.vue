<template>
  <div :class="ContainerClass">
    <button
      :class="buttonClass"
      :style="{
        width: width,
        height: height,
      }"
    >
      <div :class="ImgBackgroundClass">
        <img
          :src="imgPath"
          :alt="title"
          :title="title"
          :style="{
            width: imgWidth,
            height: imgHeight,
          }"
        />
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ImgButton",

  props: {
    // Style
    buttonStyle: {
      type: String,
      default: "primary", // "primary" | "sub1" | "sub2";
    },
    backgroundStyle: {
      type: String,
      default: "rect", // "rect" | "circle"
    },
    width: {
      type: String,
      default: "auto",
    },
    height: {
      type: String,
      default: "auto",
    },
    margin: {
      type: Number,
      default: 3,
    },

    //contents
    title: {
      type: String,
      default: "",
    },
    imgPath: {
      type: String,
      default: "",
    },
    imgWidth: {
      type: String,
      default: "0px",
    },
    imgHeight: {
      type: String,
      default: "0px",
    },
  },

  setup(props) {
    let ContainerClass = ref("img-button-container-" + props.buttonStyle);
    let buttonClass = ref("img-button-button-" + props.buttonStyle);

    let ImgBackgroundClass = ref(
      "img-button-img-background-" +
        props.backgroundStyle +
        "-" +
        props.buttonStyle
    );

    return {
      ContainerClass,
      buttonClass,
      ImgBackgroundClass,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/button";
</style>
