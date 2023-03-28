export type tDateFormat = "YYYYMMDD" | "DDMMYYYY" | "MMDDYYYY";
export type tTimeFormat = "HHMMSS" | "HHMM";

export const ConvertDateTimeForDbFromUtc = (utcDttm: Date): string => {
  return new Date(utcDttm || "").toISOString().slice(0, 19).replace("T", " ");
};

export const ConvertDateForDbFromUtc = (date: Date): string => {
  const dateUtc = new Date(date);
  const timezoneOffset = dateUtc.getTimezoneOffset() * 60000;
  const dateOnly = new Date(dateUtc.getTime() - timezoneOffset);

  return ConvertDateTimeForDbFromUtc(dateOnly);
};

export const addDay = (curDay: Date, days: number): Date => {
  const date = new Date(curDay);
  date.setDate(date.getDate() + days);
  return date;
};

export const addMonth = (curDay: Date, months: number): Date => {
  const date = new Date(curDay);
  date.setMonth(date.getMonth() + months);
  return date;
};

export const applyTimeZone = (date: Date | undefined): Date | undefined => {
  if (date == undefined) return undefined;

  const beforeDate = new Date(date);

  const timezoneOffset = beforeDate.getTimezoneOffset() * 60000;
  const resDate = new Date(beforeDate.getTime() - timezoneOffset);

  return resDate;
};

export const applyTimeZoneFromString = (date: string | undefined): Date | undefined => {
  if (date == undefined) return undefined;

  return applyTimeZone(new Date(date));
};

export const GetDate = (date: Date, dateFormat: tDateFormat, seperator: string): string => {
  let res: string = "";

  const year = ("0000" + date.getFullYear()).slice(-4);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  switch (dateFormat) {
    case "YYYYMMDD":
      res = [year, month, day].join(seperator);
      break;
    case "DDMMYYYY":
      res = [day, month, year].join(seperator);
      break;
    case "MMDDYYYY":
      res = [month, day, year].join(seperator);
      break;
    default:
      return "";
  }

  return res;
};

export const GetTime = (date: Date, timeFormat: tTimeFormat, seperator: string): string => {
  let res: string = "";

  const hour = ("0" + date.getHours()).slice(-2);
  const min = ("0" + date.getMinutes()).slice(-2);
  const sec = ("0" + date.getSeconds()).slice(-2);

  switch (timeFormat) {
    case "HHMMSS":
      res = [hour, min, sec].join(seperator);
      break;
    case "HHMM":
      res = [hour, min].join(seperator);
      break;
    default:
      return "";
  }

  return res;
};

export const GetDttm = (
  date: Date,
  dateFormat: tDateFormat,
  timeFormat: tTimeFormat,
  sepDate: string,
  sepTime: string,
  sepDttm: string
): string => {
  let res: string = "";

  let strDate: string = GetDate(date, dateFormat, sepDate);
  let strTime: string = GetTime(date, timeFormat, sepTime);

  res = [strDate, strTime].join(sepDttm);

  return res;
};
