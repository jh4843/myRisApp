using Leadtools.Dicom;
using myRis.Web.Scp.DataProvider.Misc;
using System.Collections.Specialized;

namespace myRis.Web.Scp.Dicom.Common
{
    public class Scp : Base
    {
        string _CalledAE;
        string _CallingAE;
        private StringCollection _UidExclusionList = new StringCollection();

        public StringCollection UidExclusionList
        {
            get
            {
                return _UidExclusionList;
            }
        }

        public string CalledAE
        {
            get
            {
                return _CalledAE;
            }
            set
            {
                _CalledAE = value;
            }
        }

        public string CallingAE
        {
            get
            {
                return _CallingAE;
            }
            set
            {
                _CallingAE = value;
            }
        }

        public Scp()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public DicomExceptionCode Listen(int port, int peers)
        {
            Logger.Instance.WriteLogDebug("Scp", "Listen", @"[START]");

            DicomExceptionCode ret = DicomExceptionCode.Success;

            try
            {
                Listen("", port, peers);
            }
            catch (DicomException de)
            {
                ret = de.Code;
            }

            Logger.Instance.WriteLogDebug("Scp", "Listen", @"[END]");

            return ret;
        }
#if LEADTOOLS_V17_OR_LATER
      public DicomExceptionCode Listen(int port, int peers, DicomNetIpTypeFlags ipType)
      {
         DicomExceptionCode ret = DicomExceptionCode.Success;

         try
         {
            Listen("*", port, peers, ipType);
         }
         catch (DicomException de)
         {
            ret = de.Code;
         }

         return ret;
      }
#endif

        public override void Init()
        {
            Logger.Instance.WriteLogDebug("Scp", "Init", @"[START]");

            base.Init();

            Logger.Instance.WriteLogDebug("Scp", "Init", @"[END]");
        }

        public bool IsSupported(string uid)
        {
            Logger.Instance.WriteLogDebug("Scp", "IsSupported", @"[START]");

            if (UidExclusionList.IndexOf(uid) != -1)
            {
                string msg = string.Format(@"There is no uid : {0}", uid);
                Logger.Instance.WriteLogInfo("Scp", "IsSupported", msg);
                return false;
            }

            Logger.Instance.WriteLogDebug("Scp", "IsSupported", @"[END]");

            return (DicomUidTable.Instance.Find(uid) != null);
        }

        public virtual bool IsConnectionValid(string peerAddress, ref DicomAssociateRejectReasonType reject)
        {
            Logger.Instance.WriteLogDebug("Scp", "IsConnectionValid", @"[START]");
            Logger.Instance.WriteLogDebug("Scp", "IsConnectionValid", @"[END]");
            return true;
        }
    }
}