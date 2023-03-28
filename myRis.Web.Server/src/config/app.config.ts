import { IConfigCommonData } from "@/types";
import ConfigServerInfo from "./app/webSrvInfo.config";
import ConfigLogInfo from "./app/log.config";
import path from "path";

//
const srvInfoCfgFile = "serverInfo.json";
const logConfigFile = "logSetting.json";

export interface IAppConfig {
  _webSrvInfo: ConfigServerInfo;
  _logInfo: ConfigLogInfo;
}

export default class AppConfig implements IAppConfig {
  _webSrvInfo: ConfigServerInfo;
  _logInfo: ConfigLogInfo;

  constructor() {
    // Web Server Info
    const commonWebSrvInfo: IConfigCommonData = {
      fileName: srvInfoCfgFile,
      dirPath: path.join(global.gDataRootDir, "Config\\"),
      fileVersion: 0,
    };
    this._webSrvInfo = new ConfigServerInfo(commonWebSrvInfo);

    //
    const commonLogInfo: IConfigCommonData = {
      fileName: logConfigFile,
      dirPath: path.join(global.gDataRootDir, "Config\\"),
      fileVersion: 0,
    };
    this._logInfo = new ConfigLogInfo(commonLogInfo);
  }

  // get - set
  get webSrvInfo(): ConfigServerInfo {
    return this._webSrvInfo;
  }

  set webSrvInfo(v: ConfigServerInfo) {
    this._webSrvInfo = v;
  }

  get logInfo(): ConfigLogInfo {
    return this._logInfo;
  }

  async loadAll(): Promise<boolean> {
    let tempRes = await this._webSrvInfo.loadConfig();
    let res = true;

    if (!tempRes) {
      __logger.error(
        `[AppConfig::loadAll] Failed to load web server info`
      );
      res = false;
    }

    tempRes = await this._logInfo.loadConfig();

    if (!tempRes) {
      __logger.error(`[AppConfig::loadAll] Failed to load logger info`);
      res = false;
    }

    return res;
  }

  async saveAll(): Promise<boolean> {
    let tempRes = await this._webSrvInfo.saveConfig();
    let res = true;

    if (!tempRes) {
      __logger.error(
        `[AppConfig::saveAll] Failed to save web server info`
      );
      res = false;
    }

    tempRes = await this._logInfo.saveConfig();

    if (!tempRes) {
      __logger.error(`[AppConfig::saveAll] Failed to save logger info`);
      res = false;
    }

    return res;
  }
}
