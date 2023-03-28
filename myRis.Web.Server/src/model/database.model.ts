//const databasePool = require("config/db.config");

import * as myTypes from "../../../myRis.Web.Common";
//TSC <--> WEBPACK
import { DBConnectionPool } from "../config/db.config";

export class DatabaseModel {
  private databasePool: DBConnectionPool;

  constructor() {
    this.databasePool = new DBConnectionPool();
  }

  // CREATE DATABASE
  async createDatabase() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getInitialConnection();
      rows = await conn.query(
        `CREATE DATABASE IF NOT EXISTS MWLDB CHARACTER SET utf8 COLLATE utf8_general_ci`
      );
    } catch (err: any) {
      result = 0;

      __logger.error(
        `[DatabaseModel::createDatabase] createDB : Failed to create database! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  // CREATE USER TABLE
  async createUserTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_USER(
          user_key           INT(11) NOT NULL AUTO_INCREMENT ,
          user_id            NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          user_level         TINYINT(3) NOT NULL DEFAULT 0x10,
          user_name          NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          user_pwd           NVARCHAR(32) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          user_desc          NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
          user_create_dttm   DATETIME NOT NULL DEFAULT current_timestamp(),
          user_signin_dttm   DATETIME DEFAULT NULL,
          CONSTRAINT PRIMARY KEY (user_key) USING BTREE,
          CONSTRAINT uk_user_id UNIQUE KEY (user_id)
      )
      CHARSET='utf8',
      COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createUserTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
      //return result;
    }
  }

  // CREATE PATIENT TABLE
  async createPatientTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_PATIENT(
          pt_key         INT(11) NOT NULL AUTO_INCREMENT ,
          pt_id          NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          pt_name        NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          pt_sex         NVARCHAR(16) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          pt_age         NVARCHAR(4) DEFAULT NULL, 
          pt_birth_dttm  DATE DEFAULT NULL,
          pt_weight      NVARCHAR(16) DEFAULT NULL,
          pt_size        NVARCHAR(16) DEFAULT NULL,
          pt_address     NVARCHAR(1024) DEFAULT NULL,
          pt_tel         NVARCHAR(16) DEFAULT NULL,
          pt_state       NVARCHAR(32) DEFAULT NULL,
          pt_med_alert   NVARCHAR(32) DEFAULT NULL,
          pt_allergies   NVARCHAR(64) DEFAULT NULL,
          pt_comment     NVARCHAR(512) DEFAULT NULL,
          pt_responsible_person NVARCHAR(64) DEFAULT NULL,
          pt_species_key INT(11) DEFAULT NULL,
          pt_breed_key INT(11) DEFAULT NULL,
          CONSTRAINT PRIMARY KEY (pt_key) USING BTREE,
          CONSTRAINT fk_pt_species_key FOREIGN KEY (pt_species_key) REFERENCES T_SPECIES (species_key),
          CONSTRAINT fk_pt_breed_key FOREIGN KEY (pt_breed_key) REFERENCES T_BREED (breed_key),
          CONSTRAINT uk_pt_id UNIQUE KEY (pt_id)
      )
      CHARSET='utf8',
      COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createPatientTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
      //return result;
    }
  }

  // CREATE ORDER TABLE
  async createOrderTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_ORDER(
        ord_key               INT(11) NOT NULL AUTO_INCREMENT ,
        ord_pt_key            INT(11) NOT NULL DEFAULT -1,
        ord_acc_num           NVARCHAR(32) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        ord_issuer            NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        ord_create_dttm       DATETIME NOT NULL DEFAULT current_timestamp(),
        ord_status_flag       TINYINT(4) NOT NULL DEFAULT 0,
        ord_requesting_phyc   NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        ord_referring_phyc    NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        ord_study_uid         NVARCHAR(128) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        ord_study_dttm        DATETIME NOT NULL DEFAULT current_timestamp(),
        ord_reason            NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        ord_priority          TINYINT(3) DEFAULT 0,
        ord_rp_id             NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        ord_rp_desc           NVARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
        ord_pt_age            NVARCHAR(4) DEFAULT NULL, 
        ord_pt_weight         NVARCHAR(16) DEFAULT NULL,
        ord_pt_size           NVARCHAR(16) DEFAULT NULL,
        CONSTRAINT PRIMARY KEY (ord_key) USING BTREE,
        CONSTRAINT fk_ord_pt_key FOREIGN KEY (ord_pt_key) REFERENCES T_PATIENT (pt_key),
        CONSTRAINT uk_ord_acc_num UNIQUE KEY (ord_acc_num)
    )
    CHARSET='utf8',
    COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createOrderTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
      //return result;
    }
  }

  //CREATE SPS TABLE
  async createSpsTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_SPS(
          sps_key                INT(11) NOT NULL AUTO_INCREMENT ,
          sps_ord_key                INT(11) NOT NULL DEFAULT -1,
          sps_id                 NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          sps_start_dttm         DATETIME NOT NULL DEFAULT '1900-01-01 00:00:00',
          sps_end_dttm           DATETIME NOT NULL DEFAULT '1900-01-01 00:00:00',
          sps_station_ae_title   NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          sps_station_name       NVARCHAR(16) DEFAULT NULL COLLATE 'utf8_general_ci',
          sps_modality           NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          sps_bp_code_value      NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          sps_bp_scm_design      NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          sps_bp_meaning         NVARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          sps_desc               NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
          sps_perform_phyc_name  NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
          sps_contrast_agent     NVARCHAR(32) DEFAULT NULL COLLATE 'utf8_general_ci',
          sps_pre_med            NVARCHAR(32) DEFAULT NULL COLLATE 'utf8_general_ci',
          CONSTRAINT PRIMARY KEY (sps_key) USING BTREE,
          CONSTRAINT fk_sps_ord_key FOREIGN KEY (sps_ord_key) REFERENCES T_ORDER (ord_key) ON DELETE CASCADE
          )
          CHARSET='utf8',
          COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createSpsTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
      //return result;
    }
  }

  //CREATE PROTOCOl PLAN TABLE
  async createProcPlanTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_PROC_PLAN(
        proc_plan_key         INT(11) NOT NULL AUTO_INCREMENT ,
        proc_plan_id          NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        proc_plan_desc        NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
        CONSTRAINT PRIMARY KEY (proc_plan_key) USING BTREE,
        CONSTRAINT uk_proc_plan_id UNIQUE KEY (proc_plan_id)
    )
    CHARSET='utf8',
    COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;

      __logger.error(
        `[DatabaseModel::createProcPlanTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE SPS SEQUENCE TABLE
  async createProtocolTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_PROTOCOL(
          prot_key                INT(11) NOT NULL AUTO_INCREMENT ,
          prot_id                 NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          prot_station_ae_title   NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          prot_station_name       NVARCHAR(32) DEFAULT NULL COLLATE 'utf8_general_ci',
          prot_modality           NVARCHAR(32) NOT NULL DEFAULT 'DX' COLLATE 'utf8_general_ci',
          prot_desc               NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
          prot_perform_phyc_name  NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
          prot_duration           INT(10) NOT NULL DEFAULT 0 COLLATE 'utf8_general_ci',
          prot_bp_key             INT(11) NOT NULL DEFAULT 0,
          CONSTRAINT PRIMARY KEY (prot_key) USING BTREE,
          CONSTRAINT fk_prot_bp_key FOREIGN KEY (prot_bp_key) REFERENCES T_BODYPART (bp_key),
          CONSTRAINT uk_prot_id UNIQUE KEY (prot_id)
      )
      CHARSET='utf8',
      COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createProtocolTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE Intersection Table (T_PROC_PLAN & T_PROTOCOL)
  async createIProcPlanProtocolTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS I_PROCPLAN_PROT(
          pp_prot_proc_plan_key       INT(11) NOT NULL DEFAULT -1,
          pp_prot_prot_key            INT(11) NOT NULL DEFAULT -1,
          CONSTRAINT fk_pp_prot_proc_plan_key FOREIGN KEY (pp_prot_proc_plan_key) REFERENCES T_PROC_PLAN (proc_plan_key) ON DELETE CASCADE,
          CONSTRAINT fk_pp_prot_prot_key FOREIGN KEY (pp_prot_prot_key) REFERENCES T_PROTOCOL (prot_key) ON DELETE CASCADE
      )
      CHARSET='utf8',
      COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createIProcPlanProtocolTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE PROTOCOL CODE TABLE (ref: DICOM Part16)
  async createBodypartTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_BODYPART(
          bp_key            INT(11) NOT NULL AUTO_INCREMENT ,
          bp_type           TINYINT(4) NOT NULL DEFAULT 0,
          bp_code_value     NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          bp_scm_design     NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          bp_code_meaning   NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
          bp_snm_rt_id      NVARCHAR(16) DEFAULT NULL COLLATE 'utf8_general_ci',
          bp_sub_name       NVARCHAR(16) DEFAULT NULL COLLATE 'utf8_general_ci',
          bp_sub_type       TINYINT(4) NOT NULL DEFAULT 0,
          CONSTRAINT PRIMARY KEY (bp_key) USING BTREE
      )
      CHARSET='utf8',
      COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createBodypartTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE SPECIES TABLE (ref: DICOM Part16)
  async createSpeciesTable() {
    let conn, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      const rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_SPECIES(
          species_key            INT(11) NOT NULL AUTO_INCREMENT ,
          species_type           TINYINT(4) NOT NULL DEFAULT 0,
          species_code_value     NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          species_scm_design     NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          species_code_meaning   NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
          CONSTRAINT PRIMARY KEY (species_key) USING BTREE
      )
      CHARSET='utf8',
      COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createSpeciesTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE Breed TABLE (ref: DICOM Part16)
  async createBreedTable() {
    let conn, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      const rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_BREED(
            breed_key            INT(11) NOT NULL AUTO_INCREMENT ,
            breed_species_type   TINYINT(4) NOT NULL DEFAULT 0,
            breed_code_value     NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
            breed_scm_design     NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
            breed_code_meaning   NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
            breed_snm_rt_id      NVARCHAR(16) DEFAULT NULL DEFAULT '' COLLATE 'utf8_general_ci',
            breed_umls_concept_uid  NVARCHAR(16) DEFAULT NULL DEFAULT '' COLLATE 'utf8_general_ci',
            CONSTRAINT PRIMARY KEY (breed_key) USING BTREE
        )
        CHARSET='utf8',
        COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createSpeciesTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE Station TABLE
  async createStationTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_STATION(
            station_key                INT(11) NOT NULL AUTO_INCREMENT ,
            station_ae_title           NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
            station_name               NVARCHAR(16) DEFAULT NULL COLLATE 'utf8_general_ci',
            CONSTRAINT PRIMARY KEY (station_key) USING BTREE,
            CONSTRAINT uk_station_ae_title UNIQUE KEY (station_ae_title)
        )
        CHARSET='utf8',
        COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[databasemodel::createStationTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE OrdReason CODE SEQ
  async createOrdReasonTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_ORD_REASON(
        ord_reason_key    INT(11) NOT NULL AUTO_INCREMENT ,
        ord_reason_type   TINYINT(3) DEFAULT 0,
        ord_reason_desc   NVARCHAR(64) DEFAULT NULL COLLATE 'utf8_general_ci',
        CONSTRAINT PRIMARY KEY (ord_reason_key) USING BTREE
    )
    CHARSET='utf8',
    COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[databasemodel::createOrdReasonTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE SERVER TABLE
  async createServerTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_SERVER(
        svr_key                INT(11) NOT NULL AUTO_INCREMENT ,
        svr_web_port           INT(11) NOT NULL DEFAULT 0,
        svr_scp_ae_title       NVARCHAR(32) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        svr_scp_host_name      NVARCHAR(32) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
        svr_scp_max_clients    INT(11) NOT NULL DEFAULT 0,
        svr_scp_dcm_port       INT(11) NOT NULL DEFAULT 0,
        svr_scp_web_port       INT(11) NOT NULL DEFAULT 0,
        CONSTRAINT PRIMARY KEY (svr_key) USING BTREE
    )
    CHARSET='utf8',
    COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[databasemodel::createServerTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
      //return result;
    }
  }

  //CREATE CLIENT(SCU) TABLE
  async createClientTable() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(`CREATE TABLE IF NOT EXISTS T_CLIENT(
      client_key            INT(11) NOT NULL AUTO_INCREMENT ,
      client_ae_title       NVARCHAR(16) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
      client_host_name      NVARCHAR(32) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
      CONSTRAINT PRIMARY KEY (client_key) USING BTREE,
      CONSTRAINT uk_client_ae_title UNIQUE KEY (client_ae_title)
  )
  CHARSET='utf8',
  COLLATE='utf8_general_ci'`);
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[databasemodel::createClientTable] Failed to create table! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE PROTOCOL CODE (Body Part)
  async createSeqAccNumber() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(
        `CREATE SEQUENCE IF NOT EXISTS seq_ord_acc_num START WITH 1 INCREMENT BY 1 NOCACHE MAXVALUE=9999;`
      );
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createSeqAccNumber] Failed to create sequence for accession number : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  //CREATE PROTOCOL CODE (Body Part)
  async createSeqBodypart() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();
      rows = await conn.query(
        `CREATE SEQUENCE IF NOT EXISTS seq_bodypart START WITH 1 INCREMENT BY 1 NOCACHE MAXVALUE=9999;`
      );
    } catch (err: any) {
      result = 0;
      __logger.error(
        `[DatabaseModel::createSeqBodypart] Failed to create sequence for protocol code [bodypart]! : res(${err.toString()})`
      );
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
    }
  }

  // INSERT DEAFULT DATA
  // TODO: [cur] For demo data [later] default data ex) 'service' account
  async insertDefaultData() {
    console.log("insertDefaultData");

    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();

      let queryString: string[] = [];
      let queryInsertUser =
        "INSERT INTO T_USER(user_id, user_level,user_name,user_pwd,user_desc) VALUES";
      let queryInsertBodypart =
        "INSERT INTO T_BODYPART(bp_type, bp_code_value, bp_scm_design, bp_code_meaning, bp_snm_rt_id, bp_sub_name, bp_sub_type) VALUES";
      let queryInsertSpecies =
        "INSERT INTO T_SPECIES(species_type, species_code_value, species_scm_design, species_code_meaning) VALUES";
      let queryInsertBreed =
        "INSERT INTO T_BREED(breed_species_type, breed_code_value, breed_scm_design, breed_code_meaning, breed_snm_rt_id, breed_umls_concept_uid) VALUES";

      /*
      let queryInsertProjectionSeq =
        "INSERT INTO T_PJ_SEQ(pj_seq_type, pj_seq_code_value, pj_seq_scm_design, pj_seq_code_meaning, pj_seq_view_position) VALUES";
        */

      /////////////////////////////////////////////////////////////////////////////////
      /// USER
      /////////////////////////////////////////////////////////////////////////////////
      //

      if ((await this.getUserRowCount()) <= 0) {
        queryString.push(
          `${queryInsertUser} ('root', 0x01, 'Vieworks Co.', 'root1234!!', 'root')`
        );
        queryString.push(
          `${queryInsertUser} ('service', 0x11, 'service', 'service', 'none')`
        );

        // Test
        queryString.push(
          `${queryInsertUser} ('vwa', 0x02, 'vwAmerica Co.', '1', 'VWA')`
        );
        queryString.push(
          `${queryInsertUser} ('vweu', 0x02, 'vwEU Co.', '1', 'VWEU')`
        );
        queryString.push(
          `${queryInsertUser} ('spc', 0x02, 'Shimadzu Co.', '1', 'Shimadzu Philippines (SPC)')`
        );
        //
        queryString.push(`${queryInsertUser} ('1', 0x11, '1', '1', 'none')`);
        queryString.push(
          `${queryInsertUser} ('admin01', 0x11, 'LEE', '123', 'none')`
        );
        //
        queryString.push(
          `${queryInsertUser} ('usr01', 0x12, 'MIN', '123', 'Radiologist')`
        );
        queryString.push(
          `${queryInsertUser} ('usr02', 0x12, 'JI', '123', 'Radiologist')`
        );
        queryString.push(
          `${queryInsertUser} ('usr03', 0x12, 'HONG', '123', 'Family physicians')`
        );
        queryString.push(
          `${queryInsertUser} ('usr04', 0x12, 'JIN', '123', 'Internal Medicine Physician')`
        );
        queryString.push(
          `${queryInsertUser} ('usr05', 0x12, 'CHIN', '123', 'Emergency physicians')`
        );
        queryString.push(
          `${queryInsertUser} ('usr06', 0x12, 'KANG', '123', 'Psychiatrists')`
        );
        queryString.push(
          `${queryInsertUser} ('usr07', 0x12, 'KONG', '123', 'Obstetricians and gynecologists')`
        );
        queryString.push(
          `${queryInsertUser} ('usr08', 0x12, 'KANG', '123', 'Neurologists')`
        );
        queryString.push(
          `${queryInsertUser} ('usr09', 0x12, 'LEE', '123', 'Surgeon')`
        );
        queryString.push(
          `${queryInsertUser} ('usr10', 0x12, 'NOON', '123', 'Surgeon')`
        );
        queryString.push(
          `${queryInsertUser} ('usr11', 0x12, 'BOM', '123', 'Radiologist')`
        );
        queryString.push(
          `${queryInsertUser} ('usr12', 0x12, 'SIN', '123', 'Radiologist')`
        );
        queryString.push(
          `${queryInsertUser} ('usr13', 0x12, 'SON', '123', 'Radiologist')`
        );
        queryString.push(
          `${queryInsertUser} ('usr14', 0x12, 'SONY', '123', 'Radiologist')`
        );
        queryString.push(
          `${queryInsertUser} ('usr15', 0x12, 'ZON', '123', 'Radiologist')`
        );
        queryString.push(
          `${queryInsertUser} ('usr16', 0x12, 'RYUL', '123', 'Radiologist')`
        );
        //
        queryString.push(
          `${queryInsertUser} ('nurse01', 0x13, 'KIM', '123', 'Certified Nursing Assistant')`
        );
        queryString.push(
          `${queryInsertUser} ('nurse02', 0x13, 'Luis', '123', 'Licensed Practical Nurse')`
        );
        queryString.push(
          `${queryInsertUser} ('nurse03', 0x13, 'JON', '123', 'Registered Nurse')`
        );
        //
        queryString.push(
          `${queryInsertUser} ('tech01', 0x14, 'KIM', '123', 'DX technician')`
        );
        queryString.push(
          `${queryInsertUser} ('tech02', 0x14, 'LIM', '123', 'MG technician')`
        );
      }

      // Species
      if ((await this.getSpeciesRowCount()) <= 0) {
        queryString.push(
          `${queryInsertSpecies} (1,'L-80700', 'SRT', 'Canine species')`
        );
        queryString.push(`${queryInsertSpecies} (1,'L-881FC', 'SRT', 'Canis')`);
        queryString.push(
          `${queryInsertSpecies} (1,'L-88121', 'SRT', 'Canis lupus')`
        );
        queryString.push(
          `${queryInsertSpecies} (1,'L-88124', 'SRT', 'Canis lupus familiaris (domestic dog)')`
        );
        queryString.push(
          `${queryInsertSpecies} (1,'388490000', 'SCT', 'Canis')`
        );
        queryString.push(
          `${queryInsertSpecies} (1,'36855005', 'SCT', 'Canis lupus')`
        );
        queryString.push(
          `${queryInsertSpecies} (1,'448771007', 'SCT', 'Canis lupus familiaris (domestic dog)')`
        );
        queryString.push(
          `${queryInsertSpecies} (2,'L-80A00', 'SRT', 'Feline species')`
        );
        queryString.push(`${queryInsertSpecies} (2,'L-000F9', 'SRT', 'Felis')`);
        queryString.push(
          `${queryInsertSpecies} (2,'L-00376', 'SRT', 'Felis catus (domestic cat)')`
        );
        queryString.push(
          `${queryInsertSpecies} (2,'388626009', 'SCT', 'Felis')`
        );
        queryString.push(
          `${queryInsertSpecies} (2,'448169003', 'SCT', 'Felis catus (domestic cat)')`
        );
        queryString.push(
          `${queryInsertSpecies} (3,'L-80400', 'SRT', 'Equine species')`
        );
        queryString.push(`${queryInsertSpecies} (3,'L-000A9', 'SRT', 'Equus')`);
        queryString.push(
          `${queryInsertSpecies} (3,'L-8A102', 'SRT', 'Equus caballus (domestic horse)')`
        );
        queryString.push(
          `${queryInsertSpecies} (3,'388445009', 'SCT', 'Equus')`
        );
        queryString.push(
          `${queryInsertSpecies} (3,'35354009', 'SCT', 'Equus caballus (domestic horse)')`
        );
        queryString.push(
          `${queryInsertSpecies} (4,'L-86B02', 'SRT', 'Oryctolagus cuniculus')`
        );
        queryString.push(
          `${queryInsertSpecies} (4,'36571002', 'SCT', 'Oryctolagus cuniculus')`
        );
        queryString.push(
          `${queryInsertSpecies} (5,'L-80100', 'SRT', 'Bovine species')`
        );
        queryString.push(`${queryInsertSpecies} (5,'L-8BA18', 'SRT', 'Bos')`);
        queryString.push(
          `${queryInsertSpecies} (5,'L-8B9F9', 'SRT', 'Bovinae')`
        );
        queryString.push(
          `${queryInsertSpecies} (5,'L-8B941', 'SRT', 'Bos taurus (domestic cow)')`
        );
        queryString.push(`${queryInsertSpecies} (5,'388168008', 'SCT', 'Bos')`);
        queryString.push(
          `${queryInsertSpecies} (5,'107007004', 'SCT', 'Bovinae')`
        );
        queryString.push(
          `${queryInsertSpecies} (5,'34618005', 'SCT', 'Bos taurus (domestic cow)')`
        );
        queryString.push(
          `${queryInsertSpecies} (6,'L-80200', 'SRT', 'Caprine species')`
        );
        queryString.push(`${queryInsertSpecies} (6,'L-8C3FB', 'SRT', 'Capra')`);
        queryString.push(
          `${queryInsertSpecies} (6,'L-8C306', 'SRT', 'Capra hircus (domestic goat)')`
        );
        queryString.push(
          `${queryInsertSpecies} (6,'388249000', 'SCT', 'Capra')`
        );
        queryString.push(
          `${queryInsertSpecies} (6,'125097000', 'SCT', 'Capra hircus (domestic goat)')`
        );
        queryString.push(
          `${queryInsertSpecies} (7,'L-80300', 'SRT', 'Ovine species')`
        );
        queryString.push(`${queryInsertSpecies} (7,'L-8C3FD', 'SRT', 'Ovis')`);
        queryString.push(
          `${queryInsertSpecies} (7,'L-8C336', 'SRT', 'Ovis aries (domestic sheep)')`
        );
        queryString.push(
          `${queryInsertSpecies} (7,'388254009', 'SCT', 'Ovis')`
        );
        queryString.push(
          `${queryInsertSpecies} (7,'125099002', 'SCT', 'Ovis aries (domestic sheep)')`
        );
        queryString.push(
          `${queryInsertSpecies} (8,'L-80500', 'SRT', 'Porcine species')`
        );
        queryString.push(`${queryInsertSpecies} (8,'L-8B1FB', 'SRT', 'Sus')`);
        queryString.push(
          `${queryInsertSpecies} (8,'L-8B100', 'SRT', 'Sus scrofa')`
        );
        queryString.push(`${queryInsertSpecies} (8,'388393002', 'SCT', 'Sus')`);
        queryString.push(
          `${queryInsertSpecies} (8,'78678003', 'SCT', 'Sus scrofa')`
        );
      }

      // Breed
      if ((await this.getBreedRowCount()) <= 0) {
        queryString.push(
          `${queryInsertBreed} (1,'132619000', 'SCT', 'Mixed breed dog', 'L-809DF', 'C1269316')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132371002', 'SCT', 'Bichon Teneriffe dog breed', 'L-807E2', 'C1296664')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132372009', 'SCT', 'Bizanian Hound dog breed', 'L-807E3', 'C1296663')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132373004', 'SCT', 'Bloodhound, St. Hubert dog breed', 'L-807E4', 'C1296665')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132374005', 'SCT', 'Bloodhound, Southern Hound dog breed', 'L-807E5', 'C1296666')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132389001', 'SCT', 'Bordeaux Dog breed', 'L-808A3', 'C1296679')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132376007', 'SCT', 'Brandlbracke dog breed', 'L-807E7', 'C1296668')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132377003', 'SCT', "Braque d'Ariége dog breed", 'L-807E8', 'C1321460')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132378008', 'SCT', 'Portuguese Guard Dog breed', 'L-807E9', 'C1296669')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132379000', 'SCT', 'Great Münsterländer dog breed', 'L-807EA', 'C1321461')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132380002', 'SCT', 'Beagle, Smooth dog breed', 'L-807EB', 'C1296670')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132381003', 'SCT', 'Beagle, Rough dog breed', 'L-807EC', 'C1296671')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132382005', 'SCT', 'Belgian Griffon, Rough dog breed', 'L-807ED', 'C1296672')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132383000', 'SCT', 'Belgian Griffon, Smooth dog breed', 'L-807EE', 'C1296673')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132384006', 'SCT', 'Braque Belge dog breed', 'L-807EF', 'C1296674')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132385007', 'SCT', 'Belgian Street Dog breed', 'L-807F1', 'C1296675')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132386008', 'SCT', 'Bernese Hound dog breed', 'L-807F2', 'C1296676')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132387004', 'SCT', 'Eurasier dog breed', 'L-808A1', 'C1296677')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132388009', 'SCT', 'English Bulldog breed', 'L-808A2', 'C1296678')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132389001', 'SCT', 'Dogue de Bourdeaux dog breed', 'L-808A3', 'C1296679')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132390005', 'SCT', 'Kai Ken dog breed', 'L-808A4', 'C1296680')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132391009', 'SCT', 'Kui Mlk dog breed', 'L-808A5', 'C1296681')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132392002', 'SCT', 'Argentine Dogo dog breed', 'L-808A6', 'C1296682')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132393007', 'SCT', 'Alentejo herder dog breed', 'L-808A7', 'C1296683')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132394001', 'SCT', 'Saint Bernard, Long-haired dog breed', 'L-808A8', 'C1296684')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132395000', 'SCT', 'Saint Bernard, Short-haired dog breed', 'L-808A9', 'C1296685')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132396004', 'SCT', 'West Siberian Laika dog breed', 'L-808AA', 'C1296686')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132397008', 'SCT', 'Basset Fauve de Bretagne dog breed', 'L-808AB', 'C1296687')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132398003', 'SCT', 'Japanese Retriever dog breed', 'L-808AC', 'C1296688')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132399006', 'SCT', 'Kai Dog breed', 'L-808AD', 'C1296689')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132400004', 'SCT', 'American Blue Gascon Hound dog breed', 'L-808AE', 'C1296690')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132401000', 'SCT', 'Beagle Harrier dog breed', 'L-808AF', 'C1296691')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132402007', 'SCT', 'Kangal Dog breed', 'L-808B1', 'C1296692')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132403002', 'SCT', 'Leopard Cur dog breed', 'L-808B2', 'C1296693')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132404008', 'SCT', 'Patterdale Terrier dog breed', 'L-808B3', 'C1296694')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132405009', 'SCT', 'Petit Brabaçon dog breed', 'L-808B4', 'C1296695')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132406005', 'SCT', 'Aidi dog breed', 'L-808B5', 'C1296696')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132407001', 'SCT', 'American Indian Dog breed', 'L-808B6', 'C1296697')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132408006', 'SCT', 'Austrian Pinscher dog breed', 'L-808B7', 'C1296698')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132409003', 'SCT', 'American Eskimo, standard dog breed', 'L-808B8', 'C1296699')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132410008', 'SCT', 'American Eskimo, Miniature dog breed', 'L-808B9', 'C1296700')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132411007', 'SCT', 'American Eskimo, Toy dog breed', 'L-808BA', 'C1296701')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132412000', 'SCT', 'Basset Griffon Vendéen dog breed', 'L-808BB', 'C1296702')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132413005', 'SCT', 'Batard dog breed', 'L-808BC', 'C1296703')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132414004', 'SCT', 'Basset Bleu de Gascogne dog breed', 'L-808BD', 'C1296704')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132415003', 'SCT', 'Braque Dupuy dog breed', 'L-808BE', 'C1296705')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132416002', 'SCT', 'Bruno de Jura dog breed', 'L-808BF', 'C1296706')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132417006', 'SCT', 'Cão da Serra de Aires dog breed', 'L-808C1', 'C1296707')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132418001', 'SCT', 'Cão de Castro Laboreiro dog breed', 'L-808C2', 'C1296708')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132419009', 'SCT', 'Cão de Fila Miguel dog breed', 'L-808C3', 'C1296709')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132420003', 'SCT', 'Catalan Sheepdog breed', 'L-808C4', 'C1296710')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132421004', 'SCT', 'Caucasian Shepherd Dog breed', 'L-808C5', 'C1296711')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132422006', 'SCT', "Cirneco dell'Etna dog breed", 'L-808C6', 'C1296712')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132423001', 'SCT', 'English Toy Terrier dog breed', 'L-808C7', 'C1296713')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132424007', 'SCT', 'German Spitz dog breed', 'L-808C8', 'C1296714')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'709853007', 'SCT', 'Dingo dog breed', 'L-DA692', 'C1296715')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132426009', 'SCT', 'Fauve de Bretagne dog breed', 'L-808CA', 'C1296716')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132427000', 'SCT', 'Hellenic Hound dog breed', 'L-808CB', 'C1296717')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132428005', 'SCT', 'Holland Shepherd dog breed', 'L-808CC', 'C1296718')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132429002', 'SCT', 'Japanese Spitz dog breed', 'L-808CD', 'C1296719')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132430007', 'SCT', 'Jämthund dog breed', 'L-808CE', 'C1296720')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132431006', 'SCT', 'Jindo dog breed', 'L-808CF', 'C1296721')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132432004', 'SCT', 'Karelo-Finnish Laika dog breed', 'L-808D1', 'C1296722')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132433009', 'SCT', 'King Shepherd dog breed', 'L-808D2', 'C1296723')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132434003', 'SCT', 'Kishu dog breed', 'L-808D3', 'C1296724')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132435002', 'SCT', 'Kirhiz dog breed', 'L-808D4', 'C1296725')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132436001', 'SCT', 'Magyar Agår dog breed', 'L-808D5', 'C1296726')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132437005', 'SCT', 'Middle Asian Ovtcharka dog breed', 'L-808D6', 'C1296727')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132438000', 'SCT', 'Mi-Ki dog breed', 'L-808D7', 'C1296728')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132439008', 'SCT', 'Miniature Australian Shepherd dog breed', 'L-808D8', 'C1296729')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132440005', 'SCT', 'Min-pei dog breed', 'L-808D9', 'C1296730')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132441009', 'SCT', 'Mountain Cur dog breed', 'L-808DA', 'C1296731')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132442002', 'SCT', 'Moscow Longhaired Toy Terrier dog breed', 'L-808DB', 'C1296732')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132443007', 'SCT', 'Perdigueiro Portuguese dog breed', 'L-808DC', 'C1296733')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132444001', 'SCT', 'Podengo Canario dog breed', 'L-808DD', 'C1296734')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132445000', 'SCT', 'Podengo Pequeno dog breed', 'L-808DE', 'C1296735')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132446004', 'SCT', 'Pressa Mallorquin dog breed', 'L-808DF', 'C1296736')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132447008', 'SCT', 'Pyrenean Mastiff dog breed', 'L-808E1', 'C1296737')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132448003', 'SCT', 'Rastreador Brasileiro dog breed', 'L-808E2', 'C1296738')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132449006', 'SCT', 'Sabuesos Españoles dog breed', 'L-808E3', 'C1296739')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132450006', 'SCT', 'Schiller Hound dog breed', 'L-808E4', 'C1296740')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132451005', 'SCT', 'South Russian Steppe Hound dog breed', 'L-808E5', 'C1296741')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132452003', 'SCT', 'Styrian Mountain dog breed', 'L-808E6', 'C1296742')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132453008', 'SCT', 'Berger du Languedoc dog breed', 'L-808E7', 'C1296743')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132454002', 'SCT', 'Teddy Roosevelt Terrier dog breed', 'L-808E8', 'C1296744')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132455001', 'SCT', 'Transylvanian Hound dog breed', 'L-808E9', 'C1296745')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132456000', 'SCT', 'Trigg Hound dog breed', 'L-808EA', 'C1296746')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132457009', 'SCT', 'Tyrolean Hound dog breed', 'L-808EB', 'C1296747')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132458004', 'SCT', 'White Shepherd dog breed', 'L-808EC', 'C1296748')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132459007', 'SCT', 'Wirehair Styrian mountain dog breed', 'L-808ED', 'C1296749')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132460002', 'SCT', 'Yugoslavian Hound dog breed', 'L-808EE', 'C1296750')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132461003', 'SCT', 'Old Farm Collie dog breed', 'L-808EF', 'C1296751')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132462005', 'SCT', 'Old German Shepherd dog breed', 'L-808F1', 'C1296752')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132463000', 'SCT', 'New Zealand Heading Dog breed', 'L-808F2', 'C1296753')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132464006', 'SCT', 'German Koolie dog breed', 'L-808F3', 'C1296754')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132465007', 'SCT', 'Smithfield dog breed', 'L-808F4', 'C1296755')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132466008', 'SCT', 'Spanish Greyhound dog breed', 'L-808F5', 'C1296756')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132467004', 'SCT', 'Armant dog breed', 'L-808F6', 'C1296757')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132468009', 'SCT', 'Australian Greyhound dog breed', 'L-808F8', 'C1296758')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132469001', 'SCT', 'Australian Terrier, rough-coated dog breed', 'L-808F9', 'C1296759')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132470000', 'SCT', 'Australian Terrier, silky dog breed', 'L-808FA', 'C1296760')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132471001', 'SCT', 'Austrian Hound dog breed', 'L-808FB', 'C1296761')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132472008', 'SCT', 'Austrian Smooth-Haired Bracke dog breed', 'L-808FC', 'C1296762')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132473003', 'SCT', 'Balkan Hound dog breed', 'L-808FD', 'C1296763')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132474009', 'SCT', 'Banjara greyhound dog breed', 'L-808FE', 'C1296764')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132475005', 'SCT', 'Beagle, Standard dog breed', 'L-808FF', 'C1296765')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132476006', 'SCT', 'Estrela Mountain Dog breed', 'L-80916', 'C1296766')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132477002', 'SCT', 'Epagneul Picard dog breed', 'L-80917', 'C1296767')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132478007', 'SCT', 'Epagneul Bleu de Picardie dog breed', 'L-80918', 'C1296768')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132479004', 'SCT', 'Estonian Hound dog breed', 'L-80919', 'C1296769')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132480001', 'SCT', 'Epagneul Pont-Audemer dog breed', 'L-80920', 'C1296770')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132481002', 'SCT', 'Eurasian dog breed', 'L-80921', 'C1296771')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132482009', 'SCT', 'Fell Terrier dog breed', 'L-80922', 'C1296772')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132483004', 'SCT', 'Fila Brasileiro dog breed', 'L-80923', 'C1296773')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132484005', 'SCT', 'Finnish Hound dog breed', 'L-80924', 'C1296774')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132485006', 'SCT', 'Finnish Lapphund dog breed', 'L-80925', 'C1296775')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132486007', 'SCT', 'Entlebucher dog breed', 'L-80926', 'C1296776')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132487003', 'SCT', 'French Guard Dog breed', 'L-80927', 'C1296777')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132488008', 'SCT', 'French Spaniel dog breed', 'L-80928', 'C1296778')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132489000', 'SCT', 'Coton de Tuléar dog breed', 'L-80929', 'C1296779')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132490009', 'SCT', 'Hamiltonstövare dog breed', 'L-80930', 'C1296780')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132491008', 'SCT', 'Danish Broholmer dog breed', 'L-80931', 'C1296781')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132492001', 'SCT', 'English Shepherd dog breed', 'L-80932', 'C1296782')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132493006', 'SCT', 'Drentse Patrijshond dog breed', 'L-80933', 'C1296783')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132494000', 'SCT', 'Dunker dog breed', 'L-80934', 'C1296784')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132495004', 'SCT', 'Dutch Kooiker Dog breed', 'L-80935', 'C1296785')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132496003', 'SCT', 'Dutch Shepherd dog breed', 'L-80936', 'C1296786')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132497007', 'SCT', 'East Siberian Laika dog breed', 'L-80937', 'C1296787')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132498002', 'SCT', 'Deutsche bracke dog breed', 'L-80938', 'C1296788')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132499005', 'SCT', 'Hanoverian Hound dog breed', 'L-80939', 'C1296789')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132500001', 'SCT', 'Hovawart dog breed', 'L-80940', 'C1296790')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132501002', 'SCT', 'Icelandic Sheepdog breed', 'L-80941', 'C1296791')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132502009', 'SCT', 'Inca Hairless Dog breed', 'L-80942', 'C1296792')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132503004', 'SCT', 'Irish Red and White Setter dog breed', 'L-80943', 'C1296793')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132504005', 'SCT', 'Jagdterrier dog breed', 'L-80944', 'C1296794')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132505006', 'SCT', 'German Spaniel dog breed', 'L-80945', 'C1296795')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132506007', 'SCT', 'Grand Anglo-Français dog breed', 'L-80946', 'C1296796')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132507003', 'SCT', 'Grand Bassett Griffon Vendeen dog breed', 'L-80947', 'C1296797')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132508008', 'SCT', 'Grand Bleu de Gascogne dog breed', 'L-80948', 'C1296798')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132509000', 'SCT', 'Grand Gascon-Saintongeois dog breed', 'L-80949', 'C1296799')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132510005', 'SCT', 'German Pinscher dog breed', 'L-80950', 'C1296800')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132511009', 'SCT', 'Greater Swiss Mountain Dog breed', 'L-80951', 'C1296801')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132512002', 'SCT', 'Greenland Dog breed', 'L-80952', 'C1296802')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132513007', 'SCT', 'Griffon Fauve de Bretegne dog breed', 'L-80953', 'C1296803')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132514001', 'SCT', 'Griffon Nivernais dog breed', 'L-80954', 'C1296804')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132515000', 'SCT', 'Grand Griffon Vendeen dog breed', 'L-80955', 'C1296805')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132516004', 'SCT', 'Ainu dog breed', 'L-80956', 'C1296806')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132517008', 'SCT', 'Basset Artésian Normand dog breed', 'L-80957', 'C1296807')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132518003', 'SCT', 'Bavarian Mountain Hound dog breed', 'L-80958', 'C1296808')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132519006', 'SCT', 'Beauceron dog breed', 'L-80959', 'C1296809')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132520000', 'SCT', 'Azawakh dog breed', 'L-80960', 'C1296810')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132521001', 'SCT', 'Australian Shepherd dog breed', 'L-80961', 'C1296811')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132522008', 'SCT', 'Belgian Wolfhound dog breed', 'L-80962', 'C1296812')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132523003', 'SCT', 'Bergamasco dog breed', 'L-80963', 'C1296813')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132524009', 'SCT', 'Berger de Picard dog breed', 'L-80964', 'C1296814')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132525005', 'SCT', 'Berger de Pyrenees dog breed', 'L-80965', 'C1296815')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132526006', 'SCT', 'Billy dog breed', 'L-80966', 'C1296816')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132527002', 'SCT', 'Belgian Griffon dog breed', 'L-80967', 'C0324378')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132528007', 'SCT', 'American Hairless Terrier dog breed', 'L-80968', 'C1296817')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132529004', 'SCT', 'Beagle, Elizabethan dog breed', 'L-80969', 'C1296818')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132530009', 'SCT', 'Japanese Pointer dog breed', 'L-80970', 'C1296819')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132531008', 'SCT', 'Akbash dog breed', 'L-80971', 'C1296820')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132532001', 'SCT', 'Alapaha blueblood bullDog breed', 'L-80972', 'C1296821')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132533006', 'SCT', 'Barbet dog breed', 'L-80973', 'C1296822')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132534000', 'SCT', 'American Bulldog breed', 'L-80974', 'C1296823')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132535004', 'SCT', 'Black Russian Terrier dog breed', 'L-80975', 'C1296824')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132536003', 'SCT', 'Anglo-Francais de moyen venerie dog breed', 'L-80976', 'C1296825')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132537007', 'SCT', 'Anglo-Francais de petit venerie dog breed', 'L-80977', 'C1296826')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132538002', 'SCT', 'Appenzeller dog breed', 'L-80978', 'C1296827')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132539005', 'SCT', 'Ariégeois dog breed', 'L-80979', 'C1321491')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132540007', 'SCT', 'Alano Español dog breed', 'L-80980', 'C1321462')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132541006', 'SCT', 'Australian Kelpie dog breed', 'L-80981', 'C1296828')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132542004', 'SCT', 'Alpine dachsbracke dog breed', 'L-80982', 'C1296829')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132543009', 'SCT', 'Chien Français Blanc et Noir dog breed', 'L-80983', 'C1321463')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132544003', 'SCT', 'Carolina Dog breed', 'L-80984', 'C1296830')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132545002', 'SCT', 'Catahoula Leopard dog breed', 'L-80985', 'C1296831')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132546001', 'SCT', 'Caucasian Mountain Dog breed', 'L-80986', 'C1296832')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132547005', 'SCT', 'Cesky Fousek dog breed', 'L-80987', 'C1296833')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132548000', 'SCT', 'Cesky Terrier dog breed', 'L-80988', 'C1296834')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132549008', 'SCT', 'Chart Polski dog breed', 'L-80989', 'C1296835')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132550008', 'SCT', 'Black Forest Hound dog breed', 'L-80990', 'C1296836')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132551007', 'SCT', "Chien d'Artois dog breed", 'L-80991', 'C1296837')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132552000', 'SCT', 'Canaan dog breed', 'L-80992', 'C1296838')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132553005', 'SCT', 'Chien Français Tricolore dog breed', 'L-80993', 'C1321464')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132554004', 'SCT', 'Chinese Crested dog breed', 'L-80994', 'C1296839')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132555003', 'SCT', 'Chinese Foo Dog breed', 'L-80995', 'C1296840')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132556002', 'SCT', "Chinese Imperial ch'in dog breed", 'L-80996', 'C1296841')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132557006', 'SCT', 'Chinook dog breed', 'L-80997', 'C1296842')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132558001', 'SCT', 'Chien Français Blanc et Orange dog breed', 'L-80998', 'C1321465')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132559009', 'SCT', 'Braque Français de Grand Taille dog breed', 'L-80999', 'C1296843')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132560004', 'SCT', 'Bolognese dog breed', 'L-809A1', 'C1296844')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132561000', 'SCT', 'Border Collie dog breed', 'L-809A2', 'C1296845')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132562007', 'SCT', 'Bracco Italiano dog breed', 'L-809A3', 'C1296846')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132563002', 'SCT', 'Cane Corso dog breed', 'L-809A4', 'C1296847')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132564008', 'SCT', 'Braque du Bourbonnais dog breed', 'L-809A5', 'C1296848')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132565009', 'SCT', 'Braque Francais de Petite Taille dog breed', 'L-809A6', 'C1296849')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132566005', 'SCT', 'Braque Saint-Germain dog breed', 'L-809A7', 'C1296850')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132567001', 'SCT', 'Briquet Basset Griffon Vendeen dog breed', 'L-809A8', 'C1296851')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132568006', 'SCT', 'Black Mouth Cur dog breed', 'L-809A9', 'C1296852')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132569003', 'SCT', "Braque d'Auvergne dog breed", 'L-809AA', 'C1296853')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132570002', 'SCT', 'Schapendoes dog breed', 'L-809AB', 'C1296854')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132571003', 'SCT', 'Sarplaninac dog breed', 'L-809AC', 'C1296855')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132572005', 'SCT', 'Russo-Laika dog breed', 'L-809AD', 'C1296856')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132573000', 'SCT', 'Bosnian Hound dog breed', 'L-809AE', 'C1296857')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132574006', 'SCT', 'Rat Terrier dog breed', 'L-809AF', 'C1296858')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132575007', 'SCT', 'Pumi dog breed', 'L-809B1', 'C1296859')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132576008', 'SCT', 'Presa Canario dog breed', 'L-809B2', 'C1296860')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132577004', 'SCT', 'Portuguese Pointer dog breed', 'L-809B3', 'C1296861')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132578009', 'SCT', 'Porcelaine dog breed', 'L-809B4', 'C1296862')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132579001', 'SCT', 'Shropshire Terrier dog breed', 'L-809B5', 'C1296863')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132580003', 'SCT', 'Boykin Spaniel dog breed', 'L-809B6', 'C1296864')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132581004', 'SCT', 'Southern Blackmouth Cur dog breed', 'L-809B7', 'C1296865')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132582006', 'SCT', 'South Russian Ovcharka dog breed', 'L-809B8', 'C1296866')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132583001', 'SCT', 'Small Spanish Hound dog breed', 'L-809B9', 'C1296867')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132584007', 'SCT', 'Small Münsterländer dog breed', 'L-809BA', 'C1321466')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132585008', 'SCT', 'Slovak Cuvak dog breed', 'L-809BB', 'C1296868')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132586009', 'SCT', 'Shiloh Shepherd dog breed', 'L-809BC', 'C1296869')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132587000', 'SCT', 'Shiba Inu dog breed', 'L-809BD', 'C1296870')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132588005', 'SCT', 'Welsh Sheepdog breed', 'L-809BE', 'C1296871')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132589002', 'SCT', 'Shar-pei dog breed', 'L-809BF', 'C1296872')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132590006', 'SCT', 'Sloughi dog breed', 'L-809C1', 'C1296873')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132591005', 'SCT', 'Owczarek Podhalandski dog breed', 'L-809C2', 'C1296874')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132592003', 'SCT', 'Norbottenspets dog breed', 'L-809C3', 'C1296875')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132593008', 'SCT', 'Norwegian Dunkerhound dog breed', 'L-809C4', 'C1296876')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132594002', 'SCT', 'Old Danish Bird Dog breed', 'L-809C5', 'C1269305')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132595001', 'SCT', 'Old Format Dachsund dog breed', 'L-809C6', 'C1269306')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132596000', 'SCT', 'Old Format Manchester Terrier dog breed', 'L-809C7', 'C1269307')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132597009', 'SCT', 'Old Format Min/Toy Poodle dog breed', 'L-809C8', 'C1269308')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132598004', 'SCT', 'Old Format Welsh Corgi dog breed', 'L-809C9', 'C1269309')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132599007', 'SCT', 'Neopolitan Mastiff dog breed', 'L-809CA', 'C1269310')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132600005', 'SCT', 'Perdiguero de Burgos dog breed', 'L-809CB', 'C1296877')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132601009', 'SCT', 'Perdiguero Navarro dog breed', 'L-809CC', 'C1296878')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132602002', 'SCT', 'Peruvian Inca Orchid dog breed', 'L-809CD', 'C1269311')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132603007', 'SCT', 'Petit Bleu de Gascogne dog breed', 'L-809CE', 'C1296879')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132604001', 'SCT', 'Petit Gascon-Saintongeois dog breed', 'L-809CF', 'C1296880')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132605000', 'SCT', 'Petit Griffon Bleu de Gascogne dog breed', 'L-809D1', 'C1296881')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132606004', 'SCT', 'Olde English Bulldogge dog breed', 'L-809D2', 'C1296882')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132607008', 'SCT', 'Löwchen dog breed', 'L-809D3', 'C1321467')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132608003', 'SCT', 'Polski Owczarek Nizinny dog breed', 'L-809D4', 'C1296883')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132609006', 'SCT', 'Polish Hound dog breed', 'L-809D5', 'C1296884')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132610001', 'SCT', 'Poitevin dog breed', 'L-809D6', 'C1296885')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132611002', 'SCT', 'Spanish Pointer dog breed', 'L-809D7', 'C1296886')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132612009', 'SCT', 'Kyi-Leo dog breed', 'L-809D8', 'C1296887')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132613004', 'SCT', 'Large Spanish Hound dog breed', 'L-809D9', 'C1269312')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132614005', 'SCT', 'Lundehund dog breed', 'L-809DA', 'C1296888')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132615006', 'SCT', 'Lurcher Hound dog breed', 'L-809DB', 'C1269313')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132616007', 'SCT', 'Maremma Sheepdogs dog breed', 'L-809DC', 'C1269314')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132617003', 'SCT', 'McNab dog breed', 'L-809DD', 'C1296889')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132618008', 'SCT', 'Miniature Bull Terrier dog breed', 'L-809DE', 'C1269315')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132620006', 'SCT', 'Mudi dog breed', 'L-809E1', 'C1296890')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132621005', 'SCT', 'Munster Lander Pointer dog breed', 'L-809E2', 'C1269317')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132622003', 'SCT', 'Loenberger dog breed', 'L-809E3', 'C1562740')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132623008', 'SCT', 'Chi Terrier dog breed', 'L-809E4', 'C1296892')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132624002', 'SCT', 'Krasky Ovcar dog breed', 'L-809E5', 'C1296893')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132625001', 'SCT', 'Kromfohrländer dog breed', 'L-809E6', 'C1321468')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132626000', 'SCT', 'Havanese dog breed', 'L-809E7', 'C1296894')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132627009', 'SCT', 'American lamalese dog breed', 'L-809E8', 'C1269318')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132629007', 'SCT', 'Norwegian Lundehund dog breed', 'L-809EA', 'C1269320')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132630002', 'SCT', 'North American Shepherd dog breed', 'L-809EB', 'C1296895')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132631003', 'SCT', 'Kyi Apso dog breed', 'L-809EC', 'C1296896')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132632005', 'SCT', 'Swedish Lapphund dog breed', 'L-809ED', 'C1269321')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132633000', 'SCT', 'Treeing Tennessee Brindle dog breed', 'L-809EE', 'C1296897')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132634006', 'SCT', 'Telomain dog breed', 'L-809EF', 'C1296898')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132635007', 'SCT', 'Swedish Vallhund dog breed', 'L-809F1', 'C1269322')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132636008', 'SCT', 'Stumpy Tail Cattle Dog breed', 'L-809F2', 'C1269323')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132637004', 'SCT', 'Stabyhoun dog breed', 'L-809F3', 'C1296899')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132638009', 'SCT', 'Spinone Italiano dog breed', 'L-809F4', 'C1296900')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132639001', 'SCT', 'Spanish Mastiff dog breed', 'L-809F5', 'C1296901')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132640004', 'SCT', 'Berger Shetland dog breed', 'L-809F6', 'C1296902')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132641000', 'SCT', 'Thai Ridgeback dog breed', 'L-809F7', 'C1296903')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132642007', 'SCT', 'Swiss Mountain Dog breed', 'L-809F8', 'C1269324')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132643002', 'SCT', 'Tibetan Mastiff dog breed', 'L-809F9', 'C1296904')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132644008', 'SCT', 'Glen of Imaal Terrier dog breed', 'L-809FA', 'C1296905')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132645009', 'SCT', 'Tosa Inu dog breed', 'L-809FB', 'C1296906')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132646005', 'SCT', 'Toy Havanese Terrier dog breed', 'L-809FC', 'C1296907')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132647001', 'SCT', 'Treeing Cur dog breed', 'L-809FD', 'C1296908')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132648006', 'SCT', 'Treeing Feist dog breed', 'L-809FE', 'C1296909')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132649003', 'SCT', 'Greater Swiss Mountain Hound dog breed', 'L-809FF', 'C1269325')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'2062007', 'SCT', 'Dachshund superbreed of dog', 'L-80770', 'C0324348')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'52946002', 'SCT', 'Affenpinscher', 'L-80705', 'C0324297')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'77213006', 'SCT', 'Afghan hound', 'L-80706', 'C0324298')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'3921008', 'SCT', 'Airedale terrier', 'L-80707', 'C0324299')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'84514002', 'SCT', 'Akita dog', 'L-80708', 'C0324300')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'53228008', 'SCT', 'Alaskan malamute', 'L-80709', 'C0324301')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'88779009', 'SCT', 'American foxhound', 'L-807A4', 'C0324369')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'11746005', 'SCT', 'Australian cattle dog', 'L-80711', 'C0324303')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'112491001', 'SCT', 'Australian terrier', 'L-80710', 'C0324302')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'47659007', 'SCT', 'Basenji', 'L-80712', 'C0324304')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'41320000', 'SCT', 'Basset hound', 'L-80713', 'C0324305')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'44696006', 'SCT', 'Beagle', 'L-80714', 'C0324306')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'1514007', 'SCT', 'Bedlington terrier', 'L-80715', 'C0324307')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'74536009', 'SCT', 'Belgian groenendael dog', 'L-80716', 'C0324308')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'76554006', 'SCT', 'Belgian laeken dog', 'L-80717', 'C0324309')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'37116003', 'SCT', 'Belgian malinois dog', 'L-80718', 'C0324310')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'85144002', 'SCT', 'Belgian sheepdog', 'L-80719', 'C0324311')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'27444002', 'SCT', 'Belgian tervuren dog', 'L-80720', 'C0324312')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'33458006', 'SCT', 'Bernese mountain dog', 'L-80721', 'C0324313')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'41538003', 'SCT', 'Bichons frise dog', 'L-80722', 'C0324314')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'81529001', 'SCT', 'Bloodhound', 'L-80723', 'C0324315')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'69529009', 'SCT', 'Border terrier', 'L-80724', 'C0324316')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'112492008', 'SCT', 'Borzoi dog', 'L-80725', 'C0324317')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'79295007', 'SCT', 'Boston terrier', 'L-80726', 'C0324318')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'66712005', 'SCT', 'Bouvier des Flandres', 'L-80727', 'C0324319')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'42250008', 'SCT', 'Boxer dog', 'L-80728', 'C0324320')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'10369004', 'SCT', 'Briard dog', 'L-80729', 'C0324321')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'23995009', 'SCT', 'Bull terrier', 'L-80730', 'C0324322')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'38184008', 'SCT', 'Bulldog', 'L-80735', 'C0324327')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'71175006', 'SCT', 'Bullmastiff', 'L-80736', 'C0324328')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'87111007', 'SCT', 'Cairn terrier', 'L-80737', 'C0324329')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'66495005', 'SCT', 'Cavalier King Charles spaniel', 'L-80738', 'C0324330')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'28751008', 'SCT', 'Chow Chow', 'L-80744', 'C0324335')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'19078005', 'SCT', 'Collie', 'L-80750', 'C0324336')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'73319009', 'SCT', 'Coonhound', 'L-80760', 'C0324341')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'5916008', 'SCT', 'Dalmatian dog', 'L-80777', 'C0324355')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'3347005', 'SCT', 'Dandie dinmont terrier', 'L-80778', 'C0324356')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'47075006', 'SCT', 'Doberman pinscher', 'L-80780', 'C0324358')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'56984005', 'SCT', 'Drever dog', 'L-80781', 'C0324359')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'59975009', 'SCT', 'English foxhound', 'L-807A5', 'C0324370')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'67088002', 'SCT', 'English toy spaniel', 'L-80782', 'C0324360')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'89450005', 'SCT', 'Eskimo dog', 'L-80790', 'C0324361')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'83504004', 'SCT', 'Finnish spitz dog', 'L-80793', 'C0324364')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'90101001', 'SCT', 'Foxhound', 'L-807B0', 'C0324371')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'59643008', 'SCT', 'French bulldog', 'L-807B1', 'C0324372')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'42252000', 'SCT', 'German shepherd dog', 'L-807B2', 'C0324373')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'32670005', 'SCT', 'Great Pyrenee dog', 'L-807B4', 'C0324375')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'27615007', 'SCT', 'Great dane dog', 'L-807B3', 'C0324374')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'112494009', 'SCT', 'Greyhound', 'L-807B5', 'C0324376')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'55058007', 'SCT', 'Griffon dog', 'L-807C0', 'C0324377')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'76724004', 'SCT', 'Harrier dog', 'L-807C3', 'C0324380')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'25097001', 'SCT', 'Hound', 'L-80702', 'C0324295')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'10842007', 'SCT', 'Ibizan hound', 'L-807C4', 'C0324381')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'75494002', 'SCT', 'Irish terrier', 'L-807C6', 'C0324383')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'52952001', 'SCT', 'Irish wolfhound', 'L-807C5', 'C0324382')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'30347000', 'SCT', 'Italian greyhound', 'L-807C7', 'C0324384')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'6103004', 'SCT', 'Jack Russel terrier', 'L-807C8', 'C0324385')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'53922000', 'SCT', 'Japanese chin dog', 'L-807C9', 'C0324387')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'23159000', 'SCT', 'Japanese spaniel', 'L-807D0', 'C0324387')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'84660008', 'SCT', 'Karelian bear dog', 'L-807D1', 'C0324388')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'81607005', 'SCT', 'Keeshond', 'L-807D2', 'C0324389')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'32591006', 'SCT', 'Kerry blue terrier', 'L-807D3', 'C0324390')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'46239008', 'SCT', 'Komondor dog', 'L-807D4', 'C0324391')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'84548001', 'SCT', 'Kuvasz dog', 'L-807D5', 'C0324392')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'78214003', 'SCT', 'Lakeland terrier', 'L-807D6', 'C0324393')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'36438004', 'SCT', 'Lhasa apso', 'L-807D7', 'C0324394')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'39348004', 'SCT', 'Maltese dog', 'L-807D8', 'C0324395')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'48524002', 'SCT', 'Mastiff dog', 'L-80803', 'C0324399')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'78246003', 'SCT', 'Mexican hairless dog', 'L-80804', 'C0324400')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'12131006', 'SCT', 'Miniature pinscher dog', 'L-80805', 'C0324401')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'52253003', 'SCT', 'Newfoundland dog', 'L-80806', 'C0324402')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'62790004', 'SCT', 'Norfolk terrier', 'L-80807', 'C0324403')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'76994004', 'SCT', 'Norwegian elkhound', 'L-80808', 'C0324404')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'26332008', 'SCT', 'Norwich terrier', 'L-80809', 'C0324405')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'87029004', 'SCT', 'Old English sheepdog', 'L-80810', 'C0324406')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'58116005', 'SCT', 'Otter hound', 'L-80811', 'C0324407')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'41263004', 'SCT', 'Papillon dog', 'L-80812', 'C0324408')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'67684001', 'SCT', 'Pekingese dog', 'L-80813', 'C0324409')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'47542005', 'SCT', 'Petit basset griffon vendeen dog', 'L-80814', 'C0324410')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'14876008', 'SCT', 'Pharaoh hound', 'L-80815', 'C0324411')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'40400008', 'SCT', 'Plott hound', 'L-80816', 'C0324412')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'73318001', 'SCT', 'Pointer', 'L-80820', 'C0324413')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'10040000', 'SCT', 'Pomeranian dog', 'L-80824', 'C0324417')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'63390008', 'SCT', 'Portuguese water dog', 'L-80834', 'C0324422')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'61286000', 'SCT', 'Pudelpointer', 'L-80835', 'C0324423')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'60252000', 'SCT', 'Pug dog', 'L-80836', 'C0324424')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'21039009', 'SCT', 'Puli dog', 'L-80837', 'C0324425')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'1974006', 'SCT', 'Retriever', 'L-80840', 'C0324426')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'74173000', 'SCT', 'Rhodesian ridgeback dog', 'L-80847', 'C0324433')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'14245006', 'SCT', 'Rottweiler dog', 'L-80848', 'C0324434')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'59528003', 'SCT', 'Saluki dog', 'L-80849', 'C0324435')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'69474004', 'SCT', 'Samoyed dog', 'L-80850', 'C0324436')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'21150005', 'SCT', 'Schipperke dog', 'L-80851', 'C0324437')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'54858000', 'SCT', 'Scottish deerhound', 'L-80779', 'C0324357')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'61405001', 'SCT', 'Scottish terrier', 'L-80864', 'C0324442')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'34752004', 'SCT', 'Sealyham terrier', 'L-80865', 'C0324443')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'37453003', 'SCT', 'Setter', 'L-80870', 'C0324444')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'50125003', 'SCT', 'Shetland sheepdog', 'L-80874', 'C0324448')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'31077009', 'SCT', 'Shih tzu dog', 'L-80875', 'C0324449')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'3674001', 'SCT', 'Siberian huskie', 'L-80876', 'C0324450')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'39882003', 'SCT', 'Silky terrier', 'L-80877', 'C0324451')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'24299002', 'SCT', 'Skye terrier', 'L-80878', 'C0324452')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'47699005', 'SCT', 'Soft-coated wheaten terrier', 'L-80879', 'C0324453')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'45625009', 'SCT', 'Spaniel', 'L-80880', 'C0324454')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'83236005', 'SCT', 'St. Bernard dog', 'L-80895', 'C0324469')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'9131007', 'SCT', 'Standard Manchester terrier', 'L-80801', 'C0324397')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'61320006', 'SCT', 'Tahltan bear dog', 'L-80896', 'C0324470')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'606003', 'SCT', 'Terrier', 'L-80703', 'C0324296')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'87219003', 'SCT', 'Tibetan spaniel', 'L-80897', 'C0324471')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'17663009', 'SCT', 'Tibetan terrier', 'L-80898', 'C0324472')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'13942005', 'SCT', 'Toy Manchester terrier', 'L-80802', 'C0324398')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'69249004', 'SCT', 'Weimaraner', 'L-80903', 'C0324476')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'49421002', 'SCT', 'Welsh terrier', 'L-80904', 'C0324477')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'40727008', 'SCT', 'West Highland white terrier', 'L-80913', 'C0324481')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'76351004', 'SCT', 'Whippet dog', 'L-80914', 'C0324482')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'33401005', 'SCT', 'Wirehaired pointing griffon dog', 'L-807C2', 'C0324379')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'82676003', 'SCT', 'Wolf', 'L-88120', 'C0325001')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'13284009', 'SCT', 'Yorkshire terrier', 'L-80915', 'C0324483')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'12390000', 'SCT', 'American pit bull terrier dog breed', 'L-80731', 'C0324323')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'86593006', 'SCT', 'Colored bull terrier dog breed', 'L-80732', 'C0324324')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'83216009', 'SCT', 'Staffordshire bull terrier dog breed', 'L-80733', 'C0324325')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'42902003', 'SCT', 'White bull terrier dog breed', 'L-80734', 'C0324326')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'9761009', 'SCT', 'Chihuahua superbreed dog breed', 'L-80740', 'C0324331')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'36611001', 'SCT', 'Long coat chihuahua dog breed', 'L-80741', 'C0324332')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'15966002', 'SCT', 'Short coat chihuahua dog breed', 'L-80742', 'C0324333')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'57349006', 'SCT', 'Long and short coat chihuahua dog breed', 'L-80743', 'C0324334')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'75911001', 'SCT', 'Bearded collie dog breed', 'L-80751', 'C0324337')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'31377001', 'SCT', 'Rough collie dog breed', 'L-80752', 'C0324338')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'58341007', 'SCT', 'Rough and smooth dog breed', 'L-80753', 'C0324339')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'10544000', 'SCT', 'Smooth collie dog breed', 'L-80754', 'C0324340')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'63269002', 'SCT', 'American coonhound dog breed', 'L-80761', 'C0324342')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'45561005', 'SCT', 'Black and tan coonhound dog breed', 'L-80762', 'C0324343')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'55959002', 'SCT', 'Blue tick coonhound dog breed', 'L-80763', 'C0324344')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'31281003', 'SCT', 'English coonhound dog breed', 'L-80764', 'C0324345')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'25171009', 'SCT', 'Redbone coonhound dog breed', 'L-80765', 'C0324346')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'57120006', 'SCT', 'Treeing walker coonhound dog breed', 'L-80766', 'C0324347')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'57429001', 'SCT', 'Longhaired miniature dachshund dog breed', 'L-80771', 'C0324349')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'112493003', 'SCT', 'Smooth miniature dachshund dog breed', 'L-80772', 'C0324350')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'56243001', 'SCT', 'Wirehaired miniature dachshund dog breed', 'L-80773', 'C0324351')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'59492009', 'SCT', 'Longhaired standard dachshund dog breed', 'L-80774', 'C0324352')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'69862006', 'SCT', 'Smooth standard dachshund dog breed', 'L-80775', 'C0324353')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'36274006', 'SCT', 'Wirehaired standard dachshund dog breed', 'L-80776', 'C0324354')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'132369002', 'SCT', 'Dachshund, Miniature dog breed', 'L-8077A', 'C1296662')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'416885007', 'SCT', 'Standard dachshund dog breed', 'L-8077B', 'C1562201')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'31392000', 'SCT', 'American eskimo dog breed', 'L-80791', 'C0324362')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'91553005', 'SCT', 'Canadian eskimo dog breed', 'L-80792', 'C0324363')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'35802007', 'SCT', 'Fox terrier superbreed dog breed', 'L-807A0', 'C0324365')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'8351009', 'SCT', 'Smooth fox terrier dog breed', 'L-807A1', 'C0324366')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'41584008', 'SCT', 'Wire fox terrier dog breed', 'L-807A2', 'C0324367')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'26639007', 'SCT', 'Toy fox terrier dog breed', 'L-807A3', 'C0324368')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'5306005', 'SCT', 'Manchester terrier superbreed dog breed', 'L-80800', 'C0324396')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'1420005', 'SCT', 'German longhaired pointer dog breed', 'L-80821', 'C0324414')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'86767001', 'SCT', 'German shorthaired pointer dog breed', 'L-80822', 'C0324415')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'25264009', 'SCT', 'German wirehaired pointer dog breed', 'L-80823', 'C0324416')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'15171008', 'SCT', 'Poodle superbreed dog breed', 'L-80830', 'C0324418')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'25243005', 'SCT', 'Toy poodle dog breed', 'L-80831', 'C0324419')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'40121001', 'SCT', 'Miniature poodle dog breed', 'L-80832', 'C0324420')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'507002', 'SCT', 'Standard poodle dog breed', 'L-80833', 'C0324421')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'13248002', 'SCT', 'Chesapeake Bay retriever dog breed', 'L-80841', 'C0324427')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'38449002', 'SCT', 'Curly-coated retriever dog breed', 'L-80842', 'C0324428')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'9528004', 'SCT', 'Flat-coated retriever dog breed', 'L-80843', 'C0324429')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'58108001', 'SCT', 'Golden retriever dog breed', 'L-80844', 'C0324430')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'62137007', 'SCT', 'Labrador retriever dog breed', 'L-80845', 'C0324431')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'26229008', 'SCT', 'Nova Scotia duck tolling retriever dog breed', 'L-80846', 'C0324432')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'91429002', 'SCT', 'Schnauzer superbreed dog breed', 'L-80860', 'C0324438')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'300004', 'SCT', 'Miniature schnauzer dog breed', 'L-80861', 'C0324439')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'57947002', 'SCT', 'Giant schnauzer dog breed', 'L-80862', 'C0324440')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'69592005', 'SCT', 'Standard schnauzer dog breed', 'L-80863', 'C0324441')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'84367001', 'SCT', 'English setter dog breed', 'L-80871', 'C0324445')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'57849000', 'SCT', 'Gordon setter dog breed', 'L-80872', 'C0324446')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'11477006', 'SCT', 'Irish setter dog breed', 'L-80873', 'C0324447')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'31971008', 'SCT', 'American water spaniel dog breed', 'L-80881', 'C0324455')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'12091005', 'SCT', 'Brittany spaniel dog breed', 'L-80882', 'C0324456')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'67977006', 'SCT', 'Clumber spaniel dog breed', 'L-80883', 'C0324457')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'22697009', 'SCT', 'American cocker spaniel dog breed', 'L-80884', 'C0324458')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'82206008', 'SCT', 'Black cocker spaniel dog breed', 'L-80885', 'C0324459')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'30565000', 'SCT', 'A.S.C.O.B. cocker spaniel dog breed', 'L-80886', 'C0324460')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'58888001', 'SCT', 'Parti-color cocker spaniel dog breed', 'L-80887', 'C0324461')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'62228004', 'SCT', 'English Springer spaniel dog breed', 'L-80888', 'C0324462')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'27385008', 'SCT', 'Field spaniel dog breed', 'L-80889', 'C0324463')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'34870009', 'SCT', 'Irish water spaniel dog breed', 'L-80891', 'C0324465')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'80576000', 'SCT', 'Sussex spaniel dog breed', 'L-80892', 'C0324466')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'40898002', 'SCT', 'Welsh Springer spaniel dog breed', 'L-80893', 'C0324467')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'21418008', 'SCT', 'English cocker spaniel dog breed', 'L-80894', 'C0324468')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'52105008', 'SCT', 'Vizsla superbreed dog breed', 'L-80900', 'C0324473')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'90444005', 'SCT', 'Smooth haired vizsla dog breed', 'L-80901', 'C0324474')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'583000', 'SCT', 'Wirehaired vizsla dog breed', 'L-80902', 'C0324475')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'37024005', 'SCT', 'Welsh corgi superbreed dog breed', 'L-80910', 'C0324478')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'60517007', 'SCT', 'Cardigan Welsh corgi dog breed', 'L-80911', 'C0324479')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'46725009', 'SCT', 'Pembroke Welsh corgi dog breed', 'L-80912', 'C0324480')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'406725008', 'SCT', 'Alaskan Klee Kai dog breed', 'L-88106', 'C1318889')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'409926004', 'SCT', 'Anatolian shepherd dog breed', 'L-88107', 'C1444156')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'416840006', 'SCT', 'Boerboel dog breed', 'L-88108', 'C1562437')`
        );
        queryString.push(
          `${queryInsertBreed} (1,'426571006', 'SCT', 'Victorian Bulldogge dog breed', 'L-8810A', 'C1960598')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132653001', 'SCT', 'Mixed breed cat', 'L-80A74', 'C1269327')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132650003', 'SCT', 'Harlequin cat breed', 'L-80A70', 'C1269326')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132651004', 'SCT', 'Manxamese cat breed', 'L-80A71', 'C1296910')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132652006', 'SCT', 'Maltese cat breed', 'L-80A73', 'C1296911')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132654007', 'SCT', 'Ragdoll cat breed', 'L-80A75', 'C1296912')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132655008', 'SCT', 'Turkish van cat breed', 'L-80A76', 'C1269328')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132656009', 'SCT', 'British Blue cat breed', 'L-80A77', 'C1269329')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132657000', 'SCT', 'American Bobtail Shorthair cat breed', 'L-80A78', 'C1296913')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132658005', 'SCT', 'American Bobtail Longhair cat breed', 'L-80A79', 'C1296914')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132659002', 'SCT', 'American Curl cat breed', 'L-80A80', 'C1269330')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132660007', 'SCT', 'Australian Mist cat breed', 'L-80A81', 'C1269331')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132661006', 'SCT', 'Bengal cat breed', 'L-80A83', 'C1296915')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132662004', 'SCT', 'Brazilian Shorthair cat breed', 'L-80A84', 'C1296916')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132663009', 'SCT', 'California Spangled cat breed', 'L-80A85', 'C1269332')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132664003', 'SCT', 'Chantilly/Tiffany cat breed', 'L-80A86', 'C1296917')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132665002', 'SCT', 'Shorthair cat breed', 'L-80A87', 'C1296918')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132666001', 'SCT', 'German Rex cat breed', 'L-80A88', 'C1269333')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132667005', 'SCT', 'LaPerm Shorthair cat breed', 'L-80A89', 'C1296919')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132668000', 'SCT', 'LaPerm Longhair cat breed', 'L-80A90', 'C1296920')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132669008', 'SCT', 'Munchkin Shorthair cat breed', 'L-80A91', 'C1296921')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132670009', 'SCT', 'Munchkin Longhair cat breed', 'L-80A92', 'C1296922')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132671008', 'SCT', 'Nebelung cat breed', 'L-80A93', 'C1296923')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132672001', 'SCT', 'Norwegian Forest cat breed', 'L-80A94', 'C1269334')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132673006', 'SCT', 'Oriental Longhair cat breed', 'L-80A95', 'C1296924')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132675004', 'SCT', 'Ragamuffin cat breed', 'L-80A97', 'C1296926')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132676003', 'SCT', 'Selkirk Rex cat breed', 'L-80A99', 'C1296927')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132677007', 'SCT', 'Siberian cat breed', 'L-80AA1', 'C1296928')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132678002', 'SCT', 'Snowshoe cat breed', 'L-80AA2', 'C1269335')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132679005', 'SCT', 'Sokoke cat breed', 'L-80AA3', 'C1296929')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132680008', 'SCT', 'Sphynx cat breed', 'L-80AA4', 'C1269336')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'1809004', 'SCT', 'Rex cat breed', 'L-80A40', 'C0324505')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'51692004', 'SCT', 'Devon rex cat breed', 'L-80A42', 'C0324507')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'56917006', 'SCT', 'Cornish rex cat breed', 'L-80A41', 'C0324506')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'396505009', 'SCT', 'Oregon rex cat breed', 'L-80A45', 'C1300782')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'36074003', 'SCT', 'Abyssinian cat', 'L-80A05', 'C0324484')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'69855002', 'SCT', 'American shorthair cat', 'L-80A06', 'C0324485')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'21726001', 'SCT', 'American wirehaired cat', 'L-80A07', 'C0324486')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'3653002', 'SCT', 'Balinese cat', 'L-80A08', 'C0324487')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'43219001', 'SCT', 'Birman cat', 'L-80A09', 'C0324488')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'16528000', 'SCT', 'Bombay cat', 'L-80A10', 'C0324489')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'70653001', 'SCT', 'British shorthaired cat', 'L-80A11', 'C0324490')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'89065000', 'SCT', 'Burmese cat', 'L-80A12', 'C0324491')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'43529009', 'SCT', 'Chartreux cat', 'L-80A13', 'C0324492')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'61753003', 'SCT', 'Colourpoint shorthaired cat', 'L-80A51', 'C0324511')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'73271003', 'SCT', 'Domestic leopard cat', 'L-80A19', 'C0324498')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'8419007', 'SCT', 'Domestic longhaired cat', 'L-80A20', 'C0324499')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'409914009', 'SCT', 'Domestic medium-haired cat', 'L-8880B', 'C1455846')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'15020009', 'SCT', 'Domestic shorthaired cat', 'L-80A52', 'C0324512')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'21637005', 'SCT', 'Egyptian mau cat', 'L-80A14', 'C0324493')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'26057009', 'SCT', 'Exotic shorthaired cat', 'L-80A53', 'C0324513')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'3354004', 'SCT', 'Havana brown cat', 'L-80A15', 'C0324494')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'26382003', 'SCT', 'Japanese bobtail cat', 'L-80A16', 'C0324495')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'10701001', 'SCT', 'Javanese cat', 'L-80A17', 'C0324496')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'27125003', 'SCT', 'Korat cat', 'L-80A18', 'C0324497')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'40547002', 'SCT', 'Longhaired manx', 'L-80A31', 'C0324502')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'81866001', 'SCT', 'Maine coon cat', 'L-80A21', 'C0324500')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'3995008', 'SCT', 'Manx', 'L-80A30', 'C0324501')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'63972001', 'SCT', 'Ocicat', 'L-80A32', 'C0324503')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'24967003', 'SCT', 'Oriental shorthaired cat', 'L-80A54', 'C0324514')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'68086001', 'SCT', 'Persian cat', 'L-80A33', 'C0324504')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'84797007', 'SCT', 'Russian blue cat', 'L-80A43', 'C0324508')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'73049001', 'SCT', 'Scottish fold cat', 'L-80A44', 'C0324509')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'132665002', 'SCT', 'Shorthaired cat', 'L-80A87', 'C1296918')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'65694005', 'SCT', 'Siamese cat', 'L-80A55', 'C0324515')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'10136006', 'SCT', 'Singapura cat', 'L-80A56', 'C0324516')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'4042003', 'SCT', 'Somali cat', 'L-80A57', 'C0324517')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'44855006', 'SCT', 'Tonkinese cat', 'L-80A58', 'C0324518')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'50441005', 'SCT', 'Turkish angora cat', 'L-80A59', 'C0324519')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'413488005', 'SCT', 'American bobtail cat breed', 'L-8880C', 'C1531503')`
        );
        queryString.push(
          `${queryInsertBreed} (2,'417277001', 'SCT', 'Pixie-bob cat breed', 'L-8880D', 'C1563194')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'406721004', 'SCT', 'Mixed breed horse', 'L-8A10F', 'C1320156')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131804001', 'SCT', 'Colombian Criollo horse breed', 'L-8040A', 'C1296224')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131805000', 'SCT', 'Comtois horse breed', 'L-8040B', 'C1296225')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131806004', 'SCT', 'Corsican horse breed', 'L-8040C', 'C1296226')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131807008', 'SCT', 'Costa Rican Saddle Horse horse breed', 'L-8040D', 'C1296227')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131808003', 'SCT', 'Costeno horse breed', 'L-8040E', 'C1296228')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131809006', 'SCT', 'Cuban Paso horse breed', 'L-8040F', 'C1296229')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131819000', 'SCT', 'Danish Warmblood horse breed', 'L-8042D', 'C1296239')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131861006', 'SCT', 'Hucul horse breed', 'L-80470', 'C1296279')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131862004', 'SCT', 'AraAppaloosa horse breed', 'L-80471', 'C1296280')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131863009', 'SCT', 'Argentine Criollo horse breed', 'L-80472', 'C1296281')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131864003', 'SCT', 'Argentine Polo Pony horse breed', 'L-80473', 'C1296282')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131865002', 'SCT', 'Australian Pony horse breed', 'L-80474', 'C1296283')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131866001', 'SCT', 'Auxois horse breed', 'L-80475', 'C1296284')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131867005', 'SCT', 'Avelignese horse breed', 'L-80476', 'C1296285')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131868000', 'SCT', 'Azerbaijan horse breed', 'L-80477', 'C1296286')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131869008', 'SCT', 'Azores horse breed', 'L-80478', 'C1296287')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131870009', 'SCT', 'Bali horse breed', 'L-80479', 'C1296288')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131871008', 'SCT', 'Balikun horse breed', 'L-8047A', 'C1296289')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131872001', 'SCT', 'Waziri horse breed', 'L-8047B', 'C1296290')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131873006', 'SCT', 'Banker Horse horse breed', 'L-8047C', 'C1296291')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131874000', 'SCT', 'Bardigiano horse breed', 'L-8047D', 'C1296292')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131875004', 'SCT', 'Batak horse breed', 'L-8047E', 'C1296293')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131876003', 'SCT', 'Bavarian Warmblood horse breed', 'L-8047F', 'C1296294')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131877007', 'SCT', 'Belgian Ardennais horse breed', 'L-80480', 'C1296295')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131878002', 'SCT', 'Belgian Halfblood horse breed', 'L-80481', 'C1296296')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131879005', 'SCT', 'Belgian Warmblood horse breed', 'L-80482', 'C1296297')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131880008', 'SCT', 'Bhutia horse breed', 'L-80483', 'C1296298')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131881007', 'SCT', 'Black Sea Horse horse breed', 'L-80484', 'C1296299')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131882000', 'SCT', 'Bosnian horse breed', 'L-80485', 'C1296300')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131883005', 'SCT', 'Boulonnais horse breed', 'L-80486', 'C1296301')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131884004', 'SCT', 'Brandenburg horse breed', 'L-80487', 'C1296302')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131885003', 'SCT', 'Brazilian Sport Horse horse breed', 'L-80488', 'C1296303')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131886002', 'SCT', 'British Appaloosa horse breed', 'L-80489', 'C1296304')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131887006', 'SCT', 'British Riding Pony horse breed', 'L-8048A', 'C1296305')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131888001', 'SCT', 'British Spotted Pony horse breed', 'L-8048B', 'C1296306')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131889009', 'SCT', 'Buohai horse breed', 'L-8048C', 'C1296307')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131890000', 'SCT', 'Buryat horse breed', 'L-8048D', 'C1296308')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131891001', 'SCT', 'Calabrian horse breed', 'L-8048E', 'C1296309')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131892008', 'SCT', 'Camargue horse breed', 'L-8048F', 'C1320152')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131893003', 'SCT', 'Canadian Cutting Horse horse breed', 'L-80490', 'C1296310')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131894009', 'SCT', 'Canadian Rustic Pony horse breed', 'L-80491', 'C1296311')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131895005', 'SCT', 'Canadian Sport Horse horse breed', 'L-80492', 'C1296312')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131896006', 'SCT', 'Canik horse breed', 'L-80493', 'C1296313')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131897002', 'SCT', 'Cape Horse horse breed', 'L-80494', 'C1296314')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131898007', 'SCT', 'Cerbat horse breed', 'L-80496', 'C1296315')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131899004', 'SCT', 'Chakouyi horse breed', 'L-80497', 'C1296316')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131900009', 'SCT', 'Chara Horse horse breed', 'L-80498', 'C1296317')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131901008', 'SCT', 'Chickasaw horse breed', 'L-80499', 'C1296318')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131902001', 'SCT', 'Chilote horse breed', 'L-8049A', 'C1296319')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131903006', 'SCT', 'Chinese Kazakh horse breed', 'L-8049B', 'C1296320')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131904000', 'SCT', 'Chinese Mongolian horse breed', 'L-8049C', 'C1296321')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131905004', 'SCT', 'Chumbivilcas horse breed', 'L-8049D', 'C1296322')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131906003', 'SCT', 'Chumysh horse breed', 'L-8049E', 'C1296323')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131907007', 'SCT', 'Cirit horse breed', 'L-8049F', 'C1296324')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131908002', 'SCT', 'Irish Draft horse breed', 'L-804A1', 'C1296325')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131909005', 'SCT', 'Irish Hunter horse breed', 'L-804A2', 'C1296326')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131910000', 'SCT', 'Cuban Trotter horse breed', 'L-804A3', 'C1296327')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131911001', 'SCT', 'Italian Heavy Draft horse breed', 'L-804A4', 'C1296328')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131912008', 'SCT', 'Jabe horse breed', 'L-804A5', 'C1296329')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131913003', 'SCT', 'Java horse breed', 'L-804A6', 'C1296330')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131915005', 'SCT', 'Czech Warmblood horse breed', 'L-804A8', 'C1296331')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131916006', 'SCT', 'Jinhong horse breed', 'L-804A9', 'C1296332')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131917002', 'SCT', 'Jinzhou horse breed', 'L-804AA', 'C1296333')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131919004', 'SCT', 'Danubian horse breed', 'L-804AC', 'C1296335')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131920005', 'SCT', 'Karachai horse breed', 'L-804AD', 'C1296336')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131921009', 'SCT', 'Karakacan horse breed', 'L-804AE', 'C1296337')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131922002', 'SCT', 'Kathiawari horse breed', 'L-804AF', 'C1296338')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131923007', 'SCT', 'Ke-Er-Qin horse breed', 'L-804B1', 'C1296339')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131924001', 'SCT', 'Kirgiz horse breed', 'L-804B2', 'C1296340')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131925000', 'SCT', 'Kuznet horse breed', 'L-804B3', 'C1296341')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131926004', 'SCT', 'Landais horse breed', 'L-804B4', 'C1296342')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131927008', 'SCT', 'Lewitzer horse breed', 'L-804B5', 'C1296343')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131928003', 'SCT', 'Lichuan horse breed', 'L-804B6', 'C1296344')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131929006', 'SCT', 'Lijiang horse breed', 'L-804B7', 'C1296345')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131930001', 'SCT', 'Llanero horse breed', 'L-804B8', 'C1296346')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131931002', 'SCT', 'Lombok horse breed', 'L-804B9', 'C1296347')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131932009', 'SCT', 'Lundy Pony horse breed', 'L-804BA', 'C1296348')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131933004', 'SCT', 'Malakan horse breed', 'L-804BB', 'C1296349')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131934005', 'SCT', 'Malopolski horse breed', 'L-804BC', 'C1296350')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131935006', 'SCT', 'Datong horse breed', 'L-804BD', 'C1296351')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131936007', 'SCT', 'Mangalarga Paulista horse breed', 'L-804BE', 'C1296352')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131937003', 'SCT', 'Dulmen Pony horse breed', 'L-804BF', 'C1296353')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131938008', 'SCT', 'Maremmana horse breed', 'L-804C1', 'C1296354')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131939000', 'SCT', 'Marwari horse breed', 'L-804C2', 'C1296355')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131940003', 'SCT', 'Megezh horse breed', 'L-804C3', 'C1296356')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131941004', 'SCT', 'Megrel horse breed', 'L-804C4', 'C1296357')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131942006', 'SCT', 'Merens horse breed', 'L-804C5', 'C1296358')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131943001', 'SCT', 'Messara horse breed', 'L-804C6', 'C1296359')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131944007', 'SCT', 'Sumba horse breed', 'L-804C7', 'C1296360')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131945008', 'SCT', 'Sumbawa horse breed', 'L-804C8', 'C1296361')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131946009', 'SCT', 'Swedish Ardennes horse breed', 'L-804C9', 'C1296362')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131947000', 'SCT', 'Dutch Tuigpaard horse breed', 'L-804CA', 'C1296363')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131948005', 'SCT', 'East and Southeast Anadolu horse breed', 'L-804CB', 'C1296364')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131949002', 'SCT', 'Thai Pony horse breed', 'L-804CC', 'C1296365')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131950002', 'SCT', 'Thessalonian horse breed', 'L-804CD', 'C1296366')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131951003', 'SCT', 'Tibetan horse breed', 'L-804CE', 'C1296367')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131952005', 'SCT', 'Tieling horse breed', 'L-804CF', 'C1296368')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131953000', 'SCT', 'Timor horse breed', 'L-804D1', 'C1296369')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131954006', 'SCT', 'Trakya horse breed', 'L-804D2', 'C1296370')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131955007', 'SCT', 'Trote en Gallope horse breed', 'L-804D3', 'C1296371')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131956008', 'SCT', 'Turkoman horse breed', 'L-804D4', 'C1296372')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131957004', 'SCT', 'Tushin horse breed', 'L-804D5', 'C1296373')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131958009', 'SCT', 'Tuva horse breed', 'L-804D6', 'C1296374')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131959001', 'SCT', 'Uzunyayla horse breed', 'L-804D7', 'C1296375')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131960006', 'SCT', 'Voronezh Coach Horse horse breed', 'L-804D9', 'C1296376')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131961005', 'SCT', 'Elegant Warmblood horse breed', 'L-804DA', 'C1296377')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131962003', 'SCT', 'Welsh Cob horse breed', 'L-804DB', 'C1296378')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131963008', 'SCT', 'Welsh Mountain Pony horse breed', 'L-804DC', 'C1296379')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131964002', 'SCT', 'English Hack horse breed', 'L-804DE', 'C1296380')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131965001', 'SCT', 'Wurttemberg horse breed', 'L-804DF', 'C1296381')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131966000', 'SCT', 'Xilingol horse breed', 'L-804E1', 'C1296382')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131967009', 'SCT', 'Yanqi horse breed', 'L-804E2', 'C1296383')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131968004', 'SCT', 'Yemeni Horses horse breed', 'L-804E3', 'C1296384')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131969007', 'SCT', 'Yili horse breed', 'L-804E4', 'C1296385')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131970008', 'SCT', 'Yiwu horse breed', 'L-804E5', 'C1296386')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131971007', 'SCT', 'Yunnan horse breed', 'L-804E6', 'C1296387')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131972000', 'SCT', 'German Riding Pony horse breed', 'L-804E7', 'C1296388')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131973005', 'SCT', 'Guanzhong horse breed', 'L-804E8', 'C1296389')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131974004', 'SCT', 'Guizhou horse breed', 'L-804E9', 'C1296390')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131975003', 'SCT', 'Guoxia horse breed', 'L-804EA', 'C1296391')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131976002', 'SCT', 'Erlunchun horse breed', 'L-804EB', 'C1296392')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131977006', 'SCT', 'Half Saddlebred horse breed', 'L-804EC', 'C1296393')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131978001', 'SCT', 'Flores horse breed', 'L-804ED', 'C1296394')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131979009', 'SCT', 'Freiberg horse breed', 'L-804EE', 'C1296395')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131980007', 'SCT', 'Hessen horse breed', 'L-804EF', 'C1296396')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131981006', 'SCT', 'Hinis horse breed', 'L-804F1', 'C1296397')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131982004', 'SCT', 'Hirzai horse breed', 'L-804F2', 'C1296398')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131983009', 'SCT', 'Hungairan Coldblood horse breed', 'L-804F3', 'C1296399')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131984003', 'SCT', 'Hungarian Dun horse breed', 'L-804F4', 'C1296400')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131985002', 'SCT', 'Hungarian Sport Horse horse breed', 'L-804F5', 'C1296401')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131986001', 'SCT', 'International Striped Horse horse breed', 'L-804F6', 'C1296402')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131987005', 'SCT', 'Irish Cob horse breed', 'L-804F7', 'C1296403')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131988000', 'SCT', 'Mezen horse breed', 'L-804F8', 'C1296404')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131989008', 'SCT', 'Mezohegyes Sport Horse horse breed', 'L-804F9', 'C1296405')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131990004', 'SCT', 'French Cob horse breed', 'L-804FA', 'C1296406')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131991000', 'SCT', 'French Saddle pony horse breed', 'L-804FB', 'C1296407')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131992007', 'SCT', 'Murakoz horse breed', 'L-804FC', 'C1296408')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131993002', 'SCT', 'Finnhorse Draft horse breed', 'L-804FE', 'C1296409')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'131994008', 'SCT', 'Mecklenburg horse breed', 'L-804FF', 'C1296410')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132731005', 'SCT', 'Baden Wurttemburg horse breed', 'L-80B47', 'C1296962')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132732003', 'SCT', 'British Warmblood horse breed', 'L-80B48', 'C1296963')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132733008', 'SCT', 'Israeli horse breed', 'L-80B49', 'C1296964')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132734002', 'SCT', 'French Ardennais horse breed', 'L-80B4A', 'C1296965')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132736000', 'SCT', 'Cukurova horse breed', 'L-80B50', 'C1296967')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132737009', 'SCT', 'Czech Coldblood horse breed', 'L-80B51', 'C1296968')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132738004', 'SCT', 'Czechoslovakian Small Riding Horse horse breed', 'L-80B52', 'C1269353')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132739007', 'SCT', 'Jianchang horse breed', 'L-80B53', 'C1296969')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132740009', 'SCT', 'Jielin horse breed', 'L-80B54', 'C1296970')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132741008', 'SCT', 'Wielkopolski horse breed', 'L-80B55', 'C1296971')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132742001', 'SCT', 'Eleia horse breed', 'L-80B56', 'C1296972')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132743006', 'SCT', 'English Cob horse breed', 'L-80B57', 'C1269354')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132744000', 'SCT', 'Welsh Pony horse breed', 'L-80B58', 'C1296973')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132745004', 'SCT', 'Welsh Pony of Cob Type horse breed', 'L-80B59', 'C1269355')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132746003', 'SCT', 'English Hunter horse breed', 'L-80B5A', 'C1269356')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132747007', 'SCT', 'Eriskay Pony horse breed', 'L-80B5B', 'C1296974')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132748002', 'SCT', 'Hackney Pony horse breed', 'L-80B5C', 'C1296975')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132749005', 'SCT', 'Estonian Draft horse breed', 'L-80B5D', 'C1296976')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132750005', 'SCT', 'Heihe horse breed', 'L-80B5E', 'C1296977')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132751009', 'SCT', 'Heilongkaing horse breed', 'L-80B5F', 'C1296978')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132757008', 'SCT', 'Danish Sport Pony horse breed', 'L-80B65', 'C1269357')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132758003', 'SCT', 'Kabarda horse breed', 'L-80B66', 'C1296983')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132759006', 'SCT', 'Kalmyk horse breed', 'L-80B67', 'C1296984')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132760001', 'SCT', 'Mangalarga Marchador horse breed', 'L-80B68', 'C1296985')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132761002', 'SCT', 'Don horse breed', 'L-80B69', 'C1296986')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132762009', 'SCT', 'Manipuri horse breed', 'L-80B6A', 'C1296987')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132763004', 'SCT', 'Swiss Warmblood horse breed', 'L-80B6B', 'C1296988')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132764005', 'SCT', 'Tavda horse breed', 'L-80B6C', 'C1296989')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132765006', 'SCT', 'East Bulgarian horse breed', 'L-80B6D', 'C1269358')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132766007', 'SCT', 'East Friesian (Old Type) horse breed', 'L-80B6E', 'C1269359')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132767003', 'SCT', 'East Friesian Warmblood (Modern Type) horse breed', 'L-80B6F', 'C1269360')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132772007', 'SCT', 'Minusin horse breed', 'L-80B82', 'C1296992')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132773002', 'SCT', 'Morochuco horse breed', 'L-80B83', 'C1296993')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132774008', 'SCT', 'French Trotter horse breed', 'L-80B84', 'C1296994')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132775009', 'SCT', 'Furioso horse breed', 'L-80B85', 'C1296995')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132776005', 'SCT', 'Murghese horse breed', 'L-80B86', 'C1269363')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132777001', 'SCT', 'Mytilene horse breed', 'L-80B87', 'C1269364')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132778006', 'SCT', 'Namib Desert Horse horse breed', 'L-80B88', 'C1296996')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132779003', 'SCT', 'Danish Oldenborg horse breed', 'L-80B89', 'C1296997')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132951001', 'SCT', 'American Indian Horse horse breed', 'L-8A111', 'C1297111')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132952008', 'SCT', 'American Mustang horse breed', 'L-8A112', 'C1297112')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132953003', 'SCT', 'American Quarter Horse horse breed', 'L-8A113', 'C1297113')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132954009', 'SCT', 'American Shetland pony horse breed', 'L-8A115', 'C1297114')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132955005', 'SCT', 'Anadolu horse breed', 'L-8A116', 'C1297115')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132956006', 'SCT', 'Andean horse breed', 'L-8A117', 'C1297116')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132957002', 'SCT', 'Anglo-Kabarda horse breed', 'L-8A118', 'C1297117')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132960009', 'SCT', 'Narym horse breed', 'L-8A125', 'C1297120')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132961008', 'SCT', 'National Spotted Saddle Horse horse breed', 'L-8A126', 'C1297121')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132962001', 'SCT', 'Nigerian horse breed', 'L-8A127', 'C1297122')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132963006', 'SCT', 'North Swedish Trotter horse breed', 'L-8A128', 'C1297123')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132964000', 'SCT', 'Oriental Horse horse breed', 'L-8A129', 'C1297124')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132965004', 'SCT', 'Rhineland Heavy Draft horse breed', 'L-8A12A', 'C1297125')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132966003', 'SCT', 'Romanian Saddle Horse horse breed', 'L-8A12B', 'C1297126')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132967007', 'SCT', 'Rottal horse breed', 'L-8A12C', 'C1297127')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132968002', 'SCT', 'Royal Canadian Mounted Police Horse horse breed', 'L-8A12D', 'C1297128')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132969005', 'SCT', 'Russian Saddle Horse horse breed', 'L-8A12E', 'C1297129')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132970006', 'SCT', 'Sable Island Horse horse breed', 'L-8A12F', 'C1297130')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132971005', 'SCT', 'Panje horse breed', 'L-8A130', 'C1297131')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132972003', 'SCT', 'Patibarcina horse breed', 'L-8A131', 'C1297132')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132973008', 'SCT', 'Pechora horse breed', 'L-8A132', 'C1297133')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132974002', 'SCT', 'Peneia horse breed', 'L-8A133', 'C1297134')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132975001', 'SCT', 'Periangan horse breed', 'L-8A134', 'C1297135')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132976000', 'SCT', 'Persian Arab horse breed', 'L-8A135', 'C1297136')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132977009', 'SCT', 'Petiso Argentino horse breed', 'L-8A136', 'C1297137')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132978004', 'SCT', 'Polish Draft horse breed', 'L-8A137', 'C1297138')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132979007', 'SCT', 'Priob horse breed', 'L-8A138', 'C1297139')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132980005', 'SCT', 'Rahvan horse breed', 'L-8A139', 'C1297140')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132981009', 'SCT', 'Salerno horse breed', 'L-8A13A', 'C1297141')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132982002', 'SCT', 'Sandalwood horse breed', 'L-8A13B', 'C1297142')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132983007', 'SCT', 'Sandan horse breed', 'L-8A13C', 'C1297143')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132984001', 'SCT', 'Pindos horse breed', 'L-8A13D', 'C1297144')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132985000', 'SCT', 'Piquira Pony horse breed', 'L-8A13E', 'C1297145')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132986004', 'SCT', 'Pleven horse breed', 'L-8A13F', 'C1297146')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132990002', 'SCT', 'Garrano tarpan horse X domestic horse breed', 'L-8A14A', 'C1297150')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132991003', 'SCT', 'Konink tarpan horse X domestic horse breed', 'L-8A14B', 'C1297151')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132992005', 'SCT', 'Asturian tarpan horse X domestic horse breed', 'L-8A14C', 'C1297152')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132993000', 'SCT', 'Pottok tarpan horse X domestic horse breed', 'L-8A14D', 'C1297153')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132994006', 'SCT', 'Russian Trotter horse breed', 'L-8A150', 'C1297154')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132995007', 'SCT', 'West African Barb horse breed', 'L-8A151', 'C1297155')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132996008', 'SCT', 'Fell Pony horse breed', 'L-8A152', 'C1297156')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132997004', 'SCT', 'National Show Horse horse breed', 'L-8A153', 'C1297157')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132998009', 'SCT', 'Zhemaichu horse breed', 'L-8A154', 'C1297158')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'132999001', 'SCT', 'Yonaguni horse breed', 'L-8A155', 'C1297159')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133000000', 'SCT', 'Yakut horse breed', 'L-8A156', 'C1297160')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133001001', 'SCT', 'Tawleed horse breed', 'L-8A157', 'C1297161')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133002008', 'SCT', 'Western Sudan Pony horse breed', 'L-8A158', 'C1297162')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133003003', 'SCT', 'Welera Pony horse breed', 'L-8A159', 'C1297163')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133004009', 'SCT', 'Vyatka horse breed', 'L-8A15A', 'C1297164')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133005005', 'SCT', 'Vladimir Heavy Draft horse breed', 'L-8A15B', 'C1297165')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133006006', 'SCT', 'Vlaamperd horse breed', 'L-8A15C', 'C1297166')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133007002', 'SCT', 'Ukrainian Saddle Horse horse breed', 'L-8A15D', 'C1297167')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133008007', 'SCT', 'Tori horse breed', 'L-8A15E', 'C1297168')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133009004', 'SCT', 'Tokara horse breed', 'L-8A15F', 'C1297169')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133010009', 'SCT', 'New Kirgiz horse breed', 'L-8A160', 'C1297170')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133011008', 'SCT', 'Oldenburg horse breed', 'L-8A161', 'C1297171')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133012001', 'SCT', 'Misaki horse breed', 'L-8A162', 'C1297172')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133013006', 'SCT', 'Miyako horse breed', 'L-8A163', 'C1297173')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133014000', 'SCT', 'Mongolian horse breed', 'L-8A164', 'C1321685')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133015004', 'SCT', 'Waler horse breed', 'L-8A165', 'C1297174')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133016003', 'SCT', 'Dutch Draft horse breed', 'L-8A166', 'C1297175')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133017007', 'SCT', 'Egyptian horse breed', 'L-8A167', 'C1297176')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133018002', 'SCT', 'Estonian Native horse breed', 'L-8A168', 'C1297177')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133019005', 'SCT', 'Exmoor Pony horse breed', 'L-8A169', 'C1297178')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133020004', 'SCT', 'Faeroes Island Horse horse breed', 'L-8A16A', 'C1297179')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133021000', 'SCT', 'Falabella horse breed', 'L-8A16B', 'C1297180')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133022007', 'SCT', 'Dutch Warmblood horse breed', 'L-8A16C', 'C1297181')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133023002', 'SCT', 'Dongola horse breed', 'L-8A16D', 'C1297182')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133024008', 'SCT', 'Døle horse breed', 'L-8A16E', 'C1321476')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133025009', 'SCT', 'Djerma horse breed', 'L-8A16F', 'C1297183')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133026005', 'SCT', 'Deliboz horse breed', 'L-8A170', 'C1297184')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133027001', 'SCT', 'Dartmoor Pony horse breed', 'L-8A171', 'C1297185')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133028006', 'SCT', 'Crioulo horse breed', 'L-8A172', 'C1297186')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133029003', 'SCT', 'Finnhorse horse breed', 'L-8A173', 'C1297187')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133030008', 'SCT', 'Sanfratello horse breed', 'L-8A174', 'C1297188')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133031007', 'SCT', 'Morab horse breed', 'L-8A175', 'C1297189')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133032000', 'SCT', 'Moyle horse breed', 'L-8A176', 'C1297190')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133033005', 'SCT', 'Mustang horse breed', 'L-8A177', 'C1297191')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133034004', 'SCT', "M'Bayar horse breed", 'L-8A178', 'C1297192')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133035003', 'SCT', 'Lusitano horse breed', 'L-8A179', 'C1297193')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133036002', 'SCT', 'Newfoundland Pony horse breed', 'L-8A17A', 'C1297194')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133037006', 'SCT', 'Noma horse breed', 'L-8A17B', 'C1297195')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133038001', 'SCT', 'Nooitgedacht Pony horse breed', 'L-8A17C', 'C1297196')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133039009', 'SCT', 'Nordland horse breed', 'L-8A17D', 'C1297197')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133040006', 'SCT', 'Noric horse breed', 'L-8A17E', 'C1297198')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133041005', 'SCT', 'North Swedish Horse horse breed', 'L-8A17F', 'C1297199')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133042003', 'SCT', 'Northeastern horse breed', 'L-8A180', 'C1297200')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133043008', 'SCT', 'Kisber Felver horse breed', 'L-8A181', 'C1297201')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133044002', 'SCT', 'Anglo-Arab horse breed', 'L-8A182', 'C1297202')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133045001', 'SCT', 'Nonius horse breed', 'L-8A183', 'C1297203')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133046000', 'SCT', 'Nooitgedacht horse breed', 'L-8A184', 'C1297204')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133047009', 'SCT', 'Iomud horse breed', 'L-8A185', 'C1297205')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133048004', 'SCT', 'Jutland horse breed', 'L-8A186', 'C1297206')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133049007', 'SCT', 'Karabair horse breed', 'L-8A187', 'C1297207')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133050007', 'SCT', 'Karabakh horse breed', 'L-8A188', 'C1297208')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133051006', 'SCT', 'Kazakh horse breed', 'L-8A189', 'C1297209')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133052004', 'SCT', 'Mangalarga horse breed', 'L-8A18A', 'C1297210')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133053009', 'SCT', 'Kirdi Pony horse breed', 'L-8A18B', 'C1297211')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133054003', 'SCT', 'Kiso horse breed', 'L-8A18C', 'C1297212')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133055002', 'SCT', 'Kladruby horse breed', 'L-8A18D', 'C1297213')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133056001', 'SCT', 'Knabstrup horse breed', 'L-8A18E', 'C1297214')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133057005', 'SCT', 'Kushum horse breed', 'L-8A18F', 'C1297215')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133058000', 'SCT', 'Kustanai horse breed', 'L-8A190', 'C1297216')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133059008', 'SCT', 'Latvian horse breed', 'L-8A191', 'C1297217')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133060003', 'SCT', 'Lithuanian Heavy Draft horse breed', 'L-8A192', 'C1297218')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133061004', 'SCT', 'Lokai horse breed', 'L-8A193', 'C1297219')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133062006', 'SCT', 'Kiger Mustang horse breed', 'L-8A194', 'C1297220')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133063001', 'SCT', 'Pony of the Americas horse breed', 'L-8A195', 'C1297221')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133064007', 'SCT', 'Pintabian horse breed', 'L-8A196', 'C1297222')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133065008', 'SCT', 'Pantaneiro horse breed', 'L-8A197', 'C1297223')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133066009', 'SCT', 'Orlov Trotter horse breed', 'L-8A198', 'C1297224')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133067000', 'SCT', 'Northern Ardennais horse breed', 'L-8A199', 'C1297225')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133068005', 'SCT', 'Abtenauer horse breed', 'L-8A19A', 'C1297226')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133069002', 'SCT', 'Adaev horse breed', 'L-8A19B', 'C1297227')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133070001', 'SCT', 'Albanian horse breed', 'L-8A19C', 'C1297228')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133071002', 'SCT', 'Alter Real horse breed', 'L-8A19E', 'C1297229')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133072009', 'SCT', 'American Bashkir Curly horse breed', 'L-8A19F', 'C1297230')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133073004', 'SCT', 'Poitou Mule Producer horse breed', 'L-8A1A1', 'C1297231')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133074005', 'SCT', 'Polesian horse breed', 'L-8A1A2', 'C1297232')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133075006', 'SCT', 'Sardinian Anglo-Arab horse breed', 'L-8A1A3', 'C1297233')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133076007', 'SCT', 'Sardinian Pony horse breed', 'L-8A1A4', 'C1297234')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133077003', 'SCT', 'Sarvar horse breed', 'L-8A1A5', 'C1297235')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133078008', 'SCT', 'Schleswig horse breed', 'L-8A1A6', 'C1297236')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133079000', 'SCT', 'Schwarzwalder Fuchse horse breed', 'L-8A1A7', 'C1297237')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133080002', 'SCT', 'Senne horse breed', 'L-8A1A8', 'C1297238')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133081003', 'SCT', 'Shan horse breed', 'L-8A1A9', 'C1297239')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133082005', 'SCT', 'Silesian horse breed', 'L-8A1AA', 'C1297240')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133083000', 'SCT', 'Sini horse breed', 'L-8A1AB', 'C1297241')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133084006', 'SCT', 'Skyros horse breed', 'L-8A1AC', 'C1297242')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133085007', 'SCT', 'Slovak Warmblood horse breed', 'L-8A1AD', 'C1297243')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133086008', 'SCT', 'Sokolka horse breed', 'L-8A1AE', 'C1297244')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133087004', 'SCT', 'South African Miniature horse breed', 'L-8A1AF', 'C1297245')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133088009', 'SCT', 'South German Coldblood horse breed', 'L-8A1B1', 'C1297246')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133089001', 'SCT', 'Southwest Spanish Mustang horse breed', 'L-8A1B2', 'C1297247')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133090005', 'SCT', 'Spanish-American Horse horse breed', 'L-8A1B4', 'C1297248')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133091009', 'SCT', 'Spanish Anglo-Arab horse breed', 'L-8A1B5', 'C1297249')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133092002', 'SCT', 'Spanish Colonial Horse horse breed', 'L-8A1B6', 'C1297250')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133093007', 'SCT', 'Spiti horse breed', 'L-8A1B7', 'C1297251')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133094001', 'SCT', 'Sulawesi horse breed', 'L-8A1B8', 'C1297252')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133095000', 'SCT', 'Criollo horse breed', 'L-8A1B9', 'C1297253')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133096004', 'SCT', 'Hequ horse breed', 'L-8A1BA', 'C1297254')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133097008', 'SCT', 'Connemara Pony horse breed', 'L-8A1BB', 'C1297255')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133098003', 'SCT', 'Colorado Ranger horse breed', 'L-8A1BC', 'C1297256')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133099006', 'SCT', 'Dales Pony horse breed', 'L-8A1BD', 'C1297257')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133100003', 'SCT', 'Gotland horse breed', 'L-8A1BE', 'C1297258')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133101004', 'SCT', 'Chincoteague Pony horse breed', 'L-8A1BF', 'C1297259')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133102006', 'SCT', 'Hokkaido horse breed', 'L-8A1C1', 'C1297260')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133103001', 'SCT', 'Highland Pony horse breed', 'L-8A1C2', 'C1297261')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133104007', 'SCT', 'Groningen horse breed', 'L-8A1C3', 'C1297262')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133105008', 'SCT', 'Cuban Pinto horse breed', 'L-8A1C4', 'C1297263')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133106009', 'SCT', 'Fleuve horse breed', 'L-8A1C5', 'C1297264')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133107000', 'SCT', 'Golden American Saddlebred horse breed', 'L-8A1C6', 'C1297265')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133108005', 'SCT', 'Gidran horse breed', 'L-8A1C7', 'C1297266')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133109002', 'SCT', 'Gelderland horse breed', 'L-8A1C8', 'C1320153')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133110007', 'SCT', 'Galician Pony horse breed', 'L-8A1C9', 'C1297267')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133111006', 'SCT', 'Friesian horse breed', 'L-8A1CA', 'C1297268')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133112004', 'SCT', 'Frederiksborg horse breed', 'L-8A1CB', 'C1297269')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133113009', 'SCT', 'Fouta horse breed', 'L-8A1CC', 'C1297270')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133114003', 'SCT', 'Florida Cracker horse breed', 'L-8A1CD', 'C1297271')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133115002', 'SCT', 'Guangxi horse breed', 'L-8A1CE', 'C1297272')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133116001', 'SCT', 'Ardennes horse breed', 'L-8A1CF', 'C1297273')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133117005', 'SCT', 'American Walking Pony horse breed', 'L-8A1D1', 'C1297274')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133118000', 'SCT', 'Azteca horse breed', 'L-8A1D2', 'C1297275')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133119008', 'SCT', 'American Cream Draft horse breed', 'L-8A1D3', 'C1297276')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133120002', 'SCT', 'Altai horse breed', 'L-8A1D4', 'C1297277')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133121003', 'SCT', 'Akhal-Teke horse breed', 'L-8A1D5', 'C1297278')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133122005', 'SCT', 'Abyssinian horse breed', 'L-8A1D6', 'C1297279')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133123000', 'SCT', 'Bhirum Pony horse breed', 'L-8A1D7', 'C1297280')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133124006', 'SCT', 'Cheju horse breed', 'L-8A1D8', 'C1297281')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133125007', 'SCT', 'Cayuse horse breed', 'L-8A1D9', 'C1297282')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133126008', 'SCT', 'Caspian horse breed', 'L-8A1DA', 'C1297283')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133127004', 'SCT', 'Carthusian horse breed', 'L-8A1DB', 'C1297284')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133128009', 'SCT', 'Campolina horse breed', 'L-8A1DC', 'C1297285')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133129001', 'SCT', 'Byelorussian Harness horse breed', 'L-8A1DD', 'C1297286')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133130006', 'SCT', 'Budyonny horse breed', 'L-8A1DE', 'C1297287')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133131005', 'SCT', 'Australian Brumby horse breed', 'L-8A1DF', 'C1297288')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133132003', 'SCT', 'Australian Stock Horse horse breed', 'L-8A1E1', 'C1297289')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133133008', 'SCT', 'Basuto Pony horse breed', 'L-8A1E2', 'C1297290')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133134002', 'SCT', 'Bashkir Curly horse breed', 'L-8A1E3', 'C1297291')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133135001', 'SCT', 'Bashkir horse breed', 'L-8A1E4', 'C1297292')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133136000', 'SCT', 'Barb horse breed', 'L-8A1E5', 'C1297293')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133137009', 'SCT', 'Ban-ei horse breed', 'L-8A1E6', 'C1297294')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133138004', 'SCT', 'Carpathian Pony horse breed', 'L-8A1E7', 'C1297295')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133139007', 'SCT', 'Baluchi horse breed', 'L-8A1E8', 'C1297296')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133140009', 'SCT', 'Balearic horse breed', 'L-8A1E9', 'C1297297')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133141008', 'SCT', 'Chilean Corralero horse breed', 'L-8A1EA', 'C1297298')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133142001', 'SCT', 'Breton horse breed', 'L-8A1EB', 'C1297299')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133143006', 'SCT', 'Taishuh horse breed', 'L-8A1EC', 'C1297300')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133144000', 'SCT', 'Swedish Warmblood horse breed', 'L-8A1ED', 'C1297301')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133145004', 'SCT', 'Sudan Country-Bred horse breed', 'L-8A1EE', 'C1297302')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133146003', 'SCT', 'Spanish-Norman horse breed', 'L-8A1EF', 'C1297303')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133147007', 'SCT', 'Spanish Barb horse breed', 'L-8A1F1', 'C1297304')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133148002', 'SCT', 'Soviet Heavy Draft horse breed', 'L-8A1F2', 'C1297305')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133149005', 'SCT', 'Sorraia horse breed', 'L-8A1F3', 'C1297306')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133150005', 'SCT', 'Somali Pony horse breed', 'L-8A1F4', 'C1297307')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133151009', 'SCT', 'Tersk horse breed', 'L-8A1F5', 'C1297308')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133152002', 'SCT', 'Shagya horse breed', 'L-8A1F6', 'C1297309')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133153007', 'SCT', 'Selle Francais horse breed', 'L-8A1F7', 'C1297310')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133154001', 'SCT', 'Sanhe horse breed', 'L-8A1F8', 'C1297311')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133155000', 'SCT', 'Russian Heavy Draft horse breed', 'L-8A1FA', 'C1297312')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133156004', 'SCT', 'Rocky Mountain Horse horse breed', 'L-8A1FB', 'C1297313')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133157008', 'SCT', 'Racking Horse horse breed', 'L-8A1FC', 'C1297314')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133158003', 'SCT', 'Quarter Pony horse breed', 'L-8A1FD', 'C1297315')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133159006', 'SCT', 'Quarab horse breed', 'L-8A1FE', 'C1297316')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'133160001', 'SCT', 'Single-Footing Horse horse breed', 'L-8A1FF', 'C1297317')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'45790002', 'SCT', 'American Albino horse breed', 'L-80405', 'C0324147')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'90050009', 'SCT', 'American Buckskin horse breed', 'L-80406', 'C0324148')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'26837006', 'SCT', 'American cream horse breed', 'L-80407', 'C0324149')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'54699009', 'SCT', 'American miniature horse breed', 'L-80408', 'C0324150')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'7623008', 'SCT', 'American paint horse breed', 'L-80409', 'C0324151')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'42724005', 'SCT', 'American saddlebred horse breed', 'L-80410', 'C0324152')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'26973000', 'SCT', 'American trotter horse breed', 'L-80411', 'C0324153')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'72394007', 'SCT', 'American tunis horse breed', 'L-80412', 'C0324154')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'80777007', 'SCT', 'Andalusian horse breed', 'L-80413', 'C0324155')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'55167009', 'SCT', 'Appaloosa horse breed', 'L-80414', 'C0324156')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'54098002', 'SCT', 'Arabian horse breed', 'L-80415', 'C0324157')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'22720009', 'SCT', 'Belgian horse breed', 'L-80416', 'C0324158')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'47842004', 'SCT', 'Canadian horse breed', 'L-80417', 'C0324159')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'41092008', 'SCT', 'Cleveland bay horse breed', 'L-80418', 'C0324160')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'1247002', 'SCT', 'Clydesdale horse breed', 'L-80419', 'C0324161')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'89648005', 'SCT', 'Fjord horse breed', 'L-80421', 'C0324162')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'6220006', 'SCT', 'Galiceno horse breed', 'L-80422', 'C0324163')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'112488001', 'SCT', 'Hackney horse breed', 'L-80423', 'C0324164')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'54447000', 'SCT', 'Haflinger horse breed', 'L-80424', 'C0324165')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'66168008', 'SCT', 'Hanoverian horse breed', 'L-80425', 'C0324166')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'25813002', 'SCT', 'Holsteiner horse breed', 'L-80426', 'C0324167')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'19356005', 'SCT', 'Hunter horse breed', 'L-80427', 'C0324168')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'70457009', 'SCT', 'Icelandic horse breed', 'L-80428', 'C0324169')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'41754002', 'SCT', 'Lipizzaner horse breed', 'L-80429', 'C0324170')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'12360007', 'SCT', 'Missouri fox trotting horse breed', 'L-80430', 'C0324171')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'21295007', 'SCT', 'Morgan horse breed', 'L-80431', 'C0324172')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'26699009', 'SCT', 'New Forest pony horse breed', 'L-80433', 'C0324173')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'39532001', 'SCT', 'Norman coach horse breed', 'L-80435', 'C0324174')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'41738000', 'SCT', 'Palomino horse breed', 'L-80436', 'C0324175')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'56086005', 'SCT', 'Paso Fino horse breed', 'L-80437', 'C0324176')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'1006005', 'SCT', 'Percheron horse breed', 'L-80438', 'C0324177')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'4960000', 'SCT', 'Peruvian Paso horse breed', 'L-80439', 'C0324178')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'58264006', 'SCT', 'Pinto horse breed', 'L-80440', 'C0324179')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'3997000', 'SCT', 'Pony horse breed', 'L-80450', 'C0324180')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'46408008', 'SCT', 'American pony horse breed', 'L-80451', 'C0324181')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'69067004', 'SCT', 'Shetland pony horse breed', 'L-80452', 'C0324182')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'396488006', 'SCT', 'Ariégeois pony horse breed', 'L-80453', 'C1321492')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'76467006', 'SCT', 'Quarter horse breed', 'L-80454', 'C0324183')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'13487004', 'SCT', 'Shire horse breed', 'L-80455', 'C0324184')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'76302002', 'SCT', 'Spanish mustang horse breed', 'L-80456', 'C0324185')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'34200004', 'SCT', 'Standardbred horse breed', 'L-80457', 'C0324186')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'53567001', 'SCT', 'Suffolk horse breed', 'L-80458', 'C0324187')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'51023000', 'SCT', 'Tennessee walking horse breed', 'L-80459', 'C0324188')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'1789009', 'SCT', 'Trakehner horse breed', 'L-80461', 'C0324190')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'1118004', 'SCT', 'Viking horse breed', 'L-80462', 'C0324191')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'8089006', 'SCT', 'Welsh walking horse breed', 'L-80463', 'C0324192')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'25369002', 'SCT', 'Westphalian horse breed', 'L-80464', 'C0324193')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'31633003', 'SCT', 'Yorkshire coach horse breed', 'L-80465', 'C0324194')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'425253007', 'SCT', 'Draft pony superbreed horse breed', 'L-80495', 'C1827769')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'425118005', 'SCT', 'American draft pony horse breed', 'L-804A0', 'C1827471')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'424111008', 'SCT', 'Pindos pony horse breed', 'L-804B0', 'C1828122')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'423926000', 'SCT', 'Skyros pony horse breed', 'L-804C0', 'C1827647')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'407402001', 'SCT', 'Warmblood horse breed', 'L-8A105', 'C1319938')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'406711007', 'SCT', 'Brabant horse breed', 'L-8A106', 'C1318886')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'125084002', 'SCT', 'Equus caballus gmelini horse breed', 'L-8A10B', 'C1265528')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'406714004', 'SCT', 'Gypsy Vanner horse breed', 'L-8A10C', 'C1320154')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'406715003', 'SCT', 'Murgese horse breed', 'L-8A10D', 'C1320155')`
        );
        queryString.push(
          `${queryInsertBreed} (3,'427136006', 'SCT', 'Saddlebred horse superbreed horse breed', 'L-8A114', 'C1960600')`
        );
        queryString.push(
          `${queryInsertBreed} (4,'132888004', 'SCT', 'Blanc de Bouscat rabbit breed', 'L-86B36', 'C1297065')`
        );
        queryString.push(
          `${queryInsertBreed} (4,'132901006', 'SCT', 'New Zealand rabbit breed', 'L-86B49', 'C0324547')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'409906003', 'SCT', 'Mixed breed cattle', 'L-8B947', 'C1444148')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'125074003', 'SCT', 'Hereford cattle superbreed', 'L-80139', 'C0324066')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131426006', 'SCT', 'Africander cattle breed', 'L-80121', 'C1269178')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131427002', 'SCT', 'Ankole cattle breed', 'L-80122', 'C1295943')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131428007', 'SCT', 'Ankole-Watusi cattle breed', 'L-80123', 'C1295944')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131429004', 'SCT', 'Baladicattle cattle breed', 'L-80124', 'C1295945')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131430009', 'SCT', 'Belmont Red cattle breed', 'L-80125', 'C1295946')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131431008', 'SCT', 'Bonsmara cattle breed', 'L-80126', 'C1295947')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131432001', 'SCT', 'Damietta cattle breed', 'L-80127', 'C1295948')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131433006', 'SCT', 'Horro cattle breed', 'L-80128', 'C1295949')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131434000', 'SCT', 'Kuri cattle breed', 'L-80129', 'C1295950')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131435004', 'SCT', 'Nguni cattle breed', 'L-8012A', 'C1295951')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131436003', 'SCT', 'Philippine Native cattle breed', 'L-8012B', 'C1269179')`
        );
        queryString.push(
          `${queryInsertBreed} (5,'131437007', 'SCT', 'Romagnola cattle breed', 'L-8012C', 'C1295952')`
        );
      }

      if ((await this.getBodypartRowCount()) <= 0) {
        // Protocol Code (Human(1))
        {
          queryString.push(
            `${queryInsertBodypart} (1,'818981001', 'SCT', 'Abdomen', NULL, 'ABDOMEN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'818982008', 'SCT', 'Abdomen and Pelvis', NULL, 'ABDOMENPELVIS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'7832008', 'SCT', 'Abdominal aorta', 'T-42500', 'ABDOMINALAORTA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'85856004', 'SCT', 'Acromioclavicular joint', 'T-15420', 'ACJOINT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'23451007', 'SCT', 'Adrenal gland', 'T-B3000', 'ADRENAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'77012006', 'SCT', 'Amniotic fluid', 'T-F1320', 'AMNIOTICFLUID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'70258002', 'SCT', 'Ankle joint', 'T-15750', 'ANKLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128585006', 'SCT', 'Anomalous pulmonary vein', 'T-48503', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128553008', 'SCT', 'Antecubital vein', 'T-49215', 'ANTECUBITALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'194996006', 'SCT', 'Anterior cardiac vein', 'T-48403', 'ANTCARDIACV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'60176003', 'SCT', 'Anterior cerebral artery', 'T-45540', 'ACA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'8012006', 'SCT', 'Anterior communicating artery', 'T-45530', 'ANTCOMMA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'17388009', 'SCT', 'Anterior spinal artery', 'T-45730', 'ANTSPINALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'68053000', 'SCT', 'Anterior tibial artery', 'T-47700', 'ANTTIBIALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53505006', 'SCT', 'Anus', 'T-59900', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110612005', 'SCT', 'Anus, rectum and sigmoid colon', 'T-59490', 'ANUSRECTUMSIGMD', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'15825003', 'SCT', 'Aorta', 'T-42000', 'AORTA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'57034009', 'SCT', 'Aortic arch', 'T-42300', 'AORTICARCH', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128551005', 'SCT', 'Aortic fistula', 'D3-81922', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128564006', 'SCT', 'Apex of left ventricle', 'T-32602', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'86598002', 'SCT', 'Apex of Lung', 'T-280A0', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128565007', 'SCT', 'Apex of right ventricle', 'T-32502', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'66754008', 'SCT', 'Appendix', 'T-59200', 'APPENDIX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'51114001', 'SCT', 'Artery', 'T-41000', 'ARTERY', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'54247002', 'SCT', 'Ascending aorta', 'T-42100', 'ASCAORTA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'9040008', 'SCT', 'Ascending colon', 'T-59420', 'ASCENDINGCOLON', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'59652004', 'SCT', 'Atrium', 'T-32100', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'91470000', 'SCT', 'Axilla', 'T-D8104', 'AXILLA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'67937003', 'SCT', 'Axillary Artery', 'T-47100', 'AXILLARYA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'68705008', 'SCT', 'Axillary vein', 'T-49110', 'AXILLARYV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'72107004', 'SCT', 'Azygos vein', 'T-48340', 'AZYGOSVEIN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'77568009', 'SCT', 'Back', 'T-D2100', 'BACK', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128981007', 'SCT', 'Baffle', 'A-00203', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'59011009', 'SCT', 'Basilar artery', 'T-45800', 'BASILARA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'28273000', 'SCT', 'Bile duct', 'T-60610', 'BILEDUCT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'34707002', 'SCT', 'Biliary tract', 'T-60600', 'BILIARYTRACT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'89837001', 'SCT', 'Bladder', 'T-74000', 'BLADDER', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110837003', 'SCT', 'Bladder and urethra', 'T-DD123', 'BLADDERURETHRA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'91830000', 'SCT', 'Body conduit', 'T-D00AB', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'72001000', 'SCT', 'Bone of lower limb', 'T-12700', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'371195002', 'SCT', 'Bone of upper limb', 'T-D0821', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128548003', 'SCT', "Boyd's perforating vein", 'T-49424', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'17137000', 'SCT', 'Brachial artery', 'T-47160', 'BRACHIALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'20115005', 'SCT', 'Brachial vein', 'T-49350', 'BRACHIALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'12738006', 'SCT', 'Brain', 'T-A0100', 'BRAIN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'76752008', 'SCT', 'Breast', 'T-04000', 'BREAST', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'34411009', 'SCT', 'Broad ligament', 'T-D6500', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'955009', 'SCT', 'Bronchus', 'T-26000', 'BRONCHUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'60819002', 'SCT', 'Buccal region of face', 'T-D1206', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'46862004', 'SCT', 'Buttock', 'T-D2600', 'BUTTOCK', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'80144004', 'SCT', 'Calcaneus', 'T-12770', 'CALCANEUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53840002', 'SCT', 'Calf of leg', 'T-D9440', 'CALF', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'2334006', 'SCT', 'Calyx', 'T-72100', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'69105007', 'SCT', 'Carotid Artery', 'T-45010', 'CAROTID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'21479005', 'SCT', 'Carotid bulb', 'T-45170', 'BULB', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'57850000', 'SCT', 'Celiac artery', 'T-46400', 'CELIACA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'20699002', 'SCT', 'Cephalic vein', 'T-49240', 'CEPHALICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113305005', 'SCT', 'Cerebellum', 'T-A6000', 'CEREBELLUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'88556005', 'SCT', 'Cerebral artery', 'T-45510', 'CEREBRALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'372073000', 'SCT', 'Cerebral hemisphere', 'T-A010F', 'CEREBHEMISPHERE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'122494005', 'SCT', 'Cervical spine', 'T-11501', 'CSPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'297171002', 'SCT', 'Cervico-thoracic spine', 'T-D00F7', 'CTSPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'71252005', 'SCT', 'Cervix', 'T-83200', 'CERVIX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'60819002', 'SCT', 'Cheek', 'T-D1206', 'CHEEK', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'43799004', 'SCT', 'Chest', NULL, 'CHEST', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'416775004', 'SCT', 'Chest, Abdomen and Pelvis', 'R-FAB56', 'CHESTABDPELVIS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'416550000', 'SCT', 'Chest and Abdomen', 'R-FAB55', 'CHESTABDOMEN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'80621003', 'SCT', 'Choroid plexus', 'T-A1900', 'CHOROIDPLEXUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'11279006', 'SCT', 'Circle of Willis', 'T-45520', 'CIRCLEOFWILLIS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'51299004', 'SCT', 'Clavicle', 'T-12310', 'CLAVICLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'64688005', 'SCT', 'Coccyx', 'T-11BF0', 'COCCYX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'71854001', 'SCT', 'Colon', 'T-59300', 'COLON', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'253276007', 'SCT', 'Common atrium', 'D4-31005', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'79741001', 'SCT', 'Common bile duct', 'T-64500', 'COMMONBILEDUCT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32062004', 'SCT', 'Common carotid artery', 'T-45100', 'CCA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'181347005', 'SCT', 'Common femoral artery', 'T-47402', 'CFA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'397363009', 'SCT', 'Common femoral vein', 'G-035B', 'CFV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'73634005', 'SCT', 'Common iliac artery', 'T-46710', 'COMILIACA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'46027005', 'SCT', 'Common iliac vein', 'T-48920', 'COMILIACV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'45503006', 'SCT', 'Common ventricle', 'D4-31120', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128555001', 'SCT', 'Congenital coronary artery fistula to left atrium', 'D4-32504', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128556000', 'SCT', 'Congenital coronary artery fistula to left ventricle', 'D4-32506', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128557009', 'SCT', 'Congenital coronary artery fistula to right atrium', 'D4-32509', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128558004', 'SCT', 'Congenital coronary artery fistula to right ventricle', 'D4-32510', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'111289009', 'SCT', 'Pulmonary arteriovenous fistula', 'D3-40208', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'28726007', 'SCT', 'Cornea', 'T-AA200', 'CORNEA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'41801008', 'SCT', 'Coronary artery', 'T-43000', 'CORONARYARTERY', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'90219004', 'SCT', 'Coronary sinus', 'T-48410', 'CORONARYSINUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128320002', 'SCT', 'Cranial venous system', 'T-A0191', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32672002', 'SCT', 'Descending aorta', 'T-42400', 'DESCAORTA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32622004', 'SCT', 'Descending colon', 'T-59460', 'DESCENDINGCOLON', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128554002', 'SCT', "Dodd's perforating vein", 'T-49429', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'38848004', 'SCT', 'Duodenum', 'T-58200', 'DUODENUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'117590005', 'SCT', 'Ear', 'T-AB001', 'EAR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'16953009', 'SCT', 'Elbow joint', 'T-15430', 'ELBOW', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'51114001', 'SCT', 'Endo-arterial', 'T-41000', 'ENDOARTERIAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'80891009', 'SCT', 'Endo-cardiac', 'T-32000', 'ENDOCARDIAC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32849002', 'SCT', 'Endo-esophageal', 'T-56000', 'ENDOESOPHAGEAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'2739003', 'SCT', 'Endometrium', 'T-83400', 'ENDOMETRIUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53342003', 'SCT', 'Endo-nasal', 'T-21300', 'ENDONASAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'18962004', 'SCT', 'Endo-nasopharyngeal', 'T-23050', 'ENDONASOPHARYNYX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'34402009', 'SCT', 'Endo-rectal', 'T-59600', 'ENDORECTAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'64033007', 'SCT', 'Endo-renal', 'T-71000', 'ENDORENAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'87953007', 'SCT', 'Endo-ureteric', 'T-73000', 'ENDOURETERIC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'13648007', 'SCT', 'Endo-urethral', 'T-75000', 'ENDOURETHRAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'76784001', 'SCT', 'Endo-vaginal', 'T-82000', 'ENDOVAGINAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'59820001', 'SCT', 'Endo-vascular', 'T-40000', 'ENDOVASCULAR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'29092000', 'SCT', 'Endo-venous', 'T-48000', 'ENDOVENOUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'48367006', 'SCT', 'Endo-vesical', 'T-74250', 'ENDOVESICAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'38266002', 'SCT', 'Entire body', 'T-D0010', 'WHOLEBODY', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'87644002', 'SCT', 'Epididymis', 'T-95000', 'EPIDIDYMIS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'27947004', 'SCT', 'Epigastric region', 'T-D4200', 'EPIGASTRIC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32849002', 'SCT', 'Esophagus', 'T-56000', 'ESOPHAGUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110861005', 'SCT', 'Esophagus, stomach and duodenum', 'T-DD163', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'84301002', 'SCT', 'External auditory canal', 'T-AB200', 'EAC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'22286001', 'SCT', 'External carotid artery', 'T-45200', 'ECA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113269004', 'SCT', 'External iliac artery', 'T-46910', 'EXTILIACA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'63507001', 'SCT', 'External iliac vein', 'T-48930', 'EXTILIACV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'71585003', 'SCT', 'External jugular vein', 'T-48160', 'EXTJUGV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'66019005', 'SCT', 'Extremity', 'T-D0300', 'EXTREMITY', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'81745001', 'SCT', 'Eye', 'T-AA000', 'EYE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'80243003', 'SCT', 'Eyelid', 'T-AA810', 'EYELID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'371398005', 'SCT', 'Eye region', 'T-D0801', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'89545001', 'SCT', 'Face', 'T-D1200', 'FACE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'23074001', 'SCT', 'Facial artery', 'T-45240', 'FACIALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'91397008', 'SCT', 'Facial bones', 'T-11196', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'7657000', 'SCT', 'Femoral artery', 'T-47400', 'FEMORALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'83419000', 'SCT', 'Femoral vein', 'T-49410', 'FEMORALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'71341001', 'SCT', 'Femur', 'T-12710', 'FEMUR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'NULL', 'NULL', 'Fetal arm', NULL, 'FETALARM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'NULL', 'NULL', 'Fetal digit', NULL, 'FETALDIGIT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'NULL', 'NULL', 'Fetal heart', NULL, 'FETALHEART', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'NULL', 'NULL', 'Fetal leg', NULL, 'FETALLEG', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'NULL', 'NULL', 'Fetal pole', NULL, 'FETALPOLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'87342007', 'SCT', 'Fibula', 'T-12750', 'FIBULA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'7569003', 'SCT', 'Finger', 'T-D8800', 'FINGER', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'58602004', 'SCT', 'Flank', 'T-D2310', 'FLANK', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'79361005', 'SCT', 'Fontanel of skull', 'T-15200', 'FONTANEL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'56459004', 'SCT', 'Foot', 'T-D9700', 'FOOT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'14975008', 'SCT', 'Forearm', 'T-D8500', 'FOREARM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'35918002', 'SCT', 'Fourth ventricle', 'T-A1820', '4THVENTRICLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'28231008', 'SCT', 'Gallbladder', 'T-63000', 'GALLBLADDER', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110568007', 'SCT', 'Gastric vein', 'T-48820', 'GASTRICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128559007', 'SCT', 'Genicular artery', 'T-47490', 'GENICULARA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'300571009', 'SCT', 'Gestational sac', 'F-03FC9', 'GESTSAC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'46862004', 'SCT', 'Gluteal region', 'T-D2600', 'GLUTEAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'5928000', 'SCT', 'Great cardiac vein', 'T-48420', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'60734001', 'SCT', 'Great saphenous vein', 'T-49530', 'GSV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'85562004', 'SCT', 'Hand', 'T-D8700', 'HAND', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'69536005', 'SCT', 'Head', 'T-D1100', 'HEAD', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'774007', 'SCT', 'Head and Neck', 'T-D1000', 'HEADNECK', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'80891009', 'SCT', 'Heart', 'T-32000', 'HEART', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'76015000', 'SCT', 'Hepatic artery', 'T-46420', 'HEPATICA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'8993003', 'SCT', 'Hepatic vein', 'T-48720', 'HEPATICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'24136001', 'SCT', 'Hip joint', 'T-15710', 'HIP', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'85050009', 'SCT', 'Humerus', 'T-12410', 'HUMERUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128560002', 'SCT', 'Hunterian perforating vein', 'T-4942A', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'11708003', 'SCT', 'Hypogastric region', 'T-D4240', 'HYPOGASTRIC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'81502006', 'SCT', 'Hypopharynx', 'T-55300', 'HYPOPHARYNX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'34516001', 'SCT', 'Ileum', 'T-58600', 'ILEUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'299716001', 'SCT', 'Iliac and/or femoral artery', 'T-41068', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'10293006', 'SCT', 'Iliac artery', 'T-46700', 'ILIACA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'244411005', 'SCT', 'Iliac vein', 'T-4940E', 'ILIACV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'22356005', 'SCT', 'Ilium', 'T-12340', 'ILIUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'195416006', 'SCT', 'Inferior cardiac vein', 'T-484A4', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'51249003', 'SCT', 'Inferior left pulmonary vein', 'T-48540', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'33795007', 'SCT', 'Inferior mesenteric artery', 'T-46520', 'INFMESA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113273001', 'SCT', 'Inferior right pulmonary vein', 'T-48520', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'64131007', 'SCT', 'Inferior vena cava', 'T-48710', 'INFVENACAVA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'26893007', 'SCT', 'Inguinal region', 'T-D7000', 'INGUINAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'12691009', 'SCT', 'Innominate artery', 'T-46010', 'INNOMINATEA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'8887007', 'SCT', 'Innominate vein', 'T-48620', 'INNOMINATEV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'361078006', 'SCT', 'Internal Auditory Canal', 'T-AB959', 'IAC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'86117002', 'SCT', 'Internal carotid artery', 'T-45300', 'ICA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'90024005', 'SCT', 'Internal iliac artery', 'T-46740', 'INTILIACA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'12123001', 'SCT', 'Internal jugular vein', 'T-48170', 'INTJUGULARV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'69327007', 'SCT', 'Internal mammary artery', 'T-46200', 'INTMAMMARYA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'818987002', 'SCT', 'Intra-abdominopelvic', NULL, NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'131183008', 'SCT', 'Intra-articular', 'G-A15A', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'1101003', 'SCT', 'Intracranial', 'T-D1400', 'INTRACRANIAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32849002', 'SCT', 'Intra-esophageal', 'T-56000', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'816989007', 'SCT', 'Intra-pelvic', NULL, NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'43799004', 'SCT', 'Intra-thoracic', NULL, NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'661005', 'SCT', 'Jaw region', 'T-D1213', 'JAW', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'21306003', 'SCT', 'Jejunum', 'T-58400', 'JEJUNUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'39352004', 'SCT', 'Joint', 'T-15001', 'JOINT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128563000', 'SCT', 'Juxtaposed atrial appendage', 'D4-31052', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'64033007', 'SCT', 'Kidney', 'T-71000', 'KIDNEY', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'72696002', 'SCT', 'Knee', 'T-D9200', 'KNEE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'59749000', 'SCT', 'Lacrimal artery', 'T-45410', 'LACRIMALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128979005', 'SCT', 'Lacrimal artery of right eye', 'T-45416', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'14742008', 'SCT', 'Large intestine', 'T-59000', 'LARGEINTESTINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'4596009', 'SCT', 'Larynx', 'T-24100', 'LARYNX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'66720007', 'SCT', 'Lateral Ventricle', 'T-A1650', 'LATVENTRICLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'82471001', 'SCT', 'Left atrium', 'T-32300', 'LATRIUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'33626005', 'SCT', 'Left auricular appendage', 'T-32310', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113270003', 'SCT', 'Left femoral artery', 'T-47420', 'LFEMORALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'273202007', 'SCT', 'Left hepatic vein', 'T-48727', 'LHEPATICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'133945003', 'SCT', 'Left hypochondriac region', 'T-D4211', 'LHYPOCHONDRIAC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'85119005', 'SCT', 'Left inguinal region', 'T-D7020', 'LINGUINAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'68505006', 'SCT', 'Left lower quadrant of abdomen', 'T-D4140', 'LLQ', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'133943005', 'SCT', 'Left lumbar region', 'T-D2340', 'LLUMBAR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'70253006', 'SCT', 'Left portal vein', 'T-48814', 'LPORTALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'50408007', 'SCT', 'Left pulmonary artery', 'T-44400', 'LPULMONARYA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'86367003', 'SCT', 'Left upper quadrant of abdomen', 'T-D4130', 'LUQ', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'87878005', 'SCT', 'Left ventricle', 'T-32600', 'LVENTRICLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'70238003', 'SCT', 'Left ventricle inflow', 'T-32640', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'13418002', 'SCT', 'Left ventricle outflow tract', 'T-32650', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113264009', 'SCT', 'Lingual artery', 'T-45230', 'LINGUALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'10200004', 'SCT', 'Liver', 'T-62000', 'LIVER', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'19100000', 'SCT', 'Lower inner quadrant of breast', 'T-04003', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'30021000', 'SCT', 'Lower leg', 'T-D9400', 'LEG', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'61685007', 'SCT', 'Lower limb', 'T-D9000', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'33564002', 'SCT', 'Lower outer quadrant of breast', 'T-04005', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'34635009', 'SCT', 'Lumbar artery', 'T-46960', 'LUMBARA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'52612000', 'SCT', 'Lumbar region', 'T-D2300', 'LUMBAR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'122496007', 'SCT', 'Lumbar spine', 'T-11503', 'LSPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'297173004', 'SCT', 'Lumbo-sacral spine', 'T-D00F9', 'LSSPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'91747007', 'SCT', 'Lumen of blood vessel', 'T-40230', 'LUMEN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'39607008', 'SCT', 'Lung', 'T-28000', 'LUNG', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'91609006', 'SCT', 'Mandible', 'T-11180', 'JAW', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'59066005', 'SCT', 'Mastoid bone', 'T-11133', 'MASTOID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'70925003', 'SCT', 'Maxilla', 'T-11170', 'MAXILLA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'72410000', 'SCT', 'Mediastinum', 'T-D3300', 'MEDIASTINUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'86570000', 'SCT', 'Mesenteric artery', 'T-46500', 'MESENTRICA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128583004', 'SCT', 'Mesenteric vein', 'T-4884A', 'MESENTRICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'17232002', 'SCT', 'Middle cerebral artery', 'T-45600', 'MCA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'273099000', 'SCT', 'Middle hepatic vein', 'T-48726', 'MIDHEPATICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'243977002', 'SCT', 'Morisons pouch', 'T-D4434', 'MORISONSPOUCH', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'123851003', 'SCT', 'Mouth', 'T-D0662', 'MOUTH', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'102292000', 'SCT', 'Muscle of lower limb', 'T-14668', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'30608006', 'SCT', 'Muscle of upper limb', 'T-13600', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'74386004', 'SCT', 'Nasal bone', 'T-11149', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'360955006', 'SCT', 'Nasopharynx', 'T-2300C', 'NASOPHARYNX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'45048000', 'SCT', 'Neck', 'T-D1600', 'NECK', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'416319003', 'SCT', 'Neck, Chest, Abdomen and Pelvis', 'R-FAB54', 'NECKCHESTABDPELV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'416152001', 'SCT', 'Neck, Chest and Abdomen', 'R-FAB53', 'NECKCHESTABDOMEN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'417437006', 'SCT', 'Neck and Chest', 'R-FAB52', 'NECKCHEST', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'45206002', 'SCT', 'Nose', 'T-21000', 'NOSE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'31145008', 'SCT', 'Occipital artery', 'T-45250', 'OCCPITALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32114007', 'SCT', 'Occipital vein', 'T-48214', 'OCCIPTALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113346000', 'SCT', 'Omental bursa', 'T-D4450', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'27398004', 'SCT', 'Omentum', 'T-D4600', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53549008', 'SCT', 'Ophthalmic artery', 'T-45400', 'OPHTHALMICA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'55024004', 'SCT', 'Optic canal', 'T-11102', 'OPTICCANAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'363654007', 'SCT', 'Orbital structure', 'T-D14AE', 'ORBIT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'15497006', 'SCT', 'Ovary', 'T-87000', 'OVARY', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'15776009', 'SCT', 'Pancreas', 'T-65000', 'PANCREAS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'69930009', 'SCT', 'Pancreatic duct', 'T-65010', 'PANCREATICDUCT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110621006', 'SCT', 'Pancreatic duct and bile duct systems', 'T-65600', 'PANCBILEDUCT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'2095001', 'SCT', 'Paranasal sinus', 'T-22000', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'91691001', 'SCT', 'Parasternal', 'T-D3136', 'PARASTERNAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'111002', 'SCT', 'Parathyroid', 'T-B7000', 'PARATHYROID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'45289007', 'SCT', 'Parotid gland', 'T-61100', 'PAROTID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'64234005', 'SCT', 'Patella', 'T-12730', 'PATELLA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'83330001', 'SCT', 'Patent ductus arteriosus', 'D4-32012', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'816092008', 'SCT', 'Pelvis', NULL, 'PELVIS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'416631005', 'SCT', 'Pelvis and lower extremities', 'R-FAB58', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'282044005', 'SCT', 'Penile artery', 'T-46807', 'PENILEA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'18911002', 'SCT', 'Penis', 'T-91000', 'PENIS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'38864007', 'SCT', 'Perineum', 'T-D2700', 'PERINEUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'8821006', 'SCT', 'Peroneal artery', 'T-47630', 'PERONEALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113681', 'DCM', 'Phantom', NULL, NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'54066008', 'SCT', 'Pharynx', 'T-55000', 'PHARYNX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'312535008', 'SCT', 'Pharynx and larynx', 'T-20101', 'PHARYNXLARYNX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'78067005', 'SCT', 'Placenta', 'T-F1100', 'PLACENTA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'43899006', 'SCT', 'Popliteal artery', 'T-47500', 'POPLITEALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32361000', 'SCT', 'Popliteal fossa', 'T-D9310', 'POPLITEALFOSSA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'56849005', 'SCT', 'Popliteal vein', 'T-49650', 'POPLITEALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'32764006', 'SCT', 'Portal vein', 'T-48810', 'PORTALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'70382005', 'SCT', 'Posterior cerebral artery', 'T-45900', 'PCA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'43119007', 'SCT', 'Posterior communicating artery', 'T-45320', 'POSCOMMA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128569001', 'SCT', 'Posterior medial tributary', 'T-49535', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'13363002', 'SCT', 'Posterior tibial artery', 'T-47600', 'POSTIBIALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'14944004', 'SCT', 'Primitive aorta', 'T-F7001', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'91707000', 'SCT', 'Primitive pulmonary artery', 'T-F7040', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'31677005', 'SCT', 'Profunda femoris artery', 'T-47440', 'PROFFEMA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'23438002', 'SCT', 'Profunda femoris vein', 'T-49660', 'PROFFEMV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'41216001', 'SCT', 'Prostate', 'T-92000', 'PROSTATE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'81040000', 'SCT', 'Pulmonary artery', 'T-44000', 'PULMONARYA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128584005', 'SCT', 'Pulmonary artery conduit', 'D4-33142', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128586007', 'SCT', 'Pulmonary chamber of cor triatriatum', 'T-32190', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'122972007', 'SCT', 'Pulmonary vein', 'T-48581', 'PULMONARYV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128566008', 'SCT', 'Pulmonary vein confluence', 'D4-33512', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128567004', 'SCT', 'Pulmonary venous atrium', 'D4-33514', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'45631007', 'SCT', 'Radial artery', 'T-47300', 'RADIALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'62413002', 'SCT', 'Radius', 'T-12420', 'RADIUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110535000', 'SCT', 'Radius and ulna', 'T-12403', 'RADIUSULNA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53843000', 'SCT', 'Rectouterine pouch', 'T-D6407', 'CULDESAC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'34402009', 'SCT', 'Rectum', 'T-59600', 'RECTUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'2841007', 'SCT', 'Renal artery', 'T-46600', 'RENALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'25990002', 'SCT', 'Renal pelvis', 'T-72000', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'56400007', 'SCT', 'Renal vein', 'T-48740', 'RENALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'82849001', 'SCT', 'Retroperitoneum', 'T-D4900', 'RETROPERITONEUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113197003', 'SCT', 'Rib', 'T-11300', 'RIB', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'73829009', 'SCT', 'Right atrium', 'T-32200', 'RATRIUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'68300000', 'SCT', 'Right auricular appendage', 'T-32210', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'69833005', 'SCT', 'Right femoral artery', 'T-47410', 'RFEMORALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'272998002', 'SCT', 'Right hepatic vein', 'T-48725', 'RHEPATICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'133946002', 'SCT', 'Right hypochondriac region', 'T-D4212', 'RHYPOCHONDRIAC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'37117007', 'SCT', 'Right inguinal region', 'T-D7010', 'RINGUINAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'48544008', 'SCT', 'Right lower quadrant of abdomen', 'T-D4120', 'RLQ', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'133944004', 'SCT', 'Right lumbar region', 'T-D2342', 'RLUMBAR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'73931004', 'SCT', 'Right portal vein', 'T-48813', 'RPORTALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'78480002', 'SCT', 'Right pulmonary artery', 'T-44200', 'RPULMONARYA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'50519007', 'SCT', 'Right upper quadrant of abdomen', 'T-D4110', 'RUQ', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53085002', 'SCT', 'Right ventricle', 'T-32500', 'RVENTRICLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'8017000', 'SCT', 'Right ventricle inflow', 'T-32540', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'44627009', 'SCT', 'Right ventricle outflow tract', 'T-32550', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'39723000', 'SCT', 'Sacroiliac joint', 'T-15680', 'SIJOINT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'54735007', 'SCT', 'Sacrum', 'T-11AD0', 'SSPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128587003', 'SCT', 'Saphenofemoral junction', 'T-D930A', 'SFJ', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'362072009', 'SCT', 'Saphenous vein', 'T-4940B', 'SAPHENOUSV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'41695006', 'SCT', 'Scalp', 'T-D1160', 'SCALP', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'79601000', 'SCT', 'Scapula', 'T-12280', 'SCAPULA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'18619003', 'SCT', 'Sclera', 'T-AA110', 'SCLERA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'20233005', 'SCT', 'Scrotum', 'T-98000', 'SCROTUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'42575006', 'SCT', 'Sella turcica', 'T-D1460', 'SELLA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'64739004', 'SCT', 'Seminal vesicle', 'T-93000', 'SEMVESICLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'58742003', 'SCT', 'Sesamoid bones of foot', 'T-12980', 'SESAMOID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'16982005', 'SCT', 'Shoulder', 'T-D2220', 'SHOULDER', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'60184004', 'SCT', 'Sigmoid colon', 'T-59470', 'SIGMOID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'89546000', 'SCT', 'Skull', 'T-11100', 'SKULL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'30315005', 'SCT', 'Small intestine', 'T-58000', 'SMALLINTESTINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'2748008', 'SCT', 'Spinal cord', 'T-A7010', 'SPINALCORD', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'421060004', 'SCT', 'Spine', 'T-D04FF', 'SPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'78961009', 'SCT', 'Spleen', 'T-C3000', 'SPLEEN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'22083002', 'SCT', 'Splenic artery', 'T-46460', 'SPLENICA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'35819009', 'SCT', 'Splenic vein', 'T-48890', 'SPLENICV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'7844006', 'SCT', 'Sternoclavicular joint', 'T-15610', 'SCJOINT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'56873002', 'SCT', 'Sternum', 'T-11210', 'STERNUM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'69695003', 'SCT', 'Stomach', 'T-57000', 'STOMACH', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'36765005', 'SCT', 'Subclavian artery', 'T-46100', 'SUBCLAVIANA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'9454009', 'SCT', 'Subclavian vein', 'T-48330', 'SUBCLAVIANV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'19695001', 'SCT', 'Subcostal', 'T-D4210', 'SUBCOSTAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'5713008', 'SCT', 'Submandibular area', 'T-D1603', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'54019009', 'SCT', 'Submandibular gland', 'T-61300', 'SUBMANDIBULAR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'170887008', 'SCT', 'Submental', 'T-D161E', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'5076001', 'SCT', 'Subxiphoid', 'T-D3213', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'181349008', 'SCT', 'Superficial femoral artery', 'T-47403', 'SFA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'397364003', 'SCT', 'Superficial femoral vein', 'G-035A', 'SFV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'15672000', 'SCT', 'Superficial temporal artery', 'T-45270', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'43863001', 'SCT', 'Superior left pulmonary vein', 'T-48530', 'LSUPPULMONARYV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'42258001', 'SCT', 'Superior mesenteric artery', 'T-46510', 'SMA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'8629005', 'SCT', 'Superior right pulmonary vein', 'T-48510', 'RSUPPULMONARYV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'72021004', 'SCT', 'Superior thyroid artery', 'T-45210', 'SUPTHYROIDA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'48345005', 'SCT', 'Superior vena cava', 'T-48610', 'SVC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'77621008', 'SCT', 'Supraclavicular region of neck', 'T-D1620', 'SUPRACLAVICULAR', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'11708003', 'SCT', 'Suprapubic region', 'T-D4240', 'SUPRAPUBIC', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'26493002', 'SCT', 'Suprasternal notch', 'T-11218', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128589000', 'SCT', 'Systemic collateral artery to lung', 'T-44007', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'128568009', 'SCT', 'Systemic venous atrium', 'D4-33516', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'27949001', 'SCT', 'Tarsal joint', 'T-15770', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53620006', 'SCT', 'Temporomandibular joint', 'T-15290', 'TMJ', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'40689003', 'SCT', 'Testis', 'T-94000', 'TESTIS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'42695009', 'SCT', 'Thalamus', 'T-A4000', 'THALAMUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'68367000', 'SCT', 'Thigh', 'T-D9100', 'THIGH', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'49841001', 'SCT', 'Third ventricle', 'T-A1740', '3RDVENTRICLE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'113262008', 'SCT', 'Thoracic aorta', 'T-42070', 'THORACICAORTA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'122495006', 'SCT', 'Thoracic spine', 'T-11502', 'TSPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'297172009', 'SCT', 'Thoraco-lumbar spine', 'T-D00F8', 'TLSPINE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'43799004', 'SCT', 'Thorax', NULL, 'THORAX', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'76505004', 'SCT', 'Thumb', 'T-D8810', 'THUMB', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'9875009', 'SCT', 'Thymus', 'T-C8000', 'THYMUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'69748006', 'SCT', 'Thyroid', 'T-B6000', 'THYROID', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'12611008', 'SCT', 'Tibia', 'T-12740', 'TIBIA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110536004', 'SCT', 'Tibia and fibula', 'T-12701', 'TIBIAFIBULA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'29707007', 'SCT', 'Toe', 'T-D9800', 'TOE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'21974007', 'SCT', 'Tongue', 'T-53000', 'TONGUE', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'44567001', 'SCT', 'Trachea', 'T-25000', 'TRACHEA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110726009', 'SCT', 'Trachea and bronchus', 'T-DD006', 'TRACHEABRONCHUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'485005', 'SCT', 'Transverse colon', 'T-59440', 'TRANSVERSECOLON', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'61959006', 'SCT', 'Truncus arteriosus communis', 'D4-31400', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'57850000', 'SCT', 'Truncus coeliacus', 'T-46400', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'23416004', 'SCT', 'Ulna', 'T-12430', 'ULNA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'44984001', 'SCT', 'Ulnar artery', 'T-47200', 'ULNARA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'50536004', 'SCT', 'Umbilical artery', 'T-F1810', 'UMBILICALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'90290004', 'SCT', 'Umbilical region', 'T-D4230', 'UMBILICAL', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'284639000', 'SCT', 'Umbilical vein', 'T-48832', 'UMBILICALV', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'40983000', 'SCT', 'Upper arm', 'T-D8200', 'ARM', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'77831004', 'SCT', 'Upper inner quadrant of breast', 'T-04002', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'53120007', 'SCT', 'Upper limb', 'T-D8000', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'76365002', 'SCT', 'Upper outer quadrant of breast', 'T-04004', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'431491007', 'SCT', 'Upper urinary tract', 'T-7000B', 'UPRURINARYTRACT', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'87953007', 'SCT', 'Ureter', 'T-73000', 'URETER', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'13648007', 'SCT', 'Urethra', 'T-75000', 'URETHRA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'35039007', 'SCT', 'Uterus', 'T-83000', 'UTERUS', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110639002', 'SCT', 'Uterus and fallopian tubes', 'T-88920', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'76784001', 'SCT', 'Vagina', 'T-82000', 'VAGINA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'118375008', 'SCT', 'Vascular graft', 'A-04140', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'29092000', 'SCT', 'Vein', 'T-48000', 'VEIN', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'34340008', 'SCT', 'Venous network', 'T-48003', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'21814001', 'SCT', 'Ventricle', 'T-32400', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'85234005', 'SCT', 'Vertebral artery', 'T-45700', 'VERTEBRALA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'110517009', 'SCT', 'Vertebral column and cranium', 'T-11011', NULL, 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'45292006', 'SCT', 'Vulva', 'T-81000', 'VULVA', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'74670003', 'SCT', 'Wrist joint', 'T-15460', 'WRIST', 0)`
          );
          queryString.push(
            `${queryInsertBodypart} (1,'13881006', 'SCT', 'Zygoma', 'T-11166', 'ZYGOMA', 0)`
          );
        }

        // Protocol Code (Veterinary(2)- Large(1))
        {
          queryString.push(
            `${queryInsertBodypart} (2, '818981001', 'SCT', 'Abdomen', NULL, 'ABDOMEN', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '42694008', 'SCT', 'All legs', 'T-D8030', 'LEGS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '62555009', 'SCT', 'Atlantal-axial joint', 'T-15317', 'ATLANTOAXIAL', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '20292002', 'SCT', 'Atlanto-occipital joint', 'T-15311', 'ATLANTOOCCIPITAL', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '89837001', 'SCT', 'Bladder', 'T-74000', 'BLADDER', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '82474009', 'SCT', 'Calcaneal tubercle', 'T-12771', NULL, 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '8205005', 'SCT', 'Carpus', 'T-D8600', 'CARPUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '122494005', 'SCT', 'Cervical spine', 'T-11501', 'CSPINE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '297171002', 'SCT', 'Cervico-thoracic spine', 'T-D00F7', 'CTSPINE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '816094009', 'SCT', 'Chest', NULL, 'CHEST', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '416550000', 'SCT', 'Chest and Abdomen', 'R-FAB55', 'CHESTABDOMEN', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '18149002', 'SCT', 'Coccygeal vertrebrae', 'T-11B00', 'TAIL', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '71854001', 'SCT', 'Colon', 'T-59300', 'COLON', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '82680008', 'SCT', 'Digit', 'T-D0310', 'DIGIT', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, 'C3669027', 'UMLS', 'Distal phalanx', NULL, 'DISTALPHALANX', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '16953009', 'SCT', 'Elbow joint', 'T-15430', 'ELBOW', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '38266002', 'SCT', 'Entire body', 'T-D0010', 'WHOLEBODY', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '32849002', 'SCT', 'Esophagus', 'T-56000', 'ESOPHAGUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '71341001', 'SCT', 'Femur', 'T-12710', 'FEMUR', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '13190002', 'SCT', 'Fetlock of forelimb', 'T-D8640', 'FOREFETLOCK', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '113351006', 'SCT', 'Fetlock of hindlimb', 'T-D9540', 'HINDFETLOCK', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '87342007', 'SCT', 'Fibula', 'T-12750', 'FIBULA', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '419176008', 'SCT', 'Forefoot', 'T-D04F2', 'FOREFOOT', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '55060009', 'SCT', 'Frontal sinus', 'T-22200', 'FRONTALSINUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '416804009', 'SCT', 'Hindfoot', 'T-D9713', 'HINDFOOT', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '24136001', 'SCT', 'Hip joint', 'T-15710', 'HIP', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '85050009', 'SCT', 'Humerus', 'T-12410', 'HUMERUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '122496007', 'SCT', 'Lumbar spine', 'T-11503', 'LSPINE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '297173004', 'SCT', 'Lumbo-sacral spine', 'T-D00F9', 'LSSPINE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '91609006', 'SCT', 'Mandible', 'T-11180', 'JAW', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '88176008', 'SCT', 'Mandibular dental arch', 'T-54170', NULL, 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '442274007', 'SCT', 'Mandibular incisor teeth', 'T-540EE', NULL, 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '39481002', 'SCT', 'Maxillary dental arch', 'T-54160', NULL, 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '442100006', 'SCT', 'Maxillary incisor teeth', 'T-540ED', NULL, 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '36455000', 'SCT', 'Metacarpus', 'T-12540', 'METACARPUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '280711000', 'SCT', 'Metatarsus', 'T-12847', 'METATARSUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '2095001', 'SCT', 'Nasal sinus', 'T-22000', NULL, 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '30518006', 'SCT', 'Navicular of forefoot', 'T-12450', 'FORENAVICULAR', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '75772009', 'SCT', 'Navicular of hindfoot', 'T-12800', 'HINDNAVICULAR', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '363654007', 'SCT', 'Orbital structure', 'T-D14AE', 'ORBIT', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '31329001', 'SCT', 'Pastern of forefoot', 'T-D8650', 'FOREPASTERN', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '18525008', 'SCT', 'Pastern of hindfoot', 'T-D9550', 'HINDPASTERN', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '64234005', 'SCT', 'Patella', 'T-12730', 'PATELLA', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '816092008', 'SCT', 'Pelvis', NULL, 'PELVIS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '62413002', 'SCT', 'Radius', 'T-12420', 'RADIUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '110535000', 'SCT', 'Radius and ulna', 'T-12403', 'RADIUSULNA', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '54735007', 'SCT', 'Sacrum', 'T-11AD0', 'SSPINE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '16982005', 'SCT', 'Shoulder', 'T-D2220', 'SHOULDER', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '89546000', 'SCT', 'Skull', 'T-11100', 'SKULL', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '116010006', 'SCT', 'Stiffle', 'T-15728', 'STIFLE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '108371006', 'SCT', 'Tarsus', 'T-12761', 'TARSUS', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '122495006', 'SCT', 'Thoracic spine', 'T-11502', 'TSPINE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '297172009', 'SCT', 'Thoraco-lumbar spine', 'T-D00F8', 'TLSPINE', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '12611008', 'SCT', 'Tibia', 'T-12740', 'TIBIA', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '110536004', 'SCT', 'Tibia and fibula', 'T-12701', 'TIBIAFIBULA', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '62834003', 'SCT', 'Upper gastro-intestinal tract', 'T-50110', 'UGITRACT', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '23416004', 'SCT', 'Ulna', 'T-12430', 'ULNA', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '13648007', 'SCT', 'Urethra', 'T-75000', 'URETHRA', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '431938005', 'SCT', 'Urinary tract', 'T-7000C', 'URINARYTRACT', 1)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '53036007', 'SCT', 'Wing', 'T-D8040', 'WING', 1)`
          );
        }

        // Protocol Code (Veterinary(2)- Small(2))
        {
          queryString.push(
            `${queryInsertBodypart} (2, '23451007', 'SCT', 'Adrenal gland', 'T-B3000', 'ADRENAL', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '70258002', 'SCT', 'Ankle joint', 'T-15750', 'ANKLE', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '15825003', 'SCT', 'Aorta', 'T-42000', 'AORTA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '89837001', 'SCT', 'Bladder', 'T-74000', 'BLADDER', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '12738006', 'SCT', 'Brain', 'T-A0100', 'BRAIN', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '76752008', 'SCT', 'Breast', 'T-04000', 'BREAST', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '955009', 'SCT', 'Bronchus', 'T-26000', 'BRONCHUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '60819002', 'SCT', 'Buccal region of face', 'T-D1206', 'CHEEK', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '80144004', 'SCT', 'Calcaneus', 'T-12770', 'CALCANEUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '69105007', 'SCT', 'Carotid Artery', 'T-45010', 'CAROTID', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '113305005', 'SCT', 'Cerebellum', 'T-A6000', 'CEREBELLUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '71252005', 'SCT', 'Cervix', 'T-83200', 'CERVIX', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '51299004', 'SCT', 'Clavicle', 'T-12310', 'CLAVICLE', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '64688005', 'SCT', 'Coccyx', 'T-11BF0', 'COCCYX', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '71854001', 'SCT', 'Colon', 'T-59300', 'COLON', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '28726007', 'SCT', 'Cornea', 'T-AA200', 'CORNEA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '41801008', 'SCT', 'Coronary artery', 'T-43000', 'CORONARYARTERY', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '82680008', 'SCT', 'Digit', 'T-D0310', 'DIGIT', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '38848004', 'SCT', 'Duodenum', 'T-58200', 'DUODENUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '16953009', 'SCT', 'Elbow joint', 'T-15430', 'ELBOW', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '32849002', 'SCT', 'Esophagus', 'T-56000', 'ESOPHAGUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '66019005', 'SCT', 'Extremity', 'T-D0300', 'EXTREMITY', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '81745001', 'SCT', 'Eye', 'T-AA000', 'EYE', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '80243003', 'SCT', 'Eyelid', 'T-AA810', 'EYELID', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '89545001', 'SCT', 'Face', 'T-D1200', 'FACE', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '71341001', 'SCT', 'Femur', 'T-12710', 'FEMUR', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '87342007', 'SCT', 'Fibula', 'T-12750', 'FIBULA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '7569003', 'SCT', 'Finger', 'T-D8800', 'FINGER', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '56459004', 'SCT', 'Foot', 'T-D9700', 'FOOT', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '55060009', 'SCT', 'Frontal sinus', 'T-22200', 'FRONTALSINUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '28231008', 'SCT', 'Gallbladder', 'T-63000', 'GALLBLADDER', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '85562004', 'SCT', 'Hand', 'T-D8700', 'HAND', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '69536005', 'SCT', 'Head', 'T-D1100', 'HEAD', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '774007', 'SCT', 'Head and Neck', 'T-D1000', 'HEADNECK', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '80891009', 'SCT', 'Heart', 'T-32000', 'HEART', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '24136001', 'SCT', 'Hip joint', 'T-15710', 'HIP', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '85050009', 'SCT', 'Humerus', 'T-12410', 'HUMERUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '34516001', 'SCT', 'Ileum', 'T-58600', 'ILEUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '22356005', 'SCT', 'Ilium', 'T-12340', 'ILIUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '661005', 'SCT', 'Jaw region', 'T-D1213', 'JAW', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '21306003', 'SCT', 'Jejunum', 'T-58400', 'JEJUNUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '64033007', 'SCT', 'Kidney', 'T-71000', 'KIDNEY', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '10200004', 'SCT', 'Liver', 'T-62000', 'LIVER', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '30021000', 'SCT', 'Lower leg', 'T-D9400', 'LEG', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '39607008', 'SCT', 'Lung', 'T-28000', 'LUNG', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '91609006', 'SCT', 'Mandible', 'T-11180', 'JAW', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '70925003', 'SCT', 'Maxilla', 'T-11170', 'MAXILLA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '30518006', 'SCT', 'Navicular of forefoot', 'T-12450', 'FORENAVICULAR', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '45048000', 'SCT', 'Neck', 'T-D1600', 'NECK', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '363654007', 'SCT', 'Orbital structure', 'T-D14AE', 'ORBIT', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '15497006', 'SCT', 'Ovary', 'T-87000', 'OVARY', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '15776009', 'SCT', 'Pancreas', 'T-65000', 'PANCREAS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '45289007', 'SCT', 'Parotid gland', 'T-61100', 'PAROTID', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '64234005', 'SCT', 'Patella', 'T-12730', 'PATELLA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '816092008', 'SCT', 'Pelvis', NULL, 'PELVIS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '18911002', 'SCT', 'Penis', 'T-91000', 'PENIS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '54066008', 'SCT', 'Pharynx', 'T-55000', 'PHARYNX', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '62413002', 'SCT', 'Radius', 'T-12420', 'RADIUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '34402009', 'SCT', 'Rectum', 'T-59600', 'RECTUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '113197003', 'SCT', 'Rib', 'T-11300', 'RIB', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '79601000', 'SCT', 'Scapula', 'T-12280', 'SCAPULA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '18619003', 'SCT', 'Sclera', 'T-AA110', 'SCLERA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '20233005', 'SCT', 'Scrotum', 'T-98000', 'SCROTUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '16982005', 'SCT', 'Shoulder', 'T-D2220', 'SHOULDER', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '89546000', 'SCT', 'Skull', 'T-11100', 'SKULL', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '78961009', 'SCT', 'Spleen', 'T-C3000', 'SPLEEN', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '56873002', 'SCT', 'Sternum', 'T-11210', 'STERNUM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '53620006', 'SCT', 'Temporomandibular joint', 'T-15290', 'TMJ', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '40689003', 'SCT', 'Testis', 'T-94000', 'TESTIS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '68367000', 'SCT', 'Thigh', 'T-D9100', 'THIGH', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '76505004', 'SCT', 'Thumb', 'T-D8810', 'THUMB', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '9875009', 'SCT', 'Thymus', 'T-C8000', 'THYMUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '69748006', 'SCT', 'Thyroid', 'T-B6000', 'THYROID', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '12611008', 'SCT', 'Tibia', 'T-12740', 'TIBIA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '29707007', 'SCT', 'Toe', 'T-D9800', 'TOE', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '21974007', 'SCT', 'Tongue', 'T-53000', 'TONGUE', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '23416004', 'SCT', 'Ulna', 'T-12430', 'ULNA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '40983000', 'SCT', 'Upper arm', 'T-D8200', 'ARM', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '87953007', 'SCT', 'Ureter', 'T-73000', 'URETER', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '13648007', 'SCT', 'Urethra', 'T-75000', 'URETHRA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '35039007', 'SCT', 'Uterus', 'T-83000', 'UTERUS', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2, '76784001', 'SCT', 'Vagina', 'T-82000', 'VAGINA', 2)`
          );
          queryString.push(
            `${queryInsertBodypart} (2,'45292006', 'SCT', 'Vulva', 'T-81000', 'VULVA', 2)`
          );
        }
      }

      for (let i: number = 0; i < queryString.length; i++) {
        rows = await conn.query(queryString[i]);
      }
    } catch (err: any) {
      result = 0;
      console.log("InsertDefaultData : Failed to Fill in the tables! :" + err);
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
      console.log("InsertDefaultData : Tables are all filled up and ready!");
      return result;
    }
  }

  async insertTestData() {
    let conn, rows, result;
    result = 1;
    try {
      conn = await this.databasePool.getConnection();

      let queryString: string[] = [];
      let queryInsertUser =
        "INSERT INTO T_USER(user_id, user_level,user_name,user_pwd,user_desc) VALUES";
      let queryInsertPatient =
        "INSERT INTO T_PATIENT(pt_id, pt_name, pt_sex, pt_age, pt_birth_dttm, pt_weight, pt_size, pt_address, pt_tel, pt_allergies, pt_comment, pt_responsible_person, pt_state, pt_med_alert, pt_species_key, pt_breed_key) VALUES";
      let queryInsertOrder =
        "INSERT INTO T_ORDER(ord_pt_key, ord_acc_num, ord_issuer, ord_create_dttm, ord_status_flag, ord_requesting_phyc, ord_referring_phyc, ord_study_uid, ord_study_dttm, ord_reason, ord_priority, ord_rp_id, ord_rp_desc, ord_pt_age, ord_pt_weight, ord_pt_size) VALUES";
      let queryInsertProcPlan =
        "INSERT INTO T_PROC_PLAN(proc_plan_id, proc_plan_desc) VALUES";
      let queryInsertSps =
        "INSERT INTO T_SPS(sps_ord_key, sps_id,sps_start_dttm, sps_end_dttm, sps_station_ae_title, sps_station_name, sps_modality, sps_bp_code_value, sps_bp_scm_design, sps_bp_meaning, sps_desc, sps_perform_phyc_name, sps_contrast_agent, sps_pre_med) VALUES";
      let queryInsertProtocol =
        "INSERT INTO T_PROTOCOL(prot_id, prot_station_ae_title, prot_station_name, prot_modality, prot_desc, prot_perform_phyc_name, prot_duration, prot_bp_key) VALUES";
      let queryInsertIPpProt =
        "INSERT INTO I_PROCPLAN_PROT(pp_prot_proc_plan_key, pp_prot_prot_key) VALUES";

      let queryInsertStation =
        "INSERT INTO T_STATION(station_ae_title, station_name) VALUES";
      let qeuryInsertServer =
        "INSERT INTO T_SERVER(svr_web_port, svr_scp_ae_title, svr_scp_host_name, svr_scp_max_clients, svr_scp_dcm_port, svr_scp_web_port) VALUES";

      let queryInsertOrdReason =
        "INSERT INTO T_ORD_REASON(ord_reason_type, ord_reason_desc) VALUES";

      if (process.env.NODE_ENV != "production") {
        //PATIENT
        if ((await this.getPatientRowCount()) <= 0) {
          if (gLicenseType == myTypes.eLicenseType.Human) {
            queryString.push(
              `${queryInsertPatient} ('pt01', 'DOE^JONE^^^', 'Male', '018Y','2003-02-14 00:00:00' ,'70.11','1.62560', 'Seoul,Korea', '111-1111','','Son of Doe','','None', NULL, NULL, NULL)`
            );
            queryString.push(
              `${queryInsertPatient} ('pt02', 'LEE^JONE^^^', 'Male', '033Y','1989-10-12 00:00:00' ,'64.92','1.82880', 'Seoul,Korea', '2222-2222','','Son of LEE','','None', NULL, NULL, NULL)`
            );
            queryString.push(
              `${queryInsertPatient} ('pt03', 'DOE^JANE^^^', 'Female', '052Y','1970-11-12 00:00:00' ,'52.33','1.7272034', 'Seoul,Korea', '333-3333','','Daughter of DOE','','None', NULL, NULL, NULL)`
            );
            queryString.push(
              `${queryInsertPatient} ('pt04', 'qwertqwertasdfaqwertqwertasdfaqwertqw^ertasdfaqwertqwertasdf^^^', 'Female', '052Y','1970-11-12 00:00:00' ,'52.33','1.7272034', 'Seoul,Korea', '333-3333','','Daughter of DOE','','None', NULL, NULL, NULL)`
            );
          } else {
            queryString.push(
              `${queryInsertPatient} ('vet01', 'DOE^JONE^^^', 'Male', '003M','2022-04-14 00:00:00' ,'1.1','1.62560', 'Seoul,Korea', '111-1111','','Son of Doe','JASON','None', 'ACE Inhibitors', 1, 2)`
            );
            queryString.push(
              `${queryInsertPatient} ('vet02', 'LEE^JONE^^^', 'Other', '011Y','2011-05-04 00:00:00' ,'5.9','1.82880', 'Seoul,Korea', '2222-2222','','Son of LEE','KIM','None', 'lisinopril', 2, 4)`
            );
            queryString.push(
              `${queryInsertPatient} ('vet03', 'DOE^JANE^^^', 'Female', '005Y','2017-06-12 00:00:00' ,'8.8','1.7272034', 'Seoul,Korea', '333-3333','','Daughter of DOE','LEE','None', '', 3, 5)`
            );
            queryString.push(
              `${queryInsertPatient} ('vet04', 'qwertqwertasdfaqwertqwertasdfaqwertqw^ertasdfaqwertqwertasdf^^^', 'Female', '052Y','1970-11-12 00:00:00' ,'52.33','1.7272034', 'Seoul,Korea', '333-3333','','Daughter of DOE','JIN','None', '', 2, 9)`
            );
          }
        }

        //ORDER
        if ((await this.getOrderRowCount()) <= 0) {
          queryString.push(
            `${queryInsertOrder} (1, '2020031514000001', 'myRisWeb', NOW() ,'2','BOM','','1.3.6.1.4.1.19179.20.202003151400.3.54356.1','1988-02-14 14:00:00','Headache','1','rp01','Chest3','018Y','70.11','1.62560')`
          );
          queryString.push(
            `${queryInsertOrder} (2, '2000010101100001', 'myRisWeb', NOW() ,'2','SON','','1.3.6.1.4.1.19179.20.200001010110.3.54356.1','2000-01-01 01:10:23','DIZZINESS','2','rp01','Chest3','033Y','64.92','1.82880')`
          );
          queryString.push(
            `${queryInsertOrder} (3, '2010021203100001', 'myRisWeb', NOW() ,'2','MIN','','1.3.6.1.4.1.19179.20.201002120310.3.54356.1','2010-02-12 03:10:50','Fracture','3','rp02','Cheek1 EAR1','052Y','52.33','1.7272034')`
          );
          queryString.push(
            `${queryInsertOrder} (3, '2010021203100002', 'myRisWeb', NOW() ,'2','JI','','1.3.6.1.4.1.19179.20.201002120310.3.54356.2','2010-02-12 03:10:50','Fracture','3','rp03','Endo-rectal 4','052Y','52.33','1.7272034')`
          );
        }

        //SPS
        if ((await this.getSpsRowCount()) <= 0) {
          queryString.push(
            `${queryInsertSps} (1, 'sps01','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle01', 'Station-01', 'DR', '818981001', 'SCT', 'Abdomen', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (1, 'sps02','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle02', 'Station-02', 'DX', '128555001', 'SCT', 'Congenital coronary artery fistula to left atrium', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (1, 'sps01','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle01', 'Station-01', 'DR', '818981001', 'SCT', 'Abdomen', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (2, 'sps03','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle03', 'Station-03', 'DR', '43799004', 'SCT', 'Chest', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (2, 'sps05','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle03', 'Station-03', 'CT', '113270003', 'SCT', 'Left femoral artery', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (2, 'sps04','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle03', 'Station-03', 'MR', '34402009', 'SCT', 'Endo-rectal', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (2, 'sps06','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle03', 'Station-03', 'CT', '113270003', 'SCT', 'Left femoral artery', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (3, 'sps01','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle01', 'Station-01', 'DR', '818981001', 'SCT', 'Abdomen', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (3, 'sps02','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle02', 'Station-02', 'DX', '128555001', 'SCT', 'Congenital coronary artery fistula to left atrium', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (3, 'sps04','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle03', 'Station-03', 'MR', '34402009', 'SCT', 'Endo-rectal', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (4, 'sps01','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle01', 'Station-01', 'DR', '818981001', 'SCT', 'Abdomen', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (4, 'sps02','2021-10-05 12:01:02','2021-10-05 14:05:02', 'StAETitle02', 'Station-02', 'DX', '128555001', 'SCT', 'Congenital coronary artery fistula to left atrium', 'desc','HONG','cont-agent-2',NULL)`
          );
          queryString.push(
            `${queryInsertSps} (4, 'sps06','2021-10-06 12:01:02','2021-10-06 15:51:02', 'StAETitle03', 'Station-03', 'MR', '12738006', 'SCT', 'Brain', 'desc','LEE','cont-agent-5','pre-med2')`
          );
        }
      }

      //Procedure Plan
      if ((await this.getProcPlanRowCount()) <= 0) {
        //queryString.push(`${queryInsertProcPlan} ('none','none', 'sps01||sps02')`); // Default None
        queryString.push(`${queryInsertProcPlan} ('rp01','Chest3')`);
        queryString.push(`${queryInsertProcPlan} ('rp02','Cheek1 EAR1')`);
        queryString.push(`${queryInsertProcPlan} ('rp03','Endo-rectal 4')`);
        queryString.push(`${queryInsertProcPlan} ('rp04','Liver2 FOOT2')`);
      }

      // Protocol
      if ((await this.getProtocolRowCount()) <= 0) {
        queryString.push(
          `${queryInsertProtocol} ('sps01','StAETitle01', 'Station-01', 'DR', 'desc','LEE','60',1)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps02','StAETitle02', 'Station-02', 'DX', 'desc','HONG','45',12)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps03','StAETitle03', 'Station-03', 'DR', 'desc','KIM','15',21)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps04','StAETitle03', 'Station-03', 'MR', 'desc','HONG','25',15)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps05','StAETitle03', 'Station-03', 'CT', 'desc','LEE','95',7)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps06','StAETitle03', 'Station-03', 'MR', 'desc','SON','95',4)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps07','StAETitle01', 'Station-01', 'US', 'desc','SONY','95',31)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps08','StAETitle02', 'Station-02', 'DX', 'desc','JI','95',5)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps09','StAETitle03', 'Station-03', 'CR', 'desc','KANG','95',18)`
        );
        queryString.push(
          `${queryInsertProtocol} ('sps10','StAETitle04', 'Station-04', 'XA', 'desc','MIN','95',22)`
        );
      }

      // Insert Intersection table
      if ((await this.getIProcPlanProtRowCount()) <= 0) {
        queryString.push(`${queryInsertIPpProt} (1,1)`);
        queryString.push(`${queryInsertIPpProt} (1,2)`);
        queryString.push(`${queryInsertIPpProt} (1,1)`);
        queryString.push(`${queryInsertIPpProt} (2,3)`);
        queryString.push(`${queryInsertIPpProt} (2,5)`);
        queryString.push(`${queryInsertIPpProt} (2,4)`);
        queryString.push(`${queryInsertIPpProt} (2,6)`);
        queryString.push(`${queryInsertIPpProt} (3,1)`);
        queryString.push(`${queryInsertIPpProt} (3,2)`);
        queryString.push(`${queryInsertIPpProt} (3,4)`);
        queryString.push(`${queryInsertIPpProt} (4,1)`);
        queryString.push(`${queryInsertIPpProt} (4,2)`);
        queryString.push(`${queryInsertIPpProt} (4,6)`);
      }

      if ((await this.getStationRowCount()) <= 0) {
        queryString.push(`${queryInsertStation} ('StAETitle01',"Station-01")`);
        queryString.push(`${queryInsertStation} ('StAETitle02',"Station-02")`);
        queryString.push(`${queryInsertStation} ('StAETitle03',"Station-03")`);
        queryString.push(`${queryInsertStation} ('StAETitle04',"Station-04")`);
        queryString.push(`${queryInsertStation} ('StAETitle05',"Station-05")`);
        queryString.push(`${queryInsertStation} ('StAETitle06',"Station-06")`);
      }

      //SERVER
      if ((await this.getServerRowCount()) <= 0) {
        queryString.push(
          `${qeuryInsertServer} ('8081', 'qxMWLSVR','localhost',5, 104,0)`
        );
      }

      // T_ORD_REASON (CANCEL)
      if ((await this.getOrdReasonRowCount()) <= 0) {
        // (CREATE)
        queryString.push(
          `${queryInsertOrdReason} (${myTypes.eOrdReasonType.CREATE}, 'Headache')`
        );
        queryString.push(
          `${queryInsertOrdReason} (${myTypes.eOrdReasonType.CREATE}, 'Bleeding')`
        );
        queryString.push(
          `${queryInsertOrdReason} (${myTypes.eOrdReasonType.CREATE}, 'Broken')`
        );
        queryString.push(
          `${queryInsertOrdReason} (${myTypes.eOrdReasonType.CREATE}, 'Cancer')`
        );

        // (CANCEL)
        queryString.push(
          `${queryInsertOrdReason} (${myTypes.eOrdReasonType.CANCEL}, 'Mis-ordered')`
        );
        queryString.push(
          `${queryInsertOrdReason} (${myTypes.eOrdReasonType.CANCEL}, 'Cancel Reservation')`
        );
      }

      for (let i: number = 0; i < queryString.length; i++) {
        //console.log("index:", i);
        rows = await conn.query(queryString[i]);
      }
    } catch (err: any) {
      result = 0;
      console.log("insertTestData : Failed to Fill in the tables! :" + err);
      throw err;
    } finally {
      if (conn) {
        conn.end();
      }
      if (result == 0) {
        process.exit();
      }
      console.log("insertTestData : Tables are all filled up and ready!");
      return result;
    }
  }

  //// [GET COUNT FUNTIONS]
  // GET USER ROW COUNT
  async getUserRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_USER`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET PATIENT ROW COUNT
  async getPatientRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_PATIENT`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET ORDER ROW COUNT
  async getOrderRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_ORDER`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET RP ROW COUNT
  async getRpRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_PROC_PLAN`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET SPS ROW COUNT
  async getSpsRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_SPS`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET Procedure Plan ROW COUNT
  async getProcPlanRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_PROC_PLAN`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET Protocol ROW COUNT
  async getProtocolRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_PROTOCOL`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET Protocol Code ROW COUNT
  async getBodypartRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_BODYPART`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET I_PROCPLAN_PROT ROW COUNT
  async getIProcPlanProtRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM I_PROCPLAN_PROT`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET Station ROW COUNT
  async getStationRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_STATION`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET Order Reason ROW COUNT
  async getOrdReasonRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_ORD_REASON`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET Species ROW COUNT
  async getSpeciesRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_SPECIES`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET Breed ROW COUNT
  async getBreedRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_BREED`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }

  // GET SERVER ROW COUNT
  async getServerRowCount(): Promise<number> {
    let conn, res;
    try {
      conn = await this.databasePool.getConnection();
      res = await conn.query(`SELECT COUNT(*) AS count FROM T_SERVER`);
    } catch (err: any) {
      throw err;
    } finally {
      if (conn) conn.end();
      return res[0].count;
    }
  }
}
