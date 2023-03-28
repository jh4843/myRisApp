import { Logger } from "winston";
import { eLicenseType } from "../../../myRis.Web.Common";

declare global {
  var __logger: Logger;

  var gAppName: string;
  var gAppVer: string;
  var gAppLang: string;
  //
  var gLicenseType: eLicenseType;
  //
  var gWebIsRunning: boolean;
  var gWebHostName: string;
  var gWebPortNo: number;
  //
  var gDataRootDir: string;
  var gCacheDir: string;
}

export {};
