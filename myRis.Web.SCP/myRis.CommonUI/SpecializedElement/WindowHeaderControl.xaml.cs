using System;
using System.Collections.Generic;
using System.IO;
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
    /// Interaction logic for WindowHeaderControl.xaml
    /// </summary>
    public partial class WindowHeaderControl : UserControl
    {
        private Point startPos;
        private Window parentWindow;
        System.Windows.Forms.Screen[] screens = System.Windows.Forms.Screen.AllScreens;

        BitmapImage IconImage { get; set; }

        public WindowHeaderControl()
        {
            InitializeComponent();
            this.Loaded += WindowHeaderControl_Loaded;
            main.MouseLeftButtonDown += Main_MouseLeftButtonDown;
        }

        // Header Double Click to Maximize
        private void Main_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ClickCount == 2)
            {
                if (parentWindow.WindowState == WindowState.Maximized)
                {
                    parentWindow.WindowState = WindowState.Normal;
                }
                else
                {
                    parentWindow.WindowState = WindowState.Maximized;
                }
            }
        }

        private void WindowHeaderControl_Loaded(object sender, RoutedEventArgs e)
        {
            parentWindow = UIHelper.FindVisualParent<Window>(this);
            if (parentWindow != null)
            {
                //var allScreens = System.Windows.Forms.Screen.AllScreens.ToList();
                //var locationScreen = allScreens.SingleOrDefault(s => parentWindow.Left >= s.WorkingArea.Left && parentWindow.Left < s.WorkingArea.Right);

                parentWindow.MaxHeight = SystemParameters.MaximizedPrimaryScreenHeight;  //SystemParameters.VirtualScreenHeight; // locationScreen.WorkingArea.Height;  
                //parentWindow.MaxWidth = SystemParameters.MaximizedPrimaryScreenWidth;

                parentWindow.StateChanged += ParentWindow_StateChanged;
                parentWindow.LocationChanged += ParentWindow_LocationChanged;
                
                IconImageLoad();
            }
        }

        private void IconImageLoad()
        {
            string baseDirPath = AppDomain.CurrentDomain.BaseDirectory;
            string filePath = baseDirPath + @"Resources\myRisWebSCP.ico";
            bool result = File.Exists(filePath) ? true : false;
            if (result)
            {
                BitmapImage bitmap = new BitmapImage();
                bitmap.BeginInit();
                bitmap.UriSource = new Uri(filePath);

                bitmap.EndInit();
                imgICON.Source = bitmap;
            }
        }

        private void ParentWindow_LocationChanged(object sender, EventArgs e)
        {
            int sum = 0;
            foreach (var item in screens)
            {
                sum += item.WorkingArea.Width;
                if (sum >= parentWindow.Left + parentWindow.Width / 2)
                {
                    double temp = parentWindow.ActualHeight;
                    //parentWindow.MaxHeight = item.WorkingArea.Height + 14;
                    break;
                }
            }
        }

        private void ParentWindow_StateChanged(object sender, EventArgs e)
        {
            switch (parentWindow.WindowState)
            {
                case WindowState.Maximized:
                    {
                        main.BorderThickness = new Thickness(1);
                        main.Margin = new Thickness(7, 7, 7, 0);
                        rectMax.Visibility = Visibility.Hidden;
                        rectMin.Visibility = Visibility.Visible;
                    }
                    break;
                default:
                    {
                        main.BorderThickness = new Thickness(1);
                        main.Margin = new Thickness(0);
                        rectMax.Visibility = Visibility.Visible;
                        rectMin.Visibility = Visibility.Hidden;
                    }
                    break;
            }
        }

        private void System_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                //Window Back to Normal By Dragging when it's in maximum state
                if (parentWindow.WindowState == WindowState.Maximized && Math.Abs(startPos.Y - e.GetPosition(null).Y) > 2)
                {
                    var point = PointToScreen(e.GetPosition(null));

                    parentWindow.WindowState = WindowState.Normal;

                    parentWindow.Left = point.X - parentWindow.ActualWidth / 2;
                    parentWindow.Top = point.Y - border.ActualHeight / 2;
                }
                parentWindow.DragMove();
            }
        }

        private void Maximize_Click(object sender, RoutedEventArgs e)
        {
            parentWindow.WindowState = (parentWindow.WindowState == WindowState.Normal) ? WindowState.Maximized : WindowState.Normal;
        }

        private void Close_Click(object sender, RoutedEventArgs e)
        {
            parentWindow.Close();
        }

        private void Mimimize_Click(object sender, RoutedEventArgs e)
        {
            parentWindow.WindowState = WindowState.Minimized;
        }
    }
}
