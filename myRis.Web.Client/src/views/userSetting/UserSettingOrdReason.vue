<template>
  <div class="mwl-ord-reason">
    <div class="mwl-ord-reason__title">
      <h2>{{ $t("Order Reason") }}</h2>
    </div>
    <div class="mwl-ord-reason__ord-reason-table">
      <UserSettingOrdReasonTable
        :needUpdate="flagUpdateTable"
        :isDropdownAllowAll="isDropdownAllowAll"
        @selected-rows-change="onHandleSelChangeRow"
      />
    </div>
    <div class="mwl-ord-reason__content-container"></div>
    <div class="mwl-ord-reason__control-row">
      <div class="mwl-ord-reason__control-row__add">
        <TextButton
          text="Add"
          buttonStyle="primary"
          fontSize="16px"
          @click.prevent="onClickAddButton()"
        />
      </div>
      <div class="mwl-ord-reason__control-row__modify">
        <TextButton
          text="Modify"
          buttonStyle="sub1"
          fontSize="16px"
          :isDisabled="isModifyDisable"
          @click.prevent="onClickModifyButton()"
        />
      </div>
      <div class="mwl-ord-reason__control-row__delete">
        <TextButton
          text="Delete"
          buttonStyle="sub3"
          fontSize="16px"
          @click.prevent="onClickDeleteButton()"
        />
      </div>
    </div>
  </div>

  <AddOrdReasonDialog
    :show="showAddDialog"
    :isModify="isModifyDialog"
    :curOrdReason="selOrdReason"
    @onOk="onHandleOkFromAddDialog"
    @onCancel="onHandleCancelFromAddDialog"
  >
  </AddOrdReasonDialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";

import { useStore } from "vuex";
import MwlService from "@/service/MwlService";
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import UserSettingOrdReasonTable from "@/components/table/OrdReasonTable.vue";

import AddOrdReasonDialog from "@/components/dialog/AddOrdReasonDialog.vue";

export default defineComponent({
  name: "UserSettingOrdReason",

  components: {
    TextButton,
    UserSettingOrdReasonTable,
    AddOrdReasonDialog,
  },

  setup() {
    const store = useStore();

    const showAddDialog = ref(false);
    const isModifyDialog = ref(false);
    const flagUpdateTable = ref(false);
    const isModifyDisable = ref(false);
    const isDropdownAllowAll = ref(true);

    const selOrdReason = reactive({
      ord_reason_key: -1,
      ord_reason_type: myTypes.eOrdReasonType.CREATE,
      ord_reason_desc: "",
    } as myTypes.IDbOrdReason);

    let selectedItemList: myTypes.IDbOrdReason[] = [];

    let resKey = -1;
    const successAddMsg = "Added order reason successfully.";
    const failedAddMsg = "Failed to add order reason";
    const successDeleteMsg = "Deleted order reason successfully.";
    const failedDeleteMsg = "Failed to delete order reason.";
    const successModifyMsg = "Modified order reason successfully.";
    const failedModifyMsg = "Failed to modify order reason";

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Order Reason",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: successAddMsg,
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Order Reason";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = successAddMsg;
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const onHandleSelChangeRow = (selRows: myTypes.IDbOrdReason[]): void => {
      selectedItemList = selRows;

      if (selectedItemList.length > 1) {
        isModifyDisable.value = true;
      } else {
        isModifyDisable.value = false;
      }
    };

    async function AsyncDeleteSelectedItems(
      reqQuery: myTypes.IMwlDeleteOrdReasonRequest
    ) {
      const res = await MwlService.DeleteOrdReason(reqQuery);

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

    async function AsyncAddOrdReason(newOrdReason: myTypes.IDbOrdReason) {
      let reqQuery: myTypes.IMwlAddOrdReasonRequest = newOrdReason;

      console.log("AsyncAddOrdReason", reqQuery);

      const res = await MwlService.AddOrdReason(reqQuery);

      const { result, err_code, ord_reason_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successDeleteMsg;

        resKey = ord_reason_key;

        console.log("Added OrdReason successfully.[key:%d]", resKey);
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

    async function AsyncModifyOrdReason(newOrdReason: myTypes.IDbOrdReason) {
      let reqQuery: myTypes.IMwlUpdateOrdReasonRequest = newOrdReason;

      console.log("AsyncModifyOrdReason", reqQuery);

      const res = await MwlService.UpdateOrdReason(reqQuery);

      const { result, err_code, ord_reason_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successModifyMsg;

        resKey = ord_reason_key;

        console.log("Modified Order Reason successfully.[key:%d]", resKey);
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
    const onHandleOkFromAddDialog = (ordReason: myTypes.IDbOrdReason): void => {
      if (isModifyDialog.value) {
        AsyncModifyOrdReason(ordReason);
      } else {
        AsyncAddOrdReason(ordReason);
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

      selOrdReason.ord_reason_key = selectedItemList[0].ord_reason_key;
      selOrdReason.ord_reason_type = selectedItemList[0].ord_reason_type;
      selOrdReason.ord_reason_desc = selectedItemList[0].ord_reason_desc;

      return "";
    };

    const onClickDeleteButton = () => {
      if (selectedItemList.length <= 0) {
        console.log("onClickDeleteButton: any item is not selected.");
        return;
      }

      let selOrdReasonKeyList: number[] = [];

      for (const item of selectedItemList) {
        selOrdReasonKeyList.push(item.ord_reason_key);
      }

      const delItems: myTypes.IMwlDeleteOrdReasonRequest = {
        ord_reason_key: selOrdReasonKeyList,
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
      selOrdReason,
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
