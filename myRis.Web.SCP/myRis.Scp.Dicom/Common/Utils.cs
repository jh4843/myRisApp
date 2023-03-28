using Leadtools.Dicom;
using myRis.Web.Scp.DataProvider.Misc;
using System;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Threading;

namespace myRis.Web.Scp.Dicom.Common
{
    [StructLayout(LayoutKind.Sequential)]
    public struct POINT
    {
        public int X;
        public int Y;

        public POINT(int x, int y)
        {
            this.X = x;
            this.Y = y;
        }

        public static implicit operator System.Drawing.Point(POINT p)
        {
            return new System.Drawing.Point(p.X, p.Y);
        }

        public static implicit operator POINT(System.Drawing.Point p)
        {
            return new POINT(p.X, p.Y);
        }
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct MSG
    {
        public IntPtr hwnd;
        public uint message;
        public IntPtr wParam;
        public IntPtr lParam;
        public uint time;
        public POINT pt;
    }

    public enum WaitReturn
    {
        Complete,
        Timeout,
    }

    /// <summary>
    /// Summary description for Scu.
    /// </summary>
    public class Utils
    {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool PeekMessage(out MSG lpMsg, HandleRef hWnd,
                                       uint wMsgFilterMin, uint wMsgFilterMax,
                                       uint wRemoveMsg);

        [DllImport("user32.dll")]
        static extern bool TranslateMessage([In] ref MSG lpMsg);
        [DllImport("user32.dll")]
        static extern IntPtr DispatchMessage([In] ref MSG lpmsg);

        const uint PM_REMOVE = 1;

        public static WaitReturn WaitForComplete(double mill, WaitHandle wh)
        {
            TimeSpan goal = new TimeSpan(DateTime.Now.AddMilliseconds(mill).Ticks);
            MSG msg = new MSG();
            HandleRef h = new HandleRef(null, IntPtr.Zero);

            do
            {
                if (PeekMessage(out msg, h, 0, 0, PM_REMOVE))
                {
                    TranslateMessage(ref msg);
                    DispatchMessage(ref msg);
                }

                if (wh.WaitOne(new TimeSpan(1), false))
                {
                    return WaitReturn.Complete;
                }

                if (goal.CompareTo(new TimeSpan(DateTime.Now.Ticks)) < 0)
                {
                    return WaitReturn.Timeout;
                }

            } while (true);
        }

        public static void EngineStartup()
        {
            DicomEngine.Startup();
        }

        public static void EngineShutdown()
        {
            DicomEngine.Shutdown();
        }

        public static void DicomNetStartup()
        {
            DicomNet.Startup();
        }

        public static void DicomNetShutdown()
        {
            DicomNet.Shutdown();
        }

        /// <summary>
        /// Helper method to get string value from a DICOM dataset.
        /// </summary>
        /// <param name="dcm">The DICOM dataset.</param>
        /// <param name="tag">Dicom tag.</param>
        /// <returns>String value of the specified DICOM tag.</returns>
        public static string GetStringValue(DicomDataSet dcm, long tag, bool tree)
        {
            DicomElement element;

            element = dcm.FindFirstElement(null, tag, tree);
            if (element != null)
            {
                if (dcm.GetElementValueCount(element) > 0)
                {
                    return dcm.GetConvertValue(element);
                }
            }

            return "";
        }

        public static string GetStringValue(DicomDataSet dcm, long tag)
        {
            return GetStringValue(dcm, tag, true);
        }

#if (LTV15_CONFIG)
      public static string GetStringValue(DicomDataSet dcm, DicomTagType tag, bool tree)
      {
         return GetStringValue(dcm, (long)tag, tree);
      }

      public static string GetStringValue(DicomDataSet dcm, DicomTagType tag)
      {
      return GetStringValue(dcm,(long)tag);
      }
#endif

        public static StringCollection GetStringValues(DicomDataSet dcm, long tag)
        {
            DicomElement element;
            StringCollection sc = new StringCollection();

            element = dcm.FindFirstElement(null, tag, true);
            if (element != null)
            {
                if (dcm.GetElementValueCount(element) > 0)
                {
                    string s = dcm.GetConvertValue(element);
                    string[] items = s.Split('\\');

                    foreach (string value in items)
                    {
                        sc.Add(value);
                    }
                }
            }

            return sc;
        }

#if (LTV15_CONFIG)
      public static StringCollection GetStringValues(DicomDataSet dcm, DicomTagType tag)
      {
         return GetStringValues(dcm, (long)tag);
      }
#endif

        public static byte[] GetBinaryValues(DicomDataSet dcm, long tag)
        {
            DicomElement element;

            element = dcm.FindFirstElement(null, tag, true);
            if (element != null)
            {
                if (element.Length > 0)
                {
                    return dcm.GetBinaryValue(element, (int)element.Length);
                }
            }

            return null;
        }


#if (LTV15_CONFIG)
      public static byte[] GetBinaryValues(DicomDataSet dcm, DicomTagType tag)
      {
         return GetBinaryValues(dcm, (long)tag);
      }
#endif

        public static bool IsTagPresent(DicomDataSet dcm, long tag)
        {
            DicomElement element;

            element = dcm.FindFirstElement(null, tag, true);
            return (element != null);
        }

#if (LTV15_CONFIG)
      public static bool IsTagPresent(DicomDataSet dcm, DicomTagType tag)
      {
         return IsTagPresent(dcm, (long)tag);
      }
#endif

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dcm"></param>
        /// <param name="tag"></param>
        /// <param name="tagValue"></param>
        /// <returns></returns>
        public static DicomExceptionCode SetTag(DicomDataSet dcm, long tag, object tagValue, bool tree)
        {
            DicomExceptionCode ret = DicomExceptionCode.Success;
            DicomElement element;

            if (tagValue == null)
                return DicomExceptionCode.Parameter;

            element = dcm.FindFirstElement(null, tag, tree);
            if (element == null)
            {
                element = dcm.InsertElement(null, false, tag, DicomVRType.UN, false, 0);
            }

            if (element == null)
                return DicomExceptionCode.Parameter;

            try
            {
                dcm.SetConvertValue(element, tagValue.ToString(), 1);
            }
            catch (DicomException de)
            {
                ret = de.Code;
            }

            return ret;
        }

        public static DicomExceptionCode SetTag(DicomDataSet dcm, long tag, object tagValue)
        {
            return SetTag(dcm, tag, tagValue, true);
        }

#if (LTV15_CONFIG)
      public static void SetTag(DicomDataSet dcm, DicomTagType seq,DicomTagType tag, object tagValue)
      {
         SetTag(dcm, (long)seq,(long)tag, tagValue);
      }
#endif

        public static void SetTag(DicomDataSet dcm, long Sequence, long Tag, object TagValue)
        {
            DicomElement seqElement = dcm.FindFirstElement(null, Sequence, true);
            DicomElement seqItem = null;
            DicomElement item = null;

            if (seqElement == null)
            {
                seqElement = dcm.InsertElement(null, false, Tag, DicomVRType.SQ, true, -1);
            }

            seqItem = dcm.GetChildElement(seqElement, false);
            if (seqItem == null)
            {
#if (LTV15_CONFIG)
              seqItem = dcm.InsertElement(seqElement, true, DicomTagType.SequenceDelimitationItem, DicomVRType.SQ, true, -1);
#else
                seqItem = dcm.InsertElement(seqElement, true, DicomTag.SequenceDelimitationItem, DicomVRType.SQ, true, -1);
#endif
            }

            item = dcm.GetChildElement(seqItem, true);
            while (item != null)
            {
#if (LTV15_CONFIG)
              if ((long)item.Tag == Tag)
                  break;
#else
                if (item.Tag == Tag)
                    break;
#endif

                item = dcm.GetNextElement(item, true, true);
            }

            if (item == null)
            {
                item = dcm.InsertElement(seqItem, true, Tag, DicomVRType.UN, false, -1);
            }
            dcm.SetConvertValue(item, TagValue.ToString(), 1);
        }


#if (LTV15_CONFIG)
      public static DicomExceptionCode SetTag(DicomDataSet dcm, DicomTagType tag, object tagValue)
      {
         return SetTag(dcm, (long)tag, tagValue);
      }

      public static DicomExceptionCode SetTag(DicomDataSet dcm, DicomTagType tag, object tagValue, bool tree)
      {
          return SetTag(dcm, (long)tag, tagValue, tree);
      }

#endif

        public static DicomExceptionCode SetTag(DicomDataSet dcm, long tag, byte[] tagValue)
        {
            DicomExceptionCode ret = DicomExceptionCode.Success;
            DicomElement element;

            if (tagValue == null)
                return DicomExceptionCode.Parameter;

            element = dcm.FindFirstElement(null, tag, true);
            if (element == null)
            {
                element = dcm.InsertElement(null, false, tag, DicomVRType.UN, false, 0);
            }

            dcm.SetBinaryValue(element, tagValue, tagValue.Length);

            return ret;
        }

#if (LTV15_CONFIG)
      public static DicomExceptionCode InsertKeyElement(DicomDataSet dcmRsp, DicomDataSet dcmReq, DicomTagType tag)
      {
         return InsertKeyElement(dcmRsp, dcmReq, (long)tag);
      }
#endif

        public static DicomExceptionCode InsertKeyElement(DicomDataSet dcmRsp, DicomDataSet dcmReq, long tag)
        {
            DicomExceptionCode ret = DicomExceptionCode.Success;
            DicomElement element;

            try
            {
                element = dcmReq.FindFirstElement(null, tag, true);
                if (element != null)
                {
                    dcmRsp.InsertElement(null, false, tag, DicomVRType.UN, false, 0);
                }
            }
            catch (DicomException de)
            {
                ret = de.Code;
            }

            return ret;
        }


#if (LTV15_CONFIG)
       public static DicomExceptionCode SetKeyElement(DicomDataSet dcmRsp, DicomTagType tag, object tagValue)
       {
           return SetKeyElement(dcmRsp, (long)tag, tagValue);
       }

       public static DicomExceptionCode SetKeyElement(DicomDataSet dcmRsp, DicomTagType tag, object tagValue, bool tree)
       {
           return SetKeyElement(dcmRsp, (long)tag, tagValue, tree);
       }
#endif
        public static DicomExceptionCode SetKeyElementName(DicomDataSet dcmRsp, long tag, byte[] tagValue, bool tree)
        {
            DicomExceptionCode ret = DicomExceptionCode.Success;
            DicomElement element;

            if (tagValue == null)
                return DicomExceptionCode.Parameter;

            try
            {
                element = dcmRsp.FindFirstElement(null, tag, tree);
                if (element != null)
                {
                    if (tagValue.Length > 0)
                    {
                        dcmRsp.SetBinaryValue(element, tagValue, tagValue.Length);
                    }
                    else
                    {
                        dcmRsp.SetConvertValue(element, "", 1);
                    }
                }
            }
            catch (DicomException de)
            {
                ret = de.Code;
            }

            return ret;
        }

        public static DicomExceptionCode SetKeyElement(DicomDataSet dcmRsp, long tag, object tagValue, bool tree)
        {
            DicomExceptionCode ret = DicomExceptionCode.Success;
            DicomElement element;

            if (tagValue == null)
                return DicomExceptionCode.Parameter;

            try
            {
                element = dcmRsp.FindFirstElement(null, tag, tree);
                if (element != null)
                {
                    //for testing
                    //string temp = @"abc\de\get";
                    //int tempCount = temp.Count(f => (f == '\\'));   
                    //
                    int valueCount = tagValue.ToString().Count(c => (c == '\\'));
                    dcmRsp.SetConvertValue(element, tagValue.ToString(), valueCount + 1);
                }
                else
                {
                    SetTag(dcmRsp, tag, tagValue, tree);
                }
            }
            catch (DicomException de)
            {
                ret = de.Code;
            }

            return ret;
        }

        public static DicomExceptionCode SetCodeSeqKeyElements(DicomDataSet dcmRsp, object codeValue, object codeMeaning, object codeDesignator, object codeVersion, long seqType)
        {
            DicomExceptionCode ret = DicomExceptionCode.Success;

            //일단 이렇게..
            if (codeValue == null || codeMeaning == null || codeDesignator == null || codeVersion == null)
                return DicomExceptionCode.Parameter;

            try
            {
                DicomElement element = null;

                switch (seqType)
                {
                    case DicomTag.PatientSpeciesCodeSequence:
                        element = dcmRsp.FindFirstElement(null, DicomTag.PatientSpeciesCodeSequence, false);
                        break;
                    case DicomTag.PatientBreedCodeSequence:
                        element = dcmRsp.FindFirstElement(null, DicomTag.PatientBreedCodeSequence, false);
                        break;
                    case DicomTag.RequestedProcedureCodeSequence:
                        element = dcmRsp.FindFirstElement(null, DicomTag.RequestedProcedureCodeSequence, false);
                        break;
                    default:
                        break;
                }

                if (element != null)
                {
                    element = dcmRsp.GetChildElement(element, true); // item

                    if (element != null)
                    {
                        element = dcmRsp.GetChildElement(element, true); // children of item

                        while (element != null)
                        {
                            switch (element.Tag)
                            {
                                case DicomTag.CodeValue:
                                    dcmRsp.SetConvertValue(element, codeValue.ToString(), 1);
                                    break;
                                case DicomTag.CodingSchemeDesignator:
                                    dcmRsp.SetConvertValue(element, codeDesignator.ToString(), 1);
                                    break;
                                case DicomTag.CodingSchemeVersion:
                                    dcmRsp.SetConvertValue(element, codeVersion.ToString(), 1);
                                    break;
                                case DicomTag.CodeMeaning:
                                    dcmRsp.SetConvertValue(element, codeMeaning.ToString(), 1);
                                    break;
                            }

                            element = dcmRsp.GetNextElement(element, true, true);
                        }
                    }
                }
            }
            catch (DicomException de)
            {
                ret = de.Code;
            }

            return ret;
        }

        public static DicomExceptionCode SetKeyElement(DicomDataSet dcmRsp, long tag, object tagValue)
        {
            return SetKeyElement(dcmRsp, tag, tagValue, true);
        }

        public static UInt16 GetGroup(long tag)
        {
            return ((UInt16)(tag >> 16));
        }

        public static int GetElement(long tag)
        {
            return ((UInt16)(tag & 0xFFFF));
        }

        // Creates a properly formatted Dicom Unique Identifier (VR type of UI) value
        public static string GenerateDicomUniqueIdentifier()
        {
            string strGUID = "";

            try
            {
                DateTime SystemTime = DateTime.Now;
                Random rand = new Random((int)SystemTime.Ticks);
                strGUID = String.Format("1.2.840.114257.1.1{0}{1}{2}", SystemTime.Ticks, rand.Next(), rand.Next());
                // max length for this field is 64 so cut it off if too long
                if (strGUID.Length > 64)
                    strGUID = strGUID.Substring(0, 64);
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError(@"Utils", @"GenerateDicomUniqueIdentifier", ex.Message);
            }

            return strGUID;
        }

        public static bool IsLocalIPAddress(string hostNameOrAddress)
        {
            if (hostNameOrAddress.ToLower() == Dns.GetHostName().ToLower())
            {
                return true;
            }
            else
            {
                IPAddress serviceAddress;

                if (IPAddress.TryParse(hostNameOrAddress, out serviceAddress))
                {
                    if (IPAddress.IsLoopback(serviceAddress))
                    {
                        return true;
                    }
                    else
                    {
                        IPAddress[] localAddresses;


                        localAddresses = Dns.GetHostAddresses(Dns.GetHostName());

                        foreach (IPAddress localAddress in localAddresses)
                        {
                            if (localAddress.Equals(serviceAddress))
                            {
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        }


        public static System.Net.IPAddress ResolveIPAddress(string hostNameOrAddress)
        {
            IPAddress[] addresses;
            addresses = Dns.GetHostAddresses(hostNameOrAddress.Trim());
            if (addresses == null || addresses.Length == 0)
            {
                throw new ArgumentException("Invalid hostNameOrAddress parameter.");
            }
            else
            {
                foreach (IPAddress address in addresses)
                {
                    if (address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork ||
                       address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6)
                    {
                        return address;
                    }
                }
                throw new ArgumentException("Could not resolve a valid host Address. Address must conform to IPv4 or IPv6.");
            }
        }
    }
}