using myRis.Web.Scp.DataProvider.Misc;
using System.Windows.Controls;

namespace myRis.Web.Scp.Setting.View
{
    /// <summary>
    /// Interaction logic for ConfigView.xaml
    /// </summary>
    public partial class ConfigView : UserControl
    {
        public ConfigView()
        {
            Logger.Instance.WriteLogDebug("ConfigView", "ConfigView", @"[START]");

            InitializeComponent();

            Logger.Instance.WriteLogDebug("ConfigView", "ConfigView", @"[END]");
        }
    }
}