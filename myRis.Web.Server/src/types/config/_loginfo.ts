import { IConfigCommon } from "./_common";

export type tLogLevel = "info" | "error" | "debug";

export interface IConfigLogInfoData {
  level: tLogLevel;
  silent?: boolean;
  datePattern: string;
  dirname: string;
  filename: string;
  maxFiles: number;
  zippedArchive: boolean;
}

export interface IConfigLogInfo extends IConfigCommon {
  _logpath: string;
  _format: string;
  _info: IConfigLogInfoData;
  _error: IConfigLogInfoData;
  _debug: IConfigLogInfoData;
}
