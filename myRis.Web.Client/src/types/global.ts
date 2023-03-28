// [Storage Key]
export const storageKeyCurUser = "myRisCurUserInfo";
export const storageKeySignInInfo = "myRisSignInInfo";
export const storageKeyClientLanguage = "myRisClientLanguage";

export const searchSpsStartDuration = "searchSpsStartDuration";

export function getSupportModalities(NeedWildCard: boolean): string[] {
  if (NeedWildCard) {
    return ["*", "DX", "CR", "DR", "CT", "MR", "MG", "IO"];
  }

  return ["DX", "CR", "DR", "CT", "MR", "MG", "IO"];
}
