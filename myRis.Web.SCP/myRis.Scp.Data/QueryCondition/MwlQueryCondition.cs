using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data.QueryCondition
{
    //Used As DICOM SCU Search Condition
    //SUPPORTED DICOM TAG FOR QUERY MATCHING WITH SCU DICOM
    public class MwlQueryCondition : QueryConditionBase
    {
        //PATIENT
        public string pt_id { get; set; } = string.Empty;
        public string pt_name { get; set; } = string.Empty;

        //ORDER
        public string ord_acc_num { get; set; } = string.Empty;

        //RP
        public string ord_rp_id { get; set; } = string.Empty;
        public string rp_study_uid { get; set; } = string.Empty;

        //SPS
        public string sps_id { get; set; } = string.Empty;
        public string sps_modality { get; set; } = string.Empty;
        public string sps_start_dttm_from { get; set; } = string.Empty;
        public string sps_start_dttm_to { get; set; } = string.Empty;
        public string sps_station_ae_title { get; set; } = string.Empty;

        public string timezone_offset_from_utc { get; set; } = string.Empty;

        #region Below is currenlty not supported!
        //------------------------------------------------------------------------------------------------
        //### Below is currenlty not supported!
        //public string ord_inst_name { get; set; }           //TAG_INSTITUTION_NAME
        //public string ord_referring_phyc { get; set; }      //TAG_REFERRING_PHYSICIAN_NAME
        //public string pt_birth_dttm { get; set; }           //TAG_PATIENT_BIRTH_DATE
        //public string pt_sex { get; set; }                  //TAG_PATIENT_SEX
        //public string pt_weight { get; set; }               //TAG_PATIENT_WEIGHT
        //public string ord_requesting_phyc { get; set; }     //TAG_REQUESTING_PHYSICIAN
        //public string rp_desc { get; set; }                 //TAG_REQUESTED_PROCEDURE_DESCRIPTION
        //public string pt_admission_id { get; set; }         //TAG_ADMISSION_ID
        //public string sps_perform_phyc_name { get; set; }   //TAG_SCHEDULED_PERFORMING_PHYSICIAN_NAME
        //public string sps_desc { get; set; }                //TAG_SCHEDULED_PROCEDURE_STEP_DESCRIPTION
        //public string sps_location { get; set; }            //TAG_SCHEDULED_PROCEDURE_STEP_LOCATION
        //public string rp_reason { get; set; }               //TAG_REASON_FOR_THE_REQUESTED_PROCEDURE
        //public string rp_priority { get; set; }             //TAG_REQUESTED_PROCEDURE_PRIORITY
        #endregion
    }
}
