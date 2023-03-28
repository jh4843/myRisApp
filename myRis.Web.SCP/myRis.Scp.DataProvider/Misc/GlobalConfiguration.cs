using myRis.Web.Scp.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text.Json;

namespace myRis.Web.Scp.DataProvider.Misc
{
    public class GlobalConfiguration
    {
        #region VARIABLE
        private static ServerInfo _serverInfo;

        private static WebServerInfo _webServerInfo;

        private static CommonInfo _commonInfo;

        private static List<ClientInfo> _clientList;
        #endregion

        #region ENUM
        public enum EnumServerInfoFile { WebServer, SCP };
        #endregion

        #region PROPERTIES
        public static ServerInfo ServerInfo
        {
            get
            {
                return _serverInfo;
            }

            set
            {
                _serverInfo = value;
            }
        }

        public static bool IsClientVerificationActivated
        {
            get;
            set;
        }

        public static Logger.LogLevel DicomServerLogLevel
        {
            get;
            set;
        }

        public static CommonInfo CommonInfo
        {
            get
            {
                return _commonInfo;
            }

            set
            {
                _commonInfo = value;
            }
        }

        public static WebServerInfo WebServerInfo
        {
            get
            {
                return _webServerInfo;
            }

            set
            {
                _webServerInfo = value;
            }
        }

        public static List<ClientInfo> ClientList
        {
            get
            {
                return _clientList;
            }

            set
            {
                _clientList = value;
            }
        }

        public static string SpecificCharSet
        {
            get;
            set;
        }

        public static string CompanyName
        {
            get
            {
                return "Vieworks";
            }
        }

        public static string MainProduct
        {
            get
            {
                return "myRisWeb";
            }
        }

        public static string SubProductWebServer
        {
            get
            {
                return "WebServer";
            }
        }

        public static string SubProductServer
        {
            get
            {
                return "SCP";
            }
        }

        public static string LogFolderName
        {
            get
            {
                return "Logs";
            }
        }

        public static string ConfigFolderName
        {
            get
            {
                return "Config";
            }
        }

        public static string CultureName
        {
            get
            {
                return "en-US";
            }
        }
        #endregion

        #region METHODS
        public static void InitConfiguration(bool dicomServerOnly = false)
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "InitConfiguration", @"[START]");

            if (!dicomServerOnly)
            {
                // Get Web server config
                if (null == _commonInfo)
                {
                    _commonInfo = new CommonInfo();
                }

                if (null == _webServerInfo)
                {
                    _webServerInfo = new WebServerInfo();
                }

                GetWebServerConfigValue();
            }

            // Get dicom server config
            if (null == _serverInfo)
            {
                _serverInfo = new ServerInfo();
            }

            if (null == _clientList)
            {
                _clientList = new List<ClientInfo>();
            }

            GetDicomServerConfigValue();
            
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "InitConfiguration", @"[END]");
        }

        public static void GetDicomServerConfigValue()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetDicomServerConfigValue", @"[START]");

            try
            {
                string jsonString = File.ReadAllText(GetServerInfoFilePath(EnumServerInfoFile.SCP));
                if (true == string.IsNullOrEmpty(jsonString))
                {
                    string msg = string.Format("config data is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "GetDicomServerConfigValue", msg);
                    return;
                }

                ServerInfoJson serverInfoJson = JsonSerializer.Deserialize<ServerInfoJson>(jsonString);

                ServerInfo.AETitle = serverInfoJson.ServerInfos.AETitle;

                ServerInfo.HostName = serverInfoJson.ServerInfos.HostName;
                if (true == string.IsNullOrEmpty(ServerInfo.HostName))
                {
                    ServerInfo.HostName = GetIP();
                }

                ServerInfo.DcmPort = serverInfoJson.ServerInfos.DcmPort;
                ServerInfo.WebPort = serverInfoJson.ServerInfos.WebPort;
                ServerInfo.MaxConn = serverInfoJson.ServerInfos.MaxConn;

                IsClientVerificationActivated = serverInfoJson.AllowClients;
                DicomServerLogLevel = (Logger.LogLevel)serverInfoJson.LogLevel;
                SpecificCharSet = string.IsNullOrEmpty(serverInfoJson.InboundChartSet) ? @"ISO 2022 IR 6" : serverInfoJson.InboundChartSet;

                if (null == serverInfoJson.ClientInfoList)
                {
                    serverInfoJson.ClientInfoList = new List<ClientInfo>();
                }

                ClientList = serverInfoJson.ClientInfoList;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "GetDicomServerConfigValue", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetDicomServerConfigValue", @"[END]");
        }

        public static Logger.LogLevel GetUserLogLevel()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetUserLogLevel", @"[START]");

            Logger.LogLevel userLogLevel = Logger.LogLevel.Error;
            try
            {
                string jsonString = File.ReadAllText(GetServerInfoFilePath(EnumServerInfoFile.SCP));
                if (false == string.IsNullOrEmpty(jsonString))
                {
                    ServerInfoJson serverInfoJson = JsonSerializer.Deserialize<ServerInfoJson>(jsonString);
                    userLogLevel = (Logger.LogLevel)serverInfoJson.LogLevel;
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "GetUserLogLevel", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetUserLogLevel", @"[END]");

            return userLogLevel;
        }

        public static void SetDicomServerInfoValue()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetDicomServerInfoValue", @"[START]");

            try
            {
                #region SCP
                string serverConfigFilePath = GetServerInfoFilePath(EnumServerInfoFile.SCP);
                if (true == string.IsNullOrEmpty(serverConfigFilePath))
                {
                    string msg = string.Format("config data is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetDicomServerInfoValue", msg);
                    return;
                }

                var serverInfoJson = new ServerInfoJson
                {
                    ServerInfos = ServerInfo,
                    AllowClients = IsClientVerificationActivated,
                    LogLevel = (int)DicomServerLogLevel,
                    InboundChartSet = SpecificCharSet,
                    ClientInfoList = ClientList,
                };

                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonString = JsonSerializer.Serialize(serverInfoJson, options);
                if (true == string.IsNullOrEmpty(jsonString))
                {
                    string msg = string.Format("json string is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetDicomServerInfoValue", msg);
                    return;
                }

                File.WriteAllText(serverConfigFilePath, jsonString);
                #endregion
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "SetDicomServerInfoValue", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetDicomServerInfoValue", @"[END]");
        }

        public static void GetWebServerConfigValue()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetWebServerConfigValue", @"[START]");

            try
            {
                string jsonString = File.ReadAllText(GetServerInfoFilePath(EnumServerInfoFile.WebServer));
                if (true == string.IsNullOrEmpty(jsonString))
                {
                    string msg = string.Format("config data is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "GetWebServerConfigValue", msg);
                    return;
                }

                WebServerInfoJson serverInfoJson = JsonSerializer.Deserialize<WebServerInfoJson>(jsonString);

                CommonInfo.configPath = serverInfoJson._common.configPath;
                CommonInfo.fileName = serverInfoJson._common.fileName;
                CommonInfo.fileVersion = serverInfoJson._common.fileVersion;

                WebServerInfo.hostName = serverInfoJson._webSrvInfo.hostName;
                if (true == string.IsNullOrEmpty(WebServerInfo.hostName))
                {
                    WebServerInfo.hostName = GetIP();
                }

                WebServerInfo.port = serverInfoJson._webSrvInfo.port;
                WebServerInfo.alias = serverInfoJson._webSrvInfo.alias;
                WebServerInfo.licenseType = serverInfoJson._webSrvInfo.licenseType;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "GetWebServerConfigValue", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetWebServerConfigValue", @"[END]");
        }

        public static void SetWebServerInfoValue(WebServerInfo serverInfo, CommonInfo commInfo)
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetWebServerInfoValue", @"[START]");

            try
            {
                string configFilePath = GlobalConfiguration.GetServerInfoFilePath(EnumServerInfoFile.WebServer);
                if (true == string.IsNullOrEmpty(configFilePath))
                {
                    string msg = string.Format("config file path is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetWebServerInfoValue", msg);
                    return;
                }

                var webServerInfoJson = new WebServerInfoJson
                {
                    _common = commInfo,
                    _webSrvInfo = serverInfo
                };

                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonString = JsonSerializer.Serialize(webServerInfoJson, options);
                if (true == string.IsNullOrEmpty(jsonString))
                {
                    string msg = string.Format("json string is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetWebServerInfoValue", msg);
                    return;
                }

                File.WriteAllText(configFilePath, jsonString);

                #region Legacy(modify json)
                //bool bUpdate = false;

                //var jsonString = File.ReadAllText(configFilePath);
                //JsonNode jsonObject = JsonNode.Parse(jsonString.ToString());

                //if ((commInfo.fileName != jsonObject["_common"]["fileName"].ToString()) &&
                //   (false == string.IsNullOrEmpty(commInfo.fileName)))
                //{
                //    jsonObject["_common"]["fileName"] = commInfo.fileName;
                //    bUpdate = true;
                //}

                //if ((commInfo.configPath != jsonObject["_common"]["configPath"].ToString()) &&
                //    (false == string.IsNullOrEmpty(commInfo.configPath)))
                //{
                //    jsonObject["_common"]["configPath"] = commInfo.configPath;
                //    bUpdate = true;
                //}

                //if ((serverInfo.alias != jsonObject["_webSrvInfo"]["alias"].ToString()) &&
                //   (false == string.IsNullOrEmpty(serverInfo.alias)))
                //{
                //    jsonObject["_webSrvInfo"]["alias"] = serverInfo.alias;
                //    bUpdate = true;
                //}

                //if ((serverInfo.hostName != jsonObject["_webSrvInfo"]["hostName"].ToString()) &&
                //    (false == string.IsNullOrEmpty(serverInfo.hostName)))
                //{
                //    jsonObject["_webSrvInfo"]["hostName"] = serverInfo.hostName;
                //    bUpdate = true;
                //}

                //if (serverInfo.port != (int)jsonObject["_webSrvInfo"]["port"])
                //{
                //    jsonObject["_webSrvInfo"]["port"] = serverInfo.port;
                //    bUpdate = true;
                //}

                //if ((serverInfo.macAddr != jsonObject["_webSrvInfo"]["macAddr"].ToString()) &&
                //   (false == string.IsNullOrEmpty(serverInfo.macAddr)))
                //{
                //    jsonObject["_webSrvInfo"]["macAddr"] = serverInfo.macAddr;
                //    bUpdate = true;
                //}

                //if (serverInfo.licenseType != (int)jsonObject["_webSrvInfo"]["licenseType"])
                //{
                //    jsonObject["_webSrvInfo"]["licenseType"] = serverInfo.licenseType;
                //    bUpdate = true;
                //}

                //if (true == bUpdate)
                //{
                //    File.WriteAllText(configFilePath, jsonObject.ToJsonString());
                //}
                #endregion
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "SetWebServerInfoValue", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetWebServerInfoValue", @"[END]");
        }

        public static void SetServerInfoDefault()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetServerInfoDefault", @"[START]");

            try
            {
                string serverConfigFilePath = GetServerInfoFilePath(EnumServerInfoFile.SCP);
                if (true == string.IsNullOrEmpty(serverConfigFilePath))
                {
                    string msg = string.Format("config file path is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetServerInfoDefault", msg);
                    return;
                }

                var serverInfoJson = new ServerInfoJson();
                serverInfoJson.ServerInfos = new ServerInfo();
                {
                    serverInfoJson.ServerInfos.AETitle = "myRisBrokerSrv";
                    serverInfoJson.ServerInfos.HostName = GetIP();
                    serverInfoJson.ServerInfos.DcmPort = 50104;
                    serverInfoJson.ServerInfos.WebPort = 50080;
                    serverInfoJson.ServerInfos.MaxConn = 5;
                }
                serverInfoJson.AllowClients = false;
                serverInfoJson.LogLevel = (Int32)Logger.LogLevel.Error;
                serverInfoJson.InboundChartSet = "ISO 2022 IR 6";
                serverInfoJson.ClientInfoList = new List<ClientInfo>();

                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonString = JsonSerializer.Serialize(serverInfoJson, options);
                if (true == string.IsNullOrEmpty(jsonString))
                {
                    string msg = string.Format("json string is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetServerInfoDefault", msg);
                    return;
                }

                File.WriteAllText(serverConfigFilePath, jsonString);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "SetServerInfoDefault", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetServerInfoDefault", @"[END]");
        }

        public static void SetWebServerInfoDefault()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetWebServerInfoDefault", @"[START]");

            try
            {
                string filePath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.CommonApplicationData);
                if (true == string.IsNullOrEmpty(filePath))
                {
                    string msg = string.Format("folder path is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetWebServerInfoDefault", msg);
                    return;
                }

                string configFilePath = GetServerInfoFilePath(EnumServerInfoFile.WebServer);
                if (true == string.IsNullOrEmpty(configFilePath))
                {
                    string msg = string.Format("config file path is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetWebServerInfoDefault", msg);
                    return;
                }

                var webServerInfoJson = new WebServerInfoJson();
                webServerInfoJson._common = new CommonInfo();
                {
                    webServerInfoJson._common.fileName = "serverInfo.json";
                    webServerInfoJson._common.configPath = string.Format(@"{0}\{1}\{2}\{3}\{4}", filePath, CompanyName, MainProduct, SubProductWebServer, ConfigFolderName);
                    webServerInfoJson._common.fileVersion = "0";
                }
                webServerInfoJson._webSrvInfo = new WebServerInfo();
                {
                    webServerInfoJson._webSrvInfo.alias = "myRisWeb";
                    webServerInfoJson._webSrvInfo.hostName = GetIP();
                    webServerInfoJson._webSrvInfo.port = 50080;
                    webServerInfoJson._webSrvInfo.licenseType = 0;
                }

                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonString = JsonSerializer.Serialize(webServerInfoJson, options);
                if (true == string.IsNullOrEmpty(jsonString))
                {
                    string msg = string.Format("jsonString is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "SetWebServerInfoDefault", msg);

                    return;
                }

                File.WriteAllText(configFilePath, jsonString);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "SetWebServerInfoDefault", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "SetWebServerInfoDefault", @"[END]");
        }

        public static string GetServerInfoFilePath(EnumServerInfoFile enumSvrInfFile)
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetServerInfoFilePath", @"[START]");

            string msg = string.Empty;
            string returnValue = string.Empty;
            string filePath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.CommonApplicationData);
            if (true == string.IsNullOrEmpty(filePath))
            {
                msg = string.Format("filePath is null");
                Logger.Instance.WriteLogInfo("GlobalConfiguration", "GetServerInfoFilePath", msg);

                return returnValue;
            }

            if (EnumServerInfoFile.WebServer == enumSvrInfFile)
            {
                returnValue = string.Format(@"{0}\{1}\{2}\{3}\{4}\serverInfo.json", filePath, CompanyName, MainProduct, SubProductWebServer, ConfigFolderName);
            }
            else if (EnumServerInfoFile.SCP == enumSvrInfFile)
            {
                returnValue = string.Format(@"{0}\{1}\{2}\{3}\{4}\serverInfo.json", filePath, CompanyName, MainProduct, SubProductServer, ConfigFolderName);
            }

            msg = string.Format(@"Return - {0}", returnValue);
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetServerInfoFilePath", @"[END]" + msg);

            return returnValue;
        }

        public static void InitFolder()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "InitFolder", @"[START]");

            try
            {
                string filePath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.CommonApplicationData);
                if (true == string.IsNullOrEmpty(filePath))
                {
                    string msg = string.Format("file path is null");
                    Logger.Instance.WriteLogInfo("GlobalConfiguration", "InitFolder", msg);
                    return;
                }

                #region SCP
                {
                    List<string> configFiles = new List<string>();
                    configFiles.Add(string.Format(@"{0}\{1}", filePath, CompanyName));
                    configFiles.Add(string.Format(@"{0}\{1}\{2}", filePath, CompanyName, MainProduct));
                    configFiles.Add(string.Format(@"{0}\{1}\{2}\{3}", filePath, CompanyName, MainProduct, SubProductServer));
                    configFiles.Add(string.Format(@"{0}\{1}\{2}\{3}\{4}", filePath, CompanyName, MainProduct, SubProductServer, ConfigFolderName));
                    configFiles.Add(string.Format(@"{0}\{1}\{2}\{3}\{4}", filePath, CompanyName, MainProduct, SubProductServer, LogFolderName));

                    foreach (string configFile in configFiles)
                    {
                        if (false == Directory.Exists(configFile))
                        {
                            Directory.CreateDirectory(configFile);
                        }
                    }

                    string configFilePath = GetServerInfoFilePath(EnumServerInfoFile.SCP);
                    if (false == string.IsNullOrEmpty(configFilePath))
                    {
                        // {ProgramData}\Vieworks\myRisWeb\SCP\config 폴더에 serverInfo.json 파일이 없을 경우
                        // 해당 경로에 default serverInfo.json 파일을 생성한다.
                        if (false == File.Exists(configFilePath))
                        {
                            SetServerInfoDefault();
                        }
                    }
                }
                #endregion

                #region WEB SERVER
                {
                    List<string> configFiles = new List<string>();
                    configFiles.Add(string.Format(@"{0}\{1}", filePath, CompanyName));
                    configFiles.Add(string.Format(@"{0}\{1}\{2}", filePath, CompanyName, MainProduct));
                    configFiles.Add(string.Format(@"{0}\{1}\{2}\{3}", filePath, CompanyName, MainProduct, SubProductWebServer));
                    configFiles.Add(string.Format(@"{0}\{1}\{2}\{3}\{4}", filePath, CompanyName, MainProduct, SubProductWebServer, ConfigFolderName));
                    //configFiles.Add(string.Format(@"{0}\{1}\{2}\{3}\{4}", filePath, CompanyName, MainProduct, SubProductWebServer, LogFolderName));

                    foreach (string configFile in configFiles)
                    {
                        if (false == Directory.Exists(configFile))
                        {
                            Directory.CreateDirectory(configFile);
                        }
                    }

                    string configFilePath = GetServerInfoFilePath(EnumServerInfoFile.WebServer);
                    if (false == string.IsNullOrEmpty(configFilePath))
                    {
                        // {ProgramData}\Vieworks\myRisWeb\SCP\WebServer\config 폴더에 serverInfo.json 파일이 없을 경우
                        // 해당 경로에 default serverInfo.json 파일을 생성한다.
                        if (false == File.Exists(configFilePath))
                        {
                            SetWebServerInfoDefault();
                        }
                    }
                }
                #endregion
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "InitFolder", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "InitFolder", @"[END]");
        }

        private static string GetIP()
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetIP", @"[START]");

            string outHost = string.Empty;
            string host = Dns.GetHostName();
            if (false == string.IsNullOrEmpty(host))
            {
                IPHostEntry ipEntry = Dns.GetHostEntry(host);
                foreach (var ip in ipEntry.AddressList)
                {
                    if ((ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork) &&
                        (false == string.IsNullOrEmpty(ip.ToString())))
                    {
                        outHost = ip.ToString();
                        break;
                    }
                }
            }

            string msg = string.Format(@"Return - {0}", outHost);
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "GetIP", @"[END]" + msg);

            return outHost;
        }

        public static bool AddClient(ClientInfo clientInfo)
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "AddClient", @"[START]");

            try
            {
                ClientInfo newInfo = new ClientInfo();
                newInfo.client_ae_title = clientInfo.client_ae_title;
                newInfo.client_host_name = clientInfo.client_host_name;
                newInfo.client_key = clientInfo.client_key;

                ClientList.Add(newInfo);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "AddClient", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "AddClient", @"[END]");
            return true;
        }

        public static bool DeleteClient(ClientInfo clientInfo)
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "DeleteClient", @"[START]");

            bool result = false;

            try
            {
                if (null == clientInfo)
                {
                    return false;
                }

                int targetIndex = ClientList.FindIndex(s => (s.client_ae_title == clientInfo.client_ae_title && s.client_host_name == clientInfo.client_host_name));
                if (targetIndex != -1)
                {
                    ClientList.RemoveAt(targetIndex);
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "DeleteClient", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "DeleteClient", @"[END]");
            return result;
        }

        public static bool EditClient(int targetIndex, ClientInfo clientInfo)
        {
            Logger.Instance.WriteLogDebug("GlobalConfiguration", "EditClient", @"[START]");

            try
            {
                if (targetIndex < 0)
                {
                    return false;
                }

                ClientList[targetIndex].client_ae_title = clientInfo.client_ae_title;
                ClientList[targetIndex].client_host_name = clientInfo.client_host_name;
                ClientList[targetIndex].client_key = clientInfo.client_key;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("GlobalConfiguration", "EditClient", ex.Message);
            }

            Logger.Instance.WriteLogDebug("GlobalConfiguration", "EditClient", @"[END]");
            return true;
        }
        #endregion
    }
}