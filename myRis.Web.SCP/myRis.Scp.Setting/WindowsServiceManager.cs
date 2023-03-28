using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Threading;

namespace myRis.Web.Scp.Setting
{
    internal class WindowsServiceManager
    {
        public enum TargetService { DicomService, ServerService }
        public enum ServiceOperation { Stop, Start, refresh, close }

        private static string DicomServiceName
        {
            get
            {
                return "myRisWebDCMSvc";
            }
        }

        private static string WebServerServiceName
        {
            get
            {
                return "myRisWebSRVSvc";
            }
        }

        private static string WebServerFileName
        {
            get
            {
                return "bundle.js";
            }
        }

        public static bool CreateDicomService()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "CreateDicomService", @"[START]");

            try
            {
                string msg = string.Empty;

                string appPath = string.Format(@"{0}myRis.Web.Scp.Service.exe", AppDomain.CurrentDomain.BaseDirectory);
                string argment = string.Format(@"create ""{0}"" binpath=""{1}""", DicomServiceName, appPath);
                Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "CreateDicomService", "[Path] " + argment);

                Process result = Process.Start(@"sc.exe", argment);
                if (result.ExitCode == 0)
                {
                    msg = string.Format(@"CreateDicomService success");

                }
                else
                {
                    msg = string.Format(@"CreateDicomService failed");
                }

                Thread.Sleep(2000);

                #region LEGACY
                //System.Diagnostics.ProcessStartInfo procStartInfo = new System.Diagnostics.ProcessStartInfo();
                //System.Diagnostics.Process proc = new System.Diagnostics.Process();

                //procStartInfo.FileName = "sc.exe";
                //procStartInfo.CreateNoWindow = false;
                //procStartInfo.UseShellExecute = false;
                //procStartInfo.RedirectStandardInput = true;
                //procStartInfo.RedirectStandardOutput = true;
                //procStartInfo.RedirectStandardError = true;

                //proc.StartInfo = procStartInfo;
                //proc.Start();

                //proc.StandardInput.Write(@"");
                //proc.StandardInput.Close();
                //string resultValue = proc.StandardOutput.ReadToEnd();
                //proc.WaitForExit();
                //proc.Close();
                #endregion
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "CreateDicomService", ex.Message);
                return true;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "CreateDicomService", @"[END]");

            return true;
        }

        public static bool DeleteDicomService()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "DeleteDicomService", @"[START]");

            try
            {
                OperateServerService(TargetService.DicomService, ServiceOperation.close);

                string msg = string.Empty;
                string appPath = string.Format(@"{0}myRis.Web.Scp.Service.exe", AppDomain.CurrentDomain.BaseDirectory);
                string argment = string.Format(@"delete ""{0}"" binpath=""{1}""", DicomServiceName, appPath);

                Process result = Process.Start(@"sc.exe", argment);
                if (result.ExitCode == 0)
                {
                    msg = string.Format(@"DeleteDicomService success : {0}", argment);
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "DeleteDicomService", msg);
                }
                else
                {
                    msg = string.Format(@"DeleteDicomService failed : {0}", argment);
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "DeleteDicomService", msg);
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "DeleteDicomService", ex.Message);
                return true;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "DeleteDicomService", @"[END]");

            return true;
        }

        public static bool StartDicomService()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "StartDicomService", @"[START]");

            try
            {
                ServiceController ctl = ServiceController.GetServices()
                .FirstOrDefault(s => s.ServiceName == DicomServiceName);

                if (null == ctl)
                {
                    string msg = string.Format(@"ServiceController is null");
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "StartDicomService", msg);
                    return false;
                }

                if ((ctl.Status != ServiceControllerStatus.Stopped))
                {
                    ctl.Stop();
                    Thread.Sleep(1000);
                    ctl.Refresh();
                }

                if (ctl.Status == ServiceControllerStatus.Stopped)
                {
                    ctl.Start();

                    string msg = string.Format(@"Dicom service start");
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "StartDicomService", msg);
                }
                else
                {
                    string msg = string.Format(@"Dicom service has started");
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "StartDicomService", msg);
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "StartDicomService", ex.Message);
                return false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "StartDicomService", @"[END]");

            return true;
        }

        public static bool StopDicomService()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "StopDicomService", @"[START]");

            try
            {
                ServiceController ctl = ServiceController.GetServices()
               .FirstOrDefault(s => s.ServiceName == DicomServiceName);

                if (null == ctl)
                {
                    string msg = string.Format(@"ServiceController is null");
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "StopDicomService", msg);
                    return false;
                }

                if (ctl.Status == ServiceControllerStatus.Stopped)
                {
                    return true;
                }

                ctl.Stop();
                Thread.Sleep(1000);
                ctl.Refresh();
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "StopDicomService", ex.Message);
                return false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "StopDicomService", @"[END]");

            return true;
        }

        public static bool ExistService(TargetService targetService)
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "ExistService", @"[START]");

            string targetServiceName = string.Empty;
            switch (targetService)
            {
                case TargetService.DicomService:
                    targetServiceName = DicomServiceName;
                    break;
                case TargetService.ServerService:
                    targetServiceName = string.Format(@"{0}.exe", WebServerServiceName.ToLower());
                    break;
            }

            ServiceController ctl = ServiceController.GetServices()
                .FirstOrDefault(s => s.ServiceName == targetServiceName);

            bool bExist = false;

            if (ctl == null)
            {
                bExist = false;
            }
            else
            {
                bExist = true;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "ExistService", @"[END]");

            return bExist;
        }

        public static void InstallQckwinsvc()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "InstallQckwinsvc", @"[START]");

            try
            {
                if (true == CheckInstallQckwinsvc())
                {
                    string packagePath = string.Format(@"{0}qckwinsvc", AppDomain.CurrentDomain.BaseDirectory);
                    string inParam = string.Format(@"npm i ""{0}"" -g{1}", packagePath, Environment.NewLine);

                    string outReadToEnd = string.Empty;
                    CallCommand(in inParam, out outReadToEnd);
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "InstallQckwinsvc", ex.Message);
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "InstallQckwinsvc", @"[END]");
        }

        private static bool CheckInstallQckwinsvc()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "CheckInstallQckwinsvc", @"[START]");

            bool installPackage = false;

            string inParam = string.Format(@"npm list -g{0}", Environment.NewLine);

            string outReadToEnd = string.Empty;
            CallCommand(in inParam, out outReadToEnd);

            if (false == string.IsNullOrEmpty(outReadToEnd))
            {
                installPackage = (false == outReadToEnd.Contains("qckwinsvc")) ? true : false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "CheckInstallQckwinsvc", @"[END]");

            return installPackage;
        }

        public static bool GetDICOMServiceStatus(out ServiceControllerStatus outServiceStatus)
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "GetDICOMServiceStatus", @"[START]");

            outServiceStatus = ServiceControllerStatus.Stopped;

            try
            {
                ServiceController ctl = ServiceController.GetServices()
                .FirstOrDefault(s => s.ServiceName == DicomServiceName);

                if (null == ctl)
                {
                    string msg = string.Format(@"ServiceController is null");
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "GetDICOMServiceStatus", msg);
                    return false;
                }

                outServiceStatus = ctl.Status;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "GetDICOMServiceStatus", ex.Message);
                return false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "GetDICOMServiceStatus", @"[END]");

            return true;
        }

        private static bool CallCommand(in string inParam, out string outReadToEnd)
        {
            string param = string.Format(@"inParam - {0}", inParam);
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "CallCommand", @"[START]" + param);

            outReadToEnd = string.Empty;

            if (true == string.IsNullOrEmpty(inParam))
            {
                string msg = string.Format(@"parameter is null");
                Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "CallCommand", msg);
                return false;
            }

            try
            {
                System.Diagnostics.ProcessStartInfo procStartInfo = new System.Diagnostics.ProcessStartInfo();
                System.Diagnostics.Process proc = new System.Diagnostics.Process();

                procStartInfo.FileName = @"cmd";
                procStartInfo.WindowStyle = ProcessWindowStyle.Hidden;
                procStartInfo.CreateNoWindow = true;

                procStartInfo.UseShellExecute = false;
                procStartInfo.RedirectStandardInput = true;
                procStartInfo.RedirectStandardOutput = true;
                procStartInfo.RedirectStandardError = true;

                proc.EnableRaisingEvents = false;
                proc.StartInfo = procStartInfo;
                proc.Start();

                proc.StandardInput.Write(inParam);
                proc.StandardInput.Close();

                outReadToEnd = proc.StandardOutput.ReadToEnd();

                proc.WaitForExit();
                proc.Close();
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "CallCommand", ex.Message);
                return false;
            }

            param = string.Format(@"outReadToEnd - {0}", outReadToEnd);
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "CallCommand", @"[END]" + param);

            return true;
        }

        public static bool InstallWebServerService()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "InstallWebServerService", @"[START]");

            try
            {
                string msg = string.Empty;
                string rootPath = AppDomain.CurrentDomain.BaseDirectory;
                rootPath = rootPath.Substring(0, rootPath.LastIndexOf('\\'));
                rootPath = rootPath.Substring(0, rootPath.LastIndexOf('\\'));

                string workingDirectory = string.Format(@"{0}\myRisWeb", rootPath);
                string webServerPath = string.Format(@"{0}\{1}", workingDirectory, "install_myRisweb_server_service.bat");
                Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "InstallWebServerService", webServerPath);

                if (false == File.Exists(webServerPath))
                {
                    msg = String.Format(@"There is no file(install_myRisweb_server_service.bat) : {0}", workingDirectory);
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "InstallWebServerService", msg);
                    return false;
                }

                ProcessStartInfo psi = new ProcessStartInfo();

                psi.FileName = "cmd";
                psi.Arguments = String.Format(@"/C install_myRisweb_server_service.bat");
                psi.RedirectStandardOutput = true;
                psi.UseShellExecute = false;
                psi.WorkingDirectory = workingDirectory;
                psi.CreateNoWindow = true;

                Process proc = Process.Start(psi);
                string txt = proc.StandardOutput.ReadToEnd();

                Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "InstallWebServerService", "cmd output - " + txt);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "InstallWebServerService", ex.Message);
                return false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "InstallWebServerService", @"[END]");

            return true;
        }

        public static bool UninstallWebServerService()
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "UninstallWebServerService", @"[START]");

            try
            {
                string msg = string.Empty;
                string rootPath = AppDomain.CurrentDomain.BaseDirectory;
                rootPath = rootPath.Substring(0, rootPath.LastIndexOf('\\'));
                rootPath = rootPath.Substring(0, rootPath.LastIndexOf('\\'));

                string workingDirectory = string.Format(@"{0}\myRisWeb", rootPath);
                string webServerPath = string.Format(@"{0}\{1}", workingDirectory, "uninstall_myRisweb_server_service.bat");
                Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "InstallWebServerService", webServerPath);

                if (false == File.Exists(webServerPath))
                {
                    msg = String.Format(@"There is no file(uninstall_myRisweb_server_service.bat) : {0}", workingDirectory);
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "UninstallWebServerService", msg);
                    return false;
                }

                ProcessStartInfo psi = new ProcessStartInfo();

                psi.FileName = "cmd";
                psi.Arguments = String.Format(@"/C uninstall_myRisweb_server_service.bat");
                psi.RedirectStandardOutput = true;
                psi.UseShellExecute = false;
                psi.WorkingDirectory = workingDirectory;
                psi.CreateNoWindow = true;

                Process proc = Process.Start(psi);
                string txt = proc.StandardOutput.ReadToEnd();

                Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "UninstallWebServerService", txt);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "UninstallWebServerService", ex.Message);
                return false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "UninstallWebServerService", @"[END]");

            return true;
        }

        public static bool GetServerServiceStatus(out ServiceControllerStatus outServiceStatus)
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "GetServerServiceStatus", @"[START]");

            outServiceStatus = ServiceControllerStatus.Stopped;

            try
            {
                string service = string.Format(@"{0}.exe", WebServerServiceName.ToLower());

                ServiceController ctl = ServiceController.GetServices().FirstOrDefault(s => s.ServiceName == service);

                if (null == ctl)
                {
                    string msg = string.Format(@"ServiceController is null");
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "GetServerServiceStatus", msg);
                    return false;
                }

                outServiceStatus = ctl.Status;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "GetServerServiceStatus", ex.Message);
                return false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "GetServerServiceStatus", @"[END]");

            return true;
        }

        public static bool OperateServerService(TargetService targetService, ServiceOperation operation)
        {
            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "OperateServerService", @"[START]");

            try
            {
                ServiceController ctl = null;

                if (TargetService.DicomService == targetService)
                {
                    ctl = ServiceController.GetServices().FirstOrDefault(s => s.ServiceName == DicomServiceName);
                }
                else if (TargetService.ServerService == targetService)
                {
                    string service = string.Format(@"{0}.exe", WebServerServiceName.ToLower());
                    ctl = ServiceController.GetServices().FirstOrDefault(s => s.ServiceName == service);
                }

                if (null == ctl)
                {
                    string msg = string.Format(@"ServiceController is null");
                    Logger.Instance.WriteLogInfo(@"WindowsServiceManager", "OperateServerService", msg);
                    return false;
                }

                switch (operation)
                {
                    case ServiceOperation.Start:
                        {
                            if (ctl.Status == ServiceControllerStatus.Running)
                            {
                                return true;
                            }

                            ctl.Start();
                            Thread.Sleep(1000);
                        }
                        break;
                    case ServiceOperation.Stop:
                        {
                            if (ctl.Status == ServiceControllerStatus.Stopped)
                            {
                                return true;
                            }

                            ctl.Stop();
                            Thread.Sleep(1000);
                        }
                        break;
                    case ServiceOperation.refresh:
                        {
                            ctl.Refresh();
                        }
                        break;
                    case ServiceOperation.close:
                        {
                            ctl.Close();
                            Thread.Sleep(1000);
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"WindowsServiceManager", "OperateServerService", ex.Message);
                return false;
            }

            Logger.Instance.WriteLogDebug(@"WindowsServiceManager", "OperateServerService", @"[END]");

            return true;
        }
    }
}