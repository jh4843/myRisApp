using myRis.Web.Scp.DataProvider.Misc;
using System.Windows;

namespace myRis.Web.Scp.Setting
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            Logger.Instance.WriteLogDebug("MainWindow", @"MainWindow", @"[START]");

            InitializeComponent();
            this.DataContext = new MainWindowViewModel(this);

            Logger.Instance.WriteLogDebug("MainWindow", @"MainWindow", @"[END]");
        }
    }
}
