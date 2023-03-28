using myRis.Web.Scp.DataProvider.Misc;
using System.Windows.Controls;

namespace myRis.Web.Scp.Setting.View
{
    /// <summary>
    /// Interaction logic for ToolbarView.xaml
    /// </summary>
    public partial class ToolbarView : UserControl
    {
        public ToolbarView()
        {
            Logger.Instance.WriteLogDebug("ToolbarView", "ToolbarView", @"[START]");

            InitializeComponent();

            Logger.Instance.WriteLogDebug("ToolbarView", "ToolbarView", @"[END]");
        }
    }
}