using myRis.Web.Scp.CommonUI;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.Data.QueryCondition;
using myRis.Web.Scp.DataProvider;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using static myRis.Web.Scp.Setting.Def;

namespace myRis.Web.Scp.Setting.ViewModel
{
    public class MwlListViewModel : ViewModelBase<View.MwlListView>
    {
        #region ENUM
        public enum MwlListHeaderItems
        {
            OrdStatusFlag = 0, PatientID, PatientName, PatientSex, PatientBitrhDttm, 
            OrdAccNumber, SpsModality, OrdRequestPhyc, SpsPermPhyc, SpsStartDate, 
            OrdStudyUID, OrdStudyDttm, SpsID, OrdRpID, PatientSpeciesCodeSeq, 
            PatientBreedCodeSeq, PatientResponsiblePerson
        }
        #endregion

        #region VALUES
        readonly MainWindowViewModel _parentViewModel;
        List<MwlItem> _mwlItemList;
        private string _hideColumnNumbers;
        List<string> _orderStatusList;

        GridViewColumnHeader _lastHeaderClicked = null;
        ListSortDirection _lastDirection = ListSortDirection.Ascending;
        Binding columnBinding;
        #endregion

        #region PROPERTIES
        public List<MwlItem> MwlItemList
        {
            get
            {
                return _mwlItemList;
            }
            set
            {
                _mwlItemList = value;
                OnPropertyChanged(nameof(MwlItemList));
            }
        }

        public string HideColumnNumbers
        {
            get
            {
                return _hideColumnNumbers;
            }
            set
            {
                _hideColumnNumbers = value;
                OnPropertyChanged("HideColumnNumbers");
            }
        }

        public List<string> OrderStatusList { get; set; }
        #endregion

        #region METHODS
        public MwlListViewModel(MainWindowViewModel parentVM, View.MwlListView view)
           : base(view)
        {
            Logger.Instance.WriteLogDebug("MwlListViewModel", "MwlListViewModel", @"[START]");

            _parentViewModel = parentVM;

            View.lstMwlView.AddHandler(GridViewColumnHeader.ClickEvent, (RoutedEventHandler)LstMwlView_HeaderClick);
            View.stkpBtnList.AddHandler(ButtonBase.ClickEvent, (RoutedEventHandler)StkpBtnList_Click);

            // Veterinary 라이센스가 아닐 경우 Patient Specise Code Sequence, Patient Breed Code Sequence 컬럼은 보이지 않도록 한다.
            if (DataProvider.LicenseProvider.LicenseTypes.Veterinary != DataProvider.LicenseProvider.Instance.GetCurLicenseType())
            {
                List<int> listVet = new List<int>();
                listVet.Add((int)MwlListHeaderItems.PatientSpeciesCodeSeq);
                listVet.Add((int)MwlListHeaderItems.PatientBreedCodeSeq);
                listVet.Add((int)MwlListHeaderItems.PatientResponsiblePerson);

                string veterinaryHeader = string.Empty;
                foreach (int item in listVet)
                {
                    veterinaryHeader += item.ToString() + ",";
                }

                if (false == string.IsNullOrEmpty(veterinaryHeader))
                {
                    veterinaryHeader = veterinaryHeader.TrimEnd(',');
                }

                HideColumnNumbers = veterinaryHeader;
            }

            _orderStatusList = new List<string>();
            _orderStatusList.Add(nameof(OrderStatus.NONE));
            _orderStatusList.Add(nameof(OrderStatus.ORDERED));
            _orderStatusList.Add(nameof(OrderStatus.SCHEDULED));
            _orderStatusList.Add(nameof(OrderStatus.EXAMINED));
            _orderStatusList.Add(nameof(OrderStatus.MATCHED));
            _orderStatusList.Add(nameof(OrderStatus.COMPLETED));
            _orderStatusList.Add(nameof(OrderStatus.CANCELED));
            OrderStatusList = _orderStatusList;

            view.cbxOrderStatus.SelectedIndex = 0;

            Logger.Instance.WriteLogDebug("MwlListViewModel", "MwlListViewModel", @"[END]");
        }

        #region Column Sort 
        private void LstMwlView_HeaderClick(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("MwlListViewModel", "LstMwlView_HeaderClick", @"[START]");

            // Click 된 헤더정보 획득
            GridViewColumnHeader headerClicked = e.OriginalSource as GridViewColumnHeader;
            // List의 SortDirection 변수 선언
            ListSortDirection direction;

            // Click 된 헤더가 없으면 return 처리
            if (headerClicked == null)
                return;

            // Padding 이면 무시
            if (headerClicked.Role == GridViewColumnHeaderRole.Padding)
                return;

            if (headerClicked != _lastHeaderClicked)
            {
                direction = ListSortDirection.Ascending;
            }
            else
            {
                if (_lastDirection == ListSortDirection.Ascending)
                {
                    direction = ListSortDirection.Descending;
                }
                else
                {
                    direction = ListSortDirection.Ascending;
                }
            }

            // 데이터 바인딩 값을 확인하여 소팅함
            columnBinding = headerClicked.Column.DisplayMemberBinding as Binding;
            if (columnBinding == null)
                return;

            Sort(columnBinding.Path.Path, direction);

            // 소트에 따라 컬럼에 화살표 나타냄
            if (direction == ListSortDirection.Ascending)
            {
                headerClicked.Column.HeaderTemplate =
                    Application.Current.TryFindResource("HeaderTemplateArrowUp") as DataTemplate;
            }
            else
            {
                headerClicked.Column.HeaderTemplate =
                    Application.Current.TryFindResource("HeaderTemplateArrowDown") as DataTemplate;
            }

            // Remove arrow from previously sorted header
            if (_lastHeaderClicked != null && _lastHeaderClicked != headerClicked)
            {
                _lastHeaderClicked.Column.HeaderTemplate = null;
            }


            _lastHeaderClicked = headerClicked;
            _lastDirection = direction;

            Logger.Instance.WriteLogDebug("MwlListViewModel", "LstMwlView_HeaderClick", @"[END]");
        }

        private void Sort(string sortBy, ListSortDirection direction)
        {
            Logger.Instance.WriteLogDebug("MwlListViewModel", "Sort", @"[START]");

            ICollectionView dataView =
              CollectionViewSource.GetDefaultView(View.lstMwlView.ItemsSource);

            //
            if (dataView != null)
            {
                dataView.SortDescriptions.Clear();
                SortDescription sd = new SortDescription(sortBy, direction);
                dataView.SortDescriptions.Add(sd);
                dataView.Refresh();
            }

            Logger.Instance.WriteLogDebug("MwlListViewModel", "Sort", @"[END]");
        }
        #endregion

        // https://offbyone.tistory.com/318
        // https://blog.naver.com/senshig/222210608392
        // Server 시간이 GMT 기준이라서 한국시간으로 바꿀려면 +9해서 가져와야 정상적으로 DateTime이 표시됨.
        // Query 할때는 입력 파라미터에 들어가는 DateTime이 그대로 들어감. 
        // SELECT @@global.time_zone, @@session.time_zone, @@system_time_zone; <-- 시스템으로 
        // GMT(Greenwich Mean Time)가 표준화 된게 UTC(Universe Time Coordinate) 
        // 우리나라는 KST 이고 얘는 UTC +9:00 인 값임.
        // 서버에 타임존을 바꿀려면 my.ini 파일에 [mysqld]섹션에 default-time-zone을 추가해야함.
        //
        // EX)
        // Default Time(시간없시 입력시) : Today - 03/30/2022 12:00 AM 
        // UTC Time (Database 저장시)   : 03/29/2022 15:00 PM (-9hours)  
        //
        private async void StkpBtnList_Click(object sender, RoutedEventArgs e)
        {
            Logger.Instance.WriteLogDebug("MwlListViewModel", "StkpBtnList_Click", @"[START]");

            DateTime time = DateTime.Now;

            FrameworkElement source = e.Source as FrameworkElement;
            SearchQueryCondition searchQueryCondition = new SearchQueryCondition();

            if (source.Name == "cbxOrderStatus")
                return;

            if (0 < (int)GetOrderStatusEnumToMeaning(View.cbxOrderStatus.SelectedValue.ToString()))
                searchQueryCondition.ord_status = ((int)GetOrderStatusEnumToMeaning(View.cbxOrderStatus.SelectedValue.ToString())).ToString();

            switch (source.Name)
            {
                case "btnToday":
                    searchQueryCondition.sps_start_dttm_from = DateTime.Today.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    searchQueryCondition.sps_start_dttm_to = DateTime.Today.AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    break;
                case "btnYesterday":
                    searchQueryCondition.sps_start_dttm_from = DateTime.Today.AddDays(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    searchQueryCondition.sps_start_dttm_to = DateTime.Today.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    break;
                case "btnLast7Days":
                    searchQueryCondition.sps_start_dttm_from = DateTime.Today.AddDays(-7).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    searchQueryCondition.sps_start_dttm_to = DateTime.Today.AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    break;
                case "btnLast1Month":
                    searchQueryCondition.sps_start_dttm_from = DateTime.Today.AddMonths(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    searchQueryCondition.sps_start_dttm_to = DateTime.Today.AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    break;
                case "btnLast1Year":
                    searchQueryCondition.sps_start_dttm_from = DateTime.Today.AddYears(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    searchQueryCondition.sps_start_dttm_to = DateTime.Today.AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                    break;
                default:
                    break;
            }

            // For Testing 값 확인용
            DateTime temp = DateTime.Today; //.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");     ; // 3/20/2022 12:00 AM (2022년 3월 20일 시작시간)
            DateTime tempUTC = temp.ToUniversalTime();
            DateTime rectifiedTime = temp.AddHours(9);
            DateTime utcTemp = DateTime.Today.ToUniversalTime();
            //

            List<MwlItem> itemList = await WebDataProvider.Instance.GetMwlDataFromLocal(searchQueryCondition);

            if (itemList == null)
            {
                itemList = new List<MwlItem>();
            }

            RectifyingNameTimeDataForDisplay(itemList);

            ChangeOrderStatusFlagToMeaning(itemList);

            //
            View.lstMwlView.ItemsSource = itemList;
            MwlItemList = itemList;

            Logger.Instance.WriteLogDebug("MwlListViewModel", "StkpBtnList_Click", @"[END]");
        }

        // 쿼리해서 받는 시간이 이미 디비시간(UTC+ISO)에서 -9시간 되어서 들어옴.
        // ToLocalTime으로 하면 +9 가 되어서 DB에 있는 시간이 되므로, 최종적으로는 localTime에서 +9를 해야 실제 시간임.
        private void RectifyingNameTimeDataForDisplay(List<MwlItem> itemList)
        {
            Logger.Instance.WriteLogDebug("MwlListViewModel", "RectifyingNameTimeDataForDisplay", @"[START]");

            try
            {
                // Rectifying Name Value(First Last)
                itemList.ForEach(t => t.pt_name = t.pt_name.Replace("^", "  "));

                var offset = TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow);

                // Rctifying Date Time 
                itemList.ForEach(t => t.pt_birth_dttm = t.pt_birth_dttm.ToLocalTime().AddHours(offset.TotalHours));
                itemList.ForEach(t => t.sps_start_dttm = t.sps_start_dttm.ToLocalTime().AddHours(offset.TotalHours));
                itemList.ForEach(t => t.ord_study_dttm = t.ord_study_dttm.ToLocalTime().AddHours(offset.TotalHours));
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("MwlListViewModel", "RectifyingNameTimeDataForDisplay", ex.Message);
            }

            Logger.Instance.WriteLogDebug("MwlListViewModel", "RectifyingNameTimeDataForDisplay", @"[END]");
        }

        private void ChangeOrderStatusFlagToMeaning(List<MwlItem> itemList)
        {
            Logger.Instance.WriteLogDebug("MwlListViewModel", "ChangeOrderStatusFlagToMeaning", @"[START]");

            try
            {
                itemList.ForEach(t => t.ord_status_flag = Def.GetOrderStatusMeaningToEnum(t.ord_status_flag.ToString()));
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("MwlListViewModel", "ChangeOrderStatusFlagToMeaning", ex.Message);
            }

            Logger.Instance.WriteLogDebug("MwlListViewModel", "ChangeOrderStatusFlagToMeaning", @"[END]");

        }
        #endregion
    }
}