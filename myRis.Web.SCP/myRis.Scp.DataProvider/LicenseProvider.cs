using Microsoft.Win32;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.IO;
using LICENSE;

namespace myRis.Web.Scp.DataProvider
{
    public class LicenseProvider
    {
        // thread-safe singleton  
        private static readonly Lazy<LicenseProvider> _instance = new Lazy<LicenseProvider>(() => new LicenseProvider());
        private readonly string _serverInfofileName = @"Server.ini";
        private readonly string _licenseFileName = @"myRisS.lic";
        private bool _standAloneSCP = false;

        #region Properties
        public static LicenseProvider Instance
        {
            get
            {
                return _instance.Value;
            }
        }

        public LicenseTypes CurLicenseType { get; set; }

        public bool StandAloneSCP
        {
            get
            {
                return _standAloneSCP;
            }

            set
            {
                _standAloneSCP = value;
            }
        }
        #endregion

        #region Enum
        public enum LicenseTypes
        {
            Invalid = 0, Human, Veterinary, Demo
        }
        #endregion

        #region Methods
        public LicenseTypes GetCurLicenseType()
        {
            return CurLicenseType;
        }

        public void SetLicense(int index)
        {
            CurLicenseType = (LicenseTypes)index;
        }

        public void GetLicense()
        {
            Logger.Instance.WriteLogDebug("LicenseProvider", "GetLicense", @"[START]");

            CurLicenseType = LicenseTypes.Invalid;

            try
            {
                string licenseFilePath = string.Empty;
                string serverInfoPath = string.Empty;
                string msg = string.Empty;
                
                bool isLicenseValid = GetmyRisLicensePath(out licenseFilePath);
                string strLicenseKey = string.Empty;

                if (string.IsNullOrEmpty(licenseFilePath)) 
                {
                    isLicenseValid = false;
                }

                CLicenseDotNet _license = new CLicenseDotNet();

                if (_license == null)
                {
                    isLicenseValid = false;

                }
                    

                if (isLicenseValid)
                {
                    isLicenseValid = _license.ReadLicenseFile(licenseFilePath, ref strLicenseKey) > 0;
                }

                if(string.IsNullOrEmpty(strLicenseKey))
                {
                    isLicenseValid = false;
                }

                bool ismyRisServerInstalled = GetPACSServerInfoPath(out serverInfoPath);

                if (!ismyRisServerInstalled || !isLicenseValid)
                {
                    msg = @"License - StandAloneSCP";
                    StandAloneSCP = true;
                }
                else
                {
                    string licenseKey = string.Empty;
                    string hwKey = string.Empty;

                    eProductCode nProductCode = eProductCode.PRODUCT_CODE_INVALID ;

                    int res = _license.GetProductCode(strLicenseKey, ref nProductCode);


                    switch (nProductCode)
                    {

                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_DEMO:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_VET_DEMO:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_DEMO:
                            SetLicense((int)LicenseTypes.Demo);
                            break;
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_VET_5USER:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_VET_10USER:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_VET_10_USERS:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_VET_20_USERS:
                            SetLicense((int)LicenseTypes.Veterinary);
                            break;
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_5USER:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_10USER:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_10USER_WITH_CHIROPRACTIC:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3X_10USER_WITH_ORTHOPEDICS:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_HUMAN_10_USERS:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_HUMAN_10_USERS_WITH_CHIROPRACTIC:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_HUMAN_10_USERS_WITH_ORTHOPEDICS:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_HUMAN_20_USERS:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_HUMAN_20_USERS_WITH_CHIROPRACTIC:
                        case eProductCode.PRODUCT_CODE_myRis_SERVER_3_3_HUMAN_20_USERS_WITH_ORTHOPEDICS:
                        default:
                            SetLicense((int)LicenseTypes.Human);
                            break;
                    }

                    msg = String.Format(@"License - License Type: {0} LicenseKey: {1} [0:I,1:H,2:V,3:D]", CurLicenseType, strLicenseKey);
                }

                Logger.Instance.WriteLogInfo("LicenseProvider", "GetLicense", msg);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("LicenseProvider", "GetLicense", ex.Message);
            }

            Logger.Instance.WriteLogDebug("LicenseProvider", "GetLicense", @"[END]");
        }

        private bool GetmyRisLicensePath(out string outPath)
        {
            Logger.Instance.WriteLogDebug("LicenseProvider", "GetmyRisLicensePath", @"[START]");

            bool isFind = false;

            string installLocation = "";
            outPath = string.Empty;

            string uninstallKeyx86 = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall";
            using (RegistryKey regKey = Registry.LocalMachine.OpenSubKey(uninstallKeyx86))
            {
                foreach (string subKeyName in regKey.GetSubKeyNames())
                {
                    using (RegistryKey subKey = regKey.OpenSubKey(subKeyName))
                    {
                        if (subKey.GetValue("DisplayName") == null)
                            continue;

                        string programName = subKey.GetValue("DisplayName").ToString();

                        if (programName == "myRis.Server")
                        {
                            installLocation = subKey.GetValue("InstallLocation").ToString();
                            isFind = true;
                        }
                    }
                }
            }

            string uninstallKeyx64 = @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall";
            using (RegistryKey regKey = Registry.LocalMachine.OpenSubKey(uninstallKeyx64))
            {
                foreach (string subKeyName in regKey.GetSubKeyNames())
                {
                    using (RegistryKey subKey = regKey.OpenSubKey(subKeyName))
                    {
                        if (subKey.GetValue("DisplayName") == null)
                            continue;

                        string programName = subKey.GetValue("DisplayName").ToString();
                        if (programName == "myRis.Server")
                        {
                            installLocation = subKey.GetValue("InstallLocation").ToString();
                            installLocation = installLocation.Replace("Program Files (x86)", "Program Files");
                            isFind = true;
                        }
                    }
                }
            }

            string msg = string.Empty;
            if (true == string.IsNullOrEmpty(installLocation))
            {
                msg = string.Format("filePath is null");
                Logger.Instance.WriteLogInfo("LicenseProvider", "GetmyRisLicensePath", msg);
                return false;
            }

            outPath = string.Format(@"{0}{1}", installLocation, _licenseFileName);

            if (!File.Exists(outPath))
            {
                outPath = string.Empty;
                msg = string.Format("filePath is not exist");
                Logger.Instance.WriteLogInfo("LicenseProvider", "GetmyRisLicensePath", msg);
                return false;
            }

            Logger.Instance.WriteLogDebug("LicenseProvider", "GetPACSServerInfoPath", @"[END]");

            return isFind;
        }
       
        private bool GetPACSServerInfoPath(out string outPath)
        {
            Logger.Instance.WriteLogDebug("LicenseProvider", "GetPACSServerInfoPath", @"[START]");

            bool isFind = false;

            string installLocation = "";
            outPath = string.Empty;

            string uninstallKeyx86 = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall";
            using (RegistryKey regKey = Registry.LocalMachine.OpenSubKey(uninstallKeyx86))
            {
                foreach (string subKeyName in regKey.GetSubKeyNames())
                {
                    using (RegistryKey subKey = regKey.OpenSubKey(subKeyName))
                    {
                        if (subKey.GetValue("DisplayName") == null)
                            continue; 

                        string programName = subKey.GetValue("DisplayName").ToString();

                        if (programName == "myRis.Server")
                        {
                            installLocation = subKey.GetValue("InstallLocation").ToString();
                            isFind = true;
                        }
                    }
                }
            }

            string uninstallKeyx64 = @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall";
            using (RegistryKey regKey = Registry.LocalMachine.OpenSubKey(uninstallKeyx64))
            {
                foreach (string subKeyName in regKey.GetSubKeyNames())
                {
                    using (RegistryKey subKey = regKey.OpenSubKey(subKeyName))
                    {
                        if (subKey.GetValue("DisplayName") == null)
                            continue;

                        string programName = subKey.GetValue("DisplayName").ToString();
                        if (programName == "myRis.Server")
                        {
                            installLocation = subKey.GetValue("InstallLocation").ToString();
                            installLocation = installLocation.Replace("Program Files (x86)", "Program Files");
                            isFind = true;
                        }
                    }
                }
            }

            string msg = string.Empty;
            if (true == string.IsNullOrEmpty(installLocation))
            {
                msg = string.Format("filePath is null");
                Logger.Instance.WriteLogInfo("LicenseProvider", "GetPACSServerInfoPath", msg);
                return false;
            }

            outPath = string.Format(@"{0}Config\{1}", installLocation, _serverInfofileName);

            if(!File.Exists(outPath))
            {
                outPath = string.Empty;
                msg = string.Format("filePath is not exist");
                Logger.Instance.WriteLogInfo("LicenseProvider", "GetPACSServerInfoPath", msg);
                return false;
            }

            Logger.Instance.WriteLogDebug("LicenseProvider", "GetPACSServerInfoPath", @"[END]");

            return isFind;
        }
        #endregion
    }
}