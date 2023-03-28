using myRis.Web.Scp.CommonUI;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.ServiceProcess;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media;

namespace myRis.Web.Scp.Setting.ViewModel
{
    public class ConfigViewModel : ViewModelBase<View.ConfigView>
    {
        #region ENUM
        public enum ServerStatusType
        {
            Installed, Uninstalled, Stopped, Running
        }

        //Selected : listview item selected
        //OK : Edit OK
        public enum ClientInfoBtnActions
        {
            Add = 1, Edit, Delete, OK, Cancel, Selected
        }

        private enum SaveBtnActions
        {
            Save, Stop
        }
        #endregion

        #region Variable
        readonly MainWindowViewModel _parentViewModel;

        List<ClientInfo> _clientInfoList;

        string _serverAccessMsg = string.Empty;

        string _serverStatus = string.Empty;

        List<string> _logLevelList;

        ObservableCollection<CharacterSet> _isoCharacters;

        bool _initApp = true;

        private SaveBtnActions _curSaveBtnActions;
        #endregion

        #region Properties
        public ServerInfo ServerInfo { get; set; }

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

        public List<ClientInfo> ClientInfoList
        {
            get { return _clientInfoList; }
            set
            {
                _clientInfoList = value;
                OnPropertyChanged(nameof(ClientInfoList));
            }
        }

        public string ServerAccessMsg
        {
            get { return _serverAccessMsg; }
            set
            {
                _serverAccessMsg = value;
                OnPropertyChanged(nameof(ServerAccessMsg));
            }
        }

        public List<string> LogLevelList { get; set; }

        public List<string> CharList { get; set; }

        public ObservableCollection<CharacterSet> CharacterSets
        {
            get { return _isoCharacters; }
            set { _isoCharacters = value; }
        }
        #endregion

        #region Constructor & Load
        public ConfigViewModel(MainWindowViewModel parentVM, View.ConfigView view)
           : base(view)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "ConfigViewModel", @"[START]");

            _parentViewModel = parentVM;

            _clientInfoList = new List<ClientInfo>();

            LoadPreData();

            //View.btnInstallDcmService.Click += BtnInstallService_Click;
            //View.btnUnInstallDcmService.Click += BtnUnInstallService_Click;
            //View.btnStartServer.Click += BtnStartServer_Click;
            //View.btnStopServer.Click += BtnStopServer_Click;
            //View.btnClear.Click += BtnClear_Click;              //reset
            View.btnSaveServer.Click += BtnSaveServer_Click;

            View.stkpBtnList.AddHandler(ButtonBase.ClickEvent, (RoutedEventHandler)StkpBtnList_Click);

            View.lstClientInfo.SelectionChanged += LstClientInfo_SelectionChanged;

            // Client Server Access Check
            View.cbxServerAccess.Checked += CbxServerAccess_Checked;
            View.cbxServerAccess.Unchecked += CbxServerAccess_Unchecked;

            View.expServerAccess.Expanded += ExpServerAccess_Expanded;

            // Log level
            view.cbxLogLevel.AddHandler(ComboBox.SelectionChangedEvent, (RoutedEventHandler)ComboLogLevel_SelectionChanged);
            view.cbxLogLevel.SelectedIndex = (int)GlobalConfiguration.DicomServerLogLevel;

            // Character set
            view.cbxCharSet.AddHandler(ComboBox.SelectionChangedEvent, (RoutedEventHandler)ComboCharacterSet_SelectionChanged);
            var findItem = _isoCharacters.IndexOf(_isoCharacters.Where(X => X.IsoRegistrationNumber == GlobalConfiguration.SpecificCharSet).FirstOrDefault());
            if (findItem != -1)
            {
                view.cbxCharSet.SelectedIndex = findItem;
            }
            else
            {
                view.cbxCharSet.SelectedIndex = 0;
            }

            // Current DICOM service status
            ServiceControllerStatus outDcmSrvStat = ServiceControllerStatus.Stopped;
            if (true == WindowsServiceManager.GetDICOMServiceStatus(out outDcmSrvStat))
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

            _initApp = false;

            Logger.Instance.WriteLogDebug("ConfigViewModel", "ConfigViewModel", @"[END]");
        }

        private void ExpServerAccess_Expanded(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "ExpServerAccess_Expanded", @"[START]");

            LoadClientData();

            Logger.Instance.WriteLogDebug("ConfigViewModel", "ExpServerAccess_Expanded", @"[END]");
        }

        private void CbxServerAccess_Unchecked(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "CbxServerAccess_Unchecked", @"[START]");

            _serverAccessMsg = string.Format("{0}", View.TryFindResource("langServerAccessNormal"));
            ServerAccessMsg = _serverAccessMsg;

            View.cbxServerAccess.Foreground = Brushes.Black;

            if (GlobalConfiguration.IsClientVerificationActivated != View.cbxServerAccess.IsChecked.Value)
            {
                GlobalConfiguration.IsClientVerificationActivated = View.cbxServerAccess.IsChecked.Value;
                SaveServerConfig();
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "CbxServerAccess_Unchecked", @"[END]");
        }

        private void CbxServerAccess_Checked(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "CbxServerAccess_Checked", @"[START]");

            _serverAccessMsg = string.Format("{0}", View.TryFindResource("langServerAccessLimited"));
            ServerAccessMsg = _serverAccessMsg;

            View.cbxServerAccess.Foreground = Brushes.RosyBrown;

            View.expServerAccess.IsExpanded = true;

            if (GlobalConfiguration.IsClientVerificationActivated != View.cbxServerAccess.IsChecked.Value)
            {
                GlobalConfiguration.IsClientVerificationActivated = View.cbxServerAccess.IsChecked.Value;
                SaveServerConfig();
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "CbxServerAccess_Checked", @"[END]");
        }

        private void LoadPreData()
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "LoadPreData", @"[START]");

            ServerStatus = nameof(ServerStatusType.Stopped);

            _serverAccessMsg = string.Format("{0}", View.TryFindResource("langServerAccessNormal"));
            ServerAccessMsg = _serverAccessMsg;

            ServerInfo = GlobalConfiguration.ServerInfo;
            View.cbxServerAccess.IsChecked = GlobalConfiguration.IsClientVerificationActivated;

            Application.Current.Dispatcher.Invoke(() => LoadClientData());

            _logLevelList = new List<string>
            {
                "Error",
                "Information",
                "All"
            };

            LogLevelList = _logLevelList;

            _isoCharacters = new ObservableCollection<CharacterSet>();
            LoadCharacterSet();
            CharacterSets = _isoCharacters;

            Logger.Instance.WriteLogDebug("ConfigViewModel", "LoadPreData", @"[END]");
        }

        private void LoadClientData()
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "LoadClientData", @"[START]");

            try
            {
                #region Legarcy code
                //Load Client Info From DB
                //_clientInfoList = await WebDataProvider.Instance.GetClientList();
                //ClientInfoList = _clientInfoList;
                #endregion

                _clientInfoList.Clear();

                List<ClientInfo> loadClientInfo = new();

                foreach (ClientInfo clientInfo in GlobalConfiguration.ClientList)
                {
                    {
                        loadClientInfo.Add(clientInfo);
                    }
                }

                _clientInfoList = loadClientInfo;
                ClientInfoList = _clientInfoList;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("ConfigViewModel", "LoadClientData", ex.Message);
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "LoadClientData", @"[END]");
        }
        #endregion

        #region Client Related
        private void StkpBtnList_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "StkpBtnList_Click", @"[START]");

            FrameworkElement source = e.Source as FrameworkElement;

            switch (source.Name)
            {
                case "btnAdd":
                    ButtonActionOnClientBy(ClientInfoBtnActions.Add);
                    break;
                case "btnEdit":
                    ButtonActionOnClientBy(ClientInfoBtnActions.Edit);
                    break;
                case "btnDelete":
                    ButtonActionOnClientBy(ClientInfoBtnActions.Delete);
                    break;
                case "btnOk":
                    ButtonActionOnClientBy(ClientInfoBtnActions.OK);
                    break;
                case "btnCancel":
                    ButtonActionOnClientBy(ClientInfoBtnActions.Cancel);
                    break;
                default:
                    break;
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "StkpBtnList_Click", @"[END]");
        }

        private void ButtonActionOnClientBy(ClientInfoBtnActions actionType)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "ButtonActionOnClientBy", @"[START]");

            try
            {
                ClientInfo selectedClientInfo = View.lstClientInfo.SelectedItem as ClientInfo;

                ClientInfo tbxClientInfo = new()
                {
                    client_ae_title = View.tbxCallingAETitle.Text,
                    client_host_name = View.tbxClientHostName.Text
                };

                bool result = false;

                if (actionType == ClientInfoBtnActions.Add)
                {
                    if (!IsClientInfoValid(tbxClientInfo, actionType))
                    {
                        return;
                    }

                    #region #region Legarcy code - Save into DB
                    ////Save into DB
                    //bool result = await WebDataProvider.Instance.InsertClient(tbxClientInfo);

                    ////Reload client info
                    //ClientInfoList = await WebDataProvider.Instance.GetClientList();
                    #endregion

                    result = GlobalConfiguration.AddClient(tbxClientInfo);

                    // expander 열어주기
                    View.expServerAccess.IsExpanded = true;
                }
                else if (actionType == ClientInfoBtnActions.Delete)
                {
                    #region Legarcy code - Delete selected clinet info
                    ////Delete selected clinet info
                    //bool result = await WebDataProvider.Instance.DeleteClient(selectedClientInfo);

                    ////Reload client info
                    //ClientInfoList = await WebDataProvider.Instance.GetClientList();
                    #endregion

                    result = GlobalConfiguration.DeleteClient(selectedClientInfo);
                }
                else if (actionType == ClientInfoBtnActions.Edit)
                {
                    if (String.IsNullOrWhiteSpace(View.tbxCallingAETitle.Text))
                    {
                        if (selectedClientInfo != null)
                        {
                            View.tbxCallingAETitle.Text = selectedClientInfo.client_ae_title;
                            View.tbxClientHostName.Text = selectedClientInfo.client_host_name;
                        }
                    }
                }
                else if (actionType == ClientInfoBtnActions.OK)
                {
                    tbxClientInfo.client_key = selectedClientInfo.client_key;

                    if (!IsClientInfoValid(tbxClientInfo, actionType))
                    {
                        return;
                    }

                    #region Legarcy code - Update into DB
                    ////Update into DB
                    //bool result = await WebDataProvider.Instance.UpdateClient(tbxClientInfo);

                    ////Reload client info
                    //ClientInfoList = await WebDataProvider.Instance.GetClientList();
                    #endregion

                    int selIndex = View.lstClientInfo.SelectedIndex;
                    if (selIndex < 0)
                    {
                        return;
                    }

                    result = GlobalConfiguration.EditClient(selIndex, tbxClientInfo);
                }
                else if (actionType == ClientInfoBtnActions.Cancel)
                {
                    View.lstClientInfo.SelectedIndex = -1;   //remove focus
                }

                if (result)
                {
                    GlobalConfiguration.SetDicomServerInfoValue();
                    LoadClientData();
                }

                ClearEditClientBoxInfo(actionType);
                ShowHideClientActionButton(actionType);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("ConfigViewModel", "ButtonActionOnClientBy", ex.Message);
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "ButtonActionOnClientBy", @"[END]");
        }

        private bool IsClientInfoValid(ClientInfo clientInfo, ClientInfoBtnActions actionType)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "IsClientInfoValid", @"[START]");

            bool result = true;

            //Empty value check
            if (String.IsNullOrWhiteSpace(clientInfo.client_ae_title) || String.IsNullOrWhiteSpace(clientInfo.client_host_name))
            {
                MessageBox.Show("Please, check client's AE Title and Hostname!");
                result = false;
            }
            else
            {
                if (actionType == ClientInfoBtnActions.Add)
                {
                    //Duplicate item check (AE Title Case Insensitive)
                    if (ClientInfoList.Where(t => t.client_ae_title.ToUpper() == clientInfo.client_ae_title.ToUpper()).ToList().Count() > 0)
                    {
                        ClearEditClientBoxInfo(actionType);

                        //Already exist msg here
                        MessageBox.Show("Duplicate, check client's AE Title and Hostname!");
                        result = false;
                    }
                }
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "IsClientInfoValid", @"[END]");

            return result;
        }

        private void ShowHideClientActionButton(ClientInfoBtnActions actionType)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "ShowHideClientActionButton", @"[START]");

            if (actionType == ClientInfoBtnActions.Edit)
            {
                View.btnAdd.Visibility = Visibility.Collapsed;
                View.btnEdit.Visibility = Visibility.Collapsed;
                View.btnDelete.Visibility = Visibility.Collapsed;

                View.btnOk.Visibility = Visibility.Visible;
                View.btnCancel.Visibility = Visibility.Visible;
            }
            else if (actionType == ClientInfoBtnActions.Add || actionType == ClientInfoBtnActions.Delete)
            {
                View.btnAdd.Visibility = Visibility.Visible;

                View.btnEdit.Visibility = Visibility.Collapsed;
                View.btnDelete.Visibility = Visibility.Collapsed;
                View.btnCancel.Visibility = Visibility.Collapsed;
                View.btnOk.Visibility = Visibility.Collapsed;

            }
            else if (actionType == ClientInfoBtnActions.Cancel || actionType == ClientInfoBtnActions.OK)
            {
                View.btnAdd.Visibility = Visibility.Visible;
                View.btnEdit.Visibility = Visibility.Visible;
                View.btnDelete.Visibility = Visibility.Visible;

                View.btnCancel.Visibility = Visibility.Collapsed;
                View.btnOk.Visibility = Visibility.Collapsed;
            }
            else if (actionType == ClientInfoBtnActions.Selected)
            {
                View.tbxCallingAETitle.IsReadOnly = true;
                View.tbxClientHostName.IsReadOnly = true;

                View.btnAdd.Visibility = Visibility.Collapsed;

                View.btnEdit.Visibility = Visibility.Visible;
                View.btnDelete.Visibility = Visibility.Visible;
                View.btnCancel.Visibility = Visibility.Visible;

                View.btnOk.Visibility = Visibility.Collapsed;
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "ShowHideClientActionButton", @"[END]");
        }

        private void ClearEditClientBoxInfo(ClientInfoBtnActions actionType)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "ClearEditClientBoxInfo", @"[START]");

            if (actionType == ClientInfoBtnActions.Edit)
            {
                View.tbxCallingAETitle.Focus();
            }
            else
            {
                View.tbxCallingAETitle.Text = String.Empty;
                View.tbxClientHostName.Text = String.Empty;
            }

            View.tbxCallingAETitle.IsReadOnly = false;
            View.tbxClientHostName.IsReadOnly = false;

            Logger.Instance.WriteLogDebug("ConfigViewModel", "ClearEditClientBoxInfo", @"[END]");
        }

        private void LstClientInfo_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "LstClientInfo_SelectionChanged", @"[START]");

            if (View.lstClientInfo.ItemContainerGenerator.ContainerFromItem(View.lstClientInfo.SelectedItem) is ListViewItem item)
            {
                ClientInfo info = (ClientInfo)item.Content;

                //Prepare for Edit 
                View.tbxCallingAETitle.Text = info.client_ae_title;
                View.tbxClientHostName.Text = info.client_host_name;

                //
                ShowHideClientActionButton(ClientInfoBtnActions.Selected);
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "LstClientInfo_SelectionChanged", @"[END]");
        }

        private void ComboLogLevel_SelectionChanged(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "ComboLogLevel_SelectionChanged", @"[START]");

            int currentIndex = View.cbxLogLevel.SelectedIndex;
            Logger.Instance.TurnOnLogging((Logger.LogLevel)currentIndex);

            if (GlobalConfiguration.DicomServerLogLevel != (Logger.LogLevel)currentIndex)
            {
                GlobalConfiguration.DicomServerLogLevel = (Logger.LogLevel)currentIndex;
                SaveServerConfig();
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "ComboLogLevel_SelectionChanged", @"[END]");
        }

        private void ComboCharacterSet_SelectionChanged(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "ComboCharacterSet_SelectionChanged", @"[START]");

            if (GlobalConfiguration.SpecificCharSet != ((myRis.Web.Scp.Data.CharacterSet)View.cbxCharSet.SelectedItem).IsoRegistrationNumber)
            {
                GlobalConfiguration.SpecificCharSet = ((myRis.Web.Scp.Data.CharacterSet)View.cbxCharSet.SelectedItem).IsoRegistrationNumber;
                SaveServerConfig();
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "ComboCharacterSet_SelectionChanged", @"[END]");
        }
        #endregion

        #region Turn On & Off Dicom Server
        private void BtnInstallService_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnInstallService_Click", @"[START]");

            if (string.IsNullOrEmpty(ServerInfo.AETitle) || string.IsNullOrEmpty(ServerInfo.HostName) ||
                0 > ServerInfo.DcmPort || 0 > ServerInfo.WebPort)
            {
                MessageBox.Show(@"Check your dicom server Info.");
                return;
            }

            SaveServerConfig();

            string msg;
            //if (true == WindowsServiceManager.ExistService(WindowsServiceManager.TargetService.DicomService))
            //{
            //    msg = @"DICOM service has already installed.";
            //    MessageBox.Show(msg);
            //    Logger.Instance.WriteLogInfo("ConfigViewModel", "BtnInstallService_Click", msg);
            //    return;
            //}

            bool result = false;
            if (result = WindowsServiceManager.CreateDicomService())
            {
                //if (true == WindowsServiceManager.ExistService(WindowsServiceManager.TargetService.DicomService))
                //{
                //    result = true;
                //}
            }

            msg = result ? @"DICOM service installation has successfully completed." : @"DICOM service installation has failed.";
            Logger.Instance.WriteLogInfo("ConfigViewModel", "BtnInstallService_Click", msg);

            if (result)
            {
                IsSCPInfoEditable(false);
                ServerStatus = nameof(ServerStatusType.Installed);
            }

            MessageBox.Show(msg);

            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnInstallService_Click", @"[END]");
        }

        private void BtnUnInstallService_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnUnInstallService_Click", @"[START]");

            string msg;
            //if (false == WindowsServiceManager.ExistService(WindowsServiceManager.TargetService.DicomService))
            //{
            //    msg = @"DICOM service has already uninstalled.";
            //    MessageBox.Show(msg);
            //    Logger.Instance.WriteLogInfo("ConfigViewModel", "BtnUnInstallService_Click", msg);
            //    return;
            //}

            //ServiceControllerStatus outDcmSrvStat = ServiceControllerStatus.Stopped;
            //if (true == WindowsServiceManager.GetDICOMServiceStatus(out outDcmSrvStat))
            //{
            //    if (outDcmSrvStat == ServiceControllerStatus.Running)
            //    {
            //        msg = @"DICOM service is running.\r\nStop service.";
            //        MessageBox.Show(msg);

            //        Logger.Instance.WriteLogInfo("ConfigViewModel", "BtnUnInstallService_Click", msg);
            //        return;
            //    }
            //}

            bool result = false;
            if (true == WindowsServiceManager.DeleteDicomService())
            {
                //              if (false == WindowsServiceManager.ExistService(WindowsServiceManager.TargetService.DicomService))
                {
                    result = true;
                }
            }

            msg = result ? @"DICOM service uninstallation has successfully completed." : @"DICOM service uninstallation has failed.";
            Logger.Instance.WriteLogInfo("ConfigViewModel", "BtnUnInstallService_Click", msg);

            if (result)
            {
                IsSCPInfoEditable(true);
                ServerStatus = nameof(ServerStatusType.Uninstalled);
            }

            MessageBox.Show(msg);

            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnUnInstallService_Click", @"[END]");
        }

        private void BtnStartServer_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnStartServer_Click", @"[START]");

            bool result = false;

            //#if DEBUG
            //            result = _parentViewModel.TurnOnTheDicomServer(ServerInfo);
            //            if (result)
            //            {
            //                MessageBox.Show("Dicom Server has turned on!");
            //                ServerStatus = nameof(ServerStatusType.Running);

            //                IsSCPInfoEditable(false);
            //            }
            //            else
            //            {
            //                MessageBox.Show("Check your dicom server Info.!");
            //            }
            //#else

            if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.DicomService, WindowsServiceManager.ServiceOperation.Start))
            {
                if (WindowsServiceManager.GetDICOMServiceStatus(out ServiceControllerStatus serverStatus))
                {
                    if (ServiceControllerStatus.Running == serverStatus)
                    {
                        result = true;
                    }
                }
            }

            string msg = result ? @"DICOM service has started." : @"DICOM service has not started.";

            Logger.Instance.WriteLogInfo("ConfigViewModel", "BtnStartServer_Click", msg);

            if (result)
            {
                ServerStatus = nameof(ServerStatusType.Running);
            }

            MessageBox.Show(msg);

            //#endif
            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnStartServer_Click", @"[END]");
        }

        private void BtnStopServer_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnStopServer_Click", @"[START]");

            bool result = false;

            //#if DEBUG
            //            result = _parentViewModel.TurnOffTheDicomServer();
            //            ServerStatus = nameof(ServerStatusType.Stopped);

            //            if (result)
            //            {
            //                MessageBox.Show("Dicom Server has turned off!");

            //                IsSCPInfoEditable(true);
            //            }
            //#else
            if (WindowsServiceManager.StopDicomService())
            {
                if (WindowsServiceManager.GetDICOMServiceStatus(out ServiceControllerStatus serverStatus))
                {
                    if (ServiceControllerStatus.Stopped == serverStatus)
                    {
                        result = true;
                    }
                }
            }

            if (result)
            {
                MessageBox.Show("Dicom Server has turned off");
                ServerStatus = nameof(ServerStatusType.Stopped);
            }
            //#endif

            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnStopServer_Click", @"[END]");
        }

        private void BtnClear_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnClear_Click", @"[START]");

            if (ServerStatus == nameof(ServerStatusType.Stopped))
            {
                ServerInfo.AETitle = View.tbxCalledAETitle.Text = String.Empty;
                ServerInfo.HostName = View.tbxServerHostName.Text = String.Empty;
                ServerInfo.DcmPort = 50104;
                ServerInfo.WebPort = 50080;
                ServerInfo.MaxConn = 5;
            }
            else
            {
                MessageBox.Show("Please, Stop the DICOM server first.");
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnClear_Click", @"[END]");
        }

        private void BtnSaveServer_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnSaveServer_Click", "[START]");

//#if DEBUG
//            bool result = _parentViewModel.TurnOnTheDicomServer(ServerInfo);
//            if (result)
//            {
//                MessageBox.Show("Dicom Server has turned on!");
//                ServerStatus = nameof(ServerStatusType.Running);

//                IsSCPInfoEditable(false);
//            }
//            else
//            {
//                MessageBox.Show("Check your dicom server Info.!");
//            }
//#else
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
                        SaveServerConfig();

                        if (true == SaveBtnActionSave())
                        {
                            _curSaveBtnActions = SaveBtnActions.Stop;
                            UpdateSaveBtnUI(SaveBtnActions.Stop);
                        }
                    }
                    break;
            }
 //#endif

            Logger.Instance.WriteLogDebug("ConfigViewModel", "BtnSaveServer_Click", @"[END]");
        }

        private bool SaveBtnActionSave()
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "SaveBtnActionSave", "[START]");

            bool result = false;

            if (true == WindowsServiceManager.ExistService(WindowsServiceManager.TargetService.DicomService))
            {
                // 서비스 중단 후 시작
                Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionSave", "(1)Exist DICOM service(installed)");

                if (WindowsServiceManager.StopDicomService())
                {
                    Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionSave", "(2)Stop DICOM service");

                    if (WindowsServiceManager.GetDICOMServiceStatus(out ServiceControllerStatus serverStatus))
                    {
                        if (ServiceControllerStatus.Stopped == serverStatus)
                        {
                            ServerStatus = nameof(ServerStatusType.Stopped);

                            if (WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.DicomService, WindowsServiceManager.ServiceOperation.Start))
                            {
                                Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionSave", "(3)Start DICOM service");

                                if (WindowsServiceManager.GetDICOMServiceStatus(out serverStatus))
                                {
                                    if (ServiceControllerStatus.Running == serverStatus)
                                    {
                                        result = true;
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
                Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionSave", "(1)Not exists DICOM service");

                if (result = WindowsServiceManager.CreateDicomService())
                {
                    ServerStatus = nameof(ServerStatusType.Installed);
                    Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionSave", "(2)Install DICOM service");

                    Thread.Sleep(1000);

                    if (result = WindowsServiceManager.OperateServerService(WindowsServiceManager.TargetService.DicomService, WindowsServiceManager.ServiceOperation.Start))
                    {
                        Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionSave", @"(3)Start DICOM service");

                        if (WindowsServiceManager.GetDICOMServiceStatus(out ServiceControllerStatus serverStatus))
                        {
                            if (ServiceControllerStatus.Running == serverStatus)
                            {
                                result = true;
                            }
                        }
                    }
                }
            }

            if (result)
            {
                ServerStatus = nameof(ServerStatusType.Running);
            }

            string msg = result ? @"DICOM service has started." : @"DICOM service has not started.";
            MessageBox.Show(msg);

            Logger.Instance.WriteLogDebug("ConfigViewModel", "SaveBtnActionSave", @"[END]");

            return result;
        }

        private bool SaveBtnActionStop()
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "SaveBtnActionStop", "[START]");

            bool result = false;

            if (WindowsServiceManager.StopDicomService())
            {
                if (WindowsServiceManager.GetDICOMServiceStatus(out ServiceControllerStatus serverStatus))
                {
                    if (ServiceControllerStatus.Stopped == serverStatus)
                    {
                        Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionStop", "Stop dicom service - success");
                        ServerStatus = nameof(ServerStatusType.Stopped);
                        result = true;
                    }
                }
                else
                {
                    Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveBtnActionStop", "Stop dicom service - failed");
                }
            }

            Logger.Instance.WriteLogDebug("ConfigViewModel", "SaveBtnActionStop", @"[END]");

            return result;
        }

        private void UpdateSaveBtnUI(SaveBtnActions inSaveBtnActions)
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "UpdateSaveBtnUI", "[START]");

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

            Logger.Instance.WriteLogDebug("ConfigViewModel", "UpdateSaveBtnUI", @"[END]");
        }

        private void IsSCPInfoEditable(bool editStatus)
        {
            string param = string.Format(@"editStatus : {0}", editStatus);
            Logger.Instance.WriteLogDebug("ConfigViewModel", "IsSCPInfoEditable", @"[START]" + param);

            View.tbxCalledAETitle.IsReadOnly = !editStatus;
            View.tbxServerHostName.IsReadOnly = !editStatus;
            View.tbxDcmPort.IsReadOnly = !editStatus;
            View.tbxWebPort.IsReadOnly = !editStatus;
            View.tbxMaxCon.IsReadOnly = !editStatus;

            Logger.Instance.WriteLogDebug("ConfigViewModel", "IsSCPInfoEditable", @"[END]");
        }

        private void LoadCharacterSet()
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "LoadCharacterSet", @"[START]");

            // ISO_CHARSET.ISO_IR_6
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO 2022 IR 6", Description = "Default repertoire" });
            // ISO_CHARSET.ISO_IR_100
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 100", Description = "Latin alphabet No. 1" });
            // ISO_CHARSET.ISO_IR_101
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 101", Description = "Latin alphabet No. 2" });
            // ISO_CHARSET.ISO_IR_109
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 109", Description = "Latin alphabet No. 3" });
            // ISO_CHARSET.ISO_IR_110
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 110", Description = "Latin alphabet No. 4" });
            // ISO_CHARSET.ISO_IR_144
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 144", Description = "Cyrillic" });
            // ISO_CHARSET.ISO_IR_127
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 127", Description = "Arabic" });
            // ISO_CHARSET.ISO_IR_126
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 126", Description = "Greek" });
            // ISO_CHARSET.ISO_IR_138
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 138", Description = "Hebrew" });
            // ISO_CHARSET.ISO_IR_148
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 148", Description = "Latin alphabet No. 5" });
            // ISO_CHARSET.ISO_IR_13
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 13", Description = "Japanese" });
            // ISO_CHARSET.ISO_IR_166
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 166", Description = "Thai" });
            // ISO_CHARSET.ISO_IR_14
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 14", Description = "Japanese" });
            // ISO_CHARSET.ISO_IR_87
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 87", Description = "Japanese" });
            // ISO_CHARSET.ISO_IR_159
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 159", Description = "Japanese" });
            // ISO_CHARSET.ISO_IR_149
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 149", Description = "Korean" });
            // ISO_CHARSET.ISO_IR_192
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 192", Description = "Unicode in UTF-8" });
            // ISO_CHARSET.GB18030
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "GB18030", Description = "GB18030" });
            // ISO_CHARSET.ISO_IR_58
            _isoCharacters.Add(new CharacterSet { IsoRegistrationNumber = "ISO_IR 58", Description = "Simplified Chinese" });

            Logger.Instance.WriteLogDebug("ConfigViewModel", "LoadCharacterSet", @"[END]");

        }

        private void SaveServerConfig()
        {
            Logger.Instance.WriteLogDebug("ConfigViewModel", "SaveServerConfig", @"[START]");

            if (true == _initApp)
            {
                string msg = @"return(initApp = true)";
                Logger.Instance.WriteLogInfo("ConfigViewModel", "SaveServerConfig", msg);
                return;
            }

            GlobalConfiguration.SetDicomServerInfoValue();

            Logger.Instance.WriteLogDebug("ConfigViewModel", "SaveServerConfig", @"[END]");

        }
#endregion
    }
}