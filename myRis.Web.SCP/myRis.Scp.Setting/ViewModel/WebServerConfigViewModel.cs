using myRis.Web.Scp.CommonUI;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.DataProvider;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceProcess;
using System.Threading;
using System.Windows;
using System.Windows.Controls;

namespace myRis.Web.Scp.Setting.ViewModel
{
    public class WebServerConfigViewModel : ViewModelBase<View.WebConfigView>
    {
        readonly MainWindowViewModel _parentViewModel;
        string _serverStatus = string.Empty;
        List<string> _licenseTypeList;
        SaveBtnActions _curSaveBtnActions;

        #region ENUM
        public enum ServerStatusType
        {
            Installed, Uninstalled, Stopped, Running
        }

        private enum SaveBtnActions
        {
            Save, Stop
        }
        #endregion

        #region PROPERTIES
        public WebServerInfo ServerInfo { get; set; }

        public string ServerStatus
        {
            get
            {
                return _serverStatus;
            }
            set
            {
                _serverStatus = value;
                OnPropertyChanged(nameof(ServerStatus));
            }
        }

        public List<string> LicenseTypeList { get; set; }
        #endregion

        #region METHODS
        public WebServerConfigViewModel(MainWindowViewModel parentVM, View.WebConfigView view)
           : base(view)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "WebServerConfigViewModel", @"[START]");

            _parentViewModel = parentVM;
            ServerStatus = nameof(ServerStatusType.Stopped);

            // License type
            LicenseProvider.Instance.GetLicense();

            //View.btnInstallWebService.Click += BtnInstallService_Click;
            //View.btnUnInstallWebService.Click += BtnUnInstallService_Click;
            //View.btnWebServerStart.Click += BtnStartWebServer_Click;
            //View.btnWebServerStop.Click += BtnStopWebServer_Click;
            //View.btnWebServerClear.Click += BtnClearWebServer_Click;
            View.btnSaveServer.Click += BtnSaveServer_Click;

            View.cbxLicense.AddHandler(ComboBox.SelectionChangedEvent, (RoutedEventHandler)ComboLicenseType_SelectionChanged);
            View.cbxLicense.IsEnabled = false;

            string invalidMsg = @"Invalid";
            if (LicenseProvider.Instance.StandAloneSCP)
                invalidMsg = "Select the license.";

            _licenseTypeList = new List<string>();
            _licenseTypeList.Add(invalidMsg);
            _licenseTypeList.Add(@"Human");
            _licenseTypeList.Add(@"Veterinary");
            _licenseTypeList.Add(@"Demo");
            LicenseTypeList = _licenseTypeList;

            // Web server info
            ServerInfo = GlobalConfiguration.WebServerInfo;

            if (LicenseProvider.Instance.StandAloneSCP)
            {
                // SCP 단독 실행
                // License 설정 가능
                LicenseProvider.Instance.SetLicense(ServerInfo.licenseType);

                if(0 == ServerInfo.licenseType)
                    View.cbxLicense.IsEnabled = true;
            }
            //else
            //{
            //    // myRis 라이센스 따름
            //    // License combobox 불가
            //    View.cbxLicense.IsEnabled = false;
            //}

            view.cbxLicense.SelectedIndex = (int)LicenseProvider.Instance.CurLicenseType;

            // Current web server service status
            ServiceControllerStatus outDcmSrvStat = ServiceControllerStatus.Stopped;
            if (true == WindowsServiceManager.GetServerServiceStatus(out outDcmSrvStat))
            {
                switch (outDcmSrvStat)
                {
                    case ServiceControllerStatus.Running:
                        {
                            ServerStatus = nameof(ServerStatusType.Running);
                            _curSaveBtnActions = SaveBtnActions.Stop;
                            UpdateSaveBtnUI(SaveBtnActions.Stop);
                        }
                        break;
                    case ServiceControllerStatus.Stopped:
                        {
                            ServerStatus = nameof(ServerStatusType.Stopped);
                            _curSaveBtnActions = SaveBtnActions.Save;
                            UpdateSaveBtnUI(SaveBtnActions.Save);
                        }
                        break;
                    default:
                        {
                            ServerStatus = nameof(ServerStatusType.Installed);
                            _curSaveBtnActions = SaveBtnActions.Save;
                            UpdateSaveBtnUI(SaveBtnActions.Save);
                        }
                        break;
                }
            }
            else
            {
                ServerStatus = nameof(ServerStatusType.Uninstalled);
                _curSaveBtnActions = SaveBtnActions.Save;
                UpdateSaveBtnUI(SaveBtnActions.Save);
            }

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "WebServerConfigViewModel", @"[END]");
        }

        private void BtnInstallService_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnInstallService_Click", @"[START]");

            if (string.IsNullOrEmpty(ServerInfo.alias) || 0 > ServerInfo.port ||
                string.IsNullOrEmpty(ServerInfo.hostName))
            {
                MessageBox.Show(@"Check your web server Info.");
                return;
            }

            // 설정 저장
            DataProvider.Misc.GlobalConfiguration.SetWebServerInfoValue(ServerInfo, GlobalConfiguration.CommonInfo);

            bool result = WindowsServiceManager.InstallWebServerService();
            string msg = @"web service installation has failed.";

            if (result)
            {
                IsWebServerInfoEditable(false);

                if (WindowsServiceManager.GetServerServiceStatus(out ServiceControllerStatus serverStatus) && (ServiceControllerStatus.Running == serverStatus))
                {
                    msg = @"Web server service has started.";
                    ServerStatus = nameof(ServerStatusType.Running);
                }
                else
                {
                    msg = @"web server service installation has successfully completed.";
                    ServerStatus = nameof(ServerStatusType.Installed);
                }
            }

            MessageBox.Show(msg);
            Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "BtnInstallService_Click", msg);

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnInstallService_Click", @"[END]");
        }

        private void BtnUnInstallService_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnUnInstallService_Click", @"[START]");

            bool result = WindowsServiceManager.UninstallWebServerService();
            string msg = result ? @"web server service uninstallation has successfully completed." : @"web server service uninstallation has failed.";

            if (result)
            {
                IsWebServerInfoEditable(true);
                ServerStatus = nameof(ServerStatusType.Uninstalled);
            }

            MessageBox.Show(msg);
            Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "BtnUnInstallService_Click", msg);

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnUnInstallService_Click", @"[END]");
        }

        private void BtnStartWebServer_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnStartWebServer_Click", @"[START]");

            string msg;
            bool result = false;
            ServiceControllerStatus serverStatus;

            if (WindowsServiceManager.GetServerServiceStatus(out serverStatus) && (ServiceControllerStatus.Running == serverStatus))
            {
                msg = @"Web server service has already been running.";
                MessageBox.Show(msg);
                Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "BtnStartWebServer_Click", msg);
                return;
            }

            if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.ServerService, WindowsServiceManager.ServiceOperation.Start))
            {
                if (WindowsServiceManager.GetServerServiceStatus(out serverStatus))
                {
                    if (ServiceControllerStatus.Running == serverStatus)
                    {
                        result = true;
                    }
                }
            }

            msg = result ? @"Web server service has started." : @"Web server service has not started.";

            if (result)
            {
                ServerStatus = nameof(ServerStatusType.Running);
            }

            MessageBox.Show(msg);
            Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "BtnStartWebServer_Click", msg);

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnStartWebServer_Click", @"[END]");
        }

        private void BtnStopWebServer_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnStopWebServer_Click", @"[START]");

            bool result = false;

            if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.ServerService, WindowsServiceManager.ServiceOperation.Stop))
            {
                if (WindowsServiceManager.GetServerServiceStatus(out ServiceControllerStatus serverStatus))
                {
                    if (ServiceControllerStatus.Stopped == serverStatus)
                    {
                        result = true;
                    }
                }
            }

            string msg = result ? @"Web server service has stopped." : @"Web server service has not stopped.";

            if (result)
            {
                ServerStatus = nameof(ServerStatusType.Stopped);
            }

            MessageBox.Show(msg);
            Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "BtnStopWebServer_Click", msg);

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnStopWebServer_Click", @"[END]");
        }

        private void BtnClearWebServer_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnClearWebServer_Click", @"[START]");

            if (ServerStatus == nameof(ServerStatusType.Stopped))
            {
                ServerInfo.alias = View.tbxWebServerAETitle.Text = String.Empty;
                ServerInfo.hostName = View.tbxWebServerHostName.Text = String.Empty;
                ServerInfo.port = 0; View.tbxWebServerPort.Text = "0";
            }
            else
            {
                MessageBox.Show(@"Please, Stop the Web server first.");
            }

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnClearWebServer_Click", @"[END]");
        }

        private void BtnSaveServer_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnSaveServer_Click", @"[START]");

            switch (_curSaveBtnActions)
            {
                case SaveBtnActions.Stop:
                    {
                        if (true == SaveBtnActionStop())
                        {
                            _curSaveBtnActions = SaveBtnActions.Save;
                            UpdateSaveBtnUI(SaveBtnActions.Save);
                        }
                    }
                    break;
                case SaveBtnActions.Save:
                    {
                        if (LicenseProvider.Instance.StandAloneSCP)
                        {
                            if (0 == ServerInfo.licenseType)
                            {
                                MessageBox.Show("Select your license.");
                                return;
                            }
                            else
                            {
                                View.cbxLicense.IsEnabled = false;
                            }
                        }

                        // 설정 저장
                        DataProvider.Misc.GlobalConfiguration.SetWebServerInfoValue(ServerInfo, GlobalConfiguration.CommonInfo);
                        if (true == SaveBtnActionSave())
                        {
                            _curSaveBtnActions = SaveBtnActions.Stop;
                            UpdateSaveBtnUI(SaveBtnActions.Stop);
                        }
                    }
                    break;
            }

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "BtnSaveServer_Click", @"[END]");
        }

        private bool SaveBtnActionSave()
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "SaveBtnActionSave", @"[START]");

            bool result = false;
            bool svrInstallNStart = false;

            if (true == WindowsServiceManager.ExistService(WindowsServiceManager.TargetService.ServerService))
            {
                // 서비스 중단 후 시작
                Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(1)Exist WEB SERVER service(installed)");

                if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.ServerService, WindowsServiceManager.ServiceOperation.Stop))
                {
                    Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(2)Stop WEB SERVER service");

                    if (WindowsServiceManager.GetServerServiceStatus(out ServiceControllerStatus serverStatus))
                    {
                        if (ServiceControllerStatus.Stopped == serverStatus)
                        {
                            ServerStatus = nameof(ServerStatusType.Stopped);

                            if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.ServerService, WindowsServiceManager.ServiceOperation.Start))
                            {
                                Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(3)Start WEB SERVER service");

                                if (WindowsServiceManager.GetServerServiceStatus(out serverStatus))
                                {
                                    if (ServiceControllerStatus.Running == serverStatus)
                                    {
                                        ServerStatus = nameof(ServerStatusType.Installed);
                                        svrInstallNStart = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                // 서비스 설치 후 시작
                ServerStatus = nameof(ServerStatusType.Uninstalled);
                Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(1)Not exists WEB SERVER service");

                // daemon 폴더가 존재할 경우 삭제한다.
                string rootPath = AppDomain.CurrentDomain.BaseDirectory;
                rootPath = rootPath.Substring(0, rootPath.LastIndexOf('\\'));
                rootPath = rootPath.Substring(0, rootPath.LastIndexOf('\\'));

                string targetDirectory = string.Format(@"{0}\myRisWeb\daemon", rootPath);

                Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", string.Format(@"(1-1)Find daemon folder - path: {0}", targetDirectory));

                DirectoryInfo drInfo = new DirectoryInfo(targetDirectory);
                if (true == drInfo.Exists)
                {
                    drInfo.Delete(true);
                    Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(1-1)delete daemon folder - success");
                }
                else
                {
                    Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(1-1)not exist daemon folder");
                }

                svrInstallNStart = WindowsServiceManager.InstallWebServerService();
                bool serverServiceStatus = WindowsServiceManager.GetServerServiceStatus(out ServiceControllerStatus serverStatus);

                if ((true == svrInstallNStart) && (true == serverServiceStatus) && (ServiceControllerStatus.Stopped == serverStatus || ServiceControllerStatus.Running == serverStatus))
                {
                    ServerStatus = nameof(ServerStatusType.Installed);
                    Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(2)Install WEB SERVER service");

                    Thread.Sleep(1000);

                    if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.ServerService, WindowsServiceManager.ServiceOperation.Start))
                    {
                        Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", "(3)Start WEB SERVER service");

                        if (WindowsServiceManager.GetServerServiceStatus(out serverStatus))
                        {
                            if (ServiceControllerStatus.Running == serverStatus)
                            {
                                svrInstallNStart = true;
                            }
                            else
                            {
                                svrInstallNStart = false;
                            }
                        }
                    }
                }
                else
                {
                    ServerStatus = nameof(ServerStatusType.Uninstalled);
                }
            }

            bool isAliveServer = false;
            if (svrInstallNStart)
            {
                isAliveServer = WebDataProvider.Instance.IsAliveServerSevice();

                if (isAliveServer)
                {
                    ServerStatus = nameof(ServerStatusType.Running);
                    result = true;
                }
            }

            string resultMsg = string.Format("Server Install & Start - {0}, Alive Server - {1}", svrInstallNStart ? "true" : "false", isAliveServer ? "true" : "false");
            Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionSave", resultMsg);

            string msg = (svrInstallNStart && isAliveServer) ? "WEB SERVER service has started." : "WEB SERVER service has not started.";
            MessageBox.Show(msg);

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "SaveBtnActionSave", @"[END]");

            return result;
        }

        private bool SaveBtnActionStop()
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "SaveBtnActionStop", @"[START]");

            bool result = false;

            // 서비스 중단 후 시작

            if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.ServerService, WindowsServiceManager.ServiceOperation.Stop))
            {
                if (WindowsServiceManager.GetServerServiceStatus(out ServiceControllerStatus serverStatus))
                {
                    if (ServiceControllerStatus.Stopped == serverStatus)
                    {
                        Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionStop", "Stop web server service - success");
                        ServerStatus = nameof(ServerStatusType.Stopped);
                        result = true;
                    }
                    else
                    {
                        Logger.Instance.WriteLogInfo("WebServerConfigViewModel", "SaveBtnActionStop", "Stop web server service - failed");
                    }
                }
            }
             
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "SaveBtnActionStop", @"[END]");

            return result;
        }

        private void UpdateSaveBtnUI(SaveBtnActions inSaveBtnActions)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "UpdateSaveBtnUI", "[START]");

            switch (inSaveBtnActions)
            {
                case SaveBtnActions.Stop:
                    {
                        View.btnSaveServer.Content = "       Stop       ";
                    }
                    break;
                case SaveBtnActions.Save:
                    {
                        View.btnSaveServer.Content = "       Save       ";
                    }
                    break;
            }

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "UpdateSaveBtnUI", @"[END]");
        }

        private void IsWebServerInfoEditable(bool editStatus)
        {
            string param = string.Format(@"editStatus : {0}", editStatus);
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "IsWebServerInfoEditable", @"[START]" + param);

            View.tbxWebServerAETitle.IsReadOnly = !editStatus;
            View.tbxWebServerHostName.IsReadOnly = !editStatus;
            View.tbxWebServerPort.IsReadOnly = !editStatus;
            //View.tbxWebServerMacAddress.IsReadOnly = !editStatus;
            //View.cbxLicense.IsEnabled = !editStatus;

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "IsWebServerInfoEditable", @"[END]");
        }

        private void ComboLicenseType_SelectionChanged(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "ComboLicenseType_SelectionChanged", @"[START]");

            int currentIndex = View.cbxLicense.SelectedIndex;

            LicenseProvider.Instance.SetLicense(currentIndex);
            ServerInfo.licenseType = currentIndex;

            // 설정 저장
            GlobalConfiguration.SetWebServerInfoValue(ServerInfo, GlobalConfiguration.CommonInfo);

            Logger.Instance.WriteLogDebug("WebServerConfigViewModel", "ComboLicenseType_SelectionChanged", @"[END]");
        }
        #endregion
    }
}