<template>
  <span class="arrow-mark" :style="{ fontSize: fontSize }">▶</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ArrowMark",

  props: {
    fontSize: {
      type: String,
      default: "auto",
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/icon";
</style>
