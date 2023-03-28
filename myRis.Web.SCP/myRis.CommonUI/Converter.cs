using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Data;
using System.Windows.Markup;

namespace myRis.Web.Scp.CommonUI
{
    public static class Converter
    {
        /// <summary>
        /// Enum Converter
        /// </summary>
        public static TEnum ToEnum<TEnum>(this string strEnumValue, TEnum defaultValue)
        {
            if (!Enum.IsDefined(typeof(TEnum), strEnumValue))
                return defaultValue;

            return (TEnum)Enum.Parse(typeof(TEnum), strEnumValue);
        }
    }

    /// <summary>
    /// Boolean to Visibility Converter
    /// </summary>
    public class MBoolToVisibilityConverter : MarkupExtension, IMultiValueConverter
    {
        #region IValueConverter Members

        public object Convert(object[] value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            Visibility result = Visibility.Collapsed;
            //0 is matched order present
            //1 fraction group type

            if (value.Length.Equals(2))
            {
                if ((bool)value[0] == false && value[1].ToString() == "ALL")
                {
                    result = Visibility.Visible;
                }
            }

            return result;
        }

        public object[] ConvertBack(object value, Type[] targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            return null;
        }

        #endregion

        // XAML에서 static으로 바로 접근할 수 있게 한다.
        public override object ProvideValue(IServiceProvider serviceProvider)
        {
            if (_converter == null)
                _converter = new MBoolToVisibilityConverter();
            return _converter;
        }
        private static MBoolToVisibilityConverter _converter = null;
    }
}