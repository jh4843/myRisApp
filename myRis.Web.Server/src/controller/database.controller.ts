//const { createUserTable } = require("model/database.model");
//const databaseModel = require("model/database.model");

//TSC <--> WEBPACK
import { DatabaseModel } from "../model/database.model";

export class DatabaseController {
  private databaseModel: DatabaseModel;

  constructor() {
    this.databaseModel = new DatabaseModel();
  }

  createDatabase(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createDatabase());
    });
  }

  //#region Create Table
  createUserTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createUserTable());
    });
  }

  createPatientTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createPatientTable());
    });
  }

  createOrderTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createOrderTable());
    });
  }

  createSpsTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createSpsTable());
    });
  }

  createProcPlanTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createProcPlanTable());
    });
  }

  createProtocolTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createProtocolTable());
    });
  }

  createIProcPlanProtocolTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createIProcPlanProtocolTable());
    });
  }

  createBodypartTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createBodypartTable());
    });
  }

  createSpeciesTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createSpeciesTable());
    });
  }

  createBreedTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createBreedTable());
    });
  }

  createStationTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createStationTable());
    });
  }

  createOrdReasonTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createOrdReasonTable());
    });
  }

  createServerTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createServerTable());
    });
  }

  createClientTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createClientTable());
    });
  }
  //#endregion

  //#region Create Sequence
  createSeqAccNumber(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createSeqAccNumber());
    });
  }

  createSeqBodypart(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      resolve(this.databaseModel.createSeqBodypart());
    });
  }
  //#endregion

  isTableEmpty(): Promise<boolean> {
    let databaseModel: DatabaseModel = this.databaseModel;

    return new Promise(async function (res, rej) {
      let isEmpty: boolean = true;

      if (
        (await databaseModel.getUserRowCount()) > 0 ||
        (await databaseModel.getPatientRowCount()) > 0 ||
        (await databaseModel.getOrderRowCount()) > 0 ||
        (await databaseModel.getRpRowCount()) > 0 ||
        (await databaseModel.getSpsRowCount()) > 0 ||
        (await databaseModel.getProcPlanRowCount()) > 0 ||
        (await databaseModel.getProtocolRowCount()) > 0 ||
        (await databaseModel.getIProcPlanProtRowCount()) > 0 ||
        (await databaseModel.getStationRowCount()) > 0 ||
        (await databaseModel.getOrdReasonRowCount()) > 0 ||
        (await databaseModel.getSpeciesRowCount()) > 0 ||
        (await databaseModel.getBreedRowCount()) > 0 ||
        (await databaseModel.getServerRowCount()) > 0
      ) {
        isEmpty = false;
      }
      res(isEmpty);
    });
  }

  async insertDefaultData(): Promise<boolean> {
    let result: boolean = true;
    let isEmpty: boolean = await this.isTableEmpty();
    let databaseModel: DatabaseModel = this.databaseModel;

    if(await databaseModel.insertDefaultData() == false) {
      result = false;  
    }

    //if(process.env.NODE_ENV != "production") {
      if(await databaseModel.insertTestData() == false) {
        result = false;  
      }
    //}

    return new Promise(function (res, rej) {
      res(result);
    });
  }
}
