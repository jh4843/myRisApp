using Leadtools.Dicom;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Net;
using System.Threading;

namespace myRis.Web.Scp.Dicom.Common
{
    /// <summary>
    /// Status type codes.
    /// </summary>
    public enum StatusType
    {
        /// <summary>
        /// Dicom error has occurred.
        /// </summary>
        Error,

        /// <summary>
        /// Process has been terminated.
        /// </summary>
        ProcessTerminated,

        /// <summary>
        /// Connection has been successfully received.
        /// </summary>
        ConnectReceived,

        /// <summary>
        /// Connection attempt failed.
        /// </summary>
        ConnectFailed,

        /// <summary>
        /// Connection attemp succeeded.
        /// </summary>
        ConnectSucceeded,

        /// <summary>
        /// Connection has been closed.
        /// </summary>
        ConnectionClosed,

        /// <summary>
        /// Associate request sent.
        /// </summary>
        SendAssociateRequest,

        /// <summary>
        /// Received associate accept.
        /// </summary>
        ReceiveAssociateAccept,

        /// <summary>
        /// Received associate reject.
        /// </summary>
        ReceiveAssociateReject,

        /// <summary>
        /// The abstract syntax is not supported on the association.
        /// </summary>
        AbstractSyntaxNotSupported,

        /// <summary>
        /// C-STORE-REQ sent.
        /// </summary>
        SendCStoreRequest,

        /// <summary>
        /// Received a C-STORE-RESP
        /// </summary>
        ReceiveCStoreResponse,

        /// <summary>
        /// Release request sent.
        /// </summary>
        SendReleaseRequest,

        /// <summary>
        /// Received release response.
        /// </summary>
        ReceiveReleaseResponse,

        SendCEchoRequest,

        ReceiveCEchoResponse,

        SendCFindRequest,

        ReceiveCFindResponse,

        SendCMoveRequest,

        ReceiveCMoveResponse,

        SendCStoreResponse,

        ReceiveCStoreRequest,

        /// <summary>
        /// Connection timeout.
        /// </summary>
        Timeout,

        ReceiveAssociateRequest,
        SenAssociateAccept,

        /// <summary>
        /// Secure Link Ready.
        /// </summary>
        SecureLinkReady,
    }

    /// <summary>
    /// 
    /// </summary>
    public class StatusEventArgs : EventArgs
    {
        internal StatusType _Type;
        internal DicomExceptionCode _Error = DicomExceptionCode.Success;
        internal string _CallingAE;
        internal string _CalledAE;
        internal IPAddress _PeerIP;
        internal int _PeerPort;
        internal int _NumberCompleted;
        internal int _NumberRemaining;
        internal DicomCommandStatusType _Status;
        internal DicomAssociateRejectResultType _Result;
        internal DicomAssociateRejectSourceType _Source;
        internal DicomAssociateRejectReasonType _Reason;
        internal byte _PresentationID;
        internal int _MessageID;
        internal string _AffectedClass;

        /// <summary>
        /// 
        /// </summary>
        public StatusEventArgs()
        {
            _Type = Type;
        }

        /// <summary>
        /// Status type
        /// </summary>
        public StatusType Type
        {
            get
            {
                return _Type;
            }
        }

        /// <summary>
        /// Status/Error code
        /// </summary>
        public DicomExceptionCode Error
        {
            get
            {
                return _Error;
            }
        }

        public string CallingAE
        {
            get
            {
                return _CallingAE;
            }
        }

        public string CalledAE
        {
            get
            {
                return _CalledAE;
            }
        }

        public IPAddress PeerIP
        {
            get
            {
                return _PeerIP;
            }
        }

        public int PeerPort
        {
            get
            {
                return _PeerPort;
            }
        }

        public int NumberCompleted
        {
            get
            {
                return _NumberCompleted;
            }
        }

        public int NumberRemaining
        {
            get
            {
                return _NumberRemaining;
            }
        }

        public DicomCommandStatusType Status
        {
            get
            {
                return _Status;
            }
        }

        public DicomAssociateRejectResultType Result
        {
            get
            {
                return _Result;
            }
        }

        public DicomAssociateRejectSourceType Source
        {
            get
            {
                return _Source;
            }
        }

        public DicomAssociateRejectReasonType Reason
        {
            get
            {
                return _Reason;
            }
        }

        public byte PresentationID
        {
            get
            {
                return _PresentationID;
            }
        }

        public int MessageID
        {
            get
            {
                return _MessageID;
            }
        }

        public string AffectedClass
        {
            get
            {
                return _AffectedClass;
            }
        }
    }

    public delegate void StatusEventHandler(object sender, StatusEventArgs e);

    /// <summary>
    /// Base class for dicom communications.  Defines all the processes that
    /// are common to SCP & SCU applications.
    /// </summary>
    public class Base : DicomNet
    {
        private AutoResetEvent _Event = new AutoResetEvent(false);

        private string _ImplementationClass = "";
        private string _privateKeyPassword = "";
        private bool _isSecureTLS = false;

        // SECURE TLS
        // C:\Program Files (x86)\LEAD Technologies\LEADTOOLS 17\Examples\DotNet\CS\DicomServerDemo

        public event StatusEventHandler Status;

        public Base()
           : base(null, DicomNetSecurityeMode.None)
        {
            Logger.Instance.WriteLogDebug("Base", "Base", @"[START]");


            Logger.Instance.WriteLogDebug("Base", "Base", @"[END]");
        }

        #region Secure TLS Communication
        public Base(string clientPEM, DicomTlsCipherSuiteType tlsCipherSuiteType, DicomTlsCertificateType tlsCertificateType, string privateKeyPassword)
           : base(null, DicomNetSecurityeMode.Tls)
        {
            PrivateKeyPassword = privateKeyPassword;
            SetTlsCipherSuiteByIndex(0, tlsCipherSuiteType);
            SetTlsClientCertificate(clientPEM, tlsCertificateType, null);
            _isSecureTLS = true;
        }

        public bool IsSecureTLS
        {
            get
            {
                return _isSecureTLS;
            }
        }

        public string PrivateKeyPassword
        {
            get
            {
                return _privateKeyPassword;
            }
            set
            {
                _privateKeyPassword = value;
            }
        }

        protected override string OnPrivateKeyPassword(bool encryption)
        {
            return PrivateKeyPassword;
        }
        #endregion

        protected virtual void OnStatus(StatusEventArgs e)
        {
            Logger.Instance.WriteLogDebug("Base", "OnStatus", @"[START]");

            //LastError = e.Error;
            if (Status != null)
            {
                // Invokes the delegates. 
                Status(this, e);
            }

            Logger.Instance.WriteLogDebug("Base", "OnStatus", @"[END]");
        }

        public void InvokeStatusEvent(StatusType sType, DicomExceptionCode error)
        {
            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(1)", @"[START]");

            StatusEventArgs se = new StatusEventArgs();

            se._Type = sType;
            se._Error = error;
            OnStatus(se);

            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(1)", @"[END]");
        }

        public void InvokeStatusEvent(StatusType sType, DicomExceptionCode error, string callingAE, string calledAE)
        {
            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(2)", @"[START]");

            StatusEventArgs se = new StatusEventArgs();

            se._Type = sType;
            se._Error = error;
            se._CallingAE = callingAE;
            se._CalledAE = calledAE;
            OnStatus(se);

            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(2)", @"[END]");
        }

        public void InvokeStatusEvent(StatusType sType, DicomExceptionCode error, int completed, int remaining, DicomCommandStatusType status)
        {
            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(3)", @"[START]");

            StatusEventArgs se = new StatusEventArgs();

            se._Type = sType;
            se._Error = error;
            se._NumberCompleted = completed;
            se._NumberRemaining = remaining;
            se._Status = status;
            OnStatus(se);

            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(3)", @"[END]");
        }

        public void InvokeStatusEvent(StatusType sType, DicomCommandStatusType status)
        {
            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(4)", @"[START]");

            StatusEventArgs se = new StatusEventArgs();

            se._Error = (status == DicomCommandStatusType.Success) ? DicomExceptionCode.Success : DicomExceptionCode.NetFailure;
            se._Status = status;
            se._Type = sType;

            OnStatus(se);

            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(4)", @"[END]");
        }

        public void InvokeStatusEvent(StatusType sType, DicomCommandStatusType status, byte presentationID, int messageID, string affectedClass)
        {
            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(5)", @"[START]");

            StatusEventArgs se = new StatusEventArgs();

            se._Error = (status == DicomCommandStatusType.Success) ? DicomExceptionCode.Success : DicomExceptionCode.NetFailure;
            se._Status = status;
            se._Type = sType;
            se._PresentationID = presentationID;
            se._MessageID = messageID;
            se._AffectedClass = affectedClass;

            OnStatus(se);

            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(5)", @"[END]");
        }

        public void InvokeStatusEvent(StatusEventArgs e)
        {
            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(6)", @"[START]");

            OnStatus(e);

            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(6)", @"[END]");
        }

        public void InvokeStatusEvent(StatusType sType, DicomAssociateRejectResultType result, DicomAssociateRejectSourceType source, DicomAssociateRejectReasonType reason)
        {
            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(7)", @"[START]");

            StatusEventArgs se = new StatusEventArgs();

            se._Result = result;
            se._Reason = reason;
            se._Source = source;
            se._Error = DicomExceptionCode.Success;
            se._Type = sType;
            OnStatus(se);

            Logger.Instance.WriteLogDebug("Base", "InvokeStatusEvent(7)", @"[END]");
        }

        /// <summary>
        /// Derived classes should override this method to perform any 
        /// per instance initialization.
        /// </summary>
        public virtual void Init()
        {
            Logger.Instance.WriteLogDebug("Base", "Init", @"[START]");

            Logger.Instance.WriteLogDebug("Base", "Init", @"[END]");
        }

        /// <summary>
        /// Implementation Class.
        /// </summary>
        public string ImplementationClass
        {
            get
            {
                return _ImplementationClass;
            }
            set
            {
                _ImplementationClass = value;
            }
        }

        private string _ImplementationVersionName = "";

        /// <summary>
        /// Implementation Version Name.
        /// </summary>
        public string ImplementationVersionName
        {
            get
            {
                return _ImplementationVersionName;
            }
            set
            {
                _ImplementationVersionName = value;
            }
        }

        /// <summary>
        /// Event used to control communication flow in the dicom
        /// communication thread.
        /// </summary>
        public AutoResetEvent Event
        {
            get
            {
                return _Event;
            }
        }

    }
}
