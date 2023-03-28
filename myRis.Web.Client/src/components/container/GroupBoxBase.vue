<template>
  <div class="group-box-base">
    <div class="group-box-base__title-container">
      <h3 class="group-box-base__title">{{ $t(title) }}</h3>
      <div class="group-box-base__search-icon" v-show="isSearchable">
        <SvgBaseIcon viewBox="0, 0, 512, 512" @click="onHandleSpsChanged">
          <template v-slot:default>
            <MagnifyingGlass />
          </template>
        </SvgBaseIcon>
      </div>
    </div>
    <div class="group-box-base__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import MagnifyingGlass from "@/assets/etc/MagnifyingGlass.vue";

export default defineComponent({
  name: "GroupBoxBase",

  emits: ["on-search"],

  components: {
    SvgBaseIcon,
    MagnifyingGlass,
  },

  props: {
    // Style
    styleType: {
      type: String,
      default: "primary", // "primary" | "sub1" | "sub2";
    },
    title: {
      type: String,
      default: "",
    },
    isSearchable: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const onHandleSpsChanged = () => {
      if (props.isSearchable) {
        context.emit("on-search");
      }
    };

    return {
      onHandleSpsChanged,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/container";
</style>
