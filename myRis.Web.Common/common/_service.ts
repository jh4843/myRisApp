// Service Error Code Range (10001 ~ 20000)
// Common: 10001 ~ 11000
// User: 11001 ~ 12000
// MWL: 12001 ~ 13000

export interface IServiceBaseRequest {
  reqPage?: number;
  reqCount?: number;
  is_strict_condition?: boolean;
}

export interface IServiceBaseResponse {
  result: boolean;
  err_code?: string | number;
}

export interface IServiceFailReason {
  code: number;
  desc: string;
}
