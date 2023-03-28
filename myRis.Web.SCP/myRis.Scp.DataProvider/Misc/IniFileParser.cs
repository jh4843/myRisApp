using System;
using System.Runtime.InteropServices;
using System.Text;

namespace myRis.Web.Scp.DataProvider.Misc
{
    //INI File Read&Write Wrapping Class
    public class IniFileParser : IDisposable
    {
        private static readonly IniFileParser _instance = new IniFileParser();

        private string _path;

        public static IniFileParser Instace
        {
            get { return _instance; }
        }

        public void Init(string path)
        {
            _path = path;
        }

        // SECTION 안에 있는 key의 value를 설정한다. [SECTION] KEY = VALUE
        public void Write(string section, string key, string value)
        {
            Win32NativePrivateProfile.WritePrivateProfileString(section, key, value, _path);
        }

        // SECTION 안에 있는 key의 value를 획득한다. [SECTION] KEY = VALUE
        public string Read(string section, string key)
        {
            StringBuilder temp = new StringBuilder(1024);
            Win32NativePrivateProfile.GetPrivateProfileString(section, key, string.Empty, temp, 1024, _path);

            return temp.ToString();
        }

        public void DeleteKey(string Section, string Key)
        {
            Write(Section, Key, null);
        }

        public void DeleteSection(string Section)
        {
            Write(Section, null, null);
        }

        #region IDisposable Members

        public void Dispose()
        {
            // nothing to do
        }

        #endregion
    }

    // Win32Native wrapping class
    internal class Win32NativePrivateProfile
    {
        [DllImport("kernel32.dll")]
        public static extern bool WritePrivateProfileString(string lpAppName, string lpKeyName, string lpString, string lpFileName);

        [DllImport("kernel32.dll")]
        public static extern int GetPrivateProfileString(string section, string key, string def, StringBuilder retVal, int size, string filePath);
    }
}