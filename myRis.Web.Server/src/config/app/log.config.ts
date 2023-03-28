import { IConfigLogInfo, IConfigLogInfoData, IConfigCommonData } from "@/types";

import util from "util";
import fs from "fs";
import path from "path";

const readFile = util.promisify(fs.readFile);
const unlinkFile = util.promisify(fs.unlink);

export default class ConfigLogInfo implements IConfigLogInfo {
  _common: IConfigCommonData;

  _format: string;
  _logpath: string;

  _info: IConfigLogInfoData;
  _error: IConfigLogInfoData;
  //
  _debug: IConfigLogInfoData;

  constructor(common: IConfigCommonData) {
    // common
    this._common = common;

    this._logpath = path.join(global.gDataRootDir, "Logs\\");

    this._format = "YYYY-MM-DD HH:mm:ss";
    this._info = {
      level: "info",
      silent: process.env.NODE_ENV == "production" ? false : true,
      datePattern: "YYYY-MM-DD",
      dirname: this._logpath,
      filename: `%DATE%.log`,
      maxFiles: 7,
      zippedArchive: true,
    };

    this._error = {
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: this._logpath + "error", // Error는 별도 저장
      filename: `%DATE%.error.log`,
      maxFiles: 7,
      zippedArchive: true,
    };

    this._debug = {
      level: "debug",
      silent: process.env.NODE_ENV == "production" ? true : false,
      datePattern: "YYYY-MM-DD",
      dirname: this._logpath,
      filename: `%DATE%.log`,
      maxFiles: 7,
      zippedArchive: true,
    };
  }

  getFullFilePath(): string {
    if (!fs.existsSync(this._common.dirPath)) {
      fs.mkdirSync(this._common.dirPath, { recursive: true });
    }

    const res = path.join(this._common.dirPath, `\\${this._common.fileName}`);

    return res;
  }

  createCfgFile(): void {
    const filePath = this.getFullFilePath();

    let data = JSON.stringify(this, null, "\t");
    fs.writeFileSync(filePath, data);
  }

  async remove(): Promise<boolean> {
    let res = true;
    const filePath = this.getFullFilePath();
    await unlinkFile(filePath);

    if (fs.existsSync(filePath)) {
      res = false;
    }

    return res;
  }

  async loadConfig(): Promise<boolean> {
    const filePath = this.getFullFilePath();

    if (!fs.existsSync(filePath)) {
      this.createCfgFile();
    }

    const data = await readFile(filePath, "utf8");

    const parsedData: IConfigLogInfo = JSON.parse(data);

    this._common = parsedData._common;
    this._format = parsedData._format;
    this._info = parsedData._info;
    this._error = parsedData._error;
    this._debug = parsedData._debug;

    return true;
  }

  async saveConfig(): Promise<boolean> {
    await this.remove();
    const data = JSON.stringify(this, null, "\t");
    this.createCfgFile();

    return true;
  }
}
