using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Dicom.Utilities
{
    /// <summary>
    /// Summary description for DicomTimer.
    /// </summary>
    public class DicomTimer
    {
        private Client _Client;

        public Client Client
        {
            get
            {
                return _Client;
            }
        }

        public DicomTimer(Client client, int time)
        {
            _Client = client;
            // Interval = (time * 1000);
        }
    }
}
