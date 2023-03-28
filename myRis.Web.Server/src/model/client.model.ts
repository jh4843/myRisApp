//const pool = require("../config/db.config");

//import { isConstructorDeclaration } from "typescript";
import { isAnyArrayBuffer } from "util/types";
//TSC <--> WEBPACK
import { DBConnectionPool } from "../config/db.config";

// interface IServiceBaseResponse {
//   result?: boolean;
//   err_code?: string | number;
// }

// // Only for SCP Broker
// interface IClientGetClientInfoResponse extends IServiceBaseResponse {
//   client_key?: string;
//   client_ae_title?: string;
//   client_host_name?: string;
// }

interface IServiceResponseBase {
  result?: boolean;
  err_code?: string | number;
}

// Only for SCP Broker
interface IClientTableRow {
  client_key?: string;
  client_ae_title?: string;
  client_host_name?: string;
}

interface IClientGetListResponse extends IServiceResponseBase {
  data: IClientTableRow[];
}

export class ClientModel {
  private databasePool: DBConnectionPool;

  constructor() {
    this.databasePool = new DBConnectionPool();
  }

  // GET CLIENT INFO
  async getClient(): Promise<IClientGetListResponse> {
    //const { user_key, user_level, user_id, user_name } = queryCondition;
    let conn, rows, query;
    let resClientList: IClientGetListResponse = {
      result: false,
      err_code: 0,
      data: [],
    };

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT client_key, client_ae_title, client_host_name
               FROM T_CLIENT
               ORDER BY client_ae_title ASC`;

      rows = await conn.query(query);

      const len: number = rows.length;

      for (let i = 0; i < len; i++) {
        resClientList.data.push({
          client_key: rows[i].client_key,
          client_ae_title: rows[i].client_ae_title,
          client_host_name: rows[i].client_host_name,
        });
      }

      resClientList.result = true;
    } catch (err: any) {
      console.log("getClientInfo : Failed to get client Info! :" + err);
      resClientList.result = false;

      switch (err.errno) {
        case 1062:
          resClientList.err_code = 11005;
          break;
        // Common
        case 1064:
          resClientList.err_code = 11002;
          break;
        default:
          resClientList.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return resClientList;
    }
  }

  //[REF] param vs body
  //https://llnote.tistory.com/669

  // INSERT CLIENT INFO
  async insertClient(
    queryClientInfo: IClientTableRow
  ): Promise<IServiceResponseBase> {
    let conn, rows, result;
    let clientAETitle = queryClientInfo.client_ae_title;
    let clientHostName = queryClientInfo.client_host_name;

    let resInsertClient: IServiceResponseBase = {
      result: false,
      err_code: 0,
    };

    console.log("ae title :" + clientAETitle);
    console.log("hostname :" + clientHostName);

    let query = `INSERT INTO T_CLIENT(client_ae_title, client_host_name) VALUES ('${clientAETitle}', '${clientHostName}')`;

    console.log("query is :" + query);

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(query);
      //
      console.log(query);
      //
      resInsertClient.result = true;
    } catch (err: any) {
      //result = 0;
      console.log("insertClient : Failed to insert client! :" + err);
      resInsertClient.result = false;

      switch (err.errno) {
        // case 1062:
        //   resInsertClient.err_code = 11005;
        //   break;
        // // Common
        // case 1064:
        //   resInsertClient.err_code = 11002;
        //   break;
        default:
          resInsertClient.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      // if (result == 0) {
      //   process.exit();
      // }
      console.log("insertClient : Client inserted successfully!");
      return resInsertClient;
    }
  }

  // DELETE CLIENT INFO
  async deleteClient(
    searchCondition: IClientTableRow
  ): Promise<IServiceResponseBase> {
    let conn, rows, result;
    let clientKey = searchCondition.client_key;
    let query = `DELETE FROM T_CLIENT WHERE client_key = '${clientKey}'`;

    let resDeleteClient: IServiceResponseBase = {
      result: false,
      err_code: 0,
    };
    //
    console.log("query is :" + query);

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(query);
      //
      resDeleteClient.result = true;
    } catch (err: any) {
      console.log("deleteClient : Failed to delete client! :" + err);
      switch (err.errno) {
        // case 1062:
        //   resDeleteClient.err_code = 11005;
        //   break;
        // // Common
        // case 1064:
        //   resDeleteClient.err_code = 11002;
        //   break;
        default:
          resDeleteClient.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      console.log("deleteClient : Client deleted successfully!");
      return resDeleteClient;
    }
  }

  // UPDATE CLIENT INFO
  async updateClient(
    searchCondition: IClientTableRow
  ): Promise<IServiceResponseBase> {
    let conn, rows, result;
    let clientKey = searchCondition.client_key;
    let clientAETitle = searchCondition.client_ae_title;
    let clientHostName = searchCondition.client_host_name;
    let query = `UPDATE T_CLIENT SET client_ae_title ='${clientAETitle}', client_host_name ='${clientHostName}' WHERE client_key ='${clientKey}'`;

    let resUpdateClient: IServiceResponseBase = {
      result: false,
      err_code: 0,
    };

    console.log("query is :" + query);

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(query);
      //
      resUpdateClient.result = true;
    } catch (err: any) {
      result = 0;
      console.log("updateClient : Failed to update client! :" + err);
      switch (err.errno) {
        // case 1062:
        //   resUpdateClient.err_code = 11005;
        //   break;
        // // Common
        // case 1064:
        //   resUpdateClient.err_code = 11002;
        //   break;
        default:
          resUpdateClient.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      console.log("updateClient : Client updated successfully!");
      return resUpdateClient;
    }
  }
}

export { IClientTableRow };
