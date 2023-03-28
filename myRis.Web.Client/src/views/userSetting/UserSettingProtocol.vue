<template>
  <div class="mwl-protocol">
    <div class="mwl-protocol__title">
      <h2>{{ $t("Protocol") }}</h2>
    </div>
    <div class="mwl-protocol__protocol-table">
      <ProtocolTable
        tableType="main"
        :needUpdate="flagUpdateTable"
        :isDropdownAllowAll="isDropdownAllowAll"
        @selected-rows-change="onHandleSelChangeRow"
      />
    </div>
    <div class="mwl-protocol__content-container"></div>
    <div class="mwl-protocol__control-row">
      <div class="mwl-protocol__control-row__add">
        <TextButton
          text="Add"
          buttonStyle="primary"
          fontSize="16px"
          @click.prevent="onClickAddButton()"
        />
      </div>
      <div class="mwl-protocol__control-row__modify">
        <TextButton
          text="Modify"
          buttonStyle="sub1"
          fontSize="16px"
          :isDisabled="isModifyDisable"
          @click.prevent="onClickModifyButton()"
        />
      </div>
      <div class="mwl-protocol__control-row__delete">
        <TextButton
          text="Delete"
          buttonStyle="sub3"
          fontSize="16px"
          @click.prevent="onClickDeleteButton()"
        />
      </div>
    </div>
  </div>

  <AddProtocolDialog
    :show="showAddDialog"
    :isModify="isModifyDialog"
    :curProtocol="selProtocol"
    @onOk="onHandleOkFromAddDialog"
    @onCancel="onHandleCancelFromAddDialog"
  >
  </AddProtocolDialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import MwlService from "@/service/MwlService";
import * as MyTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import ProtocolTable from "@/components/table/ProtocolTable.vue";

import AddProtocolDialog from "@/components/dialog/AddProtocolDialog.vue";

export default defineComponent({
  name: "UserSettingProtocol",

  components: {
    TextButton,
    ProtocolTable,
    AddProtocolDialog,
  },

  setup() {
    const store = useStore();

    const showAddDialog = ref(false);
    const isModifyDialog = ref(false);
    const flagUpdateTable = ref(false);
    const isModifyDisable = ref(true);
    const isDropdownAllowAll = ref(true);

    const selProtocol = ref({
      prot_key: -1,

      prot_id: "",
      prot_station_ae_title: "",
      prot_station_name: "",
      prot_modality: "",

      prot_desc: "",
      prot_perform_phyc_name: "",
      prot_duration: -1,

      prot_bp_key: -1,
    } as MyTypes.IDbProtocol);

    let selectedItemList: MyTypes.IDbProtocol[] = [];

    let resKey = -1;
    const successAddMsg = "Added protocol successfully.";
    const failedAddMsg = "Failed to add protocol";
    const successDeleteMsg = "Deleted protocol successfully.";
    const failedDeleteMsg = "Failed to delete protocol.";
    const successModifyMsg = "Modified protocol successfully.";
    const failedModifyMsg = "Failed to modify protocol";

    // [Message Box]
    const MsgBoxInfo: MyTypes.IMessageBox = reactive({
      isShow: false,
      title: "Protocol",
      msgType: MyTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: MyTypes.eMsgBoxResType.Ok,
      style: "",

      msg: successAddMsg,
      res: MyTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Protocol";
      MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = MyTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = successAddMsg;
      MsgBoxInfo.res = MyTypes.eMsgBoxRes.ResNone;
    };

    const onHandleSelChangeRow = (selRows: MyTypes.IDbProtocol[]): void => {
      selectedItemList = selRows;

      if (selectedItemList.length == 1) {
        isModifyDisable.value = false;
      } else {
        isModifyDisable.value = true;
      }
    };

    async function AsyncDeleteSelectedItems(
      reqQuery: MyTypes.IMwlDeleteProtocolRequest
    ) {
      const res = await MwlService.DeleteProtocol(reqQuery);

      const { result, err_code } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successDeleteMsg;

        console.log("Delete selected items successfully");
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedDeleteMsg + `\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);
        MsgBoxInfo.msg = failedDeleteMsg + `\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedDeleteMsg}\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      flagUpdateTable.value = !flagUpdateTable.value;
      console.log("DeleteSelectedItems) ", res);
    }

    async function AsyncAddProtocol(newProtocol: MyTypes.IDbProtocol) {
      let reqQuery: MyTypes.IMwlAddProtocolRequest = newProtocol;

      const res = await MwlService.AddProtocol(reqQuery);

      const { result, err_code, prot_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successAddMsg;

        resKey = prot_key;

        console.log("Add Protocol successfully.[key:%d]", resKey);
        //
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedAddMsg + `\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);
        MsgBoxInfo.msg = failedAddMsg + `\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedAddMsg}\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      flagUpdateTable.value = !flagUpdateTable.value;
    }

    async function AsyncModifyProtocol(
      sel_protocol_id: string,
      newProtocol: MyTypes.IDbProtocol
    ) {
      let reqQuery: MyTypes.IMwlUpdateProtocolRequest = {
        org_protocol_id: sel_protocol_id,

        prot_key: newProtocol.prot_key,
        prot_id: newProtocol.prot_id,
        prot_station_ae_title: newProtocol.prot_station_ae_title,
        prot_station_name: newProtocol.prot_station_name,
        prot_modality: newProtocol.prot_modality,

        prot_desc: newProtocol.prot_desc,
        prot_perform_phyc_name: newProtocol.prot_perform_phyc_name,
        prot_duration: newProtocol.prot_duration,

        prot_bp_key: newProtocol.prot_bp_key,
      };

      const res = await MwlService.UpdateProtocol(reqQuery);

      const { result, err_code, prot_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successModifyMsg;

        resKey = prot_key;

        console.log("Modified protocol successfully.[key:%d]", resKey);
        //
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedModifyMsg + `\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);
        MsgBoxInfo.msg = failedModifyMsg + `\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedModifyMsg}\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      flagUpdateTable.value = !flagUpdateTable.value;
    }

    // From Add Dialog
    const onHandleOkFromAddDialog = (protocol: MyTypes.IDbProtocol): void => {
      if (isModifyDialog.value) {
        AsyncModifyProtocol(selProtocol.value.prot_id, protocol);
      } else {
        AsyncAddProtocol(protocol);
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
        MsgBoxInfo.msgType = MyTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = "Select only one item.";
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

        console.log("onClickModifyButton: have to select just one item");
        return;
      }

      showAddDialog.value = true;
      isModifyDialog.value = true;

      selProtocol.value = selectedItemList[0];

      return "";
    };

    const onClickDeleteButton = () => {
      if (selectedItemList.length <= 0) {
        console.log("onClickDeleteButton: any item is not selected.");
        return;
      }

      let selProtocolIdList: string[] = [];

      for (const item of selectedItemList) {
        selProtocolIdList.push(item.prot_id);
      }

      const delItems: MyTypes.IMwlDeleteProtocolRequest = {
        protocol_id_list: selProtocolIdList,
      };

      console.log("onClickDeleteButton: ", delItems);

      AsyncDeleteSelectedItems(delItems);

      return;
    };

    const initInstance = () => {
      initMsgBoxInfo();

      isDropdownAllowAll.value = true;
    };

    onMounted(initInstance);

    return {
      showAddDialog,
      isModifyDialog,
      flagUpdateTable,
      isModifyDisable,
      isDropdownAllowAll,
      //
      selProtocol,
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
