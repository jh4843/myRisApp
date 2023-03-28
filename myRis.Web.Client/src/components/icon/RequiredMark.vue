<template>
  <sup class="required-mark" :style="{ fontSize: fontSize }">*</sup>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RequiredMark",

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
