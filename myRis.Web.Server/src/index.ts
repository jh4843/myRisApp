import myRisLogger from "./logger";
import { RestServer } from "./server/server";
import AppConfig from "./config/app.config";
import packageInfo from "../package.json";
import fs from "fs";

import * as myTypes from "../../myRis.Web.Common/";
import * as myUtils from "../../myRis.Web.Common/utils";
import "../../myRis.Web.Common/helpers";
import path from "path";

global.gDataRootDir = path.join(
  process.env.ProgramData,
  process.env.NODE_ENV == "production"
    ? "\\Vieworks\\myRisWeb\\WebServer\\"
    : "\\Vieworks\\myRisWeb\\Debug\\"
);
global.gCacheDir = path.join(global.gDataRootDir, "Cache\\");

const appConfig: AppConfig = new AppConfig();

const loadConfig = async (): Promise<boolean> => {
  let res = true;
  res = await appConfig.loadAll();

  return res;
};

const displayStartMessage = (): void => {
  const env = process.env;
  const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
  const curDate = myUtils.GetDttm(
    new Date(),
    "YYYYMMDD",
    "HHMMSS",
    ".",
    ":",
    " "
  );
  const appAlias = packageInfo.alias;
  const appDesc = packageInfo.description;
  const ver = packageInfo.version;

  __logger.info("=====================================================");
  __logger.info(`====  Start ${appAlias} (${appDesc})`);
  __logger.info(
    `====  License: ${myTypes.parseLicenseType(global.gLicenseType)}`
  );
  __logger.info(`====  Language: ${language}`);
  __logger.info(`====  Version: ${ver}`);
  __logger.info(`====  Date: ${curDate}`);
  __logger.info(`====  Running Path: ${process.cwd()}`);
  __logger.info(`====  Data Path: ${global.gDataRootDir}`);
  __logger.info("=====================================================");
};

const displayTerminateMessage = (): void => {
  const appAlias = packageInfo.alias;
  const appDesc = packageInfo.description;
  //const curDate = myUtils.GetDttm(new Date(), "YYYYMMDD", "HHMMSS", ".", ":", " ");

  //__logger.info("=====================================================");
  __logger.info(`====  Terminate ${appAlias} (${appDesc})`);
  //__logger.info(`====  Date: ${curDate}`);
  //__logger.info("=====================================================");
};

const startServer = async (): Promise<boolean> => {
  if (!fs.existsSync(global.gCacheDir)) {
    fs.mkdirSync(global.gCacheDir, { recursive: true });
  }

  // Load Config
  const resLoadConfig = await loadConfig();
  console.log("Load Config : res(%s)", resLoadConfig.toString());
  if (!resLoadConfig) return false;

  const logger = new myRisLogger(appConfig.logInfo);
  global.__logger = logger.createLogger();
  global.gAppName = packageInfo.alias;
  global.gAppVer = packageInfo.version;
  global.gAppLang =
    process.env.LANG ||
    process.env.LANGUAGE ||
    process.env.LC_ALL ||
    process.env.LC_MESSAGES;
  global.gLicenseType = appConfig.webSrvInfo.webSrvInfo.licenseType;

  displayStartMessage();

  // Init Rest Server
  const application: RestServer = new RestServer(appConfig.webSrvInfo);
  const resDbInit: boolean = await application.initializeDatbase();

  if (!resDbInit) {
    __logger.error(
      `Failed to initialize Database : res(${resDbInit.toString()})`
    );
    return false;
  }

  // Process signals: https://jhnyang.tistory.com/143
  process.on("SIGINT", () => {
    __logger.info(`[Event Handler] ** Pressed CTRL + C`);
    displayTerminateMessage();
  }); // CTRL+C
  process.on("SIGQUIT", () => {
    __logger.info(`[Event Handler] ** Recieve QUIT Message`);
    displayTerminateMessage();
  }); // Keyboard quit
  process.on("SIGTERM", () => {
    __logger.info(`[Event Handler}] ** Recieve kill Message`);
    displayTerminateMessage();
  }); // `kill` command
  // 'SGITERM' means process was terminated gracefully
  process.once("SIGTERM", (code) => {
    __logger.error(`[Event Handler] ** SIGTERM Occur! ${code}`);
  });
  //

  process.on("exit", (code) => {
    __logger.info(`[Event Handler] ** Recieve exit Message ${code}`);

    if (code !== 0) {
      __logger.error(`[Event Handler] ** Error) Process exit! ${code}`);
    }

    displayTerminateMessage();
  });

  process.on("beforeExit", (code) => {
    __logger.info(`[Event Handler] ** Process beforeExit! ${code}`);
  });

  application.start();

  return true;
};

startServer();
