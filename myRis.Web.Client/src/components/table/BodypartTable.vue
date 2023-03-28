<template>
  <div :id="tableId">
    <MwlTableBase
      :title="title"
      :tableId="tableId"
      :tableType="tableType"
      :columns="getBodypartColumns"
      :isSelectable="isSelectable"
      :rows="getBodypartRows"
      :needUpdate="needUpdate"
      :perPageDropdown="perPageDropdown"
      :defaultPage="defaultPage"
      :isSearchable="isSearchable"
      :isSortable="isSortable"
      :isNavigatable="isNavigatable"
      :isDropdownAllowAll="isDropdownAllowAll"
      :isPagenable="isPagenable"
      @update:row="onUpdateRow"
      @select-all="onRowSelectAll"
      @selected-rows-change="onSelChanged"
      @row-order-change="onRowOrderChange"
      @row-click="onRowClick"
      @popup="onHandlePopup"
    />
  </div>
</template>

<script lang="ts">
import MwlTableBase from "@/components/table/MwlTableBase.vue";
import MwlService from "@/service/MwlService";
import * as myTypes from "@/types";
import { useI18n } from "vue-i18n";
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  watch,
} from "vue";

const convertDbBodypartRowToDisplayRow = (
  index: number,
  dbBodypart: myTypes.IDbBodypart
): myTypes.IBodypartTableRow | undefined => {
  let subType = "";

  if (
    dbBodypart.bp_sub_type != undefined &&
    (dbBodypart.bp_sub_type > myTypes.eBodypartType.NONE ||
      dbBodypart.bp_sub_type < myTypes.eBodypartType.END)
  ) {
    subType = myTypes.eBodypartSubType[dbBodypart.bp_sub_type];
  }

  let protocolRow = new myTypes.BodypartTableRow(
    index,
    dbBodypart.bp_key,
    myTypes.parseBodypartType(dbBodypart.bp_type),
    dbBodypart.bp_code_value,
    dbBodypart.bp_scm_design,
    dbBodypart.bp_code_meaning,
    dbBodypart.bp_snm_rt_id,
    dbBodypart.bp_sub_name,
    subType
  );

  return protocolRow;
};

export default defineComponent({
  name: "BodypartTable",

  components: {
    MwlTableBase,
  },

  props: {
    title: {
      type: String,
      default: "",
    },

    tableStyle: {
      type: String as PropType<myTypes.tTableStyle>,
      default: "main",
    },

    inputManual: {
      type: Boolean,
      default: false,
    },

    inputBpKeyList: {
      type: Array as PropType<number[]>,
      default: () => [],
    },

    inputSeparator: {
      type: String,
      default: myTypes.dataSeparator,
    },

    // Style
    isSelectable: {
      type: Boolean,
      default: true,
    },

    isSearchable: {
      type: Boolean,
      default: true,
    },

    isSortable: {
      type: Boolean,
      default: true,
    },

    isNavigatable: {
      type: Boolean,
      default: false,
    },

    isDropdownAllowAll: {
      type: Boolean,
      default: false,
    },

    isPagenable: {
      type: Boolean,
      default: true,
    },

    needUpdate: {
      type: Boolean,
      default: false,
    },

    perPageDropdown: {
      type: Array as PropType<number[]>,
      default: () => [10, 5],
    },

    defaultPage: {
      type: Number,
      default: 10,
    },
  },

  emits: [
    "selected-rows-change",
    "row-click",
    "select-all",
    "row-order-change",
    "popup",
    "update:inputBpKeyList",
  ],

  setup(props, context) {
    const tableId = ref("bodypart-table");
    const tableType = ref(myTypes.eTableType.table_type_mwl_protocol);
    const queryKeys: number[] = reactive([]);
    const queryDesc = ref("");

    const bodypartKeyList: number[] = reactive([]);
    const searchedBpList: myTypes.IDbBodypart[] = reactive([]);

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

    const initializeTable = () => {
      tableId.value = "bodypart-table-" + props.tableStyle;
      let isStrict = false;

      if (props.inputManual == true) {
        for (const protKey of props.inputBpKeyList) {
          queryKeys.push(protKey);
        }

        isStrict = true;
      }

      while (bodypartKeyList.length > 0) {
        bodypartKeyList.pop();
      }

      for (const key of props.inputBpKeyList) {
        bodypartKeyList.push(key);
      }

      fetchBodypartList(queryKeys, isStrict);
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const getBodypartColumns = computed(() => {
      return translateColumns(myTypes.bodypartColumnList);
    });

    const getBodypartRows = computed(() => {
      let displayRow: myTypes.BodypartTableRow | undefined;
      let displayRowList: myTypes.BodypartTableRow[] = [];

      let iterator = 0;

      if (props.inputManual == true) {
        for (let bpKey of bodypartKeyList) {
          for (let bp of searchedBpList) {
            if (bp.bp_key == bpKey) {
              displayRow = convertDbBodypartRowToDisplayRow(iterator, bp);

              if (displayRow == undefined) continue;

              displayRowList.push(displayRow);
              iterator++;
              break;
            }
          }
        }
      } else {
        for (let protocol of searchedBpList) {
          displayRow = convertDbBodypartRowToDisplayRow(iterator, protocol);

          if (displayRow == undefined) continue;

          displayRowList.push(displayRow);
          iterator++;
        }
      }

      return displayRowList;
    });

    const onRowSelectAll = (isSelect) => {
      context.emit("select-all", isSelect);
    };

    const onSelChanged = (params) => {
      if (params.selectedRows.length > 0) {
        let selRes: myTypes.IDbBodypart[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            selRes.push({
              bp_key: row.bp_key,
              bp_type: myTypes.reverseBodypartType(row.bp_type),
              bp_code_value: row.bp_code_value,
              bp_scm_design: row.bp_scm_design,
              bp_code_meaning: row.bp_code_meaning,

              bp_snm_rt_id: row.bp_snm_rt_id,
              bp_sub_name: row.bp_sub_name,
              bp_sub_type: myTypes.reverseBodypartSubType(row.bp_sub_type),
            });
          }
        });

        context.emit("selected-rows-change", selRes);
      }
    };

    const onRowClick = (params) => {
      if (
        params == undefined ||
        params.pageIndex < 0 ||
        params.row == undefined
      ) {
        console.log("onRowClick) Invalid Data");
        return;
      }

      const res: myTypes.ITableRowState = {
        index: params.pageIndex,
        id: params.row.id,
        isSelected: params.selected,
      };

      context.emit("row-click", res);
    };

    const onRowOrderChange = (src: string, dest: string) => {
      if (bodypartKeyList.length <= parseInt(dest)) return;

      const srcIndex: number = parseInt(src);
      const destIndex: number = parseInt(dest);

      if (srcIndex > destIndex) {
        let lastIndex: number = srcIndex + 1;
        let beforeItemVal = bodypartKeyList[srcIndex];
        for (let idx: number = destIndex; idx < lastIndex; idx++) {
          const temp = bodypartKeyList[idx];
          bodypartKeyList[idx] = beforeItemVal;
          beforeItemVal = temp;
        }
      } else {
        let firstIndex: number = srcIndex - 1;
        let afterItemVal = bodypartKeyList[srcIndex];
        for (let idx: number = destIndex; idx > firstIndex; idx--) {
          const temp = bodypartKeyList[idx];
          bodypartKeyList[idx] = afterItemVal;
          afterItemVal = temp;
        }
      }

      context.emit("update:inputBpKeyList", bodypartKeyList);
    };

    const onUpdateRow = (row: myTypes.BodypartTableRow) => {
      let displayRow: myTypes.BodypartTableRow | undefined;
      let displayRowList: myTypes.BodypartTableRow[] = [];

      let iterator = 0;

      if (props.inputManual == true) {
        for (let protKey of bodypartKeyList) {
          for (let bp of searchedBpList) {
            if (bp.bp_key == protKey) {
              if (iterator == row.index) {
                displayRowList.push(row);
              } else {
                displayRow = convertDbBodypartRowToDisplayRow(iterator, bp);

                if (displayRow == undefined) continue;

                displayRowList.push(displayRow);
                iterator++;
              }
              break;
            }
          }
        }
      } else {
        for (let protocol of searchedBpList) {
          if (iterator == row.index) {
            displayRowList.push(row);
          } else {
            displayRow = convertDbBodypartRowToDisplayRow(iterator, protocol);

            if (displayRow == undefined) continue;

            displayRowList.push(displayRow);
            iterator++;
          }
        }
      }
    };

    const onHandlePopup = (state: boolean) => {
      context.emit("popup", state);
    };

    async function fetchBodypartList(keys: number[], isStrict: boolean) {
      let reqQuery: myTypes.IMwlGetBodypartListQueryCondition = {
        bp_keys: keys,
        is_strict_condition: isStrict,
      };

      const res = await MwlService.GetBodypartList(reqQuery);

      let { result, data } = res.data;

      while (searchedBpList.length > 0) {
        searchedBpList.pop();
      }

      if (result === true) {
        for (const bp of data) {
          searchedBpList.push(bp);
        }
      } else {
        console.log("fetchBodypartList) No Bodypart Items");
      }

      let displayRow: myTypes.BodypartTableRow | undefined;
      let displayRowList: myTypes.BodypartTableRow[] = [];
      let iterator = 0;

      if (props.inputManual == true) {
        for (let spsId of bodypartKeyList) {
          for (let bp of searchedBpList) {
            if (bp.bp_key == spsId) {
              displayRow = convertDbBodypartRowToDisplayRow(iterator, bp);

              if (displayRow == undefined) continue;

              displayRowList.push(displayRow);
              iterator++;
              break;
            }
          }
        }
      } else {
        for (let bp of searchedBpList) {
          displayRow = convertDbBodypartRowToDisplayRow(iterator, bp);

          if (displayRow == undefined) continue;

          displayRowList.push(displayRow);
          iterator++;
        }
      }
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,
      queryKeys,
      queryDesc,

      getBodypartColumns,
      getBodypartRows,

      onUpdateRow,
      onRowSelectAll,
      onSelChanged,
      onRowOrderChange,
      onRowClick,
      onHandlePopup,
    };
  },

  methods: {},
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/table.scss";
</style>
