// Ex) VXvue: 1.3.6.1.4.1.19179.1, VXvue IO : 1.3.6.1.4.1.19179.8
import "../../helpers";

export const myRisWebUidPrefix = "1.3.6.1.4.1.19179.20"; // VIEWORKS: 1.3.6.1.4.1.19179, myRis Web: 20

export enum eIdType {
  idAccNo = "1",
  idRp = "2",
  idStudyUID = "3",
}

export const generateAccNumber = (seqNo: number): string => {
  const CurDate = new Date();

  const year = ("0000" + CurDate.getFullYear()).slice(-4); // Length: 4
  const month = ("0" + (CurDate.getMonth() + 1)).slice(-2); // Length: 2
  const day = ("0" + CurDate.getDate()).slice(-2); // Length: 2

  const hour = ("0" + CurDate.getHours()).slice(-2); // Length: 2
  const min = ("0" + CurDate.getMinutes()).slice(-2); // Length: 2

  const seq = ("0000" + seqNo).slice(-4); // Length: 4

  const res: string = `${year}${month}${day}${hour}${min}${seq}`; // Total: 16

  return res;
};

export const generateRpID = (seqNo: number): string => {
  const CurDate = new Date();

  const year = ("0000" + CurDate.getFullYear()).slice(-4); // Length: 4
  const month = ("0" + (CurDate.getMonth() + 1)).slice(-2); // Length: 2
  const day = ("0" + CurDate.getDate()).slice(-2); // Length: 2

  const type = eIdType.idRp; // Length: 1
  const seq = ("0000" + seqNo).slice(-4); // Length: 4

  const res: string = `${year}${month}${day}${type}${seq}`; // Total: 16

  return res;
};

export const generateStudyInstanceUID = (seqNo: number): string => {
  const CurDate = new Date();

  const year = ("0000" + CurDate.getFullYear()).slice(-4);
  const month = ("0" + (CurDate.getMonth() + 1)).slice(-2);
  const day = ("0" + CurDate.getDate()).slice(-2);
  const hour = ("0" + CurDate.getHours()).slice(-2);
  const min = ("0" + CurDate.getMinutes()).slice(-2);

  const strDate: string = `${year}${month}${day}${hour}${min}`;
  const uidType: string = eIdType.idStudyUID;
  const rand: string = Math.floor(Math.random() * 89999 + 10000).toString();
  const seq: string = seqNo.toString(); // TODO: Get From DB

  const res: string = [myRisWebUidPrefix, strDate, uidType, rand, seq].join(
    "."
  );

  return res;
};

export const generateBodyPartCodeValue = (seqNo: number): string => {
  if (seqNo == undefined || seqNo < 0) {
    return "";
  }

  const filledSeq = seqNo.fillPadStart(4, 0).toString();

  const res: string = `PC-B${filledSeq}`;

  return res;
};
