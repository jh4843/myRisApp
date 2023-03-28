import winston, { Logger } from "winston";
import winstonDaily from "winston-daily-rotate-file";
import { IConfigLogInfo } from "@/types";

export default class myRisLogger {
  cfgLogInfo: IConfigLogInfo;

  constructor(cfgLogInfo: IConfigLogInfo) {
    // common
    this.cfgLogInfo = cfgLogInfo;
  }

  createLogger(): Logger {
    const { combine, timestamp, printf } = winston.format;

    const logFormat = printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    });

    const logger = winston.createLogger({
      level: process.env.NODE_ENV == "production" ? "info" : "debug",
      format: combine(
        timestamp({
          format: this.cfgLogInfo._format,
        }),
        logFormat
      ),

      transports: [
        process.env.NODE_ENV == "production"
          ? new winstonDaily(this.cfgLogInfo._info)
          : new winstonDaily(this.cfgLogInfo._debug),
        //new winstonDaily(this.cfgLogInfo._info),
        new winstonDaily(this.cfgLogInfo._error),
        //new winstonDaily(this.cfgLogInfo._debug),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // 색깔 넣어서 출력
            winston.format.simple() // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
          ),
        })
      );
    }

    logger.info(`[myRisLogger::createLogger] Logger is initialized`);

    return logger;
  }
}
