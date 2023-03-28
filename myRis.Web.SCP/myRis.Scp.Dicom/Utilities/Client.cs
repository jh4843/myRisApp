using Leadtools.Dicom;
using System.Threading;

namespace myRis.Web.Scp.Dicom.Utilities
{
    public class Client : DicomNet
    {
        DicomTimer _Timer;
        DicomServer server;
        Thread procThread = null;

        //
        public DicomTimer Timer
        {
            get
            {
                return _Timer;
            }
        }

        public Client(DicomServer server)
           : base(null, DicomNetSecurityeMode.None)
        {
            this.server = server;
            _Timer = new DicomTimer(this, 30);
        }

        //Use this constructor for TLS secure communication
        public Client(DicomServer server, bool reserved)
           : base(null, DicomNetSecurityeMode.Tls, reserved)
        {
            this.server = server;
            _Timer = new DicomTimer(this, 30);
        }

        protected override string OnPrivateKeyPassword(bool encryption)
        {
            return "test";
        }

        protected override void OnReceiveAssociateRequest(DicomAssociate association)
        {
            server.DoAssociateRequest(this, association);
        }

        protected override void OnReceiveReleaseRequest()
        {
            server.Clients.Remove(PeerAddress);
            SendReleaseResponse();
        }

        protected void StartAction(DicomAction action)
        {

            if (procThread != null && procThread.IsAlive)
            {
                procThread.Abort();
                procThread = null;
            }
            procThread = new Thread(new ThreadStart(action.DoAction));
            procThread.Start();
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// <summary>
        /// Handles C-ECHO Request
        /// </summary>
        protected override void OnReceiveCEchoRequest(byte presentationID, int messageID, string affectedClass)
        {
            //FV-3
            DicomAction action = server.InitAction("C-ECHO-REQUEST", ProcessType.EchoRequest, this, null);

            action.PresentationID = presentationID;
            action.MessageID = messageID;
            action.Class = affectedClass;   //1.2.840.10008.1.1 : verification SOP Class
            StartAction(action);
        }

        /// <summary>
        /// Handles C-FIND Request
        /// </summary>
        protected override void OnReceiveCFindRequest(byte presentationID, int messageID, string affectedClass, DicomCommandPriorityType priority, DicomDataSet dataSet)
        {
            //FC-3
            DicomAction action = server.InitAction("C-FIND-REQUEST", ProcessType.FindRequest, this, dataSet);

            action.PresentationID = presentationID;
            action.MessageID = messageID;
            action.Class = affectedClass;  //1.2.840.10008.5.1.4.31 : ModalityWorklistInformationFind SOP Class
            action.Priority = priority;
            StartAction(action);
        }
    }
}
