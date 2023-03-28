/////////////////////////////////////////////////////
// Common
/////////////////////////////////////////////////////

export enum eMenuCategory {
  MenuCategoryNone = 0,
  MenuCategoryUserSetting,
}

interface IRouterMenuItemBasic {
  id: number | eUserSettingMenuId;
  name: string;
  category: eMenuCategory;

  url: string;
  desc: string;
}

/////////////////////////////////////////////////////
//  User Setting
/////////////////////////////////////////////////////

export enum eUserSettingMenuId {
  UserSettingIdNone = 0x00,
  UserSettingIdSystemInfo = 0x01,
  UserSettingIdUserProfile = 0x11,
  UserSettingIdRisProcPlan = 0x21,
  UserSettingIdRisProtocol = 0x22,
  UserSettingIdRisBodypart = 0x23,
  UserSettingIdRisStation = 0x24,
  UserSettingIdRisOrdReason = 0x25,
}

export enum eUserSettingMenuGroup {
  UserSettingMenuGroupNone = 0,
  UserSettingMenuGroupSystem,
  UserSettingMenuGroupUser,
  UserSettingMenuGroupRIS,
}

export interface IUserSettingMenuItem extends IRouterMenuItemBasic {
  group: eUserSettingMenuGroup;
  isGroupNameItem?: boolean;
}

export class UserSettingMenuItem implements IUserSettingMenuItem {
  category: eMenuCategory;

  group: eUserSettingMenuGroup;
  id: eUserSettingMenuId;
  name: string;
  url: string;
  desc: string;

  isGroupNameItem: boolean;
  isActive: boolean;

  constructor(
    group: eUserSettingMenuGroup,
    id: eUserSettingMenuId,
    name: string,
    url: string,
    desc: string,
    isGroupNameItem: boolean,
    isActive: boolean
  ) {
    this.category = eMenuCategory.MenuCategoryUserSetting;

    this.group = group;
    this.id = id;
    this.name = name;
    this.url = url;
    this.desc = desc;
    this.isGroupNameItem = isGroupNameItem;
    this.isActive = isActive;
  }

  getGroupName(): string {
    switch (this.group) {
      case eUserSettingMenuGroup.UserSettingMenuGroupSystem:
        return "System";
      case eUserSettingMenuGroup.UserSettingMenuGroupUser:
        return "User";
      case eUserSettingMenuGroup.UserSettingMenuGroupRIS:
        return "RIS";
      default:
        console.log("getGroupName: Invalid param(", this.group, ")");
        break;
    }

    console.log("getGroupName: groups(", this.group, ")");

    return "";
  }
}
