export enum eMsgBoxMsgType {
  MsgTypeNone = 0,
  MsgTypeInfo,
  MsgTypeError,
  MsgTypeWarn,
  MsgTypeCheck,
}

export enum eMsgBoxResType {
  None = 0,
  Ok = 1 << 0, // 0001
  Cancel = 1 << 1, //0010
}

export enum eMsgBoxRes {
  ResNone = 0,
  ResIng,
  ResOk,
  ResCancel,
}

export interface IMessageBox {
  isShow: boolean;
  title: string;
  msgType: eMsgBoxMsgType;
  resType: eMsgBoxResType;
  style: string;

  msg: string;
  res: eMsgBoxRes;
}
