using myRis.Web.Scp.DataProvider.Misc;
using System.Windows;

namespace myRis.Web.Scp.Setting.View
{
    /// <summary>
    /// Interaction logic for MwlListView.xaml
    /// </summary>
    public partial class MwlListView : Window
    {
        public MwlListView()
        {
            Logger.Instance.WriteLogDebug("MwlListView", @"MwlListView", @"[START]");

            InitializeComponent();

            Logger.Instance.WriteLogDebug("MwlListView", @"MwlListView", @"[END]");
        }
    }
}