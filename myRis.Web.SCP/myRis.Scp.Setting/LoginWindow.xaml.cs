using myRis.Web.Scp.CommonUI.SpecializedElement;
using myRis.Web.Scp.Data.QueryCondition;
using myRis.Web.Scp.Data.ServiceResponse;
using myRis.Web.Scp.DataProvider;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Threading.Tasks;
using System.Windows;

namespace myRis.Web.Scp.Setting
{
    /// <summary>
    /// Interaction logic for LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        private System.Windows.Forms.NotifyIcon _notifyIcon;
        private bool _isExit;
        private MainWindow _mainWindow;

        public LoginWindow()
        {
            Logger.Instance.WriteLogDebug("LoginWindow", "LoginWindow", @"[START]");

            InitializeComponent();

            // SetWindowStartup.AtCenter(this);
            this.Loaded += LoginWindow_Loaded;
            ucLogin.Login += UcLogin_Login;

            Logger.Instance.WriteLogDebug("LoginWindow", "LoginWindow", @"[END]");
        }

        private void LoginWindow_Loaded(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("LoginWindow", "LoginWindow_Loaded", @"[START]");

            //Get ready for web data provider
            WebDataProvider.Instance.GetReadyForDataProvider();

            Logger.Instance.WriteLogDebug("LoginWindow", "LoginWindow_Loaded", @"[END]");
        }

        private async Task<Tuple<LoginControl.LoginResultType, string>> UcLogin_Login(string id, string pwd)
        {
            string param = string.Format(@"id - {0}, pwd - {1}", id, pwd);
            Logger.Instance.WriteLogDebug("LoginWindow", "UcLogin_Login", @"[START]" + param);

            LoginControl.LoginResultType resultType = LoginControl.LoginResultType.Success;
            string resultMsg = "Login Success";

            // id & pwd both are case-sensitive
            UserQueryCondition queryCondition = new UserQueryCondition();
            queryCondition.user_id = id;    //serivce 
            queryCondition.user_pwd = pwd;  //service

            // Authorization check
            //if(!IsAuthorizedUser(id))
            //{
            //    resultType = LoginControl.LoginResultType.NoAuthorization;
            //    resultMsg = "No Authorization Exists";

            //    return new Tuple<LoginControl.LoginResultType, string>(resultType, resultMsg);
            //}

            // Log in validation check
            UserResponse userResponse = await WebDataProvider.Instance.CanSignIn(queryCondition);

            if (!userResponse.result)
            {
                if (userResponse.err_code == WebDataProvider.ServiceErrorCode.NoAccount.ToString("D"))
                {
                    resultType = LoginControl.LoginResultType.WrongID;
                    resultMsg = "No Matched Account Exists";

                    return new Tuple<LoginControl.LoginResultType, string>(resultType, resultMsg);
                }
                else if (userResponse.err_code == WebDataProvider.ServiceErrorCode.WrongPwd.ToString("D"))
                {
                    resultType = LoginControl.LoginResultType.WrongPwd;
                    resultMsg = "Wrong Password";

                    return new Tuple<LoginControl.LoginResultType, string>(resultType, resultMsg);
                }
                else
                {
                    resultType = LoginControl.LoginResultType.UnExpected;
                    resultMsg = "Unexpected Error";

                    return new Tuple<LoginControl.LoginResultType, string>(resultType, resultMsg);
                }
            }

            // SUCCESS Goes Below
            // Open main & close login
            _mainWindow = new MainWindow();
            _mainWindow.Show();

            this.Close();
            Application.Current.MainWindow = _mainWindow;

            //
            _mainWindow.Closing += MainWindow_Closing;
            _notifyIcon = new System.Windows.Forms.NotifyIcon();
            _notifyIcon.DoubleClick += (s, e) => ShowMainWindow();


            //_notifyIcon.Icon = new System.Drawing.Icon(new Uri("path"));
            _notifyIcon.Icon = myRis.Web.Scp.Setting.Properties.Resources.myRisWebSCP;
            _notifyIcon.Visible = true;

            //
            CreateContextMenu();

            Logger.Instance.WriteLogDebug("LoginWindow", "UcLogin_Login", @"[END]");

            return new Tuple<LoginControl.LoginResultType, string>(resultType, resultMsg);
        }

        #region Tray Icon Related
        private void CreateContextMenu()
        {
            Logger.Instance.WriteLogDebug("LoginWindow", "CreateContextMenu", @"[START]");

            _notifyIcon.ContextMenuStrip = new System.Windows.Forms.ContextMenuStrip();
            _notifyIcon.ContextMenuStrip.Items.Add("Show Window").Click += (s, e) => ShowMainWindow();
            _notifyIcon.ContextMenuStrip.Items.Add("Exit").Click += (s, e) => ExitApplication();

            Logger.Instance.WriteLogDebug("LoginWindow", "CreateContextMenu", @"[END]");
        }

        private void ShowMainWindow()
        {
            Logger.Instance.WriteLogDebug("LoginWindow", "ShowMainWindow", @"[START]");

            if (_mainWindow.IsVisible)
            {
                if (_mainWindow.WindowState == WindowState.Minimized)
                {
                    _mainWindow.WindowState = WindowState.Normal;
                }
                _mainWindow.Activate();
            }
            else
            {
                _mainWindow.Show();
            }

            Logger.Instance.WriteLogDebug("LoginWindow", "ShowMainWindow", @"[END]");
        }

        private void ExitApplication()
        {
            Logger.Instance.WriteLogDebug("LoginWindow", "ExitApplication", @"[START]");

            _isExit = true;
            _mainWindow.Close();
            _notifyIcon.Dispose();
            _notifyIcon = null;

            Logger.Instance.WriteLogDebug("LoginWindow", "ExitApplication", @"[END]");
        }

        private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            Logger.Instance.WriteLogDebug("LoginWindow", "MainWindow_Closing", @"[START]");

            if (!_isExit)
            {
                e.Cancel = true;
                _mainWindow.Hide();
            }

            Logger.Instance.WriteLogDebug("LoginWindow", "MainWindow_Closing", @"[END]");
        }
        #endregion

        private bool IsAuthorizedUser(string id)
        {
            string param = string.Format(@"id - {0}", id);
            Logger.Instance.WriteLogDebug("LoginWindow", "IsAuthorizedUser", @"[START]" + param);

            if (id.ToUpper() == "SERVICE")
            {
                return true;
            }

            Logger.Instance.WriteLogDebug("LoginWindow", "IsAuthorizedUser", @"[END]");

            return false;
        }
    }
}