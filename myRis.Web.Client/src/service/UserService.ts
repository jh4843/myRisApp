import http from "@/service/http-common";

import { AxiosResponse } from "axios";
import * as myTypes from "@/types";

const baseUserApiUrl = "/api/user";

class UserDataService {
  GetUser(
    reqQuery: myTypes.IUserGetUserQueryCondition
  ): Promise<AxiosResponse<myTypes.IUserGetUserResponse>> {
    const url = baseUserApiUrl + "/get-user";

    return http.get(url, {
      params: {
        user_key: reqQuery.user_key,
        user_level: reqQuery.user_level,
        user_id: reqQuery.user_id,
        user_name: reqQuery.user_name,

        is_strict_condition: reqQuery.is_strict_condition,
      },
    });
  }

  CanSignIn(
    reqQuery: myTypes.IUserSignInQueryCondition
  ): Promise<AxiosResponse<myTypes.IUserSignInResponse>> {
    const url = baseUserApiUrl + "/sign-in";

    return http.get(url, {
      params: {
        user_id: reqQuery.user_id,
        user_pwd: reqQuery.user_pwd,
      },
    });
  }

  SignUpUser(
    reqQuery: myTypes.IUserSignUpQueryCondition
  ): Promise<AxiosResponse<myTypes.IUserSignUpResponse>> {
    const url = baseUserApiUrl + "/sign-up";

    return http.get(url, {
      params: {
        user_level: reqQuery.user_level,
        user_id: reqQuery.user_id,
        //
        user_pwd: reqQuery.user_pwd,
        user_name: reqQuery.user_name,
      },
    });
  }

  EditUser(
    reqQuery: myTypes.IUserEditUserQueryCondition
  ): Promise<AxiosResponse<myTypes.IUserEditUserResponse>> {
    const url = baseUserApiUrl + "/edit-user";

    return http.get(url, {
      params: {
        user_level: reqQuery.user_level,
        user_name: reqQuery.user_name,
        user_id: reqQuery.user_id,
        user_old_pwd: reqQuery.user_old_pwd,
        user_new_pwd: reqQuery.user_new_pwd,
        user_confirm_pwd: reqQuery.user_confirm_pwd,
        user_desc: reqQuery.user_desc,
      },
    });
  }
}

export default new UserDataService();
