import * as util from "util";
//TSC <--> WEBPACK
import { IClientTableRow } from "../model/client.model";
import { ClientModel } from "../model/client.model";

export class ClientController {
  private clientModel: ClientModel;

  constructor() {
    this.clientModel = new ClientModel();
  }

  getAllClientInfo(req: any, res: any) {
    this.clientModel
      .getClient()
      .then((rows: any) => {
        res.json(rows);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  insertClientInfo(req: any, res: any) {
    let insertQuery: IClientTableRow = {
      client_key: "",
      client_ae_title: "",
      client_host_name: "",
    };
    insertQuery.client_key = req.body.client_key;
    insertQuery.client_ae_title = req.body.client_ae_title;
    insertQuery.client_host_name = req.body.client_host_name;

    this.clientModel
      .insertClient(insertQuery)
      .then((rows: any) => {
        res.json(rows);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  deleteClientInfo(req: any, res: any) {
    let deleteQuery: IClientTableRow = {
      client_key: "",
      client_ae_title: "",
      client_host_name: "",
    };

    deleteQuery.client_key = req.body.client_key;
    deleteQuery.client_ae_title = req.body.client_ae_title;
    deleteQuery.client_host_name = req.body.client_host_name;

    this.clientModel
      .deleteClient(deleteQuery)
      .then((rows: any) => {
        res.json(rows);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  updateClientInfo(req: any, res: any) {
    let updateQuery: IClientTableRow = {
      client_key: "",
      client_ae_title: "",
      client_host_name: "",
    };

    updateQuery.client_key = req.body.client_key;
    updateQuery.client_ae_title = req.body.client_ae_title;
    updateQuery.client_host_name = req.body.client_host_name;

    this.clientModel
      .updateClient(updateQuery)
      .then((rows: any) => {
        res.json(rows);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
}
