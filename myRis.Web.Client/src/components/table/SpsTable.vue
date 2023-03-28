<template>
  <div :id="tableId">
    <MwlTableBase
      :title="title"
      :tableId="tableId"
      :tableType="tableType"
      :columns="getSpsColumns"
      :isSelectable="isSelectable"
      :rows="getSpsRows"
      :needUpdate="needUpdate"
      :perPageDropdown="perPageDropdown"
      :defaultPage="defaultPage"
      :isSearchable="isSearchable"
      :isSortable="isSortable"
      :isNavigatable="isNavigatable"
      :isDropdownAllowAll="isDropdownAllowAll"
      :isPagenable="isPagenable"
      :isSchedulingTable="isSchedulingTable"
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
  PropType,
} from "vue";
import MwlTableBase from "@/components/table/MwlTableBase.vue";

const convertDbSpsRowToDisplayRow = (
  index: number,
  dbSps: myTypes.IDbSps
): myTypes.SpsTableRow | undefined => {
  const startDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(
    myUtils.applyTimeZone(dbSps.sps_start_dttm)
  );
  const endDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(
    myUtils.applyTimeZone(dbSps.sps_end_dttm)
  );

  if (startDttm == undefined) {
    console.log("convertDbSpsRowToDisplayRow(err): startDttm");
    return undefined;
  }

  if (endDttm == undefined) {
    console.log("convertDbSpsRowToDisplayRow(err): endDttm");
    return undefined;
  }

  let station_name = "";
  let desc = "";
  let perform_phyc_name = "";
  let contrast_agent = "";
  let pre_med = "";

  if (dbSps.sps_station_name != undefined) {
    station_name = dbSps.sps_station_name;
  }

  if (dbSps.sps_desc != undefined) {
    desc = dbSps.sps_desc;
  }

  if (dbSps.sps_perform_phyc_name != undefined) {
    perform_phyc_name = dbSps.sps_perform_phyc_name;
  }

  if (dbSps.sps_contrast_agent != undefined) {
    contrast_agent = dbSps.sps_contrast_agent;
  }

  if (dbSps.sps_pre_med != undefined) {
    pre_med = dbSps.sps_pre_med;
  }

  let spsRow = new myTypes.SpsTableRow(
    index,
    dbSps.sps_key,
    dbSps.sps_ord_key,
    //
    dbSps.sps_id,
    startDttm,
    endDttm,
    //
    dbSps.sps_station_ae_title,
    station_name,
    dbSps.sps_modality,
    dbSps.sps_bp_code_value,
    dbSps.sps_bp_scm_design,
    dbSps.sps_bp_meaning,
    //
    desc,
    perform_phyc_name,
    contrast_agent,
    pre_med
  );

  return spsRow;
};

export default defineComponent({
  name: "SpsTable",

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
      default: "display",
    },

    inputManual: {
      type: Boolean,
      default: false,
    },

    // SPS ID는 T_SPS 에서 Unique하지 않은 값이다. T_PROTOCOL에서는 Unique하다.
    inputSpsKeyList: {
      type: String,
      default: "",
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

    isSchedulingTable: {
      type: Boolean,
      default: false,
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
    "update:inputSpsKeyList",
    "update:spsInfo",
  ],

  setup(props, context) {
    const tableId = ref("spsTable");
    const tableType = ref(myTypes.eTableType.table_type_mwl_sps);
    const queryKey = ref("");

    const spsKeyList: number[] = reactive([]);
    const curSpsRows: myTypes.SpsTableRow[] = reactive([]);
    const searchedSpsList: myTypes.IDbSps[] = reactive([]);
    const spsInfoList: myTypes.IDbSps[] = reactive([]);

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
      tableId.value = "sps-table-" + props.tableStyle;
      let isStrict = false;

      if (props.inputManual == true) {
        queryKey.value = props.inputSpsKeyList;
        isStrict = true;
      }

      const keyList = props.inputSpsKeyList.split(myTypes.dataSeparator);

      while (spsKeyList.length > 0) {
        spsKeyList.pop();
      }

      for (const key of keyList) {
        spsKeyList.push(Number(key));
      }

      fetchSpsList(queryKey.value, isStrict);
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const getSpsColumns = computed(() => {
      myTypes.spsColumnList.forEach(function (column, index) {
        if (
          myTypes.spsColumnList[index].field == "start_dttm" ||
          myTypes.spsColumnList[index].field == "end_dttm"
        ) {
          if (props.isSchedulingTable) {
            myTypes.spsColumnList[index].hidden = false;
          } else {
            myTypes.spsColumnList[index].hidden = true;
          }
        } else if (myTypes.spsColumnList[index].field == "duration") {
          if (props.isSchedulingTable) {
            myTypes.spsColumnList[index].hidden = true;
          } else {
            myTypes.spsColumnList[index].hidden = false;
          }
        }
      });

      return translateColumns(myTypes.spsColumnList);
    });

    const getSpsRows = computed(() => {
      /*
      let displayRow: myTypes.SpsTableRow | undefined;
      let displayRowList: myTypes.SpsTableRow[] = [];

      let iterator = 0;

      if (props.inputManual == true) {
        for (let spsKey of spsKeyList) {
          for (let sps of searchedSpsList) {
            if (sps.sps_key == spsKey) {
              displayRow = convertDbSpsRowToDisplayRow(iterator, sps);

              if (displayRow == undefined) continue;

              displayRowList.push(displayRow);
              iterator++;
              break;
            }
          }
        }
      } else {
        for (let sps of searchedSpsList) {
          displayRow = convertDbSpsRowToDisplayRow(iterator, sps);

          if (displayRow == undefined) continue;

          displayRowList.push(displayRow);
          iterator++;
        }
      }
      */
      return curSpsRows;
    });

    const onRowSelectAll = (isSelect) => {
      context.emit("select-all", isSelect);
    };

    const onSelChanged = (params) => {
      if (params.selectedRows.length > 0) {
        let selRes: myTypes.IDbSps[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            selRes.push({
              sps_key: row.key,
              sps_ord_key: row.ord_key,

              sps_id: row.id,
              sps_start_dttm: new Date(row.start_dttm),
              sps_end_dttm: new Date(row.end_dttm),

              sps_station_ae_title: row.station_ae_title,
              sps_station_name: row.station_name,
              sps_modality: row.modality,
              sps_bp_code_value: row.bp_code_value,
              sps_bp_scm_design: row.bp_scm_design,
              sps_bp_meaning: row.bp_meaning,

              sps_desc: row.desc,
              sps_perform_phyc_name: row.perform_phyc_name,
              sps_contrast_agent: row.contrast_agent,
              sps_pre_med: row.pre_med,
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
      if (spsKeyList.length <= parseInt(dest)) return;

      const srcIndex: number = parseInt(src);
      const destIndex: number = parseInt(dest);

      if (srcIndex > destIndex) {
        let lastIndex: number = srcIndex + 1;
        let beforeItemVal = spsKeyList[srcIndex];
        for (let idx: number = destIndex; idx < lastIndex; idx++) {
          const temp = spsKeyList[idx];
          spsKeyList[idx] = beforeItemVal;
          beforeItemVal = temp;
        }
      } else {
        let firstIndex: number = srcIndex - 1;
        let afterItemVal = spsKeyList[srcIndex];
        for (let idx: number = destIndex; idx > firstIndex; idx--) {
          const temp = spsKeyList[idx];
          spsKeyList[idx] = afterItemVal;
          afterItemVal = temp;
        }
      }

      const spsKeyListRes = spsKeyList.join(myTypes.dataSeparator);

      context.emit("update:inputSpsKeyList", spsKeyListRes);
    };
    /*
    const onUpdateRow = (row: myTypes.SpsTableRow) => {
      let displayRow: myTypes.SpsTableRow | undefined;
      let displayRowList: myTypes.SpsTableRow[] = [];

      let iterator = 0;

      if (props.inputManual == true) {
        for (let spsKey of spsKeyList) {
          for (let sps of curSpsRows) {
            if (sps.index == iterator) {
              if (iterator == row.index) {
                displayRowList.push(row);
                console.log(
                  "onUpdateRow c1",
                  row,
                  searchedSpsList,
                  displayRowList
                );
              } else {
                displayRow = convertDbSpsRowToDisplayRow(iterator, sps);

                if (displayRow == undefined) continue;

                displayRowList.push(displayRow);

                console.log(
                  "onUpdateRow c2",
                  row,
                  searchedSpsList,
                  displayRowList
                );
              }
              break;
            }

            iterator++;
          }
        }
      } else {
        for (let sps of searchedSpsList) {
          if (iterator == row.index) {
            displayRowList.push(row);
          } else {
            displayRow = convertDbSpsRowToDisplayRow(iterator, sps);

            if (displayRow == undefined) continue;

            displayRowList.push(displayRow);
          }

          iterator++;
        }
      }

      console.log("onUpdateRow", row, searchedSpsList, displayRowList);

      onUpdateSpsInfo(displayRowList);
    };
    */

    const onUpdateRow = (row: myTypes.SpsTableRow) => {
      let iterator = 0;

      for (let sps of curSpsRows) {
        if (sps.index == row.index) {
          curSpsRows[iterator] = row;
          console.log("onUpdateRow1", row.index, curSpsRows[iterator]);
          break;
        }
        iterator++;
      }

      console.log("onUpdateRow", row, curSpsRows);

      onUpdateSpsInfo();
    };

    const onHandlePopup = (state: boolean) => {
      context.emit("popup", state);
    };

    const onUpdateSpsInfo = () => {
      while (spsInfoList.length > 0) {
        spsInfoList.pop();
      }

      for (const row of curSpsRows) {
        spsInfoList.push({
          sps_key: row.key,
          sps_ord_key: row.ord_key,

          sps_id: row.id,
          sps_start_dttm: new Date(row.start_dttm),
          sps_end_dttm: new Date(row.end_dttm),

          sps_station_ae_title: row.station_ae_title,
          sps_station_name: row.station_name,
          sps_modality: row.modality,
          sps_bp_code_value: row.bp_code_value,
          sps_bp_scm_design: row.bp_scm_design,
          sps_bp_meaning: row.bp_meaning,

          sps_desc: row.desc,
          sps_perform_phyc_name: row.perform_phyc_name,
          sps_contrast_agent: row.contrast_agent,
          sps_pre_med: row.pre_med,
        } as myTypes.IDbSps);
      }

      context.emit("update:spsInfo", spsInfoList);
    };

    async function fetchSpsList(keys: string, isStrict: boolean) {
      let reqQuery: myTypes.IMwlGetSpsListQueryCondition = {
        sps_keys: keys,
        is_strict_condition: isStrict,
      };

      const res = await MwlService.GetSpsList(reqQuery);

      let { result, data } = res.data;

      while (searchedSpsList.length > 0) {
        searchedSpsList.pop();
      }

      if (result === true) {
        for (const sps of data) {
          searchedSpsList.push(sps);
        }
      } else {
        console.log("No Sps Data: ");
      }

      while (curSpsRows.length > 0) {
        curSpsRows.pop();
      }

      let displayRow: myTypes.SpsTableRow | undefined;
      let iterator = 0;

      if (props.inputManual == true) {
        for (let spsKey of spsKeyList) {
          for (let sps of searchedSpsList) {
            if (sps.sps_key == spsKey) {
              displayRow = convertDbSpsRowToDisplayRow(iterator, sps);

              if (displayRow == undefined) continue;

              curSpsRows.push(displayRow);
              iterator++;
              break;
            }
          }
        }
      } else {
        for (let sps of searchedSpsList) {
          displayRow = convertDbSpsRowToDisplayRow(iterator, sps);

          if (displayRow == undefined) continue;

          curSpsRows.push(displayRow);
          iterator++;
        }
      }

      onUpdateSpsInfo();
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,

      getSpsColumns,
      getSpsRows,

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
