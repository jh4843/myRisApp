using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data.QueryCondition
{
    public class UserQueryCondition
    {
        public int user_key { get; set; } = -1;
        public string user_level { get; set; } = string.Empty;
        public string user_id { get; set; } = string.Empty;
        public string user_name { get; set; } = string.Empty;
        public string user_pwd { get; set; } = string.Empty;
    }
}
