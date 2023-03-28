using Leadtools.Dicom;
using myRis.Web.Scp.CommonUI;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.DataProvider;
using myRis.Web.Scp.DataProvider.Misc;
using myRis.Web.Scp.Dicom;
using myRis.Web.Scp.Dicom.Common;
using myRis.Web.Scp.Setting.ViewModel;
using System;

namespace myRis.Web.Scp.Setting
{
    public class MainWindowViewModel : ViewModelBase<MainWindow>
    {
        #region Properties For External Access
        //SCP DICOM SERVER
        private DicomServer _dicomServer;
        public DicomServer DicomServer { get; set; }

        //EACH VIEWMODEL  
        private ConfigViewModel _configVM;
        public ConfigViewModel ConfigVM { get; }

        private WebServerConfigViewModel _webServerConfigVM;
        public WebServerConfigViewModel WebServerConfigVM { get; }

        private ToolbarViewModel _toolbarVM;
        public ToolbarViewModel ToolbarVM { get; }

        //private MwlListViewModel _mwlListVM;
        //public MwlListViewModel MwlVM { get; }

        private LogViewModel _logVM;
        public LogViewModel LogVM { get; }
        #endregion

        #region METHODS
        public MainWindowViewModel(MainWindow view)
             : base(view)
        {
            Logger.Instance.WriteLogDebug("MainWindowViewModel", "MainWindowViewModel", @"[START]");

            //GetServerInfo(); //Login 통해 Viewer 오픈시 // App()에서 this.StartupUri 주석도 해제

            //Init Global configuration
            GlobalConfiguration.InitConfiguration();

            //Get ready for web data provider
            WebDataProvider.Instance.GetReadyForDataProvider();

            //Creating ViewModels & Injecting DataContext 
            _configVM = new ConfigViewModel(this, view.configView);
            _configVM.View.DataContext = _configVM;

            _webServerConfigVM = new WebServerConfigViewModel(this, view.WebConfigView);
            _webServerConfigVM.View.DataContext = _webServerConfigVM;

            _toolbarVM = new ToolbarViewModel(this, view.ToolbarView);
            _toolbarVM.View.DataContext = _toolbarVM;

            //_mwlListVM = new MwlListViewModel(this, view.mwlView);
            //_mwlListVM.View.DataContext = _mwlListVM;

            //_logVM = new LogViewModel(this, view.logView);
            //_logVM.View.DataContext = _logVM;

            //view.tabControl.Drop += TabControl_Drop;
            View.Closed += View_Closed;

            Logger.Instance.WriteLogDebug("MainWindowViewModel", "MainWindowViewModel", @"[END]");
        }

        private void View_Closed(object sender, EventArgs e)
        {
            Logger.Instance.WriteLogDebug("MainWindowViewModel", "View_Closed", @"[START]");

            //#if DEBUG
            //    TurnOffTheDicomServer();
            //    WindowsServiceManager.StopDicomService();
            //    WindowsServiceManager.DeleteDicomService();
            //    WindowsServiceManager.UninstallWebServerService();

            //    Utils.DicomNetShutdown();
            //    Utils.EngineShutdown();
            //#endif

            Logger.Instance.WriteLogDebug("MainWindowViewModel", "View_Closed", @"[END]");
        }

        private void TabControl_Drop(object sender, System.Windows.DragEventArgs e)
        {
            throw new NotImplementedException();
        }

        public bool TurnOffTheDicomServer()
        {
            Logger.Instance.WriteLogDebug("MainWindowViewModel", "TurnOffTheDicomServer", @"[START]");

            bool result = true;
            try
            {
                if (_dicomServer == null)
                {
                    result = false;
                }
                else
                {
                    _dicomServer.Close();
                }
            }
            catch (Exception ex)
            {
                result = false;
                Logger.Instance.WriteLogError("MainWindowViewModel", "TurnOffTheDicomServer", ex.Message);
            }

            Logger.Instance.WriteLogDebug("MainWindowViewModel", "TurnOffTheDicomServer", @"[END]");

            return result;
        }

        public bool TurnOnTheDicomServer(ServerInfo serverInfo)
        {
            Logger.Instance.WriteLogDebug("MainWindowViewModel", "TurnOnTheDicomServer", @"[START]");

            bool result = true;

            try
            {
                _dicomServer = new DicomServer();

                Utils.EngineStartup();
                Utils.DicomNetStartup();
                _dicomServer.CalledAE = serverInfo.AETitle;
                _dicomServer.IPAddress = serverInfo.HostName;
                _dicomServer.Port = serverInfo.DcmPort;
                _dicomServer.Peers = serverInfo.MaxConn;

                if (DicomExceptionCode.Success != _dicomServer.Listen())
                {
                    result = false;
                }
            }
            catch (Exception ex)
            {
                result = false;
                Logger.Instance.WriteLogError("MainWindowViewModel", "TurnOnTheDicomServer", ex.Message);
            }

            Logger.Instance.WriteLogDebug("MainWindowViewModel", "TurnOnTheDicomServer", @"[END]");

            return result;
        }
#endregion
    }
}