using Leadtools.Dicom;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Dicom.Utilities
{
    public class DicomLanguage
    {
        // DICOM CharSet - https://dicom.nema.org/medical/Dicom/2018d/output/chtml/part03/sect_C.12.html#sect_C.12.1.1.2
        // Widnow Code Page - https://docs.microsoft.com/ko-kr/windows/win32/intl/code-page-identifiers
        // To be refact.
        static class NLSConstants
        {
            public const byte LF =  ((byte)'\x0A');
            public const byte FF =  ((byte)'\x0C');
            public const byte CR =  ((byte)'\x0D');
            public const byte ESC = ((byte)'\x1B');
            public const byte SS1 = ((byte)'\x8E');
            public const byte SS2 = ((byte)'\x8F');

            public const int DCM_NLS_ISO_IR_6 = 0;
            public const int DCM_NLS_ISO_IR_100 = 1;
            public const int DCM_NLS_ISO_IR_101 = 2;
            public const int DCM_NLS_ISO_IR_109 = 3;
            public const int DCM_NLS_ISO_IR_110 = 4;
            public const int DCM_NLS_ISO_IR_144 = 5;
            public const int DCM_NLS_ISO_IR_127 = 6;
            public const int DCM_NLS_ISO_IR_126 = 7;
            public const int DCM_NLS_ISO_IR_138 = 8;
            public const int DCM_NLS_ISO_IR_148 = 9;
            public const int DCM_NLS_ISO_IR_13 = 10;
            public const int DCM_NLS_ISO_IR_166 = 11;
            public const int DCM_NLS_ISO_IR_14 = 12;
            public const int DCM_NLS_ISO_IR_87 = 13;
            public const int DCM_NLS_ISO_IR_159 = 14;
            public const int DCM_NLS_ISO_IR_149 = 15;
            public const int DCM_NLS_ISO_IR_192 = 16;
            public const int DCM_NLS_GB18030 = 17;
            public const int DCM_NLS_ISO_IR_58 = 18;

            public const int DCM_NLS_TOT_CNT = 19;

            public const int DCM_NLS_ISO_2022_IR_6_87  = (DCM_NLS_ISO_IR_6 | DCM_NLS_ISO_IR_87 << 8);   // Japanese: ISO 646 + JIS X 0208
            public const int DCM_NLS_ISO_2022_IR_13_87 = (DCM_NLS_ISO_IR_13 | DCM_NLS_ISO_IR_87 << 8);	// Japanese: JIS X 0201 + JIS X 0208
            public const int DCM_NLS_ISO_2022_IR_6_149 = (DCM_NLS_ISO_IR_6 | DCM_NLS_ISO_IR_149 << 8);  // Korean: ISO 646 + KS X 1001

            public const int DCM_NLS_DEFAULT           = DCM_NLS_ISO_IR_6;
            public const int DCM_NLS_LATIN1            = DCM_NLS_ISO_IR_100;
            public const int DCM_NLS_LATIN2            = DCM_NLS_ISO_IR_101;
            public const int DCM_NLS_LATIN3            = DCM_NLS_ISO_IR_109;
            public const int DCM_NLS_LATIN4            = DCM_NLS_ISO_IR_110;
            public const int DCM_NLS_CYRILLIC          = DCM_NLS_ISO_IR_144;
            public const int DCM_NLS_ARABIC            = DCM_NLS_ISO_IR_127;
            public const int DCM_NLS_GREEK             = DCM_NLS_ISO_IR_126;
            public const int DCM_NLS_HEBREW            = DCM_NLS_ISO_IR_138;
            public const int DCM_NLS_LATIN5            = DCM_NLS_ISO_IR_148;
            public const int DCM_NLS_JAPANESE0         = DCM_NLS_ISO_IR_13;
            public const int DCM_NLS_THAI              = DCM_NLS_ISO_IR_166;
            public const int DCM_NLS_JAPANESE1         = DCM_NLS_ISO_2022_IR_6_87;
            public const int DCM_NLS_JAPANESE2         = DCM_NLS_ISO_2022_IR_13_87;
            public const int DCM_NLS_JAPANESE          = DCM_NLS_JAPANESE2;
            public const int DCM_NLS_KOREAN            = DCM_NLS_ISO_2022_IR_6_149;
            public const int DCM_NLS_UNICODE_UTF8      = DCM_NLS_ISO_IR_192;
            public const int DCM_NLS_CHINESE_GB18030   = DCM_NLS_GB18030;
            public const int DCM_NLS_CHINESE_GB2312_80 = DCM_NLS_ISO_IR_58;
        }

        enum ISO_CHARSET
        {
            ISO_IR_6 = 0,
            ISO_IR_100,
            ISO_IR_101,
            ISO_IR_109,
            ISO_IR_110,
            ISO_IR_144,
            ISO_IR_127,
            ISO_IR_126,
            ISO_IR_138,
            ISO_IR_148,
            ISO_IR_13,
            ISO_IR_166,
            ISO_IR_14,
            ISO_IR_87,
            ISO_IR_159,
            ISO_IR_149,
            ISO_IR_192,
            GB18030,
            ISO_IR_58
        }

        public List<string> lstIso2022ESC;
        public int CurNLS { get; set; }       // as a number
        public string InboundCharSet { get; set; }

        public DicomLanguage()
        {
            LoadData();
        }

        // for code extension ; not used for now 
        public void LoadData()
        {
            lstIso2022ESC = new List<string>();
                                                  
            //lstIso2022ESC.Add("\x1B");              //  for testing
            
            lstIso2022ESC.Add("\x1B\x28\x42");        //  0: ISO 2022 IR 6: ESC ( B
            lstIso2022ESC.Add("\x1B\x2D\x41");        //  1: ISO 2022 IR 100: ESC - A
            lstIso2022ESC.Add("\x1B\x2D\x42");        //  2: ISO 2022 IR 101: ESC - B
            lstIso2022ESC.Add("\x1B\x2D\x43");        //  3: ISO 2022 IR 109: ESC - C
            lstIso2022ESC.Add("\x1B\x2D\x44");        //  4: ISO 2022 IR 110: ESC - D
            lstIso2022ESC.Add("\x1B\x2D\x4C");        //  5: ISO 2022 IR 144: ESC - L
            lstIso2022ESC.Add("\x1B\x2D\x47");        //  6: ISO 2022 IR 127: ESC - G
            lstIso2022ESC.Add("\x1B\x2D\x46");        //  7: ISO 2022 IR 126: ESC - F
            lstIso2022ESC.Add("\x1B\x2D\x48");        //  8: ISO 2022 IR 138: ESC - H
            lstIso2022ESC.Add("\x1B\x2D\x4D");        //  9: ISO 2022 IR 148: ESC - M
            lstIso2022ESC.Add("\x1B\x29\x49");        // 10: ISO 2022 IR 13: ESC ) I
            lstIso2022ESC.Add("\x1B\x2D\x54");        // 11: ISO 2022 IR 166: ESC -
            lstIso2022ESC.Add("\x1B\x28\x4A");        // 12: ISO 2022 IR 14: ESC ( J
            lstIso2022ESC.Add("\x1B\x24\x42");        // 13: ISO 2022 IR 87: ESC $ B
            lstIso2022ESC.Add("\x1B\x24\x28\x44");    // 14: ISO 2022 IR 159: ESC $ ( D
            lstIso2022ESC.Add("\x1B\x24\x29\x43");    // 15: ISO 2022 IR 149: ESC $ ) C
            lstIso2022ESC.Add("");                    // 16: UTF-8
            lstIso2022ESC.Add("");                    // 17: Chinese GB18030
            lstIso2022ESC.Add("\x1B\x24\x29\x41");	  // 18: Chinese GB2312-80
        }

        //To be refactored
        public int GetCurrentDcmNLS(DicomDataSet ds)
        {
            InboundCharSet = string.Empty;
            int curNLS = NLSConstants.DCM_NLS_ISO_IR_6;

            DicomElement element = ds.FindFirstElement(null, DicomTag.SpecificCharacterSet, false);
            
            if(element == null || element.Length == 0)
            {
                return curNLS; //default NLS 
            }

            List<string> lstCharSet = new List<string>();

            string valStr = string.Empty;
            int valCount = ds.GetElementValueCount(element);

            for(int i=0; i < valCount; i++)
            {
                valStr = ds.GetStringValue(element, i);
                lstCharSet.Add(valStr);
                
                if(i < valCount-1)
                {
                    InboundCharSet += valStr + @"\";
                }
                else 
                {
                    InboundCharSet += valStr;   
                }
            }

            for(int i=0; i < lstCharSet.Count; i++)
            {
                string strNLS = lstCharSet[i].ToUpper();
                curNLS = GetCurrentDcmNLS(strNLS);

//                 if (strNLS.Contains("ISO 2022 IR 100") || strNLS.Contains("ISO_IR 100"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_100;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 101") || strNLS.Contains("ISO_IR 101"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_101;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 109") || strNLS.Contains("ISO_IR 109"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_109;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 110") || strNLS.Contains("ISO_IR 110"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_110;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 144") || strNLS.Contains("ISO_IR 144"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_144;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 127") || strNLS.Contains("ISO_IR 127"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_127;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 126") || strNLS.Contains("ISO_IR 126"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_126;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 138") || strNLS.Contains("ISO_IR 138"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_138;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 148") || strNLS.Contains("ISO_IR 148"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_148;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 13") || strNLS.Contains("ISO_IR 13"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_13;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 166") || strNLS.Contains("ISO_IR 166"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_166;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 149") || strNLS.Contains("ISO_IR 149"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_149;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 14") || strNLS.Contains("ISO_IR 14"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_14;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 87") || strNLS.Contains("ISO_IR 87"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_87;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 159") || strNLS.Contains("ISO_IR 159"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_159;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 192") || strNLS.Contains("ISO_IR 192"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_192;
//                 }
//                 else if (strNLS.Contains("GB18030"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_GB18030;
//                 }
//                 else if (strNLS.Contains("ISO 2022 IR 58") || strNLS.Contains("ISO_IR 58"))
//                 {
//                     curNLS = NLSConstants.DCM_NLS_ISO_IR_58;
//                 }
            }

            return CurNLS = curNLS;
        }

        public int GetCurrentDcmNLS(string strNls)
        {
            int curNLS = NLSConstants.DCM_NLS_ISO_IR_6;
            string strNLS = strNls.ToUpper();

            if (strNLS.Contains("ISO 2022 IR 100") || strNLS.Contains("ISO_IR 100"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_100;
            }
            else if (strNLS.Contains("ISO 2022 IR 101") || strNLS.Contains("ISO_IR 101"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_101;
            }
            else if (strNLS.Contains("ISO 2022 IR 109") || strNLS.Contains("ISO_IR 109"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_109;
            }
            else if (strNLS.Contains("ISO 2022 IR 110") || strNLS.Contains("ISO_IR 110"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_110;
            }
            else if (strNLS.Contains("ISO 2022 IR 144") || strNLS.Contains("ISO_IR 144"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_144;
            }
            else if (strNLS.Contains("ISO 2022 IR 127") || strNLS.Contains("ISO_IR 127"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_127;
            }
            else if (strNLS.Contains("ISO 2022 IR 126") || strNLS.Contains("ISO_IR 126"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_126;
            }
            else if (strNLS.Contains("ISO 2022 IR 138") || strNLS.Contains("ISO_IR 138"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_138;
            }
            else if (strNLS.Contains("ISO 2022 IR 148") || strNLS.Contains("ISO_IR 148"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_148;
            }
            else if (strNLS.Contains("ISO 2022 IR 13") || strNLS.Contains("ISO_IR 13"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_13;
            }
            else if (strNLS.Contains("ISO 2022 IR 166") || strNLS.Contains("ISO_IR 166"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_166;
            }
            else if (strNLS.Contains("ISO 2022 IR 149") || strNLS.Contains("ISO_IR 149"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_149;
            }
            else if (strNLS.Contains("ISO 2022 IR 14") || strNLS.Contains("ISO_IR 14"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_14;
            }
            else if (strNLS.Contains("ISO 2022 IR 87") || strNLS.Contains("ISO_IR 87"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_87;
            }
            else if (strNLS.Contains("ISO 2022 IR 159") || strNLS.Contains("ISO_IR 159"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_159;
            }
            else if (strNLS.Contains("ISO 2022 IR 192") || strNLS.Contains("ISO_IR 192"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_192;
            }
            else if (strNLS.Contains("GB18030"))
            {
                curNLS = NLSConstants.DCM_NLS_GB18030;
            }
            else if (strNLS.Contains("ISO 2022 IR 58") || strNLS.Contains("ISO_IR 58"))
            {
                curNLS = NLSConstants.DCM_NLS_ISO_IR_58;
            }

            return curNLS;
        }

            // window code page
            // https://docs.microsoft.com/ko-kr/windows/win32/intl/code-page-identifiers
        public int GetCodePage(int curNLS)
        {
            int codePage = 0;

            switch (curNLS)
            {
                case NLSConstants.DCM_NLS_ISO_IR_100:
                    {
                        codePage = 28591;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_101:
                    {
                        codePage = 28592;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_109:
                    {
                        codePage = 28593;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_110:
                    {
                        codePage = 28594;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_144:
                    {
                        codePage = 28595;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_127:
                    {
                        codePage = 28596;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_126:
                    {
                        codePage = 28597;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_138:
                    {
                        codePage = 28598;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_148:
                    {
                        codePage = 28599;
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_166:
                    {
                        codePage =  874;   // THAI (window:874, x-max:10021, IBM:20838)
                    }
                    break;
                case NLSConstants.DCM_NLS_ISO_IR_149:
                    {
                        codePage = 949;    // KOREAN
                    }
                    break;
            }

            return codePage;
        }

        // To be refactored
        // https://dicom.nema.org/dicom/2013/output/chtml/part05/chapter_6.html
        // Encoded VR - LO, LT, PN, SH, ST, UT
        public byte[] EncodeNLS(string inputStr, int curNLS)
        {
            byte[] encodedByte = null;
            byte[] unicodeByte = Encoding.UTF8.GetBytes(inputStr);

            int codePage = GetCodePage(curNLS);
            Encoding utf8 = Encoding.UTF8;
            Encoding targetEncoding = Encoding.GetEncoding(codePage);

            string decodedStr = string.Empty;

            encodedByte = Encoding.Convert(utf8, targetEncoding, unicodeByte);
            decodedStr = targetEncoding.GetString(encodedByte);  //확인용


            return encodedByte;
        }

        // To be refactored
        public string DecodeNLS(byte[] input, int curNLS)
        {
            string decodedStr = string.Empty;

            if (curNLS == NLSConstants.DCM_NLS_ISO_IR_6) //default 
            {
                decodedStr = Encoding.Default.GetString(input);
                return decodedStr;
            }
            if (curNLS == NLSConstants.DCM_NLS_ISO_IR_192)
            {
                return decodedStr = Encoding.UTF8.GetString(input);
                //string val = Encoding.GetEncoding(65001).GetString(input); //for test 
            }
            else if(curNLS == NLSConstants.DCM_NLS_GB18030)
            {
                return decodedStr = Encoding.GetEncoding(54936).GetString(input);
            }
            else if(CurNLS == NLSConstants.DCM_NLS_ISO_IR_58)
            {
                return decodedStr = Encoding.GetEncoding(20936).GetString(input);
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_87 || CurNLS == NLSConstants.DCM_NLS_ISO_IR_13)  
            {
                decodedStr = Encoding.GetEncoding(932).GetString(input);
                byte[] tempStr = Encoding.GetEncoding(50222).GetBytes(decodedStr);
                decodedStr = Encoding.GetEncoding(50222).GetString(tempStr);
                 
                return decodedStr;
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_144)
            {
                decodedStr = Encoding.GetEncoding(28595).GetString(input);
                return decodedStr = new string(decodedStr.Where(c => !char.IsControl(c)).ToArray());

                //decodedStr = Encoding.GetEncoding(28595).GetString(input);
                //byte[] tempT9est = Encoding.GetEncoding(1251).GetBytes(decodedStr);
                //decodedStr = Encoding.GetEncoding(1251).GetString(tempT9est); 
                //return decodedStr = decodedStr.Replace("?", "");
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_127)
            {
                decodedStr = Encoding.GetEncoding(28596).GetString(input);
                decodedStr = new string(decodedStr.Where(c => !char.IsControl(c)).ToArray());

                return decodedStr;
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_149)
            {
                decodedStr = Encoding.GetEncoding(949).GetString(input);
                byte[] tempT9est = Encoding.GetEncoding(50225).GetBytes(decodedStr);
                decodedStr = Encoding.GetEncoding(50225).GetString(tempT9est);

                return decodedStr;
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_100)
            {
                decodedStr = Encoding.GetEncoding(28591).GetString(input);
                byte[] tempT9est = Encoding.GetEncoding(1252).GetBytes(decodedStr);
                decodedStr = Encoding.GetEncoding(1252).GetString(tempT9est);
                return decodedStr = decodedStr.Replace("?", "");
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_101)
            {
                decodedStr = Encoding.GetEncoding(28592).GetString(input);
                byte[] tempT9est = Encoding.GetEncoding(1250).GetBytes(decodedStr);
                decodedStr = Encoding.GetEncoding(1250).GetString(tempT9est);
                return decodedStr = decodedStr.Replace("?", "");
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_109)
            {
                return decodedStr = Encoding.GetEncoding(28593).GetString(input);
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_110)
            {
                //decodedStr = Encoding.GetEncoding(1250).GetString(input);
                //byte[] tempT9est = Encoding.GetEncoding(28594).GetBytes(decodedStr);
                //decodedStr = Encoding.GetEncoding(28594).GetString(tempT9est);

                decodedStr = Encoding.GetEncoding(28594).GetString(input);
                return decodedStr = new string(decodedStr.Where(c => !char.IsControl(c)).ToArray());
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_148)
            {
                decodedStr = Encoding.GetEncoding(28599).GetString(input);
                return decodedStr = new string(decodedStr.Where(c => !char.IsControl(c)).ToArray());

                //decodedStr = Encoding.GetEncoding(28599).GetString(input);
                //byte[] tempT9est = Encoding.GetEncoding(1250).GetBytes(decodedStr);
                //decodedStr = Encoding.GetEncoding(1250).GetString(tempT9est);
                //return decodedStr = decodedStr.Replace("?", "");

            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_126)
            {
                decodedStr = Encoding.GetEncoding(28597).GetString(input);
                decodedStr = new string(decodedStr.Where(c => !char.IsControl(c)).ToArray());

                return decodedStr;

                //decodedStr = Encoding.GetEncoding(28597).GetString(input);
                //byte[] tempT9est = Encoding.GetEncoding(1253).GetBytes(decodedStr);  
                //decodedStr = Encoding.GetEncoding(1253).GetString(tempT9est);
                //return decodedStr = decodedStr.Replace("?", "");
            }
            else if (CurNLS == NLSConstants.DCM_NLS_ISO_IR_166)
            {
                decodedStr = Encoding.GetEncoding(28597).GetString(input);
                decodedStr = new string(decodedStr.Where(c => !char.IsControl(c)).ToArray());

                return decodedStr;

                //decodedStr = Encoding.GetEncoding(874).GetString(input);       //타이어 좀 이상함
                //byte[] tempT9est = Encoding.GetEncoding(1258).GetBytes(decodedStr);  
                //decodedStr = Encoding.GetEncoding(1258).GetString(tempT9est);
                //return decodedStr = decodedStr.Replace("?", "");
            }

            return decodedStr;
        }
    }
}