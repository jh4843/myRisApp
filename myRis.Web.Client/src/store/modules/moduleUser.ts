import * as myTypes from "@/types";
import { RootState } from "@/store/index";
import { Module } from "vuex";
import UserDataService from "@/service/UserService";

interface ISignInInfo {
  isSignIn: boolean;
  signInDttm: Date;
}

export interface IUserInfoState {
  curUser: myTypes.IDbUser;
  searchedUsers: myTypes.IDbUser[];
  signInInfo: ISignInInfo;
}

const UserModelModule: Module<IUserInfoState, RootState> = {
  namespaced: true,

  state: {
    curUser: {
      user_key: 0,
      user_level: myTypes.eUserLevel.Admin,
      user_id: "",
      user_pwd: "",
      user_name: "",
      user_desc: "",
      user_create_dttm: new Date(),
    },
    searchedUsers: [],

    signInInfo: {
      isSignIn: false,
      signInDttm: new Date(),
    },
  },

  getters: {
    IS_SIGN_IN(state: IUserInfoState): boolean {
      return state.signInInfo.isSignIn;
    },

    IS_CUR_USER_MANAGER(state: IUserInfoState): boolean {
      if (state.curUser.user_level < myTypes.eUserLevel.Admin) {
        return true;
      }

      return false;
    },

    GET_CUR_USER(state: IUserInfoState): myTypes.IDbUser {
      return state.curUser;
    },

    GET_SEARCHED_USERS(state: IUserInfoState): myTypes.IDbUser[] {
      return state.searchedUsers;
    },
  },

  mutations: {
    SET_CUR_USER(state: IUserInfoState, payload: myTypes.IDbUser): void {
      const oldIsSignIn: boolean = state.curUser.user_key > 0 ? true : false;

      state.curUser = payload;

      state.signInInfo.signInDttm = new Date();
      if (oldIsSignIn == false && state.curUser.user_key > 0) {
        console.log(`Sign-In (${state.curUser.user_id})`);
        state.signInInfo.isSignIn = true;
        localStorage.setItem(
          myTypes.storageKeyCurUser,
          JSON.stringify(state.curUser)
        );
        localStorage.setItem(
          myTypes.storageKeySignInInfo,
          JSON.stringify(state.signInInfo)
        );
      } else if (oldIsSignIn == true && state.curUser.user_key <= 0) {
        console.log("Sign-Out");
        state.signInInfo.isSignIn = false;
        localStorage.setItem(
          myTypes.storageKeyCurUser,
          JSON.stringify(state.curUser)
        );
        localStorage.setItem(
          myTypes.storageKeySignInInfo,
          JSON.stringify(state.signInInfo)
        );
      }
    },

    SET_SEARCHED_USERS(
      state: IUserInfoState,
      payload: myTypes.IDbUser[]
    ): void {
      state.searchedUsers = payload;
    },

    RESET_CUR_USER(state: IUserInfoState): void {
      state.curUser = {
        user_key: 0,
        user_level: myTypes.eUserLevel.Admin,
        user_id: "",
        user_pwd: "",
        user_name: "",
        user_desc: "",
        user_create_dttm: new Date(),
      };

      state.signInInfo.isSignIn = false;
      state.signInInfo.signInDttm = new Date();

      localStorage.removeItem(myTypes.storageKeyCurUser);
      localStorage.removeItem(myTypes.storageKeySignInInfo);

      console.log("Sign-Out");
    },
  },

  actions: {
    async loadCurUserFromLocalStorage({ commit }) {
      const storedUser = localStorage.getItem(myTypes.storageKeyCurUser);
      const storedSignInInfo = localStorage.getItem(
        myTypes.storageKeySignInInfo
      );

      if (storedSignInInfo != null && storedSignInInfo != undefined) {
        const signInInfo = JSON.parse(storedSignInInfo);
        const today = new Date();
        const signInDttm = new Date(signInInfo.signInDttm);

        const todayDate = today.getDate();
        const signInDate = signInDttm.getDate();

        if (todayDate > signInDate) return;
      }

      if (storedUser != null && storedUser != undefined) {
        const user = JSON.parse(storedUser);

        const curUser: myTypes.IDbUser = {
          user_key: user.user_key,
          user_level: user.user_level,
          user_id: user.user_id,
          user_pwd: user.user_pwd,
          user_name: user.user_name,
          user_desc: user.user_desc,
          user_create_dttm: new Date(user.user_create_dttm),
        };
        commit("SET_CUR_USER", curUser);
      }

      // if(user != null && user != undefined) {
      //   const curUser:IDbUser = {
      //     user_key: user.user_ke,
      //     user_level: tUserLevelName,
      //     user_id: string,
      //     user_pwd: string,
      //     user_name: string,
      //     user_desc: string,
      //     user_create_dttm: Date,
      //   }

      //   commit("SET_CUR_USER", curUser);
      // }
      // else {
      //   commit("RESET_CUR_USER");
      // }
    },

    async fetchSearchedUsers(
      { commit },
      queryCondition: myTypes.IUserGetUserQueryCondition
    ) {
      const userInfo = await UserDataService.GetUser(queryCondition);

      if (!userInfo) {
        throw Error("fetchGetUserList: User data is undefined!");
      }

      const { users } = userInfo.data;

      commit("SET_SEARCHED_USERS", users);
    },

    async fetCurUser({ state, commit }) {
      if (state.curUser == undefined || state.curUser.user_id == undefined)
        return;

      const queryCondition: myTypes.IUserGetUserQueryCondition = {
        user_id: state.curUser.user_id,

        is_strict_condition: true,
      };

      const userInfo = await UserDataService.GetUser(queryCondition);

      if (!userInfo) {
        throw Error("fetchGetUserList: User data is undefined!");
      }

      const { users } = userInfo.data;

      if (users === undefined || users.length <= 0) {
        console.log("User List Empty");
        return;
      } else if (users.length > 1) {
        console.log("Multiple users were found.");
      }

      commit("SET_CUR_USER", users[0]);
    },

    async fetchSetCurUserById({ commit }, reqID: string) {
      const queryCondition: myTypes.IUserGetUserQueryCondition = {
        user_id: reqID,

        is_strict_condition: true,
      };

      const userInfo = await UserDataService.GetUser(queryCondition);

      if (!userInfo) {
        throw Error("fetchCurUserById: User data is undefined!");
      }

      const { users } = userInfo.data;

      if (users === undefined || users.length <= 0) {
        console.log("User List Empty");
        return;
      } else if (users.length > 1) {
        console.log("Multiple users were found.");
      }

      commit("SET_CUR_USER", users[0]);
    },

    async resetCurUser({ commit }) {
      console.log("resetCurUser");
      commit("RESET_CUR_USER");
    },
  },
};

export default UserModelModule;
