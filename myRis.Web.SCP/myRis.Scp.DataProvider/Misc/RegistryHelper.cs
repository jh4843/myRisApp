using Microsoft.Win32;
using System;

namespace myRis.Web.Scp.DataProvider.Misc
{
    /// <summary>
    /// Registry로 데이터를 save, retrieve하기 위한 Class
    /// </summary>
    public class RegistryHelper
    {
        private static RegistryKey m_rootKey = Microsoft.Win32.Registry.CurrentUser;

        public RegistryHelper(RegistryKey rootKey)
        {
            m_rootKey = rootKey;
        }

        #region Function Sets

        public static int countValue(string subkey)
        {
            RegistryKey Key = null;
            int count = 0;

            try
            {
                Key = m_rootKey.OpenSubKey(subkey);
                count = Key.ValueCount;
                return count;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"RegistryHelper", @"countValue", ex.Message);
                return 0;
            }
            finally
            {
                if (Key != null)
                    Key.Close();
            }
        }

        public static int SubKeyCount(string subkey)
        {
            // 레지스트리로부터 값을 읽어오는 함수.
            RegistryKey Key = null;
            int count = 0;

            try
            {
                Key = m_rootKey.OpenSubKey(subkey);

                if (Key == null)
                {
                    // 해당이름으로 서브키 생성
                    Key = m_rootKey.CreateSubKey(subkey);
                }

                count = Key.SubKeyCount;

                return count;
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"RegistryHelper", @"SubKeyCount", ex.Message);
                return count;
            }
            finally
            {
                if (Key != null)
                    Key.Close();
            }
        }

        public static object GetValue(string subkey, string key, object defaultValue)
        {
            // 레지스트리로부터 값을 읽어오는 함수.
            RegistryKey Key = null;

            try
            {
                Key = m_rootKey.OpenSubKey(subkey);
                if (Key == null)
                {
                    // 해당이름으로 서브키 생성
                    Key = m_rootKey.CreateSubKey(subkey);
                }
                return Key.GetValue(key, defaultValue);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"RegistryHelper", @"GetValue", ex.Message);
                return defaultValue;
            }
            finally
            {
                if (Key != null)
                    Key.Close();
            }
        }

        public static void SetValue(string subkey, string key, object Value)
        {
            // 레지스트리에 값을 쓰는 함수.
            RegistryKey Key = null;
            try
            {
                Key = m_rootKey.CreateSubKey(subkey);
                Key.SetValue(key, Value); //Convert.ToString( Value ) );
            }
            catch { }
            finally
            {
                if (Key != null)
                    Key.Close();
            }
        }

        #endregion
    }
}
