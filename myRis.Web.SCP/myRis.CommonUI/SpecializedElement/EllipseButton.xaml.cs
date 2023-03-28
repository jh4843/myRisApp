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
    /// Interaction logic for EllipseButton.xaml
    /// </summary>
    public partial class EllipseButton : Button
    {
        public EllipseButton()
        {
            InitializeComponent();
        }
        public enum EllipseButtonType
        {
            Config = 1, Logout, Minimize, Close
        }

        /// <summary>
        /// Type에 따라서 Content 셋팅
        /// </summary>
        public EllipseButtonType Type
        {
            get { return _type; }
            set
            {
                _type = value;
                switch (value)
                {
                    case EllipseButtonType.Config:
                        SetImage("../Images/ic_top_btn_setting_nor.png");
                        break;
                    case EllipseButtonType.Logout:
                        SetImage("../Images/ic_top_btn_login_nor.png");
                        break;
                    case EllipseButtonType.Minimize:
                        SetImage("../Images/ic_top_btn_hide_nor.png");
                        break;
                    case EllipseButtonType.Close:
                        SetImage("../Images/ic_top_btn_close_nor.png");
                        break;
                }
            }
        }
        private EllipseButtonType _type;

        private void SetImage(string normal)
        {
            if (!string.IsNullOrEmpty(normal))
            {
                this.Content = new Image()
                {
                    Source = new BitmapImage(
                        new Uri(normal, UriKind.Relative)
                        ),
                    Stretch = Stretch.None
                };
            }
        }
    }
}
