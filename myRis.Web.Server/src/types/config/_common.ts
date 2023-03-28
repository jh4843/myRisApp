export interface IConfigCommonData {
  fileName: string;
  dirPath: string;
  fileVersion: number;
}

export interface IConfigCommon {
  _common: IConfigCommonData;

  getFullFilePath(): string;
  loadConfig(): Promise<boolean>;
  saveConfig(): Promise<boolean>;
}
