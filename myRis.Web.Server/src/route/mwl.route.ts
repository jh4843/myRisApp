import { Request, Response } from "express";
//TSC <--> WEBPACK
import { MwlController } from "../controller/mwl.controller";

export class MwlRouter {
  private mwlController: MwlController;

  constructor() {
    this.mwlController = new MwlController();
  }

  routes(app: any): void {
    // Get (Object)
    app.route("/api/mwl/get-worklist").get((req: Request, res: Response) => {
      this.mwlController.getWorklist(req, res);
    });

    app
      .route("/api/mwl/get-patient-list")
      .get((req: Request, res: Response) => {
        this.mwlController.getPatientList(req, res);
      });

    app.route("/api/mwl/get-order-list").get((req: Request, res: Response) => {
      this.mwlController.getOrderList(req, res);
    });

    app.route("/api/mwl/get-sps-list").get((req: Request, res: Response) => {
      this.mwlController.getSpsList(req, res);
    });

    app
      .route("/api/mwl/get-proc-plan-list")
      .get((req: Request, res: Response) => {
        this.mwlController.getProcPlanList(req, res);
      });

    app
      .route("/api/mwl/get-protocol-list")
      .get((req: Request, res: Response) => {
        this.mwlController.getProtocolList(req, res);
      });

    app
      .route("/api/mwl/get-bodypart-list")
      .get((req: Request, res: Response) => {
        this.mwlController.getBodypartList(req, res);
      });

    app
      .route("/api/mwl/get-species-list")
      .get((req: Request, res: Response) => {
        this.mwlController.getSpeciesList(req, res);
      });

    app
    .route("/api/mwl/get-breed-list")
    .get((req: Request, res: Response) => {
      this.mwlController.getBreedList(req, res);
    });

    app
      .route("/api/mwl/get-station-list")
      .get((req: Request, res: Response) => {
        this.mwlController.getStationList(req, res);
      });

    app
      .route("/api/mwl/get-ord-reason-list")
      .get((req: Request, res: Response) => {
        this.mwlController.getOrdReasonList(req, res);
      });

    app.route("/api/mwl/get-bp-list").get((req: Request, res: Response) => {
      this.mwlController.getBpList(req, res);
    });

    // Get (Generate and Return New Value)
    app.route("/api/mwl/get-new-acc-no").get((req: Request, res: Response) => {
      this.mwlController.getNewAccNumber(req, res);
    });

    // Add (Instance)
    app.route("/api/mwl/add-patient").post((req: Request, res: Response) => {
      this.mwlController.addPatient(req, res);
    });

    app.route("/api/mwl/add-order").post((req: Request, res: Response) => {
      this.mwlController.addOrder(req, res);
    });

    app.route("/api/mwl/add-sps").post((req: Request, res: Response) => {
      this.mwlController.addSps(req, res);
    });

    app.route("/api/mwl/add-sps-list").post((req: Request, res: Response) => {
      this.mwlController.addSpsList(req, res);
    });

    app.route("/api/mwl/add-proc-plan").post((req: Request, res: Response) => {
      this.mwlController.addProcPlan(req, res);
    });

    app.route("/api/mwl/add-protocol").post((req: Request, res: Response) => {
      this.mwlController.addProtocol(req, res);
    });

    app
      .route("/api/mwl/add-bodypart")
      .post((req: Request, res: Response) => {
        this.mwlController.addBodypart(req, res);
      });

    app.route("/api/mwl/add-station").post((req: Request, res: Response) => {
      this.mwlController.addStation(req, res);
    });

    app.route("/api/mwl/add-ord-reason").post((req: Request, res: Response) => {
      this.mwlController.addOrdReason(req, res);
    });

    // Delete
    app.route("/api/mwl/delete-order").delete((req: Request, res: Response) => {
      this.mwlController.deleteOrder(req, res);
    });

    app
      .route("/api/mwl/delete-proc-plan")
      .delete((req: Request, res: Response) => {
        this.mwlController.deleteProcPlan(req, res);
      });

    app
      .route("/api/mwl/delete-protocol")
      .delete((req: Request, res: Response) => {
        this.mwlController.deleteProtocol(req, res);
      });

    app
      .route("/api/mwl/delete-bodypart")
      .delete((req: Request, res: Response) => {
        this.mwlController.deleteBodypart(req, res);
      });

    app
      .route("/api/mwl/delete-station")
      .delete((req: Request, res: Response) => {
        this.mwlController.deleteStation(req, res);
      });

    // Update
    app.route("/api/mwl/update-patient").put((req: Request, res: Response) => {
      this.mwlController.updatePatient(req, res);
    });

    app.route("/api/mwl/update-order").put((req: Request, res: Response) => {
      this.mwlController.updateOrder(req, res);
    });

    app.route("/api/mwl/update-order-status").patch((req: Request, res: Response) => {
      this.mwlController.updateOrderStatus(req, res);
    });

    app.route("/api/mwl/update-sps").put((req: Request, res: Response) => {
      this.mwlController.updateSps(req, res);
    });

    app.route("/api/mwl/update-sps-list").put((req: Request, res: Response) => {
      this.mwlController.updateSpsList(req, res);
    });

    app
      .route("/api/mwl/update-proc-plan")
      .put((req: Request, res: Response) => {
        this.mwlController.updateProcPlan(req, res);
      });

    app.route("/api/mwl/update-protocol").put((req: Request, res: Response) => {
      this.mwlController.updateProtocol(req, res);
    });

    app
      .route("/api/mwl/update-bodypart")
      .put((req: Request, res: Response) => {
        this.mwlController.updateBodypart(req, res);
      });

    app.route("/api/mwl/update-station").put((req: Request, res: Response) => {
      this.mwlController.updateStation(req, res);
    });

    app
      .route("/api/mwl/update-ord-reason")
      .put((req: Request, res: Response) => {
        this.mwlController.updateOrdReason(req, res);
      });
  }
}
