import * as mwlDb from "./_database";
import * as mwlType from "./_types";
import { IServiceBaseResponse, IServiceBaseRequest } from "../common";

export type tMwlSortColumn =
  | "T_PATIENT.pt_key"
  | "T_ORDER.ord_key"
  | "T_SPS.sps_key"
  | "T_PATIENT.pt_id"
  | "T_PATIENT.pt_name"
  | "T_PATIENT.pt_sex"
  | "T_PATIENT.pt_birth_dttm"
  | "T_ORDER.ord_acc_num"
  | "T_ORDER.ord_requesting_phyc"
  | "T_ORDER.ord_referring_phyc"
  | "T_ORDER.ord_study_uid"
  | "T_ORDER.ord_study_dttm"
  | "T_SPS.sps_id"
  | "T_SPS.sps_start_dttm"
  | "T_SPS.sps_station_name"
  | "T_SPS.sps_modality"
  | "T_SPS.sps_perform_phyc_name"
  | "T_SPS.sps_pre_med";

export type tSortOrder = "ASC" | "DESC";

export interface IMwlGetWorklistQueryCondition extends IServiceBaseRequest {
  reqSortColumn?: tMwlSortColumn;
  reqSortOrder?: tSortOrder;

  // Patient
  pt_id?: string;
  pt_name?: string;

  // Order
  ord_acc_num?: string;
  ord_rp_id?: string;
  ord_status?: mwlType.eOrderStatus;
  ord_referring_phyc?: string;
  proc_plan_id?: string;

  // SPS
  sps_modality?: string;
  sps_start_dttm_from?: Date;
  sps_start_dttm_to?: Date;
  sps_station_ae_title?: string;
}
export interface IMwlGetWorklistResponse extends IServiceBaseResponse {
  data: mwlDb.IDbWorklist[];
}

export interface IMwlGetPatientListQueryCondition extends IServiceBaseRequest {
  pt_key?: number;
  pt_id?: string;
  pt_name?: string;
}

export interface IMwlGetPatientListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbPatient[];
}

export interface IMwlGetOrderListQueryCondition extends IServiceBaseRequest {
  ord_key?: number;

  acc_num?: string;
  pt_id?: string;
  pt_name?: string;
}

export interface IMwlGetOrderListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbOrderJoinPatient[];
}

export interface IMwlGetSpsListQueryCondition extends IServiceBaseRequest {
  ord_key?: number;
  sps_keys?: string;
}
export interface IMwlGetSpsListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbSps[];
}

export interface IMwlGetProcPlanListQueryCondition extends IServiceBaseRequest {
  proc_plan_id?: string;
  proc_plan_desc?: string;
}
export interface IMwlGetProcPlanListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbProcPlan[];
}

export interface IMwlGetProtocolListQueryCondition extends IServiceBaseRequest {
  proc_plan_key?: number;
  protocol_keys?: number[];
  prot_desc?: string;
}
export interface IMwlGetProtocolListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbProtocol[];
}

export interface IMwlGetBodypartListQueryCondition extends IServiceBaseRequest {
  bp_keys?: number[];
  bp_code_meaning?: string;
}
export interface IMwlGetBodypartListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbBodypart[];
}

export interface IMwlGetSpeciesListQueryCondition extends IServiceBaseRequest {
  species_key?: number[];
  species_type?: mwlType.eSpeciesType;
}
export interface IMwlGetSpeciesListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbSpecies[];
}

export interface IMwlGetBreedListQueryCondition extends IServiceBaseRequest {
  breed_key?: number[];
  breed_species_type?: mwlType.eSpeciesType;
}
export interface IMwlGetBreedListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbBreed[];
}

export interface IMwlGetNewAccNumberRequest extends IServiceBaseRequest {} // Empty
export interface IMwlGetNewAccNumberResponse extends IServiceBaseResponse {
  acc_num: string;
}

export interface IMwlGetNewBodypartRequest extends IServiceBaseRequest {} // Empty
export interface IMwlGetNewBodypartResponse extends IServiceBaseResponse {
  bp_value: string;
}

export interface IMwlGetStationListQueryCondition extends IServiceBaseRequest {
  station_ae_title?: string;
  station_name?: string;
}

export interface IMwlGetStationListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbStation[];
}

export interface IMwlGetOrdReasonListQueryCondition
  extends IServiceBaseRequest {
  ord_reason_type?: mwlType.eOrdReasonType;
}

export interface IMwlGetOrdReasonListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbOrdReason[];
}

export interface IMwlGetBpListQueryCondition extends IServiceBaseRequest {
  bp_key?: number;
  bp_code_meaning?: string;
}

export interface IMwlGetBpListResponse extends IServiceBaseResponse {
  data: mwlDb.IDbBodypart[];
}

////////////////////////////////////////////////////////////////////////////
// Instance
////////////////////////////////////////////////////////////////////////////

// Add
export interface IMwlAddPatientRequest
  extends IServiceBaseRequest,
    mwlDb.IDbPatient {}
export interface IMwlAddPatientResponse extends IServiceBaseResponse {
  pt_key: number;
}

export interface IMwlAddOrderRequest
  extends IServiceBaseRequest,
    mwlDb.IDbOrder {}
export interface IMwlAddOrderResponse extends IServiceBaseResponse {
  ord_key: number;
}

export interface IMwlAddSpsRequest extends IServiceBaseRequest, mwlDb.IDbSps {}
export interface IMwlAddSpsResponse extends IServiceBaseResponse {
  sps_key: number;
}

export interface IMwlAddSpsListRequest extends IServiceBaseRequest {
  sps_list: mwlDb.IDbSps[];
}
export interface IMwlAddSpsListResponse extends IServiceBaseResponse {
  sps_key_list: number[];
}

//Update
export interface IMwlUpdateOrderStatusRequest extends IServiceBaseRequest {
  ord_key_list?: number[];
  ord_acc_no_list?: string[];

  ord_status: mwlType.eOrderStatus;
}
export interface IMwlUpdateOrderStatusResponse extends IServiceBaseResponse {}

// Delete
export interface IMwlDeleteOrderRequest extends IServiceBaseRequest {
  ord_key_list?: number[];
  ord_acc_no_list?: string[];
}
export interface IMwlDeleteOrderResponse extends IServiceBaseResponse {}

////////////////////////////////////////////////////////////////////////////
//  Setting
////////////////////////////////////////////////////////////////////////////

// Add
export interface IMwlAddProcPlanRequest
  extends IServiceBaseRequest,
    mwlDb.IDbProcPlan {
  prot_key_list: number[];
}
export interface IMwlAddProcPlanResponse extends IServiceBaseResponse {
  proc_plan_key: number;
}

export interface IMwlAddProtocolRequest
  extends IServiceBaseRequest,
    mwlDb.IDbProtocol {}
export interface IMwlAddProtocolResponse extends IServiceBaseResponse {
  prot_key: number;
}

export interface IMwlAddBodypartRequest
  extends IServiceBaseRequest,
    mwlDb.IDbBodypart {}
export interface IMwlAddBodypartResponse extends IServiceBaseResponse {
  bp_key: number;
  bp_scm_design?: string;
  bp_code_value?: string;
}

export interface IMwlAddStationRequest
  extends IServiceBaseRequest,
    mwlDb.IDbStation {}
export interface IMwlAddStationResponse extends IServiceBaseResponse {
  station_key: number;
}

export interface IMwlAddOrdReasonRequest
  extends IServiceBaseRequest,
    mwlDb.IDbOrdReason {}
export interface IMwlAddOrdReasonResponse extends IServiceBaseResponse {
  ord_reason_key: number;
}

// Delete
export interface IMwlDeleteProcPlanRequest extends IServiceBaseRequest {
  proc_plan_id_list: string[];
}
export interface IMwlDeleteProcPlanResponse extends IServiceBaseResponse {}

export interface IMwlDeleteProtocolRequest extends IServiceBaseRequest {
  protocol_id_list: string[];
}
export interface IMwlDeleteProtocolResponse extends IServiceBaseResponse {}

export interface IMwlDeleteBodypartRequest extends IServiceBaseRequest {
  bp_key_list: number[];
}
export interface IMwlDeleteBodypartResponse extends IServiceBaseResponse {}

export interface IMwlDeleteStationRequest extends IServiceBaseRequest {
  station_ae_title_list: string[];
}
export interface IMwlDeleteStationResponse extends IServiceBaseResponse {}

export interface IMwlDeleteOrdReasonRequest extends IServiceBaseRequest {
  ord_reason_key: number[];
}
export interface IMwlDeleteOrdReasonResponse extends IServiceBaseResponse {}

// Update
export interface IMwlUpdatePatientRequest
  extends IServiceBaseRequest,
    mwlDb.IDbPatient {}
export interface IMwlUpdatePatientResponse extends IServiceBaseResponse {
  pt_key: number;
}

export interface IMwlUpdateOrderRequest
  extends IServiceBaseRequest,
    mwlDb.IDbOrder {}
export interface IMwlUpdateOrderResponse extends IServiceBaseResponse {
  ord_key: number;
}

export interface IMwlUpdateSpsRequest
  extends IServiceBaseRequest,
    mwlDb.IDbSps {}
export interface IMwlUpdateSpsResponse extends IServiceBaseResponse {
  sps_key: number;
}

export interface IMwlUpdateSpsListRequest extends IServiceBaseRequest {
  sps_list: mwlDb.IDbSps[];
}
export interface IMwlUpdateSpsListResponse extends IServiceBaseResponse {
  sps_key: number[];
}

export interface IMwlUpdateProcPlanRequest
  extends IServiceBaseRequest,
    mwlDb.IDbProcPlan {
  prot_key_list?: number[];
}
export interface IMwlUpdateProcPlanResponse extends IServiceBaseResponse {
  proc_plan_key: number;
}

export interface IMwlUpdateProtocolRequest
  extends IServiceBaseRequest,
    mwlDb.IDbProtocol {
  org_protocol_id: string;
}
export interface IMwlUpdateProtocolResponse extends IServiceBaseResponse {
  prot_key: number;
}

export interface IMwlUpdateBodypartRequest
  extends IServiceBaseRequest,
    mwlDb.IDbBodypart {
  org_bp_key: number;
}
export interface IMwlUpdateBodypartResponse extends IServiceBaseResponse {
  bp_key: number;
}

export interface IMwlUpdateStationRequest
  extends IServiceBaseRequest,
    mwlDb.IDbStation {
  org_station_ae_title: string;
}
export interface IMwlUpdateStationResponse extends IServiceBaseResponse {
  station_key: number;
}

export interface IMwlUpdateOrdReasonRequest
  extends IServiceBaseRequest,
    mwlDb.IDbOrdReason {}
export interface IMwlUpdateOrdReasonResponse extends IServiceBaseResponse {
  ord_reason_key: number;
}
