using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data
{
    public class ServerInfo
    {
        public string AETitle { get; set; }  //called AE title

        public string HostName { get; set; } //localhost

        public int DcmPort { get; set; }  //50104

        public int WebPort { get; set; }  //50080

        public int MaxConn { get; set; }  //5
    }
}
