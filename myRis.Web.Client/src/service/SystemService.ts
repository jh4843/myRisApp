import http from "@/service/http-common";

import { AxiosResponse } from "axios";
import * as myTypes from "@/types";

const baseSystemApiUrl = "/api/sys";

class SystemService {
  GetSysInfo(): Promise<AxiosResponse<myTypes.ISysGetSystemInfoResponse>> {
    const url = baseSystemApiUrl + "/get-sys-info";

    return http.get(url, {
      params: {
        is_strict_condition: false,
      },
    });
  }
}

export default new SystemService();
