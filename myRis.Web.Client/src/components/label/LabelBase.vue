<template>
  <div class="label-base">
    <div class="label-base__container">
      <div class="label-base__mark" v-if="markType == 'none'"></div>
      <div class="label-base__mark" v-else-if="markType == 'space'">&emsp;</div>
      <div class="label-base__mark" v-else-if="markType == 'required'">
        <RequiredMark fontSize="16px" />
      </div>
      <div class="label-base__mark" v-else-if="markType == 'arrow'">
        <ArrowMark />
      </div>
      <div class="label-base__label">
        {{ $t(displayText) }}<slot name="label" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import * as myTypes from "@/types";
import RequiredMark from "@/components/icon/RequiredMark.vue";
import ArrowMark from "@/components/icon/ArrowMark.vue";

export default defineComponent({
  name: "LabelBase",

  components: {
    RequiredMark,
    ArrowMark,
  },

  props: {
    // Binded Text
    displayText: {
      type: String,
      default: "",
    },
    markType: {
      type: String as PropType<myTypes.tLabelMarkType>, // "none" | "space" | "required" | "arrow"
      default: "none",
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@import "@/styles/components/label";
</style>
