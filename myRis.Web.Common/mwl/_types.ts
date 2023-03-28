//////////////////////////////////////////////////////////////////
// Database Types
//////////////////////////////////////////////////////////////////

export type tPatientSex = "" | "Male" | "Female" | "Other";
// -1: None, 0: STAT,
//export type tOrdPriority = 0 | 1 | 2 | 3 | 4 | 5;

export enum eBodypartType {
  NONE = 0,
  HUMAN,
  VETERINARY,
  END,
}

export function reverseBodypartType(protType: string): eBodypartType {
  return eBodypartType[protType] || eBodypartType.NONE;
}

export function parseBodypartType(protType: eBodypartType): string {
  return eBodypartType[protType] || "";
}

export enum eBodypartSubType {
  NONE = 0,

  LARGE,
  SMALL,
  END,
}

export function reverseBodypartSubType(protSubType: string) {
  return eBodypartType[protSubType] || eBodypartType.NONE;
}

export function parseBodypartSubType(protSubType: eBodypartSubType) {
  return eBodypartSubType[protSubType] || "NONE";
}

export enum eProjectionSeqType {
  NONE = 0,
}

export enum eOrderPriority {
  NONE = 0,
  STAT,
  HIGH,
  ROUTINE,
  MEDIUM,
  LOW,
}

export function reversePriority(OrdPriority: string) {
  return eOrderPriority[OrdPriority] || eOrderPriority.NONE;
}

export function parsePriority(OrdPriority: eOrderPriority) {
  return eOrderPriority[OrdPriority] || "NONE";
}

export enum eOrderStatus {
  NONE = 0x00,
  ORDERED = 0x01,
  SCHEDULED,
  EXAMINED,
  MATCHED,
  //
  COMPLETED = 0x10,
  CANCELED = 0x20,
}

export function reverseOrderStatus(OrdState: string) {
  return eOrderStatus[OrdState] || eOrderStatus.NONE;
}

export function parseOrderStatus(OrdState: eOrderStatus) {
  return eOrderStatus[OrdState] || "NONE";
}

export enum eOrdReasonType {
  NONE = 0,
  CREATE,
  CANCEL,
}

export function reverseOrdReason(OrdReason: string) {
  return eOrdReasonType[OrdReason] || eOrdReasonType.CREATE;
}

export function parseOrdReason(OrdReason: eOrdReasonType) {
  return eOrdReasonType[OrdReason] || "CREATE";
}

export enum eSpeciesType {
  INVALID = 0,
  CANINE,
  FELINE,
  EQUINE,
  RABBIT,
  Etc = 15,
}

export let speciesDefaultCode = new Map<eSpeciesType, string>();
speciesDefaultCode.set(eSpeciesType.CANINE, "L-80700");
speciesDefaultCode.set(eSpeciesType.FELINE, "L-80A00");
speciesDefaultCode.set(eSpeciesType.EQUINE, "L-80400");
speciesDefaultCode.set(eSpeciesType.RABBIT, "L-86B02");

export function getSpeciesTypeList(): string[] {
  return [eSpeciesType[1], eSpeciesType[2], eSpeciesType[3], eSpeciesType[4]];
}

export function reverseSpeciesType(protType: string | undefined): eSpeciesType {

  if(protType == undefined) {
    return eSpeciesType.INVALID;
  }

  return eSpeciesType[protType] || eSpeciesType.INVALID;
}

export function parseSpeciesType(protType: eSpeciesType | undefined): string {

  if(protType == undefined)
    return "";

  return eSpeciesType[protType] || "";
}
