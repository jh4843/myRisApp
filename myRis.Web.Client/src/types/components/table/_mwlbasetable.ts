import {
  IDbWorklist,
  IDbPatient,
  IDbOrder,
  IDbSps,
  IDbProcPlan,
  //
  tPatientSex,
  //
  eOrderStatus,
  reverseOrderStatus,
  parseOrderStatus,
  eOrderPriority,
  reversePriority,
  parsePriority,
  eSpeciesType,
  parseSpeciesType,
  reverseSpeciesType,
} from "../../../../../myRis.Web.Common";
import * as myUtils from "@/utils";

export enum eMwlMainTableType {
  table_type_mwl_main_patient,
  table_type_mwl_main_order,
  table_type_mwl_main_sps,
}

export enum eTableType {
  table_type_none = 0,
  table_type_mwl_main_patient,
  table_type_mwl_main_order,
  table_type_mwl_main_sps,
  table_type_mwl_patient,
  table_type_mwl_order,
  table_type_mwl_sps,
  table_type_mwl_proc_plan,
  table_type_mwl_protocol,
  table_type_mwl_bodypart,
  table_type_mwl_station,
  table_type_mwl_ord_reason,
}

export type tTableStyle = "main" | "sub" | "add" | "select";

export type tColumnType =
  | "text"
  | "number"
  | "decimal"
  | "percentage"
  | "boolean"
  | "html"
  | "date";

export interface ITableRowState {
  index: number;
  id: string;
  isSelected: boolean;
}

export interface ICommonTableColumnOnlyTable {
  id: number;
  label: string;
  field: string;
  width?: string;
  type: tColumnType;
  hidden: boolean;
  tdClass?: string;
  html?: boolean;
  dateInputFormat?: string;
  dateOutputFormat?: string;
  globalSearchDisabled?: boolean;
}

export interface ICommonTableColumn extends ICommonTableColumnOnlyTable {
  filterOptions?: {
    enabled?: boolean;
    placeholder?: string; // placeholder for filter input ex) "Filter This Thing"
    filterValue?: string; // initial populated value for this filter ex) "Jane"
    trigger?: string; //only trigger on enter not on keyup ex) "enter"
  };
}

export const mwlMainSpsColumnListForHuman: ICommonTableColumn[] = [
  {
    id: 0,
    label: "Index",
    field: "index",
    type: "text",
    hidden: true,
  },
  {
    id: 1,
    label: "SPS. Key",
    field: "sps_key",
    type: "text",
    hidden: true,
  },
  {
    id: 2,
    label: "Pt. Key",
    field: "pt_key",
    type: "text",
    hidden: true,
  },
  {
    id: 3,
    label: "Order Key",
    field: "ord_key",
    type: "text",
    hidden: true,
  },
  {
    id: 4,
    label: "Acc No.",
    field: "ord_acc_num",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Ord. Status",
    field: "ord_status_flag",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Pt ID",
    field: "pt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 7,
    label: "Pt Name",
    field: "pt_name",
    type: "text",
    hidden: false,
  },
  {
    id: 8,
    label: "Sex",
    field: "pt_sex",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Brith Dttm",
    field: "pt_birth_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateFormatString(),
    dateOutputFormat: myUtils.getLocaleDateFormatString(),
    hidden: false,
  },
  {
    id: 10,
    label: "Pt Age",
    field: "pt_age",
    type: "text",
    hidden: true,
  },
  {
    id: 11,
    label: "Pt Weight",
    field: "pt_weight",
    type: "text",
    hidden: true,
  },
  {
    id: 12,
    label: "Pt Size",
    field: "pt_size",
    type: "text",
    hidden: true,
  },
  {
    id: 13,
    label: "Priority",
    field: "ord_priority",
    type: "text",
    hidden: false,
  },
  {
    id: 14,
    label: "RP ID",
    field: "ord_rp_id",
    type: "text",
    hidden: false,
  },
  {
    id: 15,
    label: "RP Desc",
    field: "ord_rp_desc",
    type: "text",
    hidden: false,
  },
  {
    id: 16,
    label: "SPS ID",
    field: "sps_id",
    type: "text",
    hidden: false,
  },
  {
    id: 17,
    label: "SPS Start Dttm",
    field: "sps_start_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 18,
    label: "SPS End Dttm",
    field: "sps_end_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 19,
    label: "St AE Title",
    field: "sps_station_ae_title",
    type: "text",
    hidden: false,
  },
  {
    id: 20,
    label: "St Name",
    field: "sps_station_name",
    type: "text",
    hidden: false,
  },
  {
    id: 21,
    label: "Modality",
    field: "sps_modality",
    type: "text",
    hidden: false,
  },
  {
    id: 22,
    label: "Bodypart Code Value",
    field: "sps_bp_code_value",
    type: "text",
    hidden: true,
  },
  {
    id: 23,
    label: "Bodypart Scm Design",
    field: "sps_bp_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 24,
    label: "Bodypart",
    field: "sps_bp_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 25,
    label: "SPS Desc",
    field: "sps_desc",
    type: "text",
    hidden: false,
  },
  {
    id: 26,
    label: "Perf. Physician",
    field: "sps_perform_phyc_name",
    type: "text",
    hidden: false,
  },
  {
    id: 27,
    label: "Cont Agent",
    field: "sps_contrast_agent",
    type: "text",
    hidden: true,
  },
  {
    id: 28,
    label: "Pre Med",
    field: "sps_pre_med",
    type: "text",
    hidden: true,
  },
];

export const mwlMainSpsColumnListForVet: ICommonTableColumn[] = [
  {
    id: 0,
    label: "Index",
    field: "index",
    type: "text",
    hidden: true,
  },
  {
    id: 1,
    label: "SPS. Key",
    field: "sps_key",
    type: "text",
    hidden: true,
  },
  {
    id: 2,
    label: "Pt. Key",
    field: "pt_key",
    type: "text",
    hidden: true,
  },
  {
    id: 3,
    label: "Order Key",
    field: "ord_key",
    type: "text",
    hidden: true,
  },
  {
    id: 4,
    label: "Acc No.",
    field: "ord_acc_num",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Ord. Status",
    field: "ord_status_flag",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Pt ID",
    field: "pt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 7,
    label: "Pt Name",
    field: "pt_name",
    type: "text",
    hidden: false,
  },
  {
    id: 8,
    label: "Sex",
    field: "pt_sex",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Species",
    field: "species_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 10,
    label: "Breed",
    field: "breed_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 11,
    label: "Brith Dttm",
    field: "pt_birth_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateFormatString(),
    dateOutputFormat: myUtils.getLocaleDateFormatString(),
    hidden: false,
  },
  {
    id: 12,
    label: "Pt Age",
    field: "pt_age",
    type: "text",
    hidden: true,
  },
  {
    id: 13,
    label: "Pt Weight",
    field: "pt_weight",
    type: "text",
    hidden: true,
  },
  {
    id: 14,
    label: "Pt Size",
    field: "pt_size",
    type: "text",
    hidden: true,
  },
  {
    id: 15,
    label: "Priority",
    field: "ord_priority",
    type: "text",
    hidden: false,
  },
  {
    id: 16,
    label: "RP ID",
    field: "ord_rp_id",
    type: "text",
    hidden: false,
  },
  {
    id: 17,
    label: "RP Desc",
    field: "ord_rp_desc",
    type: "text",
    hidden: false,
  },
  {
    id: 18,
    label: "SPS ID",
    field: "sps_id",
    type: "text",
    hidden: false,
  },
  {
    id: 19,
    label: "SPS Start Dttm",
    field: "sps_start_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 20,
    label: "SPS End Dttm",
    field: "sps_end_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 21,
    label: "St AE Title",
    field: "sps_station_ae_title",
    type: "text",
    hidden: false,
  },
  {
    id: 22,
    label: "St Name",
    field: "sps_station_name",
    type: "text",
    hidden: false,
  },
  {
    id: 23,
    label: "Modality",
    field: "sps_modality",
    type: "text",
    hidden: false,
  },
  {
    id: 24,
    label: "Bodypart Code Value",
    field: "sps_bp_code_value",
    type: "text",
    hidden: true,
  },
  {
    id: 24,
    label: "Bodypart Scm Design",
    field: "sps_bp_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 24,
    label: "Bodypart",
    field: "sps_bp_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 25,
    label: "SPS Desc",
    field: "sps_desc",
    type: "text",
    hidden: false,
  },
  {
    id: 26,
    label: "Perf. Physician",
    field: "sps_perform_phyc_name",
    type: "text",
    hidden: true,
  },
  {
    id: 27,
    label: "Cont Agent",
    field: "sps_contrast_agent",
    type: "text",
    hidden: true,
  },
  {
    id: 28,
    label: "Pre Med",
    field: "sps_pre_med",
    type: "text",
    hidden: true,
  },
];

export const mwlMainOrderColumnListForHuman: ICommonTableColumn[] = [
  {
    id: 0,
    label: "",
    width: "25px",
    field: "expand_btn",
    type: "text",
    html: true,
    tdClass: "expand-btn",
    hidden: false,
    globalSearchDisabled: true,
  },
  {
    id: 1,
    label: "Status",
    field: "ord_status_flag",
    type: "text",
    hidden: false,
  },
  {
    id: 2,
    label: "Acc No.",
    field: "ord_acc_num",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Pt ID",
    field: "pt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Pt Name",
    field: "pt_name",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Sex",
    field: "pt_sex",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Birth",
    field: "pt_birth_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateFormatString(),
    dateOutputFormat: myUtils.getLocaleDateFormatString(),
    hidden: false,
  },
  {
    id: 7,
    label: "Issuer",
    field: "ord_issuer",
    type: "text",
    hidden: false,
  },
  {
    id: 8,
    label: "Create Dttm",
    field: "ord_create_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 9,
    label: "Req. Physician",
    field: "ord_requesting_phyc",
    type: "text",
    hidden: true,
  },
  {
    id: 10,
    label: "Ref. Physician",
    field: "ord_referring_phyc",
    type: "text",
    hidden: true,
  },
  {
    id: 11,
    label: "Study UID",
    field: "ord_study_uid",
    type: "text",
    hidden: false,
  },
  {
    id: 12,
    label: "Study Dttm",
    field: "ord_study_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: true,
  },
  {
    id: 13,
    label: "Reason",
    field: "ord_reason",
    type: "text",
    hidden: false,
  },
  {
    id: 14,
    label: "Priority",
    field: "ord_priority",
    type: "text",
    hidden: false,
  },
  {
    id: 15,
    label: "Requested Procedure ID",
    field: "ord_rp_id",
    type: "text",
    hidden: false,
  },
  {
    id: 16,
    label: "Requested Procedure Desc",
    field: "ord_rp_desc",
    type: "text",
    hidden: false,
  },
  {
    id: 17,
    label: "Pt Age",
    field: "ord_pt_age",
    type: "text",
    hidden: true,
  },
  {
    id: 18,
    label: "Pt Weight",
    field: "ord_pt_weight",
    type: "text",
    hidden: true,
  },
  {
    id: 19,
    label: "Pt Size",
    field: "ord_pt_size",
    type: "text",
    hidden: true,
  },
];

export const mwlMainOrderColumnListForVet: ICommonTableColumn[] = [
  {
    id: 0,
    label: "",
    width: "25px",
    field: "expand_btn",
    type: "text",
    html: true,
    tdClass: "expand-btn",
    hidden: false,
    globalSearchDisabled: true,
  },
  {
    id: 1,
    label: "Status",
    field: "ord_status_flag",
    type: "text",
    hidden: false,
  },
  {
    id: 2,
    label: "Acc No.",
    field: "ord_acc_num",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Pt ID",
    field: "pt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Pt Name",
    field: "pt_name",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Sex",
    field: "pt_sex",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Birth",
    field: "pt_birth_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateFormatString(),
    dateOutputFormat: myUtils.getLocaleDateFormatString(),
    hidden: false,
  },
  {
    id: 7,
    label: "Species",
    field: "species_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 8,
    label: "Breed",
    field: "breed_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Create Dttm",
    field: "ord_create_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 10,
    label: "Req Physician",
    field: "ord_requesting_phyc",
    type: "text",
    hidden: true,
  },
  {
    id: 11,
    label: "Ref Physician",
    field: "ord_referring_phyc",
    type: "text",
    hidden: true,
  },
  {
    id: 12,
    label: "Study UID",
    field: "ord_study_uid",
    type: "text",
    hidden: false,
  },
  {
    id: 13,
    label: "Study Dttm",
    field: "ord_study_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: true,
  },
  {
    id: 14,
    label: "Reason",
    field: "ord_reason",
    type: "text",
    hidden: false,
  },
  {
    id: 15,
    label: "Priority",
    field: "ord_priority",
    type: "text",
    hidden: false,
  },
  {
    id: 16,
    label: "Requested Procedure ID",
    field: "ord_rp_id",
    type: "text",
    hidden: false,
  },
  {
    id: 17,
    label: "Requested Procedure Desc",
    field: "ord_rp_desc",
    type: "text",
    hidden: false,
  },
  {
    id: 18,
    label: "Pt Age",
    field: "ord_pt_age",
    type: "text",
    hidden: true,
  },
  {
    id: 19,
    label: "Pt Weight",
    field: "ord_pt_weight",
    type: "text",
    hidden: true,
  },
  {
    id: 20,
    label: "Pt Size",
    field: "ord_pt_size",
    type: "text",
    hidden: true,
  },
];

export const mwlMainPatientColumnListForHuman: ICommonTableColumn[] = [
  {
    id: 0,
    label: "",
    width: "25px",
    field: "expand_btn",
    type: "text",
    html: true,
    tdClass: "expand-btn",
    hidden: false,
    globalSearchDisabled: true,
  },
  {
    id: 1,
    label: "Patient Key",
    field: "pt_key",
    type: "number",
    hidden: true,
  },
  {
    id: 2,
    label: "Pt ID",
    field: "pt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Pt Name",
    field: "pt_name",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Sex",
    field: "pt_sex",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Birth",
    field: "pt_birth_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateFormatString(),
    dateOutputFormat: myUtils.getLocaleDateFormatString(),
    hidden: false,
  },
  {
    id: 6,
    label: "Address",
    field: "pt_address",
    type: "text",
    hidden: false,
  },
  {
    id: 7,
    label: "Tel",
    field: "pt_tel",
    type: "text",
    hidden: false,
  },
  {
    id: 8,
    label: "State",
    field: "pt_state",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Med. Alert",
    field: "pt_med_alert",
    type: "text",
    hidden: false,
  },
  {
    id: 10,
    label: "Allergies",
    field: "pt_allergies",
    type: "text",
    hidden: false,
  },
  {
    id: 11,
    label: "Resp. person",
    field: "pt_responsible_person",
    type: "text",
    hidden: true,
  },
  {
    id: 12,
    label: "Pt Weight",
    field: "pt_weight",
    type: "text",
    hidden: true,
  },
  {
    id: 13,
    label: "Pt Size",
    field: "pt_size",
    type: "text",
    hidden: true,
  },
];

export const mwlMainPatientColumnListForVet: ICommonTableColumn[] = [
  {
    id: 0,
    label: "",
    width: "25px",
    field: "expand_btn",
    type: "text",
    html: true,
    tdClass: "expand-btn",
    hidden: false,
    globalSearchDisabled: true,
  },
  {
    id: 1,
    label: "Patient Key",
    field: "pt_key",
    type: "number",
    hidden: true,
  },
  {
    id: 2,
    label: "Species Key",
    field: "pt_species_key",
    type: "number",
    hidden: true,
  },
  {
    id: 3,
    label: "Breed Key",
    field: "pt_breed_key",
    type: "number",
    hidden: true,
  },
  {
    id: 4,
    label: "Pt ID",
    field: "pt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Pt Name",
    field: "pt_name",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Sex",
    field: "pt_sex",
    type: "text",
    hidden: false,
  },
  {
    id: 7,
    label: "Birth",
    field: "pt_birth_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateFormatString(),
    dateOutputFormat: myUtils.getLocaleDateFormatString(),
    hidden: false,
  },
  {
    id: 8,
    label: "Species Type",
    field: "species_type",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Species Code Value",
    field: "species_code_value",
    type: "text",
    hidden: true,
  },
  {
    id: 10,
    label: "Species Scm Design",
    field: "species_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 11,
    label: "Species Code meaning",
    field: "species_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 12,
    label: "Breed Code Value",
    field: "breed_code_value",
    type: "text",
    hidden: true,
  },
  {
    id: 13,
    label: "Breed Scm Design",
    field: "breed_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 14,
    label: "Breed Code meaning",
    field: "breed_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 15,
    label: "Address",
    field: "pt_address",
    type: "text",
    hidden: false,
  },
  {
    id: 16,
    label: "Tel",
    field: "pt_tel",
    type: "text",
    hidden: false,
  },
  {
    id: 17,
    label: "State",
    field: "pt_state",
    type: "text",
    hidden: false,
  },
  {
    id: 18,
    label: "Med. Alert",
    field: "pt_med_alert",
    type: "text",
    hidden: false,
  },
  {
    id: 19,
    label: "Allergies",
    field: "pt_allergies",
    type: "text",
    hidden: false,
  },
  {
    id: 20,
    label: "Resp. person",
    field: "pt_responsible_person",
    type: "text",
    hidden: false,
  },
  {
    id: 21,
    label: "Pt Weight",
    field: "pt_weight",
    type: "text",
    hidden: true,
  },
  {
    id: 22,
    label: "Pt Size",
    field: "pt_size",
    type: "text",
    hidden: true,
  },
];

export const patientColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "Patient Key",
    field: "pt_key",
    type: "number",
    hidden: true,
  },
  {
    id: 1,
    label: "ID",
    field: "pt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 2,
    label: "Name",
    field: "pt_name",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Sex",
    field: "pt_sex",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Age",
    field: "pt_age",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Brith Dttm",
    field: "pt_birth_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateFormatString(),
    dateOutputFormat: myUtils.getLocaleDateFormatString(),
    hidden: false,
  },
  {
    id: 6,
    label: "Weight",
    field: "pt_weight",
    type: "text",
    hidden: false,
  },
  {
    id: 7,
    label: "Size",
    field: "pt_size",
    type: "text",
    hidden: false,
  },
  {
    id: 8,
    label: "Address",
    field: "pt_address",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Tel.",
    field: "pt_tel",
    type: "text",
    hidden: false,
  },
  {
    id: 10,
    label: "State",
    field: "pt_state",
    type: "text",
    hidden: false,
  },
  {
    id: 11,
    label: "Med. Alert",
    field: "pt_med_alert",
    type: "text",
    hidden: false,
  },
  {
    id: 12,
    label: "Allergies",
    field: "pt_allergies",
    type: "text",
    hidden: false,
  },
  {
    id: 13,
    label: "Comments",
    field: "pt_comment",
    type: "text",
    hidden: false,
  },
  {
    id: 14,
    label: "Responsible Person",
    field: "pt_responsible_person",
    type: "text",
    hidden: true,
  },
  {
    id: 15,
    label: "Species Key",
    field: "pt_species_key",
    type: "number",
    hidden: true,
  },
  {
    id: 16,
    label: "Breed Key",
    field: "pt_breed_key",
    type: "number",
    hidden: true,
  },
  {
    id: 17,
    label: "Species Type",
    field: "species_type",
    type: "text",
    hidden: true,
  },
  {
    id: 18,
    label: "Species Code Value",
    field: "species_code_value",
    type: "text",
    hidden: true,
  },
  {
    id: 19,
    label: "Species Scm Design",
    field: "species_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 20,
    label: "Species Code meaning",
    field: "species_code_meaning",
    type: "text",
    hidden: true,
  },
  {
    id: 21,
    label: "Breed Code Value",
    field: "breed_code_value",
    type: "text",
    hidden: true,
  },
  {
    id: 22,
    label: "Breed Scm Design",
    field: "breed_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 23,
    label: "Breed Code meaning",
    field: "breed_code_meaning",
    type: "text",
    hidden: true,
  },
];

export const orderColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "Patient Key",
    field: "pt_key",
    type: "text",
    hidden: true,
  },
  {
    id: 1,
    label: "Order Key",
    field: "ord_key",
    type: "text",
    hidden: true,
  },
  {
    id: 2,
    label: "Acc No.",
    field: "ord_acc_num",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Issuer",
    field: "ord_issuer",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Create Dttm",
    field: "ord_create_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 5,
    label: "Status",
    field: "ord_status_flag",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Req Physician",
    field: "ord_requesting_phyc",
    type: "text",
    hidden: true,
  },
  {
    id: 7,
    label: "Ref Physician",
    field: "ord_referring_phyc",
    type: "text",
    hidden: true,
  },
  {
    id: 8,
    label: "Study UID",
    field: "ord_study_uid",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Study Dttm",
    field: "ord_study_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: true,
  },
  {
    id: 10,
    label: "Reason",
    field: "ord_reason",
    type: "text",
    hidden: false,
  },
  {
    id: 11,
    label: "Priority",
    field: "ord_priority",
    type: "text",
    hidden: false,
  },
  {
    id: 12,
    label: "Requested Procedure ID",
    field: "ord_rp_id",
    type: "text",
    hidden: false,
  },
  {
    id: 13,
    label: "Requested Procedure Desc",
    field: "ord_rp_desc",
    type: "text",
    hidden: false,
  },
  {
    id: 14,
    label: "Scheduled Procedure Step ID(s)",
    field: "sps_ids",
    type: "text",
    hidden: false,
  },
  {
    id: 15,
    label: "Pt Age",
    field: "ord_pt_age",
    type: "text",
    hidden: true,
  },
  {
    id: 16,
    label: "Pt Weight",
    field: "ord_pt_weight",
    type: "text",
    hidden: true,
  },
  {
    id: 17,
    label: "Pt Size",
    field: "ord_pt_size",
    type: "text",
    hidden: true,
  },
];

export const procPlanColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "ID",
    field: "id",
    type: "text",
    hidden: false,
  },
  {
    id: 1,
    label: "Desc.",
    field: "desc",
    type: "text",
    hidden: false,
  },
  {
    id: 2,
    label: "Protocol ID(s)",
    field: "protocol_ids",
    type: "text",
    hidden: false,
  },
];

export const spsColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "Sps Key",
    field: "key",
    type: "text",
    hidden: true,
  },
  {
    id: 1,
    label: "Order Key",
    field: "ord_key",
    type: "text",
    hidden: true,
  },
  {
    id: 2,
    label: "ID",
    field: "id",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Station AE Title",
    field: "station_ae_title",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Station Name",
    field: "station_name",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Modality",
    field: "modality",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Bodypart Code Value",
    field: "bp_code_value",
    type: "text",
    hidden: true,
  },
  {
    id: 7,
    label: "Bodypart Scm Design",
    field: "bp_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 8,
    label: "Bodypart",
    field: "bp_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 9,
    label: "Desc.",
    field: "desc",
    type: "text",
    hidden: false,
  },
  {
    id: 10,
    label: "Perf. Physician",
    field: "perform_phyc_name",
    type: "text",
    hidden: false,
  },
  {
    id: 11,
    label: "Start Dttm",
    field: "start_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 12,
    label: "End Dttm",
    field: "end_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: false,
  },
  {
    id: 13,
    label: "Contrast Agent",
    field: "contrast_agent",
    type: "text",
    hidden: true,
  },
  {
    id: 14,
    label: "Pre Med",
    field: "pre_med",
    type: "text",
    hidden: true,
  },
];

export const protocolColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "ID",
    field: "id",
    type: "text",
    hidden: false,
  },
  {
    id: 1,
    label: "Station AE Title",
    field: "station_ae_title",
    type: "text",
    hidden: false,
  },
  {
    id: 2,
    label: "Station Name",
    field: "station_name",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Modality",
    field: "modality",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Perf. Physician",
    field: "perform_phyc_name",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "Duration (.min)",
    field: "duration",
    type: "number",
    hidden: false,
  },
  {
    id: 6,
    label: "Desc.",
    field: "desc",
    type: "text",
    hidden: false,
  },
  {
    id: 7,
    label: "Start Dttm",
    field: "start_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: true,
  },
  {
    id: 8,
    label: "End Dttm",
    field: "end_dttm",
    type: "date",
    dateInputFormat: myUtils.getInputLocaleDateTimeFormatString(),
    dateOutputFormat: myUtils.getLocaleDateTimeFormatString(),
    hidden: true,
  },
  {
    id: 9,
    label: "Bodypart Key",
    field: "prot_bp_key",
    type: "number",
    hidden: true,
  },
  {
    id: 10,
    label: "Bodypart",
    field: "bp_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 11,
    label: "Bodypart Scm Design",
    field: "bp_scm_design",
    type: "text",
    hidden: true,
  },
  {
    id: 12,
    label: "Bodypart Code Value",
    field: "bp_code_value",
    type: "text",
    hidden: true,
  },
];

export const bodypartColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "Bodypart Key",
    field: "bp_key",
    type: "number",
    hidden: true,
  },
  {
    id: 1,
    label: "Type",
    field: "bp_type",
    type: "text",
    hidden: true,
  },
  {
    id: 2,
    label: "Code Value",
    field: "bp_code_value",
    type: "text",
    hidden: false,
  },
  {
    id: 3,
    label: "Scheme Designator",
    field: "bp_scm_design",
    type: "text",
    hidden: false,
  },
  {
    id: 4,
    label: "Code Meaning",
    field: "bp_code_meaning",
    type: "text",
    hidden: false,
  },
  {
    id: 5,
    label: "SNOMED RT ID",
    field: "bp_snm_rt_id",
    type: "text",
    hidden: false,
  },
  {
    id: 6,
    label: "Sub Name",
    field: "bp_sub_name",
    type: "text",
    hidden: false,
  },
  {
    id: 7,
    label: "Sub Type",
    field: "bp_sub_type",
    type: "text",
    hidden: false,
  },
];

export const stationColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "AE Title",
    field: "station_ae_title",
    type: "text",
    hidden: false,
  },
  {
    id: 1,
    label: "Station Name",
    field: "station_name",
    type: "text",
    hidden: false,
  },
];

export const ordReasonColumnList: ICommonTableColumn[] = [
  {
    id: 0,
    label: "Order Reason Key",
    field: "ord_reason_key",
    type: "number",
    hidden: true,
  },
  {
    id: 1,
    label: "Type",
    field: "ord_reason_type",
    type: "text",
    hidden: false,
  },
  {
    id: 2,
    label: "Desc.",
    field: "ord_reason_desc",
    type: "text",
    hidden: false,
  },
];

export interface ICommonTableRow {
  index: number; // row Index
  isExpand?: boolean;
}

export interface IMwlMainTableRow extends ICommonTableRow {
  // keys
  pt_key: number;
  ord_key: number;
  sps_key: number;
  pt_species_key?: number;
  pt_breed_key?: number;

  // T_PATIENT
  pt_id: string; // required
  pt_name: string; // required
  pt_sex: tPatientSex; // required

  pt_age: string; // VR: AS(Age String, 4byte char)
  pt_birth_dttm: string; // required

  pt_weight?: string;
  pt_size?: string;

  pt_address?: string;
  pt_tel?: string;

  pt_state?: string;
  pt_med_alert?: string;
  pt_allergies?: string;

  pt_comment?: string;
  pt_responsible_person?: string;

  // T_ORDER
  ord_acc_num: string;
  ord_issuer?: string;
  ord_create_dttm?: string;

  ord_status_flag?: string;
  ord_requesting_phyc?: string;
  ord_referring_phyc?: string;

  ord_study_uid: string;
  ord_study_dttm?: string;

  ord_reason?: string;
  ord_priority: string;

  ord_rp_id: string;
  ord_rp_desc?: string;

  ord_pt_age?: string;
  ord_pt_weight?: string;
  ord_pt_size?: string;

  // T_SPS
  sps_id: string; // from sps sequence
  sps_start_dttm: string;
  sps_end_dttm: string;

  sps_station_ae_title: string; // from sps sequence
  sps_station_name?: string; // from sps sequence
  sps_modality: string; // from sps sequence
  sps_bp_code_value: string;
  sps_bp_scm_design: string;
  sps_bp_meaning: string;

  sps_desc?: string; // from sps sequence
  sps_perform_phyc_name?: string; // from sps sequence
  sps_contrast_agent?: string;
  sps_pre_med?: string; // from sps sequence

  // T_SPECIES
  species_type?: string;
  species_code_meaning?: string;

  // T_BREED
  breed_code_meaning?: string;
}

export class MwlMainTableRow implements IMwlMainTableRow {
  index: number;
  isExpand: boolean;

  // keys
  pt_key: number;
  ord_key: number;
  sps_key: number;

  ////////////////////////////////////
  // required
  ////////////////////////////////////
  // Patient
  pt_id: string;
  pt_name: string;
  pt_sex: tPatientSex;
  pt_age: string;
  pt_birth_dttm: string;
  // Order
  ord_acc_num: string;
  ord_status_flag: string;
  ord_priority: string;
  ord_rp_id: string;
  ord_study_uid: string;
  // SPS
  sps_id: string; // from sps sequence
  sps_start_dttm: string;
  sps_station_ae_title: string; // from sps sequence
  sps_modality: string; // from sps sequence
  sps_bp_code_value: string;
  sps_bp_scm_design: string;
  sps_bp_meaning: string;

  ////////////////////////////////////
  // Options
  ////////////////////////////////////
  pt_species_key?: number;
  pt_breed_key?: number;
  //
  pt_weight?: string;
  pt_size?: string;
  pt_address?: string;
  pt_tel?: string;
  pt_state?: string;
  pt_med_alert?: string;
  pt_allergies?: string;
  pt_comment?: string;
  pt_responsible_person?: string;

  // T_ORDER
  ord_issuer?: string;
  ord_create_dttm?: string;
  ord_requesting_phyc?: string;
  ord_referring_phyc?: string;
  ord_study_dttm?: string;
  ord_reason?: string;
  ord_rp_desc?: string;
  ord_pt_age?: string;
  ord_pt_weight?: string;
  ord_pt_size?: string;

  // T_SPS
  sps_end_dttm: string;
  sps_station_name?: string; // from sps sequence
  sps_desc?: string; // from sps sequence
  sps_perform_phyc_name?: string; // from sps sequence
  sps_contrast_agent?: string;
  sps_pre_med?: string; // from sps sequence

  // T_SPECIES
  species_type?: string;
  species_code_meaning?: string;

  // T_BREED
  breed_code_meaning?: string;

  constructor(
    index: number,
    isExpand: boolean,
    // Required
    pt_key: number,
    ord_key: number,
    sps_key: number,
    //
    pt_id: string,
    pt_name: string,
    pt_sex: tPatientSex,
    pt_age: string, // VR: AS(Age String, 4byte char)
    pt_birth_dttm: string,
    //
    ord_acc_num: string,
    ord_status_flag: eOrderStatus,
    ord_study_uid: string,
    ord_rp_id: string,
    ord_priority: eOrderPriority,
    //
    sps_id: string,
    sps_start_dttm: string,
    sps_end_dttm: string,
    //
    sps_station_ae_title: string,
    sps_modality: string,
    sps_bp_code_value: string,
    sps_bp_scm_design: string,
    sps_bp_meaning: string,

    // Options
    species_key?: number,
    breed_key?: number,
    pt_weight?: string,
    pt_size?: string,
    pt_address?: string,
    pt_tel?: string,
    pt_state?: string,
    pt_med_alert?: string,
    pt_allergies?: string,
    pt_comment?: string,
    pt_responsible_person?: string,
    //
    ord_issuer?: string,
    ord_create_dttm?: string,
    ord_requesting_phyc?: string,
    ord_referring_phyc?: string,
    ord_study_dttm?: string,
    ord_reason?: string,
    ord_rp_desc?: string,
    ord_pt_age?: string,
    ord_pt_weight?: string,
    ord_pt_size?: string,
    //
    sps_station_name?: string, // from sps sequence
    sps_desc?: string, // from sps sequence
    sps_perform_phyc_name?: string, // from sps sequence
    sps_contrast_agent?: string,
    sps_pre_med?: string, // from sps sequence
    //
    species_type?: eSpeciesType,
    species_code_meaning?: string,
    breed_code_meaning?: string
  ) {
    this.index = index;
    this.isExpand = isExpand;
    // keys
    this.pt_key = pt_key;
    this.ord_key = ord_key;
    this.sps_key = sps_key;
    this.pt_species_key = species_key;
    this.pt_breed_key = breed_key;

    // T_PATIENT
    this.pt_id = pt_id;
    this.pt_name = pt_name;
    this.pt_sex = pt_sex;

    this.pt_age = pt_age; // VR: AS(Age String, 4byte char)
    this.pt_birth_dttm = pt_birth_dttm;

    this.pt_weight = pt_weight;
    this.pt_size = pt_size;

    this.pt_address = pt_address;
    this.pt_tel = pt_tel;

    this.pt_state = pt_state;
    this.pt_med_alert = pt_med_alert;
    this.pt_allergies = pt_allergies;

    this.pt_comment = pt_comment;
    this.pt_responsible_person = pt_responsible_person;

    // T_ORDER
    this.ord_acc_num = ord_acc_num;
    this.ord_issuer = ord_issuer;
    this.ord_create_dttm = ord_create_dttm;

    this.ord_status_flag = parseOrderStatus(ord_status_flag);
    this.ord_requesting_phyc = ord_requesting_phyc;
    this.ord_referring_phyc = ord_referring_phyc;

    this.ord_study_uid = ord_study_uid;
    this.ord_study_dttm = ord_study_dttm;

    this.ord_reason = ord_reason;
    this.ord_priority = parsePriority(ord_priority);

    this.ord_rp_id = ord_rp_id;
    this.ord_rp_desc = ord_rp_desc;

    this.ord_pt_age = ord_pt_age;
    this.ord_pt_weight = ord_pt_weight;
    this.ord_pt_size = ord_pt_size;

    // T_SPS
    this.sps_id = sps_id;
    this.sps_start_dttm = sps_start_dttm;
    this.sps_end_dttm = sps_end_dttm;

    this.sps_station_ae_title = sps_station_ae_title;
    this.sps_station_name = sps_station_name;
    this.sps_modality = sps_modality;
    this.sps_bp_code_value = sps_bp_code_value;
    this.sps_bp_scm_design = sps_bp_scm_design;
    this.sps_bp_meaning = sps_bp_meaning;

    this.sps_desc = sps_desc;
    this.sps_perform_phyc_name = sps_perform_phyc_name;
    this.sps_contrast_agent = sps_contrast_agent;
    this.sps_pre_med = sps_pre_med;

    this.species_type = parseSpeciesType(species_type);
    this.species_code_meaning = species_code_meaning;
    this.breed_code_meaning = breed_code_meaning;
  }

  convertToDbInfo(): IDbWorklist {
    return {
      pt_key: this.pt_key,
      ord_key: this.ord_key,
      sps_key: this.sps_key,
      species_key: this.pt_species_key,
      breed_key: this.pt_breed_key,

      // T_PATIENT
      pt_id: this.pt_id,
      pt_name: myUtils.GetPNFromDisplayFullName(this.pt_name),
      pt_sex: this.pt_sex,

      pt_age: this.pt_age,
      pt_birth_dttm: this.pt_birth_dttm,

      pt_weight: this.pt_weight,
      pt_size: this.pt_size,

      pt_address: this.pt_address,
      pt_tel: this.pt_tel,

      pt_state: this.pt_state,
      pt_med_alert: this.pt_med_alert,
      pt_allergies: this.pt_allergies,

      pt_comment: this.pt_comment,
      pt_responsible_person: this.pt_responsible_person,

      // T_ORDER
      ord_acc_num: this.ord_acc_num,
      ord_issuer: this.ord_issuer,
      ord_create_dttm: this.ord_create_dttm,

      ord_status_flag: reverseOrderStatus(this.ord_status_flag),
      ord_requesting_phyc: this.pt_sex,
      ord_referring_phyc: this.pt_sex,

      ord_study_uid: this.pt_sex,
      ord_study_dttm: this.pt_sex,

      ord_reason: this.pt_sex,
      ord_priority: reversePriority(this.ord_priority),

      ord_rp_id: this.ord_rp_id,
      ord_rp_desc: this.ord_rp_desc,

      ord_pt_age: this.ord_pt_age,
      ord_pt_weight: this.ord_pt_weight,
      ord_pt_size: this.ord_pt_size,

      // T_SPS
      sps_id: this.sps_id, // from sps sequence
      sps_start_dttm: this.sps_start_dttm,
      sps_end_dttm: this.sps_end_dttm,

      sps_station_ae_title: this.sps_station_ae_title, // from sps sequence
      sps_station_name: this.sps_station_name, // from sps sequence
      sps_modality: this.sps_modality, // from sps sequence
      sps_bp_code_value: this.sps_bp_code_value,
      sps_bp_scm_design: this.sps_bp_scm_design,
      sps_bp_meaning: this.sps_bp_meaning,

      sps_desc: this.sps_desc, // from sps sequence
      sps_perform_phyc_name: this.sps_perform_phyc_name, // from sps sequence
      sps_contrast_agent: this.sps_contrast_agent,
      sps_pre_med: this.sps_pre_med, // from sps sequence

      species_type: reverseSpeciesType(this.species_type),
      species_code_meaning: this.species_code_meaning,
      breed_code_meaning: this.breed_code_meaning,
    };
  }

  getDbPatient(): IDbPatient {
    return {
      pt_key: this.pt_key,
      pt_species_key: this.pt_species_key,
      pt_breed_key: this.pt_breed_key,

      pt_id: this.pt_id,
      pt_name: this.pt_name,
      pt_sex: this.pt_sex,

      pt_age: this.pt_age,
      pt_birth_dttm: new Date(this.pt_birth_dttm),
      pt_weight: this.pt_weight,
      pt_size: this.pt_size,
      pt_address: this.pt_address,
      pt_tel: this.pt_tel,
      pt_state: this.pt_state,
      pt_med_alert: this.pt_med_alert,
      pt_allergies: this.pt_allergies,
      pt_comment: this.pt_comment,
      pt_responsible_person: this.pt_responsible_person,

      species_type: reverseSpeciesType(this.species_type),
      species_code_meaning: this.species_code_meaning,
      breed_code_meaning: this.breed_code_meaning,
    };
  }

  getDbOrder(): IDbOrder {
    let dateOrdCreate: undefined | Date = undefined;
    if (this.ord_create_dttm != undefined) {
      dateOrdCreate = new Date(this.ord_create_dttm);
    }

    let dateStudyDttm: undefined | Date = undefined;
    if (this.ord_study_dttm != undefined) {
      dateStudyDttm = new Date(this.ord_study_dttm);
    }

    return {
      ord_key: this.ord_key,
      ord_pt_key: this.pt_key,

      ord_acc_num: this.ord_acc_num,
      ord_issuer: this.ord_issuer,
      ord_create_dttm: dateOrdCreate,

      ord_status_flag: reverseOrderStatus(this.ord_status_flag),
      ord_requesting_phyc: this.ord_requesting_phyc,
      ord_referring_phyc: this.ord_referring_phyc,

      ord_study_uid: this.ord_study_uid,
      ord_study_dttm: dateStudyDttm,

      ord_reason: this.ord_reason,
      ord_priority: reversePriority(this.ord_priority),

      ord_rp_id: this.ord_rp_id,
      ord_rp_desc: this.ord_rp_desc,

      ord_pt_age: this.ord_pt_age,
      ord_pt_weight: this.ord_pt_weight,
      ord_pt_size: this.ord_pt_size,
    };
  }

  getDbSps(): IDbSps {
    return {
      sps_key: this.sps_key,
      sps_ord_key: this.ord_key,

      sps_id: this.sps_id,
      sps_start_dttm: new Date(this.sps_start_dttm),
      sps_end_dttm: new Date(this.sps_end_dttm),

      sps_station_ae_title: this.sps_station_ae_title,
      sps_station_name: this.sps_station_name,
      sps_modality: this.sps_modality,
      sps_bp_code_value: this.sps_bp_code_value,
      sps_bp_scm_design: this.sps_bp_scm_design,
      sps_bp_meaning: this.sps_bp_meaning,

      sps_desc: this.sps_desc,
      sps_perform_phyc_name: this.sps_perform_phyc_name,
      sps_contrast_agent: this.sps_contrast_agent,
      sps_pre_med: this.sps_pre_med,
    };
  }
}

export interface IPatientTableRow extends ICommonTableRow {
  pt_key: number;
  pt_id: string;
  pt_name: string;
  pt_sex: tPatientSex;
  pt_age: string;
  pt_birth_dttm: string;
  pt_weight?: string;
  pt_size?: string;
  pt_address?: string;
  pt_tel?: string;
  pt_state?: string;
  pt_med_alert?: string;
  pt_allergies?: string;
  pt_comment?: string;
  pt_responsible_person?: string;

  species_type?: string;
  species_code_value?: string;
  species_scm_design?: string;
  species_code_meaning?: string;
  breed_code_value?: string;
  breed_scm_design?: string;
  breed_code_meaning?: string;
}

export class PatientTableRow implements IPatientTableRow {
  index: number; // row Index
  pt_key: number; // DB Key
  pt_id: string;
  pt_name: string;
  pt_sex: tPatientSex;
  pt_age: string;
  pt_birth_dttm: string;
  pt_weight?: string;
  pt_size?: string;
  pt_address?: string;
  pt_tel?: string;
  pt_state?: string;
  pt_med_alert?: string;
  pt_allergies?: string;
  pt_comment?: string;
  pt_responsible_person?: string;
  pt_species_key?: number;
  pt_breed_key?: number;

  species_type?: string;
  species_code_value?: string;
  species_scm_design?: string;
  species_code_meaning?: string;
  breed_code_value?: string;
  breed_scm_design?: string;
  breed_code_meaning?: string;

  constructor(
    index: number,
    pt_key: number,
    pt_id: string,
    pt_name: string,
    pt_sex: tPatientSex,
    pt_age: string,
    pt_birth_dttm: string,
    pt_weight?: string,
    pt_size?: string,
    pt_address?: string,
    pt_tel?: string,
    pt_state?: string,
    pt_med_alert?: string,
    pt_allergies?: string,
    pt_comment?: string,
    pt_responsible_person?: string,
    pt_species_key?: number,
    pt_breed_key?: number,

    // For Vet
    species_type?: string,
    species_code_value?: string,
    species_scm_design?: string,
    species_code_meaning?: string,
    breed_code_value?: string,
    breed_scm_design?: string,
    breed_code_meaning?: string
  ) {
    this.index = index;
    this.pt_key = pt_key;
    this.pt_id = pt_id;
    this.pt_name = pt_name;
    this.pt_sex = pt_sex;
    this.pt_age = pt_age;
    this.pt_birth_dttm = pt_birth_dttm;
    this.pt_weight = pt_weight;
    this.pt_size = pt_size;
    this.pt_address = pt_address;
    this.pt_tel = pt_tel;
    this.pt_state = pt_state;
    this.pt_med_alert = pt_med_alert;
    this.pt_allergies = pt_allergies;
    this.pt_comment = pt_comment;
    this.pt_responsible_person = pt_responsible_person;
    this.pt_species_key = pt_species_key;
    this.pt_breed_key = pt_breed_key;
    // For Vet
    this.species_type = species_type;
    this.species_code_value = species_code_value;
    this.species_scm_design = species_scm_design;
    this.species_code_meaning = species_code_meaning;
    this.breed_code_value = breed_code_value;
    this.breed_scm_design = breed_scm_design;
    this.breed_code_meaning = breed_code_meaning;
  }

  convertToDbInfo(): IDbPatient {
    const birthDttm = new Date(this.pt_birth_dttm);

    return {
      pt_key: this.pt_key,
      pt_id: this.pt_id,
      pt_name: this.pt_name,
      pt_sex: this.pt_sex,

      pt_age: this.pt_age,
      pt_birth_dttm: birthDttm,
      pt_weight: this.pt_weight,
      pt_size: this.pt_size,
      pt_address: this.pt_address,
      pt_tel: this.pt_tel,
      pt_state: this.pt_state,
      pt_med_alert: this.pt_med_alert,
      pt_allergies: this.pt_allergies,
      pt_comment: this.pt_comment,
      pt_responsible_person: this.pt_responsible_person,

      pt_species_key: this.pt_species_key,
      pt_breed_key: this.pt_breed_key,

      // For Vet
      species_type: reverseSpeciesType(this.species_type),
      species_code_value: this.species_code_value,
      species_scm_design: this.species_scm_design,
      species_code_meaning: this.species_code_meaning,
      breed_code_value: this.breed_code_value,
      breed_scm_design: this.breed_scm_design,
      breed_code_meaning: this.breed_code_meaning,
    };
  }
}

export interface IOrderTableRow extends ICommonTableRow {
  pt_key: number;
  ord_key: number;

  // Order
  ord_acc_num: string;
  ord_issuer?: string;
  ord_create_dttm?: string;

  ord_status_flag: string;
  ord_requesting_phyc?: string;
  ord_referring_phyc?: string;

  ord_study_uid: string;
  ord_study_dttm?: string;

  ord_reason?: string;
  ord_priority: string;

  ord_rp_id: string;
  ord_rp_desc?: string;

  ord_pt_age?: string;
  ord_pt_weight?: string;
  ord_pt_size?: string;
}

export class OrderTableRow implements IOrderTableRow {
  index: number;

  pt_key: number;
  ord_key: number;

  ord_acc_num: string;
  ord_issuer?: string;
  ord_create_dttm?: string;

  ord_status_flag: string;
  ord_requesting_phyc?: string;
  ord_referring_phyc?: string;

  ord_study_uid: string;
  ord_study_dttm?: string;

  ord_reason?: string;
  ord_priority: string;

  ord_rp_id: string;
  ord_rp_desc?: string;

  ord_pt_age?: string;
  ord_pt_weight?: string;
  ord_pt_size?: string;

  constructor(
    index: number,
    pt_key: number,
    ord_key: number,

    ord_acc_num: string,
    ord_status_flag: string,
    ord_study_uid: string,
    ord_priority: string,

    ord_rp_id: string,

    ord_issuer?: string,
    ord_create_dttm?: string,
    ord_requesting_phyc?: string,
    ord_referring_phyc?: string,
    ord_study_dttm?: string,
    ord_reason?: string,

    ord_rp_desc?: string,
    ord_pt_age?: string,
    ord_pt_weight?: string,
    ord_pt_size?: string
  ) {
    this.index = index;
    this.pt_key = pt_key;

    this.ord_key = ord_key;
    this.ord_acc_num = ord_acc_num;
    this.ord_status_flag = ord_status_flag;
    this.ord_study_uid = ord_study_uid;
    this.ord_priority = ord_priority;

    this.ord_issuer = ord_issuer;
    this.ord_create_dttm = ord_create_dttm;
    this.ord_requesting_phyc = ord_requesting_phyc;
    this.ord_referring_phyc = ord_referring_phyc;
    this.ord_study_dttm = ord_study_dttm;
    this.ord_reason = ord_reason;
    this.ord_rp_id = ord_rp_id;
    this.ord_rp_desc = ord_rp_desc;
    this.ord_pt_age = ord_pt_age;
    this.ord_pt_weight = ord_pt_weight;
    this.ord_pt_size = ord_pt_size;
  }

  convertToDbInfo(): IDbOrder {
    const createDttm: Date | undefined =
      this.ord_create_dttm == undefined
        ? undefined
        : new Date(this.ord_create_dttm);
    const studyDttm: Date | undefined =
      this.ord_study_dttm == undefined
        ? undefined
        : new Date(this.ord_study_dttm);

    return {
      ord_key: this.ord_key,
      ord_pt_key: this.pt_key,

      ord_acc_num: this.ord_acc_num,
      ord_issuer: this.ord_issuer,
      ord_create_dttm: createDttm,

      ord_status_flag: reverseOrderStatus(this.ord_status_flag),
      ord_requesting_phyc: this.ord_requesting_phyc,
      ord_referring_phyc: this.ord_referring_phyc,

      ord_study_uid: this.ord_study_uid,
      ord_study_dttm: studyDttm,

      ord_reason: this.ord_reason,
      ord_priority: reversePriority(this.ord_priority),

      ord_rp_id: this.ord_rp_id,
      ord_rp_desc: this.ord_rp_desc,

      ord_pt_age: this.ord_pt_age,
      ord_pt_weight: this.ord_pt_weight,
      ord_pt_size: this.ord_pt_size,
    };
  }
}

export interface IProcPlanTableRow extends ICommonTableRow {
  key: number;
  id: string;
  desc: string;
}

export class ProcPlanTableRow implements IProcPlanTableRow {
  index: number;
  key: number;
  id: string;
  desc: string;

  protocol_ids: string;

  constructor(
    index: number,
    key: number,
    id: string,
    desc: string,
    protocol_ids: string
  ) {
    this.index = index;
    this.key = key;
    this.id = id;
    this.desc = desc;

    this.protocol_ids = protocol_ids;
  }

  convertToDbInfo(): IDbProcPlan {
    return {
      proc_plan_key: this.key,

      proc_plan_id: this.id,
      proc_plan_desc: this.desc,
    };
  }
}

export interface IProtocolTableRow extends ICommonTableRow {
  key: number;
  id: string;
  //
  station_ae_title: string;
  station_name: string;
  modality: string;
  //
  desc: string;
  perform_phyc_name: string;
  duration: number;

  start_dttm: string;
  end_dttm: string;

  prot_bp_key: number;

  bp_code_meaning: string;
  bp_scm_design: string;
  bp_code_value: string;
  //bp_meaning: string;
}

export class ProtocolTableRow implements IProtocolTableRow {
  index: number;
  key: number;
  id: string;
  //
  station_ae_title: string;
  station_name: string;
  modality: string;
  //
  desc: string;
  perform_phyc_name: string;
  duration: number;

  start_dttm: string;
  end_dttm: string;

  prot_bp_key: number;
  //
  bp_code_meaning: string;
  bp_scm_design: string;
  bp_code_value: string;

  constructor(
    index: number,
    key: number,
    id: string,
    station_ae_title: string,
    station_name: string,
    modality: string,
    desc: string,
    perform_phyc_name: string,
    //bp_meaning: string,
    duration: number,

    start_dttm: string,
    end_dttm: string,

    prot_bp_key: number,
    bp_code_meaning: string,
    bp_scm_design: string,
    bp_code_value: string
  ) {
    this.index = index;
    this.key = key;
    this.id = id;

    this.station_ae_title = station_ae_title;
    this.station_name = station_name;
    this.modality = modality;
    //
    this.desc = desc;
    this.perform_phyc_name = perform_phyc_name;
    this.duration = duration;

    this.start_dttm = start_dttm;
    this.end_dttm = end_dttm;

    this.prot_bp_key = prot_bp_key;
    this.bp_code_meaning = bp_code_meaning;
    this.bp_scm_design = bp_scm_design;
    this.bp_code_value = bp_code_value;
  }
}

export interface IBodypartTableRow extends ICommonTableRow {
  bp_key: number;
  bp_type: string;
  //
  bp_code_value: string;
  bp_scm_design: string;
  bp_code_meaning: string;
  //
  bp_snm_rt_id: string | undefined;
  bp_sub_name: string | undefined;
  bp_sub_type: string | undefined;
}

export class BodypartTableRow implements IBodypartTableRow {
  index: number;
  bp_key: number;
  bp_type: string;
  //
  bp_code_value: string;
  bp_scm_design: string;
  bp_code_meaning: string;
  //
  bp_snm_rt_id: string | undefined;
  bp_sub_name: string | undefined;
  bp_sub_type: string | undefined;

  constructor(
    index: number,
    bp_key: number,
    bp_type: string,
    //
    bp_code_value: string,
    bp_scm_design: string,
    bp_code_meaning: string,
    //
    bp_snm_rt_id: string | undefined,
    bp_sub_name: string | undefined,
    bp_sub_type: string | undefined
  ) {
    this.index = index;
    this.bp_key = bp_key;
    this.bp_type = bp_type;

    this.bp_code_value = bp_code_value;
    this.bp_scm_design = bp_scm_design;
    this.bp_code_meaning = bp_code_meaning;
    //
    this.bp_snm_rt_id = bp_snm_rt_id;
    this.bp_sub_name = bp_sub_name;
    this.bp_sub_type = bp_sub_type;
  }
}

export interface IPhysicianTableRow extends ICommonTableRow {
  key: number;
  level: string;
  id: string;
  name: string;
}

export class PhysicianTableRow implements IPhysicianTableRow {
  index: number;
  key: number;
  level: string;
  id: string;
  name: string;

  constructor(
    index: number,
    key: number,
    level: string,
    id: string,
    name: string
  ) {
    this.index = index;
    this.key = key;
    this.level = level;
    this.id = id;
    this.name = name;
  }
}

export interface IStationTableRow extends ICommonTableRow {
  station_ae_title: string;
  station_name: string;
}

export class StationTableRow implements IStationTableRow {
  index: number;
  station_ae_title: string;
  station_name: string;

  constructor(index: number, station_ae_title: string, station_name: string) {
    this.index = index;
    this.station_ae_title = station_ae_title;
    this.station_name = station_name;
  }
}

export interface IOrdReasonTableRow extends ICommonTableRow {
  ord_reason_key: number;
  ord_reason_type: string;
  ord_reason_desc: string;
}

export class OrdReasonTableRow implements IOrdReasonTableRow {
  index: number;
  ord_reason_key: number;
  ord_reason_type: string;
  ord_reason_desc: string;

  constructor(
    index: number,
    ord_reason_key: number,
    ord_reason_type: string,
    ord_reason_desc: string
  ) {
    this.index = index;
    this.ord_reason_key = ord_reason_key;
    this.ord_reason_type = ord_reason_type;
    this.ord_reason_desc = ord_reason_desc;
  }
}

export interface ISpsTableRow extends ICommonTableRow {
  key: number;
  ord_key: number;

  id: string;
  start_dttm: string;
  end_dttm: string;

  station_ae_title: string; // from sps sequence
  station_name?: string; // from sps sequence
  modality: string; // from sps sequence
  bp_code_value: string;
  bp_scm_design: string;
  bp_meaning: string;

  desc?: string; // from sps sequence
  perform_phyc_name?: string; // from sps sequence
  contrast_agent?: string;
  pre_med?: string; // from sps sequence
}

export class SpsTableRow implements ISpsTableRow {
  index: number;
  key: number;
  ord_key: number;

  id: string;
  start_dttm: string;
  end_dttm: string;

  station_ae_title: string; // from sps sequence
  station_name: string; // from sps sequence
  modality: string; // from sps sequence
  bp_code_value: string;
  bp_scm_design: string;
  bp_meaning: string;

  desc: string; // from sps sequence
  perform_phyc_name: string; // from sps sequence
  contrast_agent: string;
  pre_med: string; // from sps sequence

  constructor(
    index: number,
    key: number,
    ord_key: number,

    id: string,
    start_dttm: string,
    end_dttm: string,

    station_ae_title: string, // from sps sequence
    station_name: string, // from sps sequence
    modality: string, // from sps sequence
    bp_code_value: string,
    bp_scm_design: string,
    bp_meaning: string,

    desc: string, // from sps sequence
    perform_phyc_name: string, // from sps sequence
    contrast_agent: string,
    pre_med: string // from sps sequence
  ) {
    this.index = index;
    this.key = key;
    this.ord_key = ord_key;

    this.id = id;
    this.start_dttm = start_dttm;
    this.end_dttm = end_dttm;
    //
    this.station_ae_title = station_ae_title;
    this.station_name = station_name;
    this.modality = modality;
    this.bp_code_value = bp_code_value;
    this.bp_scm_design = bp_scm_design;
    this.bp_meaning = bp_meaning;

    this.desc = desc;
    this.perform_phyc_name = perform_phyc_name;
    this.contrast_agent = contrast_agent;
    this.pre_med = pre_med;
  }
}
