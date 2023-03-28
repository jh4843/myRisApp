<template>
  <div class="user-setting-menu">
    <div class="user-setting-menu__title">
      <h2>{{ $t("Setting") }}</h2>
    </div>
    <div class="user-setting-menu__menu">
      <ul>
        <UserSettingMenuItem
          v-for="item in getMenus"
          :key="item.id"
          :item="item"
          @active-item="onHandleActiveItem"
        >
          {{ $t(item.name) }}
        </UserSettingMenuItem>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, onMounted } from "vue";
import UserSettingMenuItem from "./UserSettingMenuItem.vue";
import * as myTypes from "@/types";

export default defineComponent({
  name: "UserSettingMenu",

  components: {
    UserSettingMenuItem,
  },

  props: {
    modelValue: {
      type: Array as PropType<myTypes.UserSettingMenuItem[]>,
      required: true,
    },
  },

  setup(props) {
    const menus: myTypes.UserSettingMenuItem[] = reactive([]);

    const getMenus = computed(() => {
      return menus;
    });

    const onHandleActiveItem = (item: myTypes.UserSettingMenuItem) => {
      for (const menu of props.modelValue) {
        if (menu.id == item.id) {
          menu.isActive = true;
        } else {
          menu.isActive = false;
        }
      }
    };

    onMounted(() => {
      while (menus.length > 0) {
        menus.pop();
      }

      for (const menu of props.modelValue) {
        menus.push(menu);
      }
    });

    return {
      getMenus,

      onHandleActiveItem,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/userSetting";
</style>
