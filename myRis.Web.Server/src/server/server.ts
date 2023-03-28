import * as http from "http";
import { AddressInfo } from "net";
import * as os from "os";
//
//TSC <--> WEBPACK

import { DatabaseController } from "../controller/database.controller";
import ConfigServerInfo from "../config/app/webSrvInfo.config";
import ExpressApp from "./express";

import { IConfigServerInfoData } from "@/types";

export class RestServer {
  _expressApp: ExpressApp;
  _server: http.Server;

  _databaseController: DatabaseController = new DatabaseController();
  _configWebServerInfo: IConfigServerInfoData;

  constructor(config: ConfigServerInfo) {
    this._expressApp = new ExpressApp();
    this._configWebServerInfo = config.webSrvInfo;
  }

  get expressApp(): ExpressApp {
    return this._expressApp;
  }

  get server(): http.Server {
    return this._server;
  }

  get databaseController(): DatabaseController {
    return this._databaseController;
  }

  get configWebServerInfo(): IConfigServerInfoData {
    return this._configWebServerInfo;
  }

  start() {
    //this.logger.info(`starting server on port ${this.port}...`);
    this.expressApp.express.set("host", this.configWebServerInfo.hostName);
    this.expressApp.express.set("port", this._configWebServerInfo.port);

    this._server = http.createServer(this.expressApp.express);
    const tempServer = this.server;
    this.server.listen(
      this.configWebServerInfo.port,
      this.configWebServerInfo.hostName,
      function () {
        let addressInfo = tempServer.address() as AddressInfo;

        __logger.info(
          `[RestServer::start] ** Callback - Listen ${addressInfo.address}::${addressInfo.port}`
        );

        global.gWebIsRunning = true;

        global.gWebHostName = addressInfo.address;
        global.gWebPortNo = addressInfo.port;
      }
    );

    //this.server.on('error', (e) => this.onError(e));
    this.server.on("listening", this.onListening.bind(this));
    this.server.on("close", this.onClose.bind(this));
  }

  stop(): void {
    __logger.info(`[RestServer::stop] ** Stop Server`);
    this.server.close();
  }

  private onListening(): void {
    let mac = "";
    let ip = global.gWebHostName;
    let port = global.gWebPortNo;

    let nics = os.networkInterfaces();
    let isFind = false;

    for (var dev in nics) {
      __logger.debug(
        `[RestServer::onListening] Device(${JSON.stringify(
          nics[dev],
          null,
          "\t"
        )}) `
      );

      var nic = nics[dev].filter(function (details: any) {
        return details.family === "IPv4" && details.internal === false;
      });

      if (nic.length > 0) {
        if (ip == "localhost" || ip == "127.0.0.1") {
          mac = nic[0].mac;
          isFind = true;
          break;
        }

        for (var card of nic) {
          if (card.address == ip) {
            mac = card.mac;
            isFind = true;
            break;
          }
        }
      }

      if (isFind) break;

      if (ip.split(".")[0] != "192") break;
    }

    __logger.info(
      `[RestServer::onListening] Running Server at http://${ip}:${port}`
    );
    __logger.info(`[RestServer::onListening] Mac Address ${mac}`);
  }

  private onClose(): void {
    __logger.info(`[RestServer::onListening] onClose`);
  }

  async initializeDatbase(): Promise<boolean> {
    const isTalbeCreated: boolean = await this.prepareDatabase();
    if (!isTalbeCreated) {
      __logger.error(
        `[${
          this.constructor.name
        }] Failed to create DB Table (res: ${isTalbeCreated.toString()}`
      );
      return false;
    }

    let isTableReady: boolean = await this.insertDefaultData();
    if (!isTableReady) {
      __logger.error(
        `[${
          this.constructor.name
        }] Failed to Insert Data (res: ${isTableReady.toString()}`
      );
      return false;
    }

    __logger.info(`[RestServer::initializeDatbase] Complete to initialize Database`);

    return true;
  }

  async prepareDatabase(): Promise<boolean> {
    await this.databaseController.createDatabase();

    // User
    await this.databaseController.createUserTable();
    // Code Sequence
    await this.databaseController.createBodypartTable();
    await this.databaseController.createSpeciesTable();
    await this.databaseController.createBreedTable();
    // MWL
    await this.databaseController.createPatientTable();
    await this.databaseController.createOrderTable();
    await this.databaseController.createSpsTable();
    await this.databaseController.createProcPlanTable();
    await this.databaseController.createProtocolTable();
    await this.databaseController.createIProcPlanProtocolTable();
    await this.databaseController.createStationTable();
    await this.databaseController.createOrdReasonTable();
    // System
    await this.databaseController.createServerTable();
    await this.databaseController.createClientTable();

    // Create Sequence Table
    // Order
    await this.databaseController.createSeqAccNumber();
    // Protocol Code
    await this.databaseController.createSeqBodypart();

    return true;
  }

  async insertDefaultData(): Promise<boolean> {
    return await this._databaseController.insertDefaultData();
  }
}
