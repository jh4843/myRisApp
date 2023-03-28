using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data.QueryCondition
{
    //Used For In-Application Search Condition
    public class SearchQueryCondition : QueryConditionBase
    {
        public string pt_id { get; set; } = string.Empty;
        public string pt_name { get; set; } = string.Empty;
        //
        public string sps_start_dttm_from { get; set; } = string.Empty; //= default(DateTime).ToString("yyyyMMdd"); //new DateTime(1900,01,01).ToString("yyyyMMdd");
        public string sps_start_dttm_to { get; set; } = string.Empty;   //= default(DateTime).ToString("yyyyMMdd"); //new DateTime(1900,01,01).ToString("yyyyMMdd");
        //
        public string ord_acc_num { get; set; } = string.Empty;
        public string ord_rp_id { get; set; } = string.Empty;
        public string sps_modality { get; set; } = string.Empty;
        public string ord_referring_phyc { get; set; } = string.Empty;
        public string ord_status { get; set; } = string.Empty;
    }
}