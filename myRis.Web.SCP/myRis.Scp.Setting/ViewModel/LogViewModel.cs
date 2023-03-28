using myRis.Web.Scp.CommonUI;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.DataProvider.Misc;
using System.Collections.Generic;

namespace myRis.Web.Scp.Setting.ViewModel
{
    public class LogViewModel : ViewModelBase<View.LogView>
    {
        readonly MainWindowViewModel _parentViewModel;

        public List<ClientInfo> ClientInfoList { get; set; }
        List<ClientInfo> _clientInfoList;

        public LogViewModel(MainWindowViewModel parentVM, View.LogView view)
           : base(view)
        {
            Logger.Instance.WriteLogDebug("LogViewModel", "LogViewModel", @"[START]");

            _parentViewModel = parentVM;

            Logger.Instance.WriteLogDebug("LogViewModel", "LogViewModel", @"[END]");
        }

        private void PreloadData()
        {
            Logger.Instance.WriteLogDebug("LogViewModel", "PreloadData", @"[START]");

            _clientInfoList = new List<ClientInfo>();
            //_clientInfoList.Add(new ClientInfo() { CallingAETitle = "aetitle1", HostName = "103.1.32.232" });
            //_clientInfoList.Add(new ClientInfo() { CallingAETitle = "aetitle2", HostName = "127.0.0.1" });
            //_clientInfoList.Add(new ClientInfo() { CallingAETitle = "aetitle3", HostName = "10.14.1.23" });

            //ClientInfoList = _clientInfoList;

            Logger.Instance.WriteLogDebug("LogViewModel", "PreloadData", @"[END]");
        }
    }
}
