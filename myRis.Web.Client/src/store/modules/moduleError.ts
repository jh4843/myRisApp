import { IServiceFailReason } from "@/types";

import { RootState } from "@/store/index";
import { Module } from "vuex";

//import request from "@/service/http-common";

export interface IErrorState {
  serviceFailReason: IServiceFailReason[];
}

const ErrorModule: Module<IErrorState, RootState> = {
  namespaced: true,

  state: {
    serviceFailReason: [
      // Common: 10001 ~ 11000
      {
        code: 10001,
        desc: "Database connection fail",
      },
      {
        code: 10002,
        desc: "Query error",
      },
      {
        code: 10003,
        desc: "Invalid query condition (Empty)",
      },
      // User: 11001 ~ 12000
      {
        code: 11001,
        desc: "No account",
      },
      {
        code: 11002,
        desc: "Wrong password",
      },
      {
        code: 11003,
        desc: "Invalid input (ID)",
      },
      {
        code: 11004,
        desc: "Invalid input (Password)",
      },
      {
        code: 11005,
        desc: "Duplicate account ID",
      },
      {
        code: 11006,
        desc: "Incorrect confirmed password",
      },
      {
        code: 11007,
        desc: "Not registered account ID",
      },
      // MWL: 12001 ~ 13000
      {
        code: 12001,
        desc: "No patient",
      },
      {
        code: 12002,
        desc: "Invalid patient ID",
      },
      {
        code: 12003,
        desc: "Invalid patient name",
      },
      {
        code: 12004,
        desc: "Invalid birth day",
      },
      {
        code: 12005,
        desc: "Invalid patient key",
      },
      {
        code: 12006,
        desc: "Invalid acc no key",
      },
      {
        code: 12007,
        desc: "Invalid study UID",
      },
      {
        code: 12008,
        desc: "Failed to insert order",
      },
      {
        code: 12009,
        desc: "Invalid order key",
      },
      {
        code: 12010,
        desc: "Invalid Scheduled Procedure Step(SPS) ID",
      },
      {
        code: 12011,
        desc: "Invalid Scheduled Procedure Step(SPS) Start Datetime",
      },
      {
        code: 12012,
        desc: "Invalid Scheduled Procedure Step(SPS) End Datetime",
      },
      {
        code: 12013,
        desc: "Invalid Station AE Title",
      },
      {
        code: 12014,
        desc: "Invalid Station Name",
      },
      {
        code: 12015,
        desc: "Invalid Requested Procedure(RP) ID",
      },
      {
        code: 12016,
        desc: "Invalid Station AE Title List",
      },
      {
        code: 12017,
        desc: "Invalid Scheduled Procedure Step(SPS) ID List",
      },
      {
        code: 12018,
        desc: "Invalid Requested Procedure(RP) ID List",
      },
      {
        code: 12019,
        desc: "Invalid selected Item ID",
      },
      {
        code: 12020,
        desc: "Need to add one more Scheduled Procedure Step(s)",
      },
      {
        code: 12021,
        desc: "Invalid Scheduled Procedure Step(SPS) key",
      },
      {
        code: 12022,
        desc: "Invalid Accession Number",
      },
      {
        code: 12023,
        desc: "The order cannot be updated due to the status",
      },
      {
        code: 12024,
        desc: "Invalid Type",
      },
      {
        code: 12025,
        desc: "Invalid Description",
      },
      {
        code: 12026,
        desc: "Invalid Key",
      },
      {
        code: 12027,
        desc: "Invalid Code Value",
      },
      {
        code: 12028,
        desc: "Invalid Code Type",
      },
      {
        code: 12029,
        desc: "Invalid Code Key List",
      },
      {
        code: 12030,
        desc: "Failed to get Bodypart",
      },
      {
        code: 12031,
        desc: "Failed to generate Bodypart Value",
      },
      {
        code: 12032,
        desc: "Failed to add Bodypart [Duplicate code meaning]",
      },
      {
        code: 12033,
        desc: "Invalid Protocol Plan Key",
      },
      // System: 13001 ~ 14000
      {
        code: 13001,
        desc: "Failed to export database table",
      },
      {
        code: 13002,
        desc: "Failed to compress export files",
      },
    ],
  },

  getters: {
    GET_SERVICE_FAIL_REASON_DESC: (state: IErrorState) => (code: number) => {
      console.log("GET_SERVICE_FAIL_REASON_DESC", code);

      const res = state.serviceFailReason.find((reason) => reason.code == code);

      console.log("GET_SERVICE_FAIL_REASON_DESC", res);

      if (res === undefined) return undefined;

      return res.desc;
    },
  },
};

export default ErrorModule;
