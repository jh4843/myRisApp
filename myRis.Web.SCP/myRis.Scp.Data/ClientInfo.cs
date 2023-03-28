using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data
{
    // SCU Client Information
    public class ClientInfo
    {
        public string client_key { get; set; } = "0";        //Client primary key
        public string client_ae_title { get; set; }   //Calling ae title
        public string client_host_name { get; set; }  //IP address
    }
}
