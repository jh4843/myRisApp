//const mwlModel = require("model/mwl.model");
import * as mwlCommon from "@common/mwl";

//TSC <--> WEBPACK
import { MwlModel } from "../model/mwl.model";

export class MwlController {
  private mwlModel: MwlModel;

  constructor() {
    this.mwlModel = new MwlModel();
  }

  getWorklist(req: any, res: any) {
    let query: mwlCommon.IMwlGetWorklistQueryCondition = req.query;

    this.mwlModel
      .getWorklist(query)
      .then((rows: mwlCommon.IMwlGetWorklistResponse) => {
        res.json(rows);
      })
      .catch((err: Error) => {
        __logger.error(
          `[MwlController::getWorklist] ${this.getWorklist.name} ${err.name} ${err.message}`
        );
      });
  }

  getPatientList(req: any, res: any) {
    let query: mwlCommon.IMwlGetPatientListQueryCondition = req.query;

    this.mwlModel
      .getPatientList(query)
      .then((rows: mwlCommon.IMwlGetPatientListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getPatientList] ${this.getPatientList.name} ${err.name} ${err.message}`
        );
      });
  }

  getOrderList(req: any, res: any) {
    let query: mwlCommon.IMwlGetOrderListQueryCondition = req.query;

    this.mwlModel
      .getOrderList(query)
      .then((rows: mwlCommon.IMwlGetOrderListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getOrderList] ${this.getOrderList.name} ${err.name} ${err.message}`
        );
      });
  }

  getSpsList(req: any, res: any) {
    let query: mwlCommon.IMwlGetSpsListQueryCondition = req.query;

    this.mwlModel
      .getSpsList(query)
      .then((rows: mwlCommon.IMwlGetSpsListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getSpsList] ${this.getSpsList.name} ${err.name} ${err.message}`
        );
      });
  }

  getProcPlanList(req: any, res: any) {
    let query: mwlCommon.IMwlGetProcPlanListQueryCondition = req.query;

    this.mwlModel
      .getProcPlanList(query)
      .then((rows: mwlCommon.IMwlGetProcPlanListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getProcPlanList] ${this.getProcPlanList.name} ${err.name} ${err.message}`
        );
      });
  }

  getProtocolList(req: any, res: any) {
    let query: mwlCommon.IMwlGetProtocolListQueryCondition = req.query;

    this.mwlModel
      .getProtocolList(query)
      .then((rows: mwlCommon.IMwlGetProtocolListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getProtocolList] ${this.getProtocolList.name} ${err.name} ${err.message}`
        );
      });
  }

  getBodypartList(req: any, res: any) {
    let query: mwlCommon.IMwlGetBodypartListQueryCondition = req.query;

    this.mwlModel
      .getBodypartList(query)
      .then((rows: mwlCommon.IMwlGetBodypartListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getBodypartList] ${this.getBodypartList.name} ${err.name} ${err.message}`
        );
      });
  }

  getSpeciesList(req: any, res: any) {
    let query: mwlCommon.IMwlGetSpeciesListQueryCondition = req.query;

    this.mwlModel
      .getSpeciesList(query)
      .then((rows: mwlCommon.IMwlGetSpeciesListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getSpeciesList] ${this.getSpeciesList.name} ${err.name} ${err.message}`
        );
      });
  }

  getBreedList(req: any, res: any) {
    let query: mwlCommon.IMwlGetBreedListQueryCondition = req.query;

    this.mwlModel
      .getBreedList(query)
      .then((rows: mwlCommon.IMwlGetBreedListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getBreedList] ${this.getBreedList.name} ${err.name} ${err.message}`
        );
      });
  }

  getStationList(req: any, res: any) {
    let query: mwlCommon.IMwlGetStationListQueryCondition = req.query;

    this.mwlModel
      .getStationList(query)
      .then((rows: mwlCommon.IMwlGetStationListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getStationList] ${this.getStationList.name} ${err.name} ${err.message}`
        );
      });
  }

  getOrdReasonList(req: any, res: any) {
    let query: mwlCommon.IMwlGetOrdReasonListQueryCondition = req.query;

    this.mwlModel
      .getOrdReasonList(query)
      .then((rows: mwlCommon.IMwlGetOrdReasonListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getOrdReasonList] ${this.getOrdReasonList.name} ${err.name} ${err.message}`
        );
      });
  }

  getBpList(req: any, res: any) {
    let query: mwlCommon.IMwlGetBpListQueryCondition = req.query;

    this.mwlModel
      .getBpList(query)
      .then((rows: mwlCommon.IMwlGetBpListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[MwlController::getBpList] ${this.getBpList.name} ${err.name} ${err.message}`
        );
      });
  }

  getNewAccNumber(req: any, res: any) {
    this.mwlModel
      .getNewAccNumber()
      .then((rows: mwlCommon.IMwlGetNewAccNumberResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::getNewAccNumber] ${this.getNewAccNumber.name} ${err.name} ${err.message}`
        );
      });
  }

  // Add
  addPatient(req: any, res: any) {
    let query: mwlCommon.IMwlAddPatientRequest = req.body;

    this.mwlModel
      .addPatient(query)
      .then((rows: mwlCommon.IMwlAddPatientResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addPatient] ${this.addPatient.name} ${err.name} ${err.message}`
        );
      });
  }

  addOrder(req: any, res: any) {
    let query: mwlCommon.IMwlAddOrderRequest = req.body;

    this.mwlModel
      .addOrder(query)
      .then((rows: mwlCommon.IMwlAddOrderResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addOrder] ${this.addOrder.name} ${err.name} ${err.message}`
        );
      });
  }

  addSps(req: any, res: any) {
    let query: mwlCommon.IMwlAddSpsRequest = req.body;

    this.mwlModel
      .addSps(query)
      .then((rows: mwlCommon.IMwlAddSpsResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addSps] ${this.addSps.name} ${err.name} ${err.message}`
        );
      });
  }

  addSpsList(req: any, res: any) {
    let query: mwlCommon.IMwlAddSpsListRequest = req.body;

    this.mwlModel
      .addSpsList(query)
      .then((rows: mwlCommon.IMwlAddSpsListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addSpsList] ${this.addSpsList.name} ${err.name} ${err.message}`
        );
      });
  }

  addProcPlan(req: any, res: any) {
    let query: mwlCommon.IMwlAddProcPlanRequest = req.body;

    this.mwlModel
      .addProcPlan(query)
      .then((rows: mwlCommon.IMwlAddProcPlanResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addProcPlan] ${this.addProcPlan.name} ${err.name} ${err.message}`
        );
      });
  }

  addProtocol(req: any, res: any) {
    let query: mwlCommon.IMwlAddProtocolRequest = req.body;

    this.mwlModel
      .addProtocol(query)
      .then((rows: mwlCommon.IMwlAddProtocolResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addProtocol] ${this.addProtocol.name} ${err.name} ${err.message}`
        );
      });
  }

  addBodypart(req: any, res: any) {
    let query: mwlCommon.IMwlAddBodypartRequest = req.body;

    this.mwlModel
      .addBodypart(query)
      .then((rows: mwlCommon.IMwlAddBodypartResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addBodypart] ${this.addBodypart.name} ${err.name} ${err.message}`
        );
      });
  }

  addStation(req: any, res: any) {
    let query: mwlCommon.IMwlAddStationRequest = req.body;

    this.mwlModel
      .addStation(query)
      .then((rows: mwlCommon.IMwlAddStationResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addStation] ${this.addStation.name} ${err.name} ${err.message}`
        );
      });
  }

  addOrdReason(req: any, res: any) {
    let query: mwlCommon.IMwlAddOrdReasonRequest = req.body;

    this.mwlModel
      .addOrdReason(query)
      .then((rows: mwlCommon.IMwlAddOrdReasonResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::addOrdReason] ${this.addOrdReason.name} ${err.name} ${err.message}`
        );
      });
  }

  // Delete
  deleteOrder(req: any, res: any) {
    let query: mwlCommon.IMwlDeleteOrderRequest = req.query;

    this.mwlModel
      .deleteOrder(query)
      .then((rows: mwlCommon.IMwlDeleteOrderResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::deleteOrder] ${this.deleteOrder.name} ${err.name} ${err.message}`
        );
      });
  }

  deleteProcPlan(req: any, res: any) {
    let query: mwlCommon.IMwlDeleteProcPlanRequest = req.query;

    this.mwlModel
      .deleteProcPlan(query)
      .then((rows: mwlCommon.IMwlDeleteProcPlanResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::deleteProcPlan] ${this.deleteProcPlan.name} ${err.name} ${err.message}`
        );
      });
  }

  deleteProtocol(req: any, res: any) {
    let query: mwlCommon.IMwlDeleteProtocolRequest = req.query;

    this.mwlModel
      .deleteProtocol(query)
      .then((rows: mwlCommon.IMwlDeleteProtocolResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::deleteProtocol] ${this.deleteProtocol.name} ${err.name} ${err.message}`
        );
      });
  }

  deleteBodypart(req: any, res: any) {
    let query: mwlCommon.IMwlDeleteBodypartRequest = req.query;

    this.mwlModel
      .deleteBodypart(query)
      .then((rows: mwlCommon.IMwlDeleteBodypartResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::deleteBodypart] ${this.deleteBodypart.name} ${err.name} ${err.message}`
        );
      });
  }

  deleteStation(req: any, res: any) {
    let query: mwlCommon.IMwlDeleteStationRequest = req.query;

    this.mwlModel
      .deleteStation(query)
      .then((rows: mwlCommon.IMwlDeleteStationResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::deleteStation] ${this.deleteStation.name} ${err.name} ${err.message}`
        );
      });
  }

  // Update
  updatePatient(req: any, res: any) {
    let query: mwlCommon.IMwlUpdatePatientRequest = req.body;

    this.mwlModel
      .updatePatient(query)
      .then((rows: mwlCommon.IMwlUpdatePatientResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updatePatient] ${this.updatePatient.name} ${err.name} ${err.message}`
        );
      });
  }

  updateOrder(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateOrderRequest = req.body;

    this.mwlModel
      .updateOrder(query)
      .then((rows: mwlCommon.IMwlUpdateOrderResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateOrder] ${this.updateOrder.name} ${err.name} ${err.message}`
        );
      });
  }

  updateOrderStatus(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateOrderStatusRequest = req.body;

    this.mwlModel
      .updateOrderStatus(query)
      .then((rows: mwlCommon.IMwlUpdateOrderStatusResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateOrderStatus] ${this.updateOrderStatus.name} ${err.name} ${err.message}`
        );
      });
  }

  updateSps(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateSpsRequest = req.body;

    this.mwlModel
      .updateSps(query)
      .then((rows: mwlCommon.IMwlUpdateSpsResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateSps] ${this.updateSps.name} ${err.name} ${err.message}`
        );
      });
  }

  updateSpsList(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateSpsListRequest = req.body;

    this.mwlModel
      .updateSpsList(query)
      .then((rows: mwlCommon.IMwlUpdateSpsListResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateSpsList] ${this.updateSpsList.name} ${err.name} ${err.message}`
        );
      });
  }

  updateProcPlan(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateProcPlanRequest = req.body;

    this.mwlModel
      .updateProcPlan(query)
      .then((rows: mwlCommon.IMwlUpdateProcPlanResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateProcPlan] ${this.updateProcPlan.name} ${err.name} ${err.message}`
        );
      });
  }

  updateProtocol(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateProtocolRequest = req.body;

    this.mwlModel
      .updateProtocol(query)
      .then((rows: mwlCommon.IMwlUpdateProtocolResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateProtocol] ${this.updateProtocol.name} ${err.name} ${err.message}`
        );
      });
  }

  updateBodypart(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateBodypartRequest = req.body;

    this.mwlModel
      .updateBodypart(query)
      .then((rows: mwlCommon.IMwlUpdateBodypartResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateBodypart] ${this.updateBodypart.name} ${err.name} ${err.message}`
        );
      });
  }

  updateStation(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateStationRequest = req.body;

    this.mwlModel
      .updateStation(query)
      .then((rows: mwlCommon.IMwlUpdateStationResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateStation] ${this.updateStation.name} ${err.name} ${err.message}`
        );
      });
  }

  updateOrdReason(req: any, res: any) {
    let query: mwlCommon.IMwlUpdateOrdReasonRequest = req.body;

    this.mwlModel
      .updateOrdReason(query)
      .then((rows: mwlCommon.IMwlUpdateOrdReasonResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[mwlcontroller::updateOrdReason] ${this.updateOrdReason.name} ${err.name} ${err.message}`
        );
      });
  }
}
