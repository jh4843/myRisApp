using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using myRis.Web.Scp.Core.DataProvider;
using myRis.Web.Scp.Core.Misc;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.Data.QueryCondition;
using myRis.Web.Scp.Data.ServiceResponse;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace myRis.Web.Scp.Core
{
    public class WebDataProvider
    {
        //Logger - Log4Net
        //private static readonly ILog _logger = LogManager.GetLogger(typeof(WebDataProvider));

        // thread-safe singleton  
        private static readonly Lazy<WebDataProvider> _instance = new Lazy<WebDataProvider>(() => new WebDataProvider());

        private DataProviderFactory _factory;
        private static HttpClient _httpClient;
        private ServerInfo _serverInfo; 
        
        //
        private string fixedURI = string.Empty; //ex) http://localhost:8081/api/user/usr01

        #region ENUM
        public enum WebRouterType
        {
            User = 0, Patient, CodeSeq, Order, RP, SPS, Server, Mwl, Client
        }

        public enum ServiceResopnseType
        {
            MwlRes = 0, ClientRes, UserRes
        }

        public enum ServiceErrorCode
        {
            NoAccount = 11001, WrongPwd, Other
        }
        #endregion

        #region Properties
        
        public static WebDataProvider Instance
        {
            get
            {
                return _instance.Value;
            }
        }

        public ServerInfo ServerInfo
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

        public bool IsClientVerificationActivated
        {
            get;
            set;
        }
        #endregion

        //public void GetReadyForDataProvider(ServerInfo serverInfo)
        //{
        //    _serverInfo = serverInfo;
        //    _factory = new DataProvider.DataProviderFactory(DataProvider.DataProviderFactory.DataProviderType.DP_WebService);
        //    _httpClient = _factory.CreateDataProvider() as HttpClient;
        //}

        public void GetReadyForDataProvider()
        {
            GetReadyForServerInfo();
            _factory = new DataProvider.DataProviderFactory(DataProvider.DataProviderFactory.DataProviderType.DP_WebService);

            _httpClient = _factory.CreateDataProvider() as HttpClient;
            fixedURI = _factory.FixedURI;
        }

        #region CLIENT INFO 

        public bool IsClientVeirifcationActivated()
        {
            return IsClientVerificationActivated;
        }

        public async Task<List<ClientInfo>> GetClientList()
        {
            string url = GenerateURI(WebRouterType.Client) + "allClients";
            //
            ClientResponse clientResponse = new ClientResponse();

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                //Do exception handling!
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    clientResponse = ParseResponseFrom(responseBody, ServiceResopnseType.ClientRes) as ClientResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return clientResponse.data;
        }
      
        public async Task<bool> InsertClient(ClientInfo clientInfo)
        {
            StringContent content = MakeStringContent(clientInfo);
            string url = GenerateURI(WebRouterType.Client) + "insert";
            //
            ClientResponse clientResponse = new ClientResponse();

            try
            {
                HttpResponseMessage response = await _httpClient.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    clientResponse = ParseResponseFrom(responseBody, ServiceResopnseType.ClientRes) as ClientResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return clientResponse.result;
            //Console.WriteLine($"{(response.IsSuccessStatusCode ? "Success" : "Error")} - {response.StatusCode}");
        }

        public async Task<bool> DeleteClient(ClientInfo clientInfo)
        {
            StringContent content = MakeStringContent(clientInfo);
            string url = GenerateURI(WebRouterType.Client) + "delete";
            //
            ClientResponse clientResponse = new ClientResponse();

            try
            {
                HttpResponseMessage response = await _httpClient.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    clientResponse = ParseResponseFrom(responseBody, ServiceResopnseType.ClientRes) as ClientResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return clientResponse.result;
            //Console.WriteLine($"{(response.IsSuccessStatusCode ? "Success" : "Error")} - {response.StatusCode}");
        }

        public async Task<bool> UpdateClient(ClientInfo clientInfo)
        {
            StringContent content = MakeStringContent(clientInfo);
            string url = GenerateURI(WebRouterType.Client) + "update";
            //
            ClientResponse clientResponse = new ClientResponse();
            try
            {
                HttpResponseMessage response = await _httpClient.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    clientResponse = ParseResponseFrom(responseBody, ServiceResopnseType.ClientRes) as ClientResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return clientResponse.result;
            //Console.WriteLine($"{(response.IsSuccessStatusCode ? "Success" : "Error")} - {response.StatusCode}");
        }
        #endregion

        #region USER INFO
        //public async Task<UserInfo> GetUserById(string identifier)
        //{
        //    string url = GenerateURI(WebRouterType.User) + identifier;
        //    HttpResponseMessage response = await _httpClient.GetAsync(url);

        //    UserInfo userInfo = new UserInfo();

        //    //Do exception handling!
        //    if(response.IsSuccessStatusCode)
        //    {
        //        string responseBody = await response.Content.ReadAsStringAsync();
        //        userInfo = JsonConvert.DeserializeObject<UserInfo>(responseBody);
        //    }
        //    return userInfo;
        //}

        public async Task<UserInfo> GetUserById(UserQueryCondition queryCondition)
        {
            // UserQueryCondition userQueryCondition = new UserQueryCondition();
            //userQueryCondition.user_key = 1;

            string url = GenerateURI(WebRouterType.User) + "get-user";
            string queryString = String.Format(@"?user_key=-1&user_id={0}", queryCondition.user_id); // ToQueryString(queryCondition);

            //
            UserResponse userResponse = new UserResponse();

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url + queryString);

                //List<UserInfo> userList = new List<UserInfo>();
                //Do exception handling!
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    //userList = JsonConvert.DeserializeObject<List<UserInfo>>(responseBody);
                    userResponse = ParseResponseFrom(responseBody, ServiceResopnseType.UserRes) as UserResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return userResponse.data;
        }

        public async Task<UserResponse> CanSignIn(UserQueryCondition queryCondition)
        {
            string url = GenerateURI(WebRouterType.User) + "sign-in";
            string queryString = String.Format(@"?&user_id={0}&user_pwd={1}", queryCondition.user_id, queryCondition.user_pwd);

            //
            UserResponse userResponse = new UserResponse();

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url + queryString);

                //List<UserInfo> userList = new List<UserInfo>();
                //Do exception handling!
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    //userList = JsonConvert.DeserializeObject<List<UserInfo>>(responseBody);
                    userResponse = ParseResponseFrom(responseBody, ServiceResopnseType.UserRes) as UserResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return userResponse;
        }

        public async Task<bool> InsertUser(UserInfo user)
        {
            string url = GenerateURI(WebRouterType.User) + "register";

            HttpResponseMessage response = await _httpClient.PostAsync(url, MakeStringContent(user));

            return response.IsSuccessStatusCode;

            //Console.WriteLine($"{(response.IsSuccessStatusCode ? "Success" : "Error")} - {response.StatusCode}");
        }
        #endregion

        #region MWL INFO
        //insomia sample query string
        //http://localhost:8081/api/mwl/getMWLData?pt_id=&pt_name=&ord_acc_num=&rp_id=&rp_study_uid=&sps_modality=&rp_study_dttm_from=20100716&rp_study_dttm_to=20210623160000&sps_station_ae_title=&reqCount=10&reqPage=1&reqSortColumn=sps_id&reqSortOrder=ASC

        // getmwldata? reqCount = 0 & reqPage = 1 & reqSortColumn = pt_key & reqSortOrder = DESC & pt_id = pt01
        //http://10.14.0.146:8081/api/mwl/getMWLData?reqCount=15&reqPage=1&reqSortColumn="pt_name"&reqSortOrder="ASC"&rp_study_dttm_from="20210623"&rp_study_dttm_to="20210910"

        //전달받은 쿼리컨디션을 가지고 URL용 쿼리 스트링을 만든다음에 실제 URL + 쿼리스트링을 붙여서 요청한다.
        //From SCU 
        public async Task<List<MwlItem>> GetMWLDataFromSCU(MwlQueryCondition queryCondition)
        {
            MwlQueryCondition mwlQueryCondition = new MwlQueryCondition();
            mwlQueryCondition = queryCondition;
            mwlQueryCondition.reqCount = 1;
            //
            string queryString = ToQueryString(mwlQueryCondition);
            //
            string url = GenerateURI(WebRouterType.Mwl) + @"get-worklist"; //get-sps-list
            //
            MwlResponse mwlRespose = new MwlResponse();

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url + queryString);

                //Do exception handling!
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    //
                    mwlRespose = ParseResponseFrom(responseBody, ServiceResopnseType.MwlRes) as MwlResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                //log.Error($"An exception occurred from {MethodBase.GetCurrentMethod().Name}", ex);
            }

            return mwlRespose.data;
        }

        //From UI Search 
        public async Task<List<MwlItem>> GetMwlDataFromLocal(SearchQueryCondition queryCondition)
        {
            // Fetching Data by Request Count Param 
            // reqCount 0 : fetch without condition
            // reqCount is over 0 : condition applied
            queryCondition.reqCount = 1; // default is 0 for now
            //
            SearchQueryCondition searchQueryCondition = new SearchQueryCondition();
            searchQueryCondition = queryCondition;
            //
            string queryString = ToQueryString(searchQueryCondition);
            //
            string url = GenerateURI(WebRouterType.Mwl) + @"get-worklist";
            //
            MwlResponse mwlRespose = new MwlResponse();

            //queryString.Replace("True", "true");

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url + queryString);

                //Do exception handling!
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    //
                    mwlRespose = ParseResponseFrom(responseBody, ServiceResopnseType.MwlRes) as MwlResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return mwlRespose.data;
        }

        #endregion

        #region Helper Method

        // Web port usage
        // https://ko.wikipedia.org/wiki/TCP/UDP%EC%9D%98_%ED%8F%AC%ED%8A%B8_%EB%AA%A9%EB%A1%9D ; trusted port list
        // DICOM dedicated port : 104 & 11112
        // https://geol2.tistory.com/114

        private void GetReadyForServerInfo()    // <----- json 으로 변경
        {
            //Get Server Config From Global.xml
            _serverInfo = new ServerInfo()
            {
                AETitle = GlobalConfiguration.SCPAETitle,
                HostName = GlobalConfiguration.SCPHostName,
                DcmPort = GlobalConfiguration.SCPDicomPort,
                WebPort = GlobalConfiguration.SCPWebPort,
                MaxConn = GlobalConfiguration.SCPMaxCon
            };
            ServerInfo = _serverInfo;
        }

        private Object ParseResponseFrom(string jsonResult, ServiceResopnseType type)
        {
            var details = JObject.Parse(jsonResult);
            Object obj = null;

            switch (type)
            {
                case ServiceResopnseType.MwlRes:
                    {
                        obj = new MwlResponse();

                        ((MwlResponse)obj).result = details["result"].ToString().ToUpper() == "TRUE" ? true : false;
                        ((MwlResponse)obj).err_code = details["err_code"].ToString();

                        foreach (JProperty prop in details.Properties())
                        {
                            if (prop.Value.Type == JTokenType.Array)
                            {
                                ((MwlResponse)obj).data = JsonConvert.DeserializeObject<List<MwlItem>>(prop.Value.ToString());
                            }
                        }
                    }
                    break;
                case ServiceResopnseType.ClientRes:
                    {
                        obj = new ClientResponse();

                        ((ClientResponse)obj).result = details["result"].ToString().ToUpper() == "TRUE" ? true : false;
                        ((ClientResponse)obj).err_code = details["err_code"].ToString();

                        foreach (JProperty prop in details.Properties())
                        {
                            if (prop.Value.Type == JTokenType.Array)
                            {
                                ((ClientResponse)obj).data = JsonConvert.DeserializeObject<List<ClientInfo>>(prop.Value.ToString());
                            }
                        }
                    }
                    break;
                case ServiceResopnseType.UserRes:
                    {
                        obj = new UserResponse();

                        ((UserResponse)obj).result = details["result"].ToString().ToUpper() == "TRUE" ? true : false;
                        ((UserResponse)obj).err_code = details["err_code"].ToString();

                        if (((UserResponse)obj).result)
                        {
                            if (details["user"] != null)
                            {
                                ((UserResponse)obj).data = JsonConvert.DeserializeObject<UserInfo>(details["user"].ToString());
                            }
                        }
                    }
                    break;
                default:
                    break;
            }

            return obj;
        }

        private string ToQueryString(Object obj)
        {
            NameValueCollection nvc = new NameValueCollection();

            //Making NVC
            if (obj is MwlQueryCondition)
            {
                ((MwlQueryCondition)obj).GetType().GetProperties()
                    .ToList()
                    .ForEach(pi => nvc.Add(pi.Name,
                    pi.GetValue(((MwlQueryCondition)obj), null)?.ToString()));
            }
            else if (obj is SearchQueryCondition)
            {
                ((SearchQueryCondition)obj).GetType().GetProperties()
                    .ToList()
                    .ForEach(pi => nvc.Add(pi.Name,
                    pi.GetValue(((SearchQueryCondition)obj), null)?.ToString()));
            }
            else if (obj is ClientInfo)
            {
                ((ClientInfo)obj).GetType().GetProperties()
                   .ToList()
                   .ForEach(pi => nvc.Add(pi.Name,
                   pi.GetValue(((ClientInfo)obj), null)?.ToString()));
            }
            else if (obj is UserQueryCondition)
            {
                ((UserQueryCondition)obj).GetType().GetProperties()
                   .ToList()
                   .ForEach(pi => nvc.Add(pi.Name,
                   pi.GetValue(((UserQueryCondition)obj), null)?.ToString()));
            }

            //string temp = nvc["isPatientWorklistQuery"];
            //if (nvc["isPatientWorklistQuery"] != null)
            //{
            //    nvc["isPatientWorklistQuery"] = nvc["isPatientWorklistQuery"] == "True" ? "true" : "false";
            //}

            string temp = nvc["is_strict_condition"];
            if (nvc["is_strict_condition"] != null)
            {
                nvc["is_strict_condition"] = nvc["is_strict_condition"] == "True" ? "true" : "false";
            }

            //
            List<string> nvcValueList = nvc.Cast<string>().Select(t => nvc[t]).ToList();

            // Query String에서 값이 없는 것은 빼기
            for (int i=0; i < nvc.Count; i++)
            {
                if (nvcValueList[i] == string.Empty)
                {
                    nvc.Remove(nvc.Keys[i]);
                }
            }

            //Making Query String 
            var array = (
                from key in nvc.AllKeys
                from value in nvc.GetValues(key)
                select string.Format(
                "{0}={1}",
                HttpUtility.UrlEncode(key),
                HttpUtility.UrlEncode(value))
                ).ToArray();
            return "?" + string.Join("&", array);
        }

        private StringContent MakeStringContent(Object obj)
        {
            string json = string.Empty;
            StringContent stringContent = null;

            if (obj is UserInfo)
            {
                json = JsonConvert.SerializeObject((UserInfo)obj);
            }
            else if (obj is ClientInfo)
            {
                json = JsonConvert.SerializeObject((ClientInfo)obj);
            }


            stringContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");
            return stringContent;
        }

        private string GenerateURI(WebRouterType type)
        {
            string uriString = string.Empty;

            switch (type)
            {
                case WebRouterType.User:
                    uriString = string.Format(fixedURI, _serverInfo.HostName, _serverInfo.WebPort, "user");
                    break;
                case WebRouterType.Patient:
                    //do something
                    break;
                case WebRouterType.CodeSeq:
                    //do something
                    break;
                case WebRouterType.Order:
                    break;
                case WebRouterType.RP:
                    break;
                case WebRouterType.SPS:
                    break;
                case WebRouterType.Server:
                    break;
                case WebRouterType.Mwl:
                    uriString = string.Format(fixedURI, _serverInfo.HostName, _serverInfo.WebPort, "mwl");
                    break;
                case WebRouterType.Client:
                    uriString = string.Format(fixedURI, _serverInfo.HostName, _serverInfo.WebPort, "client");
                    break;
                default:
                    break;
            }
            return uriString;
        }

        #endregion
    }
}
