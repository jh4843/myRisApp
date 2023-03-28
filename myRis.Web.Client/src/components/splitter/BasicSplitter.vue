<template>
  <div
    class="basic-splitter"
    :style="splitterStyle"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
    <div v-if="isVertical === true">
      <div class="basic-splitter__vertical" data-orientation="vertical">
        <br />
      </div>
    </div>
    <div v-else>
      <div class="basic-splitter__horizontal" data-orientation="horizontal">
        <br />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

// ref: https://v3.vuejs.org/guide/typescript-support.html#typing-refs
// ref: https://chodragon9.github.io/blog/composition-api-rfc-migration/#api-reference

export default defineComponent({
  name: "BasicSplitter",

  components: {},

  props: {
    width: {
      type: String,
      default: "2px",
    },

    height: {
      type: String,
      default: "",
    },

    isVerticalSplitter: {
      type: Boolean,
      default: false,
    },

    normalLineColor: {
      type: String,
      default: "red",
    },

    activeLineColor: {
      type: String,
      default: "blue",
    },
  },

  setup(props) {
    const isActive = ref(false);
    const isVertical = ref(props.isVerticalSplitter);

    const splitterStyle = computed(() => {
      if (isActive.value) {
        return {
          width: props.width,
          height: props.height,
          "background-color": props.activeLineColor,
        };
      } else {
        return {
          width: props.width,
          height: props.height,
          "background-color": props.normalLineColor,
        };
      }
    });

    const mouseEnter = (): void => {
      isActive.value = true;
    };
    const mouseLeave = (): void => {
      isActive.value = false;
    };

    return {
      isActive,
      splitterStyle,
      mouseEnter,
      mouseLeave,
      isVertical,
    };
  },
});
</script>

<style lang="scss">
.basic-splitter {
  &__vertical {
    width: 2px;
    height: 100%;
  }

  &__horizontal {
    width: 100%;
    height: 2px;
  }
}
</style>
