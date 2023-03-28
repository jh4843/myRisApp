<template>
  <div class="mwl-proc-plan">
    <div class="mwl-proc-plan__title">
      <h2>{{ $t("Procedure Plan") }}</h2>
    </div>
    <div class="mwl-proc-plan__proc-plan-table">
      <ProcPlanTable
        tableType="main"
        :needUpdate="flagUpdateTable"
        :isDropdownAllowAll="isDropdownAllowAll"
        @selected-rows-change="onHandleSelChangeRow"
      />
    </div>
    <div class="mwl-proc-plan__control-row">
      <div class="mwl-proc-plan__control-row__add">
        <TextButton
          text="Add"
          buttonStyle="primary"
          fontSize="16px"
          @click.prevent="onClickAddButton()"
        />
      </div>
      <div class="mwl-proc-plan__control-row__modify">
        <TextButton
          text="Modify"
          buttonStyle="sub1"
          fontSize="16px"
          :isDisabled="isModifyDisable"
          @click.prevent="onClickModifyButton()"
        />
      </div>
      <div class="mwl-proc-plan__control-row__delete">
        <TextButton
          text="Delete"
          buttonStyle="sub3"
          fontSize="16px"
          @click.prevent="onClickDeleteButton()"
        />
      </div>
    </div>
  </div>

  <AddProcPlanDialog
    :show="showAddDialog"
    :isModify="isModifyDialog"
    :curProcPlan="curSelProcPlan"
    @onOk="onHandleOkFromAddDialog"
    @onCancel="onHandleCancelFromAddDialog"
  >
  </AddProcPlanDialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import MwlService from "@/service/MwlService";
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import ProcPlanTable from "@/components/table/ProcPlanTable.vue";

import AddProcPlanDialog from "@/components/dialog/AddProcPlanDialog.vue";

export default defineComponent({
  name: "UserSettingRqSeq",

  components: {
    TextButton,
    ProcPlanTable,
    AddProcPlanDialog,
  },

  setup() {
    const store = useStore();

    const showAddDialog = ref(false);
    const isModifyDialog = ref(false);
    const flagUpdateTable = ref(false);
    const isModifyDisable = ref(true);
    const isDropdownAllowAll = ref(true);

    const curSelProcPlan = ref({
      proc_plan_key: -1,
      proc_plan_id: "",
      proc_plan_desc: "",
    } as myTypes.IDbProcPlan);

    let selectedItemList: myTypes.IDbProcPlan[] = [];

    let resKey = -1;
    const successAddMsg = "Added procedure plan successfully.";
    const failedAddMsg = "Failed to add procedure plan";
    const successDeleteMsg = "Deleteed procedure plan successfully.";
    const failedDeleteMsg = "Failed to delete procedure plan.";
    const successModifyMsg = "Modified procedure plan successfully.";
    const failedModifyMsg = "Failed to modify procedure plan";

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Procedure Plan",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: successAddMsg,
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Procedure Plan";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = successAddMsg;
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const onHandleSelChangeRow = (selRows: myTypes.IDbProcPlan[]): void => {
      selectedItemList = selRows;

      if (selectedItemList.length == 1) {
        isModifyDisable.value = false;
      } else {
        isModifyDisable.value = true;
      }
    };

    async function AsyncDeleteSelectedItems(
      reqQuery: myTypes.IMwlDeleteProcPlanRequest
    ) {
      const res = await MwlService.DeleteProcPlan(reqQuery);

      const { result, err_code } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successDeleteMsg;
        console.log("Delete selected items successfully");
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedDeleteMsg + `\n(Reason: ${err_code} )`;
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedDeleteMsg}\n(Reason: ${errDesc} )`;
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

    async function AsyncAddProcPlan(
      newProcPlan: myTypes.IDbProcPlan,
      newProtKeyList: number[]
    ) {
      let reqQuery: myTypes.IMwlAddProcPlanRequest = {
        proc_plan_key: newProcPlan.proc_plan_key,
        proc_plan_id: newProcPlan.proc_plan_id,
        proc_plan_desc: newProcPlan.proc_plan_desc,

        prot_key_list: newProtKeyList,
      };

      resKey = -1;

      const res = await MwlService.AddProcPlan(reqQuery);

      const { result, err_code, proc_plan_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successAddMsg;
        resKey = proc_plan_key;
        console.log("Added ProcPlan successfully.[key:%d]", resKey);
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedAddMsg + `\n(Reason: ${err_code} )`;
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedAddMsg}\n(Reason: ${errDesc} )`;

        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedAddMsg}\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      flagUpdateTable.value = !flagUpdateTable.value;
      console.log("AddProcPlan) ", res);
    }

    async function AsyncModifyProcPlan(
      newProcPlan: myTypes.IDbProcPlan,
      newProtKeyList: number[]
    ) {
      let reqQuery: myTypes.IMwlUpdateProcPlanRequest = {
        proc_plan_key: newProcPlan.proc_plan_key,
        proc_plan_id: newProcPlan.proc_plan_id,
        proc_plan_desc: newProcPlan.proc_plan_desc,

        prot_key_list: newProtKeyList,
      };

      console.log("AsyncModifyProcPlan", reqQuery);

      resKey = -1;

      const res = await MwlService.UpdateProcPlan(reqQuery);

      const { result, err_code, proc_plan_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = successModifyMsg;
        resKey = proc_plan_key;
        console.log("Added ProcPlan successfully.[key:%d]", resKey);
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = failedModifyMsg + `\n(Reason: ${err_code} )`;
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${failedModifyMsg}\n(Reason: ${errDesc} )`;

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
      procPlan: myTypes.IDbProcPlan,
      protKeyList: number[]
    ): void => {
      if (isModifyDialog.value) {
        AsyncModifyProcPlan(procPlan, protKeyList);
      } else {
        AsyncAddProcPlan(procPlan, protKeyList);
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

      curSelProcPlan.value = selectedItemList[0];

      // curSelProcPlan.proc_plan_key = selectedItemList[0].proc_plan_key;
      // curSelProcPlan.proc_plan_id = selectedItemList[0].proc_plan_id;
      // curSelProcPlan.proc_plan_desc = selectedItemList[0].proc_plan_desc;

      showAddDialog.value = true;
      isModifyDialog.value = true;

      return "";
    };

    const onClickDeleteButton = () => {
      if (selectedItemList.length <= 0) {
        console.log("onClickDeleteButton: any item is not selected.");
        return;
      }

      let selProcPlanIdList: string[] = [];

      for (const item of selectedItemList) {
        selProcPlanIdList.push(item.proc_plan_id);
      }

      const delItems: myTypes.IMwlDeleteProcPlanRequest = {
        proc_plan_id_list: selProcPlanIdList,
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
      curSelProcPlan,
      selectedItemList,

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
