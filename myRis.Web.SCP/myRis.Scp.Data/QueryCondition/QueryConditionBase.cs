using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data.QueryCondition
{
    //startIndex : (reqPage-1)*reqCount 
    //Limit startIndex, count
    public class QueryConditionBase
    {
        public int reqCount { get; set; } = 1; // 50;
        public int reqPage { get; set; } = 1;   //1   
        public string reqSortColumn { get; set; } = "T_SPS.sps_id";
        public string reqSortOrder { get; set; } = "asc";
        public bool? is_strict_condition { get; set; } = false;  // SPS start date not used in the query
    }
}
