//const pool = require("config/db.config");

import * as myTypes from "../../../myRis.Web.Common";
import * as fastcsv from "fast-csv";
import path from "path";
import fs from "fs";
//TSC <--> WEBPACK
import { DBConnectionPool } from "../config/db.config";

export class SystemModel {
  private databasePool: DBConnectionPool;

  constructor() {
    this.databasePool = new DBConnectionPool();
  }

  async isAlive(): Promise<myTypes.ISysIsAliveResponse> {
    let res: myTypes.ISysIsAliveResponse = {
      result: true,
      err_code: 0,
    };

    return res;
  }

  async getSystemInfo(): Promise<myTypes.ISysGetSystemInfoResponse> {
    let res: myTypes.ISysGetSystemInfoResponse = {
      result: true,
      err_code: 0,
      info: {
        alias: global.gAppName,
        version: global.gAppVer,
        language: global.gAppLang,
        //
        license_type: global.gLicenseType,
        //
        host_name: global.gWebHostName,
        port_no: global.gWebPortNo,
        //
      },
    };

    return res;
  }

  // ref: https://www.bezkoder.com/node-js-export-mysql-csv-file/#Export_MySQL_data_to_CSV_file_using_fs
  async exportSettingMwl(): Promise<myTypes.ISysExportUserSettingResponse> {
    const exportFilesPath = path.join(global.gCacheDir, "export\\mwl\\");

    if (fs.existsSync(exportFilesPath)) {
      fs.rmdirSync(exportFilesPath, { recursive: true });
    }

    fs.mkdirSync(exportFilesPath, { recursive: true });

    let exportRes: myTypes.ISysExportUserSettingResponse = {
      result: true,
      err_code: 0,
      //
      zip_path: path.join(global.gCacheDir, "export\\exportRes.zip"),

      procplan_filename: "",
      protocol_filename: "",
      i_procplan_prot_filename: "",
      bodypart_filename: "",
      station_filename: "",
    };

    if (fs.existsSync(exportRes.zip_path)) {
      fs.rmSync(exportRes.zip_path);
    }

    let conn = undefined;

    try {
      conn = await this.databasePool.getConnection();

      exportRes.procplan_filename = await this.exportSettingProcPlan(
        conn,
        exportFilesPath
      );
      if (
        exportRes.procplan_filename == undefined ||
        exportRes.procplan_filename == ""
      ) {
        throw new Error("Failed Export Procedure Plan");
      }

      exportRes.protocol_filename = await this.exportSettingProtocol(
        conn,
        exportFilesPath
      );
      if (
        exportRes.protocol_filename == undefined ||
        exportRes.protocol_filename == ""
      ) {
        throw new Error("Failed Export Protocol");
      }

      exportRes.i_procplan_prot_filename =
        await this.exportSettingIProcPlanProt(conn, exportFilesPath);
      if (
        exportRes.i_procplan_prot_filename == undefined ||
        exportRes.i_procplan_prot_filename == ""
      ) {
        throw new Error("Failed Interface Procerue Plan & Protocol");
      }

      exportRes.bodypart_filename = await this.exportSettingBodypart(
        conn,
        exportFilesPath
      );
      if (
        exportRes.bodypart_filename == undefined ||
        exportRes.bodypart_filename == ""
      ) {
        throw new Error("Failed Interface Protocol Code");
      }

      exportRes.station_filename = await this.exportSettingStation(
        conn,
        exportFilesPath
      );
      if (
        exportRes.station_filename == undefined ||
        exportRes.station_filename == ""
      ) {
        throw new Error("Failed Station");
      }
    } catch (err: any) {
      __logger.error(
        `[SystemModel::exportSettingMwl] Failed to export ${err.code} ${err.message}`
      );
      console.log("[SystemModel::exportSettingMwl]: ", err);

      exportRes.result = false;
      exportRes.err_code = 13001;

      throw exportRes;
    } finally {
      if (conn) conn.end();
      return exportRes;
    }
  }

  async exportSettingProcPlan(
    conn: any,
    outDirPath: string
  ): Promise<string | undefined> {
    let filePath = undefined;
    const tableName = "T_PROC_PLAN";

    let rows, query;

    try {
      const fileFullPath = path.join(outDirPath, `export_${tableName}.csv`);

      const ws = fs.createWriteStream(fileFullPath);

      //conn = await this.databasePool.getConnection();

      query = `SELECT ${myTypes.ProcPlanAllColumns} from ${tableName}`;

      rows = await conn.query(query);

      if (rows.length <= 0) {
        throw -1;
      }

      const jsonData = JSON.parse(JSON.stringify(rows));

      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function () {
          __logger.debug(
            `[SystemModel::exportSettingProcPlan] Write to ${fileFullPath} successfully!!`
          );
        })
        .pipe(ws);

      filePath = fileFullPath;
    } catch (err: any) {
      console.log("err: ", err);
      filePath = "";
      throw err;
    } finally {
      return filePath;
    }
  }

  async exportSettingProtocol(
    conn: any,
    outDirPath: string
  ): Promise<string | undefined> {
    let filePath = undefined;
    const tableName = "T_PROTOCOL";

    let rows, query;

    try {
      const fileFullPath = path.join(outDirPath, `export_${tableName}.csv`);

      const ws = fs.createWriteStream(fileFullPath);

      query = `SELECT ${myTypes.ProtocolAllColumns} from ${tableName}`;

      rows = await conn.query(query);

      if (rows.length <= 0) {
        throw -1;
      }

      const jsonData = JSON.parse(JSON.stringify(rows));

      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function () {
          __logger.debug(
            `[SystemModel::exportSettingProtocol] Write to ${fileFullPath} successfully!!`
          );
        })
        .pipe(ws);

      filePath = fileFullPath;
    } catch (err: any) {
      console.log("err: ", err);
      filePath = "";
      throw err;
    } finally {
      return filePath;
    }
  }

  async exportSettingIProcPlanProt(
    conn: any,
    outDirPath: string
  ): Promise<string | undefined> {
    let filePath = undefined;
    const tableName = "I_PROCPLAN_PROT";

    let rows, query;

    try {
      const fileFullPath = path.join(outDirPath, `export_${tableName}.csv`);

      const ws = fs.createWriteStream(fileFullPath);

      conn = await this.databasePool.getConnection();

      query = `SELECT ${myTypes.IProcPlanProtAllColumns} from ${tableName}`;

      rows = await conn.query(query);

      if (rows.length <= 0) {
        throw -1;
      }

      const jsonData = JSON.parse(JSON.stringify(rows));

      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function () {
          __logger.debug(
            `[SystemModel::exportSettingIProcPlanProt] Write to ${fileFullPath} successfully!!`
          );
        })
        .pipe(ws);

      filePath = fileFullPath;
    } catch (err: any) {
      console.log("err: ", err);
      filePath = "";
      throw err;
    } finally {
      return filePath;
    }
  }

  async exportSettingBodypart(
    conn: any,
    outDirPath: string
  ): Promise<string | undefined> {
    let filePath = undefined;
    const tableName = "T_BODYPART";

    let rows, query;

    try {
      const fileFullPath = path.join(outDirPath, `export_${tableName}.csv`);

      const ws = fs.createWriteStream(fileFullPath);

      conn = await this.databasePool.getConnection();

      query = `SELECT ${myTypes.BodypartAllColumns} from ${tableName}`;

      rows = await conn.query(query);

      if (rows.length <= 0) {
        throw -1;
      }

      const jsonData = JSON.parse(JSON.stringify(rows));

      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function () {
          __logger.debug(
            `[SystemModel::exportSettingBodypart] Write to ${fileFullPath} successfully!!`
          );
        })
        .pipe(ws);

      filePath = fileFullPath;
    } catch (err: any) {
      console.log("err: ", err);
      filePath = "";
      throw err;
    } finally {
      return filePath;
    }
  }

  async exportSettingStation(
    conn: any,
    outDirPath: string
  ): Promise<string | undefined> {
    let filePath = undefined;
    const tableName = "T_STATION";

    let rows, query;

    try {
      const fileFullPath = path.join(outDirPath, `export_${tableName}.csv`);

      const ws = fs.createWriteStream(fileFullPath);

      conn = await this.databasePool.getConnection();

      query = `SELECT ${myTypes.StationAllColumns} from ${tableName}`;

      rows = await conn.query(query);

      if (rows.length <= 0) {
        throw -1;
      }

      const jsonData = JSON.parse(JSON.stringify(rows));

      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function () {
          __logger.debug(
            `[SystemModel::exportSettingStation] Write to ${fileFullPath} successfully!!`
          );
        })
        .pipe(ws);

      filePath = fileFullPath;
    } catch (err: any) {
      console.log("err: ", err);
      filePath = "";
      throw err;
    } finally {
      return filePath;
    }
  }
}
