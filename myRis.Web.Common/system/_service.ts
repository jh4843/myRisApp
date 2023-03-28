import { IServiceBaseResponse, IServiceBaseRequest } from "../common";
import * as sysType from "./_types";

export interface ISysIsAliveRequest extends IServiceBaseRequest {}
export interface ISysIsAliveResponse extends IServiceBaseResponse {}

export interface ISysGetSystemInfoRequest extends IServiceBaseRequest {}
export interface ISysGetSystemInfoResponse extends IServiceBaseResponse {
  info: sysType.IWebServerInfo;
}

export interface ISysExportUserSettingRequest extends IServiceBaseRequest {}
export interface ISysExportUserSettingResponse extends IServiceBaseResponse {
  zip_path: string;
  procplan_filename: string;
  protocol_filename: string;
  i_procplan_prot_filename: string;
  bodypart_filename: string;
  station_filename: string;
}

export default {};
