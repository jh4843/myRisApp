<template>
  <div class="mwl-search-drawer">
    <div class="mwl-search-drawer__patient">
      <h2>{{ $t("Patient") }}</h2>
      <div class="mwl-search-drawer__patient__name">
        <!-- <h3>Pt.Name</h3> -->
        <LabelBase
          class="mwl-search-drawer__patient__name__label"
          horizontalAlign="flex-start"
          displayText="Pt Name"
        />
        <TextInputBox placeholder="*" v-model="msgPatientName" />
      </div>
      <div class="mwl-search-drawer__patient__id">
        <LabelBase
          class="mwl-search-drawer__patient__id__label"
          horizontalAlign="flex-start"
          displayText="Pt ID"
        />
        <TextInputBox placeholder="*" v-model="msgPatientId" />
      </div>
    </div>
    <div class="mwl-search-drawer__splitter">
      <BasicSplitter
        width="100%"
        height="1px"
        normalLineColor="#d8d8d8"
        activeLineColor="#808080"
      />
    </div>
    <div class="mwl-search-drawer__start-date">
      <h2>{{ $t("SPS Start Dttm") }}</h2>
      <div class="mwl-search-drawer__start-date__from">
        <LabelBase
          class="mwl-search-drawer__start-date__from__label"
          horizontalAlign="flex-start"
          displayText="From"
        />
        <DatePickerBase
          placeholder="*"
          v-model="msgSpsDttmFrom"
          calMode="dateTime"
          dataType="Locale"
          displayType="Locale"
        />
      </div>
      <div class="mwl-search-drawer__start-date__to">
        <LabelBase
          class="mwl-search-drawer__start-date__to__label"
          horizontalAlign="flex-start"
          displayText="To"
        />
        <DatePickerBase
          placeholder="*"
          v-model="msgSpsDttmTo"
          :minDttm="getMinDttmOfSpsDttmTo"
          timeAdjust="23:59:59"
          calMode="dateTime"
          dataType="Locale"
          displayType="Locale"
        />
      </div>
    </div>
    <div class="mwl-search-drawer__splitter">
      <BasicSplitter
        width="100%"
        height="1px"
        normalLineColor="#d8d8d8"
        activeLineColor="#808080"
      />
    </div>
    <div class="mwl-search-drawer__order">
      <h2>{{ $t("Order") }}</h2>
      <div class="mwl-search-drawer__order__acc-no">
        <LabelBase
          class="mwl-search-drawer__order__acc-no__label"
          horizontalAlign="flex-start"
          displayText="Acc No."
        />
        <TextInputBox placeholder="*" v-model="msgOrdAccNo" />
      </div>
      <div class="mwl-search-drawer__order__status">
        <LabelBase
          class="mwl-search-drawer__order__status__label"
          horizontalAlign="flex-start"
          displayText="Ord.Status"
        />
        <DropDownBase
          placeholder="*"
          v-model="msgOrdStatus"
          :options="ordStatusOptions"
        />
      </div>
      <div class="mwl-search-drawer__order__modality">
        <LabelBase
          class="mwl-search-drawer__order__modality__label"
          horizontalAlign="flex-start"
          displayText="Modality"
        />
        <DropDownBase
          placeholder="*"
          v-model="msgModality"
          :options="modalityOptions"
        />
      </div>
      <div class="mwl-search-drawer__order__req-proc-id">
        <LabelBase
          class="mwl-search-drawer__order__req-proc-id__label"
          horizontalAlign="flex-start"
          displayText="Req.Proc.ID"
        />
        <TextInputBox placeholder="*" v-model="msgReqProcId" />
      </div>
      <div class="mwl-search-drawer__order__ref-phys">
        <LabelBase
          class="mwl-search-drawer__order__ref-phys__label"
          horizontalAlign="flex-start"
          displayText="Ref. Physician"
        />
        <TextInputBox placeholder="*" v-model="msgRefPhysician" />
      </div>
    </div>
    <div class="mwl-search-drawer__search-buttons-container">
      <SvgBaseIcon
        iconName="Clear"
        viewBox="0, 0, 20, 20"
        width="30px"
        height="30px"
        @click.prevent="OnClickClearButton()"
      >
        <template v-slot:back-ground>
          <CircleBackground />
        </template>
        <template v-slot:default>
          <Clear />
        </template>
      </SvgBaseIcon>
      <TextButton
        text="Search"
        buttonStyle="primary"
        fontSize="16px"
        @click.prevent="onClickSearchButton()"
      />
    </div>
    <div class="mwl-search-drawer__splitter">
      <BasicSplitter
        width="100%"
        height="1px"
        normalLineColor="#d8d8d8"
        activeLineColor="#808080"
      />
    </div>
    <div class="mwl-search-drawer__recent-search">
      <h2>{{ $t("Recent Search") }}</h2>
      <div class="mwl-search-drawer__recent-search__first-row">
        <TextButton
          text="Today"
          buttonStyle="sub1"
          fontSize="13px"
          @click.prevent="onClickTodayButton()"
        />
        <TextButton
          text="Yesterday"
          buttonStyle="sub1"
          fontSize="13px"
          @click.prevent="onClickYesterdayButton()"
        />
      </div>
      <div class="mwl-search-drawer__recent-search__sec-row">
        <TextButton
          text="Last 7 days"
          buttonStyle="sub1"
          fontSize="13px"
          @click.prevent="onClickLastWeekButton()"
        />
        <TextButton
          text="Last 1 month"
          buttonStyle="sub1"
          fontSize="13px"
          @click.prevent="onClickLastMonthButton()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CircleBackground from "@/assets/etc/CircleBackground.vue";
// Clear
import Clear from "@/assets/etc/ClearIcon.vue";
import LabelBase from "@/components/label/LabelBase.vue";
import TextButton from "@/components/button/TextButton.vue";
import DatePickerBase from "@/components/calendar/DatePickerBase.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";
import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import BasicSplitter from "@/components/splitter/BasicSplitter.vue";
//
import * as myTypes from "@/types";
import * as myUtils from "@/utils/";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

enum eSpsStartDuration {
  eDurationToday = 0,
  eDurationYesterday = 1,
  eDurationLastWeek = 2,
  eDurationLastMonth = 3,
}

export default defineComponent({
  name: "MwlSearchDrawer",

  components: {
    DropDownBase,
    LabelBase,
    TextButton,
    TextInputBox,
    DatePickerBase,
    BasicSplitter,
    SvgBaseIcon,
    Clear,
    CircleBackground,
  },

  props: {},

  setup() {
    // Patient
    const msgPatientName = ref("");
    const msgPatientId = ref("");
    // Order
    const msgOrdAccNo = ref("");
    const msgOrdStatus = ref("");
    const msgReqProcId = ref("");
    const msgRefPhysician = ref("");
    // SPS
    const msgModality = ref("");
    const msgSpsDttmFrom = ref("");
    const msgSpsDttmTo = ref("");

    // Configuration
    const modalityOptions = reactive(myTypes.getSupportModalities(true));
    const ordStatusOptions = computed(() => {
      let res = Object.keys(myTypes.eOrderStatus).filter(checkStatus);

      if (res.length > 0) {
        const index = res.indexOf("NONE");
        res[index] = "*";
      }

      return res;
    });

    function checkStatus(status) {
      if (
        isNaN(Number(status)) &&
        status.toString() != "ORDERED" &&
        status.toString() != "MATCHED" &&
        status.toString() != "EXAMINED"
      ) {
        return true;
      }

      return false;
    }

    const getMinDttmOfSpsDttmTo = computed(() => {
      if (msgSpsDttmFrom.value == undefined || msgSpsDttmFrom.value == "")
        return undefined;

      return msgSpsDttmFrom.value;
    });

    const store = useStore();

    let searchMwlList = () => {
      const getOrgSearchCondition: myTypes.IMwlGetWorklistQueryCondition =
        store.getters["MwlModelModule/GET_MWL_SEARCH_CONDITION"];

      let spsDttmFrom: Date | undefined;
      let spsDttmTo: Date | undefined;
      let ordStatus = myTypes.reverseOrderStatus(msgOrdStatus.value);

      if (!myUtils.isValidDateString(msgSpsDttmFrom.value)) {
        spsDttmFrom = undefined;
      } else {
        spsDttmFrom = new Date(msgSpsDttmFrom.value);
      }

      if (!myUtils.isValidDateString(msgSpsDttmTo.value)) {
        spsDttmTo = undefined;
      } else {
        spsDttmTo = new Date(msgSpsDttmTo.value);
      }

      if (ordStatus == myTypes.eOrderStatus.NONE) {
        ordStatus = undefined;
      }

      let searchCondition: myTypes.IMwlGetWorklistQueryCondition = {
        reqPage: getOrgSearchCondition.reqPage,
        reqCount: 10,
        reqSortOrder: getOrgSearchCondition.reqSortOrder,
        reqSortColumn: getOrgSearchCondition.reqSortColumn,

        pt_id: msgPatientId.value,
        pt_name: msgPatientName.value,

        ord_acc_num: msgOrdAccNo.value,
        ord_status: ordStatus,
        ord_referring_phyc: msgRefPhysician.value,
        proc_plan_id: msgReqProcId.value,

        sps_modality: msgModality.value,
        sps_start_dttm_from: spsDttmFrom,
        sps_start_dttm_to: spsDttmTo,

        is_strict_condition: false,
      };

      console.log("searchMwlList: ", searchCondition);

      store.dispatch("MwlModelModule/setMwlSearhCondition", searchCondition);

      updateMainTable();
    };

    const updateMainTable = () => {
      store.dispatch("MwlModelModule/setUpdateMwlMainTable");
    };

    // Event Handler
    const onClickSearchButton = () => {
      console.log("Clicked Search button");
      searchMwlList();
    };

    const OnClickClearButton = () => {
      console.log("Clicked Clear button");

      msgPatientName.value = "";
      msgPatientId.value = "";
      msgSpsDttmFrom.value = "";
      msgSpsDttmTo.value = "";
      msgOrdAccNo.value = "";
      msgReqProcId.value = "";
      msgModality.value = "";
      msgRefPhysician.value = "";
    };

    const onClickTodayButton = () => {
      const curDate = new Date().setHours(0, 0, 0, 0);

      msgSpsDttmFrom.value = new Date(curDate).toString();
      msgSpsDttmTo.value = myUtils.addDay(new Date(curDate), 1).toString();

      localStorage.removeItem(myTypes.searchSpsStartDuration);
      localStorage.setItem(
        myTypes.searchSpsStartDuration,
        eSpsStartDuration[eSpsStartDuration.eDurationToday]
      );

      searchMwlList();
    };

    const onClickYesterdayButton = () => {
      const curDate = new Date().setHours(0, 0, 0, 0);

      msgSpsDttmFrom.value = myUtils.addDay(new Date(curDate), -1).toString();
      msgSpsDttmTo.value = new Date(curDate).toString();

      localStorage.removeItem(myTypes.searchSpsStartDuration);
      localStorage.setItem(
        myTypes.searchSpsStartDuration,
        eSpsStartDuration[eSpsStartDuration.eDurationYesterday]
      );

      searchMwlList();
    };

    const onClickLastWeekButton = () => {
      const curDate = new Date().setHours(0, 0, 0, 0);

      msgSpsDttmFrom.value = myUtils.addDay(new Date(curDate), -6).toString();
      msgSpsDttmTo.value = myUtils.addDay(new Date(curDate), 1).toString();

      localStorage.removeItem(myTypes.searchSpsStartDuration);
      localStorage.setItem(
        myTypes.searchSpsStartDuration,
        eSpsStartDuration[eSpsStartDuration.eDurationLastWeek]
      );

      searchMwlList();
    };

    const onClickLastMonthButton = () => {
      const curDate = new Date().setHours(0, 0, 0, 0);

      msgSpsDttmFrom.value = myUtils
        .addDay(myUtils.addMonth(new Date(curDate), -1), 1)
        .toString();
      msgSpsDttmTo.value = myUtils.addDay(new Date(curDate), 1).toString();

      localStorage.removeItem(myTypes.searchSpsStartDuration);
      localStorage.setItem(
        myTypes.searchSpsStartDuration,
        eSpsStartDuration[eSpsStartDuration.eDurationLastMonth]
      );

      searchMwlList();
    };

    const initInstance = () => {
      const curDate = new Date().setHours(0, 0, 0, 0);

      const lastDuraion = localStorage.getItem(myTypes.searchSpsStartDuration);

      if (lastDuraion == null) {
        msgSpsDttmFrom.value = new Date(curDate).toString();
        msgSpsDttmTo.value = myUtils.addDay(new Date(curDate), 1).toString();
      } else {
        const eDuration = eSpsStartDuration[lastDuraion];

        switch (eDuration) {
          case eSpsStartDuration.eDurationToday:
            msgSpsDttmFrom.value = new Date(curDate).toString();
            msgSpsDttmTo.value = myUtils
              .addDay(new Date(curDate), 1)
              .toString();

            break;
          case eSpsStartDuration.eDurationYesterday:
            msgSpsDttmFrom.value = myUtils
              .addDay(new Date(curDate), -1)
              .toString();
            msgSpsDttmTo.value = new Date(curDate).toString();

            break;
          case eSpsStartDuration.eDurationLastWeek:
            msgSpsDttmFrom.value = myUtils
              .addDay(new Date(curDate), -6)
              .toString();
            msgSpsDttmTo.value = myUtils
              .addDay(new Date(curDate), 1)
              .toString();

            break;
          case eSpsStartDuration.eDurationLastMonth:
            msgSpsDttmFrom.value = myUtils
              .addDay(myUtils.addMonth(new Date(curDate), -1), 1)
              .toString();
            msgSpsDttmTo.value = myUtils
              .addDay(new Date(curDate), 1)
              .toString();

            break;
        }
      }
    };

    onMounted(initInstance);

    return {
      //
      getMinDttmOfSpsDttmTo,
      //
      // variables
      msgPatientName,
      msgPatientId,

      msgOrdAccNo,
      msgOrdStatus,
      msgReqProcId,
      msgRefPhysician,
      //
      msgModality,
      msgSpsDttmFrom,
      msgSpsDttmTo,

      //
      modalityOptions,
      ordStatusOptions,
      //
      //
      // for event handlers
      onClickSearchButton,
      OnClickClearButton,
      onClickTodayButton,
      onClickYesterdayButton,
      onClickLastWeekButton,
      onClickLastMonthButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/mwl";
</style>
