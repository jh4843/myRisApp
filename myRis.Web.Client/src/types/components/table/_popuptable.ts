export interface IPopupTableColumn {
  field: string; // row's column
  label: string; // display column
  width: string; // display width
  isShow: boolean;
}

export const popupPhysicianColumList: IPopupTableColumn[] = [
  {
    field: "key",
    label: "Key",
    width: "0%",
    isShow: false,
  },
  {
    field: "level",
    label: "Class",
    width: "20%",
    isShow: true,
  },
  {
    field: "id",
    label: "ID",
    width: "35%",
    isShow: true,
  },
  {
    field: "name",
    label: "Name",
    width: "45%",
    isShow: true,
  },
];

export const popupPatientColumList: IPopupTableColumn[] = [
  {
    field: "pt_key",
    label: "Key",
    width: "0%",
    isShow: false,
  },
  {
    field: "pt_id",
    label: "ID",
    width: "15%",
    isShow: true,
  },
  {
    field: "pt_name",
    label: "Name",
    width: "40%",
    isShow: true,
  },
  {
    field: "pt_sex",
    label: "Sex",
    width: "10%",
    isShow: true,
  },
  {
    field: "pt_birth_dttm",
    label: "Birth",
    width: "25%",
    isShow: true,
  },
];

export const popupProcPlanColumList: IPopupTableColumn[] = [
  {
    field: "key",
    label: "Key",
    width: "0%",
    isShow: false,
  },
  {
    field: "id",
    label: "ID",
    width: "30%",
    isShow: true,
  },
  {
    field: "desc",
    label: "Desc.",
    width: "70%",
    isShow: true,
  },
];

export const popupOrderColumnList: IPopupTableColumn[] = [
  {
    field: "ord_key",
    label: "Key",
    width: "0%",
    isShow: false,
  },
  {
    field: "ord_acc_num",
    label: "Acc No.",
    width: "15%",
    isShow: true,
  },
  {
    field: "ord_create_dttm",
    label: "Create Dttm",
    width: "15%",
    isShow: true,
  },
  {
    field: "ord_status_flag",
    label: "Status",
    width: "15%",
    isShow: true,
  },
  {
    field: "ord_study_uid",
    label: "Study UID",
    width: "10%",
    isShow: true,
  },
  {
    field: "ord_study_dttm",
    label: "Study Dttm",
    width: "15%",
    isShow: true,
  },
  {
    field: "ord_priority",
    label: "Priority",
    width: "10%",
    isShow: true,
  },
  {
    field: "ord_rp_id",
    label: "RP ID",
    width: "10%",
    isShow: true,
  },
  {
    field: "ord_rp_desc",
    label: "RP Desc",
    width: "10%",
    isShow: true,
  },
];

export const popupSpsColumnList: IPopupTableColumn[] = [
  {
    field: "sps_key",
    label: "Key",
    width: "0%",
    isShow: false,
  },
  {
    field: "sps_id",
    label: "ID",
    width: "5%",
    isShow: true,
  },
  {
    field: "sps_start_dttm",
    label: "Start Dttm",
    width: "15%",
    isShow: true,
  },
  {
    field: "sps_end_dttm",
    label: "End Dttm",
    width: "15%",
    isShow: true,
  },
  {
    field: "sps_station_ae_title",
    label: "St. AeTitle",
    width: "10%",
    isShow: true,
  },
  {
    field: "sps_station_name",
    label: "St. Name",
    width: "10%",
    isShow: true,
  },
  {
    field: "sps_modality",
    label: "Modality",
    width: "5%",
    isShow: true,
  },
  {
    field: "sps_bp_meaning",
    label: "Bodypart",
    width: "10%",
    isShow: true,
  },
  {
    field: "sps_perform_phyc_name",
    label: "Perf. Phsyician",
    width: "10%",
    isShow: true,
  },
  {
    field: "sps_desc",
    label: "Desc.",
    width: "20%",
    isShow: true,
  },
  {
    field: "sps_contrast_agent",
    label: "Cont. Agent",
    width: "0%",
    isShow: false,
  },
  {
    field: "sps_pre_med",
    label: "Pre. Med",
    width: "0%",
    isShow: false,
  },
];
