using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using myRis.Web.Scp.DataProvider;
using myRis.Web.Scp.DataProvider.Misc;
using System.IO;


// .NET Core Worker Service as Windows Service or Linux Daemons
// https://levelup.gitconnected.com/net-core-worker-service-as-windows-service-or-linux-daemons-a9579a540b77
// So why is there a StartAsync and ExecuteAsync?
// https://stackoverflow.com/questions/60356396/difference-between-executeasync-and-startasync-methods-in-backgroundservice-net\

namespace myRis.Web.Scp.Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Logger.Instance.Init();
            Logger.Instance.TurnOnLogging(DataProvider.Misc.GlobalConfiguration.GetUserLogLevel());

            bool dicomServerOnly = true;
            GlobalConfiguration.InitConfiguration(dicomServerOnly);
            LicenseProvider.Instance.GetLicense();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            Logger.Instance.WriteLogDebug(@"Program", "CreateHostBuilder", @"[START]");

            // Build Configuration from appsettings
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();

            Logger.Instance.WriteLogDebug(@"Program", "CreateHostBuilder", @"[END]");

            // Create runtime host and run the application
            return Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddSingleton<IConfigurationRoot>(configuration);
                    services.AddHostedService<Worker>();
                }).UseWindowsService();
        }

        //public static IHostBuilder CreateHostBuilder(string[] args) =>
        //    Host.CreateDefaultBuilder(args)
        //        .ConfigureServices((hostContext, services) =>
        //        {
        //            services.AddHostedService<Worker>();
        //        });
    }
}