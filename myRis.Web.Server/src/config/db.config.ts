//const mariadb = require("mariadb");

import * as mariadb from "mariadb";

const mariaDBPool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "myRisWEB!!",
  database: "MWLDB", //testdb
  connectionLimit: 5,
});

const initialDBPool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "myRisWEB!!",
  connectionLimit: 5,
});

export class DBConnectionPool {
  constructor() {}

  getConnection(): Promise<any> {
    return new Promise(function (res, rej) {
      mariaDBPool
        .getConnection()
        .then(function (conn: any) {
          res(conn);
        })
        .catch(function (error: any) {
          rej(error);
        });
    });
  }

  getInitialConnection(): Promise<any> {
    return new Promise(function (res, rej) {
      initialDBPool
        .getConnection()
        .then(function (conn: any) {
          res(conn);
        })
        .catch(function (error: any) {
          rej(error);
        });
    });
  }
}
