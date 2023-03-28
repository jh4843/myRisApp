using Leadtools.Dicom;
using myRis.Web.Scp.Data;
using myRis.Web.Scp.Data.QueryCondition;
using myRis.Web.Scp.DataProvider;
using myRis.Web.Scp.DataProvider.Misc;
using myRis.Web.Scp.Dicom.Common;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace myRis.Web.Scp.Dicom.Utilities
{
    public enum ProcessType
    {
        EchoRequest,
        StoreRequest,
        FindRequest,
        MoveRequest,
        NCreateRequest,
        NSetRequest
    }

    public enum QueryLevel
    {
        Patient,
        Study,
        Series,
        Image,
    }

    /// <summary>
    /// Summary description for DicomThread.
    /// </summary>
    public class DicomAction
    {
        public DicomServer server;
        private Client client;
        ProcessType process;
        private string _AETitle;
        private string _ipAddress;
        private byte _PresentationID;
        private int _MessageID;
        private string _Class;
        private string _Instance;
        private DicomCommandPriorityType _Priority;
        private string _MoveAETitle;
        private int _MoveMessageID;

        public string dsFileName;

        private DicomDataSet ds = new DicomDataSet();

        public delegate void ActionCompleteHandler(object sender, EventArgs e);

        public event ActionCompleteHandler ActionComplete;

        MwlQueryCondition mwlQueryCondition = new MwlQueryCondition();
        List<MwlItem> mwlItemList = new List<MwlItem>();

        #region Constructor & Properties
        public Client Client
        {
            get
            {
                return client;
            }
        }

        public DicomDataSet DS
        {
            get
            {
                return ds;
            }
        }

        public string AETitle
        {
            get
            {
                return _AETitle;
            }
            set
            {
                _AETitle = value;
            }
        }

        public string ipAddress
        {
            get
            {
                return _ipAddress;
            }
            set
            {
                _ipAddress = value;
            }
        }

        public byte PresentationID
        {
            get
            {
                return _PresentationID;
            }
            set
            {
                _PresentationID = value;
            }
        }

        public int MessageID
        {
            get
            {
                return _MessageID;
            }
            set
            {
                _MessageID = value;
            }
        }

        public string Class
        {
            get
            {
                return _Class;
            }
            set
            {
                _Class = value;
            }
        }

        public string Instance
        {
            get
            {
                return _Instance;
            }
            set
            {
                _Instance = value;
            }
        }

        public DicomCommandPriorityType Priority
        {
            get
            {
                return _Priority;
            }
            set
            {
                _Priority = value;
            }
        }

        public string MoveAETitle
        {
            get
            {
                return _MoveAETitle;
            }
            set
            {
                _MoveAETitle = value;
            }
        }

        public int MoveMessageID
        {
            get
            {
                return _MoveMessageID;
            }
            set
            {
                _MoveMessageID = value;
            }
        }

        public DicomAction(ProcessType process, DicomServer server, Client client)
        {
            this.server = server;
            this.client = client;
            this.process = process;


        }

        public DicomAction(ProcessType process, DicomServer server, Client client, DicomDataSet ds)
        {
            this.server = server;
            this.client = client;
            this.process = process;

            if (ds != null)
            {
                this.ds.Copy(ds, null, null);
            }
        }
        #endregion

        protected virtual void OnActionComplete()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "OnActionComplete", @"[START]");

            if (ActionComplete != null)
            {
                // Invokes the delegates. 
                ActionComplete(this, new EventArgs());
            }

            Logger.Instance.WriteLogDebug("DicomAction", "OnActionComplete", @"[END]");
        }

        public void DoAction()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "DoAction", @"[START]");

            if (client.Association != null)
            {
                switch (process)
                {
                    case ProcessType.EchoRequest:
                        DoEchoRequest();
                        break;
                    case ProcessType.FindRequest:
                        DoFindRequest();
                        break;
                }
            }
            OnActionComplete();

            Logger.Instance.WriteLogDebug("DicomAction", "DoAction", @"[END]");
        }

        private bool IsActionSupported()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "IsActionSupported", @"[START]");

            try
            {
                byte id;

                if (DicomUidTable.Instance.Find(Class) == null)
                {
                    Logger.Instance.WriteLogInfo("DicomAction", "IsActionSupported", @"[END]There is no class in DicomUidTable");
                    return false;
                }

                id = client.Association.FindAbstract(Class);
                if (id == 0 || client.Association.GetResult(id) != DicomAssociateAcceptResultType.Success)
                {
                    Logger.Instance.WriteLogInfo("DicomAction", "IsActionSupported", @"[END]There is no class in client.Association.FindAbstract");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", "IsActionSupported", ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "IsActionSupported", @"[END]");

            return true;
        }

        private string GetUIDName()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "GetUIDName", @"[START]");

            DicomUid uid = DicomUidTable.Instance.Find(Class);

            if (uid == null)
            {
                Logger.Instance.WriteLogInfo("DicomAction", "GetUIDName", @"[END]uid is null");
                return Class;
            }

            Logger.Instance.WriteLogDebug("DicomAction", "GetUIDName", @"[END]");

            return uid.Name;
        }

        /*
         * Handles a C-ECHO request
         */
        private void DoEchoRequest()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "DoEchoRequest", @"[START]");

            //FV-4
            try
            {
                string msg = string.Format(@"Client Name: {0} -- Receiving C-Echo Response...", client.Association.Calling);
                Logger.Instance.WriteLogInfo("DicomAction", "DoEchoRequest", msg);

                if (!IsActionSupported())
                {
                    string name = GetUIDName();

                    msg = string.Format(@"Client Name: {0} -- Sending C-Echo Response - Status: Abstract Syntax not supported!", client.Association.Calling);
                    Logger.Instance.WriteLogInfo("DicomAction", "DoEchoRequest", msg);

                    client.SendCEchoResponse(_PresentationID, _MessageID, Class,
                                            DicomCommandStatusType.ClassNotSupported);
                    return;
                }

                msg = string.Format(@"Client Name: {0} -- Sending C-Echo Response...", client.Association.Calling);
                Logger.Instance.WriteLogInfo("DicomAction", "DoEchoRequest", msg);

                client.SendCEchoResponse(_PresentationID, MessageID, Class,
                                            DicomCommandStatusType.Success);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", "DoEchoRequest", string.Format(@"Error handling CEcho request:\r\n\r\n") + ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "DoEchoRequest", @"[END]");
        }

        /*
         * Handles a C-FIND request
         */
        private async void DoFindRequest()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "DoFindRequest", @"[START]");

            //FC-4
            try
            {
                // We have received a C-Find Request
                string msg = string.Format(@"Client Name: {0} -- Receiving C-Find Request...", AETitle);
                Logger.Instance.WriteLogInfo("DicomAction", "DoFindRequest", msg);

                if (!IsActionSupported())
                {
                    string name = GetUIDName();

                    msg = string.Format(@"Client Name: {0} -- Sending C-Find Response - Status: Abstract Syntax not supported!", AETitle);
                    Logger.Instance.WriteLogInfo("DicomAction", "DoFindRequest", msg);

                    client.SendCFindResponse(_PresentationID, _MessageID, _Class,
                                             DicomCommandStatusType.ClassNotSupported, null);
                    return;
                }

                if (ds == null)
                {
                    msg = string.Format(@"Client Name: {0} -- Sending C-Find Response - Status: Invalid argument value!", AETitle);
                    Logger.Instance.WriteLogInfo("DicomAction", "DoFindRequest", msg);

                    client.SendCFindResponse(_PresentationID, _MessageID, _Class,
                                                      DicomCommandStatusType.InvalidArgumentValue, null);
                    return;
                }

                // Building Matching Query Condition
                GenerateMatchingQuery();

                // Fetching Data 
                mwlItemList = await WebDataProvider.Instance.GetMWLDataFromSCU(mwlQueryCondition);

                if (mwlItemList == null)
                {
                    mwlItemList = new List<MwlItem>();
                }

                RectifyingTimeDataForDisplay(mwlItemList);

                // Injecting Data into Dicom Tags
                //FindMatchingAttributes();

                ResponseDICOM();
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", @"DoFindRequest", string.Format(@"Error handling CFind request:\r\n\r\n") + ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "DoFindRequest", @"[END]");
        }

        //로컬 시간에 맞에 변경
        private void RectifyingTimeDataForDisplay(List<MwlItem> itemList)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "RectifyingTimeDataForDisplay", @"[START]");

            try
            {
                TimeSpan offset;
                if (false == string.IsNullOrEmpty(mwlQueryCondition.timezone_offset_from_utc))
                {
                    string value = mwlQueryCondition.timezone_offset_from_utc;
                    bool plus = value.Contains('+');

                    value = value.Replace("+", "");
                    value = value.Replace("-", "");
                    value = value.Trim();

                    string hours = string.Empty;
                    string minutes = string.Empty;

                    string[] split_value = value.Split(':');
                    if (split_value.Length > 0)
                    {
                        hours = split_value[0];
                    }

                    if (split_value.Length > 1)
                    {
                        minutes = split_value[1];
                    }

                    hours = string.Format("{0}{1}", plus ? "+" : "-", hours);

                    offset = new TimeSpan(string.IsNullOrEmpty(hours) ? 0 : Int32.Parse(hours),
                                          string.IsNullOrEmpty(minutes) ? 0 : Int32.Parse(minutes),
                                          0);
                }
                else
                {
                    offset = TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow);
                }

                itemList.ForEach(t => t.pt_birth_dttm = t.pt_birth_dttm.ToLocalTime().AddHours(offset.TotalHours));
                itemList.ForEach(t => t.sps_start_dttm = t.sps_start_dttm.ToLocalTime().AddHours(offset.TotalHours));
                itemList.ForEach(t => t.ord_study_dttm = t.ord_study_dttm.ToLocalTime().AddHours(offset.TotalHours));
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", "RectifyingTimeDataForDisplay", ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "RectifyingTimeDataForDisplay", @"[END]");
        }

        /// <summary>
        /// https://dicom.nema.org/medical/dicom/2014c/output/chtml/part04/sect_K.6.html
        /// SCP Supported Matching Query Criteria; Total of 9 criteria (Matching key:Return key)
        /// Patient Name(R:1) / Patient ID(R:1) / Modality(R:1) / Accessioin Number(O:2) / Scheduled Station AE Title(R:1)
        /// SPS Start Date(R:1) / SPS ID(O:1) / RP ID(O:1) / SPS_STATION_AE_TITLE(R:1)
        ///
        /// [SCU Inbound Query Example]
        /// Broad Worklist Query - SPS Start Date  / Modality  
        /// Patient Based Query  - Patient's Name / Patient's ID / Accession Number / RP ID / SPS AE Title
        /// </summary>
        private void GenerateMatchingQuery()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "GenerateMatchingQuery", @"[START]");

            string strAttributeValue = "";
            DicomElement element;

            #region *** CharSetTest ***
            ///////////////////////////////////////////////////////////////////
            ///FOR TESTING 
            // string testFile = @"D:\3.MY_FOLDER\SampleDCM\CharSetTest\language option\Arabic(Iraq)\1I00005.dcm"; //@"D:\3.MY_FOLDER\SampleDCM\CharSetTest\NONE.dcm";
            // string testFile = @"D:\3.MY_FOLDER\SampleDCM\CharSetTest\language option\ChineseGB18030\1I00003.dcm"; //GB
            //string testFile = @"D:\3.MY_FOLDER\SampleDCM\CharSetTest\language option\Cyrillic(Russian)\1I00001.dcm"; //Ckyril
            //string testFile = @"D:\3.MY_FOLDER\SampleDCM\CharSetTest\language option\Japanese\1I00001.dcm"; //jap

            //string testFile = @"D:\3.MY_FOLDER\SampleDCM\CharSetTest\language option\MYTEST\MWLOUT_TAE.dcm"; //MWL_OUT

            //string testFile = @"D:\3.MY_FOLDER\SampleDCM\CharSetTest\ISO_IR_6.dcm"; //

            //ds.Load(testFile, DicomDataSetLoadFlags.LoadAndClose);

            ///////////////////////////////////////////////////////////////////
            #endregion

            try
            {
#if DEBUG
                //TAE; Saving Dcm from SCU FOR TESTING PURPOSE
                //1.2.840.10008.5.1.4.31 SOP UID ; MWL-CFIND
                string fileName = string.Format("MWLIN_TAE.dcm");
                ds.Save(fileName, 0);
#endif
                int curNLS = server.DcmLanguage.GetCurrentDcmNLS(ds);

                // SCU 쿼리 타입에 맞춰서
                // https://gazelle.ihe.net/OrderManager/dicomSCU/findModalityWorklistSCU.seam
                bool isPtBasedQuery = IsPatientBasedQuery();

                // If Patient Based Query
                if (isPtBasedQuery)
                {
                    // Patient's Name  
                    // Patient's ID
                    // Accession Number
                    // Requested Procedure ID

                    // TAG_PATIENT_NAME (PN)
                    element = ds.FindFirstElement(null, DicomTag.PatientName, false);
                    if (element != null)
                    {
                        if (element.Length > 0)
                        {
                            byte[] arrByteName = ds.GetBinaryValue(element, (int)element.Length);
                            strAttributeValue = server.DcmLanguage.DecodeNLS(arrByteName, curNLS);
                            strAttributeValue = strAttributeValue.Replace("^", "");
                            strAttributeValue = strAttributeValue.TrimEnd();
                        }

                        if ((strAttributeValue != null) && (strAttributeValue != ""))
                        {
                            // Wild card matching -- case insensitive
                            mwlQueryCondition.pt_name = PrepareForWCM(strAttributeValue);
                        }
                    }

                    // TAG_PATIENT_ID (LO)
                    element = ds.FindFirstElement(null, DicomTag.PatientID, false);
                    if (element != null)
                    {
                        byte[] arrBytePtID = ds.GetBinaryValue(element, (int)element.Length);
                        strAttributeValue = server.DcmLanguage.DecodeNLS(arrBytePtID, curNLS);
                        strAttributeValue = strAttributeValue.TrimEnd();

                        if ((strAttributeValue != null) && (strAttributeValue != ""))
                        {
                            // Single value matching -- case sensitive
                            mwlQueryCondition.pt_id = FilterForSingleValueMatch(strAttributeValue);
                        }
                    }

                    // TAG_ACCESSION_NUMBER (SH)
                    element = ds.FindFirstElement(null, DicomTag.AccessionNumber, false);
                    if (element != null)
                    {
                        byte[] arrByteAccessionNum = ds.GetBinaryValue(element, (int)element.Length);
                        strAttributeValue = server.DcmLanguage.DecodeNLS(arrByteAccessionNum, curNLS);
                        strAttributeValue = strAttributeValue.TrimEnd();

                        if ((strAttributeValue != null) && (strAttributeValue != ""))
                        {
                            // Wild Card Matching or Single Value Matching
                            if ((strAttributeValue.IndexOf('*') >= 0) || (strAttributeValue.IndexOf('?') >= 0))
                            {
                                // Wild card matching -- case insensitive
                                mwlQueryCondition.ord_acc_num = PrepareForWCM(strAttributeValue);
                            }
                            else
                            {
                                // Single value matching -- case sensitive
                                mwlQueryCondition.ord_acc_num = strAttributeValue;
                            }
                        }
                    }

                    // TAG_REQUESTED_PROCEDURE_ID (SH)
                    element = ds.FindFirstElement(null, DicomTag.RequestedProcedureID, false);
                    if (element != null)
                    {
                        byte[] arrByteRpID = ds.GetBinaryValue(element, (int)element.Length);
                        strAttributeValue = server.DcmLanguage.DecodeNLS(arrByteRpID, curNLS);
                        strAttributeValue = strAttributeValue.TrimEnd();

                        if ((strAttributeValue != null) && (strAttributeValue != ""))
                        {
                            // Single value matching -- case sensitive
                            mwlQueryCondition.ord_rp_id = FilterForSingleValueMatch(strAttributeValue);
                            //strSqlQuery += " And TAG_REQUESTED_PROCEDURE_ID = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
                        }
                    }
                }
                else // If Worklist Broad Query
                {
                    // SPS Start Date
                    // Modality
                    // Scheduled Station AE Title

                    // TAG_SCHEDULED_PROCEDURE_STEP_START_DATE (DA)
                    #region SPS START DATE
                    element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepStartDate, false);
                    if (element != null)
                    {
                        bool isRangeData;
                        DateTime dateTimeRangeFrom, dateTimeRangeTo;
                        // if value is empty, length is 0
                        // if value is single, length is 1
                        // otherwise, goes to range 

                        isRangeData = IsRangeValue(element);

                        if (isRangeData)
                        {
                            DicomDateRangeValue rangeDateValue = ds.GetDateRangeValue(element, 0);

                            // Date time range from : default / invalide value = (0001-01-01)
                            if (DateTime.TryParse(ConvertDicomDateToQueryDate(rangeDateValue.Date1), out dateTimeRangeFrom))
                            {
                                if (DateTime.TryParse(ConvertDicomDateToQueryDate(rangeDateValue.Date2), out dateTimeRangeTo))
                                {
                                    mwlQueryCondition.sps_start_dttm_from = dateTimeRangeFrom.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                    mwlQueryCondition.sps_start_dttm_to = dateTimeRangeTo.AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                }
                                else
                                {
                                    dateTimeRangeTo = dateTimeRangeFrom = DateTime.MaxValue;
                                    mwlQueryCondition.sps_start_dttm_from = dateTimeRangeFrom.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                    mwlQueryCondition.sps_start_dttm_to = dateTimeRangeTo.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                }
                            }
                            else
                            {
                                dateTimeRangeTo = dateTimeRangeFrom = DateTime.MaxValue;
                                mwlQueryCondition.sps_start_dttm_from = dateTimeRangeFrom.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                mwlQueryCondition.sps_start_dttm_to = dateTimeRangeTo.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                            }
                        }
                        else
                        {
                            DicomDateValue[] dateValue = ds.GetDateValue(element, 0, 1);

                            // from start-date-to ~ today
                            if (dateValue.Length != 0)
                            {
                                if (DateTime.TryParse(ConvertDicomDateToQueryDate(dateValue[0]), out dateTimeRangeFrom))
                                {
                                    mwlQueryCondition.sps_start_dttm_from = dateTimeRangeFrom.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                    mwlQueryCondition.sps_start_dttm_to = dateTimeRangeFrom.AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");//mwlQueryCondition.sps_start_dttm_from;  //DateTime.Today.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ"); // To be Fixed (has to be same as the from date)
                                }
                                else
                                {
                                    dateTimeRangeTo = dateTimeRangeFrom = DateTime.MaxValue;
                                    mwlQueryCondition.sps_start_dttm_from = dateTimeRangeFrom.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                    mwlQueryCondition.sps_start_dttm_to = dateTimeRangeTo.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                }
                            }
                            else
                            {
                                dateTimeRangeTo = dateTimeRangeFrom = DateTime.MaxValue;
                                mwlQueryCondition.sps_start_dttm_from = dateTimeRangeFrom.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                                mwlQueryCondition.sps_start_dttm_to = dateTimeRangeTo.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
                            }
                        }
                    }
                    #endregion

                    // TAG_MODALITY (CS)
                    element = ds.FindFirstElement(null, DicomTag.Modality, false);
                    if (element != null)
                    {
                        strAttributeValue = ds.GetStringValue(element, 0);
                        if ((strAttributeValue != null) && (strAttributeValue != ""))
                        {
                            // Single value matching -- case sensitive
                            mwlQueryCondition.sps_modality = FilterForSingleValueMatch(strAttributeValue);
                        }
                    }

                    // TAG_SCHEDULED_STATION_AE_TITLE (AE)
                    element = ds.FindFirstElement(null, DicomTag.ScheduledStationAETitle, false);
                    if (element != null)
                    {
                        strAttributeValue = ds.GetStringValue(element, 0);
                        if ((strAttributeValue != null) && (strAttributeValue != ""))
                        {
                            // Single value matching -- case sensitive
                            mwlQueryCondition.sps_station_ae_title = FilterForSingleValueMatch(strAttributeValue);
                        }
                    }
                }

                // Timezone Offset From UTC
                element = ds.FindFirstElement(null, DicomTag.TimezoneOffsetFromUTC, false);
                if (element != null)
                {
                    byte[] arrByteAccessionNum = ds.GetBinaryValue(element, (int)element.Length);
                    strAttributeValue = server.DcmLanguage.DecodeNLS(arrByteAccessionNum, curNLS);
                    strAttributeValue = strAttributeValue.TrimEnd();

                    if (false == string.IsNullOrEmpty(strAttributeValue))
                    {
                        mwlQueryCondition.timezone_offset_from_utc = strAttributeValue;
                    }
                }

                // TAG_SCHEDULED_PROCEDURE_STEP_START_TIME
                //element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepStartTime, false);
                //if (element != null)
                //{
                //    DicomTimeValue[] timeValue = ds.GetTimeValue(element, 0, 1);

                //    if (timeValue.Length > 0)
                //    {
                //        mwlQueryCondition.rp_study_dttm_from += ConvertDicomTimeToQueryTime(timeValue[0]);
                //        //strSqlQuery += " And (julianday(substr(TAG_SCHEDULED_PROCEDURE_STEP_START_TIME,-8,8)) = julianday('" + ConvertDicomTimeToQueryTime(timeValue[0]) + "'))";
                //    }
                //}

                // TAG_SCHEDULED_PROCEDURE_STEP_ID
                //element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepID, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Single value matching -- case sensitive
                //        mwlQueryCondition.sps_id = FilterForSingleValueMatch(strAttributeValue);
                //    }
                //}

                ///////////////////////////////////////////////////////////////////////////////////////////
                #region Below is Currently, Not Used Tags
                //// TAG_STUDY_INSTANCE_UID
                ////mwlQueryCondition.rp_study_uid = GetUIDCondition((long)DicomTag.StudyInstanceUID, "TAG_STUDY_INSTANCE_UID"); // List of Matching UIDs
                ////strSqlQuery += GetUIDCondition((long)DicomTag.StudyInstanceUID, "TAG_STUDY_INSTANCE_UID"); // List of Matching UIDs [Legacy]

                //// TAG_INSTITUTION_NAME  
                //element = ds.FindFirstElement(null, DicomTag.InstitutionName, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Wild Card Matching or Single Value Matching
                //        if ((strAttributeValue.IndexOf('*') >= 0) || (strAttributeValue.IndexOf('?') >= 0))
                //        {
                //            // Wild card matching -- case insensitive
                //            //mwlQueryCondition.inst_name = PrepareForWCM(strAttributeValue);
                //        }
                //        else
                //        {
                //            // Single value matching -- case sensitive
                //            //mwlQueryCondition.inst_name = strAttributeValue;
                //        }
                //    }
                //}

                //// TAG_REFERRING_PHYSICIAN_NAME
                //element = ds.FindFirstElement(null, DicomTag.ReferringPhysicianName, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Wild card matching -- case insensitive
                //        //mwlQueryCondition.ord_referring_phyc = PrepareForWCM(strAttributeValue);
                //    }
                //}

                //// TAG_PATIENT_BIRTH_DATE
                //element = ds.FindFirstElement(null, DicomTag.PatientBirthDate, false);
                //if (element != null)
                //{
                //    DicomDateValue[] dateValue = ds.GetDateValue(element, 0, 1);

                //    if (dateValue.Length > 0)
                //    {
                //        //mwlQueryCondition.pt_birth_dttm = ConvertDicomDateToQueryDate(dateValue[0]);
                //        //strSqlQuery += " And (julianday(substr(TAG_PATIENT_BIRTH_DATE,1,10)) = julianday('" + ConvertDicomDateToQueryDate(dateValue[0]) + "'))";
                //    }
                //}

                //// TAG_PATIENT_SEX
                //element = ds.FindFirstElement(null, DicomTag.PatientSex, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Single value matching -- case sensitive
                //        //mwlQueryCondition.pt_sex = FilterForSingleValueMatch(strAttributeValue);
                //        //strSqlQuery += " And TAG_PATIENT_SEX = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
                //    }
                //}

                //// TAG_PATIENT_WEIGHT
                //element = ds.FindFirstElement(null, DicomTag.PatientWeight, false);
                //if (element != null)
                //{
                //    double[] dAttributeValue = ds.GetDoubleValue(element, 0, 1);

                //    //strAttributeValue = 
                //    if (dAttributeValue.Length > 0)
                //    {
                //        strAttributeValue = dAttributeValue[0].ToString();
                //        // Single value matching -- case sensitive
                //        //mwlQueryCondition.pt_weight = FilterForSingleValueMatch(strAttributeValue);
                //    }
                //}

                //// TAG_REQUESTING_PHYSICIAN
                //element = ds.FindFirstElement(null, DicomTag.RequestingPhysician, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Wild card matching -- case insensitive
                //        //mwlQueryCondition.ord_requesting_phyc = PrepareForWCM(strAttributeValue);
                //    }
                //}

                //// TAG_REQUESTED_PROCEDURE_DESCRIPTION
                //element = ds.FindFirstElement(null, DicomTag.RequestedProcedureDescription, false);
                //if ((strAttributeValue != null) && (strAttributeValue != ""))
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Wild card matching -- case insensitive
                //        //mwlQueryCondition.rp_desc = PrepareForWCM(strAttributeValue);
                //    }
                //}

                //// TAG_ADMISSION_ID
                //element = ds.FindFirstElement(null, DicomTag.AdmissionID, false);
                //if ((strAttributeValue != null) && (strAttributeValue != ""))
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Single value matching -- case sensitive
                //        //mwlQueryCondition.pt_admission_id = FilterForSingleValueMatch(strAttributeValue);
                //    }
                //}

                //// TAG_SCHEDULED_PERFORMING_PHYSICIAN_NAME
                //element = ds.FindFirstElement(null, DicomTag.ScheduledPerformingPhysicianName, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Wild card matching -- case insensitive
                //        //mwlQueryCondition.sps_perform_phyc_name = PrepareForWCM(strAttributeValue);
                //        //strSqlQuery += " And TAG_SCHEDULED_PERFORMING_PHYSICIAN_NAME LIKE '" + PrepareForWCM(strAttributeValue) + "'";
                //    }
                //}

                //// TAG_SCHEDULED_PROCEDURE_STEP_DESCRIPTION
                //element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepDescription, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Wild card matching -- case insensitive
                //        //mwlQueryCondition.sps_desc = PrepareForWCM(strAttributeValue);
                //        //strSqlQuery += " And TAG_SCHEDULED_PROCEDURE_STEP_DESCRIPTION LIKE '" + PrepareForWCM(strAttributeValue) + "'";
                //    }
                //}

                //// TAG_SCHEDULED_PROCEDURE_STEP_LOCATION
                //element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepLocation, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Wild card matching -- case insensitive
                //        //mwlQueryCondition.sps_location = PrepareForWCM(strAttributeValue);
                //        //strSqlQuery += " And TAG_SCHEDULED_PROCEDURE_STEP_LOCATION LIKE '" + PrepareForWCM(strAttributeValue) + "'";
                //    }
                //}

                //// TAG_REASON_FOR_THE_REQUESTED_PROCEDURE
                //element = ds.FindFirstElement(null, DicomTag.ReasonForTheRequestedProcedure, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Single value matching -- case sensitive
                //        //mwlQueryCondition.rp_reason = FilterForSingleValueMatch(strAttributeValue);
                //        //strSqlQuery += " And TAG_REASON_FOR_THE_REQUESTED_PROCEDURE = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
                //    }
                //}

                //// TAG_REQUESTED_PROCEDURE_PRIORITY
                //element = ds.FindFirstElement(null, DicomTag.RequestedProcedurePriority, false);
                //if (element != null)
                //{
                //    strAttributeValue = ds.GetStringValue(element, 0);
                //    if ((strAttributeValue != null) && (strAttributeValue != ""))
                //    {
                //        // Single value matching -- case sensitive
                //        //mwlQueryCondition.rp_priority = FilterForSingleValueMatch(strAttributeValue);
                //        //strSqlQuery += " And TAG_REQUESTED_PROCEDURE_PRIORITY = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
                //    }
                //}
                #endregion
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                Logger.Instance.WriteLogError("DicomAction", @"GenerateMatchingQuery", string.Format("Error generating SQL query:\r\n\r\n") + ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "GenerateMatchingQuery", @"[END]");
        }

        // [SCU Query Base Type Check] Check Patient Name and ID for now. 
        // Broad Workist Query : SPS Start Date, Modality, Scheduled Station AE Title
        // Patient Based Query : Pt Name, Pt ID, Accession Number, RP ID
        public bool IsPatientBasedQuery()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "IsPatientBasedQuery", @"[START]");

            bool result = true;
            string strAttributeValue = string.Empty;
            DicomElement element;

            // TAG_PATIENT_NAME
            element = ds.FindFirstElement(null, DicomTag.PatientName, false);  // TAG Check
            if (element != null)
            {
                strAttributeValue = ds.GetStringValue(element, 0);             // TAG Value Check
                if ((strAttributeValue == null) || (strAttributeValue == ""))
                {
                    result = false;
                }
            }

            // TAG_PATIENT_ID
            element = ds.FindFirstElement(null, DicomTag.PatientID, false);
            if (element != null)
            {
                strAttributeValue = ds.GetStringValue(element, 0);
                if ((strAttributeValue == null) || (strAttributeValue == ""))
                {
                    result = false;
                }
            }

            Logger.Instance.WriteLogDebug("DicomAction", "IsPatientBasedQuery", @"[END]" + result.ToString());

            return result;
        }

        // Date Value Type Check
        public bool IsRangeValue(DicomElement element)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "IsRangeValue", @"[START]");

            DicomDateRangeValue rangeDateValue = DicomDateRangeValue.Empty;

            string valueString = ds.GetValue<string>(element, string.Empty);
            bool isRangeVal = valueString.Contains('-');

            Logger.Instance.WriteLogDebug("DicomAction", "IsRangeValue", @"[END]" + isRangeVal.ToString());

            return isRangeVal;
        }

        /*
         * Generates an SQL query based on the client's search parameters
         */
        //private string GenerateMatchingQuery()
        //{
        //    string strSqlQuery = "";
        //    string strAttributeValue = "";
        //    DicomElement element;

        //    try
        //    {
        //        strSqlQuery = "SELECT * FROM MwlSCPTbl WHERE 1=1";

        //        // TAG_ACCESSION_NUMBER 
        //        element = ds.FindFirstElement(null, DicomTag.AccessionNumber, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild Card Matching or Single Value Matching
        //                if ((strAttributeValue.IndexOf('*') >= 0) || (strAttributeValue.IndexOf('?') >= 0))
        //                {
        //                    // Wild card matching -- case insensitive
        //                    strSqlQuery += " And TAG_ACCESSION_NUMBER LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //                }
        //                else
        //                {
        //                    // Single value matching -- case sensitive
        //                    strSqlQuery += " And TAG_ACCESSION_NUMBER = '" + strAttributeValue + "'";
        //                }
        //            }
        //        }

        //        // TAG_MODALITY
        //        element = ds.FindFirstElement(null, DicomTag.Modality, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_MODALITY = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_INSTITUTION_NAME
        //        element = ds.FindFirstElement(null, DicomTag.InstitutionName, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild Card Matching or Single Value Matching
        //                if ((strAttributeValue.IndexOf('*') >= 0) || (strAttributeValue.IndexOf('?') >= 0))
        //                {
        //                    // Wild card matching -- case insensitive
        //                    strSqlQuery += " And TAG_INSTITUTION_NAME LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //                }
        //                else
        //                {
        //                    // Single value matching -- case sensitive
        //                    strSqlQuery += " And TAG_INSTITUTION_NAME = '" + strAttributeValue + "'";
        //                }
        //            }
        //        }

        //        // TAG_REFERRING_PHYSICIAN_NAME
        //        element = ds.FindFirstElement(null, DicomTag.ReferringPhysicianName, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild card matching -- case insensitive
        //                strSqlQuery += " And TAG_REFERRING_PHYSICIAN_NAME LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_PATIENT_NAME
        //        element = ds.FindFirstElement(null, DicomTag.PatientName, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild card matching -- case insensitive
        //                strSqlQuery += " And TAG_PATIENT_NAME LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_PATIENT_ID
        //        element = ds.FindFirstElement(null, DicomTag.PatientID, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_PATIENT_ID = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_PATIENT_BIRTH_DATE
        //        element = ds.FindFirstElement(null, DicomTag.PatientBirthDate, false);
        //        if (element != null)
        //        {
        //            DicomDateValue[] dateValue = ds.GetDateValue(element, 0, 1);

        //            if (dateValue.Length > 0)
        //            {
        //                strSqlQuery += " And (julianday(substr(TAG_PATIENT_BIRTH_DATE,1,10)) = julianday('" + ConvertDicomDateToQueryDate(dateValue[0]) + "'))";
        //            }
        //        }

        //        // TAG_PATIENT_SEX
        //        element = ds.FindFirstElement(null, DicomTag.PatientSex, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_PATIENT_SEX = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_PATIENT_WEIGHT
        //        element = ds.FindFirstElement(null, DicomTag.PatientWeight, false);
        //        if (element != null)
        //        {
        //            double[] dAttributeValue = ds.GetDoubleValue(element, 0, 1);

        //            //strAttributeValue = 
        //            if (dAttributeValue.Length > 0)
        //            {
        //                strAttributeValue = dAttributeValue[0].ToString();
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_PATIENT_WEIGHT = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_STUDY_INSTANCE_UID
        //        strSqlQuery += GetUIDCondition((long)DicomTag.StudyInstanceUID, "TAG_STUDY_INSTANCE_UID"); // List of Matching UIDs

        //        // TAG_REQUESTING_PHYSICIAN
        //        element = ds.FindFirstElement(null, DicomTag.RequestingPhysician, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild card matching -- case insensitive
        //                strSqlQuery += " And TAG_REQUESTING_PHYSICIAN LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_REQUESTED_PROCEDURE_DESCRIPTION
        //        element = ds.FindFirstElement(null, DicomTag.RequestedProcedureDescription, false);
        //        if ((strAttributeValue != null) && (strAttributeValue != ""))
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild card matching -- case insensitive
        //                strSqlQuery += " And TAG_REQUESTED_PROCEDURE_DESCRIPTION LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_ADMISSION_ID
        //        element = ds.FindFirstElement(null, DicomTag.AdmissionID, false);
        //        if ((strAttributeValue != null) && (strAttributeValue != ""))
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_ADMISSION_ID = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_SCHEDULED_STATION_AE_TITLE
        //        element = ds.FindFirstElement(null, DicomTag.ScheduledStationAETitle, false);
        //        if ((strAttributeValue != null) && (strAttributeValue != ""))
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_SCHEDULED_STATION_AE_TITLE = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_SCHEDULED_PROCEDURE_STEP_START_DATE
        //        element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepStartDate, false);
        //        if (element != null)
        //        {
        //            DicomDateValue[] dateValue = ds.GetDateValue(element, 0, 1);

        //            if (dateValue.Length > 0)
        //            {
        //                strSqlQuery += " And (julianday(substr(TAG_SCHEDULED_PROCEDURE_STEP_START_DATE,1,10)) = julianday('" + ConvertDicomDateToQueryDate(dateValue[0]) + "'))";
        //            }
        //        }

        //        // TAG_SCHEDULED_PROCEDURE_STEP_START_TIME
        //        element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepStartTime, false);
        //        if (element != null)
        //        {
        //            DicomTimeValue[] timeValue = ds.GetTimeValue(element, 0, 1);

        //            if (timeValue.Length > 0)
        //            {
        //                strSqlQuery += " And (julianday(substr(TAG_SCHEDULED_PROCEDURE_STEP_START_TIME,-8,8)) = julianday('" + ConvertDicomTimeToQueryTime(timeValue[0]) + "'))";
        //            }
        //        }

        //        // TAG_SCHEDULED_PERFORMING_PHYSICIAN_NAME
        //        element = ds.FindFirstElement(null, DicomTag.ScheduledPerformingPhysicianName, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild card matching -- case insensitive
        //                strSqlQuery += " And TAG_SCHEDULED_PERFORMING_PHYSICIAN_NAME LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_SCHEDULED_PROCEDURE_STEP_DESCRIPTION
        //        element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepDescription, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild card matching -- case insensitive
        //                strSqlQuery += " And TAG_SCHEDULED_PROCEDURE_STEP_DESCRIPTION LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_SCHEDULED_PROCEDURE_STEP_ID
        //        element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepID, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_SCHEDULED_PROCEDURE_STEP_ID = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_SCHEDULED_PROCEDURE_STEP_LOCATION
        //        element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepLocation, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Wild card matching -- case insensitive
        //                strSqlQuery += " And TAG_SCHEDULED_PROCEDURE_STEP_LOCATION LIKE '" + PrepareForWCM(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_REQUESTED_PROCEDURE_ID
        //        element = ds.FindFirstElement(null, DicomTag.RequestedProcedureID, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_REQUESTED_PROCEDURE_ID = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_REASON_FOR_THE_REQUESTED_PROCEDURE
        //        element = ds.FindFirstElement(null, DicomTag.ReasonForTheRequestedProcedure, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_REASON_FOR_THE_REQUESTED_PROCEDURE = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }

        //        // TAG_REQUESTED_PROCEDURE_PRIORITY
        //        element = ds.FindFirstElement(null, DicomTag.RequestedProcedurePriority, false);
        //        if (element != null)
        //        {
        //            strAttributeValue = ds.GetStringValue(element, 0);
        //            if ((strAttributeValue != null) && (strAttributeValue != ""))
        //            {
        //                // Single value matching -- case sensitive
        //                strSqlQuery += " And TAG_REQUESTED_PROCEDURE_PRIORITY = '" + FilterForSingleValueMatch(strAttributeValue) + "'";
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        //server.mf.Log("Error generating SQL query:\r\n\r\n" + ex.ToString());
        //        return "";
        //    }

        //    return strSqlQuery;
        //}

        // https://dicom.nema.org/dicom/2013/output/chtml/part06/chapter_6.html
        // Finds, builds, and returns to SCU datasets that match the query.
        // Encoded VR used here : SH, LO, ST, LT, PN, UT
        // 
        private void FindMatchingAttributes()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "FindMatchingAttributes", @"[START]");

            DicomDataSet ResponseDicomDS = new DicomDataSet();
            PrepareResponseDS(ref ResponseDicomDS);

            byte[] encodedByteStr = new byte[] { };

            if (mwlItemList == null)
                return;

            //Loop over the retrieved data
            for (int i = 0; i < mwlItemList.Count; i++)
            {
                // Character Set
                string charset = server.DcmLanguage.InboundCharSet;
                if (string.IsNullOrEmpty(charset))
                {
                    charset = GlobalConfiguration.SpecificCharSet; //"ISO 2022 IR 6" (default)
                }
                int dsNLS = server.DcmLanguage.GetCurrentDcmNLS(charset);

                Utils.SetKeyElement(ResponseDicomDS, DicomTag.SpecificCharacterSet, charset, false);

                // Accession Number (SH)

                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItemList[i].ord_acc_num, dsNLS);
                Utils.SetKeyElementName(ResponseDicomDS, DicomTag.AccessionNumber, encodedByteStr, false);

                // Modality 
                Utils.SetKeyElement(ResponseDicomDS, DicomTag.Modality, mwlItemList[i].sps_modality, false);

                // Institution Name (LO)
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.InstitutionName, value, false);

                // Referring Physician Name (PN)

                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItemList[i].ord_referring_phyc, dsNLS);
                Utils.SetKeyElementName(ResponseDicomDS, DicomTag.ReferringPhysicianName, encodedByteStr, false);

                // Paitent Name (PN)

                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItemList[i].pt_name, dsNLS);

                Utils.SetKeyElementName(ResponseDicomDS, DicomTag.PatientName, encodedByteStr, false);

                // Patient ID (LO)

                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItemList[i].pt_id, dsNLS);
                Utils.SetKeyElementName(ResponseDicomDS, DicomTag.PatientID, encodedByteStr, false);

                // Patient Birth DateTime
                // dates must be handled specially
                if (mwlItemList[i].pt_birth_dttm != null)
                {
                    SetTimeDateKeyElement(ref ResponseDicomDS, mwlItemList[i].pt_birth_dttm, DicomTag.PatientBirthDate, false);
                }
                else
                {
                    Utils.SetKeyElement(ResponseDicomDS, DicomTag.PatientBirthDate, mwlItemList[i].pt_birth_dttm, false);
                }

                // Patient Sex
                Utils.SetKeyElement(ResponseDicomDS, DicomTag.PatientSex, mwlItemList[i].pt_sex, false);

                // Study Instance UID 
                Utils.SetKeyElement(ResponseDicomDS, DicomTag.StudyInstanceUID, mwlItemList[i].ord_study_uid, false);

                // Requesting Physician (PN)

                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItemList[i].ord_requesting_phyc, dsNLS);
                Utils.SetKeyElementName(ResponseDicomDS, DicomTag.RequestingPhysician, encodedByteStr, false);

                // Scheduled Procedure Step Start Date
                // dates must be handled specially
                if (mwlItemList[i].sps_start_dttm != null)
                {
                    SetTimeDateKeyElement(ref ResponseDicomDS, mwlItemList[i].sps_start_dttm, DicomTag.ScheduledProcedureStepStartDate, false);
                }
                else
                {
                    Utils.SetKeyElement(ResponseDicomDS, DicomTag.ScheduledProcedureStepStartDate, mwlItemList[i].sps_start_dttm, false);
                }

                // Scheduled Procedure Step Start Time
                // dates must be handled specially
                if (mwlItemList[i].sps_start_dttm != null)
                {
                    SetTimeDateKeyElement(ref ResponseDicomDS, mwlItemList[i].sps_start_dttm, DicomTag.ScheduledProcedureStepStartTime, true);
                }
                else
                {
                    Utils.SetKeyElement(ResponseDicomDS, DicomTag.ScheduledProcedureStepStartTime, mwlItemList[i].sps_start_dttm, false);
                }

                // Scheduled Procedure Step Performing Physician (PN)

                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItemList[i].sps_perform_phyc_name, dsNLS);
                Utils.SetKeyElementName(ResponseDicomDS, DicomTag.ScheduledPerformingPhysicianName, encodedByteStr, false);

                // Scheduled Procedure Step ID
                Utils.SetKeyElement(ResponseDicomDS, DicomTag.ScheduledProcedureStepID, mwlItemList[i].sps_id, false);

                // Requsted Procedure ID
                Utils.SetKeyElement(ResponseDicomDS, DicomTag.RequestedProcedureID, mwlItemList[i].ord_rp_id, false);


                // [Requested Procedure] DB에 아직 미구현 
                // Requested Procedure Description
                Utils.SetKeyElement(ResponseDicomDS, DicomTag.RequestedProcedureDescription, "requested procedure desc", false);
                // Requested procedure code sequence
                Utils.SetCodeSeqKeyElements(ResponseDicomDS, "code", "meaning", "designator", "version", DicomTag.RequestedProcedureCodeSequence);

                if (DataProvider.LicenseProvider.LicenseTypes.Veterinary == DataProvider.LicenseProvider.Instance.GetCurLicenseType())
                {
                    // [Species Sequence]
                    // Species Sequence Description (LO) 
                    Utils.SetKeyElement(ResponseDicomDS, DicomTag.PatientSpeciesDescription, string.Empty, false);

                    // Code Value , Code Meaning, Code Designator, Code Version
                    Utils.SetCodeSeqKeyElements(ResponseDicomDS, /*[value]*/mwlItemList[i].species_code_value, /*[meaning]*/mwlItemList[i].species_code_meaning, /*[designator]*/mwlItemList[i].species_scm_design, /*[version]*/string.Empty, DicomTag.PatientSpeciesCodeSequence);

                    // [Breed Sequence]
                    // Breed Sequence Description (LO)
                    Utils.SetKeyElement(ResponseDicomDS, DicomTag.PatientBreedDescription, string.Empty, true);

                    // Code Value , Code Meaning, Code Designator, Code Version
                    Utils.SetCodeSeqKeyElements(ResponseDicomDS, /*[value]*/mwlItemList[i].breed_code_value, /*[meaning]*/mwlItemList[i].breed_code_meaning, /*[designator]*/mwlItemList[i].breed_scm_design, /*[version]*/string.Empty, DicomTag.PatientBreedCodeSequence);

                    // [Responsible Persion]
                    encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItemList[i].pt_responsible_person, dsNLS);
                    Utils.SetKeyElementName(ResponseDicomDS, DicomTag.ResponsiblePerson, encodedByteStr, false);
                }

                // Send the response Dataset
                //server.mf.Log("Client Name:" + AETitle + " -- Sending C-Find Response - Status: Pending\r\n");
#if DEBUG
                ResponseDicomDS.Save("MWLOUT_TAE.dcm", 0);
#endif

                #region Not Supporting Now
                // Patient Weight
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.PatientWeight, value, false);

                // Requested Procedure Description
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.RequestedProcedureDescription, value, false);

                // Admission ID
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.AdmissionID, value, false);

                // Scheduled Procedure Step AE Title   
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.ScheduledStationAETitle, mwlItemList[i].sps, false);

                // Scheduled Procedure Step Description
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.ScheduledProcedureStepDescription, mwlItemList[i]., false);

                // Scheduled Procedure Step Location
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.ScheduledProcedureStepLocation, mwlItemList[i]., false);

                // Reason For Requested Procedure
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.ReasonForTheRequestedProcedure, mwlItemList[i].re, false);

                // Requested Procedure Priority
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.RequestedProcedurePriority, mwlItemList[i]., false);
                #endregion

                client.SendCFindResponse(_PresentationID, _MessageID, _Class, DicomCommandStatusType.Pending, ResponseDicomDS);
            }

            // The final C - FIND - RSP
            // server.mf.Log("Client Name:" + AETitle + " -- Sending C-Find Response - Status: Success\r\n");
            client.SendCFindResponse(_PresentationID, _MessageID, _Class, DicomCommandStatusType.Success, null);

            Logger.Instance.WriteLogDebug("DicomAction", "FindMatchingAttributes", @"[END]");
        }

        /// <summary>
        /// Response로 만들 DICOM DataSet을 SCU DS에서 지원하는 Tag에 맞춰서 만들어 줌
        /// </summary>
        /// <param name="ResponseDicomDS"></param>
        private void PrepareResponseDS(ref DicomDataSet ResponseDicomDS)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "PrepareResponseDS", @"[START]");

            try
            {
                ResponseDicomDS.Initialize(DicomClassType.Undefined, DicomDataSetInitializeType.ImplicitVRLittleEndian);

                DicomElement element;

                #region SCHEDULED PROCEDUR STEP
                // Scheduled Procedure Step
                element = ds.FindFirstElement(null, DicomTag.ScheduledProcedureStepSequence, false);
                if (element != null)
                {
                    DicomElement sequence = null;
                    DicomElement item = null;
                    sequence = ResponseDicomDS.InsertElement(null, false, DicomTag.ScheduledProcedureStepSequence, DicomVRType.SQ, true, 0);
                    if (sequence != null)
                    {
                        item = ResponseDicomDS.InsertElement(sequence, true, DicomTag.Item, DicomVRType.SQ, false, 0);
                    }

                    if (item != null)
                    {
                        element = ds.GetChildElement(element, true); //child of sequence ; Item
                        if (element != null)
                        {
                            element = ds.GetChildElement(element, true); //children of Item
                            while (element != null)
                            {
                                switch (element.Tag)
                                {
                                    case DicomTag.ScheduledStationAETitle:
                                    case DicomTag.ScheduledProcedureStepStartDate:
                                    case DicomTag.ScheduledProcedureStepStartTime:
                                    case DicomTag.Modality:
                                    case DicomTag.ScheduledPerformingPhysicianName:
                                    case DicomTag.ScheduledProcedureStepDescription:
                                    //case DicomTag.ScheduledProcedureStepLocation:
                                    case DicomTag.ScheduledProcedureStepID:
                                        ResponseDicomDS.InsertElement(item, true, element.Tag, DicomVRType.UN, false, 0);
                                        break;
                                }

                                element = ds.GetNextElement(element, true, true);
                            }
                        }
                        else
                        {
                            ResponseDicomDS.InsertElement(item, true, DicomTag.ScheduledStationAETitle, DicomVRType.UN, false, 0);
                            ResponseDicomDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepStartDate, DicomVRType.UN, false, 0);
                            ResponseDicomDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepStartTime, DicomVRType.UN, false, 0);
                            ResponseDicomDS.InsertElement(item, true, DicomTag.Modality, DicomVRType.UN, false, 0);
                            ResponseDicomDS.InsertElement(item, true, DicomTag.ScheduledPerformingPhysicianName, DicomVRType.UN, false, 0);
                            ResponseDicomDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepDescription, DicomVRType.UN, false, 0);
                            //ResponseDicomDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepLocation, DicomVRType.UN, false, 0);
                            ResponseDicomDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepID, DicomVRType.UN, false, 0);
                        }
                    }
                }
                #endregion

                // Requested Procedure
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.RequestedProcedureID);
                //Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.RequestedProcedureDescription);
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.StudyInstanceUID);
                //Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.RequestedProcedurePriority);
                //Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.ReasonForTheRequestedProcedure);

                // Imaging Service Request
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.AccessionNumber);
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.RequestingPhysician);
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.ReferringPhysicianName);

                // Visit Identification
                //Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.AdmissionID);
                //Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.InstitutionName);

                // Patient Identification
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.PatientName);
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.PatientID);

                // Patient Demographic
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.PatientBirthDate);
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.PatientSex);
                //Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.PatientWeight);

#if DEBUG
                #region REQUESTED PROCEDURE 
                //Requested Procedure Description
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.RequestedProcedureDescription);

                //Requested Procdure Code Sequence
                element = ds.FindFirstElement(null, DicomTag.RequestedProcedureCodeSequence, false);
                if (element != null)
                {
                    if (element != null)
                    {
                        DicomElement sequence = null;
                        DicomElement item = null;
                        sequence = ResponseDicomDS.InsertElement(null, false, DicomTag.RequestedProcedureCodeSequence, DicomVRType.SQ, true, 0);

                        if (sequence != null)
                        {
                            item = ResponseDicomDS.InsertElement(sequence, true, DicomTag.Item, DicomVRType.SQ, false, 0);
                        }

                        if (item != null)
                        {
                            element = ds.GetChildElement(element, true); //child of sequence ; Item
                            if (element != null)
                            {
                                element = ds.GetChildElement(element, true); //children of Item
                                while (element != null)
                                {
                                    switch (element.Tag)
                                    {
                                        case DicomTag.CodeValue:
                                        case DicomTag.CodingSchemeDesignator:
                                        case DicomTag.CodingSchemeVersion:
                                        case DicomTag.CodeMeaning:
                                            ResponseDicomDS.InsertElement(item, true, element.Tag, DicomVRType.UN, false, 0);
                                            break;
                                    }

                                    element = ds.GetNextElement(element, true, true);
                                }
                            }
                            else
                            {
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodeValue, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeDesignator, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeVersion, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodeMeaning, DicomVRType.UN, false, 0);
                            }
                        }
                    }
                }
                #endregion
#endif

                if (DataProvider.LicenseProvider.LicenseTypes.Veterinary == DataProvider.LicenseProvider.Instance.GetCurLicenseType())
                {
                    Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.ResponsiblePerson);

                    #region PATINET SPECIES
                    // Species Description
                    Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.PatientSpeciesDescription);
                    // Patient Species Code SQ  
                    DicomElement element1;   //Jdicom 에 있는 DS에는 Species Code 가 없음. 
                    element1 = ds.FindFirstElement(null, DicomTag.PatientSpeciesCodeSequence, false);

                    if (element1 != null)
                    {
                        DicomElement sequence = null;
                        DicomElement item = null;
                        sequence = ResponseDicomDS.InsertElement(null, false, DicomTag.PatientSpeciesCodeSequence, DicomVRType.SQ, true, 0);

                        if (sequence != null)
                        {
                            item = ResponseDicomDS.InsertElement(sequence, true, DicomTag.Item, DicomVRType.SQ, false, 0);
                        }

                        if (item != null)
                        {
                            element1 = ds.GetChildElement(element1, true); //child of sequence ; Item
                            if (element1 != null)
                            {
                                element1 = ds.GetChildElement(element1, true); //children of Item
                                while (element1 != null)
                                {
                                    switch (element1.Tag)
                                    {
                                        case DicomTag.CodeValue:
                                        case DicomTag.CodingSchemeDesignator:
                                        case DicomTag.CodingSchemeVersion:
                                        case DicomTag.CodeMeaning:
                                            //case DicomTag.CodingSchemeUID: //UID? 맞는 건가 이게? 음..아닌듯.
                                            ResponseDicomDS.InsertElement(item, true, element1.Tag, DicomVRType.UN, false, 0);
                                            break;
                                    }

                                    element1 = ds.GetNextElement(element1, true, true);
                                }
                            }
                            else
                            {
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodeValue, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeDesignator, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeVersion, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodeMeaning, DicomVRType.UN, false, 0);
                                //ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeUID, DicomVRType.UN, false, 0); //UID? 맞는 건가 이게? 음..
                            }
                        }
                    }
                    #endregion

                    #region PATINET BREED 
                    // Breed Description  
                    Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.PatientBreedDescription);

                    // Patient Breed Code SQ  
                    DicomElement element2;   //Jdicom 에 있는 DS에는 Breed Code 가 없음. 
                    element2 = ds.FindFirstElement(null, DicomTag.PatientBreedCodeSequence, false);

                    if (element2 != null)
                    {
                        DicomElement sequence = null;
                        DicomElement item = null;
                        sequence = ResponseDicomDS.InsertElement(null, false, DicomTag.PatientBreedCodeSequence, DicomVRType.SQ, true, 0);

                        if (sequence != null)
                        {
                            item = ResponseDicomDS.InsertElement(sequence, true, DicomTag.Item, DicomVRType.SQ, false, 0);
                        }

                        if (item != null)
                        {
                            element2 = ds.GetChildElement(element2, true); //child of sequence ; Item
                            if (element2 != null)
                            {
                                element2 = ds.GetChildElement(element2, true); //children of Item
                                while (element2 != null)
                                {
                                    switch (element2.Tag)
                                    {
                                        case DicomTag.CodeValue:
                                        case DicomTag.CodingSchemeDesignator:
                                        case DicomTag.CodingSchemeVersion:
                                        case DicomTag.CodeMeaning:
                                            //case DicomTag.CodingSchemeUID: //UID? 맞는 건가 이게? 음..아닌듯.
                                            ResponseDicomDS.InsertElement(item, true, element2.Tag, DicomVRType.UN, false, 0);
                                            break;
                                    }

                                    element2 = ds.GetNextElement(element2, true, true);
                                }
                            }
                            else
                            {
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodeValue, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeDesignator, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeVersion, DicomVRType.UN, false, 0);
                                ResponseDicomDS.InsertElement(item, true, DicomTag.CodeMeaning, DicomVRType.UN, false, 0);
                                //ResponseDicomDS.InsertElement(item, true, DicomTag.CodingSchemeUID, DicomVRType.UN, false, 0); //UID? 맞는 건가 이게? 음..
                            }
                        }
                    }
                    #endregion
                }

                // character Set
                Utils.InsertKeyElement(ResponseDicomDS, ds, DicomTag.SpecificCharacterSet);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", @"PrepareResponseDS", ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "PrepareResponseDS", @"[END]");
        }

        /*
         * Sets a DicomElement that is either a DicomDateValue or DicomTimeValue
         */


#if (LTV15_CONFIG)
      private void SetTimeDateKeyElement(ref DicomDataSet ResponseDS, DateTime dt, DicomTagType tag, bool bTimeValue)
      {
         SetTimeDateKeyElement(ref ResponseDS, dt, (long)tag, bTimeValue);
      }

#endif

        #region Helper Functions
        /*
         * Replaces every '*' with '%' and every '?' with '_' for the SQL Wildcard matching
         */
        private string PrepareForWCM(string strValue)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "PrepareForWCM", @"[START]");

            try
            {
                //strValue = strValue.Replace('*', '%');
                //strValue = strValue.Replace('?', '_');
                //strValue = strValue.Replace(' ', '^');
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", @"PrepareForWCM", string.Format("Error preparing string for Wild Card matching:\r\n\r\n") + ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "PrepareForWCM", @"[END]" + strValue.ToString());

            return strValue;
        }

        /*
         * Ensures that the string will return only a perfect match.
         */
        private string FilterForSingleValueMatch(string strValue)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "FilterForSingleValueMatch", @"[START]");

            try
            {
                strValue = strValue.Replace("*", "");
                strValue = strValue.Replace("?", "");
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", @"FilterForSingleValueMatch", string.Format("Error filtering string for single value matching:\r\n\r\n") + ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "FilterForSingleValueMatch", @"[END]" + strValue.ToString());

            return strValue;
        }

        //http://dicom.nema.org/medical/dicom/2019a/output/chtml/part04/sect_C.2.2.2.5.html
        //Type Format : <date1> - <date2> or - <date1> or <date1> -
        //(0040,0002)	DA	Scheduled Procedure Step Start Date
        //(0040,0003)	TM	Scheduled Procedure Step Start Time
        private string FilterForRangeValueMatching(string strValue)
        {



            return strValue;
        }


        /*
         * Converts a DicomDateValue object into a string formatted as yyyy-mm-dd
         */
        private string ConvertDicomDateToQueryDate(DicomDateValue ddv)
        {
            try
            {
                // Add 0s to beginning if necessary, e.g. yyyy-m-dd needs to be yyyy-mm-dd
                return ddv.Year.ToString().PadLeft(4, '0') + "-" +
                       ddv.Month.ToString().PadLeft(2, '0') + "-" +
                       ddv.Day.ToString().PadLeft(2, '0');
                //return ddv.Year.ToString().PadLeft(4, '0') + 
                //       ddv.Month.ToString().PadLeft(2, '0') + 
                //       ddv.Day.ToString().PadLeft(2, '0');
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", @"ConvertDicomDateToQueryDate", string.Format("Error Converting date:\r\n\r\n") + ex.Message);
                return "";
            }
        }

        /*
         * Converts a DicomTimeValue object into a string formatted as HH:MM:SS
         */
        private string ConvertDicomTimeToQueryTime(DicomTimeValue dtv)
        {
            try
            {
                // Add 0s to beginning if necessary, e.g. HH-M-SS needs to be HH-MM-SS
                //return dtv.Hours.ToString().PadLeft(2, '0') + ":" +
                //       dtv.Minutes.ToString().PadLeft(2, '0') + ":" +
                //       dtv.Seconds.ToString().PadLeft(2, '0');
                return dtv.Hours.ToString().PadLeft(2, '0') +
                      dtv.Minutes.ToString().PadLeft(2, '0') +
                      dtv.Seconds.ToString().PadLeft(2, '0');
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", @"ConvertDicomTimeToQueryTime", string.Format("Error converting time:\r\n\r\n") + ex.Message);
                return "";
            }
        }

        private void SetTimeDateKeyElement(ref DicomDataSet ResponseDS, DateTime dt, long tag, bool bTimeValue)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "SetTimeDateKeyElement", @"[START]");

            try
            {
                DicomElement element = ResponseDS.FindFirstElement(null, tag, false);
                if (element != null)
                {
                    if (bTimeValue)
                    {
                        DicomTimeValue[] dtv = new DicomTimeValue[1];
                        dtv[0] = new DicomTimeValue(dt);
                        ResponseDS.SetTimeValue(element, dtv);
                    }
                    else
                    {
                        DicomDateValue[] ddv = new DicomDateValue[1];
                        ddv[0] = new DicomDateValue(dt);
                        ResponseDS.SetDateValue(element, ddv);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", @"SetTimeDateKeyElement", string.Format("Error setting time or date element:\r\n\r\n") + ex.Message);
                return;
            }

            Logger.Instance.WriteLogDebug("DicomAction", "SetTimeDateKeyElement", @"[END]");
        }

        /*
         * Builds a SQL condition for a list of UIDs.
         */
        private string GetUIDCondition(long Tag, string strFieldName)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "GetUIDCondition", @"[START]");

            string strRetCondition = "";

            try
            {
                DicomElement element = ds.FindFirstElement(null, Tag, false);
                if (element != null)
                {
                    string strUID;
                    int nUIDsCount = ds.GetElementValueCount(element);

                    if (nUIDsCount > 0)
                    {
                        strRetCondition += " AND (";

                        for (int i = 0; i < nUIDsCount; i++)
                        {
                            strUID = ds.GetStringValue(element, i);
                            strRetCondition += strFieldName + "='" + strUID + "'";

                            if (i != nUIDsCount - 1)
                                strRetCondition += " OR ";
                        }

                        strRetCondition += ")";
                    }
                }
            }
            catch (Exception ex)
            {
                strRetCondition = "";
                Logger.Instance.WriteLogError("DicomAction", @"GetUIDCondition", string.Format("Error creating UID condition:\r\n\r\n") + ex.Message);
            }

            Logger.Instance.WriteLogDebug("DicomAction", "GetUIDCondition", @"[END]" + strRetCondition.ToString());

            return strRetCondition;
        }
        #endregion

        private void ResponseDICOM()
        {
            Logger.Instance.WriteLogDebug("DicomAction", "ResponseDICOM", @"[START]");

            try
            {
                //Key- T_ORDER.ord_key
                Dictionary<int, DicomDataSet> dicDcmDataSet = new();

                for (int i = 0; i < mwlItemList.Count; i++)
                {
                    MwlItem mwlItem = mwlItemList[i];

                    DicomDataSet dicomDataSet = null;
                    dicDcmDataSet.TryGetValue(mwlItem.ord_key, out dicomDataSet);

                    if (null == dicomDataSet)
                    {
                        dicomDataSet = new DicomDataSet();
                        dicDcmDataSet.Add(mwlItem.ord_key, dicomDataSet);

                        PrepareResponseDS(ref dicomDataSet);
                        SetResponseDS(ref dicomDataSet, mwlItem);
                    }
                    else
                    {
                        SetScheduleProcedureStepItem(ref dicomDataSet, mwlItem);
                    }

#if DEBUG
                    dicomDataSet.Save("ResDCM.dcm", 0);
#endif
                }

                foreach (DicomDataSet dicomDataSet in dicDcmDataSet.Values)
                {

                    client.SendCFindResponse(_PresentationID, _MessageID, _Class, DicomCommandStatusType.Pending, dicomDataSet);
                }

                client.SendCFindResponse(_PresentationID, _MessageID, _Class, DicomCommandStatusType.Success, null);

                Logger.Instance.WriteLogDebug("DicomAction", "ResponseDICOM", @"[END]");
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", "ResponseDICOM", ex.Message);
            }
        }

        // https://dicom.nema.org/dicom/2013/output/chtml/part06/chapter_6.html
        // Finds, builds, and returns to SCU datasets that match the query.
        // Encoded VR used here : SH, LO, ST, LT, PN, UT
        // 
        private void SetResponseDS(ref DicomDataSet responseDS, MwlItem mwlItem)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "SetResponseDS", @"[START]");

            try
            {
                byte[] encodedByteStr = Array.Empty<byte>();

                // Character Set
                string charset = server.DcmLanguage.InboundCharSet;
                if (string.IsNullOrEmpty(charset))
                {
                    charset = GlobalConfiguration.SpecificCharSet; //"ISO 2022 IR 6" (default)
                }

                int dsNLS = server.DcmLanguage.GetCurrentDcmNLS(charset);

                Utils.SetKeyElement(responseDS, DicomTag.SpecificCharacterSet, charset, false);

                // Accession Number (SH)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.ord_acc_num, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.AccessionNumber, encodedByteStr, false);

                // Modality 
                Utils.SetKeyElement(responseDS, DicomTag.Modality, mwlItem.sps_modality, false);

                // Institution Name (LO)
                //Utils.SetKeyElement(ResponseDicomDS, DicomTag.InstitutionName, value, false);

                // Referring Physician Name (PN)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.ord_referring_phyc, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.ReferringPhysicianName, encodedByteStr, false);

                // Paitent Name (PN)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.pt_name, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.PatientName, encodedByteStr, false);

                // Patient ID (LO)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.pt_id, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.PatientID, encodedByteStr, false);

                // Patient Birth DateTime
                // dates must be handled specially
                if (mwlItem.pt_birth_dttm != null)
                {
                    SetTimeDateKeyElement(ref responseDS, mwlItem.pt_birth_dttm, DicomTag.PatientBirthDate, false);
                }
                else
                {
                    Utils.SetKeyElement(responseDS, DicomTag.PatientBirthDate, mwlItem.pt_birth_dttm, false);
                }

                // Patient Sex
                Utils.SetKeyElement(responseDS, DicomTag.PatientSex, mwlItem.pt_sex, false);

                // Study Instance UID 
                Utils.SetKeyElement(responseDS, DicomTag.StudyInstanceUID, mwlItem.ord_study_uid, false);

                // Requesting Physician (PN)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.ord_requesting_phyc, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.RequestingPhysician, encodedByteStr, false);

                // Scheduled Procedure Step Start Date
                // dates must be handled specially
                if (mwlItem.sps_start_dttm != null)
                {
                    SetTimeDateKeyElement(ref responseDS, mwlItem.sps_start_dttm, DicomTag.ScheduledProcedureStepStartDate, false);
                }
                else
                {
                    Utils.SetKeyElement(responseDS, DicomTag.ScheduledProcedureStepStartDate, mwlItem.sps_start_dttm, false);
                }

                // Scheduled Procedure Step Start Time
                // dates must be handled specially
                if (mwlItem.sps_start_dttm != null)
                {
                    SetTimeDateKeyElement(ref responseDS, mwlItem.sps_start_dttm, DicomTag.ScheduledProcedureStepStartTime, true);
                }
                else
                {
                    Utils.SetKeyElement(responseDS, DicomTag.ScheduledProcedureStepStartTime, mwlItem.sps_start_dttm, false);
                }

                // Scheduled Procedure Step Performing Physician (PN)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.sps_perform_phyc_name, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.ScheduledPerformingPhysicianName, encodedByteStr, false);

                // Scheduled Procedure Step ID (SH)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.sps_id, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.ScheduledProcedureStepID, encodedByteStr, false);

                // Scheduled Procedure Step Description (LO)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.sps_desc, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.ScheduledProcedureStepDescription, encodedByteStr, false);

                // Requsted Procedure ID (SH)
                encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.ord_rp_id, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.RequestedProcedureID, encodedByteStr, false);

                // [Requested Procedure] DB에 아직 미구현 
                // Requested Procedure Description (LO)
                encodedByteStr = server.DcmLanguage.EncodeNLS(String.Empty, dsNLS);
                Utils.SetKeyElementName(responseDS, DicomTag.RequestedProcedureDescription, encodedByteStr, false);

                // Requested procedure code sequence
                Utils.SetCodeSeqKeyElements(responseDS, "code", "meaning", "designator", "version", DicomTag.RequestedProcedureCodeSequence);

                if (DataProvider.LicenseProvider.LicenseTypes.Veterinary == DataProvider.LicenseProvider.Instance.GetCurLicenseType())
                {
                    // [Species Sequence]
                    // Species Sequence Description (LO) 
                    Utils.SetKeyElement(responseDS, DicomTag.PatientSpeciesDescription, string.Empty, false);

                    // Code Value , Code Meaning, Code Designator, Code Version
                    Utils.SetCodeSeqKeyElements(responseDS, /*[value]*/mwlItem.species_code_value, /*[meaning]*/mwlItem.species_code_meaning, /*[designator]*/mwlItem.species_scm_design, /*[version]*/string.Empty, DicomTag.PatientSpeciesCodeSequence);

                    // [Breed Sequence]
                    // Breed Sequence Description (LO)
                    Utils.SetKeyElement(responseDS, DicomTag.PatientBreedDescription, string.Empty, true);

                    // Code Value , Code Meaning, Code Designator, Code Version
                    Utils.SetCodeSeqKeyElements(responseDS, /*[value]*/mwlItem.breed_code_value, /*[meaning]*/mwlItem.breed_code_meaning, /*[designator]*/mwlItem.breed_scm_design, /*[version]*/string.Empty, DicomTag.PatientBreedCodeSequence);

                    // [Responsible Persion]
                    encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.pt_responsible_person, dsNLS);
                    Utils.SetKeyElementName(responseDS, DicomTag.ResponsiblePerson, encodedByteStr, false);
                }

                #region Not Supporting Now
                // Patient Weight
                //Utils.SetKeyElement(responseDS, DicomTag.PatientWeight, value, false);

                // Requested Procedure Description
                //Utils.SetKeyElement(responseDS, DicomTag.RequestedProcedureDescription, value, false);

                // Admission ID
                //Utils.SetKeyElement(responseDS, DicomTag.AdmissionID, value, false);

                // Scheduled Procedure Step AE Title   
                //Utils.SetKeyElement(responseDS, DicomTag.ScheduledStationAETitle, mwlItem.sps, false);

                // Scheduled Procedure Step Location
                //Utils.SetKeyElement(responseDS, DicomTag.ScheduledProcedureStepLocation, mwlItem., false);

                // Reason For Requested Procedure
                //Utils.SetKeyElement(responseDS, DicomTag.ReasonForTheRequestedProcedure, mwlItem.re, false);

                // Requested Procedure Priority
                //Utils.SetKeyElement(responseDS, DicomTag.RequestedProcedurePriority, mwlItem., false);
                #endregion

                Logger.Instance.WriteLogDebug("DicomAction", "SetResponseDS", @"[END]");
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", "SetResponseDS", ex.Message);
            }
        }

        private void SetScheduleProcedureStepItem(ref DicomDataSet responseDS, MwlItem mwlItem)
        {
            Logger.Instance.WriteLogDebug("DicomAction", "SetScheduleProcedureStepItem", @"[START]");

            try
            {
                // Scheduled Procedure Step
                DicomElement element = null;
                element = responseDS.FindFirstElement(null, DicomTag.ScheduledProcedureStepSequence, false);
                if (element != null)
                {
                    byte[] encodedByteStr = Array.Empty<byte>();
                    DicomElement item = responseDS.InsertElement(element, true, DicomTag.Item, DicomVRType.SQ, false, 0);

                    if (item != null)
                    {
                        #region Insert element
                        // Scheduled Procedure Step AE Title
                        responseDS.InsertElement(item, true, DicomTag.ScheduledStationAETitle, DicomVRType.UN, false, 0);
                        // Scheduled Procedure Step Start Date
                        responseDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepStartDate, DicomVRType.UN, false, 0);
                        // Scheduled Procedure Step Start Time
                        responseDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepStartTime, DicomVRType.UN, false, 0);
                        // Modality 
                        responseDS.InsertElement(item, true, DicomTag.Modality, DicomVRType.UN, false, 0);
                        // Scheduled Procedure Step Performing Physician (PN)
                        responseDS.InsertElement(item, true, DicomTag.ScheduledPerformingPhysicianName, DicomVRType.UN, false, 0);
                        // Scheduled Procedure Step Description
                        responseDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepDescription, DicomVRType.UN, false, 0);
                        // Scheduled Procedure Step Location
                        //responseDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepLocation, DicomVRType.UN, false, 0);
                        // Scheduled Procedure Step ID
                        responseDS.InsertElement(item, true, DicomTag.ScheduledProcedureStepID, DicomVRType.UN, false, 0);
                        #endregion Insert element

                        #region Insert data
                        // Scheduled Procedure Step AE Title
                        //Utils.SetKeyElement(responseDS, DicomTag.ScheduledStationAETitle, mwlItem.sps, false);

                        // Scheduled Procedure Step Start Date
                        // dates must be handled specially
                        if (mwlItem.sps_start_dttm != null)
                        {
                            SetTimeDateKeyElement(ref responseDS, mwlItem.sps_start_dttm, DicomTag.ScheduledProcedureStepStartDate, false);
                        }
                        else
                        {
                            Utils.SetKeyElement(responseDS, DicomTag.ScheduledProcedureStepStartDate, mwlItem.sps_start_dttm, false);
                        }

                        // Scheduled Procedure Step Start Time
                        // dates must be handled specially
                        if (mwlItem.sps_start_dttm != null)
                        {
                            SetTimeDateKeyElement(ref responseDS, mwlItem.sps_start_dttm, DicomTag.ScheduledProcedureStepStartTime, true);
                        }
                        else
                        {
                            Utils.SetKeyElement(responseDS, DicomTag.ScheduledProcedureStepStartTime, mwlItem.sps_start_dttm, false);
                        }

                        // Modality 
                        Utils.SetKeyElement(responseDS, DicomTag.Modality, mwlItem.sps_modality, false);

                        // Scheduled Procedure Step Performing Physician (PN)
                        encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.sps_perform_phyc_name, server.DcmLanguage.CurNLS);
                        Utils.SetKeyElementName(responseDS, DicomTag.ScheduledPerformingPhysicianName, encodedByteStr, false);

                        // Scheduled Procedure Step Description (LO)
                        encodedByteStr = server.DcmLanguage.EncodeNLS(mwlItem.sps_desc, server.DcmLanguage.CurNLS);
                        Utils.SetKeyElementName(responseDS, DicomTag.ScheduledProcedureStepDescription, encodedByteStr, false);

                        // Scheduled Procedure Step Location
                        //Utils.SetKeyElement(responseDS, DicomTag.ScheduledProcedureStepLocation, mwlItem., false);

                        // Scheduled Procedure Step ID
                        Utils.SetKeyElement(responseDS, DicomTag.ScheduledProcedureStepID, mwlItem.sps_id, false);
                        #endregion Insert data
                    }
                }

                Logger.Instance.WriteLogDebug("DicomAction", "SetScheduleProcedureStepItem", @"[END]");
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("DicomAction", "SetScheduleProcedureStepItem", ex.Message);
            }
        }
    }
}
