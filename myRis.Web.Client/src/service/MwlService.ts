import http from "@/service/http-common";

import { AxiosResponse } from "axios";

import * as myTypes from "@/types";

const baseMwlApiUrl = "/api/mwl";

class MwlService {
  // Get Functions
  GetWorklist(
    reqQuery: myTypes.IMwlGetWorklistQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetWorklistResponse>> {
    const url = baseMwlApiUrl + "/get-worklist";

    return http.get(url, {
      params: reqQuery,
    });
  }

  GetPatientList(
    reqQuery: myTypes.IMwlGetPatientListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetPatientListResponse>> {
    const url = baseMwlApiUrl + "/get-patient-list";

    return http.get(url, {
      params: {
        pt_key: reqQuery.pt_key,
        pt_name: reqQuery.pt_name,
        pt_id: reqQuery.pt_id,
      },
    });
  }

  GetOrderList(
    reqQuery: myTypes.IMwlGetOrderListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetOrderListResponse>> {
    const url = baseMwlApiUrl + "/get-order-list";

    return http.get(url, {
      params: {
        ord_key: reqQuery.ord_key,
        acc_num: reqQuery.acc_num,
        pt_name: reqQuery.pt_name,
        pt_id: reqQuery.pt_id,
        is_strict_condition: reqQuery.is_strict_condition,
      },
    });
  }

  GetSpsList(
    reqQuery: myTypes.IMwlGetSpsListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetSpsListResponse>> {
    const url = baseMwlApiUrl + "/get-sps-list";

    return http.get(url, {
      params: reqQuery,
    });
  }

  GetProcPlanList(
    reqQuery: myTypes.IMwlGetProcPlanListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetProcPlanListResponse>> {
    const url = baseMwlApiUrl + "/get-proc-plan-list";

    return http.get(url, {
      params: {
        proc_plan_id: reqQuery.proc_plan_id,
        proc_plan_desc: reqQuery.proc_plan_desc,

        is_strict_condition: reqQuery.is_strict_condition,
      },
    });
  }

  GetProtocolList(
    reqQuery: myTypes.IMwlGetProtocolListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetProtocolListResponse>> {
    const url = baseMwlApiUrl + "/get-protocol-list";

    return http.get(url, {
      params: reqQuery,
    });
  }

  GetBodypartList(
    reqQuery: myTypes.IMwlGetBodypartListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetBodypartListResponse>> {
    const url = baseMwlApiUrl + "/get-bodypart-list";

    return http.get(url, {
      params: reqQuery,
    });
  }

  GetStationList(
    reqQuery: myTypes.IMwlGetStationListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetStationListResponse>> {
    const url = baseMwlApiUrl + "/get-station-list";

    return http.get(url, {
      params: {
        station_ae_title: reqQuery.station_ae_title,
        station_name: reqQuery.station_name,
      },
    });
  }

  GetSpeciesList(
    reqQuery: myTypes.IMwlGetSpeciesListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetSpeciesListResponse>> {
    const url = baseMwlApiUrl + "/get-species-list";

    return http.get(url, {
      params: {
        species_key: reqQuery.species_key,
        species_type: reqQuery.species_type,
      },
    });
  }

  GetBreedList(
    reqQuery: myTypes.IMwlGetBreedListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetBreedListResponse>> {
    const url = baseMwlApiUrl + "/get-breed-list";

    return http.get(url, {
      params: {
        breed_key: reqQuery.breed_key,
        breed_species_type: reqQuery.breed_species_type,
      },
    });
  }

  GetOrdReasonList(
    reqQuery: myTypes.IMwlGetOrdReasonListQueryCondition
  ): Promise<AxiosResponse<myTypes.IMwlGetOrdReasonListResponse>> {
    const url = baseMwlApiUrl + "/get-ord-reason-list";

    return http.get(url, {
      params: reqQuery,
    });
  }

  AddPatient(
    reqQuery: myTypes.IMwlAddPatientRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddPatientResponse>> {
    const url = baseMwlApiUrl + "/add-patient";

    return http.post(url, reqQuery);
  }

  AddOrder(
    reqQuery: myTypes.IMwlAddOrderRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddOrderResponse>> {
    const url = baseMwlApiUrl + "/add-order";

    return http.post(url, reqQuery);
  }

  AddSps(
    reqQuery: myTypes.IMwlAddSpsRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddSpsResponse>> {
    const url = baseMwlApiUrl + "/add-sps";

    return http.post(url, reqQuery);
  }

  AddSpsList(
    reqQuery: myTypes.IMwlAddSpsListRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddSpsListResponse>> {
    const url = baseMwlApiUrl + "/add-sps-list";

    return http.post(url, reqQuery);
  }

  AddProcPlan(
    reqQuery: myTypes.IMwlAddProcPlanRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddProcPlanResponse>> {
    const url = baseMwlApiUrl + "/add-proc-plan";

    return http.post(url, reqQuery);
  }

  AddProtocol(
    reqQuery: myTypes.IMwlAddProtocolRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddProtocolResponse>> {
    const url = baseMwlApiUrl + "/add-protocol";

    return http.post(url, reqQuery);
  }

  AddBodypart(
    reqQuery: myTypes.IMwlAddBodypartRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddBodypartResponse>> {
    const url = baseMwlApiUrl + "/add-bodypart";

    return http.post(url, reqQuery);
  }

  AddStation(
    reqQuery: myTypes.IMwlAddStationRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddStationResponse>> {
    const url = baseMwlApiUrl + "/add-station";

    return http.post(url, reqQuery);
  }

  AddOrdReason(
    reqQuery: myTypes.IMwlAddOrdReasonRequest
  ): Promise<AxiosResponse<myTypes.IMwlAddOrdReasonResponse>> {
    const url = baseMwlApiUrl + "/add-ord-reason";

    return http.post(url, reqQuery);
  }

  DeleteOrder(
    reqQuery: myTypes.IMwlDeleteOrderRequest
  ): Promise<AxiosResponse<myTypes.IMwlDeleteOrderResponse>> {
    const url = baseMwlApiUrl + "/delete-order";

    return http.delete(url, {
      params: reqQuery,
    });
  }

  DeleteProcPlan(
    reqQuery: myTypes.IMwlDeleteProcPlanRequest
  ): Promise<AxiosResponse<myTypes.IMwlDeleteProcPlanResponse>> {
    const url = baseMwlApiUrl + "/delete-proc-plan";

    return http.delete(url, {
      params: {
        proc_plan_id_list: reqQuery.proc_plan_id_list,
      },
    });
  }

  DeleteProtocol(
    reqQuery: myTypes.IMwlDeleteProtocolRequest
  ): Promise<AxiosResponse<myTypes.IMwlDeleteProtocolResponse>> {
    const url = baseMwlApiUrl + "/delete-protocol";

    return http.delete(url, {
      params: {
        protocol_id_list: reqQuery.protocol_id_list,
      },
    });
  }

  DeleteBodypart(
    reqQuery: myTypes.IMwlDeleteBodypartRequest
  ): Promise<AxiosResponse<myTypes.IMwlDeleteBodypartResponse>> {
    const url = baseMwlApiUrl + "/delete-bodypart";

    return http.delete(url, {
      params: {
        bp_key_list: reqQuery.bp_key_list,
      },
    });
  }

  DeleteStation(
    reqQuery: myTypes.IMwlDeleteStationRequest
  ): Promise<AxiosResponse<myTypes.IMwlDeleteStationResponse>> {
    const url = baseMwlApiUrl + "/delete-station";

    return http.delete(url, {
      params: {
        station_ae_title_list: reqQuery.station_ae_title_list,
      },
    });
  }

  DeleteOrdReason(
    reqQuery: myTypes.IMwlDeleteOrdReasonRequest
  ): Promise<AxiosResponse<myTypes.IMwlDeleteOrdReasonResponse>> {
    const url = baseMwlApiUrl + "/delete-ord-reason";

    return http.delete(url, {
      params: {
        ord_reason_key: reqQuery.ord_reason_key,
      },
    });
  }

  // Update
  UpdatePatient(
    reqQuery: myTypes.IMwlUpdatePatientRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdatePatientResponse>> {
    const url = baseMwlApiUrl + "/update-patient";

    return http.put(url, reqQuery);
  }

  UpdateOrder(
    reqQuery: myTypes.IMwlUpdateOrderRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateOrderResponse>> {
    const url = baseMwlApiUrl + "/update-order";

    return http.put(url, reqQuery);
  }

  UpdateOrderStatus(
    reqQuery: myTypes.IMwlUpdateOrderStatusRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateOrderStatusResponse>> {
    const url = baseMwlApiUrl + "/update-order-status";

    return http.patch(url, reqQuery);
  }

  UpdateSps(
    reqQuery: myTypes.IMwlUpdateSpsRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateSpsResponse>> {
    const url = baseMwlApiUrl + "/update-sps";

    return http.put(url, reqQuery);
  }

  UpdateSpsList(
    reqQuery: myTypes.IMwlUpdateSpsListRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateSpsListResponse>> {
    const url = baseMwlApiUrl + "/update-sps-list";

    return http.put(url, reqQuery);
  }

  UpdateProcPlan(
    reqQuery: myTypes.IMwlUpdateProcPlanRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateProcPlanResponse>> {
    const url = baseMwlApiUrl + "/update-proc-plan";

    return http.put(url, reqQuery);
  }

  UpdateProtocol(
    reqQuery: myTypes.IMwlUpdateProtocolRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateProtocolResponse>> {
    const url = baseMwlApiUrl + "/update-protocol";

    return http.put(url, reqQuery);
  }

  UpdateBodypart(
    reqQuery: myTypes.IMwlUpdateBodypartRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateBodypartResponse>> {
    const url = baseMwlApiUrl + "/update-bodypart";

    return http.put(url, reqQuery);
  }

  UpdateStation(
    reqQuery: myTypes.IMwlUpdateStationRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateStationResponse>> {
    const url = baseMwlApiUrl + "/update-station";

    return http.put(url, reqQuery);
  }

  UpdateOrdReason(
    reqQuery: myTypes.IMwlUpdateOrdReasonRequest
  ): Promise<AxiosResponse<myTypes.IMwlUpdateOrdReasonResponse>> {
    const url = baseMwlApiUrl + "/update-ord-reason";

    return http.put(url, reqQuery);
  }

  GenerateAccNumber(): Promise<
    AxiosResponse<myTypes.IMwlGetNewAccNumberResponse>
  > {
    const url = baseMwlApiUrl + "/get-new-acc-no";

    return http.get(url);
  }
}

export default new MwlService();
