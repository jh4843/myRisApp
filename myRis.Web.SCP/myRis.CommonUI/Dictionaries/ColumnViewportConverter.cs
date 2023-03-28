using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Data;

namespace myRis.Web.Scp.CommonUI.Dictionaries
{
    public class ColumnViewportConverter : IValueConverter
    {
        #region IValueConverter Members

        public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            double columnHeight = 20.0;
            double.TryParse(value.ToString(), out columnHeight);
            return new Rect(0, 0, 1, columnHeight * 2);
        }

        public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}