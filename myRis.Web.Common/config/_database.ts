// Config Groups
export enum eConfigGroup {
  config_group_none = 0,
  config_group_daily,
  config_group_station,
}

////////////////////////////////////////////////
// Daily Coonfigurations
////////////////////////////////////////////////

// Sections
export type tConfigDailySection = "Seq" | "";

// Labels
export type tConfigSeqLabel = "StudyUidSeq" | "";

export interface IDbConfig {
  config_key: number;
  config_group: eConfigGroup;
  config_section: string;
  config_label: string;
  config_value: string;
}
