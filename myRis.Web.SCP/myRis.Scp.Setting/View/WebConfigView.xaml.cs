using myRis.Web.Scp.DataProvider.Misc;
using System.Windows.Controls;

namespace myRis.Web.Scp.Setting.View
{
    /// <summary>
    /// Interaction logic for WebConfigView.xaml
    /// </summary>
    public partial class WebConfigView : UserControl
    {
        public WebConfigView()
        {
            Logger.Instance.WriteLogDebug("WebConfigView", "WebConfigView", @"[START]");

            InitializeComponent();

            Logger.Instance.WriteLogDebug("WebConfigView", "WebConfigView", @"[END]");
        }
    }
}