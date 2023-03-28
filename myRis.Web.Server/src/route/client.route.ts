import { Request, Response } from "express";
//TSC <--> WEBPACK
import { ClientController } from "../controller/client.controller";

export class ClientRouter {
  private clientController: ClientController;

  constructor() {
    this.clientController = new ClientController();
  }

  // [REST CRUD]
  // 자원에 대한 행위를 HTTP Method로 표현(Get, Post, Delete, Put) URI Resource에는 행위가 들어가면 안되지만.. 일단 이렇게..
  // [IHE Web-based Image Access]
  // https://wiki.ihe.net/index.php/Web-based_Image_Access
  // DICOM WADO, QIDO, STOW
  // https://docs.microsoft.com/ko-kr/azure/healthcare-apis/dicom/dicom-services-conformance-statement

  routes(app: any): void {
    // Retrieve
    app.route("/api/client/allClients").get((req: Request, res: Response) => {
      this.clientController.getAllClientInfo(req, res);
    });

    // Create
    app.route("/api/client/insert").post((req: Request, res: Response) => {
      this.clientController.insertClientInfo(req, res);
    });

    // Delete
    app.route("/api/client/delete").post((req: Request, res: Response) => {
      this.clientController.deleteClientInfo(req, res);
    });

    // Update
    app.route("/api/client/update").post((req: Request, res: Response) => {
      this.clientController.updateClientInfo(req, res);
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
///// DEPRECATED ; TO BE REMOVED
/////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// module.exports = function (app: any) {
//   const client = require("../controller/client.controller");
//   const router = require("express").Router();

//   //REST CRUD
//   //자원에 대한 행위를 HTTP Method로 표현(Get, Post, Delete, Put) URI Resource에는 행위가 들어가면 안되지만.. 일단 이렇게..

//   // Retrieve
//   router.get("/allClients", client.GetAllClientInfo);

//   // Create
//   router.post("/insert", client.InsertClientInfo);

//   // Delete
//   //router.delete("/delete", client.DeleteClientInfo); //delete로 하니까 param 값이 undefined....
//   router.post("/delete", client.DeleteClientInfo);

//   // Update
//   //router.put("/Update", client.UpdateClientInfo);
//   router.post("/update", client.UpdateClientInfo);

//   return router;
//   };
