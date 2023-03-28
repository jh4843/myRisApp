import { createStore } from "vuex";
import UserModelModule, { IUserInfoState } from "./modules/moduleUser";
import MwlModelModule, { IMwlInfoState } from "./modules/moduleMwl";
import ErrorModule, { IErrorState } from "./modules/moduleError";
import AppModelModule, { IAppState } from "./modules/moduleApp";

// define your typings for the store state
export interface RootState {
  IUserState: IUserInfoState;
  IMwlState: IMwlInfoState;
  IErrorState: IErrorState;
  IAppState: IAppState;
}

// define injection key
//export const key: InjectionKey<Store<RootState>> = Symbol();

export const store = createStore<RootState>({
  modules: {
    UserModelModule,
    MwlModelModule,
    ErrorModule,
    AppModelModule,
  },
});
