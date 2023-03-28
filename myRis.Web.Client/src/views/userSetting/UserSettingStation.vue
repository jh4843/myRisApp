<template>
  <div class="mwl-station">
    <div class="mwl-station__title">
      <h2>{{ $t("Station") }}</h2>
    </div>
    <div class="mwl-station__station-table">
      <UserSettingStationTable
        :needUpdate="flagUpdateTable"
        :isDropdownAllowAll="isDropdownAllowAll"
        @selected-rows-change="onHandleSelChangeRow"
      />
    </div>
    <div class="mwl-station__content-container"></div>
    <div class="mwl-station__control-row">
      <div class="mwl-station__control-row__add">
        <TextButton
          text="Add"
          buttonStyle="primary"
          fontSize="16px"
          @click.prevent="onClickAddButton()"
        />
      </div>
      <div class="mwl-station__control-row__modify">
        <TextButton
          text="Modify"
          buttonStyle="sub1"
          fontSize="16px"
          :isDisabled="isModifyDisable"
          @click.prevent="onClickModifyButton()"
        />
      </div>
      <div class="mwl-station__control-row__delete">
        <TextButton
          text="Delete"
          buttonStyle="sub3"
          fontSize="16px"
          @click.prevent="onClickDeleteButton()"
        />
      </div>
    </div>
  </div>

  <AddStationDialog
    :show="showAddDialog"
    :isModify="isModifyDialog"
    :curStation="selStation"
    @onOk="onHandleOkFromAddDialog"
    @onCancel="onHandleCancelFromAddDialog"
  >
  </AddStationDialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";

import { useStore } from "vuex";
import MwlService from "@/service/MwlService";
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import UserSettingStationTable from "@/components/table/StationTable.vue";

import AddStationDialog from "@/components/dialog/AddStationDialog.vue";

export default defineComponent({
  name: "UserSettingStation",

  components: {
    TextButton,
    UserSettingStationTable,
    AddStationDialog,
  },

  setup() {
    const store = useStore();

    const showAddDialog = ref(false);
    const isModifyDialog = ref(false);
    const flagUpdateTable = ref(false);
    const isModifyDisable = ref(false);
    const isDropdownAllowAll = ref(true);

    const selStation = reactive({
      station_key: -1,
      station_ae_title: "",
      station_name: "",
    } as myTypes.IDbStation);

    let selectedItemList: myTypes.IDbStation[] = [];

    let resKey = -1;
    const successAddMsg = "Added station successfully.";
    const failedAddMsg = "Failed to add station";
    const successDeleteMsg = "Deleted station successfully.";
    const failedDeleteMsg = "Failed to delete station.";
    const successModifyMsg = "Modified station successfully.";
    const failedModifyMsg = "Failed to modify station";

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Station",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: successAddMsg,
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Station";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = successAddMsg;
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const onHandleSelChangeRow = (selRows: myTypes.IDbStation[]): void => {
      selectedItemList = selRows;

      if (selectedItemList.length > 1) {
        isModifyDisable.value = true;
      } else {
        isModifyDisable.value = false;
      }
    };

    async function AsyncDeleteSelectedItems(
      reqQuery: myTypes.IMwlDeleteStationRequest
    ) {
      const res = await MwlService.DeleteStation(reqQuery);

      const { result, err_code } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successDeleteMsg;

        console.log("Deleteed selected items successfully");
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedDeleteMsg + `\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);
        MsgBoxInfo.msg = failedDeleteMsg + `\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedDeleteMsg}\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      flagUpdateTable.value = !flagUpdateTable.value;
    }

    async function AsyncAddStation(newStation: myTypes.IDbStation) {
      let reqQuery: myTypes.IMwlAddStationRequest = newStation;

      const res = await MwlService.AddStation(reqQuery);

      const { result, err_code, station_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successAddMsg;

        resKey = station_key;

        console.log("Added Station successfully.[key:%d]", resKey);
        //
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedAddMsg + `\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);
        MsgBoxInfo.msg = failedAddMsg + `\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedAddMsg}\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      flagUpdateTable.value = !flagUpdateTable.value;
    }

    async function AsyncModifyStation(
      sel_aetitle: string,
      newStation: myTypes.IDbStation
    ) {
      let reqQuery: myTypes.IMwlUpdateStationRequest = {
        org_station_ae_title: sel_aetitle,

        station_key: newStation.station_key,
        station_ae_title: newStation.station_ae_title,
        station_name: newStation.station_name,
      };

      const res = await MwlService.UpdateStation(reqQuery);

      const { result, err_code, station_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successModifyMsg;

        resKey = station_key;

        console.log("Modified Station successfully.[key:%d]", resKey);
        //
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedModifyMsg + `\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);
        MsgBoxInfo.msg = failedModifyMsg + `\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedModifyMsg}\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      flagUpdateTable.value = !flagUpdateTable.value;
    }

    // From Add Dialog
    const onHandleOkFromAddDialog = (station: myTypes.IDbStation): void => {
      if (isModifyDialog.value) {
        AsyncModifyStation(selStation.station_ae_title, station);
      } else {
        AsyncAddStation(station);
      }

      showAddDialog.value = false;
      isModifyDialog.value = false;

      console.log("onHandleOkFromAddDialog val: ", flagUpdateTable.value);
    };

    const onHandleCancelFromAddDialog = (): void => {
      showAddDialog.value = false;
    };

    const onClickAddButton = () => {
      isModifyDialog.value = false;
      showAddDialog.value = true;
    };

    const onClickModifyButton = () => {
      if (selectedItemList.length != 1) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = "Select only one item.";
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

        console.log("onClickModifyButton: have to select just one item");
        return;
      }

      showAddDialog.value = true;
      isModifyDialog.value = true;

      selStation.station_ae_title = selectedItemList[0].station_ae_title;
      selStation.station_name = selectedItemList[0].station_name;

      return "";
    };

    const onClickDeleteButton = () => {
      if (selectedItemList.length <= 0) {
        console.log("onClickDeleteButton: any item is not selected.");
        return;
      }

      let selAeTitleList: string[] = [];

      for (const item of selectedItemList) {
        selAeTitleList.push(item.station_ae_title);
      }

      const delItems: myTypes.IMwlDeleteStationRequest = {
        station_ae_title_list: selAeTitleList,
      };

      console.log("onClickDeleteButton: ", delItems);

      AsyncDeleteSelectedItems(delItems);

      return;
    };

    const initInstance = () => {
      initMsgBoxInfo();
    };

    onMounted(initInstance);

    return {
      showAddDialog,
      isModifyDialog,
      flagUpdateTable,
      isModifyDisable,
      isDropdownAllowAll,
      //
      selStation,
      //
      onHandleSelChangeRow,
      //
      onHandleOkFromAddDialog,
      onHandleCancelFromAddDialog,

      onClickAddButton,
      onClickModifyButton,
      onClickDeleteButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/userSetting.scss";
</style>
