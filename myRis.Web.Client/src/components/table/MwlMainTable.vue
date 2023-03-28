<template>
  <div :id="tableId">
    <MwlTableBase
      :title="title"
      :tableId="tableId"
      :tableType="getTableType"
      :columns="getMwlMainColumns"
      :rows="getMwlMainRows"
      :mwlTableRows="getMwlAllRows"
      :needUpdate="needUpdate"
      :perPageDropdown="perPageDropdown"
      :defaultPage="defaultPage"
      :isSelectable="isSelectable"
      :isSearchable="isSearchable"
      :isMultipleSelect="isMultiSelectable"
      :isSortable="isSortable"
      :isNavigatable="isNavigatable"
      :isPagenable="isPagenable"
      @update:row="onUpdateRow"
      @select-all="onRowSelectAll"
      @row-click="onRowClick"
    >
    </MwlTableBase>
  </div>
</template>

<script lang="ts">
import * as myTypes from "@/types";
import * as myUtils from "@/utils";
import MwlService from "@/service/MwlService";
import { useStore } from "vuex";
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

const convertDbMwlMainRowToDisplayRow = (
  index: number,
  dbMwlMain: myTypes.IDbWorklist
): myTypes.MwlMainTableRow | undefined => {
  const spsStartDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(
    myUtils.applyTimeZoneFromString(dbMwlMain.sps_start_dttm)
  );
  const spsEndDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(
    myUtils.applyTimeZoneFromString(dbMwlMain.sps_end_dttm)
  );

  if (spsStartDttm == undefined) {
    console.log("convertDbMwlMainRowToDisplayRow(err): spsStartDttm");
    return undefined;
  }

  if (spsEndDttm == undefined) {
    console.log("convertDbMwlMainRowToDisplayRow(err): spsEndDttm");
    return undefined;
  }

  if (dbMwlMain.species_code_meaning == undefined) {
    dbMwlMain.species_code_meaning = "";
  }

  if (dbMwlMain.breed_code_meaning == undefined) {
    dbMwlMain.breed_code_meaning = "";
  }

  let mwlItemRow = new myTypes.MwlMainTableRow(
    index,
    false,
    // Required
    dbMwlMain.pt_key,
    dbMwlMain.ord_key,
    dbMwlMain.sps_key,
    //
    dbMwlMain.pt_id,
    myUtils.GetDisplayFullNameFromPN(dbMwlMain.pt_name),
    dbMwlMain.pt_sex,
    dbMwlMain.pt_age, // VR: AS(Age String, 4byte char)
    myUtils.GetInputLocaleDateFormatFromString(dbMwlMain.pt_birth_dttm),
    //
    dbMwlMain.ord_acc_num,
    dbMwlMain.ord_status_flag,
    dbMwlMain.ord_study_uid,
    dbMwlMain.ord_rp_id,
    dbMwlMain.ord_priority,
    //
    dbMwlMain.sps_id,
    spsStartDttm,
    spsEndDttm,
    dbMwlMain.sps_station_ae_title,
    dbMwlMain.sps_modality,
    dbMwlMain.sps_bp_code_value,
    dbMwlMain.sps_bp_scm_design,
    dbMwlMain.sps_bp_meaning,

    // Options
    dbMwlMain.species_key,
    dbMwlMain.breed_key,
    dbMwlMain.pt_weight,
    dbMwlMain.pt_size,
    dbMwlMain.pt_address,
    dbMwlMain.pt_tel,
    dbMwlMain.pt_state,
    dbMwlMain.pt_med_alert,
    dbMwlMain.pt_allergies,
    dbMwlMain.pt_comment,
    dbMwlMain.pt_responsible_person,
    //
    dbMwlMain.ord_issuer,
    myUtils.GetInputLocaleDateTimeFormatFromDate(
      myUtils.applyTimeZoneFromString(dbMwlMain.ord_create_dttm)
    ),
    dbMwlMain.ord_requesting_phyc,
    dbMwlMain.ord_referring_phyc,
    myUtils.GetInputLocaleDateTimeFormatFromDate(
      myUtils.applyTimeZoneFromString(dbMwlMain.ord_study_dttm)
    ),
    dbMwlMain.ord_reason,
    dbMwlMain.ord_rp_desc,
    dbMwlMain.ord_pt_age,
    dbMwlMain.ord_pt_weight,
    dbMwlMain.ord_pt_size,
    //
    dbMwlMain.sps_station_name, // from sps sequence
    dbMwlMain.sps_desc, // from sps sequence
    dbMwlMain.sps_perform_phyc_name, // from sps sequence
    dbMwlMain.sps_contrast_agent,
    dbMwlMain.sps_pre_med, // from sps sequence
    //
    dbMwlMain.species_type,
    dbMwlMain.species_code_meaning,
    dbMwlMain.breed_code_meaning
  );

  return mwlItemRow;
};

export default defineComponent({
  name: "MwlMainTable",

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

    inputSeparator: {
      type: String,
      default: myTypes.dataSeparator,
    },

    // Style
    isSelectable: {
      type: Boolean,
      default: true,
    },

    isMultiSelectable: {
      type: Boolean,
      default: false,
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
  ],

  setup(props, context) {
    const store = useStore();

    const tableId = ref("mwlMainTable");

    const isSignedIn = computed(() => {
      const res = store.getters["UserModelModule/IS_SIGN_IN"];
      return res;
    });

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

    const searchedDbMwlMainList: myTypes.IDbWorklist[] = reactive([]);
    const selectedWorklistItems: myTypes.IDbWorklist[] = reactive([]);

    const initializeTable = () => {
      tableId.value = "mwl-main-table-" + props.tableStyle;

      fetchMwlMainList();
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const getTableType = computed(() => {
      const tableType = store.getters["MwlModelModule/GET_MWL_MAIN_TABLE_TYPE"];

      if (tableType == myTypes.eMwlMainTableType.table_type_mwl_main_patient) {
        return myTypes.eTableType.table_type_mwl_main_patient;
      } else if (
        tableType == myTypes.eMwlMainTableType.table_type_mwl_main_order
      ) {
        return myTypes.eTableType.table_type_mwl_main_order;
      }
      return myTypes.eTableType.table_type_mwl_main_sps;
    });

    const getMwlMainColumns = computed(() => {
      const srvInfo: myTypes.IWebServerInfo =
        store.getters["AppModelModule/GET_SERVER_INFO"];

      if (srvInfo.license_type == myTypes.eLicenseType.Human) {
        if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_patient
        ) {
          return translateColumns(myTypes.mwlMainPatientColumnListForHuman);
        } else if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_order
        ) {
          return translateColumns(myTypes.mwlMainOrderColumnListForHuman);
        } else {
          return translateColumns(myTypes.mwlMainSpsColumnListForHuman);
        }
      } else {
        if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_patient
        ) {
          return translateColumns(myTypes.mwlMainPatientColumnListForVet);
        } else if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_order
        ) {
          return translateColumns(myTypes.mwlMainOrderColumnListForVet);
        } else {
          return translateColumns(myTypes.mwlMainSpsColumnListForVet);
        }
      }
    });

    const getMwlMainRows = computed(() => {
      let displayRow: myTypes.MwlMainTableRow | undefined;
      let displayRowList: myTypes.MwlMainTableRow[] = [];

      let iterator = 0;

      for (let mwlItem of searchedDbMwlMainList) {
        if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_patient
        ) {
          if (
            displayRowList.find((row) => row.pt_key == mwlItem.pt_key) !=
            undefined
          ) {
            continue;
          }
        } else if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_order
        ) {
          if (
            displayRowList.find((row) => row.ord_key == mwlItem.ord_key) !=
            undefined
          ) {
            continue;
          }
        }

        displayRow = convertDbMwlMainRowToDisplayRow(iterator, mwlItem);

        if (displayRow == undefined) continue;

        displayRowList.push(displayRow);

        iterator++;
      }

      return displayRowList;
    });

    const onRowSelectAll = (isSelect) => {
      context.emit("select-all", isSelect);
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

      while (selectedWorklistItems.length > 0) {
        selectedWorklistItems.pop();
      }

      for (let item of searchedDbMwlMainList) {
        if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_patient
        ) {
          if (params.row.pt_key == item.pt_key) {
            selectedWorklistItems.push(item);
          }
        } else if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_order
        ) {
          if (params.row.ord_key == item.ord_key) {
            selectedWorklistItems.push(item);
          }
        } else if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_sps
        ) {
          if (params.row.sps_key == item.sps_key) {
            selectedWorklistItems.push(item);
          }
        }
      }

      const res: myTypes.ITableRowState = {
        index: params.pageIndex,
        id: params.row.id,
        isSelected: params.selected,
      };

      store.dispatch(
        "MwlModelModule/setSelectedMwlMainTableItems",
        selectedWorklistItems
      );

      context.emit("row-click", res);
    };

    const onUpdateRow = (row: myTypes.MwlMainTableRow) => {
      let displayRow: myTypes.MwlMainTableRow | undefined;
      let displayRowList: myTypes.MwlMainTableRow[] = [];

      let iterator = 0;

      for (let mwlItem of searchedDbMwlMainList) {
        if (iterator == row.index) {
          displayRowList.push(row);
        } else {
          displayRow = convertDbMwlMainRowToDisplayRow(iterator, mwlItem);

          if (displayRow == undefined) continue;

          displayRowList.push(displayRow);

          iterator++;
        }
      }
    };

    async function fetchMwlMainList() {
      const reqQuery: myTypes.IMwlGetWorklistQueryCondition =
        store.getters["MwlModelModule/GET_MWL_SEARCH_CONDITION"];

      const res = await MwlService.GetWorklist(reqQuery);

      let { result, data } = res.data;

      while (searchedDbMwlMainList.length > 0) {
        searchedDbMwlMainList.pop();
      }

      if (result === true) {
        if (isSignedIn.value) {
          for (const mwlItem of data) {
            searchedDbMwlMainList.push(mwlItem);
          }
        } else {
          console.log("fetchMwlMainList) Not signed-In");
        }
      } else {
        console.log("fetchMwlMainList) No Items");
      }

      let displayRow: myTypes.MwlMainTableRow | undefined;
      let displayRowList: myTypes.MwlMainTableRow[] = [];
      let iterator = 0;

      for (let mwlMain of searchedDbMwlMainList) {
        displayRow = convertDbMwlMainRowToDisplayRow(iterator, mwlMain);

        if (displayRow == undefined) continue;

        displayRowList.push(displayRow);

        iterator++;
      }
    }

    onMounted(() => {
      initializeTable();
    });

    const getMwlAllRows = computed(() => {
      let displayRow: myTypes.MwlMainTableRow | undefined;
      let displayRowList: myTypes.MwlMainTableRow[] = [];

      let iterator = 0;

      for (let mwlItem of searchedDbMwlMainList) {
        if (
          getTableType.value == myTypes.eTableType.table_type_mwl_main_patient
        ) {
          if (
            displayRowList.find((row) => row.ord_key == mwlItem.ord_key) !=
            undefined
          ) {
            continue;
          }
        }

        displayRow = convertDbMwlMainRowToDisplayRow(iterator, mwlItem);

        if (displayRow == undefined) continue;

        displayRowList.push(displayRow);

        iterator++;
      }
      return displayRowList;
    });

    return {
      tableId,

      getTableType,
      getMwlMainColumns,
      getMwlMainRows,

      onUpdateRow,
      onRowSelectAll,
      onRowClick,

      getMwlAllRows,
    };
  },

  methods: {},
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/table.scss";
</style>
