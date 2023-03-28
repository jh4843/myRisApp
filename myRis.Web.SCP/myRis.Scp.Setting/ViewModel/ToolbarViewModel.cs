using myRis.Web.Scp.CommonUI;
using myRis.Web.Scp.DataProvider.Misc;
using System.Windows;
using System.Windows.Controls.Primitives;

namespace myRis.Web.Scp.Setting.ViewModel
{
    public class ToolbarViewModel : ViewModelBase<View.ToolbarView>
    {
        readonly MainWindowViewModel _parentViewModel;

        public ToolbarViewModel(MainWindowViewModel parentVM, View.ToolbarView view)
           : base(view)
        {
            Logger.Instance.WriteLogDebug("ToolbarViewModel", "ToolbarViewModel", @"[START]");

            _parentViewModel = parentVM;

            View.btnMwlList.AddHandler(ButtonBase.ClickEvent, (RoutedEventHandler)MwlList_Click);

            Logger.Instance.WriteLogDebug("ToolbarViewModel", "ToolbarViewModel", @"[END]");
        }

        private void MwlList_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("ToolbarViewModel", "MwlList_Click", @"[START]");

            View.MwlListView mwlListView = new();
            MwlListViewModel mwlListVM = new(_parentViewModel, mwlListView);
            mwlListView.DataContext = mwlListVM;
            mwlListView.ShowDialog();

            Logger.Instance.WriteLogDebug("ToolbarViewModel", "MwlList_Click", @"[END]");
        }
    }
}