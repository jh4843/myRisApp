import {
  IConfigServerInfoData,
  IConfigServerInfo,
  IConfigCommonData,
} from "@/types";

import { eLicenseType } from "../../../../myRis.Web.Common";

import util from "util";
import fs from "fs";
import * as os from "os";
import path from "path";

const readFile = util.promisify(fs.readFile);
const unlinkFile = util.promisify(fs.unlink);

export default class ConfigServerInfo implements IConfigServerInfo {
  _common: IConfigCommonData;
  _webSrvInfo: IConfigServerInfoData;

  constructor(common: IConfigCommonData) {
    // common
    this._common = common;

    //let nics = os.networkInterfaces();

    this._webSrvInfo = {
      alias: "myRisWeb",
      hostName: "localhost",
      port: process.env.NODE_ENV == "production" ? 80 : 8081,
      licenseType: eLicenseType.Human,
    };
  }

  get common(): IConfigCommonData {
    return this._common;
  }

  set common(v: IConfigCommonData) {
    this._common = v;
  }

  get webSrvInfo(): IConfigServerInfoData {
    return this._webSrvInfo;
  }

  set webSrvInfo(v: IConfigServerInfoData) {
    this._webSrvInfo = v;
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

    const parsedData: IConfigServerInfo = JSON.parse(data);

    if (process.env.NODE_ENV == "development") {
      parsedData._webSrvInfo.hostName = "localhost";
      parsedData._webSrvInfo.port = 8081;
    } else {
      if (
        parsedData._webSrvInfo.port == undefined ||
        parsedData._webSrvInfo.port == 0
      ) {
        parsedData._webSrvInfo.port = 80;
      }

      if (
        parsedData._webSrvInfo.hostName == undefined ||
        parsedData._webSrvInfo.hostName == ""
      ) {
        parsedData._webSrvInfo.hostName = "localhost";
      }
    }

    this._webSrvInfo = parsedData._webSrvInfo;

    if (
      this._webSrvInfo.licenseType == undefined ||
      this._webSrvInfo.licenseType == eLicenseType.Invalid
    ) {
      console.log("invalid License Type: ", this._webSrvInfo);

      this._webSrvInfo.licenseType = eLicenseType.Human;
    }

    return true;
  }

  async saveConfig(): Promise<boolean> {
    await this.remove();

    this.createCfgFile();

    return true;
  }
}
