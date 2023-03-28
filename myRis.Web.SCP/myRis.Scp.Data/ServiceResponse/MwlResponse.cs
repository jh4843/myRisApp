using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data.ServiceResponse
{
    public class MwlResponse : ServiceResponseBase
    {
        public List<MwlItem> data { get; set; }
    }
}
