using Leadtools;
using Leadtools.Dicom;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.DataProvider.Misc;
using myRis.Web.Scp.Dicom.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Dicom
{
    // 이건 플로우 따라가면서 볼려고 하려던거.. 미완성
    //#FV(Verify/Echo) ; Flow of Verification(Echo)
    //#FC(CFIND) ; Flow of C-FIND

    /// <summary>
    /// Summary description for Server.
    /// </summary>
    public class DicomServer : myRis.Web.Scp.Dicom.Common.Scp
    {
        private int _Port;
        private int _Peers;
        private string _IPAddress;
        private int _Timeout = 1;
        private Dictionary<string, Client> _Clients = new Dictionary<string, Client>();
        private AutoResetEvent _ExitEvent = new AutoResetEvent(false);

        //
        public static readonly Lazy<DicomLanguage> _dcmLanguage = new Lazy<DicomLanguage>(() => new DicomLanguage());
        // SECURE
        //public bool _isSecure;
        //private string _certificationAuthoritiesFileName =  Application.StartupPath + @"\CA.pem";
        //private string _serverPEM = Application.StartupPath + @"\server.pem";


        #region Properties

        public DicomLanguage DcmLanguage
        {
            get
            {
                return _dcmLanguage.Value;
            }
        }

        public int Port
        {
            get
            {
                return _Port;
            }
            set
            {
                _Port = value;
                OnPropertyChanged(nameof(Port));
            }
        }

        public int Peers
        {
            get
            {
                return _Peers;
            }
            set
            {
                _Peers = value;
                OnPropertyChanged(nameof(Peers));
            }
        }

        public AutoResetEvent ExitEvent
        {
            get
            {
                return _ExitEvent;
            }
        }

        public string IPAddress
        {
            get
            {
                return _IPAddress;
            }
            set
            {
                _IPAddress = value;
                OnPropertyChanged(nameof(IPAddress));
            }
        }

        public int Timeout
        {
            get
            {
                return _Timeout;
            }
            set
            {
                _Timeout = value;
            }
        }

        public Dictionary<string, Client> Clients
        {
            get
            {
                return _Clients;
            }
        }

        #endregion

        #region INotifyPropertyChanged Members

        /// <summary>
        /// Raised when a property on this object has a new value.
        /// </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Raises this object's PropertyChanged event.
        /// </summary>
        /// <param name="propertyName">The property that has a new value.</param>
        protected virtual void OnPropertyChanged(string propertyName)
        {
            //UIHelper.OnPropertyChanged(this, propertyName, PropertyChanged);
        }

        #endregion // INotifyPropertyChanged Members

        public DicomServer()
        {
            Logger.Instance.WriteLogDebug("DicomServer", "DicomServer", @"[START]");

            BuildExclusionList();
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            #region Unlocking LEADTOOLS features
            if (true == RasterSupport.IsLocked(Leadtools.RasterSupportType.Medical))
            {
                RasterSupport.Unlock(Leadtools.RasterSupportType.Medical, @"ZhyFRnk3sY");
            }

            if (true == RasterSupport.IsLocked(Leadtools.RasterSupportType.MedicalNet))
            {
                RasterSupport.Unlock(Leadtools.RasterSupportType.MedicalNet, @"b4nBinY7tv");
            }

            if (true == RasterSupport.IsLocked(Leadtools.RasterSupportType.MedicalServer))
            {
                RasterSupport.Unlock(Leadtools.RasterSupportType.MedicalServer, @"QbXwuZxA3h");
            }
            #endregion

            Logger.Instance.WriteLogDebug("DicomServer", "DicomServer", @"[END]");
        }

        /*
         * Builds a UID exclusion list for the server.
         */
        private void BuildExclusionList()
        {
            Logger.Instance.WriteLogDebug("DicomServer", "BuildExclusionList", @"[START]");

            //This list has ALL of the UIDs and the ones the server SUPPORTS are commented out
            //UidExclusionList.Add(DicomUidType.VerificationClass);
            UidExclusionList.Add(DicomUidType.MediaStorageDirectory);
            UidExclusionList.Add(DicomUidType.BasicStudyNotificationClass);
            UidExclusionList.Add(DicomUidType.StorageCommitmentPushModelClass);
            UidExclusionList.Add(DicomUidType.StorageCommitmentPullModelClass);
            UidExclusionList.Add(DicomUidType.DetachedPatientClass);
            UidExclusionList.Add(DicomUidType.DetachedPatientMetaClass);
            UidExclusionList.Add(DicomUidType.DetachedVisitClass);
            UidExclusionList.Add(DicomUidType.DetachedStudyClass);
            UidExclusionList.Add(DicomUidType.StudyComponentClass);
            UidExclusionList.Add(DicomUidType.ModalityPerformedClass);
            UidExclusionList.Add(DicomUidType.ModalityPerformedRetrieveClass);
            UidExclusionList.Add(DicomUidType.ModalityPerformedNotificationClass);
            UidExclusionList.Add(DicomUidType.DetachedResultsClass);
            UidExclusionList.Add(DicomUidType.DetachedResultsMetaClass);
            UidExclusionList.Add(DicomUidType.DetachedStudyMetaClass);
            UidExclusionList.Add(DicomUidType.DetachedInterpretationClass);
            UidExclusionList.Add(DicomUidType.BasicFilmSessionClass);
            UidExclusionList.Add(DicomUidType.BasicFilmBoxClass);
            UidExclusionList.Add(DicomUidType.BasicGrayscaleImageBoxClass);
            UidExclusionList.Add(DicomUidType.BasicColorImageBoxClass);
            UidExclusionList.Add(DicomUidType.ReferencedImageBoxClassRetired);
            UidExclusionList.Add(DicomUidType.BasicGrayscalePrintMetaClass);
            UidExclusionList.Add(DicomUidType.ReferencedGrayscalePrintMetaClassRetired);
            UidExclusionList.Add(DicomUidType.PrintJobClass);
            UidExclusionList.Add(DicomUidType.BasicAnnotationBoxClass);
            UidExclusionList.Add(DicomUidType.PrinterClass);
            UidExclusionList.Add(DicomUidType.PrinterConfigurationRetrievalClass);
            UidExclusionList.Add(DicomUidType.BasicColorPrintMetaClass);
            UidExclusionList.Add(DicomUidType.ReferencedColorPrintMetaClassRetired);
            UidExclusionList.Add(DicomUidType.VoiLutBoxClassRetired);
            UidExclusionList.Add(DicomUidType.PresentationLutClass);
            UidExclusionList.Add(DicomUidType.ImageOverlayBoxClassRetired);
            UidExclusionList.Add(DicomUidType.BasicPrintImageOverlayBoxClass);
            UidExclusionList.Add(DicomUidType.PrintQueueClass);
            UidExclusionList.Add(DicomUidType.StoredPrintStorageClass);
            UidExclusionList.Add(DicomUidType.HardcopyGrayscaleImageStorageClass);
            UidExclusionList.Add(DicomUidType.HardcopyColorImageStorageClass);
            UidExclusionList.Add(DicomUidType.PullPrintRequestClass);
            UidExclusionList.Add(DicomUidType.PullStoredPrintMetaClass);
            UidExclusionList.Add(DicomUidType.CRImageStorage);
            UidExclusionList.Add(DicomUidType.DXImageStoragePresentation);
            UidExclusionList.Add(DicomUidType.DXImageStorageProcessing);
            UidExclusionList.Add(DicomUidType.DXMammographyImageStoragePresentation);
            UidExclusionList.Add(DicomUidType.DXMammographyImageStorageProcessing);
            UidExclusionList.Add(DicomUidType.DXIntraoralImageStoragePresentation);
            UidExclusionList.Add(DicomUidType.DXIntraoralImageStorageProcessing);
            UidExclusionList.Add(DicomUidType.CTImageStorage);
            UidExclusionList.Add(DicomUidType.USMultiframeImageStorageRetired);
            UidExclusionList.Add(DicomUidType.USMultiframeImageStorage);
            UidExclusionList.Add(DicomUidType.MRImageStorage);
            UidExclusionList.Add(DicomUidType.EnhancedMRImageStorage);
            UidExclusionList.Add(DicomUidType.MRSpectroscopyStorage);
            UidExclusionList.Add(DicomUidType.NMImageStorageRetired);
            UidExclusionList.Add(DicomUidType.USImageStorageRetired);
            UidExclusionList.Add(DicomUidType.USImageStorage);
            UidExclusionList.Add(DicomUidType.SCImageStorage);
            UidExclusionList.Add(DicomUidType.SCMultiFrameSingleBitImageStorage);
            UidExclusionList.Add(DicomUidType.SCMultiFrameGrayscaleByteImageStorage);
            UidExclusionList.Add(DicomUidType.SCMultiFrameGrayscaleWordImageStorage);
            UidExclusionList.Add(DicomUidType.SCMultiFrameTrueColorImageStorage);
            UidExclusionList.Add(DicomUidType.StandaloneOverlayStorage);
            UidExclusionList.Add(DicomUidType.StandaloneCurveStorage);
            UidExclusionList.Add(DicomUidType.TwleveLeadECGWaveformStorage);
            UidExclusionList.Add(DicomUidType.GeneralECGWaveformStorage);
            UidExclusionList.Add(DicomUidType.AmbulatoryECGWaveformStorage);
            UidExclusionList.Add(DicomUidType.HemodynamicWaveformStorage);
            UidExclusionList.Add(DicomUidType.CardiacElectrophysiologyWaveformStorage);
            UidExclusionList.Add(DicomUidType.BasicVoiceAudioWaveformStorage);
            UidExclusionList.Add(DicomUidType.StandaloneModalityLutStorage);
            UidExclusionList.Add(DicomUidType.StandaloneVoiLutStorage);
            UidExclusionList.Add(DicomUidType.GrayscaleSoftcopyPresentationStateStorage);
            UidExclusionList.Add(DicomUidType.XAImageStorage);
            UidExclusionList.Add(DicomUidType.XRayRadiofluoroscopicImageStorage);
            UidExclusionList.Add(DicomUidType.XABiplaneImageStorageRetired);
            UidExclusionList.Add(DicomUidType.NMImageStorage);
            UidExclusionList.Add(DicomUidType.RawDataStorage);
            UidExclusionList.Add(DicomUidType.VLImageStorageRetired);
            UidExclusionList.Add(DicomUidType.VLMultiframeImageStorageRetired);
            UidExclusionList.Add(DicomUidType.VLEndoscopicImageStorageClass);
            UidExclusionList.Add(DicomUidType.VideoEndoscopicImageStorage);
            UidExclusionList.Add(DicomUidType.VLMicroscopicImageStorageClass);
            UidExclusionList.Add(DicomUidType.VideoMicroscopicImageStorage);
            UidExclusionList.Add(DicomUidType.VLSlideCoordinatesMicroscopicImageStorageClass);
            UidExclusionList.Add(DicomUidType.VLPhotographicImageStorageClass);
            UidExclusionList.Add(DicomUidType.VideoPhotographicImageStorage);
            UidExclusionList.Add(DicomUidType.Ophthalmic8BitPhotographyImageStorage);
            UidExclusionList.Add(DicomUidType.Ophthalmic16BitPhotographyImageStorage);
            UidExclusionList.Add(DicomUidType.StereometricRelationshipStorage);
            UidExclusionList.Add(DicomUidType.BasicTextSR);
            UidExclusionList.Add(DicomUidType.EnhancedSR);
            UidExclusionList.Add(DicomUidType.ComprehensiveSR);
            UidExclusionList.Add(DicomUidType.MammographyCadSR);
            UidExclusionList.Add(DicomUidType.KeyObjectSelectionDocument);
            UidExclusionList.Add(DicomUidType.ChestCadSR);
            UidExclusionList.Add(DicomUidType.PETImageStorage);
            UidExclusionList.Add(DicomUidType.StandalonePETCurveStorage);
            UidExclusionList.Add(DicomUidType.RTImageStorage);
            UidExclusionList.Add(DicomUidType.RTDoseStorage);
            UidExclusionList.Add(DicomUidType.RTStructureStorage);
            UidExclusionList.Add(DicomUidType.RTBeamsTreatmentRecordStorageClass);
            UidExclusionList.Add(DicomUidType.RTPlanStorage);
            UidExclusionList.Add(DicomUidType.RTBrachyTreatmentRecordStorageClass);
            UidExclusionList.Add(DicomUidType.RTTreatmentSummaryRecordStorageClass);
            UidExclusionList.Add(DicomUidType.PatientRootQueryFind);
            UidExclusionList.Add(DicomUidType.PatientRootQueryMove);
            UidExclusionList.Add(DicomUidType.PatientRootQueryGet);
            UidExclusionList.Add(DicomUidType.StudyRootQueryFind);
            UidExclusionList.Add(DicomUidType.StudyRootQueryMove);
            UidExclusionList.Add(DicomUidType.StudyRootQueryGet);
            UidExclusionList.Add(DicomUidType.PatientStudyQueryFind);
            UidExclusionList.Add(DicomUidType.PatientStudyQueryMove);
            UidExclusionList.Add(DicomUidType.PatientStudyQueryGet);
            //UidExclusionList.Add(DicomUidType.ModalityWorklistFind);
            UidExclusionList.Add(DicomUidType.GeneralPurposeWorklistFind);
            UidExclusionList.Add(DicomUidType.GeneralPurposeScheduledProcedureStepSopClass);
            UidExclusionList.Add(DicomUidType.GeneralPurposePerformedProcedureStepSopClass);
            UidExclusionList.Add(DicomUidType.GeneralPurposeWorklistManagementMetaSopClass);

            Logger.Instance.WriteLogDebug("DicomServer", "BuildExclusionList", @"[END]");
        }

        /*
         * Establishes a connection to listen for incoming connection requests.
         */
        public DicomExceptionCode Listen()
        {
            Logger.Instance.WriteLogDebug("DicomServer", "Listen", @"[START]");

            DicomExceptionCode ret = DicomExceptionCode.Success;

            try
            {
                Listen(_IPAddress, _Port, _Peers);
                if (_IPAddress.Length == 0)
                {
                    _IPAddress = HostAddress;
                }
            }
            catch (DicomException de)
            {
                ret = de.Code;
            }

            Logger.Instance.WriteLogDebug("DicomServer", "Listen", @"[END]");

            return ret;
        }


        /*
         * Notifies a listening connection (SCP) that it can accept pending connection requests.
         */
        protected override void OnAccept(DicomExceptionCode error)
        {
            Logger.Instance.WriteLogDebug("DicomServer", "OnAccept", @"[START]");

            //#FC-1 & FV-1
            Client client = null;
            if (error == DicomExceptionCode.Success)
            {
                //client = new Client(this);

                #region TLS SECURE 
                //if (IsSecure)
                //{
                //    client = new Client(this, false);
                //    if (client != null)
                //    {
                //        //Require and verify a client certificate.
                //        //Support SSL version 3 or TLS Version 1 for the handshake.
                //        //Use trusted certificate authority file to verify the client certificate
                //        //Verify the client certificate chain to a maximum depth of 2.
                //        DicomOpenSslContextCreationSettings settings = new DicomOpenSslContextCreationSettings(DicomSslMethodType.TlsV1,
                //           _certificationAuthoritiesFileName,
                //           DicomOpenSslVerificationFlags.Peer |
                //           DicomOpenSslVerificationFlags.FailIfNoPeerCertificate,
                //           2,
                //           DicomOpenSslOptionsFlags.NoSslV2 |
                //           DicomOpenSslOptionsFlags.AllBugWorkarounds);
                //        client.Initialize(null, DicomNetSecurityeMode.Tls, settings);
                //        client.SetTlsCipherSuiteByIndex(0, DicomTlsCipherSuiteType.DheRsaWithDesCbcSha);
                //        client.SetTlsClientCertificate(_serverPEM, DicomTlsCertificateType.Pem, null);
                //    }
                //}
                //else
                //{
                //client = new Client(this);
                //}

                #endregion

                client = new Client(this);

                Accept(client);

                string msg = string.Empty;

                if (!Clients.ContainsKey(client.PeerAddress))
                {
                    Clients.Add(client.PeerAddress, client);
                }
                else
                {
                    msg = string.Format(@"Connection attempted by [{0}] was rejected because that IP is already connected", client.PeerAddress);
                    Logger.Instance.WriteLogInfo("DicomServer", "OnAccept", msg);

                    Clients.Remove(client.PeerAddress);
                    client.Close();
                    return;
                }

                #region Server Setting Verification
                //Max Concurrent Connection Check
                if (Clients.Count > _Peers)
                {
                    msg = string.Format(@"Connection attempted by {0} was rejected because the Maximum connections has already been reached", client.PeerAddress);
                    Logger.Instance.WriteLogInfo("DicomServer", "OnAccept", msg);

                    Clients.Remove(client.PeerAddress);
                    client.Close();
                    return;
                }
                //Registered User Only Check
                if (!VerifyUserIP(client.PeerAddress))
                {
                    msg = string.Format(@"Connection attempted by {0} was rejected because the client's IP address is not valid", client.PeerAddress);
                    Logger.Instance.WriteLogInfo("DicomServer", "OnAccept", msg);

                    Clients.Remove(client.PeerAddress);
                    client.Close();
                    return;
                }
                #endregion

                msg = string.Format(@"Last client connected: ClientAddress [{0}], ClientPort [{1}]", client.PeerAddress, client.PeerPort);
                Logger.Instance.WriteLogInfo("DicomServer", "OnAccept", msg);
            }

            Logger.Instance.WriteLogDebug("DicomServer", "OnAccept", @"[END]");
        }

        /*
         * Notifies a member of a connection that the connection was closed.
         */
        protected override void OnClose(DicomExceptionCode error, DicomNet net)
        {
            Logger.Instance.WriteLogDebug("DicomServer", "OnClose", @"[START]");

            //FV-Last
            if (Clients.ContainsKey(net.PeerAddress))
            {
                Client client = Clients[net.PeerAddress];

                Clients.Remove(net.PeerAddress);
            }

            Logger.Instance.WriteLogDebug("DicomServer", "OnClose", @"[END]");
        }

        /// <summary>
        /// Forcefully close a client connection.
        /// </summary>
        /// <param name="hClient">Client network handle.</param>
        public void CloseClient(Client client)
        {
            Logger.Instance.WriteLogDebug("DicomServer", "CloseClient", @"[START]");

            //
            // Remove client from list
            //
            Clients.Remove(client.PeerAddress);
            client.SendAbort(DicomAbortSourceType.Provider,
                            DicomAbortReasonType.Unknown);
            client.CloseForced(true);

            string msg = string.Empty;

            if (client.Association != null)
            {
                msg = string.Format(@"CLIENT NAME: {0} -- Timeout", client.Association.Calling);
                Logger.Instance.WriteLogInfo("DicomServer", "CloseClient", msg);
            }
            else
            {
                msg = string.Format(@"CLIENT NAME: {0} -- Timeout", client.PeerAddress);
                Logger.Instance.WriteLogInfo("DicomServer", "CloseClient", msg);
            }

            Logger.Instance.WriteLogDebug("DicomServer", "CloseClient", @"[END]");
        }

        /*
         * Initializes an incoming action.
         */
        public DicomAction InitAction(string actionOp, ProcessType process, Client client, DicomDataSet ds)
        {
            Logger.Instance.WriteLogDebug("DicomServer", "InitAction", @"[START]");

            DicomAction action = new DicomAction(process, this, client, ds);

            action.AETitle = client.Association.Calling;
            action.ipAddress = client.PeerAddress;
            action.ActionComplete += new DicomAction.ActionCompleteHandler(action_ActionComplete);

            Logger.Instance.WriteLogDebug("DicomServer", "InitAction", @"[END]");

            return action;
        }

        private void action_ActionComplete(object sender, EventArgs e)
        {
            Logger.Instance.WriteLogDebug("DicomServer", "action_ActionComplete", @"[START]");

            DicomAction action = (DicomAction)sender;

            Logger.Instance.WriteLogDebug("DicomServer", "action_ActionComplete", @"[END]");
        }

        /*
         * Performs an Association request
         */
        public async void DoAssociateRequest(Client client, DicomAssociate association)
        {
            string msg = string.Format(@"Client Name: {0} -- Receiving Associate Request.", association.Calling);
            Logger.Instance.WriteLogDebug("DicomServer", "DoAssociateRequest", @"[START]" + msg);

            //#FC-1 & FV-2
            // Check association
            if (association == null)
            {
                SendAssociateReject(DicomAssociateRejectResultType.Permanent, DicomAssociateRejectSourceType.Provider1, DicomAssociateRejectReasonType.Application);

                msg = string.Format(@"Client Name: {0} -- Failed in accepting the connection (Associate was null)!\r\nSending associate reject!", association.Calling);
                Logger.Instance.WriteLogInfo("DicomServer", "DoAssociateRequest", msg);

                return;
            }

            // Check version
            if (association.Version != 1)
            {
                SendAssociateReject(DicomAssociateRejectResultType.Permanent, DicomAssociateRejectSourceType.Provider1, DicomAssociateRejectReasonType.Version);

                msg = string.Format(@"Client Name: {0} -- Failed in accepting the connection (Version Not supported)!\r\nSending associate reject!", association.Calling);
                Logger.Instance.WriteLogInfo("DicomServer", "DoAssociateRequest", msg);

                return;
            }

            // Make sure that the client is supported
            bool bRet = await IsClientVerified(association.Calling);
            if (!bRet)
            {
                SendAssociateReject(DicomAssociateRejectResultType.Permanent, DicomAssociateRejectSourceType.User, DicomAssociateRejectReasonType.Calling);

                msg = string.Format(@"Client Name: {0} -- Failed in accepting the connection (Not a valid client name)!\r\nSending associate reject!", association.Calling);
                Logger.Instance.WriteLogInfo("DicomServer", "DoAssociateRequest", msg);

                return;
            }

            // Check the Called AE title (SCP)
            if (association.Called != CalledAE)
            {
                SendAssociateReject(DicomAssociateRejectResultType.Permanent, DicomAssociateRejectSourceType.User, DicomAssociateRejectReasonType.Called);

                msg = string.Format(@"Client Name: {0} -- Failed in accepting the connection (Server names are not the same)!\r\n Sending associate reject!", association.Calling);
                Logger.Instance.WriteLogInfo("DicomServer", "DoAssociateRequest", msg);

                return;
            }

            // Send association back
            using (DicomAssociate retAssociate = new DicomAssociate(false))
            {
                retAssociate.MaxLength = 46726;
                retAssociate.Version = 1;
                retAssociate.Called = CalledAE;
                retAssociate.Calling = (CallingAE == null) ? association.Calling : CallingAE;
                retAssociate.ApplicationContextName = (string)DicomUidType.ApplicationContextName;

                for (int i = 0; i < association.PresentationContextCount; i++)
                {
                    byte id = association.GetPresentationContextID(i);
                    string abstractSyntax = association.GetAbstract(id);

                    retAssociate.AddPresentationContext(id, DicomAssociateAcceptResultType.Success, abstractSyntax);
                    if (IsSupported(abstractSyntax))
                    {
                        for (int j = 0; j < association.GetTransferCount(id); j++)
                        {
                            string transferSyntax = association.GetTransfer(id, j);

                            if (IsSupported(transferSyntax))
                            {
                                retAssociate.AddTransfer(id, transferSyntax);
                                break;
                            }
                        }

                        if (retAssociate.GetTransferCount(id) == 0)
                        {
                            // Presentation id doesn't have any abstract syntaxes therefore we will reject it.
                            retAssociate.SetResult(id, DicomAssociateAcceptResultType.AbstractSyntax);
                        }
                    }
                    else
                    {
                        retAssociate.SetResult(id, DicomAssociateAcceptResultType.AbstractSyntax);
                    }
                }

                if (association.MaxLength != 0)
                {
                    retAssociate.MaxLength = association.MaxLength;
                }

                retAssociate.ImplementClass = ImplementationClass;
                retAssociate.ImplementationVersionName = ImplementationVersionName;

                client.SendAssociateAccept(retAssociate);

                msg = string.Format(@"Client Name: {0} -- Sending Associate Accept.", association.Calling);
                Logger.Instance.WriteLogInfo("DicomServer", "DoAssociateRequest", msg);
            }

            Logger.Instance.WriteLogDebug("DicomServer", "DoAssociateRequest", @"[END]");
        }

        /*
         * Makes sure that the user's name attempting to associate is valid
         */
        private async Task<bool> IsClientVerified(string callingName)
        {
            string param = string.Format(@"[param]callingName - {0}", callingName);
            Logger.Instance.WriteLogDebug("DicomServer", "IsClientVerified", @"[START]" + param);

            bool bRet = false;

            bool isClientVerificationActivated = GlobalConfiguration.IsClientVerificationActivated;

            //client access checkBox 가 체크 되어있을때
            if (isClientVerificationActivated)
            {
                List<ClientInfo> clientInfoList = new List<ClientInfo>();
                clientInfoList = GlobalConfiguration.ClientList;

                if (clientInfoList.Count > 0)
                {
                    for (int i = 0; i < clientInfoList.Count; i++)
                    {
                        // client 등록이 되어있으면
                        if (callingName.ToUpper() == clientInfoList[i].client_ae_title.ToUpper())
                        {
                            bRet = true;
                        }
                    }
                }
            }
            else
            {
                bRet = true;
            }

            Logger.Instance.WriteLogDebug("DicomServer", "IsClientVerified", @"[END]");

            return bRet;
        }

        /*
         * Makes sure that the user's IP attempting to connect is valid
         */
        private bool VerifyUserIP(string CallingIP)
        {
            string param = string.Format(@"[param]CallingIP - {0}", CallingIP);
            Logger.Instance.WriteLogDebug("DicomServer", "VerifyUserIP", @"[START]" + param);

            bool bRet = true;

            //             if (mf.lstClients.Items.Count > 0)
            //             {
            //                 bRet = false;
            //                 for (int i = 0; i < mf.lstClients.Items.Count; i++)
            //                 {
            //                     if (mf.lstClients.Items[i].SubItems[1].Text == CallingIP)
            //                         return true;
            //                 }
            //             }
            //             else
            //             {
            //                 bRet = true;
            //             }

            Logger.Instance.WriteLogDebug("DicomServer", "VerifyUserIP", @"[END]");

            return bRet;
        }
    }
}