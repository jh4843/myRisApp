import { IDbUser, eUserLevel } from "./_database";
import { IServiceBaseResponse, IServiceBaseRequest } from "../common";

//// List
export interface IUserGetUserQueryCondition extends IServiceBaseRequest {
  user_key?: number;
  user_level?: eUserLevel;

  user_id?: string;
  user_name?: string;
}
export interface IUserGetUserResponse extends IServiceBaseResponse {
  users: IDbUser[];
}

//// Sign-In
export interface IUserSignInQueryCondition extends IServiceBaseRequest {
  user_id: string;
  user_pwd: string;
}
export interface IUserSignInResponse extends IServiceBaseResponse {}

//// Sign-up
export interface IUserSignUpQueryCondition extends IServiceBaseRequest {
  user_level: string;
  user_name: string;
  user_id: string;
  user_pwd: string;
}
export interface IUserSignUpResponse extends IServiceBaseResponse {}

//// Edit-User
export interface IUserEditUserQueryCondition extends IServiceBaseRequest {
  user_level: string;
  user_name: string;
  user_id: string;
  user_old_pwd: string;
  user_new_pwd: string;
  user_confirm_pwd: string;
  user_desc: string;
}
export interface IUserEditUserResponse extends IServiceBaseResponse {}
