using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data
{
    public class WebServerInfo
    {
        public string alias { get; set; }
        public string hostName { get; set; }
        public int port { get; set; }
        public int licenseType { get; set; }
    }
}