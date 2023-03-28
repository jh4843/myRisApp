//const pool = require("config/db.config");

import * as myTypes from "../../../myRis.Web.Common";
//TSC <--> WEBPACK
import { DBConnectionPool } from "../config/db.config";

export class UserModel {
  private databasePool: DBConnectionPool;

  constructor() {
    this.databasePool = new DBConnectionPool();
  }

  async getUser(
    queryCondition: myTypes.IUserGetUserQueryCondition
  ): Promise<myTypes.IUserGetUserResponse> {
    const { user_key, user_level, user_id, user_name, is_strict_condition } =
      queryCondition;
    let resDbUser: myTypes.IUserGetUserResponse = {
      result: false,
      err_code: 0,
      users: [],
    };

    let queryArray: string[] = [];
    let queryWhere = "";

    if (user_key != undefined && user_key > -1) {
      queryArray.push(`user_key=${user_key}`);
    }

    if (user_level != undefined && user_level >= myTypes.eUserLevel.Root) {
      queryArray.push(`user_level=${user_level}`);
    }

    if (user_id != undefined && user_id != "") {
      if (is_strict_condition == true) {
        queryArray.push(`user_id="${user_id}"`);
      } else {
        queryArray.push(`user_id LIKE "%${user_id}%"`);
      }
    }

    if (user_name != undefined && user_name != "") {
      if (is_strict_condition == true) {
        queryArray.push(`user_name="${user_name}"`);
      } else {
        queryArray.push(`user_name LIKE "%${user_name}%"`);
      }
    }

    if (queryArray.length > 0) {
      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += " AND ";
        }

        queryWhere += queryArray[i];
      }

      queryWhere = "WHERE " + queryWhere;
    } else {
      queryWhere = "";
    }

    let conn, rows, query;

    query = `SELECT user_key, user_level, user_id, user_pwd, user_name, user_desc, user_create_dttm from T_USER 
    ${queryWhere}`;

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(query);

      const len: number = rows.length;

      for (let i = 0; i < len; i++) {
        resDbUser.users.push(rows[i]);
      }

      resDbUser.result = true;
      // console.log(rows);
    } catch (err: any) {
      console.log("err: ", err);
      resDbUser.result = false;

      switch (err.errno) {
        default:
          resDbUser.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return resDbUser;
    }
  }

  async signIn(
    queryUserInfo: myTypes.IUserSignInQueryCondition
  ): Promise<myTypes.IUserSignInResponse> {
    const { user_id, user_pwd } = queryUserInfo;
    let res: myTypes.IUserSignInResponse = {
      result: false,
      err_code: 0,
    };
    let conn, rows, query;

    console.log("SignIn ", queryUserInfo, user_id, user_pwd);

    if (user_id === "" || user_id === undefined) {
      res.result = false;
      res.err_code = 11003;

      return res;
    }

    if (user_pwd === "" || user_pwd === undefined) {
      res.result = false;
      res.err_code = 11004;

      return res;
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT user_id, user_pwd 
      FROM T_USER 
      WHERE T_USER.user_id="${user_id}"`;

      rows = await conn.query(query);

      const len: number = rows.length;

      if (len > 0) {
        if (user_pwd === rows[0].user_pwd) {
          res.result = true;

          const curDate = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          query = `UPDATE T_USER SET user_signin_dttm = "${curDate}" WHERE T_USER.user_id="${user_id}"`;
          rows = await conn.query(query);
        } else {
          res.err_code = 11002;
          console.log("wrong password :", user_pwd);
        }
      } else {
        res.err_code = 11001;
        console.log("No Account", user_id);
      }
    } catch (err: any) {
      console.log("err: ", err);
      res.result = false;

      switch (err.errno) {
        // Common
        case 1064:
          res.err_code = 11002;
          break;
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  async signUp(
    queryUserInfo: myTypes.IUserSignUpQueryCondition
  ): Promise<myTypes.IUserSignUpResponse> {
    const { user_level, user_id, user_pwd, user_name } = queryUserInfo;

    let res: myTypes.IUserSignUpResponse = {
      result: false,
      err_code: 0,
    };

    if (user_id === "" || user_id === undefined) {
      res.result = false;
      res.err_code = 11003;

      return res;
    }

    if (user_pwd === "" || user_pwd === undefined) {
      res.result = false;
      res.err_code = 11004;

      return res;
    }

    let conn, rows, query;
    try {
      conn = await this.databasePool.getConnection();
      query = `INSERT INTO T_USER(user_id, user_level, user_name, user_pwd, user_create_dttm) 
      VALUES('${user_id}',${user_level}, '${user_name}', '${user_pwd}',current_timestamp())`;

      rows = await conn.query(query);

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  async editUser(
    editUserInfo: myTypes.IUserEditUserQueryCondition
  ): Promise<myTypes.IUserEditUserResponse> {
    const {
      user_level,
      user_id,
      user_old_pwd,
      user_new_pwd,
      user_confirm_pwd,
      user_name,
      user_desc,
    } = editUserInfo;

    let res: myTypes.IUserEditUserResponse = {
      result: false,
      err_code: 0,
    };

    if (user_id === "" || user_id === undefined) {
      res.result = false;
      res.err_code = 11003;

      return res;
    }

    if (user_old_pwd === "" || user_old_pwd === undefined) {
      res.result = false;
      res.err_code = 11004;

      return res;
    }

    if (
      user_new_pwd === "" ||
      user_new_pwd === undefined ||
      user_confirm_pwd === "" ||
      user_confirm_pwd === undefined ||
      user_new_pwd != user_confirm_pwd
    ) {
      res.result = false;
      res.err_code = 11006;

      return res;
    }

    let conn, rows, query;
    let oldRows;
    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT user_key, user_level, user_id, user_pwd, user_name, user_desc, user_create_dttm from T_USER WHERE user_id ='${user_id}'`;

      oldRows = await conn.query(query);

      if (oldRows.length <= 0) {
        console.log("Invalid User Count");

        res.result = false;
        res.err_code = 11007;

        return res;
      }

      const oldUserInfo: myTypes.IDbUser = oldRows[0];

      console.log("Old User Info: ", oldUserInfo);

      if (oldUserInfo.user_pwd != user_old_pwd) {
        console.log("Wrong old user password");

        res.result = false;
        res.err_code = 11002;

        return res;
      }

      query = `UPDATE T_USER SET 
      user_level=${user_level}, user_name='${user_name}', user_pwd='${user_new_pwd}', user_desc='${user_desc}'
      WHERE user_id ='${user_id}'`;

      rows = await conn.query(query);

      res.result = true;
      // console.log(rows);
    } catch (err: any) {
      console.log("err: ", err);
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  async updateUser(id: any, desc: any) {
    let conn, rows;

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(
        `UPDATE T_USER SET user_desc ='${desc}' WHERE user_id ='${id}'`
      );
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return rows;
    }
  }
}
