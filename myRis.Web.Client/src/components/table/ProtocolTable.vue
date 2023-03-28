<template>
  <div :id="tableId">
    <MwlTableBase
      :title="title"
      :tableId="tableId"
      :tableType="tableType"
      :columns="getProtocolColumns"
      :isSelectable="isSelectable"
      :rows="getProtocolRows"
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

const convertDbProtocolRowToDisplayRow = (
  index: number,
  dbProtocol: myTypes.IDbProtocol
): myTypes.IProtocolTableRow | undefined => {
  const curDate = new Date();
  let endDate = new Date(curDate);

  if (dbProtocol.prot_duration != undefined) {
    endDate.setMinutes(curDate.getMinutes() + dbProtocol.prot_duration);
  }

  const startDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(curDate);
  const endDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(endDate);

  if (startDttm == undefined) {
    console.log("convertDbProtocolRowToDisplayRow(err): startDttm");
    return undefined;
  }

  if (endDttm == undefined) {
    console.log("convertDbProtocolRowToDisplayRow(err): endDttm");
    return undefined;
  }

  let bpMeaning = dbProtocol.bp_code_meaning;
  let bpScmDesign = dbProtocol.bp_scm_design;
  let bpCodeValue = dbProtocol.bp_code_value;

  if (bpMeaning == undefined) {
    bpMeaning = "";
  }

  if (bpScmDesign == undefined) {
    bpScmDesign = "";
  }

  if (bpCodeValue == undefined) {
    bpCodeValue = "";
  }

  let protocolRow = new myTypes.ProtocolTableRow(
    index,
    dbProtocol.prot_key,
    dbProtocol.prot_id,
    dbProtocol.prot_station_ae_title,
    dbProtocol.prot_station_name,
    dbProtocol.prot_modality,
    dbProtocol.prot_desc,
    dbProtocol.prot_perform_phyc_name,
    dbProtocol.prot_duration,
    startDttm,
    endDttm,
    dbProtocol.prot_key,
    bpMeaning,
    bpScmDesign,
    bpCodeValue
  );

  return protocolRow;
};

export default defineComponent({
  name: "ProtocolTable",

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

    inputProtocolKeyList: {
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
    "update:inputProtocolKeyList",
    "update:spsInfo",
  ],

  setup(props, context) {
    const tableId = ref("protocolTable");
    const tableType = ref(myTypes.eTableType.table_type_mwl_protocol);
    const queryKeys: number[] = reactive([]);
    const queryDesc = ref("");

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

    const protocolKeyList: number[] = reactive([]);
    const searchedProtocolList: myTypes.IDbProtocol[] = reactive([]);
    const spsInfoList: myTypes.IDbSps[] = reactive([]);

    const initializeTable = () => {
      tableId.value = "protocol-table-" + props.tableStyle;
      let isStrict = false;

      if (props.inputManual == true) {
        for (const protKey of props.inputProtocolKeyList) {
          queryKeys.push(protKey);
        }

        isStrict = true;
      }

      //const idList = props.inputProtocolKeyList.split(myTypes.dataSeparator);

      while (protocolKeyList.length > 0) {
        protocolKeyList.pop();
      }

      for (const key of props.inputProtocolKeyList) {
        protocolKeyList.push(key);
      }

      fetchProtocolList(queryKeys, queryDesc.value, isStrict);
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const getProtocolColumns = computed(() => {
      myTypes.protocolColumnList.forEach(function (column, index) {
        if (
          myTypes.protocolColumnList[index].field == "start_dttm" ||
          myTypes.protocolColumnList[index].field == "end_dttm"
        ) {
          if (props.isSchedulingTable) {
            myTypes.protocolColumnList[index].hidden = false;
          } else {
            myTypes.protocolColumnList[index].hidden = true;
          }
        } else if (myTypes.protocolColumnList[index].field == "duration") {
          if (props.isSchedulingTable) {
            myTypes.protocolColumnList[index].hidden = true;
          } else {
            myTypes.protocolColumnList[index].hidden = false;
          }
        }
      });

      return translateColumns(myTypes.protocolColumnList);
    });

    const getProtocolRows = computed(() => {
      let displayRow: myTypes.ProtocolTableRow | undefined;
      let displayRowList: myTypes.ProtocolTableRow[] = [];

      let iterator = 0;

      if (props.inputManual == true) {
        for (let protKey of protocolKeyList) {
          for (let protocol of searchedProtocolList) {
            if (protocol.prot_key == protKey) {
              displayRow = convertDbProtocolRowToDisplayRow(iterator, protocol);

              if (displayRow == undefined) continue;

              displayRowList.push(displayRow);
              iterator++;
              break;
            }
          }
        }
      } else {
        for (let protocol of searchedProtocolList) {
          displayRow = convertDbProtocolRowToDisplayRow(iterator, protocol);

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
        let selRes: myTypes.IDbProtocol[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            selRes.push({
              prot_key: row.key,

              prot_id: row.id,
              prot_station_ae_title: row.station_ae_title,
              prot_station_name: row.station_name,
              prot_modality: row.modality,

              prot_desc: row.desc,
              prot_perform_phyc_name: row.perform_phyc_name,
              prot_duration: row.duration,

              prot_bp_key: row.prot_bp_key,
              bp_code_meaning: row.bp_code_meaning,
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
      if (protocolKeyList.length <= parseInt(dest)) return;

      const srcIndex: number = parseInt(src);
      const destIndex: number = parseInt(dest);

      if (srcIndex > destIndex) {
        let lastIndex: number = srcIndex + 1;
        let beforeItemVal = protocolKeyList[srcIndex];
        for (let idx: number = destIndex; idx < lastIndex; idx++) {
          const temp = protocolKeyList[idx];
          protocolKeyList[idx] = beforeItemVal;
          beforeItemVal = temp;
        }
      } else {
        let firstIndex: number = srcIndex - 1;
        let afterItemVal = protocolKeyList[srcIndex];
        for (let idx: number = destIndex; idx > firstIndex; idx--) {
          const temp = protocolKeyList[idx];
          protocolKeyList[idx] = afterItemVal;
          afterItemVal = temp;
        }
      }

      //const spsIdListRes = protocolKeyList.join(myTypes.dataSeparator);

      context.emit("update:inputProtocolKeyList", protocolKeyList);
    };

    const onUpdateRow = (row: myTypes.ProtocolTableRow) => {
      let displayRow: myTypes.ProtocolTableRow | undefined;
      let displayRowList: myTypes.ProtocolTableRow[] = [];

      let iterator = 0;

      if (props.inputManual == true) {
        for (let protKey of protocolKeyList) {
          for (let protocol of searchedProtocolList) {
            if (protocol.prot_key == protKey) {
              if (iterator == row.index) {
                displayRowList.push(row);
              } else {
                displayRow = convertDbProtocolRowToDisplayRow(
                  iterator,
                  protocol
                );

                if (displayRow == undefined) continue;

                displayRowList.push(displayRow);
                iterator++;
              }
              break;
            }
          }
        }
      } else {
        for (let protocol of searchedProtocolList) {
          if (iterator == row.index) {
            displayRowList.push(row);
          } else {
            displayRow = convertDbProtocolRowToDisplayRow(iterator, protocol);

            if (displayRow == undefined) continue;

            displayRowList.push(displayRow);
            iterator++;
          }
        }
      }

      onUpdateSpsInfo(displayRowList);
    };

    const onHandlePopup = (state: boolean) => {
      context.emit("popup", state);
    };

    const onUpdateSpsInfo = (rows: myTypes.ProtocolTableRow[]) => {
      while (spsInfoList.length > 0) {
        spsInfoList.pop();
      }

      for (const row of rows) {
        const sps: myTypes.IDbSps = {
          sps_key: -1,
          sps_ord_key: -1,

          sps_id: row.id,
          sps_start_dttm: new Date(row.start_dttm),
          sps_end_dttm: new Date(row.end_dttm),

          sps_station_ae_title: row.station_ae_title,
          sps_station_name: row.station_name,
          sps_modality: row.modality,
          sps_bp_code_value: row.bp_code_value,
          sps_bp_scm_design: row.bp_scm_design,
          sps_bp_meaning: row.bp_code_meaning,

          sps_desc: row.desc,
          sps_perform_phyc_name: row.perform_phyc_name,
          sps_contrast_agent: "",
          sps_pre_med: "",
        };

        spsInfoList.push(sps);
      }

      context.emit("update:spsInfo", spsInfoList);
    };

    async function fetchProtocolList(
      keys: number[],
      desc: string,
      isStrict: boolean
    ) {
      let reqQuery: myTypes.IMwlGetProtocolListQueryCondition = {
        protocol_keys: keys.length <= 0 ? undefined : keys,
        prot_desc: desc,

        is_strict_condition: isStrict,
      };

      const res = await MwlService.GetProtocolList(reqQuery);

      let { result, data } = res.data;

      while (searchedProtocolList.length > 0) {
        searchedProtocolList.pop();
      }

      if (result === true) {
        for (const protocol of data) {
          searchedProtocolList.push(protocol);
        }
      } else {
        console.log("fetchProtocolList) No Protocol Items");
      }

      let displayRow: myTypes.ProtocolTableRow | undefined;
      let displayRowList: myTypes.ProtocolTableRow[] = [];
      let iterator = 0;

      if (props.inputManual == true) {
        for (let spsId of protocolKeyList) {
          for (let protocol of searchedProtocolList) {
            if (protocol.prot_key == spsId) {
              displayRow = convertDbProtocolRowToDisplayRow(iterator, protocol);

              if (displayRow == undefined) continue;

              displayRowList.push(displayRow);
              iterator++;
              break;
            }
          }
        }
      } else {
        for (let protocol of searchedProtocolList) {
          displayRow = convertDbProtocolRowToDisplayRow(iterator, protocol);

          if (displayRow == undefined) continue;

          displayRowList.push(displayRow);
          iterator++;
        }
      }

      onUpdateSpsInfo(displayRowList);
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,
      queryKeys,
      queryDesc,

      getProtocolColumns,
      getProtocolRows,

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
