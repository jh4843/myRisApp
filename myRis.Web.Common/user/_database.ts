export type tManagerLevelName = "Root" | "Vendor";

export type tUserLevelName = "Admin" | "Physician" | "Nurse" | "Technician" | "Engineer" | "";

export enum eUserLevel {
  Root = 0x01,
  Vendor = 0x02,
  //
  Admin = 0x11,
  Physician = 0x12,
  Nurse = 0x13,
  Technician = 0x14,
  Engineer = 0x15,
}

export const reverseUserLevel = (strUserLevel: string): eUserLevel => {
  return eUserLevel[strUserLevel] || eUserLevel.Admin;
};

export const parseUserLevel = (enumUserLevel: eUserLevel): string => {
  return eUserLevel[enumUserLevel] || "Admin";
};

export interface IDbUser {
  user_key: number;
  user_level: eUserLevel;
  user_id: string;
  user_pwd: string;
  user_name: string;
  user_desc?: string;
  user_create_dttm: Date;
  user_signin_dttm?: Date;
}
