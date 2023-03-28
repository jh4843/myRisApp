<template>
  <div :id="tableId">
    <MwlTableBase
      :tableId="tableId"
      :tableType="tableType"
      :columns="getOrderColumns"
      :rows="getOrderRows"
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
import * as myUtils from "@/utils";
import MwlService from "@/service/MwlService";
import { useI18n } from "vue-i18n";

import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  watch,
} from "vue";
import MwlTableBase from "@/components/table/MwlTableBase.vue";

const convertDbOrderRowToDisplayRow = (
  index: number,
  dbOrder: myTypes.IDbOrder
): myTypes.OrderTableRow | undefined => {
  const createDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(
    myUtils.applyTimeZone(dbOrder.ord_create_dttm)
  );
  const studyDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(
    myUtils.applyTimeZone(dbOrder.ord_study_dttm)
  );

  let rqSeqRow = new myTypes.OrderTableRow(
    index,
    dbOrder.ord_pt_key,
    dbOrder.ord_key,

    dbOrder.ord_acc_num,
    myTypes.parseOrderStatus(dbOrder.ord_status_flag),
    dbOrder.ord_study_uid,
    myTypes.parsePriority(dbOrder.ord_priority),

    dbOrder.ord_rp_id,
    dbOrder.ord_issuer,
    createDttm,

    dbOrder.ord_requesting_phyc,
    dbOrder.ord_reason,
    studyDttm,
    dbOrder.ord_reason,

    dbOrder.ord_rp_desc,
    dbOrder.ord_pt_age,
    dbOrder.ord_pt_weight,
    dbOrder.ord_pt_size
  );

  return rqSeqRow;
};

export default defineComponent({
  name: "OrderTable",

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
    const tableId = ref("order-table");
    const tableType = ref(myTypes.eTableType.table_type_mwl_order);

    const searchedOrderList: myTypes.IDbOrder[] = reactive([]);

    const initializeTable = () => {
      fetchOrderList();
    };

    const { t } = useI18n({
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

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const getOrderColumns = computed(() => {
      return translateColumns(myTypes.orderColumnList);
    });

    const getOrderRows = computed(() => {
      let displayRow: myTypes.OrderTableRow | undefined;
      let displayRowList: myTypes.OrderTableRow[] = [];
      let iterator = 0;

      for (let ord of searchedOrderList) {
        displayRow = convertDbOrderRowToDisplayRow(iterator, ord);

        if (displayRow == undefined) continue;

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

      let ordTableRow = new myTypes.OrderTableRow(
        params.row.index,
        params.row.pt_key,
        params.row.ord_key,
        params.row.ord_acc_num,
        params.row.ord_status_flag,
        params.row.ord_study_uid,
        params.row.ord_priority,
        params.row.ord_rp_id,
        params.row.ord_issuer,
        params.row.ord_create_dttm,
        params.row.ord_requesting_phyc,
        params.row.ord_referring_phyc,
        params.row.ord_study_dttm,
        params.row.ord_reason,
        params.row.ord_rp_desc,
        params.row.ord_pt_age,
        params.row.ord_pt_weight,
        params.row.ord_pt_size
      );

      let selRes: myTypes.IDbOrder[] = [];
      if (ordTableRow != undefined) {
        selRes.push(ordTableRow.convertToDbInfo());
      }

      context.emit("selected-rows-change", selRes);

      return selRes;
    };

    // multiple select (isMultipleSelect == true)
    const onSelChanged = (params) => {
      if (params.selectedRows.length > 0) {
        let selRes: myTypes.IDbOrder[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            const ordTableRow = new myTypes.OrderTableRow(
              params.row.index,
              params.row.pt_key,
              params.row.ord_key,
              params.row.ord_acc_num,
              params.row.ord_status_flag,
              params.row.ord_study_uid,
              params.row.ord_priority,
              params.row.ord_rp_id,
              params.row.ord_issuer,
              params.row.ord_create_dttm,
              params.row.ord_requesting_phyc,
              params.row.ord_referring_phyc,
              params.row.ord_study_dttm,
              params.row.ord_reason,
              params.row.ord_rp_desc,
              params.row.ord_pt_age,
              params.row.ord_pt_weight,
              params.row.ord_pt_size
            );

            selRes.push(ordTableRow.convertToDbInfo());
          }
        });

        context.emit("selected-rows-change", selRes);
      }
    };

    async function fetchOrderList() {
      let reqQuery: myTypes.IMwlGetOrderListQueryCondition = {
        is_strict_condition: false,
      };

      const res = await MwlService.GetOrderList(reqQuery);

      let { result, data } = res.data;

      while (searchedOrderList.length > 0) {
        searchedOrderList.pop();
      }

      if (result === true) {
        for (const ord of data) {
          searchedOrderList.push(ord);
        }
      } else {
        console.log("No Order Data: ", reqQuery);
      }
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,

      getOrderColumns,
      getOrderRows,
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
