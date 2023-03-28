using myRis.Web.Scp.DataProvider.Misc;
using System.Net.Http;
using System.Security.Authentication;

namespace myRis.Web.Scp.DataProvider.Factory
{
    public class DataProviderFactory
    {
        private DataProviderType _type;
        //public string _fixedURI = @"http://{0}:{1}/api/{2}/";

        public string FixedURI { get; set; } = @"http://{0}:{1}/api/{2}/";

        public enum DataProviderType
        {
            DP_WebService = 0,   //from web service 
            DP_DATABASE,         //from direct conn to database
        }

        public DataProviderFactory(DataProviderType type)
        {
            _type = type;
        }

        public object CreateDataProvider()
        {
            Logger.Instance.WriteLogDebug("DataProviderFactory", "CreateDataProvider", @"[START]");

            object dataProvider = null;

            switch (_type)
            {
                case DataProviderType.DP_WebService:
                    {
                        dataProvider = GetHTTPClientWithSecurityEnabled(false);
                    }
                    break;
                case DataProviderType.DP_DATABASE:
                    {

                    }
                    break;
                default:
                    break;
            }

            Logger.Instance.WriteLogDebug("DataProviderFactory", "CreateDataProvider", @"[END]");

            return dataProvider;
        }

        // About [TLS / SSL]
        // https://www.itworld.co.kr/news/113007
        // https://blog.naver.com/nine01223/222588865936
        private HttpClient GetHTTPClientWithSecurityEnabled(bool enabled)
        {
            Logger.Instance.WriteLogDebug("DataProviderFactory", "GetHTTPClientWithSecurityEnabled", @"[START]");

            HttpClient client = null;
            if (enabled)
            {
                // Specify to use TLS 1.2 as default connection to utilize HTTPS protocol 
                var handler = new HttpClientHandler()
                {
                    SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls11 | SslProtocols.Tls
                };
                // Bypassing server certificate
                handler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
                //
                FixedURI = @"https://{0}:{1}/api/{2}/";
                //
                Logger.Instance.WriteLogDebug("DataProviderFactory", "GetHTTPClientWithSecurityEnabled", @"[END]" + @"enabled - true");
                //
                return client = new HttpClient(handler);
            }

            Logger.Instance.WriteLogDebug("DataProviderFactory", "GetHTTPClientWithSecurityEnabled", @"[END]");

            return client = new HttpClient();
        }
    }
}