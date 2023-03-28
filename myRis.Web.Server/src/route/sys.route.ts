import { Request, Response } from "express";
//TSC <--> WEBPACK
import { SystemController } from "../controller/system.controller";

export class SystemRouter {
  private systemController: SystemController;

  constructor() {
    this.systemController = new SystemController();
  }

  routes(app: any): void {
    app.route("/api/sys/is-alive").get((req: Request, res: Response) => {
      this.systemController.isAlive(req, res);
    });

    // Get User Info
    app.route("/api/sys/get-sys-info").get((req: Request, res: Response) => {
      this.systemController.getSystemInfo(req, res);
    });

    app.route("/api/sys/export/setting/mwl").get((req: Request, res: Response) => {
      this.systemController.exportSettingMwl(req, res);
    });
  }
}
