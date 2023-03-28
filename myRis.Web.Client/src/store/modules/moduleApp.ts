import * as myTypes from "@/types";
import { RootState } from "@/store/index";
import { Module } from "vuex";

import SystemService from "@/service/SystemService";

export interface IAppState {
  msgBoxInfo: myTypes.IMessageBox;
  serverInfo: myTypes.IWebServerInfo;
  clientLocale: myTypes.eLocales;
}

const AppModelModule: Module<IAppState, RootState> = {
  namespaced: true,

  state: {
    msgBoxInfo: {
      isShow: false,
      title: "",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeNone,
      resType: myTypes.eMsgBoxResType.None,
      //
      style: "",
      msg: "",
      res: myTypes.eMsgBoxRes.ResNone,
    },

    serverInfo: {
      alias: "",
      version: "",
      language: "",
      license_type: myTypes.eLicenseType.Invalid,
      //
      host_name: "",
      port_no: 0,
    },

    clientLocale: myTypes.eLocales.EN,
  },

  getters: {
    GET_MSG_BOX_INFO(state: IAppState): myTypes.IMessageBox {
      return state.msgBoxInfo;
    },
    GET_SERVER_INFO(state: IAppState): myTypes.IWebServerInfo {
      return state.serverInfo;
    },
    GET_CLIENT_LOCALE(state: IAppState): myTypes.eLocales {
      return state.clientLocale;
    },
  },

  mutations: {
    SET_MSG_BOX_INFO(state: IAppState, payload: myTypes.IMessageBox): void {
      state.msgBoxInfo = payload;
    },
    SET_SERVER_INFO(state: IAppState, payload: myTypes.IWebServerInfo): void {
      state.serverInfo = {
        alias: "",
        version: "",
        language: "",
        license_type: myTypes.eLicenseType.Invalid,
        //
        host_name: "",
        port_no: 0,
      };

      state.serverInfo = payload;
    },
    SET_CLIENT_LOCALE(state: IAppState, payload: myTypes.eLocales): void {
      state.clientLocale = payload;
    },
  },

  actions: {
    setMsgBoxInfo({ commit }, msgBoxInfo: myTypes.IMessageBox) {
      commit("SET_MSG_BOX_INFO", msgBoxInfo);
    },

    async fetServerInfo({ commit }) {
      const res = await SystemService.GetSysInfo();

      const { result, info } = res.data;

      if (result === true) {
        commit("SET_SERVER_INFO", info);
      } else {
        console.log("fetServerInfo) Failed to fetch system information.");
      }
    },

    async fetClientLocale({ commit }, locale: myTypes.eLocales) {
      commit("SET_CLIENT_LOCALE", locale);
    },

    completeMsgBoxInfo({ commit }) {
      const msgBoxInfo: myTypes.IMessageBox = {
        isShow: false,
        title: "",
        msgType: myTypes.eMsgBoxMsgType.MsgTypeNone,
        resType: myTypes.eMsgBoxResType.None,
        style: "",

        msg: "",
        res: myTypes.eMsgBoxRes.ResNone,
      };

      commit("SET_MSG_BOX_INFO", msgBoxInfo);
    },
  },
};

export default AppModelModule;
