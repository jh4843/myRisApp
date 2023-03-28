<template>
  <div class="layout-user-setting">
    <div class="layout-user-setting__content">
      <div class="layout-user-setting__content__menu">
        <UserSettingMenu :modelValue="menu" />
      </div>

      <div class="layout-user-setting__content__view">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import * as myTypes from "@/types";

import UserSettingMenu from "@/views/userSetting/menu/UserSettingMenu.vue";
//import BasicSplitter from "@/components/splitter/BasicSplitter.vue";

export default defineComponent({
  name: "UserSetting",

  components: {
    UserSettingMenu,
    //BasicSplitter,
  },

  setup() {
    const menu = ref<Array<myTypes.UserSettingMenuItem>>([
      //// System
      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupSystem,
        myTypes.eUserSettingMenuId.UserSettingIdNone,
        "System",
        "",
        "",
        true, // isGroupName
        false // isActive
      ),
      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupSystem,
        myTypes.eUserSettingMenuId.UserSettingIdSystemInfo,
        "Information",
        "/user-setting/system-info",
        "Display system information.",
        false, // isGroupName
        true // isActive
      ),

      //// User
      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupUser,
        myTypes.eUserSettingMenuId.UserSettingIdNone,
        "User",
        "",
        "",
        true, // isGroupName
        false // isActive
      ),

      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupUser,
        myTypes.eUserSettingMenuId.UserSettingIdUserProfile,
        "Profile",
        "/user-setting/profile",
        "Set for user profile.",
        false, // isGroupName
        false // isActive
      ),

      //// RIS
      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupRIS,
        myTypes.eUserSettingMenuId.UserSettingIdNone,
        "RIS",
        "",
        "",
        true, // isGroupName
        false // isActive
      ),
      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupRIS,
        myTypes.eUserSettingMenuId.UserSettingIdRisProcPlan,
        "Procedure Plan",
        "/user-setting/proc-plan",
        "Set for requested procedure sequence.",
        false, // isGroupName
        false // isActive
      ),

      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupRIS,
        myTypes.eUserSettingMenuId.UserSettingIdRisProtocol,
        "Protocol",
        "/user-setting/protocol",
        "Set for protocol.",
        false, // isGroupName
        false // isActive
      ),

      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupRIS,
        myTypes.eUserSettingMenuId.UserSettingIdRisBodypart,
        "Bodypart",
        "/user-setting/bodypart",
        "Set for protocol.",
        false, // isGroupName
        false // isActive
      ),

      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupRIS,
        myTypes.eUserSettingMenuId.UserSettingIdRisStation,
        "Station",
        "/user-setting/station",
        "Set for station.",
        false, // isGroupName
        false // isActive
      ),

      new myTypes.UserSettingMenuItem(
        myTypes.eUserSettingMenuGroup.UserSettingMenuGroupRIS,
        myTypes.eUserSettingMenuId.UserSettingIdRisOrdReason,
        "Order Reason",
        "/user-setting/ord-reason",
        "Set for order reason.",
        false, // isGroupName
        false // isActive
      ),
    ]);

    return {
      menu,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "@/styles/view/userSetting";
</style>
