declare global {
  namespace NodeJS {
    interface Global {
      // Server Info
      curSrvIp: string;
      curSrvMac: string;
    }
  }
}

export default global;
