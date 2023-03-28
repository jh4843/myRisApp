//const model = require("model/user.model");
import * as sysCommon from "@common/system";
import { Request, Response } from "express";
import * as myUtils from "../utils";
import path from "path";
//TSC <--> WEBPACK
import { SystemModel } from "../model/system.model";

export class SystemController {
  private systemModel: SystemModel;

  constructor() {
    this.systemModel = new SystemModel();
  }

  // url: /is-alive
  isAlive(req: Request, res: Response) {
    this.systemModel
      .isAlive()
      .then((rows: sysCommon.ISysIsAliveResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(`[SystemController::isAlive] Failed to get System Info`);
      });
  }

  // url: /get-sys-info
  getSystemInfo(req: Request, res: Response) {
    this.systemModel
      .getSystemInfo()
      .then((rows: sysCommon.ISysGetSystemInfoResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[SystemController::getSystemInfo] Failed to get System Info`
        );
      });
  }

  // url: /export-user-setting
  exportSettingMwl(req: Request, res: Response) {
    this.systemModel
      .exportSettingMwl()
      .then((resExport: sysCommon.ISysExportUserSettingResponse) => {
        const exportPath = path.join(global.gCacheDir, "export\\");
        const exportFilesPath = path.join(exportPath, "mwl\\");

        myUtils
          .compressDir(exportFilesPath, resExport.zip_path, "exportmyRis1!!")
          .then(() => {
            res.download(resExport.zip_path);
            __logger.info(
              `[SystemController::exportSettingMwl] Compression Done [path:${resExport.zip_path}]`
            );
          })
          .catch(() => {
            resExport.result = false;
            resExport.err_code = 13002;

            res.json(resExport);

            __logger.error(
              `[SystemController::exportSettingMwl] Compression Failed [path:${resExport.zip_path}]`
            );
          });

        __logger.info(
          `[SystemController::exportSettingMwl] Path:${resExport.zip_path}`
        );
      })
      .catch((resExport: sysCommon.ISysExportUserSettingResponse) => {
        res.json(resExport);

        __logger.error(
          `[SystemController::exportSettingMwl] Failed to get System Info ${resExport.err_code}`
        );
      });
  }
}
