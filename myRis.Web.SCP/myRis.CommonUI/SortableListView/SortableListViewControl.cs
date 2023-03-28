using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace myRis.Web.Scp.CommonUI.SortableListView
{
    /// Warning : 해당 Class를 사용하여 ListView를 쓸 때는, GridViewColumnHeader 에서 HeaderTemplate 을 사용하지 말아야 한다.
    /// http://www.thejoyofcode.com/sortable_listview_in_wpf.aspx
    /// http://msdn.microsoft.com/ko-kr/library/ms745786.aspx
    /// </summary>
    public class SortableListViewControl : ListView
    {
        GridViewColumnHeader _lastHeaderClicked = null;
        ListSortDirection _lastDirection = ListSortDirection.Ascending;

        public SortableListViewControl()
        {
            this.AddHandler(
                GridViewColumnHeader.ClickEvent,
                new RoutedEventHandler(GridViewColumnHeaderClickedHandler)
                );

            //Style 관련
            this.Initialized += new EventHandler(SortableListView_Initialized);

            // ItemsSource에 들어있는 값이 바뀔 때
            TypeDescriptor.GetProperties(this)["ItemsSource"].AddValueChanged(this,
                new EventHandler(ListViewItemsSourceChangedHandler));
        }

        // ItemsSource에 들어있는 값이 바뀔 때, Sort도 풀리므로 다시 Sort
        private void ListViewItemsSourceChangedHandler(object sender, EventArgs e)
        {
            if (_lastHeaderClicked != null)
                Sort(GetSortPropertyName(_lastHeaderClicked.Column), _lastDirection);
        }

        //처음 로드할 때, 기본 Style 할당
        void SortableListView_Initialized(object sender, EventArgs e)
        {
            if (this.Style == null)
                this.Style = Application.Current.TryFindResource(typeof(ListView)) as Style;
        }

        public void Sort(string sortBy, ListSortDirection direction)
        {
            ICollectionView dataView = CollectionViewSource.GetDefaultView(this.ItemsSource);

            //if (dataView != null)
            //{
            //    dataView.SortDescriptions.Clear();
            //    SortDescription sd = new SortDescription(sortBy, direction);
            //    dataView.SortDescriptions.Add(sd);
            //    // Ref : ms-help://MS.VSCC.v90/MS.MSDNQTR.v90.en/fxref_presentationframework/html/3a0953a8-6355-8c5d-bbf6-e9fba22181a4.htm
            //    // Ref의 Remarks 참조 :
            //    //      It is not necessary to explicitly call Refresh on the view after setting the Filter, SortDescriptions, or GroupDescriptions property;
            //    //      refresh is done automatically.
            //    // dataView.Refresh(); 
            //}

            #region Testing Code
            //CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(this.ItemsSource);
            //if (view != null)
            //{
            //    view.SortDescriptions.Clear();
            //    view.GroupDescriptions.Clear();
            //    //view.SortDescriptions.Add(new SortDescription("CourseName", direction));
            //    view.SortDescriptions.Add(new SortDescription(sortBy, direction));
            //    //view.Refresh();
            //}
            #endregion
        }

        private void GridViewColumnHeaderClickedHandler(object sender, RoutedEventArgs e)
        {
            GridViewColumnHeader headerClicked = e.OriginalSource as GridViewColumnHeader;
            ListSortDirection direction;


            if (headerClicked != null &&
                headerClicked.Role != GridViewColumnHeaderRole.Padding)
            {
                string sortBy = GetSortPropertyName(headerClicked.Column);
                if (!string.IsNullOrEmpty(sortBy))
                {
                    if (headerClicked != _lastHeaderClicked)
                        direction = ListSortDirection.Ascending;
                    else
                    {
                        if (_lastDirection == ListSortDirection.Ascending)
                            direction = ListSortDirection.Descending;
                        else
                            direction = ListSortDirection.Ascending;
                    }

                    //if (string.IsNullOrEmpty(sortBy))
                    //    sortBy = headerClicked.Column.Header as string;

                    Sort(sortBy, direction);

                    if (direction == ListSortDirection.Ascending)
                    {
                        headerClicked.Column.HeaderTemplate
                            = Application.Current.TryFindResource("HeaderTemplateArrowUp") as DataTemplate;
                    }
                    else
                    {
                        headerClicked.Column.HeaderTemplate
                            = Application.Current.TryFindResource("HeaderTemplateArrowDown") as DataTemplate;
                    }

                    // Remove arrow from previously sorted header
                    if (_lastHeaderClicked != null && _lastHeaderClicked != headerClicked)
                    {
                        _lastHeaderClicked.Column.HeaderTemplate = null;
                    }

                    _lastHeaderClicked = headerClicked;
                    _lastDirection = direction;

                    OnSetColumnSortDirection(direction.ToString(), sortBy);
                }
            }
        }

        public delegate void SetColumnSortDirectionHandler(string sortDirection, string ColumnName);

        public event SetColumnSortDirectionHandler SetColumSortDirection;
        void OnSetColumnSortDirection(string sortDirection, string ColumnName)
        {
            if (SetColumSortDirection != null)
                SetColumSortDirection(sortDirection, ColumnName);
        }

        //SortPropertyName 을 GridViewColumn을 선언할 때 지정해 줄 수 있도록 해야 함.
        public static readonly DependencyProperty SortPropertyNameProperty =
            DependencyProperty.RegisterAttached("SortPropertyName", typeof(string), typeof(SortableListViewControl));

        public static string GetSortPropertyName(GridViewColumn obj)
        {
            return (string)obj.GetValue(SortPropertyNameProperty);
        }

        public static void SetSortPropertyName(GridViewColumn obj, string value)
        {
            obj.SetValue(SortPropertyNameProperty, value);
        }
    }
}