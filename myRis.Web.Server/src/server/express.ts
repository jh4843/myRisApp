import express from "express";

import { Routes } from "../route/routes";

import cors from "cors";
import bodyParser from "body-parser";
import boolParser from "express-query-boolean";
import path from "path";

export default class ExpressApp {
  express: express.Application;
  routeProvider: Routes = new Routes();
  dirName: string;
  //private logger = getLogger("express");

  constructor() {
    this.express = express();
    this.dirName = path.resolve();

    this.middleware();
    this.routeProvider.routes(this.express);

    // Must be the last.
    this.errors();
    __logger.info(`[ExpressApp::constructor] Express app is initialized.`);
  }

  private middleware(): void {
    this.express.use(boolParser());
    this.express.use(bodyParser.json());
    this.express.use(express.static(this.dirName + "/public"));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(cors());
  }

  private errors() {
    this.express.use((error: Error, _req: any, res: any, _next: any) => {
      if (error.name === "UnauthorizedError") {
        res.status(401).json({
          error: {
            message: "not authorized",
            code: 401,
          },
        });
        return;
      }
      if (error.name === "ValidationError") {
        res.status(400).json({
          error: {
            message: error.message,
            code: 400,
          },
        });
        return;
      }

      if ((error as any).auth0_code === "user_exists") {
        res.status(409).json({
          error: {
            message: "User already exists",
            code: 409,
          },
        });
        return;
      }

      __logger.error(
        `[ExpressApp::errors] Express app error ${error.message}`
      );
      return res.status(500).json({
        error: {
          message: "server error",
          code: 500,
        },
      });
    });
  }
}
