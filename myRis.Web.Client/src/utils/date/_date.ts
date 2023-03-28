import { format } from "date-fns";
import * as myUtils from "../../../../myRis.Web.Common/utils";

export const getInputLocaleDateFormatString = (): string => {
  return "yyyy. MM. dd";
};

export const getInputLocaleDateTimeFormatString = (): string => {
  return "yyyy. MM. dd HH:mm";
};

export const getLocaleDateFormatString = (): string => {
  const formats = {
    "af-ZA": "yyyy/MM/dd",
    "am-ET": "d/M/yyyy",
    "ar-AE": "dd/MM/yyyy",
    "ar-BH": "dd/MM/yyyy",
    "ar-DZ": "dd-MM-yyyy",
    "ar-EG": "dd/MM/yyyy",
    "ar-IQ": "dd/MM/yyyy",
    "ar-JO": "dd/MM/yyyy",
    "ar-KW": "dd/MM/yyyy",
    "ar-LB": "dd/MM/yyyy",
    "ar-LY": "dd/MM/yyyy",
    "ar-MA": "dd-MM-yyyy",
    "ar-OM": "dd/MM/yyyy",
    "ar-QA": "dd/MM/yyyy",
    "ar-SA": "dd/MM/yy",
    "ar-SY": "dd/MM/yyyy",
    "ar-TN": "dd-MM-yyyy",
    "ar-YE": "dd/MM/yyyy",
    "arn-CL": "dd-MM-yyyy",
    "as-IN": "dd-MM-yyyy",
    "az-Cyrl-AZ": "dd.MM.yyyy",
    "az-Latn-AZ": "dd.MM.yyyy",
    "ba-RU": "dd.MM.yy",
    "be-BY": "dd.MM.yyyy",
    "bg-BG": "dd.M.yyyy",
    "bn-BD": "dd-MM-yy",
    "bn-IN": "dd-MM-yy",
    "bo-CN": "yyyy/M/d",
    "br-FR": "dd/MM/yyyy",
    "bs-Cyrl-BA": "d.M.yyyy",
    "bs-Latn-BA": "d.M.yyyy",
    "ca-ES": "dd/MM/yyyy",
    "co-FR": "dd/MM/yyyy",
    "cs-CZ": "d.M.yyyy",
    "cy-GB": "dd/MM/yyyy",
    "da-DK": "dd-MM-yyyy",
    "de-AT": "dd.MM.yyyy",
    "de-CH": "dd.MM.yyyy",
    "de-DE": "dd.MM.yyyy",
    "de-LI": "dd.MM.yyyy",
    "de-LU": "dd.MM.yyyy",
    "dsb-DE": "d. M. yyyy",
    "dv-MV": "dd/MM/yy",
    "el-GR": "d/M/yyyy",
    "en-029": "MM/dd/yyyy",
    "en-AU": "d/MM/yyyy",
    "en-BZ": "dd/MM/yyyy",
    "en-CA": "dd/MM/yyyy",
    "en-GB": "dd/MM/yyyy",
    "en-IE": "dd/MM/yyyy",
    "en-IN": "dd-MM-yyyy",
    "en-JM": "dd/MM/yyyy",
    "en-MY": "d/M/yyyy",
    "en-NZ": "d/MM/yyyy",
    "en-PH": "M/d/yyyy",
    "en-SG": "d/M/yyyy",
    "en-TT": "dd/MM/yyyy",
    "en-US": "M/d/yyyy",
    "en-ZA": "yyyy/MM/dd",
    "en-ZW": "M/d/yyyy",
    "es-AR": "dd/MM/yyyy",
    "es-BO": "dd/MM/yyyy",
    "es-CL": "dd-MM-yyyy",
    "es-CO": "dd/MM/yyyy",
    "es-CR": "dd/MM/yyyy",
    "es-DO": "dd/MM/yyyy",
    "es-EC": "dd/MM/yyyy",
    "es-ES": "dd/MM/yyyy",
    "es-GT": "dd/MM/yyyy",
    "es-HN": "dd/MM/yyyy",
    "es-MX": "dd/MM/yyyy",
    "es-NI": "dd/MM/yyyy",
    "es-PA": "MM/dd/yyyy",
    "es-PE": "dd/MM/yyyy",
    "es-PR": "dd/MM/yyyy",
    "es-PY": "dd/MM/yyyy",
    "es-SV": "dd/MM/yyyy",
    "es-US": "M/d/yyyy",
    "es-UY": "dd/MM/yyyy",
    "es-VE": "dd/MM/yyyy",
    "et-EE": "d.MM.yyyy",
    "eu-ES": "yyyy/MM/dd",
    "fa-IR": "MM/dd/yyyy",
    "fi-FI": "d.M.yyyy",
    "fil-PH": "M/d/yyyy",
    "fo-FO": "dd-MM-yyyy",
    "fr-BE": "d/MM/yyyy",
    "fr-CA": "yyyy-MM-dd",
    "fr-CH": "dd.MM.yyyy",
    "fr-FR": "dd/MM/yyyy",
    "fr-LU": "dd/MM/yyyy",
    "fr-MC": "dd/MM/yyyy",
    "fy-NL": "d-M-yyyy",
    "ga-IE": "dd/MM/yyyy",
    "gd-GB": "dd/MM/yyyy",
    "gl-ES": "dd/MM/yy",
    "gsw-FR": "dd/MM/yyyy",
    "gu-IN": "dd-MM-yy",
    "ha-Latn-NG": "d/M/yyyy",
    "he-IL": "dd/MM/yyyy",
    "hi-IN": "dd-MM-yyyy",
    "hr-BA": "d.M.yyyy.",
    "hr-HR": "d.M.yyyy",
    "hsb-DE": "d. M. yyyy",
    "hu-HU": "yyyy. MM. dd.",
    "hy-AM": "dd.MM.yyyy",
    "id-ID": "dd/MM/yyyy",
    "ig-NG": "d/M/yyyy",
    "ii-CN": "yyyy/M/d",
    "is-IS": "d.M.yyyy",
    "it-CH": "dd.MM.yyyy",
    "it-IT": "dd/MM/yyyy",
    "iu-Cans-CA": "d/M/yyyy",
    "iu-Latn-CA": "d/MM/yyyy",
    "ja-JP": "yyyy/MM/dd",
    "ka-GE": "dd.MM.yyyy",
    "kk-KZ": "dd.MM.yyyy",
    "kl-GL": "dd-MM-yyyy",
    "km-KH": "yyyy-MM-dd",
    "kn-IN": "dd-MM-yy",
    "ko-KR": "yyyy. MM. dd",
    "kok-IN": "dd-MM-yyyy",
    "ky-KG": "dd.MM.yy",
    "lb-LU": "dd/MM/yyyy",
    "lo-LA": "dd/MM/yyyy",
    "lt-LT": "yyyy.MM.dd",
    "lv-LV": "yyyy.MM.dd.",
    "mi-NZ": "dd/MM/yyyy",
    "mk-MK": "dd.MM.yyyy",
    "ml-IN": "dd-MM-yy",
    "mn-MN": "yy.MM.dd",
    "mn-Mong-CN": "yyyy/M/d",
    "moh-CA": "M/d/yyyy",
    "mr-IN": "dd-MM-yyyy",
    "ms-BN": "dd/MM/yyyy",
    "ms-MY": "dd/MM/yyyy",
    "mt-MT": "dd/MM/yyyy",
    "nb-NO": "dd.MM.yyyy",
    "ne-NP": "M/d/yyyy",
    "nl-BE": "d/MM/yyyy",
    "nl-NL": "d-M-yyyy",
    "nn-NO": "dd.MM.yyyy",
    "nso-ZA": "yyyy/MM/dd",
    "oc-FR": "dd/MM/yyyy",
    "or-IN": "dd-MM-yy",
    "pa-IN": "dd-MM-yy",
    "pl-PL": "dd.MM.yyyy",
    pl: "dd.MM.yyyy",
    "prs-AF": "dd/MM/yy",
    "ps-AF": "dd/MM/yy",
    "pt-BR": "d/M/yyyy",
    "pt-PT": "dd-MM-yyyy",
    "qut-GT": "dd/MM/yyyy",
    "quz-BO": "dd/MM/yyyy",
    "quz-EC": "dd/MM/yyyy",
    "quz-PE": "dd/MM/yyyy",
    "rm-CH": "dd/MM/yyyy",
    "ro-RO": "dd.MM.yyyy",
    "ru-RU": "dd.MM.yyyy",
    "rw-RW": "M/d/yyyy",
    "sa-IN": "dd-MM-yyyy",
    "sah-RU": "MM.dd.yyyy",
    "se-FI": "d.M.yyyy",
    "se-NO": "dd.MM.yyyy",
    "se-SE": "yyyy-MM-dd",
    "si-LK": "yyyy-MM-dd",
    "sk-SK": "d. M. yyyy",
    "sl-SI": "d.M.yyyy",
    "sma-NO": "dd.MM.yyyy",
    "sma-SE": "yyyy-MM-dd",
    "smj-NO": "dd.MM.yyyy",
    "smj-SE": "yyyy-MM-dd",
    "smn-FI": "d.M.yyyy",
    "sms-FI": "d.M.yyyy",
    "sq-AL": "yyyy-MM-dd",
    "sr-Cyrl-BA": "d.M.yyyy",
    "sr-Cyrl-CS": "d.M.yyyy",
    "sr-Cyrl-ME": "d.M.yyyy",
    "sr-Cyrl-RS": "d.M.yyyy",
    "sr-Latn-BA": "d.M.yyyy",
    "sr-Latn-CS": "d.M.yyyy",
    "sr-Latn-ME": "d.M.yyyy",
    "sr-Latn-RS": "d.M.yyyy",
    "sv-FI": "d.M.yyyy",
    "sv-SE": "yyyy-MM-dd",
    "sw-KE": "M/d/yyyy",
    "syr-SY": "dd/MM/yyyy",
    "ta-IN": "dd-MM-yyyy",
    "te-IN": "dd-MM-yy",
    "tg-Cyrl-TJ": "dd.MM.yy",
    "th-TH": "d/M/yyyy",
    "tk-TM": "dd.MM.yy",
    "tn-ZA": "yyyy/MM/dd",
    "tr-TR": "dd.MM.yyyy",
    "tt-RU": "dd.MM.yyyy",
    "tzm-Latn-DZ": "dd-MM-yyyy",
    "ug-CN": "yyyy-M-d",
    "uk-UA": "dd.MM.yyyy",
    "ur-PK": "dd/MM/yyyy",
    "uz-Cyrl-UZ": "dd.MM.yyyy",
    "uz-Latn-UZ": "dd/MM yyyy",
    "vi-VN": "dd/MM/yyyy",
    "wo-SN": "dd/MM/yyyy",
    "xh-ZA": "yyyy/MM/dd",
    "yo-NG": "d/M/yyyy",
    "zh-CN": "yyyy/M/d",
    "zh-HK": "d/M/yyyy",
    "zh-MO": "d/M/yyyy",
    "zh-SG": "d/M/yyyy",
    "zh-TW": "yyyy/M/d",
    "zu-ZA": "yyyy/MM/dd",
  };

  return formats[navigator.language] || "dd/MM/yyyy";
};

export const getLocaleDateTimeFormatString = (): string => {
  const formats = {
    "af-ZA": "yyyy/MM/dd HH:mm",
    "am-ET": "d/M/yyyy HH:mm",
    "ar-AE": "dd/MM/yyyy HH:mm",
    "ar-BH": "dd/MM/yyyy HH:mm",
    "ar-DZ": "dd-MM-yyyy HH:mm",
    "ar-EG": "dd/MM/yyyy HH:mm",
    "ar-IQ": "dd/MM/yyyy HH:mm",
    "ar-JO": "dd/MM/yyyy HH:mm",
    "ar-KW": "dd/MM/yyyy HH:mm",
    "ar-LB": "dd/MM/yyyy HH:mm",
    "ar-LY": "dd/MM/yyyy HH:mm",
    "ar-MA": "dd-MM-yyyy HH:mm",
    "ar-OM": "dd/MM/yyyy HH:mm",
    "ar-QA": "dd/MM/yyyy HH:mm",
    "ar-SA": "dd/MM/yy HH:mm",
    "ar-SY": "dd/MM/yyyy HH:mm",
    "ar-TN": "dd-MM-yyyy HH:mm",
    "ar-YE": "dd/MM/yyyy HH:mm",
    "arn-CL": "dd-MM-yyyy HH:mm",
    "as-IN": "dd-MM-yyyy HH:mm",
    "az-Cyrl-AZ": "dd.MM.yyyy HH:mm",
    "az-Latn-AZ": "dd.MM.yyyy HH:mm",
    "ba-RU": "dd.MM.yy HH:mm",
    "be-BY": "dd.MM.yyyy HH:mm",
    "bg-BG": "dd.M.yyyy HH:mm",
    "bn-BD": "dd-MM-yy HH:mm",
    "bn-IN": "dd-MM-yy HH:mm",
    "bo-CN": "yyyy/M/d HH:mm",
    "br-FR": "dd/MM/yyyy HH:mm",
    "bs-Cyrl-BA": "d.M.yyyy HH:mm",
    "bs-Latn-BA": "d.M.yyyy HH:mm",
    "ca-ES": "dd/MM/yyyy HH:mm",
    "co-FR": "dd/MM/yyyy HH:mm",
    "cs-CZ": "d.M.yyyy HH:mm",
    "cy-GB": "dd/MM/yyyy HH:mm",
    "da-DK": "dd-MM-yyyy HH:mm",
    "de-AT": "dd.MM.yyyy HH:mm",
    "de-CH": "dd.MM.yyyy HH:mm",
    "de-DE": "dd.MM.yyyy HH:mm",
    "de-LI": "dd.MM.yyyy HH:mm",
    "de-LU": "dd.MM.yyyy HH:mm",
    "dsb-DE": "d. M. yyyy HH:mm",
    "dv-MV": "dd/MM/yy HH:mm",
    "el-GR": "d/M/yyyy HH:mm",
    "en-029": "MM/dd/yyyy HH:mm",
    "en-AU": "d/MM/yyyy HH:mm",
    "en-BZ": "dd/MM/yyyy HH:mm",
    "en-CA": "dd/MM/yyyy HH:mm",
    "en-GB": "dd/MM/yyyy HH:mm",
    "en-IE": "dd/MM/yyyy HH:mm",
    "en-IN": "dd-MM-yyyy HH:mm",
    "en-JM": "dd/MM/yyyy HH:mm",
    "en-MY": "d/M/yyyy HH:mm",
    "en-NZ": "d/MM/yyyy HH:mm",
    "en-PH": "M/d/yyyy HH:mm",
    "en-SG": "d/M/yyyy HH:mm",
    "en-TT": "dd/MM/yyyy HH:mm",
    "en-US": "M/d/yyyy HH:mm",
    "en-ZA": "yyyy/MM/dd HH:mm",
    "en-ZW": "M/d/yyyy HH:mm",
    "es-AR": "dd/MM/yyyy HH:mm",
    "es-BO": "dd/MM/yyyy HH:mm",
    "es-CL": "dd-MM-yyyy HH:mm",
    "es-CO": "dd/MM/yyyy HH:mm",
    "es-CR": "dd/MM/yyyy HH:mm",
    "es-DO": "dd/MM/yyyy HH:mm",
    "es-EC": "dd/MM/yyyy HH:mm",
    "es-ES": "dd/MM/yyyy HH:mm",
    "es-GT": "dd/MM/yyyy HH:mm",
    "es-HN": "dd/MM/yyyy HH:mm",
    "es-MX": "dd/MM/yyyy HH:mm",
    "es-NI": "dd/MM/yyyy HH:mm",
    "es-PA": "MM/dd/yyyy HH:mm",
    "es-PE": "dd/MM/yyyy HH:mm",
    "es-PR": "dd/MM/yyyy HH:mm",
    "es-PY": "dd/MM/yyyy HH:mm",
    "es-SV": "dd/MM/yyyy HH:mm",
    "es-US": "M/d/yyyy HH:mm",
    "es-UY": "dd/MM/yyyy HH:mm",
    "es-VE": "dd/MM/yyyy HH:mm",
    "et-EE": "d.MM.yyyy HH:mm",
    "eu-ES": "yyyy/MM/dd HH:mm",
    "fa-IR": "MM/dd/yyyy HH:mm",
    "fi-FI": "d.M.yyyy HH:mm",
    "fil-PH": "M/d/yyyy HH:mm",
    "fo-FO": "dd-MM-yyyy HH:mm",
    "fr-BE": "d/MM/yyyy HH:mm",
    "fr-CA": "yyyy-MM-dd HH:mm",
    "fr-CH": "dd.MM.yyyy HH:mm",
    "fr-FR": "dd/MM/yyyy HH:mm",
    "fr-LU": "dd/MM/yyyy HH:mm",
    "fr-MC": "dd/MM/yyyy HH:mm",
    "fy-NL": "d-M-yyyy HH:mm",
    "ga-IE": "dd/MM/yyyy HH:mm",
    "gd-GB": "dd/MM/yyyy HH:mm",
    "gl-ES": "dd/MM/yy HH:mm",
    "gsw-FR": "dd/MM/yyyy HH:mm",
    "gu-IN": "dd-MM-yy HH:mm",
    "ha-Latn-NG": "d/M/yyyy HH:mm",
    "he-IL": "dd/MM/yyyy HH:mm",
    "hi-IN": "dd-MM-yyyy HH:mm",
    "hr-BA": "d.M.yyyy. HH:mm",
    "hr-HR": "d.M.yyyy HH:mm",
    "hsb-DE": "d. M. yyyy HH:mm",
    "hu-HU": "yyyy. MM. dd. HH:mm",
    "hy-AM": "dd.MM.yyyy HH:mm",
    "id-ID": "dd/MM/yyyy HH:mm",
    "ig-NG": "d/M/yyyy HH:mm",
    "ii-CN": "yyyy/M/d HH:mm",
    "is-IS": "d.M.yyyy HH:mm",
    "it-CH": "dd.MM.yyyy HH:mm",
    "it-IT": "dd/MM/yyyy HH:mm",
    "iu-Cans-CA": "d/M/yyyy HH:mm",
    "iu-Latn-CA": "d/MM/yyyy HH:mm",
    "ja-JP": "yyyy/MM/dd HH:mm",
    "ka-GE": "dd.MM.yyyy HH:mm",
    "kk-KZ": "dd.MM.yyyy HH:mm",
    "kl-GL": "dd-MM-yyyy HH:mm",
    "km-KH": "yyyy-MM-dd HH:mm",
    "kn-IN": "dd-MM-yy HH:mm",
    "ko-KR": "yyyy. MM. dd HH:mm",
    "kok-IN": "dd-MM-yyyy HH:mm",
    "ky-KG": "dd.MM.yy HH:mm",
    "lb-LU": "dd/MM/yyyy HH:mm",
    "lo-LA": "dd/MM/yyyy HH:mm",
    "lt-LT": "yyyy.MM.dd HH:mm",
    "lv-LV": "yyyy.MM.dd. HH:mm",
    "mi-NZ": "dd/MM/yyyy HH:mm",
    "mk-MK": "dd.MM.yyyy HH:mm",
    "ml-IN": "dd-MM-yy HH:mm",
    "mn-MN": "yy.MM.dd HH:mm",
    "mn-Mong-CN": "yyyy/M/d HH:mm",
    "moh-CA": "M/d/yyyy HH:mm",
    "mr-IN": "dd-MM-yyyy HH:mm",
    "ms-BN": "dd/MM/yyyy HH:mm",
    "ms-MY": "dd/MM/yyyy HH:mm",
    "mt-MT": "dd/MM/yyyy HH:mm",
    "nb-NO": "dd.MM.yyyy HH:mm",
    "ne-NP": "M/d/yyyy HH:mm",
    "nl-BE": "d/MM/yyyy HH:mm",
    "nl-NL": "d-M-yyyy HH:mm",
    "nn-NO": "dd.MM.yyyy HH:mm",
    "nso-ZA": "yyyy/MM/dd HH:mm",
    "oc-FR": "dd/MM/yyyy HH:mm",
    "or-IN": "dd-MM-yy HH:mm",
    "pa-IN": "dd-MM-yy HH:mm",
    "pl-PL": "dd.MM.yyyy HH:mm",
    pl: "dd.MM.yyyy HH:mm",
    "prs-AF": "dd/MM/yy HH:mm",
    "ps-AF": "dd/MM/yy HH:mm",
    "pt-BR": "d/M/yyyy HH:mm",
    "pt-PT": "dd-MM-yyyy HH:mm",
    "qut-GT": "dd/MM/yyyy HH:mm",
    "quz-BO": "dd/MM/yyyy HH:mm",
    "quz-EC": "dd/MM/yyyy HH:mm",
    "quz-PE": "dd/MM/yyyy HH:mm",
    "rm-CH": "dd/MM/yyyy HH:mm",
    "ro-RO": "dd.MM.yyyy HH:mm",
    "ru-RU": "dd.MM.yyyy HH:mm",
    "rw-RW": "M/d/yyyy HH:mm",
    "sa-IN": "dd-MM-yyyy HH:mm",
    "sah-RU": "MM.dd.yyyy HH:mm",
    "se-FI": "d.M.yyyy HH:mm",
    "se-NO": "dd.MM.yyyy HH:mm",
    "se-SE": "yyyy-MM-dd HH:mm",
    "si-LK": "yyyy-MM-dd HH:mm",
    "sk-SK": "d. M. yyyy HH:mm",
    "sl-SI": "d.M.yyyy HH:mm",
    "sma-NO": "dd.MM.yyyy HH:mm",
    "sma-SE": "yyyy-MM-dd HH:mm",
    "smj-NO": "dd.MM.yyyy HH:mm",
    "smj-SE": "yyyy-MM-dd HH:mm",
    "smn-FI": "d.M.yyyy HH:mm",
    "sms-FI": "d.M.yyyy HH:mm",
    "sq-AL": "yyyy-MM-dd HH:mm",
    "sr-Cyrl-BA": "d.M.yyyy HH:mm",
    "sr-Cyrl-CS": "d.M.yyyy HH:mm",
    "sr-Cyrl-ME": "d.M.yyyy HH:mm",
    "sr-Cyrl-RS": "d.M.yyyy HH:mm",
    "sr-Latn-BA": "d.M.yyyy HH:mm",
    "sr-Latn-CS": "d.M.yyyy HH:mm",
    "sr-Latn-ME": "d.M.yyyy HH:mm",
    "sr-Latn-RS": "d.M.yyyy HH:mm",
    "sv-FI": "d.M.yyyy HH:mm",
    "sv-SE": "yyyy-MM-dd HH:mm",
    "sw-KE": "M/d/yyyy HH:mm",
    "syr-SY": "dd/MM/yyyy HH:mm",
    "ta-IN": "dd-MM-yyyy HH:mm",
    "te-IN": "dd-MM-yy HH:mm",
    "tg-Cyrl-TJ": "dd.MM.yy HH:mm",
    "th-TH": "d/M/yyyy HH:mm",
    "tk-TM": "dd.MM.yy HH:mm",
    "tn-ZA": "yyyy/MM/dd HH:mm",
    "tr-TR": "dd.MM.yyyy HH:mm",
    "tt-RU": "dd.MM.yyyy HH:mm",
    "tzm-Latn-DZ": "dd-MM-yyyy HH:mm",
    "ug-CN": "yyyy-M-d HH:mm",
    "uk-UA": "dd.MM.yyyy HH:mm",
    "ur-PK": "dd/MM/yyyy HH:mm",
    "uz-Cyrl-UZ": "dd.MM.yyyy HH:mm",
    "uz-Latn-UZ": "dd/MM yyyy HH:mm",
    "vi-VN": "dd/MM/yyyy HH:mm",
    "wo-SN": "dd/MM/yyyy HH:mm",
    "xh-ZA": "yyyy/MM/dd HH:mm",
    "yo-NG": "d/M/yyyy HH:mm",
    "zh-CN": "yyyy/M/d HH:mm",
    "zh-HK": "d/M/yyyy HH:mm",
    "zh-MO": "d/M/yyyy HH:mm",
    "zh-SG": "d/M/yyyy HH:mm",
    "zh-TW": "yyyy/M/d HH:mm",
    "zu-ZA": "yyyy/MM/dd HH:mm",
  };

  return formats[navigator.language] || "dd/MM/yyyy HH:mm";
};

export const isValidDateString = (dateString: string): boolean => {
  let isValid = false;

  if (dateString == undefined) return false;

  try {
    const date = new Date(dateString);

    if (Object.prototype.toString.call(date) === "[object Date]") {
      if (isNaN(date.getTime())) {
        // Date is unreal.
        return false;
      } else {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if (year < 1800) return false;

        if (month < 1 || month > 12) return false;

        if (day < 1 || day > 31) return false;

        isValid = true;
      }
    } else {
      isValid = false;
    }
  } catch (e) {
    return false;
  }

  return isValid;
};

export const GetInputLocaleDateFormatFromString = (
  dateString: string
): string => {
  if (dateString == undefined) return "";

  const initDate = new Date(myUtils.initDateString);

  if (!isValidDateString(dateString)) return "";

  const date = new Date(dateString);

  if (date <= initDate) {
    return "";
  }

  return GetInputLocaleDateFormatFromDate(date);
};

export const GetInputLocaleDateFormatFromDate = (date: Date): string => {
  //let res = "";
  if (date == undefined) return "";

  const dateUtc = new Date(date);
  const initDate = new Date(myUtils.initDateString);

  if (isNaN(dateUtc.getTime())) {
    console.log("Invalid Date");
    return "";
  }

  if (dateUtc <= initDate) {
    console.log("Date is too old: ", dateUtc);
    return "";
  }

  return format(dateUtc, getInputLocaleDateFormatString());
};

export const GetInputLocaleDateTimeFormatFromString = (
  dttm: string | undefined
): string | undefined => {
  if (dttm == undefined) return undefined;

  let res: string | undefined = "";

  const initDate = new Date(myUtils.initDateString);

  if (!isValidDateString(dttm)) return "";

  const date = new Date(dttm);

  if (date <= initDate) {
    return undefined;
  }

  res = GetInputLocaleDateTimeFormatFromDate(date);

  return res;
};

export const GetInputLocaleDateTimeFormatFromDate = (
  date: Date | undefined
): string | undefined => {
  if (date == undefined) return undefined;

  const dateUtc = new Date(date);
  const initDate = new Date(myUtils.initDateString);

  if (isNaN(dateUtc.getTime())) {
    console.log("Invalid Date");
    return "";
  }

  if (dateUtc <= initDate) {
    console.log("Date is too old: ", dateUtc);
    return "";
  }

  //const res = format(dateUtc, getLocaleDateTimeFormatString());
  const res = format(dateUtc, getInputLocaleDateTimeFormatString());

  return res;
};
