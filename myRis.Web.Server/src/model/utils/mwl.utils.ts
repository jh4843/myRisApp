import { DBConnectionPool } from "../../config/db.config";
import * as myTypes from "../../../../myRis.Web.Common";
import * as myUtils from "../../../../myRis.Web.Common/utils";

export default class MwlUtils {
  private databasePool: DBConnectionPool;

  constructor() {
    this.databasePool = new DBConnectionPool();
  }

  async getAccSeqNo(): Promise<string> {
    let res: string = "";

    let today = new Date();

    let conn, query;
    let rows: myTypes.IDbOrder[] = [];

    const curDate: string = myUtils.GetDate(today, "YYYYMMDD", "");

    let queryWhere = `ord_acc_num LIKE "${curDate}%"`;

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * FROM T_ORDER
          WHERE ${queryWhere}
          ORDER BY ord_acc_num DESC LIMIT 1`;

      rows = await conn.query(query);

      if (rows.length > 0) {
        res = rows[0].ord_acc_num;
      }
    } catch (err: any) {
      console.log("err: ", err);
      res = "";
      console.log("Query: ", query);
      console.log("Failed to get Accession No Seq");
      throw err;
    } finally {
      if (conn) conn.end();
    }

    return res;
  }

  async isExistBodypart(
    scmDesign: string,
    bp_code_meaning: string
  ): Promise<boolean> {
    let res = false;

    let conn, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * from T_BODYPART WHERE bp_scm_design='${scmDesign}' AND bp_code_meaning='${bp_code_meaning}'`;
      let rows = await conn.query(query);

      if (rows.length > 0) {
        res = true;
      } else {
        res = false;
      }
    } catch (err: any) {
      console.log("err: ", err);
      res = true;
      console.log("Query: ", query);
      console.log("Failed to check protocol code exist");
      throw err;
    } finally {
      if (conn) conn.end();
    }

    return res;
  }

  //#region Protocol Code (Body Part)
  async getBodypartBodypartSeq(): Promise<number> {
    let res: number = -1;

    let conn, query;
    let col = "seq_bodypart";

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT NEXTVAL(${col})`;

      let resQuery = await conn.query(query);

      if (resQuery.length > 0) {
        res = resQuery[0][`NEXTVAL(${col})`];
      } else {
        res = undefined;
      }
    } catch (err: any) {
      console.log("err: ", err);
      res = -1;
      console.log("Query: ", query);
      console.log("Failed to get Protocol Code for body part");
      throw err;
    } finally {
      if (conn) conn.end();
    }

    return res;
  }

  async ResetBodypartBodypartSeq(): Promise<number> {
    let res: number = -1;

    let conn, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `ALTER SEQUENCE mwldb.seq_bodypart RESTART`;

      res = await conn.query(query);
    } catch (err: any) {
      console.log("err: ", err);
      res = -1;
      console.log("Query: ", query);
      console.log("Failed to reset Protocol Code for body part");
      throw err;
    } finally {
      if (conn) conn.end();
    }

    return res;
  }
  //#endregion
}
