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
    /// Interaction logic for FlatButton.xaml
    /// </summary>
    public partial class FlatButton : Button
    {
        public FlatButton()
        {
            InitializeComponent();
        }
        public enum FlatButtonType
        {
            Minimize = 1, Maximize, Close
        }

        /// <summary>
        /// Type에 따라서 Content 셋팅
        /// </summary>
        public FlatButtonType Type
        {
            get { return _type; }
            set
            {
                _type = value;
                switch (value)
                {
                    case FlatButtonType.Minimize:
                        SetImage("../Images/ic_top_btn_login_nor.png");
                        break;
                    case FlatButtonType.Maximize:
                        SetImage("../Images/ic_top_btn_hide_nor.png");
                        break;
                    case FlatButtonType.Close:
                        SetImage("../Images/ic_top_btn_close_nor.png");
                        break;
                }
            }
        }
        private FlatButtonType _type;

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

        private void SetStyle(string normal)
        {
            if (!string.IsNullOrEmpty(normal))
            {
                // this.Style.Setters.Add()

            }
        }
    }
}
