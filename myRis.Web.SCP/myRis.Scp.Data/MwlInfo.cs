using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data
{
    public class MwlItem
    {
        //Keys
        public int pt_key { get; set; }
        public int ord_key { get; set; }
        public int rp_key { get; set; }
        public int sps_key { get; set; }

        //Datas to Show On the List 
        // Patient
        public string pt_id { get; set; }
        public string pt_name { get; set; }
        public string pt_sex { get; set; }
        public DateTime pt_birth_dttm { get; set; }

        // Order
        public string ord_acc_num { get; set; }
        public string ord_requesting_phyc { get; set; }
        public string ord_referring_phyc { get; set; }
        public string ord_rp_desc { get; set; }
        public string ord_status_flag { get; set; }

        // RP
        public string ord_rp_id { get; set; }

        // STUDY
        public string ord_study_uid { get; set; }
        public DateTime ord_study_dttm { get; set; }

        // SPS
        public string sps_id { get; set; }
        public DateTime sps_start_dttm { get; set; }
        public string sps_station_name { get; set; }
        public string sps_modality { get; set; }
        public string sps_perform_phyc_name { get; set; } //performing 
        public string sps_pre_med { get; set; }
        public string sps_desc { get; set; }

        // sps station aetitle  
        public string sps_station_ae_title { get; set; }

        #region VETERINARY
        // Species
        public string species_code_value { get; set; }
        public string species_scm_design { get; set; }
        public string species_code_meaning { get; set; }

        // Breed
        public string breed_code_value { get; set; }
        public string breed_scm_design { get; set; }
        public string breed_code_meaning { get; set; }

        // Patient species code sequence
        public string patient_species_code_sequence
        {
            get
            {
                return string.Format(@"{0}:{1}:{2}", species_code_value, species_scm_design, species_code_meaning);
            }
        }

        // Pateint breed code seqeuence
        public string patient_breed_code_sequence
        {
            get
            {
                return string.Format(@"{0}:{1}:{2}", breed_code_value, breed_scm_design, breed_code_meaning);
            }
        }

        // Responsible person
        public string pt_responsible_person { get; set; }
        #endregion
    }
}
