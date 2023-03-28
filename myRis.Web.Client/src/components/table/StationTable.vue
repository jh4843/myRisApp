<template>
  <div :id="tableId">
    <MwlTableBase
      :tableId="tableId"
      :tableType="tableType"
      :columns="getStationColumns"
      :rows="getStationRows"
      :isDropdownAllowAll="isDropdownAllowAll"
      :needUpdate="needUpdate"
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
} from "vue";
import MwlTableBase from "@/components/table/MwlTableBase.vue";

const convertDbStationToTableRow = (
  index: number,
  dbStation: myTypes.IDbStation
): myTypes.IStationTableRow => {
  let stationRow = new myTypes.StationTableRow(
    index,
    dbStation.station_ae_title,
    dbStation.station_name
  );

  return stationRow;
};

export default defineComponent({
  name: "UserSettingStationTable",

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
  },

  emits: ["selected-rows-change"],

  setup(props, context) {
    const tableId = ref("userSettingStationTable");
    const tableType = ref(myTypes.eTableType.table_type_mwl_station);
    const queryStationAeTitle = ref("");
    const queryStationName = ref("");

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

    const searchedStationList: myTypes.IDbStation[] = reactive([]);

    const initializeTable = () => {
      fetchStationList(
        queryStationAeTitle.value,
        queryStationName.value,
        false
      );
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const getStationColumns = computed(() => {
      return translateColumns(myTypes.stationColumnList);
    });

    const getStationRows = computed(() => {
      let displayRow: myTypes.StationTableRow;
      let displayRowList: myTypes.StationTableRow[] = [];

      let iterator = 0;
      for (let station of searchedStationList) {
        displayRow = convertDbStationToTableRow(iterator, station);
        displayRowList.push(displayRow);
        iterator++;
      }

      return displayRowList;
    });

    const onSelChanged = (params) => {
      if (params.selectedRows.length > 0) {
        let selRes: myTypes.IDbStation[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            selRes.push({
              station_key: -1,
              station_ae_title: row.station_ae_title,
              station_name: row.station_name,
            });
          }
        });

        context.emit("selected-rows-change", selRes);
      }
    };

    async function fetchStationList(
      stationAeTitle: string,
      stationName: string,

      isStrict: boolean
    ) {
      let reqQuery: myTypes.IMwlGetStationListQueryCondition = {
        station_ae_title: stationAeTitle,
        station_name: stationName,

        is_strict_condition: isStrict,
      };

      const res = await MwlService.GetStationList(reqQuery);

      let { result, data } = res.data;

      while (searchedStationList.length > 0) {
        searchedStationList.pop();
      }

      if (result === true) {
        for (const station of data) {
          searchedStationList.push(station);
        }
      } else {
        console.log("No Station Data: ", reqQuery);
      }
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,
      queryStationAeTitle,
      queryStationName,

      getStationColumns,
      getStationRows,
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
