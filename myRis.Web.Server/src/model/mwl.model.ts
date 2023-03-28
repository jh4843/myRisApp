//const pool = require("config/db.config");
import * as myTypes from "../../../myRis.Web.Common";
import * as myUtils from "../../../myRis.Web.Common/utils";
import MwlUtils from "./utils/mwl.utils";
import { DBConnectionPool } from "../config/db.config";

export class MwlModel {
  private databasePool: DBConnectionPool;
  private mwlUtils: MwlUtils;

  constructor() {
    this.databasePool = new DBConnectionPool();
    this.mwlUtils = new MwlUtils();
  }

  //#region GET
  // url: /get-worklist
  async getWorklist(
    searchCondition: myTypes.IMwlGetWorklistQueryCondition
  ): Promise<myTypes.IMwlGetWorklistResponse> {
    let res: myTypes.IMwlGetWorklistResponse = {
      result: false,
      err_code: 0,
      data: [],
    };
    let conn, rows, query;
    let count = 10;

    const {
      reqPage,
      reqCount,
      is_strict_condition,

      reqSortColumn,
      reqSortOrder,

      pt_id,
      pt_name,

      ord_acc_num,
      ord_rp_id,
      ord_status,
      proc_plan_id,

      sps_modality,
      sps_start_dttm_from,
      sps_start_dttm_to,
      sps_station_ae_title,

      ord_referring_phyc,
    } = searchCondition;

    if (reqCount != undefined) {
      count = reqCount;
    }

    // let startIndex = 0;

    // if (reqPage != undefined) {
    //   startIndex = (reqPage - 1) * count;
    // }

    const fromDttm = new Date(sps_start_dttm_from);
    const toDttm = new Date(sps_start_dttm_to);

    let spsStartDttmFrom: undefined | string = undefined;
    let spsStartDttmTo: undefined | string = undefined;

    if (sps_start_dttm_from != undefined) {
      spsStartDttmFrom = myUtils.ConvertDateTimeForDbFromUtc(fromDttm);
    }

    if (sps_start_dttm_to != undefined) {
      spsStartDttmTo = myUtils.ConvertDateTimeForDbFromUtc(toDttm);
    }

    let minDate = new Date("1900-01-01T00:00:00");

    let queryArray: string[] = [];
    let queryWhere = "";

    if (is_strict_condition) {
      if (pt_id) {
        queryArray.push(`pt_id = "${pt_id}"`);
      }

      if (pt_name) {
        queryArray.push(`pt_name = "${pt_name}"`);
      }

      if (ord_acc_num) {
        queryArray.push(`ord_acc_num = "${ord_acc_num}"`);
      }

      if (ord_rp_id) {
        queryArray.push(`ord_rp_id = "${ord_rp_id}"`);
      }

      if (ord_status) {
        queryArray.push(`ord_status_flag = "${ord_status}"`);
      }

      if (proc_plan_id) {
        queryArray.push(`proc_plan_id = "${proc_plan_id}"`);
      }

      if (sps_modality) {
        queryArray.push(`sps_modality = "${sps_modality}"`);
      }

      if (ord_referring_phyc) {
        queryArray.push(`ord_referring_phyc = "${ord_referring_phyc}"`);
      }

      if (sps_station_ae_title) {
        queryArray.push(`sps_station_ae_title = "${sps_station_ae_title}"`);
      }
    } else {
      if (pt_id) {
        queryArray.push(`pt_id LIKE "%${pt_id}%"`);
      }

      if (pt_name) {
        queryArray.push(`pt_name LIKE "%${pt_name}%"`);
      }

      if (ord_acc_num) {
        queryArray.push(`ord_acc_num LIKE "%${ord_acc_num}%"`);
      }

      if (ord_rp_id) {
        queryArray.push(`ord_rp_id LIKE "%${ord_rp_id}%"`);
      }

      if (ord_status) {
        queryArray.push(`ord_status_flag = "${ord_status}"`);
      }

      if (proc_plan_id) {
        queryArray.push(`proc_plan_id LIKE "%${proc_plan_id}%"`);
      }

      if (sps_modality) {
        queryArray.push(`sps_modality LIKE "%${sps_modality}%"`);
      }

      if (ord_referring_phyc) {
        queryArray.push(`ord_referring_phyc LIKE "%${ord_referring_phyc}%"`);
      }

      if (sps_station_ae_title) {
        queryArray.push(
          `sps_station_ae_title LIKE "%${sps_station_ae_title}%"`
        );
      }
    }

    if (sps_start_dttm_from != undefined && sps_start_dttm_to != undefined) {
      if (
        new Date(sps_start_dttm_from) > minDate &&
        new Date(sps_start_dttm_to) > minDate
      ) {
        queryArray.push(
          `DATE(T_SPS.sps_start_dttm) BETWEEN DATE("${spsStartDttmFrom}") AND DATE("${spsStartDttmTo}")`
        );
      }
    } else if (sps_start_dttm_to != undefined) {
      if (new Date(sps_start_dttm_to) > minDate) {
        // only to
        queryArray.push(
          `DATE(T_SPS.sps_start_dttm) <= DATE("${spsStartDttmTo}")`
        );
      }
    } else if (sps_start_dttm_from != undefined) {
      if (new Date(sps_start_dttm_from) > minDate) {
        // only from
        queryArray.push(
          `DATE(T_SPS.sps_start_dttm) >= DATE("${spsStartDttmFrom}")`
        );
      }
    }

    for (let i = 0; i < queryArray.length; i++) {
      if (i > 0) {
        queryWhere += " AND ";
      }

      queryWhere += queryArray[i];
    }

    try {
      conn = await this.databasePool.getConnection();

      if (gLicenseType == myTypes.eLicenseType.Human) {
        if (queryArray.length > 0) {
          query = `SELECT ${myTypes.PatientAllColumns}, ${myTypes.OrderAllColumns}, ${myTypes.SpsAllColumns}
          FROM T_SPS
          INNER JOIN (T_ORDER, T_PATIENT) 
          ON (T_SPS.sps_ord_key = T_ORDER.ord_key
          AND T_ORDER.ord_pt_key = T_PATIENT.pt_key)
          WHERE ${queryWhere}
          ORDER BY ${reqSortColumn} ${reqSortOrder}`;
          //LIMIT ${startIndex}, ${count}`;
        } else {
          query = `SELECT ${myTypes.PatientAllColumns}, ${myTypes.OrderAllColumns}, ${myTypes.SpsAllColumns}
          FROM T_SPS
          INNER JOIN T_ORDER ON T_SPS.sps_ord_key = T_ORDER.ord_key
          INNER JOIN T_PATIENT ON T_ORDER.ord_pt_key = T_PATIENT.pt_key
          ORDER BY ${reqSortColumn} ${reqSortOrder}`;
        }
      } else {
        if (queryArray.length > 0) {
          query = `SELECT ${myTypes.PatientAllColumns}, ${myTypes.OrderAllColumns}, ${myTypes.SpsAllColumns}, ${myTypes.SpeciesAllColumns}, ${myTypes.BreedAllColumns}
  
          FROM T_SPS
          INNER JOIN (T_ORDER, T_PATIENT, T_SPECIES, T_BREED) 
          ON (T_SPS.sps_ord_key = T_ORDER.ord_key
          AND T_ORDER.ord_pt_key = T_PATIENT.pt_key
          AND T_PATIENT.pt_species_key = T_SPECIES.species_key
          AND T_PATIENT.pt_breed_key = T_BREED.breed_key)
          WHERE ${queryWhere}
          ORDER BY ${reqSortColumn} ${reqSortOrder}`;
          //LIMIT ${startIndex}, ${count}`;
        } else {
          query = `SELECT ${myTypes.PatientAllColumns}, ${myTypes.OrderAllColumns}, ${myTypes.SpsAllColumns}, ${myTypes.SpeciesAllColumns}, ${myTypes.BreedAllColumns}
  
          FROM T_SPS
          INNER JOIN T_ORDER ON T_SPS.sps_ord_key = T_ORDER.ord_key
          INNER JOIN T_PATIENT ON T_ORDER.ord_pt_key = T_PATIENT.pt_key
          INNER JOIN T_SPECIES ON T_PATIENT.pt_species_key = T_SPECIES.species_key
          INNER JOIN T_BREED ON T_PATIENT.pt_breed_key = T_BREED.breed_key
          ORDER BY ${reqSortColumn} ${reqSortOrder}`;
        }
      }

      rows = await conn.query(query);

      const len: number = rows.length;

      for (let i = 0; i < len; i++) {
        rows[i].pt_age = myUtils.calcAge(new Date(rows[i].pt_birth_dttm));
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getWorklist] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-patient-list
  async getPatientList(
    searchCondition: myTypes.IMwlGetPatientListQueryCondition
  ): Promise<myTypes.IMwlGetPatientListResponse> {
    let res: myTypes.IMwlGetPatientListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn, query;
    let rows: myTypes.IDbPatient[] = [];

    const { pt_key, pt_id, pt_name, is_strict_condition } = searchCondition;

    let pt_first_name = undefined;
    let pt_last_name = undefined;
    let pt_full_name = undefined;

    if (pt_name != undefined) {
      pt_first_name = myUtils.GetFirstNameFromPN(searchCondition.pt_name);
      pt_last_name = myUtils.GetLastNameFromPN(searchCondition.pt_name);
      pt_full_name = `${pt_last_name}^${pt_first_name}`;
    }

    let queryArray: string[] = [];
    let queryWhere = "";

    if (pt_key != undefined && pt_key > -1) {
      queryArray.push(`pt_key = ${pt_key}`);
    }

    if (is_strict_condition) {
      if (pt_id != undefined && pt_id != "") {
        queryArray.push(`pt_id = "${pt_id}"`);
      }

      if (
        (searchCondition.pt_name != undefined && pt_first_name != "") ||
        pt_last_name != ""
      ) {
        queryArray.push(`pt_name = "${pt_full_name}"`);
      }
    } else {
      if (pt_id != undefined && pt_id != "") {
        queryArray.push(`pt_id LIKE "%${pt_id}%"`);
      }

      if (pt_first_name != undefined && pt_first_name != "") {
        queryArray.push(`pt_name LIKE "%${pt_first_name}%"`);
      }

      if (pt_last_name != undefined && pt_last_name != "") {
        queryArray.push(`pt_name LIKE "%${pt_last_name}%"`);
      }
    }

    if (queryArray.length > 0) {
      queryWhere = " WHERE ";
      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += " AND ";
        }

        queryWhere += queryArray[i];
      }
    }

    try {
      conn = await this.databasePool.getConnection();

      if (gLicenseType == myTypes.eLicenseType.Human) {
        query = `SELECT * FROM T_PATIENT ${queryWhere}`;
      } else {
        query = `SELECT ${myTypes.VetPatientAllColumns} FROM T_PATIENT 
        INNER JOIN (T_SPECIES, T_BREED)
        ON (T_PATIENT.pt_species_key = T_SPECIES.species_key
        AND T_PATIENT.pt_breed_key = T_BREED.breed_key)
        ${queryWhere}`;
      }

      rows = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        rows[i].pt_age = myUtils.calcAge(new Date(rows[i].pt_birth_dttm));
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getPatientList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-order-list
  async getOrderList(
    searchCondition: myTypes.IMwlGetOrderListQueryCondition
  ): Promise<myTypes.IMwlGetOrderListResponse> {
    let res: myTypes.IMwlGetOrderListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn, query;

    let { ord_key, pt_id, acc_num } = searchCondition;
    let pt_first_name = "";
    let pt_last_name = "";
    let pt_full_name = "";

    if (searchCondition.pt_name != undefined) {
      pt_first_name = myUtils.GetFirstNameFromPN(searchCondition.pt_name);
      pt_last_name = myUtils.GetLastNameFromPN(searchCondition.pt_name);
      pt_full_name = `${pt_last_name}^${pt_first_name}`;
    }

    let isStrictCondition = searchCondition.is_strict_condition;

    let queryArray: string[] = [];
    let queryWhere = "";

    if (ord_key > -1) {
      queryArray.push(`T_ORDER.ord_key = "${ord_key}"`);
    } else if (isStrictCondition) {
      if (acc_num != undefined && acc_num != "") {
        queryArray.push(`T_ORDER.ord_acc_num = "${acc_num}"`);
      }

      if (pt_id != undefined && pt_id != "") {
        queryArray.push(`T_PATIENT.pt_id = "${pt_id}"`);
      }

      if (
        (pt_full_name != undefined && pt_first_name != "") ||
        pt_last_name != ""
      ) {
        queryArray.push(`T_PATIENT.pt_name = "${pt_full_name}"`);
      }
    } else {
      if (acc_num != undefined && acc_num != "") {
        queryArray.push(`T_ORDER.ord_acc_num LIKE "%${acc_num}%"`);
      }

      if (pt_id != undefined && pt_id != "") {
        queryArray.push(`T_ORDER.pt_id LIKE "%${pt_id}%"`);
      }

      if (pt_full_name != undefined) {
        if (pt_first_name != "") {
          queryArray.push(`T_PATIENT.pt_name LIKE "%${pt_first_name}%"`);
        }

        if (pt_last_name != "") {
          queryArray.push(`T_PATIENT.pt_name LIKE "%${pt_last_name}%"`);
        }
      }
    }

    if (queryArray.length > 0) {
      queryWhere = "WHERE ";

      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += "AND ";
        }

        queryWhere += queryArray[i] + " ";
      }
    } else {
      queryWhere = "";
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * FROM T_ORDER INNER JOIN T_PATIENT ON T_PATIENT.pt_key = T_ORDER.ord_pt_key ${queryWhere}`;

      const rows: myTypes.IDbOrderJoinPatient[] = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getOrderList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-sps-list
  async getSpsList(
    searchCondition: myTypes.IMwlGetSpsListQueryCondition
  ): Promise<myTypes.IMwlGetSpsListResponse> {
    let res: myTypes.IMwlGetSpsListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn, query;

    let { sps_keys, ord_key } = searchCondition;

    let isStrictCondition = searchCondition.is_strict_condition;

    let queryArray: string[] = [];
    let queryWhere = "";

    if (sps_keys != undefined || sps_keys == "") {
      const queryKey = myUtils.getMultipleStrValQuery(
        "sps_key",
        sps_keys,
        myTypes.dataSeparator
      );

      if (isStrictCondition) {
        if (queryKey != undefined && queryKey != "") {
          queryArray.push(`${queryKey}`);
        }
      } else {
        if (queryKey != undefined && queryKey != "") {
          queryArray.push(`${queryKey}`);
        }
      }
    } else if (ord_key != undefined) {
      queryArray.push(`sps_ord_key = "${ord_key}"`);
    }

    if (queryArray.length > 0) {
      queryWhere = "WHERE ";
    }

    for (let i = 0; i < queryArray.length; i++) {
      if (i > 0) {
        queryWhere += " AND ";
      }

      queryWhere += queryArray[i];
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * FROM T_SPS ${queryWhere}`;

      const rows: myTypes.IDbSps[] = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getSpsList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-proc-plan-list
  async getProcPlanList(
    searchCondition: myTypes.IMwlGetProcPlanListQueryCondition
  ): Promise<myTypes.IMwlGetProcPlanListResponse> {
    let res: myTypes.IMwlGetProcPlanListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn, query;
    let rows: myTypes.IDbProcPlan[] = [];

    let proc_plan_id = "";
    if (
      searchCondition.proc_plan_id != undefined &&
      searchCondition.proc_plan_id != ""
    ) {
      if (Number(searchCondition.proc_plan_id) != -1) {
        proc_plan_id = searchCondition.proc_plan_id;
      }
    }

    let proc_plan_desc = searchCondition.proc_plan_desc;
    let isStrictCondition = searchCondition.is_strict_condition;

    let queryArray: string[] = [];
    let queryWhere = "";

    if (isStrictCondition == true) {
      if (proc_plan_id != "") {
        queryArray.push(`proc_plan_id = "${proc_plan_id}"`);
      }
      if (proc_plan_desc != "") {
        queryArray.push(`proc_plan_desc = "${proc_plan_desc}"`);
      }
    } else {
      if (proc_plan_id != "") {
        queryArray.push(`proc_plan_id LIKE "%${proc_plan_id}%"`);
        //queryDetail = `proc_plan_id LIKE "%${proc_plan_id}%"`;
      }

      if (proc_plan_desc != "") {
        queryArray.push(`proc_plan_desc LIKE "%${proc_plan_desc}%"`);
      }
    }

    if (queryArray.length > 0) {
      queryWhere = "WHERE ";
    }

    for (let i = 0; i < queryArray.length; i++) {
      if (i > 0) {
        queryWhere += " AND ";
      }

      queryWhere += queryArray[i];
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * FROM T_PROC_PLAN ${queryWhere}`;

      rows = await conn.query(query);

      let protocols: myTypes.IProcPlanProtocol[] = [];

      for (let i = 0; i < rows.length; i++) {
        protocols = [];
        rows[i].proc_plan_protocols = [];

        query = `SELECT T_PROTOCOL.prot_key, T_PROTOCOL.prot_id, T_PROTOCOL.prot_desc FROM I_PROCPLAN_PROT 
        INNER JOIN T_PROTOCOL ON T_PROTOCOL.prot_key = I_PROCPLAN_PROT.pp_prot_prot_key 
        WHERE pp_prot_proc_plan_key = ${rows[i].proc_plan_key}`;

        protocols = await conn.query(query);

        for (const prot of protocols) {
          rows[i].proc_plan_protocols.push(prot);
        }

        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getProcPlanList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-protocol-list
  async getProtocolList(
    searchCondition: myTypes.IMwlGetProtocolListQueryCondition
  ): Promise<myTypes.IMwlGetProtocolListResponse> {
    let res: myTypes.IMwlGetProtocolListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn, query;
    let rows: myTypes.IDbProtocol[] = [];

    const {
      proc_plan_key,
      protocol_keys,
      prot_desc,

      is_strict_condition,
    } = searchCondition;

    if (proc_plan_key != undefined && proc_plan_key > 0) {
      try {
        conn = await this.databasePool.getConnection();

        query = `SELECT T_PROTOCOL.*, T_BODYPART.* 
        FROM I_PROCPLAN_PROT 
        INNER JOIN T_PROTOCOL ON T_PROTOCOL.prot_key = I_PROCPLAN_PROT.pp_prot_prot_key 
        INNER JOIN T_BODYPART ON T_BODYPART.bp_key = T_PROTOCOL.prot_bp_key
        WHERE pp_prot_proc_plan_key = ${proc_plan_key}`;

        rows = await conn.query(query);

        for (let i = 0; i < rows.length; i++) {
          res.data.push(rows[i]);
        }

        res.result = true;
      } catch (err: any) {
        console.log("err: ", err);
        __logger.error(
          `[mwl.model::getProtocolList] ${err.errno} ${err.code} ${err.text} `
        );
        res.result = false;

        switch (err.errno) {
          default:
            res.err_code = err.code;
            break;
        }

        throw err;
      } finally {
        if (conn) conn.end();
        return res;
      }
    } else {
      let queryArray: string[] = [];
      let queryWhere = "";

      if (protocol_keys != undefined && protocol_keys.length > 0) {
        const queryKeys = myUtils.getArrayNumValuQuery(
          "prot_key",
          protocol_keys
        );
        queryArray.push(`${queryKeys}`);
      }

      if (is_strict_condition) {
        // Description
        if (prot_desc != undefined && prot_desc != "") {
          queryArray.push(`prot_desc = "${prot_desc}"`);
        }
      } else {
        if (prot_desc != undefined && prot_desc != "") {
          queryArray.push(`prot_desc LIKE "%${prot_desc}%"`);
        }
      }

      if (queryArray.length > 0) {
        queryWhere = "WHERE ";
      }

      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += " AND ";
        }

        queryWhere += queryArray[i];
      }

      try {
        conn = await this.databasePool.getConnection();

        query = `SELECT T_PROTOCOL.*, T_BODYPART.* 
        FROM T_PROTOCOL 
        INNER JOIN T_BODYPART ON T_BODYPART.bp_key = T_PROTOCOL.prot_bp_key
        ${queryWhere}`;

        rows = await conn.query(query);

        for (let i = 0; i < rows.length; i++) {
          res.data.push(rows[i]);
        }

        res.result = true;
      } catch (err: any) {
        console.log("err: ", err);
        __logger.error(
          `[mwl.model::getProtocolList] ${err.errno} ${err.code} ${err.text} `
        );
        res.result = false;

        switch (err.errno) {
          default:
            res.err_code = err.code;
            break;
        }

        throw err;
      } finally {
        if (conn) conn.end();
        return res;
      }
    }
  }

  // url: /get-bodypart-list
  async getBodypartList(
    searchCondition: myTypes.IMwlGetBodypartListQueryCondition
  ): Promise<myTypes.IMwlGetBodypartListResponse> {
    let res: myTypes.IMwlGetBodypartListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn,
      query = undefined;
    let rows: myTypes.IDbBodypart[] = [];

    const { is_strict_condition } = searchCondition;

    const bp_type =
      gLicenseType == myTypes.eLicenseType.Human
        ? myTypes.eBodypartType.HUMAN
        : myTypes.eBodypartType.VETERINARY;

    let queryArray: string[] = [];
    queryArray.push(`bp_type = "${bp_type}"`);

    let queryWhere = "WHERE ";

    if (
      searchCondition.bp_keys != undefined &&
      searchCondition.bp_keys.length > 0
    ) {
      const queryKeys = myUtils.getArrayNumValuQuery(
        "bp_key",
        searchCondition.bp_keys
      );
      queryArray.push(`${queryKeys}`);
    } else if (searchCondition.bp_code_meaning != undefined) {
      let bp_code_meaning = searchCondition.bp_code_meaning;

      if (is_strict_condition) {
        if (bp_code_meaning != "") {
          queryArray.push(`bp_code_meaning = "${bp_code_meaning}"`);
        }
      } else {
        if (bp_code_meaning != "") {
          queryArray.push(`bp_code_meaning LIKE "%${bp_code_meaning}%"`);
        }
      }
    }

    for (let i = 0; i < queryArray.length; i++) {
      if (i > 0) {
        queryWhere += " AND ";
      }

      queryWhere += queryArray[i];
    }

    query = `SELECT * FROM T_BODYPART ${queryWhere}`;

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getBodyPartList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-species-list
  async getSpeciesList(
    searchCondition: myTypes.IMwlGetSpeciesListQueryCondition
  ): Promise<myTypes.IMwlGetSpeciesListResponse> {
    let res: myTypes.IMwlGetSpeciesListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn,
      query = undefined;
    let rows: myTypes.IDbSpecies[] = [];

    const { species_key, species_type } = searchCondition;

    let queryWhere = "";

    if (species_key != undefined && species_key.length > 0) {
      let queryArray: string[] = [];

      const queryKeys = myUtils.getArrayNumValuQuery(
        "species_key",
        species_key
      );
      queryArray.push(`${queryKeys}`);

      if (queryArray.length > 0) {
        queryWhere = "WHERE ";
      }

      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += " AND ";
        }

        queryWhere += queryArray[i];
      }
    } else if (
      species_type != undefined &&
      species_type > myTypes.eSpeciesType.INVALID &&
      species_type <= myTypes.eSpeciesType.Etc
    ) {
      queryWhere = `WHERE species_type = "${species_type}"`;
    }

    query = `SELECT * FROM T_SPECIES ${queryWhere}`;

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getSpeciesList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-breed-list
  async getBreedList(
    searchCondition: myTypes.IMwlGetBreedListQueryCondition
  ): Promise<myTypes.IMwlGetBreedListResponse> {
    let res: myTypes.IMwlGetBreedListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn,
      query = undefined;
    let rows: myTypes.IDbBreed[] = [];

    const { breed_key, breed_species_type } = searchCondition;

    let queryWhere = "";

    if (breed_key != undefined && breed_key.length > 0) {
      let queryArray: string[] = [];

      const queryKeys = myUtils.getArrayNumValuQuery("breed_key", breed_key);
      queryArray.push(`${queryKeys}`);

      if (queryArray.length > 0) {
        queryWhere = "WHERE ";
      }

      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += " AND ";
        }

        queryWhere += queryArray[i];
      }
    } else if (
      breed_species_type != undefined &&
      breed_species_type > myTypes.eSpeciesType.INVALID &&
      breed_species_type <= myTypes.eSpeciesType.Etc
    ) {
      queryWhere = `WHERE breed_species_type = ${breed_species_type}`;
    }

    query = `SELECT * FROM T_BREED ${queryWhere}`;

    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getBreedList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-station-list
  async getStationList(
    searchCondition: myTypes.IMwlGetStationListQueryCondition
  ): Promise<myTypes.IMwlGetStationListResponse> {
    let res: myTypes.IMwlGetStationListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn, query;
    let rows: myTypes.IDbStation[] = [];

    let queryArray: string[] = [];
    let queryWhere = "";

    if (
      searchCondition.station_ae_title != undefined ||
      searchCondition.station_name != undefined
    ) {
      let station_ae_title = searchCondition.station_ae_title;
      let station_name = searchCondition.station_name;
      let isStrictCondition = searchCondition.is_strict_condition;

      if (isStrictCondition) {
        if (station_ae_title != "") {
          queryArray.push(`station_ae_title = "${station_ae_title}"`);
        } else if (station_name != "") {
          queryArray.push(`station_name = "${station_name}"`);
        }
      } else {
        if (station_ae_title != "") {
          queryArray.push(`station_ae_title LIKE "%${station_ae_title}%"`);
        } else if (station_name != "") {
          queryArray.push(`station_name LIKE "%${station_name}%"`);
        }
      }

      if (queryArray.length > 0) {
        queryWhere = "WHERE ";
      }

      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += " AND ";
        }

        queryWhere += queryArray[i];
      }
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * FROM T_STATION ${queryWhere}`;

      rows = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push({
          station_key: rows[i].station_key,
          station_ae_title: rows[i].station_ae_title,
          station_name: rows[i].station_name,
        });
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getStationList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-ord-reason-list
  async getOrdReasonList(
    searchCondition: myTypes.IMwlGetOrdReasonListQueryCondition
  ): Promise<myTypes.IMwlGetOrdReasonListResponse> {
    let res: myTypes.IMwlGetOrdReasonListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };

    const { ord_reason_type } = searchCondition;

    let conn, query;
    let rows: myTypes.IDbOrdReason[] = [];

    let queryArray: string[] = [];
    let queryWhere = "";

    if (ord_reason_type != undefined) {
      queryArray.push(`ord_reason_type = ${ord_reason_type}`);

      if (queryArray.length > 0) {
        queryWhere = "WHERE ";
      }

      for (let i = 0; i < queryArray.length; i++) {
        if (i > 0) {
          queryWhere += " AND ";
        }

        queryWhere += queryArray[i];
      }
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * FROM T_ORD_REASON ${queryWhere}`;

      rows = await conn.query(query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getOrderReasonList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-bp-list
  async getBpList(
    searchCondition: myTypes.IMwlGetBpListQueryCondition
  ): Promise<myTypes.IMwlGetBpListResponse> {
    let res: myTypes.IMwlGetBpListResponse = {
      result: false,
      err_code: 0,

      data: [],
    };
    let conn, query;
    let rows: myTypes.IDbBodypart[] = [];

    let isStrictCondition = searchCondition.is_strict_condition;
    let queryArray: string[] = [];
    let queryWhere = "";

    const bp_type =
      gLicenseType == myTypes.eLicenseType.Human
        ? myTypes.eBodypartType.HUMAN
        : myTypes.eBodypartType.VETERINARY;

    queryArray.push(`bp_type = "${bp_type}"`);

    if (searchCondition.bp_key != undefined && searchCondition.bp_key > -1) {
      queryArray.push(`bp_key = "${searchCondition.bp_key}"`);
    } else if (
      searchCondition.bp_key != undefined ||
      searchCondition.bp_code_meaning != undefined
    ) {
      let bp_code_meaning = searchCondition.bp_code_meaning;

      if (isStrictCondition) {
        if (bp_code_meaning != "") {
          queryArray.push(`bp_code_meaning = "${bp_code_meaning}"`);
        }
      } else {
        if (bp_code_meaning != "") {
          queryArray.push(`bp_code_meaning LIKE "%${bp_code_meaning}%"`);
        }
      }
    }

    if (queryArray.length > 0) {
      queryWhere = "WHERE ";
    }

    for (let i = 0; i < queryArray.length; i++) {
      if (i > 0) {
        queryWhere += " AND ";
      }

      queryWhere += queryArray[i];
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `SELECT * FROM T_BODYPART ${queryWhere}`;

      rows = await conn.query(query);

      console.log("query: ", query);

      for (let i = 0; i < rows.length; i++) {
        res.data.push(rows[i]);
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::getBpList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      console.log("Query: ", query);

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }

      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /get-new-acc-no
  async getNewAccNumber(): Promise<myTypes.IMwlGetNewAccNumberResponse> {
    let res: myTypes.IMwlGetNewAccNumberResponse = {
      result: false,
      err_code: 0,

      acc_num: "",
    };

    let latestAccNo = await this.mwlUtils.getAccSeqNo();
    let seqNo: number = 0;
    let oldSeqNo: number = -1;

    if (latestAccNo != undefined && latestAccNo != "") {
      oldSeqNo = Number(latestAccNo.slice(-4));
    }

    seqNo = oldSeqNo + 1;

    res.acc_num = myUtils.generateAccNumber(seqNo);
    res.result = true;

    return res;
  }

  // url: /get-new-prot-code-bodypart
  async getNewBodypartBodypart(): Promise<myTypes.IMwlGetNewBodypartResponse> {
    let res: myTypes.IMwlGetNewBodypartResponse = {
      result: false,
      err_code: 0,

      bp_value: "",
    };

    const seqNo = await this.mwlUtils.getBodypartBodypartSeq();

    if (seqNo <= 0) {
      res.bp_value = "";
      res.err_code = 12030;
      res.result = false;

      return res;
    }

    res.bp_value = myUtils.generateBodyPartCodeValue(seqNo);

    if (res.bp_value == undefined || res.bp_value == "") {
      res.result = false;
      res.err_code = 12031;
    } else {
      res.result = true;
    }

    return res;
  }

  //#endregion

  //#region POST (ADD)
  // url: /add-patient
  async addPatient(
    queryPatientInfo: myTypes.IMwlAddPatientRequest
  ): Promise<myTypes.IMwlAddPatientResponse> {
    let {
      pt_id,
      pt_name,
      pt_sex,

      pt_age,
      pt_birth_dttm,

      pt_weight,
      pt_size,

      pt_address,
      pt_tel,

      pt_state,
      pt_med_alert,
      pt_allergies,

      pt_comment,
      pt_responsible_person,

      pt_species_key,
      pt_breed_key,
    } = queryPatientInfo;

    let initDate = new Date("1900-01-01T00:00:00");

    let res: myTypes.IMwlAddPatientResponse = {
      result: false,
      err_code: 0,
      pt_key: -1,
    };

    if (pt_id == undefined || pt_id == "") {
      res.result = false;
      res.err_code = 12002;

      return res;
    }

    if (pt_name == undefined || pt_name == "") {
      res.result = false;
      res.err_code = 12003;

      return res;
    }

    if (pt_birth_dttm == undefined || pt_birth_dttm == null) {
      res.result = false;
      res.err_code = 12004;

      return res;
    } else if (pt_birth_dttm < initDate) {
      res.result = false;
      res.err_code = 12004;

      return res;
    }

    const ptBirthDttmIso = myUtils.ConvertDateForDbFromUtc(pt_birth_dttm);

    let conn, rows, query;
    try {
      conn = await this.databasePool.getConnection();

      if (gLicenseType == myTypes.eLicenseType.Human) {
        query = `INSERT INTO T_PATIENT(pt_id, pt_name, pt_sex, pt_age, pt_birth_dttm, pt_weight, pt_size, pt_address, pt_tel, pt_state, pt_med_alert, pt_allergies, pt_comment )
          VALUES('${pt_id}','${pt_name}', '${pt_sex}', '${pt_age}','${ptBirthDttmIso}','${pt_weight}','${pt_size}','${pt_address}','${pt_tel}','${pt_state}','${pt_med_alert}','${pt_allergies}','${pt_comment}')`;
      } else {
        query = `INSERT INTO T_PATIENT(pt_id, pt_name, pt_sex, pt_age, pt_birth_dttm, pt_weight, pt_size, pt_address, pt_tel, pt_state, pt_med_alert, pt_allergies, pt_comment, pt_responsible_person, pt_species_key, pt_breed_key )
          VALUES('${pt_id}','${pt_name}', '${pt_sex}', '${pt_age}','${ptBirthDttmIso}','${pt_weight}','${pt_size}','${pt_address}','${pt_tel}','${pt_state}','${pt_med_alert}','${pt_allergies}','${pt_comment}', '${pt_responsible_person}', ${pt_species_key}, ${pt_breed_key})`;
      }

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.pt_key = rows.insertId;
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addPatient] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /add-order
  async addOrder(
    queryOrderInfo: myTypes.IMwlAddOrderRequest
  ): Promise<myTypes.IMwlAddOrderResponse> {
    let {
      ord_pt_key,

      ord_acc_num,
      ord_issuer,
      ord_create_dttm,

      ord_status_flag,
      ord_requesting_phyc,
      ord_referring_phyc,

      ord_study_dttm,
      ord_reason,
      ord_priority,

      ord_rp_id,
      ord_rp_desc,

      ord_pt_age,
      ord_pt_weight,
      ord_pt_size,
    } = queryOrderInfo;

    // TODO: put SeqNo
    //let proc_plan = myUtils.getProcPlan();
    //let proc_plan_id = myUtils.generateRpID(proc_plan);
    let ord_study_uid = myUtils.generateStudyInstanceUID(1);

    let res: myTypes.IMwlAddOrderResponse = {
      result: false,
      err_code: 0,
      ord_key: -1,
    };

    if (ord_pt_key == undefined || ord_pt_key < 0) {
      res.result = false;
      res.err_code = 12005;

      return res;
    }

    if (ord_acc_num == undefined || ord_acc_num == "") {
      res.result = false;
      res.err_code = 12006;

      return res;
    }

    if (ord_study_uid == undefined || ord_study_uid == "") {
      res.result = false;
      res.err_code = 12004;

      return res;
    }

    // default 1 (none)
    if (ord_rp_id == undefined) {
      res.result = false;
      res.err_code = 12005;

      return res;
    }

    const createDttm = myUtils.ConvertDateTimeForDbFromUtc(ord_create_dttm);
    const studyDttm = myUtils.ConvertDateTimeForDbFromUtc(ord_study_dttm);

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();
      query = `INSERT INTO T_ORDER(ord_pt_key, ord_acc_num, ord_issuer, ord_create_dttm, ord_status_flag, ord_requesting_phyc, ord_referring_phyc, ord_study_uid, ord_study_dttm, ord_reason, ord_priority, ord_rp_id, ord_rp_desc, ord_pt_age, ord_pt_weight, ord_pt_size) 
      VALUES('${ord_pt_key}','${ord_acc_num}', '${ord_issuer}', '${createDttm}','${ord_status_flag}','${ord_requesting_phyc}','${ord_referring_phyc}','${ord_study_uid}','${studyDttm}','${ord_reason}','${ord_priority}', '${ord_rp_id}', '${ord_rp_desc}','${ord_pt_age}','${ord_pt_weight}','${ord_pt_size}')`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.ord_key = rows.insertId;
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addOrder] ${err.errno} ${err.code} ${err.text} `
      );

      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /add-sps
  async addSps(
    queryInfo: myTypes.IMwlAddSpsRequest
  ): Promise<myTypes.IMwlAddSpsResponse> {
    const {
      sps_ord_key,

      sps_id,
      sps_start_dttm,
      sps_end_dttm,

      sps_station_ae_title,
      sps_station_name,
      sps_modality,
      sps_bp_code_value,
      sps_bp_scm_design,
      sps_bp_meaning,

      sps_desc,
      sps_perform_phyc_name,
      sps_pre_med,
    } = queryInfo;

    let res: myTypes.IMwlAddSpsResponse = {
      result: false,
      err_code: 0,
      sps_key: -1,
    };

    if (sps_ord_key < 0 || sps_ord_key == undefined) {
      res.result = false;
      res.err_code = 12009;

      return res;
    }

    if (sps_id == "" || sps_id == undefined) {
      res.result = false;
      res.err_code = 12010;

      return res;
    }

    if (sps_start_dttm == undefined) {
      res.result = false;
      res.err_code = 12011;

      return res;
    }

    if (sps_end_dttm == undefined) {
      res.result = false;
      res.err_code = 12012;

      return res;
    }

    let conn, rows, query;

    const spsStartDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_start_dttm);
    const spsEndDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_end_dttm);

    try {
      conn = await this.databasePool.getConnection();

      // query = `SELECT COUNT(*) as count FROM T_SPS`;
      // const count_res = await conn.query(query);

      // let old_sps_count = 0;
      // if (count_res.length > 0) {
      //   old_sps_count = count_res[0].count + 1;
      // }
      // const sps_id = "sps".concat(old_sps_count.toString());

      query = `INSERT INTO T_SPS(sps_ord_key, sps_id, sps_start_dttm, sps_end_dttm, sps_station_ae_title, sps_station_name, sps_modality, sps_bp_code_value, sps_bp_scm_design, sps_bp_meaning, sps_desc, sps_perform_phyc_name, sps_pre_med) VALUES
      ('${sps_ord_key}','${sps_id}','${spsStartDttm}', '${spsEndDttm}', '${sps_station_ae_title}','${sps_station_name}','${sps_modality}','${sps_bp_code_value}', '${sps_bp_scm_design}', '${sps_bp_meaning}','${sps_desc}','${sps_perform_phyc_name}','${sps_pre_med}')`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.sps_key = rows.insertId;
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addSps] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /add-sps-list
  async addSpsList(
    queryInfo: myTypes.IMwlAddSpsListRequest
  ): Promise<myTypes.IMwlAddSpsListResponse> {
    const { sps_list } = queryInfo;

    let res: myTypes.IMwlAddSpsListResponse = {
      result: false,
      err_code: 0,
      sps_key_list: [],
    };

    if (sps_list == undefined || sps_list.length <= 0) {
      res.result = false;
      res.err_code = 10003;

      return res;
    }

    let conn, rows, query, items;

    items = "VALUES ";

    let iterations = sps_list.length;

    for (const sps of sps_list) {
      const {
        sps_ord_key,

        sps_id,
        sps_start_dttm,
        sps_end_dttm,

        sps_station_ae_title,
        sps_station_name,
        sps_modality,
        sps_bp_code_value,
        sps_bp_scm_design,
        sps_bp_meaning,

        sps_desc,
        sps_perform_phyc_name,
        sps_contrast_agent,
        sps_pre_med,
      } = sps;

      if (sps_id == undefined || sps_id == "") {
        res.result = false;
        res.err_code = 12010;

        console.log(`Invalid sps id, res(${res.err_code}) `);
        continue;
      }

      if (sps_ord_key == undefined || sps_ord_key < 0) {
        res.result = false;
        res.err_code = 12009;

        console.log(`Invalid order key, res(${res.err_code}) `);
        continue;
      }

      if (sps_start_dttm == undefined) {
        res.result = false;
        res.err_code = 12011;

        console.log(`Invalid start dttm, res(${res.err_code}) `);
        continue;
      }

      if (sps_end_dttm == undefined) {
        res.result = false;
        res.err_code = 12012;

        console.log(`Invalid end dttm, res(${res.err_code}) `);
        continue;
      }

      const spsStartDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_start_dttm);
      const spsEndDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_end_dttm);

      iterations--;

      if (iterations == 0) {
        items += `('${sps_ord_key}', '${sps_id}', '${spsStartDttm}', '${spsEndDttm}', '${sps_station_ae_title}', '${sps_station_name}', '${sps_modality}', '${sps_bp_code_value}', '${sps_bp_scm_design}', '${sps_bp_meaning}', '${sps_desc}', '${sps_perform_phyc_name}', '${sps_contrast_agent}', '${sps_pre_med}');`;
      } else {
        items += `('${sps_ord_key}', '${sps_id}', '${spsStartDttm}', '${spsEndDttm}', '${sps_station_ae_title}', '${sps_station_name}', '${sps_modality}', '${sps_bp_code_value}', '${sps_bp_scm_design}', '${sps_bp_meaning}', '${sps_desc}', '${sps_perform_phyc_name}', '${sps_contrast_agent}', '${sps_pre_med}'),`;
      }
    }

    query = `INSERT INTO T_SPS(sps_ord_key, sps_id, sps_start_dttm, sps_end_dttm, sps_station_ae_title, sps_station_name, sps_modality, sps_bp_code_value, sps_bp_scm_design, sps_bp_meaning, sps_desc, sps_perform_phyc_name, sps_contrast_agent, sps_pre_med) ${items}`;

    try {
      conn = await this.databasePool.getConnection();

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.sps_key_list = rows.insertId;
      }

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addSps] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /add-rq-seq
  async addProcPlan(
    queryInfo: myTypes.IMwlAddProcPlanRequest
  ): Promise<myTypes.IMwlAddProcPlanResponse> {
    const {
      proc_plan_id,
      proc_plan_desc,

      prot_key_list,
    } = queryInfo;

    let res: myTypes.IMwlAddProcPlanResponse = {
      result: false,
      err_code: 0,
      proc_plan_key: -1,
    };

    if (proc_plan_id == undefined || proc_plan_id == "") {
      res.result = false;
      res.err_code = 12015;

      return res;
    }

    let proc_plan_desc_forDb = proc_plan_desc;

    if (proc_plan_desc_forDb == undefined) {
      proc_plan_desc_forDb = "";
    }

    let conn, rows, query, i_rows;

    try {
      conn = await this.databasePool.getConnection();

      query = `INSERT INTO T_PROC_PLAN(proc_plan_id, proc_plan_desc) VALUES
      ('${proc_plan_id}', '${proc_plan_desc_forDb}')`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.proc_plan_key = rows.insertId;

        if (prot_key_list != undefined) {
          for (const prot_key of prot_key_list) {
            query = `INSERT INTO I_PROCPLAN_PROT(pp_prot_proc_plan_key, pp_prot_prot_key) VALUES 
            ('${res.proc_plan_key}', '${prot_key}')`;
            i_rows = await conn.query(query);
          }
        }
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addProcPlan] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /add-protocol
  async addProtocol(
    queryInfo: myTypes.IMwlAddProtocolRequest
  ): Promise<myTypes.IMwlAddProtocolResponse> {
    const {
      prot_id,
      prot_station_ae_title,
      prot_station_name,
      prot_modality,

      prot_desc,
      prot_perform_phyc_name,
      prot_bp_key,
      prot_duration,
    } = queryInfo;

    let res: myTypes.IMwlAddProtocolResponse = {
      result: false,
      err_code: 0,
      prot_key: -1,
    };

    if (prot_id == undefined || prot_id == "") {
      res.result = false;
      res.err_code = 12015;

      return res;
    }

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `INSERT INTO T_PROTOCOL(prot_id, prot_station_ae_title, prot_station_name, prot_modality, prot_desc, prot_perform_phyc_name, prot_bp_key, prot_duration) VALUES
      ('${prot_id}', '${prot_station_ae_title}', '${prot_station_name}', '${prot_modality}', '${prot_desc}', '${prot_perform_phyc_name}', ${prot_bp_key}, '${prot_duration}')`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.prot_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addProtocol] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /add-bodypart
  async addBodypart(
    queryInfo: myTypes.IMwlAddBodypartRequest
  ): Promise<myTypes.IMwlAddBodypartResponse> {
    let {
      //bp_key,
      bp_type,
      //bp_code_value, // FIXED
      //bp_scm_design, // FIXED
      bp_code_meaning,
      bp_snm_rt_id,
      bp_sub_name,
      bp_sub_type, // myTypes.eBodypartSubType, Get From License
    } = queryInfo;

    bp_snm_rt_id = undefined;
    bp_sub_name = undefined;

    if (
      bp_sub_type <= myTypes.eBodypartSubType.NONE ||
      bp_sub_type >= myTypes.eBodypartSubType.END
    ) {
      bp_sub_type = myTypes.eBodypartSubType.NONE;
    }

    let res: myTypes.IMwlAddBodypartResponse = {
      result: false,
      err_code: 0,
      bp_key: -1,
    };

    const scmDesign = global.gAppName;
    const subType = undefined;

    if (
      bp_type < myTypes.eBodypartType.NONE ||
      bp_type > myTypes.eBodypartType.END
    ) {
      res.result = false;
      res.err_code = 12028;

      return res;
    }

    //
    const seqNo = await this.mwlUtils.getBodypartBodypartSeq();

    if (seqNo <= 0) {
      res.err_code = 12030;
      res.result = false;

      return res;
    }

    const bpCodeValue = myUtils.generateBodyPartCodeValue(seqNo);

    if (bpCodeValue == undefined || bpCodeValue == "") {
      res.err_code = 12031;
      res.result = false;

      return res;
    }

    const isExistCode = await this.mwlUtils.isExistBodypart(
      scmDesign,
      bp_code_meaning
    );

    if (isExistCode) {
      res.err_code = 12032;
      res.result = false;

      return res;
    }

    let insertQueryColumn = `INSERT INTO T_BODYPART(bp_type, bp_code_value, bp_scm_design, bp_code_meaning`;
    //let insertValues = `VALUES ('${bp_type}', '${bp_code_value}', '${bp_scm_design}', '${bp_code_meaning}'`;
    let insertValues = `VALUES ('${bp_type}', '${bpCodeValue}', '${scmDesign}', '${bp_code_meaning}'`;

    if (bp_snm_rt_id != undefined && bp_snm_rt_id != "null") {
      insertQueryColumn += ", bp_snm_rt_id";
      insertValues += `, '${bp_snm_rt_id}'`;
    }

    if (bp_sub_name != undefined) {
      insertQueryColumn += ", bp_sub_name";
      insertValues += `, '${bp_sub_name}'`;
    }

    if (subType != undefined) {
      insertQueryColumn += ", bp_sub_type";
      insertValues += `, '${subType}'`;
    }

    insertQueryColumn += ")";
    insertValues += ")";

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `${insertQueryColumn} ${insertValues}`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.bp_key = rows.insertId;
      }

      res.bp_scm_design = scmDesign;
      res.bp_code_value = bpCodeValue;

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addBodypart] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /add-station
  async addStation(
    queryInfo: myTypes.IMwlAddStationRequest
  ): Promise<myTypes.IMwlAddStationResponse> {
    const { station_ae_title, station_name } = queryInfo;

    let res: myTypes.IMwlAddStationResponse = {
      result: false,
      err_code: 0,
      station_key: -1,
    };

    if (station_ae_title == undefined || station_ae_title == "") {
      res.result = false;
      res.err_code = 12013;

      return res;
    }

    if (station_name == undefined || station_name == "") {
      res.result = false;
      res.err_code = 12014;

      return res;
    }

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `INSERT INTO T_STATION(station_ae_title, station_name) VALUES
      ('${station_ae_title}', '${station_name}')`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.station_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addStation] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /add-ord-reason
  async addOrdReason(
    queryInfo: myTypes.IMwlAddOrdReasonRequest
  ): Promise<myTypes.IMwlAddOrdReasonResponse> {
    const { ord_reason_type, ord_reason_desc } = queryInfo;

    let res: myTypes.IMwlAddOrdReasonResponse = {
      result: false,
      err_code: 0,
      ord_reason_key: -1,
    };

    if (
      ord_reason_type == undefined ||
      ord_reason_type <= myTypes.eOrdReasonType.NONE
    ) {
      res.result = false;
      res.err_code = 12024;

      return res;
    }

    if (ord_reason_desc == undefined || ord_reason_desc == "") {
      res.result = false;
      res.err_code = 12025;

      return res;
    }

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `INSERT INTO T_ORD_REASON(ord_reason_type, ord_reason_desc) VALUES
      ('${ord_reason_type}', '${ord_reason_desc}')`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.ord_reason_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::addOrdReason] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }
  //#endregion

  //#region DELETE
  // url: /delete-order
  async deleteOrder(
    queryInfo: myTypes.IMwlDeleteOrderRequest
  ): Promise<myTypes.IMwlDeleteOrderResponse> {
    const { ord_key_list, ord_acc_no_list } = queryInfo;

    let res: myTypes.IMwlDeleteProcPlanResponse = {
      result: false,
      err_code: 0,
    };

    if (ord_key_list == undefined && ord_acc_no_list == undefined) {
      res.result = false;
      res.err_code = 10003;

      return res;
    }

    let queryWhere = "WHERE ";
    let isFirst = true;

    if (ord_key_list != undefined) {
      queryWhere += "T_ORDER.ord_key IN ('";
      const ordKeyCount = ord_key_list.length;

      for (let i = 0; i < ordKeyCount; i++) {
        queryWhere += ord_key_list[i];

        if (i < ordKeyCount - 1) {
          queryWhere += "', '";
        }
      }

      queryWhere += "')";
      isFirst = false;
    }

    if (ord_acc_no_list != undefined) {
      if (isFirst == false) {
        queryWhere += " OR ";
      }

      queryWhere += "T_ORDER.ord_acc_num IN ('";
      const accNoCount = ord_acc_no_list.length;

      for (let i = 0; i < accNoCount; i++) {
        queryWhere += ord_acc_no_list[i];

        if (i < accNoCount - 1) {
          queryWhere += "', '";
        }
      }

      queryWhere += "')";
      isFirst = false;
    }

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `DELETE T_ORDER FROM T_ORDER ${queryWhere}`;

      rows = await conn.query(query);

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::deleteOrder] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /delete-proc-plan
  async deleteProcPlan(
    queryInfo: myTypes.IMwlDeleteProcPlanRequest
  ): Promise<myTypes.IMwlDeleteProcPlanResponse> {
    const { proc_plan_id_list } = queryInfo;

    let res: myTypes.IMwlDeleteProcPlanResponse = {
      result: false,
      err_code: 0,
    };

    if (proc_plan_id_list == undefined || proc_plan_id_list.length == 0) {
      res.result = false;
      res.err_code = 12018;

      return res;
    }

    let queryWhere = "WHERE proc_plan_id IN ('";
    let rpseqCount = proc_plan_id_list.length;

    for (let i = 0; i < rpseqCount; i++) {
      queryWhere += proc_plan_id_list[i];

      if (i < rpseqCount - 1) {
        queryWhere += "', '";
      }
    }

    queryWhere += "')";

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `DELETE FROM T_PROC_PLAN ${queryWhere}`;

      rows = await conn.query(query);

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::deleteProcPlan] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /delete-protocol
  async deleteProtocol(
    queryInfo: myTypes.IMwlDeleteProtocolRequest
  ): Promise<myTypes.IMwlDeleteProtocolResponse> {
    const { protocol_id_list } = queryInfo;

    let res: myTypes.IMwlDeleteProtocolResponse = {
      result: false,
      err_code: 0,
    };

    if (protocol_id_list == undefined || protocol_id_list.length == 0) {
      res.result = false;
      res.err_code = 12017;

      return res;
    }

    let queryWhere = "WHERE prot_id IN ('";
    let protocolCount = protocol_id_list.length;

    for (let i = 0; i < protocolCount; i++) {
      queryWhere += protocol_id_list[i];

      if (i < protocolCount - 1) {
        queryWhere += "', '";
      }
    }

    queryWhere += "')";

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `DELETE FROM T_PROTOCOL ${queryWhere}`;

      rows = await conn.query(query);

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::deleteProtocol] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /delete-bodypart
  async deleteBodypart(
    queryInfo: myTypes.IMwlDeleteBodypartRequest
  ): Promise<myTypes.IMwlDeleteBodypartResponse> {
    const { bp_key_list } = queryInfo;

    let res: myTypes.IMwlDeleteProtocolResponse = {
      result: false,
      err_code: 0,
    };

    if (bp_key_list == undefined || bp_key_list.length == 0) {
      res.result = false;
      res.err_code = 12017;

      return res;
    }

    let queryWhere = "WHERE bp_key IN ('";
    let protocolCount = bp_key_list.length;

    for (let i = 0; i < protocolCount; i++) {
      queryWhere += bp_key_list[i];

      if (i < protocolCount - 1) {
        queryWhere += "', '";
      }
    }

    queryWhere += "')";

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `DELETE FROM T_BODYPART ${queryWhere}`;

      rows = await conn.query(query);

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::deleteBodypart] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /delete-station
  async deleteStation(
    queryInfo: myTypes.IMwlDeleteStationRequest
  ): Promise<myTypes.IMwlDeleteStationResponse> {
    const { station_ae_title_list } = queryInfo;

    let res: myTypes.IMwlDeleteStationResponse = {
      result: false,
      err_code: 0,
    };

    if (
      station_ae_title_list == undefined ||
      station_ae_title_list.length == 0
    ) {
      res.result = false;
      res.err_code = 12016;

      return res;
    }

    let queryWhere = "WHERE station_ae_title IN ('";
    let stationCount = station_ae_title_list.length;

    for (let i = 0; i < stationCount; i++) {
      queryWhere += station_ae_title_list[i];

      if (i < stationCount - 1) {
        queryWhere += "', '";
      }
    }

    queryWhere += "')";

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `DELETE FROM T_STATION ${queryWhere}`;

      rows = await conn.query(query);

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::deleteStation] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }
  //#endregion

  //#region UPDATE
  // url: /update-patient
  async updatePatient(
    queryInfo: myTypes.IMwlUpdatePatientRequest
  ): Promise<myTypes.IMwlUpdatePatientResponse> {
    let {
      pt_key,
      pt_id,
      pt_name,
      pt_sex,

      pt_age,
      pt_birth_dttm,

      pt_weight,
      pt_size,

      pt_address,
      pt_tel,

      pt_state,
      pt_med_alert,
      pt_allergies,

      pt_comment,
      pt_responsible_person,

      pt_species_key,
      pt_breed_key,
    } = queryInfo;

    let initDate = new Date("1900-01-01T00:00:00");

    let res: myTypes.IMwlAddPatientResponse = {
      result: false,
      err_code: 0,
      pt_key: -1,
    };

    if (pt_key == undefined || pt_key < 1) {
      res.result = false;
      res.err_code = 12005;

      return res;
    }

    if (pt_id == undefined || pt_id == "") {
      res.result = false;
      res.err_code = 12002;

      return res;
    }

    if (pt_name == undefined || pt_name == "") {
      res.result = false;
      res.err_code = 12003;

      return res;
    }

    if (pt_birth_dttm == undefined || pt_birth_dttm == null) {
      res.result = false;
      res.err_code = 12004;

      return res;
    } else if (pt_birth_dttm < initDate) {
      res.result = false;
      res.err_code = 12004;

      return res;
    }

    const ptBirthDttmIso = myUtils.ConvertDateForDbFromUtc(pt_birth_dttm);

    let conn, rows, query;

    query = "UPDATE T_PATIENT SET";

    query += ` pt_id = '${pt_id}'`;

    if (pt_name != undefined) {
      query += `, pt_name = '${pt_name}'`;
    }

    if (pt_sex != undefined) {
      query += `, pt_sex = '${pt_sex}'`;
    }

    if (pt_age != undefined) {
      query += `, pt_age = '${pt_age}'`;
    }

    if (pt_birth_dttm != undefined) {
      query += `, pt_birth_dttm = '${ptBirthDttmIso}'`;
    }

    if (pt_weight != undefined) {
      query += `, pt_weight = '${pt_weight}'`;
    }

    if (pt_size != undefined) {
      query += `, pt_size = '${pt_size}'`;
    }

    if (pt_address != undefined) {
      query += `, pt_address = '${pt_address}'`;
    }

    if (pt_tel != undefined) {
      query += `, pt_tel = '${pt_tel}'`;
    }

    if (pt_state != undefined) {
      query += `, pt_state = '${pt_state}'`;
    }

    if (pt_med_alert != undefined) {
      query += `, pt_med_alert = '${pt_med_alert}'`;
    }

    if (pt_allergies != undefined) {
      query += `, pt_allergies = '${pt_allergies}'`;
    }

    if (pt_comment != undefined) {
      query += `, pt_comment = '${pt_comment}'`;
    }

    if (pt_responsible_person != undefined) {
      query += `, pt_responsible_person = '${pt_responsible_person}'`;
    }

    if (pt_species_key != undefined && pt_species_key > 0) {
      query += `, pt_species_key = '${pt_species_key}'`;
    }

    if (pt_breed_key != undefined && pt_breed_key > 0) {
      query += `, pt_breed_key = '${pt_breed_key}'`;
    }

    let queryWhere = `WHERE pt_key = '${pt_key}'`;

    query = `${query} ${queryWhere}`;

    try {
      conn = await this.databasePool.getConnection();

      rows = await conn.query(query);

      res.pt_key = pt_key;
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updatePatient] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /update-order
  async updateOrder(
    queryInfo: myTypes.IMwlUpdateOrderRequest
  ): Promise<myTypes.IMwlUpdateOrderResponse> {
    let {
      ord_key,
      ord_pt_key,

      ord_acc_num,
      ord_issuer,
      ord_create_dttm,

      ord_status_flag,
      ord_requesting_phyc,
      ord_referring_phyc,

      ord_study_dttm,

      ord_reason,
      ord_priority,

      ord_rp_id,
      ord_rp_desc,

      ord_pt_age,
      ord_pt_weight,
      ord_pt_size,
    } = queryInfo;

    let res: myTypes.IMwlUpdateOrderResponse = {
      result: false,
      err_code: 0,
      ord_key: -1,
    };

    if (ord_key == undefined || ord_key < 0) {
      res.result = false;
      res.err_code = 12009;

      return res;
    }

    if (ord_pt_key == undefined || ord_pt_key < 0) {
      res.result = false;
      res.err_code = 12005;

      return res;
    }

    if (ord_acc_num == undefined || ord_acc_num == "") {
      res.result = false;
      res.err_code = 12022;

      return res;
    }

    if (ord_create_dttm == undefined) {
      res.result = false;
      res.err_code = 12022;

      return res;
    }

    if (ord_status_flag > myTypes.eOrderStatus.CANCELED) {
      res.result = false;
      res.err_code = 12023;

      return res;
    }

    const createDttm = myUtils.ConvertDateTimeForDbFromUtc(ord_create_dttm);
    const studyDttm = myUtils.ConvertDateTimeForDbFromUtc(ord_study_dttm);

    let queryWhere = `WHERE ord_key = '${ord_key}'`;

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `UPDATE T_ORDER SET ord_pt_key = '${ord_pt_key}', ord_acc_num = '${ord_acc_num}', ord_issuer = '${ord_issuer}', ord_issuer = '${ord_issuer}', ord_create_dttm = '${createDttm}',  ord_status_flag = '${ord_status_flag}', 
      ord_requesting_phyc = '${ord_requesting_phyc}', ord_referring_phyc = '${ord_referring_phyc}', 
      ord_study_dttm = '${studyDttm}', ord_reason = '${ord_reason}', 
      ord_priority = '${ord_priority}', ord_rp_id = '${ord_rp_id}', ord_rp_desc = '${ord_rp_desc}',
      ord_pt_age = '${ord_pt_age}', ord_pt_weight = '${ord_pt_weight}', ord_pt_size = '${ord_pt_size}' 
      ${queryWhere}`;

      rows = await conn.query(query);

      res.ord_key = ord_key;
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateOrder] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /update-order-status
  async updateOrderStatus(
    queryInfo: myTypes.IMwlUpdateOrderStatusRequest
  ): Promise<myTypes.IMwlUpdateOrderStatusResponse> {
    let {
      ord_acc_no_list,
      ord_key_list,

      ord_status,
    } = queryInfo;

    let res: myTypes.IMwlUpdateOrderStatusResponse = {
      result: false,
      err_code: 0,
    };

    if (
      (ord_key_list == undefined || ord_key_list.length < 0) &&
      (ord_acc_no_list == undefined || ord_acc_no_list.length < 0)
    ) {
      res.result = false;
      res.err_code = 12009;

      return res;
    }

    if (
      ord_status > myTypes.eOrderStatus.CANCELED ||
      ord_status <= myTypes.eOrderStatus.NONE
    ) {
      res.result = false;
      res.err_code = 12023;

      return res;
    }

    let queryWhere = "WHERE ";

    if (ord_key_list != undefined && ord_key_list.length > 0) {
      queryWhere += "ord_key IN ('";

      const ordKeyCount = ord_key_list.length;

      for (let i = 0; i < ordKeyCount; i++) {
        queryWhere += ord_key_list[i];

        if (i < ordKeyCount - 1) {
          queryWhere += "', '";
        }
      }

      queryWhere += "')";
    } else if (ord_acc_no_list != undefined && ord_acc_no_list.length > 0) {
      queryWhere += "ord_acc_no IN ('";

      const ordAccNoCount = ord_acc_no_list.length;

      for (let i = 0; i < ordAccNoCount; i++) {
        queryWhere += ord_acc_no_list[i];

        if (i < ordAccNoCount - 1) {
          queryWhere += "', '";
        }
      }

      queryWhere += "')";
    }

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `UPDATE T_ORDER SET ord_status_flag = ${ord_status} ${queryWhere}`;

      rows = await conn.query(query);

      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateOrderStatus] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /update-sps
  async updateSps(
    queryInfo: myTypes.IMwlUpdateSpsRequest
  ): Promise<myTypes.IMwlUpdateSpsResponse> {
    const {
      sps_key,
      sps_ord_key,

      sps_id,
      sps_start_dttm,
      sps_end_dttm,

      sps_station_ae_title,
      sps_station_name,
      sps_modality,
      sps_bp_code_value,
      sps_bp_scm_design,
      sps_bp_meaning,

      sps_desc,
      sps_perform_phyc_name,
      sps_contrast_agent,
      sps_pre_med,
    } = queryInfo;

    let res: myTypes.IMwlUpdateSpsResponse = {
      result: false,
      err_code: 0,
      sps_key: -1,
    };

    if (sps_key < 0 || sps_key == undefined) {
      res.result = false;
      res.err_code = 12019;

      return res;
    }

    if (sps_ord_key < 0 || sps_ord_key == undefined) {
      res.result = false;
      res.err_code = 12009;

      return res;
    }

    if (sps_id == undefined || sps_id == "") {
      res.result = false;
      res.err_code = 12010;

      return res;
    }

    const startDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_start_dttm);
    const endDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_end_dttm);

    let queryWhere = `WHERE sps_key = '${sps_key}'`;

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `UPDATE T_SPS SET sps_id = '${sps_id}', sps_start_dttm = '${startDttm}', sps_end_dttm = '${endDttm}',
      sps_station_ae_title = '${sps_station_ae_title}', sps_station_name = '${sps_station_name}', sps_modality = '${sps_modality}', 
      sps_bp_code_value = '${sps_bp_code_value}, sps_bp_scm_design, = '${sps_bp_scm_design}, sps_bp_meaning = '${sps_bp_meaning}',
      sps_desc = '${sps_desc}', sps_perform_phyc_name = '${sps_perform_phyc_name}', sps_contrast_agent = '${sps_contrast_agent}', sps_pre_med = '${sps_pre_med}'
      ${queryWhere}`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.sps_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateSps] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /update-sps
  async updateSpsList(
    queryInfo: myTypes.IMwlUpdateSpsListRequest
  ): Promise<myTypes.IMwlUpdateSpsListResponse> {
    const { sps_list } = queryInfo;

    let res: myTypes.IMwlUpdateSpsListResponse = {
      result: false,
      err_code: 0,
      sps_key: [],
    };

    const conn = await this.databasePool.getConnection();

    try {
      for (const sps of sps_list) {
        const {
          sps_key,
          sps_ord_key,

          sps_id,
          sps_start_dttm,
          sps_end_dttm,

          sps_station_ae_title,
          sps_station_name,
          sps_modality,
          sps_bp_meaning,

          sps_desc,
          sps_perform_phyc_name,
          sps_contrast_agent,
          sps_pre_med,
        } = sps;

        if (sps_key < 0 || sps_key == undefined) {
          res.result = false;
          res.err_code = 12019;

          return res;
        }

        if (sps_ord_key < 0 || sps_ord_key == undefined) {
          res.result = false;
          res.err_code = 12009;

          return res;
        }

        if (sps_id == undefined || sps_id == "") {
          res.result = false;
          res.err_code = 12010;

          return res;
        }

        const startDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_start_dttm);
        const endDttm = myUtils.ConvertDateTimeForDbFromUtc(sps_end_dttm);

        const queryWhere = `WHERE sps_key = '${sps_key}'`;

        const query = `UPDATE T_SPS SET sps_id = '${sps_id}', sps_start_dttm = '${startDttm}', sps_end_dttm = '${endDttm}',
        sps_station_ae_title = '${sps_station_ae_title}', sps_station_name = '${sps_station_name}', sps_modality = '${sps_modality}', sps_bp_meaning = '${sps_bp_meaning}',
        sps_desc = '${sps_desc}', sps_perform_phyc_name = '${sps_perform_phyc_name}', sps_contrast_agent = '${sps_contrast_agent}', sps_pre_med = '${sps_pre_med}'
        ${queryWhere}`;

        const rows = await conn.query(query);

        res.sps_key.push(sps_key);
        res.result = true;
      }
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateSpsList] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();
      return res;
    }
  }

  // url: /update-proc-plan
  async updateProcPlan(
    queryInfo: myTypes.IMwlUpdateProcPlanRequest
  ): Promise<myTypes.IMwlUpdateProcPlanResponse> {
    const {
      proc_plan_key,
      proc_plan_id,
      proc_plan_desc,

      prot_key_list,
    } = queryInfo;

    let res: myTypes.IMwlUpdateProcPlanResponse = {
      result: false,
      err_code: 0,
      proc_plan_key: -1,
    };

    if (proc_plan_key == undefined || proc_plan_key < 0) {
      res.result = false;
      res.err_code = 12033;

      return res;
    }

    if (proc_plan_id == undefined || proc_plan_id == "") {
      res.result = false;
      res.err_code = 12015;

      return res;
    }

    let proc_plan_desc_forDb = proc_plan_desc;

    if (proc_plan_desc_forDb == undefined) {
      proc_plan_desc_forDb = "";
    }

    let queryWhere = `WHERE proc_plan_key = '${proc_plan_key}'`;

    let conn, rows, query, i_rows, d_row;

    try {
      conn = await this.databasePool.getConnection();

      query = `UPDATE T_PROC_PLAN SET proc_plan_id = '${proc_plan_id}', proc_plan_desc = '${proc_plan_desc_forDb}' ${queryWhere}`;

      rows = await conn.query(query);

      if (rows.affectedRows > 0) {
        res.proc_plan_key = proc_plan_key;

        query = `DELETE FROM I_PROCPLAN_PROT WHERE pp_prot_proc_plan_key=${res.proc_plan_key}`;
        d_row = await conn.query(query);

        if (prot_key_list != undefined) {
          for (const prot_key of prot_key_list) {
            query = `INSERT INTO I_PROCPLAN_PROT(pp_prot_proc_plan_key, pp_prot_prot_key) VALUES 
            ('${res.proc_plan_key}', '${prot_key}')`;
            i_rows = await conn.query(query);
          }
        }
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateProcPlan] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /update-protocol
  async updateProtocol(
    queryInfo: myTypes.IMwlUpdateProtocolRequest
  ): Promise<myTypes.IMwlUpdateProtocolResponse> {
    const {
      org_protocol_id,

      prot_id,
      prot_station_ae_title,
      prot_station_name,
      prot_modality,

      prot_desc,
      prot_perform_phyc_name,
      prot_bp_key,
      prot_duration,
    } = queryInfo;

    let res: myTypes.IMwlUpdateProtocolResponse = {
      result: false,
      err_code: 0,
      prot_key: -1,
    };

    if (org_protocol_id == undefined || org_protocol_id == "") {
      res.result = false;
      res.err_code = 12019;

      return res;
    }

    if (prot_id == undefined || prot_id == "") {
      res.result = false;
      res.err_code = 12010;

      return res;
    }

    let queryWhere = `WHERE prot_id = '${org_protocol_id}'`;

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `UPDATE T_PROTOCOL SET prot_id = '${prot_id}', prot_station_ae_title = '${prot_station_ae_title}',
        prot_station_name = '${prot_station_name}', prot_modality = '${prot_modality}', prot_desc = '${prot_desc}', prot_perform_phyc_name = '${prot_perform_phyc_name}',
        prot_bp_key = ${prot_bp_key}, prot_duration = '${prot_duration}' ${queryWhere}`;

      console.log("UpdateProtocol: ", query);

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.prot_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateProtocol] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /update-bodypart
  async updateBodypart(
    queryInfo: myTypes.IMwlUpdateBodypartRequest
  ): Promise<myTypes.IMwlUpdateBodypartResponse> {
    let {
      org_bp_key,

      bp_key,
      bp_type,
      bp_code_value,
      bp_scm_design,
      bp_code_meaning,
      bp_snm_rt_id,
      bp_sub_name,
      bp_sub_type,
    } = queryInfo;

    let res: myTypes.IMwlUpdateBodypartResponse = {
      result: false,
      err_code: 0,
      bp_key: -1,
    };

    if (org_bp_key == undefined || org_bp_key < 0) {
      res.result = false;
      res.err_code = 12026;

      return res;
    }

    let queryWhere = `WHERE bp_key = '${org_bp_key}'`;
    let queryUpdate = `UPDATE T_BODYPART SET bp_key = '${bp_key}', bp_type = '${bp_type}',
    bp_code_value = '${bp_code_value}', bp_scm_design = '${bp_scm_design}', bp_code_meaning = '${bp_code_meaning}'`;

    let conn, rows, query;

    if (bp_snm_rt_id != undefined) {
      queryUpdate += `, bp_snm_rt_id = '${bp_snm_rt_id}'`;
    }

    if (bp_sub_name != undefined) {
      queryUpdate += `, bp_sub_name = '${bp_sub_name}'`;
    }

    if (bp_sub_type != undefined) {
      queryUpdate += `, bp_sub_type = ${bp_sub_type}`;
    }

    try {
      conn = await this.databasePool.getConnection();

      query = `${queryUpdate} ${queryWhere}`;

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.bp_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateBodypart] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /update-station
  async updateStation(
    queryInfo: myTypes.IMwlUpdateStationRequest
  ): Promise<myTypes.IMwlUpdateStationResponse> {
    const { org_station_ae_title, station_ae_title, station_name } = queryInfo;

    let res: myTypes.IMwlUpdateStationResponse = {
      result: false,
      err_code: 0,
      station_key: -1,
    };

    if (org_station_ae_title == undefined || org_station_ae_title == "") {
      res.result = false;
      res.err_code = 12019;

      return res;
    }

    if (station_ae_title == undefined || station_ae_title == "") {
      res.result = false;
      res.err_code = 12013;

      return res;
    }

    if (station_name == undefined || station_name == "") {
      res.result = false;
      res.err_code = 12014;

      return res;
    }

    let queryWhere = `WHERE station_ae_title = '${org_station_ae_title}'`;

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `UPDATE T_STATION SET station_ae_title = '${station_ae_title}', station_name = '${station_name}' ${queryWhere}`;

      console.log("UpdateStation: ", query);

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.station_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateStation] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }

  // url: /update-ord-reason
  async updateOrdReason(
    queryInfo: myTypes.IMwlUpdateOrdReasonRequest
  ): Promise<myTypes.IMwlUpdateOrdReasonResponse> {
    const { ord_reason_key, ord_reason_type, ord_reason_desc } = queryInfo;

    let res: myTypes.IMwlUpdateOrdReasonResponse = {
      result: false,
      err_code: 0,
      ord_reason_key: -1,
    };

    if (ord_reason_key == undefined || ord_reason_key < 0) {
      res.result = false;
      res.err_code = 12026;

      return res;
    }

    if (
      ord_reason_type == undefined ||
      ord_reason_type == myTypes.eOrdReasonType.NONE
    ) {
      res.result = false;
      res.err_code = 12024;

      return res;
    }

    if (ord_reason_desc == undefined || ord_reason_desc == "") {
      res.result = false;
      res.err_code = 12025;

      return res;
    }

    let queryWhere = `WHERE ord_reason_key = ${ord_reason_key}`;

    let conn, rows, query;

    try {
      conn = await this.databasePool.getConnection();

      query = `UPDATE T_ORD_REASON SET ord_reason_type = ${ord_reason_type}, ord_reason_desc = '${ord_reason_desc}' ${queryWhere}`;

      console.log("UpdateOrdReason: ", query);

      rows = await conn.query(query);

      if (rows.insertId > 0) {
        res.ord_reason_key = rows.insertId;
      }
      res.result = true;
    } catch (err: any) {
      console.log("err: ", err);
      __logger.error(
        `[mwl.model::updateOrderReason] ${err.errno} ${err.code} ${err.text} `
      );
      res.result = false;

      switch (err.errno) {
        default:
          res.err_code = err.code;
          break;
      }
      throw err;
    } finally {
      if (conn) conn.end();

      return res;
    }
  }
  //#endregion
}
