<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="add-proc-plan-dialog">
        <div class="add-proc-plan-dialog__container">
          <div class="add-proc-plan-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="add-proc-plan-dialog__content">
            <!-- ID -->
            <LabelBase
              class="add-proc-plan-dialog__content__id-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("ID") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-proc-plan-dialog__content__id-input"
              :textMax="maxLengthRpId"
              v-model="inputProcPlan.proc_plan_id"
            />

            <!-- Description -->
            <LabelBase
              class="add-proc-plan-dialog__content__desc-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Description") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-proc-plan-dialog__content__desc-input"
              v-model="inputProcPlan.proc_plan_desc"
              :textMax="maxLengthRpDesc"
            />
            <!-- SPS List -->
            <LabelBase
              class="add-proc-plan-dialog__content__protocol-list-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("Protocol List") }}</h3>
              </template>
            </LabelBase>
            <ProtocolTable
              tableType="sub"
              class="add-proc-plan-dialog__content__protocol-list-table"
              :inputManual="isInputManual"
              :inputProtocolKeyList="inputProtKeys"
              :isSearchable="isSearchableSpsTable"
              :isSortable="isSortableSpsTable"
              :isNavigatable="isNavigatableSpsTable"
              :isPagenable="isPagenableSpsTable"
              :needUpdate="flagUpdateTable"
              :perPageDropdown="perPageDropdown"
              :defaultPage="defaultPage"
              @update:inputProtocolKeyList="onUpdateInputProtocolKeyList"
              @select-all="onRowSelectAllProtocolList"
              @row-click="onRowClickProtocolList"
            />
            <div class="add-proc-plan-dialog__content__protocol-list-buttons">
              <TextButton
                class="add-proc-plan-dialog__content__add-protocol-list-buttons"
                text="Add"
                buttonStyle="sub1"
                fontSize="11px"
                @click="onHandleAddProtocol()"
              />
              <TextButton
                class="add-proc-plan-dialog__content__delete-protocol-list-button"
                text="Delete"
                buttonStyle="sub1"
                fontSize="11px"
                @click="onHandleDeleteProtocol()"
              />
            </div>
          </div>
          <div class="add-proc-plan-dialog__control-row">
            <div class="add-proc-plan-dialog__control-row__add">
              <TextButton
                :text="okButtonText"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickAddButton()"
              />
            </div>
            <div class="add-proc-plan-dialog__control-row__cancel">
              <TextButton
                text="Cancel"
                buttonStyle="sub3"
                fontSize="16px"
                @click.prevent="onClickCancelButton()"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <SelectProtocolDialog
    :show="showSelectDialog"
    @onSelect="onHandleSelectFromSelectDialog"
    @onCancel="onHandleCancelFromSelectDialog"
  >
  </SelectProtocolDialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, PropType } from "vue";
import { useStore } from "vuex";
import * as myTypes from "@/types";
import MwlService from "@/service/MwlService";

import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import LabelBase from "@/components/label/LabelBase.vue";

import SelectProtocolDialog from "@/components/dialog/SelectProtocolDialog.vue";
import ProtocolTable from "@/components/table/ProtocolTable.vue";

export default defineComponent({
  name: "AddProcPlanDialog",

  components: {
    TextButton,
    TextInputBox,
    LabelBase,
    SelectProtocolDialog,
    ProtocolTable,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    isModify: {
      type: Boolean,
      default: false,
    },

    curProcPlan: {
      type: Object as PropType<myTypes.IDbProcPlan>,
      required: true,
    },
  },

  emits: ["on-ok", "on-cancel"],

  setup(props, context) {
    const store = useStore();

    const isShowModal = ref(false);

    const showSelectDialog = ref(false);
    const flagUpdateTable = ref(false);
    const isInputManual = ref(true);
    const isSearchableSpsTable = ref(false);
    const isSortableSpsTable = ref(false);
    const isNavigatableSpsTable = ref(true);
    const isPagenableSpsTable = ref(false);
    const perPageDropdown = ref([3, 5]);
    const defaultPage = ref(3);
    const protocolRowList: myTypes.ITableRowState[] = [];

    async function fetchProtocolList(
      reqQuery: myTypes.IMwlGetProtocolListQueryCondition
    ) {
      const res = await MwlService.GetProtocolList(reqQuery);

      let { result, data } = res.data;

      while (inputProtKeys.length > 0) {
        inputProtKeys.pop();
      }

      if (result === true) {
        for (const protocol of data) {
          inputProtKeys.push(protocol.prot_key);
        }
      } else {
        console.log("onHandleProcPlanSelected) No Protocols ");
      }

      flagUpdateTable.value = !flagUpdateTable.value;
    }

    const title = ref("Add Procedure Plan");

    const maxLengthRpId = ref(16);
    const maxLengthRpDesc = ref(64);

    const inputProcPlan = ref({
      proc_plan_key: -1,
      proc_plan_id: "",
      proc_plan_desc: "",

      proc_plan_protocols: [],
    } as myTypes.IDbProcPlan);

    const inputProtKeys = reactive([] as number[]);

    watch(
      () => props.show,
      () => {
        isShowModal.value = props.show;

        if (props.show) {
          initInstance();
        }
      }
    );

    watch(
      () => inputProcPlan,
      () => {
        if (
          inputProcPlan.value.proc_plan_key != undefined &&
          inputProcPlan.value.proc_plan_key > 0
        ) {
          const reqQuery: myTypes.IMwlGetProtocolListQueryCondition = {
            proc_plan_key: inputProcPlan.value.proc_plan_key,
          };

          fetchProtocolList(reqQuery);
        }
      }
    );

    const reset = () => {
      inputProcPlan.value.proc_plan_key = -1;
      inputProcPlan.value.proc_plan_id = "";
      inputProcPlan.value.proc_plan_desc = "";

      inputProcPlan.value.proc_plan_protocols = [];

      while (inputProcPlan.value.proc_plan_protocols.length > 0) {
        inputProtKeys.pop();
      }
    };

    const initInstance = () => {
      initMsgBoxInfo();
      initControl();
    };

    const initControl = () => {
      while (protocolRowList.length > 0) {
        protocolRowList.pop();
      }

      while (inputProtKeys.length > 0) {
        inputProtKeys.pop();
      }

      if (props.isModify) {
        title.value = "Modify Procedure Plan";

        inputProcPlan.value.proc_plan_key = props.curProcPlan.proc_plan_key;
        inputProcPlan.value.proc_plan_id = props.curProcPlan.proc_plan_id;
        inputProcPlan.value.proc_plan_desc = props.curProcPlan.proc_plan_desc;

        okButtonText.value = "Modify";

        const reqQuery: myTypes.IMwlGetProtocolListQueryCondition = {
          proc_plan_key: inputProcPlan.value.proc_plan_key,
        };

        fetchProtocolList(reqQuery);
      } else {
        title.value = "Add Procedure Plan";

        reset();
        okButtonText.value = "Add";
      }

      flagUpdateTable.value = !flagUpdateTable.value;
    };

    // Protocol List
    const onHandleAddProtocol = () => {
      showSelectDialog.value = true;
    };

    const onHandleDeleteProtocol = () => {
      if (inputProcPlan.value.proc_plan_protocols == undefined) return;

      const orgProtocolRow = protocolRowList;

      while (inputProtKeys.length > 0) {
        inputProtKeys.pop();
      }

      for (const row of orgProtocolRow) {
        if (!row.isSelected) {
          inputProtKeys.push(Number(row.id));
        }
      }

      flagUpdateTable.value = !flagUpdateTable.value;
    };

    watch(
      () => inputProtKeys.length,
      () => {
        while (protocolRowList.length > 0) {
          protocolRowList.pop();
        }

        if (inputProtKeys != undefined && inputProtKeys.length > 0) {
          for (let idx = 0; idx < inputProtKeys.length; idx++) {
            protocolRowList.push({
              index: idx,
              id: inputProtKeys[idx].toString(),
              isSelected: false,
            });
          }
        }
      }
    );

    const onUpdateInputProtocolKeyList = (protocolKeyList: number[]): void => {
      while (inputProtKeys.length > 0) {
        inputProtKeys.pop();
      }

      for (const key of protocolKeyList) {
        inputProtKeys.push(key);
      }

      console.log("onUpdateInputProtocolKeyList: ", inputProtKeys);
    };

    const onRowSelectAllProtocolList = (isSelect: boolean): void => {
      for (const protocolRow of protocolRowList) {
        protocolRow.isSelected = isSelect;
      }

      console.log("onRowSelectAllProtocolList: ", protocolRowList);
    };

    const onRowClickProtocolList = (rowState: myTypes.ITableRowState): void => {
      if (protocolRowList.length < rowState.index) return;

      protocolRowList[rowState.index].isSelected = rowState.isSelected;
    };

    // From Select Dialog
    const onHandleSelectFromSelectDialog = (
      selectedProtocolList: myTypes.IDbProtocol[]
    ): void => {
      for (let i = 0; i < selectedProtocolList.length; i++) {
        inputProtKeys.push(selectedProtocolList[i].prot_key);
      }

      showSelectDialog.value = false;
      flagUpdateTable.value = !flagUpdateTable.value;

      console.log(
        "onHandleSelectFromSelectDialog Selected PROTOCOL KEYS: ",
        inputProtKeys,
        flagUpdateTable.value
      );
    };

    const onHandleCancelFromSelectDialog = (): void => {
      showSelectDialog.value = false;
    };

    const okButtonText = ref("Add");

    const onClickAddButton = () => {
      if (inputProtKeys.values == undefined || inputProtKeys.length <= 0) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](12020);

        if (props.isModify) {
          MsgBoxInfo.msg = `${failedModifyRpInfo}\n(Reason: ${errDesc} )`;
        } else {
          MsgBoxInfo.msg = `${failedAddRpInfo}\n(Reason: ${errDesc} )`;
        }

        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

        return;
      }

      //const procPlan: myTypes.IDbProcPlan = inputProcPlan;

      context.emit("on-ok", inputProcPlan.value, inputProtKeys);
      reset();
    };

    const onClickCancelButton = () => {
      context.emit("on-cancel");
      reset();
    };

    const failedAddRpInfo = "Failed to add requested procedure";
    const failedModifyRpInfo = "Failed to modify requested procedure";

    const titleMsg = ref("Add Procedure Plan");

    // Message Box
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: titleMsg.value,
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: "Added requested procedure successfully.",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Add Procedure Plan Result";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "";

      MsgBoxInfo.msg = "Added requested procedure successfully.";
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    return {
      isShowModal,
      //
      title,
      maxLengthRpId,
      maxLengthRpDesc,
      //
      // Data
      inputProcPlan,
      inputProtKeys,
      //
      // SPS List
      onHandleAddProtocol,
      onHandleDeleteProtocol,
      showSelectDialog,
      flagUpdateTable,
      isInputManual,
      isSearchableSpsTable,
      isSortableSpsTable,
      isNavigatableSpsTable,
      isPagenableSpsTable,
      perPageDropdown,
      defaultPage,
      onUpdateInputProtocolKeyList,
      onRowSelectAllProtocolList,
      onRowClickProtocolList,
      onHandleSelectFromSelectDialog,
      onHandleCancelFromSelectDialog,
      //
      // Buttons
      okButtonText,
      onClickAddButton,
      onClickCancelButton,

      titleMsg,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
