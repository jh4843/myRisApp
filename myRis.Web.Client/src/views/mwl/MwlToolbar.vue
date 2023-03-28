<!-- eslint-disable no-dupe-else-if -->
<template>
  <div class="mwl-toolbar">
    <ul class="mwl-toolbar__list">
      <!-- Add Patient -->
      <li class="mwl-toolbar__list__item">
        <AddPatient
          :isDisable="!isSignedIn"
          @click="onHandleCommands(1, 'Add Patient')"
        />
      </li>
      <!-- Edit Patient -->
      <li class="mwl-toolbar__list__item">
        <EditPatient
          :isDisable="!isSignedIn"
          @click="onHandleCommands(2, 'Edit Patient')"
        />
      </li>
      <!-- Add Order -->
      <li class="mwl-toolbar__list__item">
        <AddOrder
          :isDisable="!isSignedIn"
          @click="onHandleCommands(3, 'Add Order')"
        />
      </li>
      <!-- Edit Order -->
      <li class="mwl-toolbar__list__item">
        <EditOrder
          :isDisable="!isSignedIn"
          @click="onHandleCommands(4, 'Edit Order')"
        />
      </li>
      <!-- Complete Order -->
      <li class="mwl-toolbar__list__item">
        <CompleteOrder
          :isDisable="!isSignedIn || !isMainTableOrderType"
          @click="onHandleCommands(5, 'Complete Order')"
        />
      </li>
      <!-- Cancel Order -->
      <li class="mwl-toolbar__list__item">
        <CancelOrder
          :isDisable="!isSignedIn || !isMainTableOrderType"
          @click="onHandleCommands(6, 'Cancel Order')"
        />
      </li>
      <li class="mwl-toolbar__list__item">
        <Delete
          :isDisable="!isSignedIn || !isMainTableOrderType"
          @click="onHandleCommands(7, 'Delete')"
        />
      </li>
    </ul>

    <div class="mwl-toolbar__table-type">
      <div class="mwl-toolbar__table-type__item">
        <TablePatientBase
          :isDisable="!isSignedIn"
          :isToggleType="toggleType"
          v-model="isPatientType"
          @click="onHandleCommands(101, 'Patient Type')"
        />
      </div>
      <div class="mwl-toolbar__table-type__item">
        <TableOrderBase
          :isDisable="!isSignedIn"
          :isToggleType="toggleType"
          v-model="isOrderType"
          @click="onHandleCommands(102, 'Order Type')"
        />
      </div>
      <div class="mwl-toolbar__table-type__item-last">
        <TableSpsBase
          :isDisable="!isSignedIn"
          :isToggleType="toggleType"
          v-model="isSpsType"
          @click="onHandleCommands(103, 'SPS Type')"
        />
      </div>
    </div>
  </div>

  <AddPatientDialog
    :show="showPatientDialog"
    :isModify="isPatientModify"
    :editPtKey="selPatientKey"
    @onAdd="onHandlePatientDialogAdd()"
    @onModify="onHandlePatientDialogEdit()"
    @onCancel="onHandlePatientDialogCancel()"
  >
  </AddPatientDialog>
  <AddOrderDialog
    :show="showOrderDialog"
    :isModify="isOrderModify"
    :editOrdKey="selOrderKey"
    @onAdd="onHandleOrderDialogAdd()"
    @onModify="onHandleOrderDialogEdit()"
    @onCancel="onHandleOrderDialogCancel()"
  >
  </AddOrderDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  reactive,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import * as myTypes from "@/types";

import MwlService from "@/service/MwlService";

// icons(Tools)
import AddPatient from "@/assets/mwl/toolbar/AddPatient.vue";
import EditPatient from "@/assets/mwl/toolbar/EditPatient.vue";
import AddOrder from "@/assets/mwl/toolbar/AddOrder.vue";
import EditOrder from "@/assets/mwl/toolbar/EditOrder.vue";
import CompleteOrder from "@/assets/mwl/toolbar/CompleteOrder.vue";
import CancelOrder from "@/assets/mwl/toolbar/CancelOrder.vue";
import Delete from "@/assets/mwl/toolbar/DeleteOrder.vue";
// icons(Table Types)
import TablePatientBase from "@/assets/mwl/table/TablePatientBase.vue";
import TableOrderBase from "@/assets/mwl/table/TableOrderBase.vue";
import TableSpsBase from "@/assets/mwl/table/TableSpsBase.vue";
//
//import SwitchBase from "@/components/input/SwitchBase.vue";
import AddPatientDialog from "@/components/dialog/AddPatientDialog.vue";
import AddOrderDialog from "@/components/dialog/AddOrderDialog.vue";

type tMsgBoxCmdType =
  | "info"
  | "tAskCompleteOrder"
  | "tAskCancelOrder"
  | "tAskDelete"
  | "tEditPatient"
  | "tEditOrder"
  | "tStatusError"
  | "tSelectError";

enum eMwlCommands {
  cmdAddPatient = 1,
  cmdEditPatient,
  cmdAddOrder,
  cmdEditOrder,
  cmdCompleteOrder,
  cmdCancelOrder,
  cmdDelete,

  cmdChangeMwlMainTableToPatient = 101,
  cmdChangeMwlMainTableToOrder,
  cmdChangeMwlMainTableToSps,
}

export default defineComponent({
  name: "MwlToolbar",

  components: {
    AddPatient,
    EditPatient,
    AddOrder,
    EditOrder,
    CompleteOrder,
    CancelOrder,
    Delete,
    //
    TablePatientBase,
    TableOrderBase,
    TableSpsBase,
    //
    AddPatientDialog,
    AddOrderDialog,
    //SwitchBase,
  },

  props: {},

  setup() {
    const store = useStore();
    const toggleType = ref(true);
    const isSignedIn = computed(() => {
      const res = store.getters["UserModelModule/IS_SIGN_IN"];
      store.dispatch("MwlModelModule/setUpdateMwlMainTable");
      return res;
    });

    const isMainTableOrderType = computed(() => {
      if (
        store.getters["MwlModelModule/GET_MWL_MAIN_TABLE_TYPE"] ==
        myTypes.eMwlMainTableType.table_type_mwl_main_order
      ) {
        return true;
      }

      return false;
    });

    const isMwlMainTableSpsType = computed(() => {
      if (
        store.getters["MwlModelModule/GET_MWL_MAIN_TABLE_TYPE"] ==
        myTypes.eMwlMainTableType.table_type_mwl_main_sps
      ) {
        return false;
      }

      return true;
    });

    const updateMwlMainTable = () => {
      store.dispatch("MwlModelModule/setUpdateMwlMainTable");
    };

    const getTableTypeLabel = computed(() => {
      if (isMwlMainTableSpsType.value == true) {
        return "SPS";
      } else {
        return "Order";
      }
    });

    ///////////////////////////////////////////////
    // [1]: Add Patient
    const showPatientDialog = ref(false);
    const isPatientModify = ref(false);
    const selPatientKey = ref(-1);

    const onHandlePatientDialogAdd = (): void => {
      showPatientDialog.value = false;
      updateMwlMainTable();
    };

    const onHandlePatientDialogEdit = (): void => {
      showPatientDialog.value = false;
      updateMwlMainTable();
    };

    const onHandlePatientDialogCancel = (): void => {
      showPatientDialog.value = false;
    };
    ///////////////////////////////////////////////

    ///////////////////////////////////////////////
    // [2]: Add Order
    const showOrderDialog = ref(false);
    const isOrderModify = ref(false);
    const selOrderKey = ref(-1);

    const onHandleOrderDialogAdd = (): void => {
      showOrderDialog.value = false;
      updateMwlMainTable();
    };

    const onHandleOrderDialogEdit = (): void => {
      showOrderDialog.value = false;
      updateMwlMainTable();
    };

    const onHandleOrderDialogCancel = (): void => {
      showOrderDialog.value = false;
      updateMwlMainTable();
    };
    ///////////////////////////////////////////////

    const isPatientType = ref(false);
    const isOrderType = ref(true);
    const isSpsType = ref(false);

    const changeMwlMainTableType = () => {
      if (isPatientType.value) {
        store.dispatch(
          "MwlModelModule/setMwlMainTableType",
          myTypes.eMwlMainTableType.table_type_mwl_main_patient
        );
      } else if (isSpsType.value) {
        store.dispatch(
          "MwlModelModule/setMwlMainTableType",
          myTypes.eMwlMainTableType.table_type_mwl_main_sps
        );
      } else {
        store.dispatch(
          "MwlModelModule/setMwlMainTableType",
          myTypes.eMwlMainTableType.table_type_mwl_main_order
        );
      }
    };

    ///////////////////////////////////////////////
    // Complete Order
    const onHandleCompleteOrderCmd = () => {
      const selItems: myTypes.IDbWorklist[] =
        store.getters["MwlModelModule/GET_SELECTED_MWL_MAIN_TABLE_LIST"];

      while (selectedWorklist.length > 0) {
        selectedWorklist.pop();
      }

      for (const sel of selItems) {
        if (
          selectedWorklist.find((item) => item.ord_key == sel.ord_key) ==
          undefined
        ) {
          selectedWorklist.push(sel);
        }
      }

      if (selectedWorklist.length == 1) {
        if (
          selectedWorklist[0].ord_status_flag < myTypes.eOrderStatus.ORDERED ||
          selectedWorklist[0].ord_status_flag > myTypes.eOrderStatus.MATCHED
        ) {
          MsgBoxInfo.title = titleCompleteOrder;
          msgBoxCmdType = "tStatusError";
        } else {
          msgBoxCmdType = "tAskCompleteOrder";
        }
      } else {
        MsgBoxInfo.title = titleCompleteOrder;
        msgBoxCmdType = "tSelectError";
      }

      //msgBoxCmdType = "tAskCompleteOrder";
      updateMsgBoxInfo();

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
    };

    const completeOrder = () => {
      let ordKeyList: number[] = [];

      while (ordKeyList.length > 0) {
        ordKeyList.pop();
      }

      for (const ord of selectedWorklist) {
        ordKeyList.push(ord.ord_key);
      }

      const query: myTypes.IMwlUpdateOrderStatusRequest = {
        ord_key_list: ordKeyList,
        ord_status: myTypes.eOrderStatus.COMPLETED,
      };

      asyncUpdateOrderStatus(query);
    };

    const onHandleCancelOrderCmd = () => {
      const selItems: myTypes.IDbWorklist[] =
        store.getters["MwlModelModule/GET_SELECTED_MWL_MAIN_TABLE_LIST"];

      while (selectedWorklist.length > 0) {
        selectedWorklist.pop();
      }

      for (const sel of selItems) {
        if (
          selectedWorklist.find((item) => item.ord_key == sel.ord_key) ==
          undefined
        ) {
          selectedWorklist.push(sel);
        }
      }

      if (selectedWorklist.length == 1) {
        if (
          selectedWorklist[0].ord_status_flag < myTypes.eOrderStatus.ORDERED ||
          selectedWorklist[0].ord_status_flag > myTypes.eOrderStatus.MATCHED
        ) {
          MsgBoxInfo.title = titleCancelOrder;
          msgBoxCmdType = "tStatusError";
        } else {
          msgBoxCmdType = "tAskCancelOrder";
        }
      } else {
        MsgBoxInfo.title = titleCancelOrder;
        msgBoxCmdType = "tSelectError";
      }

      updateMsgBoxInfo();

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
    };

    const cancelOrder = () => {
      let ordKeyList: number[] = [];

      while (ordKeyList.length > 0) {
        ordKeyList.pop();
      }

      for (const ord of selectedWorklist) {
        ordKeyList.push(ord.ord_key);
      }

      const query: myTypes.IMwlUpdateOrderStatusRequest = {
        ord_key_list: ordKeyList,
        ord_status: myTypes.eOrderStatus.CANCELED,
      };

      asyncUpdateOrderStatus(query);
    };

    async function asyncUpdateOrderStatus(
      reqQuery: myTypes.IMwlUpdateOrderStatusRequest
    ) {
      const res = await MwlService.UpdateOrderStatus(reqQuery);

      const { result, err_code } = res.data;

      msgBoxCmdType = "info";
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;

      if (result === true) {
        console.log("Succeed to update order ", reqQuery);
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = MsgUpdateOrderStatusSuccess;

        store.dispatch("MwlModelModule/setUpdateMwlMainTable");
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgUpdateOrderStatusFail}.\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgUpdateOrderStatusFail}.\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code == undefined) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgUpdateOrderStatusFail}.\n(Undefined Error: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else if (err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgUpdateOrderStatusFail}.\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgUpdateOrderStatusFail}.\n`;
      }

      MsgBoxInfo.isShow = true;
      console.log(MsgBoxInfo);
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
    }

    ///////////////////////////////////////////////
    // Delete Order
    const onHandleDeleteOrderCmd = () => {
      const selItems: myTypes.IDbWorklist[] =
        store.getters["MwlModelModule/GET_SELECTED_MWL_MAIN_TABLE_LIST"];

      while (selectedWorklist.length > 0) {
        selectedWorklist.pop();
      }

      for (const sel of selItems) {
        if (
          selectedWorklist.find((item) => item.ord_key == sel.ord_key) ==
          undefined
        ) {
          selectedWorklist.push(sel);
        }
      }

      msgBoxCmdType = "tAskDelete";
      updateMsgBoxInfo();

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
    };

    const deleteOrder = () => {
      let ordKeyList: number[] = [];

      while (ordKeyList.length > 0) {
        ordKeyList.pop();
      }

      for (const ord of selectedWorklist) {
        ordKeyList.push(ord.ord_key);
      }

      const query: myTypes.IMwlDeleteOrderRequest = {
        ord_key_list: ordKeyList,
      };

      asyncDeleteOrder(query);
    };

    async function asyncDeleteOrder(reqQuery: myTypes.IMwlDeleteOrderRequest) {
      const res = await MwlService.DeleteOrder(reqQuery);

      const { result, err_code } = res.data;

      msgBoxCmdType = "info";
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;

      if (result === true) {
        console.log("Succeed to delete order ", reqQuery);
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = MsgDeleteOrderSuccess;

        store.dispatch("MwlModelModule/setUpdateMwlMainTable");
      } else if (err_code == undefined) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgDeleteOrderFail}.\n(Undefined Error: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else if (err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgDeleteOrderFail}.\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgDeleteOrderFail}.\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `${MsgDeleteOrderFail}.\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
    }

    ///////////////////////////////////////////////
    // For SPS(Scheduled Procedure Step) Dialog
    // const showSpsDialog = ref(false);
    // const isSpsModify = ref(false);

    // const onHandleSpsDialogAdd = (): void => {
    //   showSpsDialog.value = false;
    // };

    // const onHandleSpsDialogCancel = (): void => {
    //   showSpsDialog.value = false;
    // };
    ///////////////////////////////////////////////

    ///////////////////////////////////////////////
    const onHandleCommands = (id: eMwlCommands, title: string): void => {
      let item: myTypes.IDbWorklist[] = [];

      switch (id) {
        case eMwlCommands.cmdAddPatient: // Add Patient
          showPatientDialog.value = true;
          isPatientModify.value = false;
          selPatientKey.value = -1;
          break;
        case eMwlCommands.cmdEditPatient:
          item =
            store.getters["MwlModelModule/GET_SELECTED_MWL_MAIN_TABLE_LIST"];
          if (item.length < 1) {
            selPatientKey.value = -1;
          } else {
            selPatientKey.value = item[0].pt_key;
          }

          console.log("cmdEditPatient: ", item, selPatientKey.value);

          showPatientDialog.value = true;
          isPatientModify.value = true;

          console.log(
            "command (%d: %s (key:%d))",
            id,
            title,
            selPatientKey.value
          );
          break;
        case eMwlCommands.cmdAddOrder:
          showOrderDialog.value = true;
          isOrderModify.value = false;
          selOrderKey.value = -1;
          console.log("command (%d: %s)", id, title, showOrderDialog.value);
          break;
        case eMwlCommands.cmdEditOrder:
          item =
            store.getters["MwlModelModule/GET_SELECTED_MWL_MAIN_TABLE_LIST"];

          if (isOrderType.value || isSpsType.value) {
            if (item.length > 0) {
              selOrderKey.value = item[0].ord_key;
            } else {
              selOrderKey.value = -1;
            }
          } else {
            selOrderKey.value = -1;
          }

          showOrderDialog.value = true;
          isOrderModify.value = true;

          console.log(
            "command (%d: %s (key:%d, acc_no:%s))",
            id,
            title,
            selOrderKey.value,
            item[0].ord_acc_num
          );
          break;
        case eMwlCommands.cmdCompleteOrder:
          console.log("command (%d: %s)", id, title);
          onHandleCompleteOrderCmd();
          break;
        case eMwlCommands.cmdCancelOrder:
          console.log("command (%d: %s)", id, title);
          onHandleCancelOrderCmd();
          break;
        case eMwlCommands.cmdDelete:
          console.log("command (%d: %s)", id, title);
          onHandleDeleteOrderCmd();
          break;
        case eMwlCommands.cmdChangeMwlMainTableToPatient:
          isPatientType.value = true;
          isOrderType.value = false;
          isSpsType.value = false;

          changeMwlMainTableType();

          console.log("command (%d: %s)", id, title);
          break;
        case eMwlCommands.cmdChangeMwlMainTableToOrder:
          isPatientType.value = false;
          isOrderType.value = true;
          isSpsType.value = false;

          changeMwlMainTableType();

          console.log("command (%d: %s)", id, title);
          break;
        case eMwlCommands.cmdChangeMwlMainTableToSps:
          isPatientType.value = false;
          isOrderType.value = false;
          isSpsType.value = true;

          changeMwlMainTableType();

          console.log("command (%d: %s)", id, title);
          break;
        default:
          console.log("unknown command (%d: %s)", id, title);
          break;
      }
    };

    let selectedWorklist: myTypes.IDbWorklist[] = reactive([]);

    // Message Box
    let msgBoxCmdType: tMsgBoxCmdType = "tAskDelete";
    const titleEditOrder = "Edit Order";
    const msgSelectOneItem = "You have to select one item.";
    // For Complete
    const titleCompleteOrder = "Complete Order";
    const msgAskCompleteOrder = () => {
      if (selectedWorklist.length <= 0) {
        return `Are you sure you want to complete the order`;
      }

      return `Are you sure you want to complete the order\n(Acc no: ${selectedWorklist[0].ord_acc_num})`;
    };
    // For Cancel
    const titleCancelOrder = "Cancel Order";
    const msgAskCancelOrder = () => {
      if (selectedWorklist.length <= 0) {
        return `Are you sure you want to cancel the order`;
      }

      return `Are you sure you want to cancel the order\n(Acc no: ${selectedWorklist[0].ord_acc_num})`;
    };

    // For Update
    const MsgUpdateOrderStatusSuccess =
      "Update status of the selected order successfully";
    const MsgUpdateOrderStatusFail =
      "Failed to update status of the selected order.";

    // For Delete
    const titleDeleteOrder = "Delete Order";
    const msgAskDeleteOrder = () => {
      if (selectedWorklist.length <= 0) {
        return `Are you sure you want to delete the order`;
      }

      return `Are you sure you want to delete the order\n(Acc no: ${selectedWorklist[0].ord_acc_num})`;
    };

    //const MsgDeleteOrder = `Are you sure you want to delete the order?\n(Acc no: ${selectedWorklist[0].ord_acc_num})`;
    const MsgDeleteOrderSuccess = "Delete order successfully";
    const MsgDeleteOrderFail = "Failed to delete order.";
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: titleDeleteOrder,
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok | myTypes.eMsgBoxResType.Cancel,
      style: "",

      msg: msgAskDeleteOrder(),
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      msgBoxCmdType = "info";

      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeNone;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = "";
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const updateMsgBoxInfo = () => {
      switch (msgBoxCmdType) {
        case "tAskCompleteOrder":
          MsgBoxInfo.isShow = false;
          MsgBoxInfo.title = titleCompleteOrder;
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
          MsgBoxInfo.resType =
            myTypes.eMsgBoxResType.Ok | myTypes.eMsgBoxResType.Cancel;
          MsgBoxInfo.style = "";

          MsgBoxInfo.msg = msgAskCompleteOrder();
          MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
          break;
        case "tAskCancelOrder":
          MsgBoxInfo.isShow = false;
          MsgBoxInfo.title = titleCancelOrder;
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
          MsgBoxInfo.resType =
            myTypes.eMsgBoxResType.Ok | myTypes.eMsgBoxResType.Cancel;
          MsgBoxInfo.style = "";

          MsgBoxInfo.msg = msgAskCancelOrder();
          MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
          break;
        case "tAskDelete":
          MsgBoxInfo.isShow = false;
          MsgBoxInfo.title = titleDeleteOrder;
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
          MsgBoxInfo.resType =
            myTypes.eMsgBoxResType.Ok | myTypes.eMsgBoxResType.Cancel;
          MsgBoxInfo.style = "";

          MsgBoxInfo.msg = msgAskDeleteOrder();
          MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
          break;
        case "tStatusError":
          MsgBoxInfo.isShow = false;
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
          MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
          MsgBoxInfo.style = "";

          MsgBoxInfo.msg = "Not Proper Status.";
          MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
          break;
        case "tSelectError":
          MsgBoxInfo.isShow = false;
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
          MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
          MsgBoxInfo.style = "";

          MsgBoxInfo.msg = msgSelectOneItem;
          MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
          break;
        case "tEditOrder":
          MsgBoxInfo.isShow = false;
          MsgBoxInfo.title = titleEditOrder;
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
          MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
          MsgBoxInfo.style = "";

          MsgBoxInfo.msg = msgSelectOneItem;
          MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
          break;
        default:
          initMsgBoxInfo();
      }
    };

    // [TODO: NEED TO FIX] (message box -> Ask Box)
    watch(
      () => store.getters["AppModelModule/GET_MSG_BOX_INFO"].res,
      () => {
        if (MsgBoxInfo.isShow == true) {
          const res = store.getters["AppModelModule/GET_MSG_BOX_INFO"].res;
          switch (msgBoxCmdType) {
            case "tAskCompleteOrder":
              if (res == myTypes.eMsgBoxRes.ResOk) {
                store.dispatch("AppModelModule/completeMsgBoxInfo");
                updateMsgBoxInfo();
                completeOrder();
              } else if (res == myTypes.eMsgBoxRes.ResCancel) {
                store.dispatch("AppModelModule/completeMsgBoxInfo");
                updateMsgBoxInfo();
              }
              break;
            case "tAskCancelOrder":
              if (res == myTypes.eMsgBoxRes.ResOk) {
                store.dispatch("AppModelModule/completeMsgBoxInfo");
                updateMsgBoxInfo();
                cancelOrder();
              } else if (res == myTypes.eMsgBoxRes.ResCancel) {
                store.dispatch("AppModelModule/completeMsgBoxInfo");
                updateMsgBoxInfo();
              }
              break;
            case "tAskDelete":
              if (res == myTypes.eMsgBoxRes.ResOk) {
                store.dispatch("AppModelModule/completeMsgBoxInfo");
                updateMsgBoxInfo();
                //
                deleteOrder();
              } else if (res == myTypes.eMsgBoxRes.ResCancel) {
                store.dispatch("AppModelModule/completeMsgBoxInfo");
                updateMsgBoxInfo();
              }
              break;
          }
        }
      }
    );

    const initInstance = () => {
      initMsgBoxInfo();
      selPatientKey.value = -1;
      selOrderKey.value = -1;
    };

    onMounted(initInstance);

    return {
      // Store(VUEX)
      toggleType,
      isSignedIn,
      isMainTableOrderType,
      isMwlMainTableSpsType,
      getTableTypeLabel,

      // For Patient
      showPatientDialog,
      isPatientModify,
      selPatientKey,
      onHandlePatientDialogAdd,
      onHandlePatientDialogEdit,
      onHandlePatientDialogCancel,
      //
      // For Order
      showOrderDialog,
      isOrderModify,
      selOrderKey,
      onHandleOrderDialogAdd,
      onHandleOrderDialogEdit,
      onHandleOrderDialogCancel,
      //
      isPatientType,
      isOrderType,
      isSpsType,
      //
      onHandleCommands,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/mwl.scss";
</style>
