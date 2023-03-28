import * as myTypes from "./_types";

export const dataSeparator = "||";

export const PatientAllColumns = `
  T_PATIENT.pt_key, 
  T_PATIENT.pt_id, 
  T_PATIENT.pt_name,  
  T_PATIENT.pt_sex, 
  T_PATIENT.pt_age, 
  T_PATIENT.pt_birth_dttm,
  T_PATIENT.pt_weight, 
  T_PATIENT.pt_size, 
  T_PATIENT.pt_address, 
  T_PATIENT.pt_tel, 
  T_PATIENT.pt_state, 
  T_PATIENT.pt_med_alert,
  T_PATIENT.pt_allergies, 
  T_PATIENT.pt_comment,
  T_PATIENT.pt_responsible_person,
  T_PATIENT.pt_species_key,
  T_PATIENT.pt_breed_key
  `;

export const VetPatientAllColumns = `
  T_PATIENT.pt_key, 
  T_PATIENT.pt_id, 
  T_PATIENT.pt_name,  
  T_PATIENT.pt_sex, 
  T_PATIENT.pt_age, 
  T_PATIENT.pt_birth_dttm,
  T_PATIENT.pt_weight, 
  T_PATIENT.pt_size, 
  T_PATIENT.pt_address, 
  T_PATIENT.pt_tel, 
  T_PATIENT.pt_state, 
  T_PATIENT.pt_med_alert,
  T_PATIENT.pt_allergies, 
  T_PATIENT.pt_comment,
  T_PATIENT.pt_responsible_person,
  T_PATIENT.pt_species_key,
  T_PATIENT.pt_breed_key,

  T_SPECIES.species_type,
  T_SPECIES.species_code_value,
  T_SPECIES.species_scm_design,
  T_SPECIES.species_code_meaning,

  T_BREED.breed_code_value,
  T_BREED.breed_scm_design,
  T_BREED.breed_code_meaning
  `;

export const OrderAllColumns = `
  T_ORDER.ord_key, 
  T_ORDER.ord_acc_num, 
  T_ORDER.ord_issuer, 
  T_ORDER.ord_create_dttm, 
  T_ORDER.ord_status_flag, 
  T_ORDER.ord_requesting_phyc, 
  T_ORDER.ord_referring_phyc, 
  T_ORDER.ord_study_uid, 
  T_ORDER.ord_study_dttm, 
  T_ORDER.ord_reason, 
  T_ORDER.ord_priority, 
  T_ORDER.ord_rp_id, 
  T_ORDER.ord_rp_desc, 
  T_ORDER.ord_pt_age, 
  T_ORDER.ord_pt_weight, 
  T_ORDER.ord_pt_size
  `;

export const SpsAllColumns = `
  T_SPS.sps_key,
  T_SPS.sps_id,
  T_SPS.sps_start_dttm, 
  T_SPS.sps_end_dttm, 
  T_SPS.sps_station_ae_title,
  T_SPS.sps_station_name, 
  T_SPS.sps_modality,
  T_SPS.sps_bp_code_value,
  T_SPS.sps_bp_scm_design, 
  T_SPS.sps_bp_meaning,
  T_SPS.sps_desc, 
  T_SPS.sps_perform_phyc_name, 
  T_SPS.sps_contrast_agent, 
  T_SPS.sps_pre_med
  `;

export const ProcPlanAllColumns = `
  T_PROC_PLAN.proc_plan_key,
  T_PROC_PLAN.proc_plan_id,
  T_PROC_PLAN.proc_plan_desc 
  `;

export const ProtocolAllColumns = `
  T_PROTOCOL.prot_key, T_PROTOCOL.prot_id,
  T_PROTOCOL.prot_station_ae_title,
  T_PROTOCOL.prot_station_name,
  T_PROTOCOL.prot_modality,
  T_PROTOCOL.prot_desc, 
  T_PROTOCOL.prot_perform_phyc_name, 
  T_PROTOCOL.prot_bp_key, 
  T_PROTOCOL.prot_duration 
  `;

export const IProcPlanProtAllColumns = `
  I_PROCPLAN_PROT.pp_prot_proc_plan_key,
  I_PROCPLAN_PROT.pp_prot_prot_key
  `;

export const BodypartAllColumns = `
  T_BODYPART.bp_key,
  T_BODYPART.bp_type,
  T_BODYPART.bp_code_value,
  T_BODYPART.bp_scm_design,
  T_BODYPART.bp_code_meaning,
  T_BODYPART.bp_snm_rt_id, 
  T_BODYPART.bp_sub_name, 
  T_BODYPART.bp_sub_type
  `;

export const StationAllColumns = `
  T_STATION.station_key,
  T_STATION.station_ae_title,
  T_STATION.station_name
  `;

export const SpeciesAllColumns = `
  T_SPECIES.species_key, 
  T_SPECIES.species_type, 
  T_SPECIES.species_code_value, 
  T_SPECIES.species_scm_design, 
  T_SPECIES.species_code_meaning
  `;

export const BreedAllColumns = `
  T_BREED.breed_key, 
  T_BREED.breed_species_type, 
  T_BREED.breed_code_value, 
  T_BREED.breed_scm_design, 
  T_BREED.breed_code_meaning
  `;

// Patient Table (T_PATIENT)
export interface IDbPatient {
  pt_key: number;

  pt_id: string; // required
  pt_name: string; // required
  pt_sex: myTypes.tPatientSex;

  pt_age: string; // VR: AS(Age String, 4byte char)
  pt_birth_dttm: Date; // required

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

  // JOINED DATA (For VET)
  //
  // T_SPECIES
  species_type?: myTypes.eSpeciesType;
  species_code_value?: string;
  species_scm_design?: string;
  species_code_meaning?: string;

  // T_BREED
  breed_code_value?: string;
  breed_scm_design?: string;
  breed_code_meaning?: string;
}

// Code Sequence Table (T_ORDER)
export interface IDbOrder {
  ord_key: number;
  ord_pt_key: number;

  ord_acc_num: string;
  ord_issuer?: string;
  ord_create_dttm?: Date;

  ord_status_flag: myTypes.eOrderStatus;
  ord_requesting_phyc?: string;
  ord_referring_phyc?: string;

  ord_study_uid: string;
  ord_study_dttm?: Date;

  ord_reason?: string;
  ord_priority: myTypes.eOrderPriority;

  ord_rp_id: string;
  ord_rp_desc?: string;

  ord_pt_age?: string;
  ord_pt_weight?: string;
  ord_pt_size?: string;
}

// Scheduled Procedure Step Table (T_SPS)
export interface IDbSps {
  sps_key: number;
  sps_ord_key: number;

  sps_id: string; // from sps sequence
  sps_start_dttm: Date;
  sps_end_dttm: Date;

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
}

export interface IProcPlanProtocol {
  prot_key: number;

  prot_id?: string;
  prot_desc?: string;
}

// Requested Procedure Sequence Table (T_PROC_PLAN)
export interface IDbProcPlan {
  proc_plan_key: number;

  proc_plan_id: string;
  proc_plan_desc?: string;

  // T_PROTOCOL
  proc_plan_protocols?: IProcPlanProtocol[];
}

// Scheduled Procedure Step Sequence Table (T_PROTOCOL)
export interface IDbProtocol {
  prot_key: number;

  prot_id: string;
  prot_station_ae_title: string;
  prot_station_name: string;
  prot_modality: string;

  prot_desc: string;
  prot_perform_phyc_name: string;
  prot_duration: number;

  prot_bp_key: number;

  // Bodypart Info (JOINED Data)
  bp_type?: myTypes.eBodypartType;
  bp_code_value?: string;
  bp_scm_design?: string;
  bp_code_meaning?: string;
  bp_snm_rt_id?: string;
  bp_sub_name?: string;
  bp_sub_type?: myTypes.eBodypartSubType;
}

export interface IDbBodypart {
  bp_key: number;
  bp_type: myTypes.eBodypartType;
  bp_code_value: string;
  bp_scm_design: string;
  bp_code_meaning: string;
  bp_snm_rt_id?: string;
  bp_sub_name?: string;
  bp_sub_type: myTypes.eBodypartSubType;
}

export interface IDbSpecies {
  species_key: number;
  species_type: myTypes.eSpeciesType;
  species_code_value: string;
  species_scm_design: string;
  species_code_meaning: string;
}

export interface IDbBreed {
  breed_key: number;
  breed_species_type: myTypes.eSpeciesType;
  breed_code_value: string;
  breed_scm_design: string;
  breed_code_meaning: string;
  breed_snm_rt_id?: string;
  breed_umls_concept_uid?: string;
}

export interface IDbStation {
  station_key: number;
  station_ae_title: string;
  station_name: string;
}

export interface IDbOrdReason {
  ord_reason_key: number;
  ord_reason_type: myTypes.eOrdReasonType;
  ord_reason_desc: string;
}

// For Joined table's data
export interface IDbWorklist {
  // keys
  pt_key: number;
  ord_key: number;
  sps_key: number;
  species_key?: number;
  breed_key?: number;

  // T_PATIENT
  pt_id: string; // required
  pt_name: string; // required
  pt_sex: myTypes.tPatientSex; // required

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

  ord_status_flag: myTypes.eOrderStatus;
  ord_requesting_phyc?: string;
  ord_referring_phyc?: string;

  ord_study_uid: string;
  ord_study_dttm?: string;

  ord_reason?: string;
  ord_priority: myTypes.eOrderPriority;

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
  species_type?: myTypes.eSpeciesType;
  species_code_value?: string;
  species_scm_design?: string;
  species_code_meaning?: string;

  // T_BREED
  breed_species_type?: myTypes.eSpeciesType;
  breed_code_value?: string;
  breed_scm_design?: string;
  breed_code_meaning?: string;
  breed_snm_rt_id?: string;
  breed_umls_concept_uid?: string;
}

export interface IDbOrderJoinPatient extends IDbOrder, IDbPatient {}

export interface IDbSpsJoinOrder extends IDbSps, IDbOrder {}
