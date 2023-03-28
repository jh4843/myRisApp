using myRis.Web.Scp.CommonUI;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Threading;
using System.Windows;

namespace myRis.Web.Scp.Setting
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        Mutex mutex;

        public App()
        {
            //this.Startup += App_Startup;

            Logger.Instance.Init();
            Logger.Instance.WriteLogError("App", @"OnStartup", @"============= myRis.Web.Scp.Setting has Started! =============");
            Logger.Instance.TurnOnLogging(DataProvider.Misc.GlobalConfiguration.GetUserLogLevel());
        }

        private void App_Startup(object sender, StartupEventArgs e)
        {
            this.StartupUri = new Uri("LoginWindow.xaml", UriKind.Relative);
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            Logger.Instance.WriteLogDebug("App", @"OnStartup", @"[START]");

            string currentProcess = System.Diagnostics.Process.GetCurrentProcess().ProcessName.ToLower();
            bool createNew;

            // Preventing Duplicate Execution 
            mutex = new Mutex(true, currentProcess, out createNew);
            if (!createNew)
            {
                MessageBox.Show("SCP Broker is already running!");
                Logger.Instance.WriteLogInfo("App", @"OnStartup", @"SCP Broker is already running!");
                Shutdown();
            }

            // ready for server config file
            DataProvider.Misc.GlobalConfiguration.InitFolder();

            // install qckwinsvc pacakge for database server            
            WindowsServiceManager.InstallQckwinsvc();

            // Culture Setting
            UIHelper.SetCultureInfo(DataProvider.Misc.GlobalConfiguration.CultureName);

            base.OnStartup(e);
            Logger.Instance.WriteLogDebug("App", @"OnStartup", @"[END]");
        }

        protected override void OnExit(ExitEventArgs e)
        {
            Logger.Instance.WriteLogDebug("App", @"OnExit", @"[START]");

            Logger.Instance.WriteLogError("App", @"OnExit", @"============= myRis.Web.Scp.Setting has Exited! =============");

            base.OnExit(e);
            Logger.Instance.WriteLogDebug("App", @"OnExit", @"[END]");
        }
    }
}