<template>
  <div class="user-setting-menu-item">
    <li v-if="item.isGroupNameItem" class="user-setting-menu-item__group-name">
      {{ $t(item.getGroupName()) }}
    </li>
    <router-link
      v-else-if="!item.isGroupNameItem"
      class="user-setting-menu-item__content"
      :class="{ actived: item.isActive }"
      :to="item.url"
      @click="$emit('active-item', item)"
    >
      <li>
        <span v-show="item.isActive">▶ </span>
        {{ $t(item.name) }}
      </li>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import * as myTypes from "@/types";

export default defineComponent({
  name: "UserSettingMenuItem",

  props: {
    item: {
      type: Object as PropType<myTypes.UserSettingMenuItem>,
      required: true,
    },
    level: {
      type: Number,
      default: 1,
    },
  },

  emits: ["active-item"],

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/userSetting";
</style>
