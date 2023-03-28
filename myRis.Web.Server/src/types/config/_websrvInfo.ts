import { IConfigCommon } from "./index";
import { eLicenseType } from "@common/index";

export interface IConfigServerInfoData {
  alias: string;
  hostName: string;
  port: number;
  licenseType: eLicenseType;
}

export interface IConfigServerInfo extends IConfigCommon {
  _webSrvInfo: IConfigServerInfoData;
}
