import * as myTypes from "@/types";
import MwlService from "@/service/MwlService";
import { RootState } from "@/store/index";
import { Module } from "vuex";

//import request from "@/service/http-common";

export interface IMwlInfoState {
  isNeedMwlMainTableUpdate: boolean;
  mwlMainTableType: myTypes.eMwlMainTableType;
  mwlSearchCondition: myTypes.IMwlGetWorklistQueryCondition;
  selectedMwlMainTableItems: myTypes.IDbWorklist[];
  //
  SearchedPatientList: myTypes.IDbPatient[];
}

const MwlModelModule: Module<IMwlInfoState, RootState> = {
  namespaced: true,

  state: {
    isNeedMwlMainTableUpdate: false,
    mwlMainTableType: myTypes.eMwlMainTableType.table_type_mwl_main_order,
    mwlSearchCondition: {
      reqPage: 1,
      reqCount: 15,
      reqSortOrder: "ASC",
      reqSortColumn: "T_PATIENT.pt_name",

      pt_id: "",
      pt_name: "",

      sps_start_dttm_from: new Date("1900-01-01T00:00:00"),
      sps_start_dttm_to: new Date(),

      ord_acc_num: "",
      proc_plan_id: "",
      sps_modality: "",

      ord_referring_phyc: "",
    },
    selectedMwlMainTableItems: [],
    //
    SearchedPatientList: [],
  },

  getters: {
    GET_MWL_SEARCH_CONDITION(
      state: IMwlInfoState
    ): myTypes.IMwlGetWorklistQueryCondition {
      return state.mwlSearchCondition;
    },

    GET_IS_NEED_UPDATE_MWL_MAIN_TABLE(state: IMwlInfoState): boolean {
      return state.isNeedMwlMainTableUpdate;
    },

    GET_MWL_MAIN_TABLE_TYPE(state: IMwlInfoState): myTypes.eMwlMainTableType {
      return state.mwlMainTableType;
    },

    GET_SELECTED_MWL_MAIN_TABLE_LIST(
      state: IMwlInfoState
    ): myTypes.IDbWorklist[] {
      return state.selectedMwlMainTableItems;
    },

    ///////// For Patient
    GET_SEARCHED_PATIENTS(state: IMwlInfoState): myTypes.IDbPatient[] {
      return state.SearchedPatientList;
    },
  },

  mutations: {
    SET_SEARCHED_PATIENTS(
      state: IMwlInfoState,
      payload: myTypes.IDbPatient[]
    ): void {
      state.SearchedPatientList = [];

      for (const mwlPatient of payload) {
        state.SearchedPatientList.push(mwlPatient);
      }
    },

    SET_MWL_SEARCH_CONDITION(
      state: IMwlInfoState,
      payload: myTypes.IMwlGetWorklistQueryCondition
    ): void {
      state.mwlSearchCondition = payload;
    },

    SET_UPDATE_MWL_MAIN_TABLE(state: IMwlInfoState): void {
      state.isNeedMwlMainTableUpdate = !state.isNeedMwlMainTableUpdate;
    },

    SET_MWL_MAIN_TABLE_TYPE(
      state: IMwlInfoState,
      payload: myTypes.eMwlMainTableType
    ): void {
      state.mwlMainTableType = payload;
    },

    SET_SELECTED_MWL_MAIN_TABLE_IMTES(
      state: IMwlInfoState,
      payload: myTypes.IDbWorklist[]
    ): void {
      while (state.selectedMwlMainTableItems.length > 0) {
        state.selectedMwlMainTableItems.pop();
      }

      for (const item of payload) {
        state.selectedMwlMainTableItems.push(item);
      }
    },
  },

  actions: {
    setMwlSearhCondition(
      { commit },
      searchCondition: myTypes.IMwlGetWorklistQueryCondition
    ) {
      commit("SET_MWL_SEARCH_CONDITION", searchCondition);
    },

    setUpdateMwlMainTable({ commit }) {
      commit("SET_UPDATE_MWL_MAIN_TABLE");
    },

    setMwlMainTableType(
      { commit },
      mwlMainTableType: myTypes.eMwlMainTableType
    ) {
      commit("SET_MWL_MAIN_TABLE_TYPE", mwlMainTableType);
    },

    setSelectedMwlMainTableItems(
      { commit },
      selectedMwlItems: myTypes.IDbWorklist[]
    ) {
      commit("SET_SELECTED_MWL_MAIN_TABLE_IMTES", selectedMwlItems);
    },

    async fetchPatientInfo(
      { commit },
      queryCondition: myTypes.IMwlGetPatientListQueryCondition
    ) {
      const promiseResponse = await MwlService.GetPatientList(queryCondition);

      const response: myTypes.IMwlGetPatientListResponse = promiseResponse.data;

      if (!response) {
        throw Error(
          "fetchMwlInfoByCondfetchPatientInfoition: IMwlGetPatientListResponse is undefined!"
        );
      }

      const result: boolean = response.result;

      if (result) {
        const rows: myTypes.IDbPatient[] = response.data;
        commit("SET_SEARCHED_PATIENTS", rows);
      } else {
        const err_code: undefined | string | number = response.err_code;
        console.log("Failed to fetchWorklist: ", err_code);

        commit("SET_SEARCHED_PATIENTS", []);
      }
    },
  },
};

export default MwlModelModule;
