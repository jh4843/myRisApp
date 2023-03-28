using log4net;
using System;

namespace myRis.Web.Scp.DataProvider.Misc
{
    public class Logger
    {
        //http://logging.apache.org/log4net/log4net-1.2.11/release/sdk/log4net.Layout.PatternLayout.html
        private static readonly Logger _instance = new Logger();

        public enum LogLevel
        {
            // All -> Debug -> Info -> Warning -> Error -> Fatal Error
            Error = 0, Info, All
        }

        public static Logger Instance
        {
            get
            {
                return _instance;
            }
        }

        public void Init()
        {
            log4net.GlobalContext.Properties["pid"] = Environment.ProcessId;
        }

        public void TurnOnLogging(LogLevel inLogLevel)
        {
            switch (inLogLevel)
            {
                case LogLevel.All:
                    {
                        ((log4net.Repository.Hierarchy.Hierarchy)LogManager.GetLoggerRepository()).Root.Level = log4net.Core.Level.All;
                    }
                    break;
                case LogLevel.Info:
                    {
                        ((log4net.Repository.Hierarchy.Hierarchy)LogManager.GetLoggerRepository()).Root.Level = log4net.Core.Level.Info;
                    }
                    break;
                case LogLevel.Error:
                    {
                        ((log4net.Repository.Hierarchy.Hierarchy)LogManager.GetLoggerRepository()).Root.Level = log4net.Core.Level.Error;
                    }
                    break;
                default:
                    {
                        ((log4net.Repository.Hierarchy.Hierarchy)LogManager.GetLoggerRepository()).Root.Level = log4net.Core.Level.Error;
                    }
                    break;
            }

            ((log4net.Repository.Hierarchy.Hierarchy)LogManager.GetRepository()).RaiseConfigurationChanged(EventArgs.Empty);
        }

        //// Debug log
        public void WriteLogDebug(string className, string methodName, string message)
        {
            LogManager.GetLogger(className + " : " + methodName).Debug(message);
        }

        //// General log
        public void WriteLogInfo(string className, string methodName, string message)
        {
            LogManager.GetLogger(className + " : " + methodName).Info(message);
        }

        //// Error log
        public void WriteLogError(string className, string methodName, string message)
        {
            LogManager.GetLogger(className + " : " + methodName).Error(message);
        }

        //// Fatal error log
        public void WriteLogFatal(string className, string methodName, string message)
        {
            LogManager.GetLogger(className + " : " + methodName).Fatal(message);
        }
    }
}