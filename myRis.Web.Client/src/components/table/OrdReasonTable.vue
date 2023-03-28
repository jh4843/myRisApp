<template>
  <div :id="tableId">
    <MwlTableBase
      :tableId="tableId"
      :tableType="tableType"
      :columns="getOrdReasonColumns"
      :rows="getOrdReasonRows"
      :needUpdate="needUpdate"
      :isDropdownAllowAll="isDropdownAllowAll"
      @selected-rows-change="onSelChanged"
    />
  </div>
</template>

<script lang="ts">
import * as myTypes from "@/types";
import MwlService from "@/service/MwlService";
import { useI18n } from "vue-i18n";

import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  watch,
  PropType,
} from "vue";
import MwlTableBase from "@/components/table/MwlTableBase.vue";

const convertDbOrdReasonToTableRow = (
  index: number,
  dbOrdReason: myTypes.IDbOrdReason
): myTypes.IOrdReasonTableRow => {
  let ordReasonRow = new myTypes.OrdReasonTableRow(
    index,
    dbOrdReason.ord_reason_key,
    myTypes.parseOrdReason(dbOrdReason.ord_reason_type),
    dbOrdReason.ord_reason_desc
  );

  return ordReasonRow;
};

export default defineComponent({
  name: "UserSettingOrdReasonTable",

  components: {
    MwlTableBase,
  },

  props: {
    // Style
    isSelectable: {
      type: Boolean,
      default: true,
    },

    needUpdate: {
      type: Boolean,
      default: false,
    },

    isDropdownAllowAll: {
      type: Boolean,
      default: false,
    },

    ordReasonType: {
      type: Number as PropType<myTypes.eOrdReasonType>,
      default: myTypes.eOrdReasonType.NONE,
    },
  },

  emits: ["selected-rows-change"],

  setup(props, context) {
    const tableId = ref("userSettingOrdReasonTable");
    const tableType = ref(myTypes.eTableType.table_type_mwl_ord_reason);
    const queryOrdReasonType = ref(props.ordReasonType);

    const searchedOrdReasonList: myTypes.IDbOrdReason[] = reactive([]);

    const initializeTable = () => {
      fetchOrdReasonList(queryOrdReasonType.value, true);
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

    const getOrdReasonColumns = computed(() => {
      return translateColumns(myTypes.ordReasonColumnList);
    });

    const getOrdReasonRows = computed(() => {
      let displayRow: myTypes.OrdReasonTableRow;
      let displayRowList: myTypes.OrdReasonTableRow[] = [];

      let iterator = 0;
      for (let ordReason of searchedOrdReasonList) {
        displayRow = convertDbOrdReasonToTableRow(iterator, ordReason);
        displayRowList.push(displayRow);
        iterator++;
      }

      return displayRowList;
    });

    const onSelChanged = (params) => {
      if (params.selectedRows.length > 0) {
        let selRes: myTypes.IDbOrdReason[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            selRes.push({
              ord_reason_key: row.ord_reason_key,
              ord_reason_type: myTypes.reverseOrdReason(row.ord_reason_type),
              ord_reason_desc: row.ord_reason_desc,
            });
          }
        });

        context.emit("selected-rows-change", selRes);
      }
    };

    async function fetchOrdReasonList(
      ordReasonType: myTypes.eOrdReasonType,

      isStrict: boolean
    ) {
      const ordResType =
        ordReasonType == myTypes.eOrdReasonType.NONE
          ? undefined
          : ordReasonType;

      let reqQuery: myTypes.IMwlGetOrdReasonListQueryCondition = {
        ord_reason_type: ordResType,

        is_strict_condition: isStrict,
      };

      const res = await MwlService.GetOrdReasonList(reqQuery);

      let { result, data } = res.data;

      while (searchedOrdReasonList.length > 0) {
        searchedOrdReasonList.pop();
      }

      if (result === true) {
        for (const ordReason of data) {
          searchedOrdReasonList.push(ordReason);
        }
      } else {
        console.log("No OrdReason Data: ", reqQuery);
      }
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,

      getOrdReasonColumns,
      getOrdReasonRows,
      //
      onSelChanged,
    };
  },

  methods: {},
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/table.scss";
</style>
