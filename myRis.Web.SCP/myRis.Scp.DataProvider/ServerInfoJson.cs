using myRis.Web.Scp.Data;
using System.Collections.Generic;

namespace myRis.Web.Scp.DataProvider
{
    public class ServerInfoJson
    {
        public ServerInfo ServerInfos { get; set; }

        public bool AllowClients { get; set; }

        public int LogLevel { get; set; }

        public string InboundChartSet { get; set; }

        public List<ClientInfo> ClientInfoList { get; set; }
    }
}