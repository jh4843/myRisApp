using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data.ServiceResponse
{
    public class ServiceResponseBase
    {
        public bool result { get; set; }

        public string err_code { get; set; }
    }
}
