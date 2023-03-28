export const ProtocolConvertDbToDisplay = (protocolList: string): string => {
  const displayProtocol = protocolList.replace("||", ",");

  return displayProtocol;
};

export const ProtocolConvertDisplayToDb = (protocolList: string): string => {
  const dbProtocol = protocolList.replace(",", "||");

  return dbProtocol;
};
