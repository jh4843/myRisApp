using Leadtools.Dicom;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.DataProvider;
using myRis.Web.Scp.DataProvider.Misc;
using myRis.Web.Scp.Dicom;
using myRis.Web.Scp.Dicom.Common;
using myRis.Web.Scp.Service.ServiceHelper;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Service
{
    // [Register as windows service]
    // - Prompt command window with admin previlege
    // INSTALL   :  sc.exe create "myRis.WEB.SCP.BROKER" binpath="fullpath to exe file"
    // UNINSTALL : sc.exe delete "myRis.WEB.SCP.BROKER"

    public class Worker : BackgroundService
    {
        private DicomServer _dicomServer;
        private readonly ILogger<Worker> _logger;
        public IConfiguration _configuration;
        private ServerInfo _serverInfo;
        private ClientInfo clientInfo;

        public Worker(ILogger<Worker> logger, IConfiguration configuration)
        {
            Logger.Instance.WriteLogDebug(@"Worker", "Worker", @"[START]");

            _logger = logger;
            _configuration = configuration;
            _serverInfo = new ServerInfo();

            Logger.Instance.WriteLogDebug(@"Worker", "Worker", @"[END]");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Logger.Instance.WriteLogDebug(@"Worker", "ExecuteAsync", @"[START]");

            //while (!stoppingToken.IsCancellationRequested)
            //{
            //    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            //    await Task.Delay(1000, stoppingToken);
            //}

            WebDataProvider.Instance.GetReadyForDataProvider();
            _serverInfo = GlobalConfiguration.ServerInfo;

            Logger.Instance.WriteLogError(@"Worker", "ExecuteAsync", @"myRis DICOM Service is running");

            // start DICOM server on port from command line argument or 11112
            //Console.WriteLine($"Starting C-Store SCP server on port {port}");
            using (MessageLoop msgLoop = new MessageLoop())
            {
                msgLoop.Loaded += MsgLoop_Loaded;
                msgLoop.Closed += MsgLoop_Closed;

                msgLoop.Run();
            }

            Logger.Instance.WriteLogDebug(@"Worker", "ExecuteAsync", @"[END]");
        }

        private void MsgLoop_Closed(object sender, EventArgs e)
        {
            // MWL Service Closed
            Logger.Instance.WriteLogDebug(@"Worker", "MsgLoop_Closed", @"[START]");

            Utils.DicomNetShutdown();
            Utils.EngineShutdown();

            Logger.Instance.WriteLogDebug(@"Worker", "MsgLoop_Closed", @"[END]");
        }

        private void MsgLoop_Loaded(object sender, EventArgs e)
        {
            Logger.Instance.WriteLogDebug(@"Worker", "MsgLoop_Loaded", @"[START]");

            // MWL Service Ready
            StartDicomServer();

            Logger.Instance.WriteLogDebug(@"Worker", "MsgLoop_Loaded", @"[END]");
        }

        private bool StartDicomServer()
        {
            Logger.Instance.WriteLogDebug(@"Worker", "StartDicomServer", @"[START]");

            bool result = true;

            try
            {
                _dicomServer = new DicomServer();

                Utils.EngineStartup();      // Dicom network communication ���ؼ� �ʿ�
                Utils.DicomNetStartup();    // Dicom network communication ���ؼ� �ʿ�
                _dicomServer.CalledAE = _serverInfo.AETitle;
                _dicomServer.IPAddress = _serverInfo.HostName; ;
                _dicomServer.Port = _serverInfo.DcmPort;
                _dicomServer.Peers = _serverInfo.MaxConn;

                DicomExceptionCode ret = _dicomServer.Listen();

            }
            catch (Exception ex)
            {
                result = false;
                Logger.Instance.WriteLogError(@"Worker", @"StartDicomServer", ex.Message);
            }

            string msg = string.Format(@"Dicom Service is On hostName[{0}], port[{1}], aetitle[{2}]", _serverInfo.HostName, _serverInfo.DcmPort, _serverInfo.AETitle);
            Logger.Instance.WriteLogError(@"Worker", "StartDicomServer", msg);

            Logger.Instance.WriteLogDebug(@"Worker", "StartDicomServer", @"[END]");

            return result;
        }
    }
}