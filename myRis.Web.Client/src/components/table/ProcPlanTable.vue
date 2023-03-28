<template>
  <div :id="tableId">
    <MwlTableBase
      :tableId="tableId"
      :tableType="tableType"
      :columns="getProcPlanColumns"
      :rows="getProcPlanRows"
      :needUpdate="needUpdate"
      :isMultipleSelect="isMultipleSelect"
      :isDropdownAllowAll="isDropdownAllowAll"
      @row-click="onRowClick"
      @selected-rows-change="onSelChanged"
    />
  </div>
</template>

<script lang="ts">
import * as myTypes from "@/types";
import MwlService from "@/service/MwlService";
import { useI18n } from "vue-i18n";
import * as myUtils from "@/utils";

import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  watch,
} from "vue";
import MwlTableBase from "@/components/table/MwlTableBase.vue";

const convertDbProcPlanRowToDisplayRow = (
  index: number,
  dbProcPlan: myTypes.IDbProcPlan
): myTypes.ProcPlanTableRow => {
  let procplan_desc = "";
  let protocol_ids = "";

  if (dbProcPlan.proc_plan_desc != undefined)
    procplan_desc = dbProcPlan.proc_plan_desc;

  protocol_ids = myUtils.GetProtocolIDsFromIDbProcPlan(dbProcPlan);

  let rqSeqRow = new myTypes.ProcPlanTableRow(
    index,
    dbProcPlan.proc_plan_key,
    dbProcPlan.proc_plan_id,
    procplan_desc,
    protocol_ids
  );

  return rqSeqRow;
};

export default defineComponent({
  name: "ProcPlanTable",

  components: {
    MwlTableBase,
  },

  props: {
    // Style
    isSelectable: {
      type: Boolean,
      default: true,
    },

    isMultipleSelect: {
      type: Boolean,
      default: true,
    },

    isDropdownAllowAll: {
      type: Boolean,
      default: false,
    },

    needUpdate: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["selected-rows-change"],

  setup(props, context) {
    const tableId = ref("proc-plan-table");
    const tableType = ref(myTypes.eTableType.table_type_mwl_proc_plan);
    const queryProcPlanId = ref("");
    const queryProcPlanDesc = ref("");

    const searchedProcPlanList: myTypes.IDbProcPlan[] = reactive([]);

    const { t } = useI18n({
      useScope: "global",
      inheritLocale: true,
      warnHtmlMessage: false,
    });

    const translateColumns = (orgCols: myTypes.ICommonTableColumn[]) => {
      const res: myTypes.ICommonTableColumn[] = [];

      for (let col of orgCols) {
        let transLabel = col;
        transLabel.label = t(transLabel.label);
        res.push(transLabel);
      }

      return res;
    };

    const initializeTable = () => {
      fetchProcPlanList(queryProcPlanId.value, queryProcPlanDesc.value, false);
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const getProcPlanColumns = computed(() => {
      return translateColumns(myTypes.procPlanColumnList);
    });

    const getProcPlanRows = computed(() => {
      let displayRow: myTypes.ProcPlanTableRow;
      let displayRowList: myTypes.ProcPlanTableRow[] = [];
      let iterator = 0;

      for (let procPlan of searchedProcPlanList) {
        displayRow = convertDbProcPlanRowToDisplayRow(iterator, procPlan);

        displayRowList.push(displayRow);
        iterator++;
      }

      return displayRowList;
    });

    // single select (isMultipleSelect == false)
    const onRowClick = (params) => {
      if (params == undefined || params.row == undefined) {
        return;
      }

      let procPlanTableRow = new myTypes.ProcPlanTableRow(
        params.row.index,
        params.row.key,
        params.row.id,
        params.row.desc,
        params.row.protocol_ids
      );

      let selRes: myTypes.IDbProcPlan[] = [];
      if (procPlanTableRow != undefined) {
        selRes.push(procPlanTableRow.convertToDbInfo());
      }

      context.emit("selected-rows-change", selRes);

      return selRes;
    };

    // multiple select (isMultipleSelect == true)
    const onSelChanged = (params) => {
      if (params.selectedRows.length > 0) {
        let selRes: myTypes.IDbProcPlan[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            selRes.push({
              proc_plan_key: row.key,

              proc_plan_id: row.id,
              proc_plan_desc: row.desc,
            });
          }
        });

        context.emit("selected-rows-change", selRes);
      }
    };

    async function fetchProcPlanList(
      rpId: string,
      rpDesc: string,
      isStrict: boolean
    ) {
      let reqQuery: myTypes.IMwlGetProcPlanListQueryCondition = {
        proc_plan_id: rpId,
        proc_plan_desc: rpDesc,
        is_strict_condition: isStrict,
      };

      const res = await MwlService.GetProcPlanList(reqQuery);

      let { result, data } = res.data;

      while (searchedProcPlanList.length > 0) {
        searchedProcPlanList.pop();
      }

      if (result === true) {
        for (const procPlan of data) {
          searchedProcPlanList.push(procPlan);
        }
      } else {
        console.log("No Rp Seq Data: ", reqQuery);
      }
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,
      queryProcPlanId,
      queryProcPlanDesc,

      getProcPlanColumns,
      getProcPlanRows,
      //
      onRowClick,
      onSelChanged,
    };
  },

  methods: {},
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/table.scss";
</style>
