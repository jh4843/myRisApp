import * as myTypes from "../../../myRis.Web.Common";

export const GetProtocolIDsFromIDbProcPlan = (
  procPlan: myTypes.IDbProcPlan
): string => {
  let res = "";

  if (procPlan.proc_plan_protocols == undefined) return "";

  let isFirst = true;

  for (const prot of procPlan.proc_plan_protocols) {
    if (prot.prot_id == undefined) continue;

    if (!isFirst) {
      res += ", " + prot.prot_id;
    } else {
      res = prot.prot_id;
      isFirst = false;
    }
  }

  return res;
};
