<template>
  <div class="mwl-table-base" :class="{ 'drop-zone': isNavigatable }">
    <LabelBase
      class="mwl-table-base__title"
      v-show="title != '' ? true : false"
      :displayText="title"
      markType="space"
    />
    <VueGoodTable
      :columns="getColumns"
      :rows="getRows"
      :search-options="{
        enabled: isSearchable,
        trigger: 'enter',
      }"
      :sort-options="{
        enabled: isSortable,
      }"
      :select-options="{
        enabled: isCheckboxStyle,
        disableSelectInfo: true,
        selectionInfoClass: 'sel-info-class',
        selectionText: 'selected',
        clearSelectionText: 'clear',
        selectAllByGroup: isMultipleSelect,
      }"
      :pagination-options="{
        enabled: isPagenable,
        mode: 'pages',
        dropdownAllowAll: isAllowDropDownListAll,
        perPage: getDefaultPage,
        perPageDropdown: perPageDropdown,
      }"
      @search="onSearch"
      @row-click="onRowSelect"
      @select-all="onRowSelectAll"
      @selected-rows-change="onSelChanged"
      :row-style-class="rowClass"
      theme="Polar-bear"
      styleClass="vgt-table striped"
    >
      <template #emptystate>
        <div v-if="!isSignedIn">Need to sign in.</div>
        <div v-else>There are no data.</div>
      </template>
      <template #table-row="props">
        <div
          v-if="props.column.field == 'nav_button'"
          class="mwl-table-base__grip-lines"
          :id="props.row.id"
          draggable="true"
          dropzone="move"
          @dragstart="onHandleDragStart($event, props.row)"
          @dragover.prevent
          @dragenter.prevent
          @drop="onHandleDrop($event, props.row)"
        >
          <button class="mwl-table-base__grip-lines__button">
            <svg
              class="mwl-table-base__grip-lines__button__image"
              viewBox="0 0 448 512"
              style="background-color: transparent"
            >
              <path
                d="M 16 132 h 416 c 8.837 0 16 -7.163 16 -16 V 76 c 0 -8.837 -7.163 -16 -16 -16 H 16 C 7.163 60 0 67.163 0 76 v 40 c 0 8.837 7.163 16 16 16 Z m 0 160 h 416 c 8.837 0 16 -7.163 16 -16 v -40 c 0 -8.837 -7.163 -16 -16 -16 H 16 c -8.837 0 -16 7.163 -16 16 v 40 c 0 8.837 7.163 16 16 16 Z m 0 160 h 416 c 8.837 0 16 -7.163 16 -16 v -40 c 0 -8.837 -7.163 -16 -16 -16 H 16 c -8.837 0 -16 7.163 -16 16 v 40 c 0 8.837 7.163 16 16 16 Z"
              />
            </svg>
          </button>
        </div>
        <div
          v-if="props.column.field == 'expand_btn'"
          class="mwl-table-base__expand-btn"
          :class="{ expanded: props.row.isExpand }"
          :id="props.row.id"
        >
          <button
            class="mwl-table-base__expand-btn__button"
            v-if="props.row.isExpand"
            @click="onHandleExpand($event, props.row)"
          >
            <svg
              width="14px"
              height="14px"
              viewBox="0 0 50 50"
              style="background-color: white; overflow: auto"
            >
              <line
                fill="none"
                stroke="#000000"
                stroke-miterlimit="10"
                stroke-width="4"
                x1="9"
                x2="41"
                y1="25"
                y2="25"
              />
            </svg>
          </button>
          <button
            class="mwl-table-base__expand-btn__button"
            v-if="!props.row.isExpand"
            @click="onHandleExpand($event, props.row)"
          >
            <svg
              width="14px"
              height="14px"
              viewBox="0 0 50 50"
              style="background-color: white; overflow: auto"
            >
              <line
                fill="none"
                stroke="#000000"
                stroke-miterlimit="10"
                stroke-width="4"
                x1="9"
                x2="41"
                y1="25"
                y2="25"
              />
              <line
                fill="none"
                stroke="#000000"
                stroke-miterlimit="10"
                stroke-width="4"
                x1="25"
                x2="25"
                y1="9"
                y2="41"
              />
            </svg>
          </button>
          <div
            v-if="props.row.isExpand"
            class="mwl-table-base__expand-btn__sub-table"
          >
            <PopupTable
              :style="{ width: subTableWidth, height: subTableHeight }"
              :isSelectable="isSelectable"
              :columns="getExpandedColumns()"
              :rows="getExpandedRows(props.row)"
              @on-row-click="onHandleClickPopupSubTable"
            />
          </div>
        </div>
        <div
          v-if="props.column.field == 'station_ae_title' && isSchedulingTable"
        >
          <DropDownBase
            class="mwl-table-base__ae-title-list"
            v-model="props.row.station_ae_title"
            placeholder="Station AE Title"
            :options="getStationAeTitleList"
            inputStyle="table"
            :isNoneBorder="isNoneBorder"
            @popup="onHandlePopup"
            @onTextChanged="
              onHandleSpsChanged('StationAeTitle', props.row, $event)
            "
          />
        </div>
        <div
          v-else-if="
            props.column.field == 'perform_phyc_name' && isSchedulingTable
          "
        >
          <DropDownBase
            class="mwl-table-base__perform_phyc_nam"
            v-model="props.row.perform_phyc_name"
            placeholder="Perf. Physician"
            :options="getPhysicianNameList"
            inputStyle="table"
            :isNoneBorder="isNoneBorder"
            @popup="onHandlePopup"
            @onTextChanged="
              onHandleSpsChanged('PerformPhysician', props.row, $event)
            "
          />
        </div>
        <div
          v-else-if="props.column.field == 'start_dttm' && isSchedulingTable"
        >
          <DatePickerBase
            class="mwl-table-base__start_dttm"
            v-model="props.row.start_dttm"
            calMode="dateTime"
            dataType="Locale"
            displayType="Locale"
            inputStyle="table"
            :isNoneBorder="isNoneBorder"
            fontSize="11px"
            @update:modelValue="
              onHandleSpsChanged('StartDttm', props.row, $event)
            "
            @show-calendar="onHandlePopup"
          />
        </div>
        <div v-else-if="props.column.field == 'end_dttm' && isSchedulingTable">
          <DatePickerBase
            class="mwl-table-base__end_dttm"
            v-model="props.row.end_dttm"
            calMode="dateTime"
            dataType="Locale"
            displayType="Locale"
            inputStyle="table"
            :isNoneBorder="isNoneBorder"
            fontSize="11px"
            @update:modelValue="
              onHandleSpsChanged('EndDttm', props.row, $event)
            "
            @show-calendar="onHandlePopup"
          />
        </div>
        <div v-else-if="props.column.field == 'ord_status_flag'">
          <div
            v-if="props.row.ord_status_flag == 'COMPLETED'"
            style="color: blue"
          >
            {{ props.row.ord_status_flag }}
          </div>
          <div
            v-else-if="props.row.ord_status_flag == 'CANCELED'"
            style="color: red"
          >
            {{ props.row.ord_status_flag }}
          </div>
          <div v-else style="font-weight: bold">
            {{ props.row.ord_status_flag }}
          </div>
        </div>
      </template>
    </VueGoodTable>
  </div>
</template>

<script lang="ts">
import * as myTypes from "@/types";
import MwlService from "@/service/MwlService";
import UserService from "@/service/UserService";

import {
  defineComponent,
  PropType,
  onMounted,
  onUnmounted,
  ref,
  reactive,
  watch,
  computed,
} from "vue";

import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import { useStore } from "vuex";

import LabelBase from "@/components/label/LabelBase.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";
import DatePickerBase from "@/components/calendar/DatePickerBase.vue";
import PopupTable from "@/components/table/PopupTable.vue";

type tEditableType =
  | "StationAeTitle"
  | "StationName"
  | "PerformPhysician"
  | "StartDttm"
  | "EndDttm";

export default defineComponent({
  name: "MwlTableBase",

  components: {
    VueGoodTable,
    LabelBase,
    DropDownBase,
    DatePickerBase,
    PopupTable,
  },

  props: {
    tableId: {
      type: String,
    },

    tableType: {
      type: Number as PropType<myTypes.eTableType>,
      default: myTypes.eTableType.table_type_none,
    },

    title: {
      type: String,
      default: "",
    },

    // Style
    isSelectable: {
      type: Boolean,
      default: true,
    },

    isMultipleSelect: {
      type: Boolean,
      default: true,
    },

    isSearchable: {
      type: Boolean,
      default: true,
    },

    isPagenable: {
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

    // for Scheduling
    isSchedulingTable: {
      type: Boolean,
      defaulit: false,
    },

    needUpdate: {
      type: Boolean,
      default: false,
    },

    defaultPage: {
      type: Number,
      default: 0,
    },

    perPageDropdown: {
      type: Array as PropType<number[]>,
      default: () => [10, 5],
    },

    columns: {
      type: Array as PropType<myTypes.ICommonTableColumnOnlyTable[]>,
      default: () => [],
    },

    rows: {
      type: Array,
      default: () => [],
    },

    mwlTableRows: {
      type: Array as PropType<myTypes.MwlMainTableRow[]>,
      default: () => [],
    },
  },

  emits: [
    "selected-rows-change",
    "row-click",
    "select-all",
    "row-order-change",
    "popup",
    "update:row",
  ],

  setup(props, context) {
    const store = useStore();
    const initializeTable = () => {
      clearAllSelect();

      AsyncGetStationList({
        is_strict_condition: false,
      });

      AsyncGetPhysicianList();
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const isSignedIn = computed(() => {
      const res = store.getters["UserModelModule/IS_SIGN_IN"];
      return res;
    });

    const isAllowDropDownListAll = ref(
      props.isDropdownAllowAll || props.isNavigatable
    );

    const isCheckboxStyle = computed(() => {
      if (props.isSelectable && props.isMultipleSelect) return true;

      return false;
    });

    const getColumns = computed(() => {
      let resColumn: myTypes.ICommonTableColumnOnlyTable[] = [];

      for (const column of props.columns) {
        resColumn.push(column);
      }

      if (props.isNavigatable) {
        const naviCalumn: myTypes.ICommonTableColumnOnlyTable = {
          id: props.columns.length,
          label: "",
          field: "nav_button",
          type: "text",
          html: true,
          tdClass: "nav-button",
          hidden: false,
        };

        resColumn.push(naviCalumn);
      }
      return resColumn;
    });

    const getRows = computed(() => {
      return props.rows;
    });

    const rowClass = ref(
      props.isNavigatable ? "row-class drag-element" : "row-class"
    );

    const getDefaultPage = computed(() => {
      if (props.defaultPage > 0) {
        return props.defaultPage;
      } else if (props.perPageDropdown.length > 0) {
        return props.perPageDropdown[0];
      } else {
        return 10;
      }
    });

    const onSearch = (searchTerm: number, rowCount: number) => {
      console.log(typeof searchTerm + " , " + rowCount);
    };

    const selectAll = () => {
      let tableElement: HTMLElement | null = null;

      if (props.tableId != undefined && props.tableId != null) {
        tableElement = document.getElementById(props.tableId);
      }

      if (tableElement != null) {
        for (const item of tableElement.getElementsByClassName("row-class")) {
          item.className = rowClass.value + " selected";
        }
      } else {
        for (const item of document.getElementsByClassName("row-class")) {
          item.className = rowClass.value + " selected";
        }
      }
    };

    const clearAllSelect = () => {
      let tableElement: HTMLElement | null = null;

      if (props.tableId != undefined && props.tableId != null) {
        tableElement = document.getElementById(props.tableId);
      }

      if (tableElement != null) {
        for (const item of tableElement.getElementsByClassName("row-class")) {
          item.className = rowClass.value;
        }
      } else {
        for (const item of document.getElementsByClassName("row-class")) {
          item.className = rowClass.value;
        }
      }
    };

    const onRowSelectAll = (params) => {
      if (params.selected) {
        selectAll();
      } else {
        clearAllSelect();
      }
      context.emit("select-all", params.selected);
    };

    const onRowSelect = (params) => {
      if (params.row == undefined) {
        return;
      }

      const index = params.pageIndex;
      const isSelect = params.selected;
      let tableElement: HTMLElement | null = null;

      if (props.tableId != undefined && props.tableId != null) {
        tableElement = document.getElementById(props.tableId);
      }

      if (!props.isMultipleSelect) {
        clearAllSelect();

        if (tableElement != null) {
          tableElement.getElementsByClassName("row-class")[index].className =
            rowClass.value + " selected";
        } else {
          document.getElementsByClassName("row-class")[index].className =
            rowClass.value + " selected";
        }
      } else {
        if (tableElement != null) {
          if (isSelect) {
            tableElement.getElementsByClassName("row-class")[index].className =
              rowClass.value + " selected";
          } else {
            tableElement.getElementsByClassName("row-class")[index].className =
              rowClass.value;
          }
        } else {
          if (isSelect) {
            document.getElementsByClassName("row-class")[index].className =
              rowClass.value + " selected";
          } else {
            document.getElementsByClassName("row-class")[index].className =
              rowClass.value;
          }
        }
      }
      context.emit("row-click", params);
    };

    const onSelChanged = (params) => {
      context.emit("selected-rows-change", params);
    };

    const subTableWidth = ref("100%");
    const subTableHeight = ref("100%");

    const getExpandedColumns = () => {
      if (props.tableType == myTypes.eTableType.table_type_mwl_main_patient) {
        return myTypes.popupOrderColumnList;
      }

      return myTypes.popupSpsColumnList;
    };

    const getExpandedRows = (row: myTypes.MwlMainTableRow) => {
      let rows: myTypes.MwlMainTableRow[] = [];

      if (props.tableType == myTypes.eTableType.table_type_mwl_main_patient) {
        for (let mwlRow of props.mwlTableRows) {
          if (mwlRow.pt_key == row.pt_key) {
            rows.push(mwlRow);
          }
        }
      } else {
        for (let mwlRow of props.mwlTableRows) {
          if (mwlRow.ord_key == row.ord_key) {
            rows.push(mwlRow);
          }
        }
      }

      return rows;
    };

    const onHandleExpand = (event, row) => {
      row.isExpand = !row.isExpand;
    };

    const isGrabbable = ref(false);

    const onHandleDragStart = (event, item) => {
      isGrabbable.value = true;

      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("srcIndex", item.originalIndex);

      console.log("Drag Start: ", event, item);
    };

    const onHandleDrop = (event, item) => {
      isGrabbable.value = false;

      const srcIndex = event.dataTransfer.getData("srcIndex");
      const destIndex = item.originalIndex;

      console.log("Drop: ", event, srcIndex, destIndex);

      context.emit("row-order-change", srcIndex, destIndex);
    };

    const onHandleSpsChanged = (type: tEditableType, row, data) => {
      let tempVal;

      switch (type) {
        case "StationAeTitle":
          tempVal = stationList.find(
            (station) => station.station_ae_title == data
          )?.station_name;
          row.station_name = tempVal;
          break;
        case "StationName":
          break;
        case "PerformPhysician":
          break;
        case "StartDttm":
          row.start_dttm = data;
          break;
        case "EndDttm":
          row.end_dttm = data;
          break;
      }

      context.emit("update:row", row);
    };

    const onHandlePopup = (state: boolean) => {
      context.emit("popup", state);
    };

    const onHandleClickPopupSubTable = (row) => {
      console.log("onHandleClickPopupSubtable: ", props.tableType, row);
    };

    const isNoneBorder = ref(true);

    // [DropDown] For Station
    const stationList: myTypes.IDbStation[] = reactive([]);

    async function AsyncGetStationList(
      reqQuery: myTypes.IMwlGetStationListQueryCondition
    ) {
      const res = await MwlService.GetStationList(reqQuery);
      const { result, data } = res.data;

      while (stationList.length > 0) {
        stationList.pop();
      }

      if (result == true) {
        for (const station of data) {
          stationList.push(station);
        }
      }
    }

    const getStationAeTitleList = computed(() => {
      let stationAeTitleList: string[] = ["(none)"];

      for (const station of stationList) {
        stationAeTitleList.push(station.station_ae_title);
      }

      return stationAeTitleList;
    });

    // [DropDown] For Physician
    const physicianList: myTypes.IDbUser[] = reactive([]);

    async function AsyncGetPhysicianList() {
      const reqQuery: myTypes.IUserGetUserQueryCondition = {
        user_level: myTypes.eUserLevel.Physician,
        is_strict_condition: false,
      };

      const res = await UserService.GetUser(reqQuery);
      const { result, users } = res.data;

      while (physicianList.length > 0) {
        physicianList.pop();
      }

      if (result == true) {
        for (const user of users) {
          physicianList.push(user);
        }
      }
    }

    const getPhysicianNameList = computed(() => {
      let res: string[] = [];

      for (const physician of physicianList) {
        res.push(physician.user_name);
      }

      return res;
    });

    const keyupMonitor = (event) => {
      if (event.key == "Escape") {
        clearAllSelect();
      }
    };

    onMounted(() => {
      initializeTable();
      document.addEventListener("keyup", keyupMonitor);
    });

    onUnmounted(() => {
      document.removeEventListener("keyup", keyupMonitor);
    });

    return {
      isSignedIn,
      isAllowDropDownListAll,
      isCheckboxStyle,
      getColumns,
      getRows,
      rowClass,
      getDefaultPage,

      onSearch,
      onRowSelect,
      onRowSelectAll,
      onSelChanged,

      subTableWidth,
      subTableHeight,
      getExpandedColumns,
      getExpandedRows,
      onHandleExpand,

      isGrabbable,
      onHandleDragStart,
      onHandleDrop,

      isNoneBorder,

      // Station
      stationList,
      getStationAeTitleList,

      // Physician
      physicianList,
      getPhysicianNameList,

      onHandleSpsChanged,
      onHandlePopup,
      onHandleClickPopupSubTable,
    };
  },

  methods: {},
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/table";
</style>
