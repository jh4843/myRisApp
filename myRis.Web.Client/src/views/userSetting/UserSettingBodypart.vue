<template>
  <div class="mwl-bodypart">
    <div class="mwl-bodypart__title">
      <h2>{{ $t("Bodypart") }}</h2>
    </div>
    <div class="mwl-bodypart__bodypart-table">
      <BodypartTable
        tableType="main"
        :needUpdate="flagUpdateTable"
        :isDropdownAllowAll="isDropdownAllowAll"
        @selected-rows-change="onHandleSelChangeRow"
      />
    </div>
    <div class="mwl-bodypart__content-container"></div>
    <div class="mwl-bodypart__control-row">
      <div class="mwl-bodypart__control-row__add">
        <TextButton
          text="Add"
          buttonStyle="primary"
          fontSize="16px"
          @click.prevent="onClickAddButton()"
        />
      </div>
      <div class="mwl-bodypart__control-row__modify">
        <TextButton
          text="Modify"
          buttonStyle="sub1"
          fontSize="16px"
          :isDisabled="isModifyDisable"
          @click.prevent="onClickModifyButton()"
        />
      </div>
      <div class="mwl-bodypart__control-row__delete">
        <TextButton
          text="Delete"
          buttonStyle="sub3"
          fontSize="16px"
          @click.prevent="onClickDeleteButton()"
        />
      </div>
    </div>
  </div>

  <AddBodypartDialog
    :show="showAddDialog"
    :isModify="isModifyDialog"
    :curBodypart="selBodypart"
    @onOk="onHandleOkFromAddDialog"
    @onCancel="onHandleCancelFromAddDialog"
  >
  </AddBodypartDialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import MwlService from "@/service/MwlService";
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import BodypartTable from "@/components/table/BodypartTable.vue";

import AddBodypartDialog from "@/components/dialog/AddBodypartDialog.vue";

export default defineComponent({
  name: "UserSettingBodypart",

  components: {
    TextButton,
    BodypartTable,
    AddBodypartDialog,
  },

  setup() {
    const store = useStore();

    const showAddDialog = ref(false);
    const isModifyDialog = ref(false);
    const flagUpdateTable = ref(false);
    const isModifyDisable = ref(true);
    const isDropdownAllowAll = ref(true);

    const selBodypart = ref({
      bp_key: -1,
      bp_type: myTypes.eBodypartType.NONE,
      bp_code_value: "",
      bp_scm_design: "",
      bp_code_meaning: "",
    } as myTypes.IDbBodypart);

    let selectedItemList: myTypes.IDbBodypart[] = [];

    const successAddMsg = "Added protocol code successfully.";
    const failedAddMsg = "Failed to add protocol code";
    const successDeleteMsg = "Deleted protocol code successfully.";
    const failedDeleteMsg = "Failed to delete protocol code.";
    const successModifyMsg = "Modified protocol code successfully.";
    const failedModifyMsg = "Failed to modify protocol code";

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Bodypart",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: successAddMsg,
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Bodypart";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = successAddMsg;
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const onHandleSelChangeRow = (selRows: myTypes.IDbBodypart[]): void => {
      selectedItemList = selRows;

      isModifyDisable.value = true;

      if (selectedItemList.length == 1) {
        if (selRows[0].bp_scm_design == "myRis.Web") {
          isModifyDisable.value = false;
        }
      }
    };

    async function AsyncDeleteSelectedItems(
      reqQuery: myTypes.IMwlDeleteBodypartRequest
    ) {
      const res = await MwlService.DeleteBodypart(reqQuery);

      const { result, err_code } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successDeleteMsg;

        console.log("Delete selected items successfully");
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
      console.log("DeleteSelectedItems) ", res);
    }

    async function AsyncAddBodypart(newBodypart: myTypes.IDbBodypart) {
      let reqQuery: myTypes.IMwlAddBodypartRequest = newBodypart;

      const res = await MwlService.AddBodypart(reqQuery);

      const { result, err_code, bp_code_value } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = `Add Bodypart successfully.[value:${bp_code_value}]`;

        MsgBoxInfo.msg += "\r\n";
        MsgBoxInfo.msg += "\r\n";
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

    async function AsyncModifyBodypart(
      sel_bp_key: number,
      newBodypart: myTypes.IDbBodypart
    ) {
      let reqQuery: myTypes.IMwlUpdateBodypartRequest = {
        org_bp_key: sel_bp_key,

        bp_key: newBodypart.bp_key,
        bp_type: newBodypart.bp_type,
        bp_code_value: newBodypart.bp_code_value,
        bp_scm_design: newBodypart.bp_scm_design,
        bp_code_meaning: newBodypart.bp_code_meaning,
        bp_snm_rt_id: newBodypart.bp_snm_rt_id,
        bp_sub_name: newBodypart.bp_sub_name,
        bp_sub_type: newBodypart.bp_sub_type,
      };

      const res = await MwlService.UpdateBodypart(reqQuery);

      const { result, err_code, bp_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successModifyMsg;

        console.log("Modified protocol code successfully.[key:%d]", bp_key);
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
    const onHandleOkFromAddDialog = (
      db_bodypart: myTypes.IDbBodypart
    ): void => {
      if (isModifyDialog.value) {
        AsyncModifyBodypart(selBodypart.value.bp_key, db_bodypart);
      } else {
        AsyncAddBodypart(db_bodypart);
      }

      showAddDialog.value = false;
      isModifyDialog.value = false;
    };

    const onHandleCancelFromAddDialog = (): void => {
      showAddDialog.value = false;
    };

    const onClickAddButton = () => {
      isModifyDialog.value = false;
      showAddDialog.value = true;
    };

    const onClickModifyButton = () => {
      if (isModifyDisable.value) return;

      if (selectedItemList.length != 1) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = "Select only one item.";
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

        console.log("onClickModifyButton: have to select just one item");
        return;
      }

      selBodypart.value = selectedItemList[0];

      showAddDialog.value = true;
      isModifyDialog.value = true;

      return "";
    };

    const onClickDeleteButton = () => {
      if (selectedItemList.length <= 0) {
        console.log("onClickDeleteButton: any item is not selected.");
        return;
      }

      let selBodypartKeyList: number[] = [];

      for (const item of selectedItemList) {
        selBodypartKeyList.push(item.bp_key);
      }

      const delItems: myTypes.IMwlDeleteBodypartRequest = {
        bp_key_list: selBodypartKeyList,
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
      selBodypart,
      selectedItemList,
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
