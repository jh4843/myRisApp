using myRis.Web.Scp.DataProvider.Misc;
using System.Windows.Controls;

namespace myRis.Web.Scp.Setting.View
{
    /// <summary>
    /// Interaction logic for LogView.xaml
    /// </summary>
    public partial class LogView : UserControl
    {
        public LogView()
        {
            Logger.Instance.WriteLogDebug("LogView", @"LogView", @"[START]");

            InitializeComponent();

            Logger.Instance.WriteLogDebug("LogView", @"LogView", @"[END]");
        }
    }
}
