using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data.Environment
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// <summary>
    /// List의 column soring 및 visibility에 대한 설정
    /// </summary>
    [DataContract]
    public class ListColumnInformation
    {

        [DataMember]
        public int Index { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string BindingPath { get; set; }

        [DataMember]
        public string DisplayName { get; set; }

        [DataMember]
        public bool Visible { get; set; }

        [DataMember]
        public string SortDirection { get; set; }

        #region Constructors


        public ListColumnInformation()
        {

        }

        public ListColumnInformation(ListColumnInformation rhs)
        {
            Index = rhs.Index;
            Name = rhs.Name;
            DisplayName = rhs.DisplayName;
            BindingPath = rhs.BindingPath;
            Visible = rhs.Visible;
            SortDirection = rhs.SortDirection;
        }

        public ListColumnInformation ToListColumnInformation()
        {
            return new ListColumnInformation(this);
        }

        #endregion
    }
}
