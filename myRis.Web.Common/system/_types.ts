export enum eLicenseType {
  Invalid = 0,
  Human,
  Veterinary,
  Demo,
}

export function parseLicenseType(licenseType: eLicenseType): string {
  return eLicenseType[licenseType] || "";
}

export function reverseLicenseType(licenseType: string): eLicenseType {
  return eLicenseType[licenseType] || eLicenseType.Invalid;
}

export enum eLocales {
  EN = "en",
  KR = "kr",
}

export function parseLocales(locale: eLocales): string {
  return eLocales[locale] || "";
}

export function reverseLocales(locale: string): eLocales {
  const res = eLocales[locale.toString()] || eLocales.EN;
  return res;
}

export const LOCALES = [
  { value: eLocales.EN, caption: "English" },
  { value: eLocales.KR, caption: "Korean" },
];

export function getLocaleCaption(locale: eLocales | string): string {
  let res = "English";

  for (let loc of LOCALES) {
    if (loc.value == locale) {
      res = loc.caption;
      break;
    }
  }

  return res;
}

export function getLocaleValue(caption: string): eLocales {
  let res = eLocales.EN;

  for (let loc of LOCALES) {
    if (loc.caption == caption) {
      res = loc.value;
      break;
    }
  }

  return res;
}

export interface IWebServerInfo {
  alias: string;
  version: string;
  language: string;
  license_type: eLicenseType;
  //
  host_name: string;
  port_no: number;
}
