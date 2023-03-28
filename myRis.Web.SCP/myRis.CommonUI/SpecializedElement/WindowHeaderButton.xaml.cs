using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace myRis.Web.Scp.CommonUI.SpecializedElement
{
    /// <summary>
    /// Interaction logic for WindowHeaderButton.xaml
    /// </summary>
    public partial class WindowHeaderButton : UserControl
    {
        private Window parentWindow;

        public WindowHeaderButton()
        {
            InitializeComponent();
            this.Loaded += WindowHeaderButton_Loaded;
        }

        public enum WindowHeaderButtonType
        {
            Minimize = 1, Maximize, Close
        }

        /// <summary>
        /// Type에 따라서 Content 셋팅
        /// </summary>
        public WindowHeaderButtonType Type
        {
            get { return _type; }
            set
            {
                _type = value;
                switch (value)
                {
                    case WindowHeaderButtonType.Minimize:
                        //SetImage("../Images/ic_top_btn_login_nor.png");
                        maxButton.Visibility = Visibility.Collapsed;
                        closeButton.Visibility = Visibility.Collapsed;
                        break;
                    case WindowHeaderButtonType.Maximize:
                        minButton.Visibility = Visibility.Collapsed;
                        closeButton.Visibility = Visibility.Collapsed;
                        break;
                    case WindowHeaderButtonType.Close:
                        minButton.Visibility = Visibility.Collapsed;
                        maxButton.Visibility = Visibility.Collapsed;
                        break;
                }
            }
        }
        private WindowHeaderButtonType _type;

        private void WindowHeaderButton_Loaded(object sender, RoutedEventArgs e)
        {
            parentWindow = UIHelper.FindVisualParent<Window>(this);
            if (parentWindow != null)
            {
                minButton.Click += MinButton_Click;
                maxButton.Click += MaxButton_Click;
                closeButton.Click += CloseButton_Click;
            }
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            parentWindow.Close();
        }

        private void MaxButton_Click(object sender, RoutedEventArgs e)
        {
            parentWindow.WindowState = (parentWindow.WindowState == WindowState.Normal) ? WindowState.Maximized : WindowState.Normal;
            WindowStateUpdate();
        }

        private void MinButton_Click(object sender, RoutedEventArgs e)
        {
            parentWindow.WindowState = WindowState.Minimized;
            WindowStateUpdate();
        }

        private void WindowStateUpdate()
        {
            if (parentWindow.WindowState == WindowState.Maximized)
            {
                main.BorderThickness = new Thickness(0);
                main.Margin = new Thickness(7, 7, 7, 0);
                rectMax.Visibility = Visibility.Hidden;
                rectMin.Visibility = Visibility.Visible;
            }
            else
            {
                main.BorderThickness = new Thickness(1);
                main.Margin = new Thickness(0);
                rectMax.Visibility = Visibility.Visible;
                rectMin.Visibility = Visibility.Hidden;
            }
        }
    }
}
