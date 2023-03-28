using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

//C:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework\v4.0\Profile\Client\System.Windows.Forms.dll

namespace myRis.Web.Scp.CommonUI.Misc
{
    class SetWindowStartup
    {
        /// <summary>
        /// 윈도우를 모니터의 Center 에 놓을 경우
        /// </summary>
        public static void AtCenter(Window win)
        {
            // Left와 Top을 위해 현재 윈도우 Actual Size가 필요한데, 이를 위해선 Window가 Load되어야 함.
            // 윈도우가 이미 Load 되어 있을 경우, 바로 Left Top 셋팅. 
            if (win.IsLoaded)
            {
                int monitor = 0;
                if (System.Windows.Forms.SystemInformation.MonitorCount > monitor)
                {
                    win.WindowStartupLocation = WindowStartupLocation.Manual;
                    win.WindowState = WindowState.Normal;

                    System.Drawing.Rectangle area = System.Windows.Forms.Screen.AllScreens[monitor].WorkingArea;

                    win.Left = area.Left + (area.Width - win.ActualWidth) / 2;
                    win.Top = area.Top + (area.Height - win.ActualHeight) / 2;
                }
            }
            // 아직 Load 전일 때는 Loaded 이벤트를 걸어 줌
            else
            {
                win.Loaded += (s, e) => AtCenter(win);
            }
        }

        /// <summary>
        /// 윈도우를 부모 윈도우의 Center 에 놓을 경우
        /// </summary>
        public static void AtCenterOnParent(Window win, Window parentWin)
        {
            if (win.IsLoaded)
            {
                win.WindowStartupLocation = WindowStartupLocation.Manual;
                win.Left = parentWin.Left + (parentWin.Width - win.ActualWidth) / 2;
                win.Top = parentWin.Top + (parentWin.Height - win.ActualHeight) / 2;
                // Window Status가 Maximized 됐을 때, Normal로 강제로 바꿔주기
                win.StateChanged += new System.EventHandler(win_StateChanged);
            }
            // 아직 Load 전일 때는 Loaded 이벤트를 걸어 줌
            else
            {
                win.Loaded += (s, e) => AtCenterOnParent(win, parentWin);
            }
        }

        /// <summary>
        /// 윈도우를 Maximize 할 경우
        /// </summary>
        public static void ToMaximize(Window win)
        {
            int monitor = 0;
            if (System.Windows.Forms.SystemInformation.MonitorCount > monitor)
            {
                System.Drawing.Rectangle area = System.Windows.Forms.Screen.AllScreens[monitor].WorkingArea;

                win.WindowStartupLocation = WindowStartupLocation.Manual;
                win.WindowState = WindowState.Normal;
                win.Left = area.Left;
                win.Top = area.Top;
                // WindowState 를 Maximized 해주는 대신 그냥 Width와 Height를 지정하도록 한다. 내부에 Sized Event 등의 발생에 영향이 있어서
                win.Width = area.Width;
                win.Height = area.Height;

                // Window Status가 Maximized 됐을 때, Normal로 강제로 바꿔주기
                win.StateChanged += new System.EventHandler(win_StateChanged);
            }
        }

        // Window Status가 Maximized 됐을 때, Normal로 강제로 바꿔주기
        static void win_StateChanged(object sender, System.EventArgs e)
        {
            Window win = sender as Window;
            if (win != null && win.WindowState == WindowState.Maximized)
            {
                // Status를 Normal로 강제로 바꿔주면서, 사이즈랑 위치랑 현재 모니터로 맞춰준다.
                System.Drawing.Rectangle currentArea = System.Windows.Forms.Screen.FromHandle(new System.Windows.Interop.WindowInteropHelper(win).Handle).WorkingArea;
                win.StateChanged -= win_StateChanged;
                win.WindowState = WindowState.Normal;
                win.StateChanged += win_StateChanged;
                win.Left = currentArea.Left;
                win.Top = currentArea.Top;
                win.Width = currentArea.Width;
                win.Height = currentArea.Height;
            }
        }
    }
}
