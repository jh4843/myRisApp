<template>
  <div :id="tableId">
    <MwlTableBase
      :tableId="tableId"
      :tableType="tableType"
      :columns="getPatientColumns"
      :rows="getPatientRows"
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
import { useStore } from "vuex";

import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  watch,
} from "vue";
import MwlTableBase from "@/components/table/MwlTableBase.vue";

const convertDbPatientRowToDisplayRow = (
  index: number,
  dbPatient: myTypes.IDbPatient
): myTypes.PatientTableRow => {
  let patientRow = new myTypes.PatientTableRow(
    index,
    dbPatient.pt_key,
    dbPatient.pt_id,
    myUtils.GetDisplayFullNameFromPN(dbPatient.pt_name),
    dbPatient.pt_sex,
    dbPatient.pt_age, // age
    myUtils.GetInputLocaleDateFormatFromDate(dbPatient.pt_birth_dttm),
    dbPatient.pt_weight, // weight
    dbPatient.pt_size, // size
    dbPatient.pt_address, // address
    dbPatient.pt_tel, // tel
    dbPatient.pt_state, // state
    dbPatient.pt_med_alert, // med_alert
    dbPatient.pt_allergies, // allergies
    dbPatient.pt_comment, // comment
    dbPatient.pt_responsible_person,
    dbPatient.pt_species_key,
    dbPatient.pt_breed_key,
    myTypes.parseSpeciesType(dbPatient.species_type),
    dbPatient.species_code_value,
    dbPatient.species_scm_design,
    dbPatient.species_code_meaning,
    dbPatient.breed_code_value,
    dbPatient.breed_scm_design,
    dbPatient.breed_code_meaning
  );

  return patientRow;
};

export default defineComponent({
  name: "PatientTable",

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
    const store = useStore();

    const tableId = ref("patient-table");
    const tableType = ref(myTypes.eTableType.table_type_mwl_patient);

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

    const queryCondition: myTypes.IMwlGetPatientListQueryCondition = reactive({
      pt_id: "",
      pt_name: "",

      is_strict_condition: false,
    });

    const searchedPatientList: myTypes.IDbPatient[] = reactive([]);

    const initializeTable = () => {
      fetchPatientList(queryCondition);
    };

    watch(
      () => props.needUpdate,
      () => {
        initializeTable();
      }
    );

    const isHumanLicense = computed(() => {
      const srvInfo: myTypes.IWebServerInfo =
        store.getters["AppModelModule/GET_SERVER_INFO"];

      return srvInfo.license_type == myTypes.eLicenseType.Human ? true : false;
    });

    const getPatientColumns = computed(() => {
      return translateColumns(myTypes.patientColumnList);
    });

    const getPatientRows = computed(() => {
      let displayRow: myTypes.PatientTableRow;
      let displayRowList: myTypes.PatientTableRow[] = [];

      let iterator = 0;
      for (let patient of searchedPatientList) {
        displayRow = convertDbPatientRowToDisplayRow(iterator, patient);

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

      let patientTableRow = new myTypes.PatientTableRow(
        params.row.index,
        params.row.pt_key,
        params.row.pt_id,
        params.row.pt_name,
        params.row.pt_sex,
        params.row.pt_age,
        params.row.pt_birth_dttm,
        params.row.pt_weight,
        params.row.pt_size,
        params.row.pt_address,
        params.row.pt_tel,
        params.row.pt_state,
        params.row.pt_med_alert,
        params.row.pt_allergies,
        params.row.pt_comment,
        params.row.pt_responsible_person,
        params.row.pt_species_key,
        params.row.pt_breed_key,
        params.row.species_type,
        params.row.species_code_value,
        params.row.species_scm_design,
        params.row.species_code_meaning,
        params.row.breed_code_value,
        params.row.breed_scm_design,
        params.row.breed_code_meaning
      );

      let selRes: myTypes.IDbPatient[] = [];
      if (patientTableRow != undefined) {
        selRes.push(patientTableRow.convertToDbInfo());
      }

      context.emit("selected-rows-change", selRes);

      return selRes;
    };

    // multiple select (isMultipleSelect == true)
    const onSelChanged = (params) => {
      if (params.selectedRows.length > 0) {
        let selRes: myTypes.IDbPatient[] = [];

        params.selectedRows.forEach((row) => {
          if (row.vgtSelected == true) {
            selRes.push({
              pt_key: row.pt_key,
              pt_id: row.pt_id,
              pt_name: row.pt_name,
              pt_sex: row.pt_sex,
              pt_age: row.pt_age,
              pt_birth_dttm: row.pt_birth_dttm,
              pt_weight: row.pt_weight,
              pt_size: row.pt_size,
              pt_address: row.pt_address,
              pt_tel: row.pt_tel,
              pt_state: row.pt_state,
              pt_med_alert: row.pt_med_alert,
              pt_allergies: row.pt_allergies,
              pt_comment: row.pt_comment,
            });
          }
        });

        context.emit("selected-rows-change", selRes);
      }
    };

    async function fetchPatientList(
      reqQuery: myTypes.IMwlGetPatientListQueryCondition
    ) {
      const res = await MwlService.GetPatientList(reqQuery);

      let { result, data } = res.data;

      while (searchedPatientList.length > 0) {
        searchedPatientList.pop();
      }

      if (result === true) {
        for (const patient of data) {
          searchedPatientList.push(patient);
        }
      } else {
        console.log("No Patient Data: ", reqQuery);
      }
    }

    onMounted(() => {
      initializeTable();
    });

    return {
      tableId,
      tableType,
      searchedPatientList,

      isHumanLicense,
      getPatientColumns,
      getPatientRows,
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
