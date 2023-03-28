<template>
  <h1
    class="homeicon"
    :style="{ 'font-size': fontSize, 'font-weight': fontWeight }"
  >
    <router-link to="/">
      <div v-if="colorType === 'Light'" class="homeicon__light">
        <img
          class="homeicon__light__icon"
          alt="myRis logo"
          src="@/assets/myRis_BI_Light.svg"
        />

        <span>&ensp;</span>
        <span class="homeicon__light__title" v-show="showTitle">
          {{ $t(title) }}
        </span>
      </div>
      <div v-else-if="colorType === 'Dark'" class="homeicon__dark">
        <img
          class="homeicon__dark__icon"
          alt="myRis logo"
          src="@/assets/myRis_BI_Dark.svg"
        />
        <span>&ensp;</span>
        <span class="homeicon__dark__title" v-show="showTitle">{{
          title
        }}</span>
      </div>
    </router-link>
  </h1>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "HomeIcon",

  props: {
    title: {
      type: String,
      default: "",
    },
    colorType: {
      type: String,
      default: "Light", // Light | Dark
    },
    fontSize: {
      type: String,
      default: "20px",
    },
    fontWeight: {
      type: String,
      default: "300",
    },
  },

  setup(props) {
    const showTitle = ref(props.title === undefined ? false : true);

    return {
      showTitle,
    };
  },
});
</script>

<style lang="scss">
.homeicon {
  display: flex;

  vertical-align: middle;
  background: transparent;

  font-family: $common-font-family;
  margin: 0;

  &__light {
    &__icon {
      width: 27px;
      height: 27px;

      vertical-align: middle;
    }

    &__title {
      vertical-align: middle;
      color: #ffffff;
    }
  }

  &__dark {
    &__icon {
      width: 27px;
      height: 27px;

      vertical-align: middle;
    }

    &__title {
      vertical-align: middle;
      color: $app-primary-color-1;
    }
  }
}

.homeicon a {
  text-decoration: none;
}
</style>
