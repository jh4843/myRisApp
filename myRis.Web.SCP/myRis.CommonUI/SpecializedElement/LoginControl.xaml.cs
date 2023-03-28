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
    /// Interaction logic for LoginControl.xaml
    /// </summary>
    public partial class LoginControl : UserControl
    {
        public enum LoginResultType { Success, WrongID, WrongPwd, NoAuthorization, UnExpected };

        private Point startPos;
        private Window parentWindow;

        //Registry interaction variables
        private string _storedUsrID;
        private string _subKeyName = string.Empty;

        public LoginControl()
        {
            InitializeComponent();
            this.Loaded += LoginControl_Loaded;
        }

        private void LoginControl_Loaded(object sender, RoutedEventArgs e)
        {
            parentWindow = UIHelper.FindVisualParent<Window>(this);
            if (parentWindow != null)
            {
                //parentWindow.StateChanged += ParentWindow_StateChanged;
                //parentWindow.LocationChanged += ParentWindow_LocationChanged;
                IconImageLoad();
            }

            //
            this.KeyDown += LoginControl_KeyDown;
            //
            PasswordBoxText = string.Empty;
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

        private void LoginControl_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Enter:
                    OnLogin();
                    break;
                default:
                    break;
            }
        }

        private void btnEnter_Click(object sender, RoutedEventArgs e)
        {
            OnLogin();
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

                    parentWindow.Left = point.X - this.ActualWidth / 2;
                    parentWindow.Top = point.Y - border.ActualHeight / 2;
                }
                parentWindow.DragMove();
            }
        }
        private void Close_Click(object sender, RoutedEventArgs e)
        {
            parentWindow.Close();
        }

        private void tbxPwd_PasswordChanged(object sender, RoutedEventArgs e)
        {
            int length = (sender as PasswordBox).Password.Length;

            if (length > 0)
            {
                tbkPwdBox.Visibility = Visibility.Collapsed; // password box is not empty
            }
            else
            {
                tbkPwdBox.Visibility = Visibility.Visible;  // password box is empty
            }
        }

        #region Login event
        public event LoginHandler Login;
        public delegate Task<Tuple<LoginResultType, string>> LoginHandler(string id, string pwd);
        private async void OnLogin()
        {
            //If the event has connected & ready
            if (Login != null)
            {
                string msg = string.Empty;

                // Login 시
                if (string.IsNullOrEmpty(tbxID.Text))
                {
                    tbxID.Focus();
                    return;
                }

                if (string.IsNullOrEmpty(tbxPwd.Password))
                {
                    tbxPwd.Focus();
                    return;
                }

                // Validating Log in params
                var tuple = await Login(tbxID.Text, tbxPwd.Password);
                LoginResultType nType = tuple.Item1;
                msg = tuple.Item2;
                //switch (Login(tbxID.Text, tbxPwd.Password).Item1)
                switch (nType)
                {
                    case LoginResultType.Success:
                        {
                        }
                        break;
                    case LoginResultType.WrongPwd:
                        {
                            tbxPwd.Password = string.Empty;
                            tbxPwd.Focus();
                        }
                        break;
                    case LoginResultType.WrongID:
                    case LoginResultType.NoAuthorization:
                        {
                            tbxID.Text = tbxPwd.Password = string.Empty;
                            tbxID.Focus();
                        }
                        break;
                    case LoginResultType.UnExpected:
                    default:
                        {
                            tbxPwd.Password = string.Empty;
                            tbxPwd.Focus();
                        }
                        break;
                }

                // Message 출력
                tbkMsg.Text = " -  " + msg;
            }
        }
        #endregion

        #region User Registered Dependency Property

        public string PasswordBoxText
        {
            get { return (string)GetValue(PasswordBoxTextProperty); }
            set { SetValue(PasswordBoxTextProperty, value); }
        }

        public static readonly DependencyProperty PasswordBoxTextProperty =
            DependencyProperty.Register("PasswordBoxText", typeof(string), typeof(LoginControl), new UIPropertyMetadata(string.Empty));

        #endregion
    }
}
