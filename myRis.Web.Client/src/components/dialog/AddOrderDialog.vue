<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="add-order-dialog">
        <div class="add-order-dialog__container">
          <span class="add-order-dialog__title">
            <h2>{{ $t(title) }}</h2>
            <div class="add-order-dialog__title__search-icon" v-show="isModify">
              <SvgBaseIcon viewBox="0, 0, 512, 512" @click="onShowOrderDialog">
                <template v-slot:default>
                  <MagnifyingGlass />
                </template>
              </SvgBaseIcon>
            </div>
          </span>
          <div class="add-order-dialog__content" :style="getContentStyle">
            <!--ID -->
            <GroupBoxBase
              title="ID"
              class="add-order-dialog__content__group-id"
            >
              <template v-slot:content>
                <div class="add-order-dialog__content__group-id__container">
                  <!-- ID) Accession Number -->
                  <LabelBase
                    class="add-order-dialog__content__group-id__acc-no-label"
                    displayText="Acc No"
                    markType="required"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-id__acc-no-input"
                    v-model="inputAccNumber"
                    placeholder="Accession Number"
                    :isReadonly="isModify"
                    :textMax="maxLengthAccNum"
                    inputStyle="table"
                  />

                  <TextButton
                    class="add-order-dialog__content__group-id__acc-no-generate"
                    v-show="isShowGenerateAccNumber"
                    text="Generate"
                    buttonStyle="sub1"
                    fontSize="12px"
                    :isDisabled="isModify"
                    @click="onHandleGenerateAccNumber()"
                  />
                </div>
              </template>
            </GroupBoxBase>

            <!-- Patient -->
            <GroupBoxBase
              title="Patient"
              class="add-order-dialog__content__group-patient"
              :isSearchable="isShowSearchPatient"
              @onSearch="onHandleSearchPatient"
            >
              <template v-slot:content>
                <div
                  class="add-order-dialog__content__group-patient__container"
                >
                  <!-- Patient) ID -->
                  <LabelBase
                    class="add-order-dialog__content__group-patient__id-label"
                    displayText="Patient ID"
                    markType="required"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-patient__id-input"
                    v-model="inputPatient.pt_id"
                    expandWidth="200%"
                    placeholder="Patient ID"
                    inputStyle="table"
                    :textMax="maxLengthPatientId"
                    :extTableCols="searchedPatientColums"
                    :extTableRows="getSearchedPatientIDList"
                    @onTextChanged="onHandleTextChanged('PatientID')"
                    @onRowClick="onHandlePatientSelected"
                  />
                  <!-- Patient) Name -->
                  <LabelBase
                    class="add-order-dialog__content__group-patient__name-label"
                    displayText="Patient Name"
                    markType="space"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-patient__name-input"
                    v-model="getDisplayFullName"
                    placeholder="First Name"
                    inputStyle="table"
                    :textMax="maxLengthPatientName"
                    :extTableCols="searchedPatientColums"
                    :extTableRows="getSearchedPatientNameList"
                    expandWidth="200%"
                    @onTextChanged="onHandleTextChanged('PatientFirstName')"
                    @onRowClick="onHandlePatientSelected"
                  />

                  <!-- Patient) Sex -->
                  <LabelBase
                    class="add-order-dialog__content__group-patient__sex-label"
                    displayText="Sex"
                    markType="space"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-patient__sex-input"
                    v-model="inputPatient.pt_sex"
                    placeholder="Male / Female / Other"
                    inputStyle="table"
                    :isReadonly="isReadOnly"
                  />

                  <!-- Patient) Birth Date -->
                  <LabelBase
                    class="add-order-dialog__content__group-patient__birth-label"
                    displayText="Birth Date"
                    markType="space"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-patient__birth-input"
                    v-model="inputPatientBirthDate"
                    placeholder="YYYY-MM-DD"
                    inputStyle="table"
                    :isReadonly="isReadOnly"
                  />
                </div>
              </template>
            </GroupBoxBase>

            <!-- RP -->
            <GroupBoxBase
              title="Procedure"
              class="add-order-dialog__content__group-rp"
              :isSearchable="isShowSearchRp"
              :style="getContentStyle"
              @onSearch="onHandleSearchRp()"
            >
              <template v-slot:content>
                <div class="add-order-dialog__content__group-rp__container">
                  <!-- RP) ID -->
                  <LabelBase
                    class="add-order-dialog__content__group-rp__id-label"
                    displayText="Procedure ID"
                    markType="required"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-rp__id-input"
                    v-model="inputProcPlan.proc_plan_id"
                    placeholder="Procedure Plan ID"
                    inputStyle="table"
                    :isReadonly="isModify"
                    @onTextChanged="onHandleTextChanged('ProcPlanId')"
                    :extTableCols="searchedProcPlanColums"
                    :extTableRows="getSearchedProcPlanList"
                    @popup="onHandlePopupEvent"
                    @onRowClick="onHandleProcPlanSelected"
                  />
                  <TextButton
                    class="add-order-dialog__content__group-rp__check"
                    v-show="isShowCheckRp"
                    text="Check"
                    buttonStyle="sub1"
                    fontSize="12px"
                    @click="onHandleCheckProcPlan()"
                  />

                  <!-- RP) Description -->
                  <LabelBase
                    class="add-order-dialog__content__group-rp__desc-label"
                    displayText="Description"
                    markType="space"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-rp__desc-input"
                    v-model="inputProcPlan.proc_plan_desc"
                    placeholder="Description"
                    inputStyle="table"
                    :isReadonly="isReadOnly"
                  />

                  <!-- For Add) Protocol Table (Before Create SPS) -->
                  <ProtocolTable
                    v-if="isShowAdd"
                    tableType="sub"
                    class="add-order-dialog__content__group-rp__protocol-table"
                    title="Procedure Step List"
                    :style="getContentStyle"
                    :inputManual="isInputManual"
                    :inputProtocolKeyList="inputProtocalKeys"
                    :isSelectable="isSelectableSpsTable"
                    :isSearchable="isSearchableSpsTable"
                    :isSortable="isSortableSpsTable"
                    :isNavigatable="isNavigatableSpsTable"
                    :isPagenable="isPagenableSpsTable"
                    :isSchedulingTable="isSchedulingTable"
                    :needUpdate="flagUpdateRpTable"
                    :perPageDropdown="perPageDropdown"
                    :defaultPage="defaultPage"
                    @update:inputProtocolKeyList="onUpdateinputProtocolKeyList"
                    @update:spsInfo="onUpdateSpsInfo"
                    @select-all="onRowSelectAllSpsList"
                    @row-click="onRowClickSpsList"
                    @popup="onHandlePopupEvent"
                  />
                  <!-- For Edit) SPS Table -->
                  <SpsTable
                    v-else-if="isShowModify"
                    tableType="sub"
                    class="add-order-dialog__content__group-rp__sps-table"
                    title="Scheduled Procedure Step List"
                    :style="getContentStyle"
                    :inputManual="isInputManual"
                    :inputSpsKeyList="spsKeyListForTalble"
                    :isSelectable="isSelectableSpsTable"
                    :isSearchable="isSearchableSpsTable"
                    :isSortable="isSortableSpsTable"
                    :isNavigatable="isNavigatableSpsTable"
                    :isPagenable="isPagenableSpsTable"
                    :isSchedulingTable="isSchedulingTable"
                    :needUpdate="flagUpdateRpTable"
                    :perPageDropdown="perPageDropdown"
                    :defaultPage="defaultPage"
                    @update:inputSpsKeyList="onUpdateinputSpsKeyList"
                    @update:spsInfo="onUpdateSpsInfo"
                    @select-all="onRowSelectAllSpsList"
                    @row-click="onRowClickSpsList"
                    @popup="onHandlePopupEvent"
                  />
                </div>
              </template>
            </GroupBoxBase>

            <!-- Etc -->
            <GroupBoxBase
              title="Etc"
              class="add-order-dialog__content__group-etc"
            >
              <template v-slot:content>
                <div class="add-order-dialog__content__group-etc__container">
                  <!-- ETC) Req. Physician -->
                  <LabelBase
                    class="add-order-dialog__content__group-etc__req-phys-label"
                    displayText="Req. Physician"
                    markType="space"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-etc__req-phys-input"
                    v-model="inputReqPhyc"
                    placeholder="Requesting Physician"
                    inputStyle="table"
                    expandWidth="150%"
                    :textMax="maxLengthPhysName"
                    :extTableCols="searchedPhysicianColums"
                    :extTableRows="getSearchedReqPhysicianList"
                    @popup="onHandlePopupEvent"
                    @onTextChanged="onHandleTextChanged('ReqPhysician')"
                    @onRowClick="onHandleReqPhysicianSelected"
                    @focus="onHandleReqPhysicianFocused"
                  />

                  <!-- ETC) Ref. Physician -->
                  <LabelBase
                    class="add-order-dialog__content__group-etc__ref-phys-label"
                    displayText="Ref. Physician"
                    markType="space"
                  />
                  <TextInputBox
                    class="add-order-dialog__content__group-etc__ref-phys-input"
                    v-model="inputRefPhyc"
                    placeholder="Referring Physician"
                    inputStyle="table"
                    expandWidth="150%"
                    :textMax="maxLengthPhysName"
                    :extTableCols="searchedPhysicianColums"
                    :extTableRows="getSearchedRefPhysicianList"
                    @popup="onHandlePopupEvent"
                    @onTextChanged="onHandleTextChanged('RefPhysician')"
                    @onRowClick="onHandleRefPhysicianSelected"
                    @focus="onHandleRefPhysicianFocused"
                  />
                  <!-- ETC) Priority -->
                  <LabelBase
                    class="add-order-dialog__content__group-etc__priority-label"
                    displayText="Priority"
                    markType="space"
                  />
                  <DropDownBase
                    class="add-order-dialog__content__group-etc__priority-input"
                    v-model="inputPriority"
                    placeholder="Priority"
                    :options="optionsPriority"
                    inputStyle="table"
                    :isNoneBorder="isNoneBorder"
                    @popup="onHandlePopupEvent"
                  />

                  <!-- ETC) Reason -->
                  <LabelBase
                    class="add-order-dialog__content__group-etc__reason-label"
                    displayText="Reason"
                    markType="space"
                  />
                  <DropDownBase
                    class="add-order-dialog__content__group-etc__reason-input"
                    v-model="inputOrdReason"
                    placeholder="Reason"
                    :options="getOrdReasonOptions"
                    inputStyle="table"
                    :isNoneBorder="isNoneBorder"
                    @popup="onHandlePopupEvent"
                  />
                </div>
              </template>
            </GroupBoxBase>
          </div>
          <div class="add-order-dialog__buttons">
            <TextButton
              v-show="isShowAdd"
              text="Add"
              buttonStyle="primary"
              fontSize="14px"
              @click="onHandleAdd()"
            />
            <TextButton
              v-show="isShowModify"
              text="Modify"
              buttonStyle="primary"
              fontSize="14px"
              @click="onHandleModify()"
            />
            <TextButton
              v-show="isShowCancel"
              text="Cancel"
              buttonStyle="sub3"
              fontSize="14px"
              @click="onHandleCancel()"
            />
          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <SelectOrderDialog
    :show="showSearchOrderDialog"
    @onSelect="onHandleSelectOrder"
    @onCancel="onHandleCancelOrder"
  >
  </SelectOrderDialog>

  <SelectPatientDialog
    :show="showSearchPatientDialog"
    @onSelect="onHandleSelectPatient"
    @onCancel="onHandleCancelPatient"
  >
  </SelectPatientDialog>

  <SelectProcPlanDialog
    :show="showSearchProcPlanDialog"
    @onSelect="onHandleSelectProcPlan"
    @onCancel="onHandleCancelProcPlan"
  >
  </SelectProcPlanDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  reactive,
  watch,
} from "vue";
import * as myTypes from "@/types";
import * as myUtils from "@/utils/";
import { useStore } from "vuex";

import MwlService from "@/service/MwlService";

import GroupBoxBase from "@/components/container/GroupBoxBase.vue";
import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import LabelBase from "@/components/label/LabelBase.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";

import ProtocolTable from "@/components/table/ProtocolTable.vue";
import SpsTable from "@/components/table/SpsTable.vue";

import SelectPatientDialog from "@/components/dialog/SelectPatientDialog.vue";
import SelectOrderDialog from "@/components/dialog/SelectOrderDialog.vue";
import SelectProcPlanDialog from "@/components/dialog/SelectProcPlanDialog.vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import MagnifyingGlass from "@/assets/etc/MagnifyingGlass.vue";

enum eState {
  stateNone = 0,
  stateSuccess = 1,
  stateFail,
}

type TInputType =
  | "PatientFirstName"
  | "PatientLastName"
  | "PatientID"
  | "ReqPhysician"
  | "RefPhysician"
  | "ProcPlanId";

export default defineComponent({
  name: "AddOrderDialog",

  components: {
    GroupBoxBase,
    LabelBase,
    TextButton,
    TextInputBox,
    DropDownBase,
    ProtocolTable,
    SpsTable,
    //
    SelectPatientDialog,
    SelectOrderDialog,
    SelectProcPlanDialog,
    //
    SvgBaseIcon,
    MagnifyingGlass,
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

    editOrdKey: {
      type: Number,
      default: -1,
    },
  },

  emits: ["on-add", "on-modify", "on-cancel", "on-create-patient"],

  setup(props, context) {
    const isShowModal = ref(false);
    watch(
      () => props.show,
      () => {
        isShowModal.value = props.show;

        if (props.show) {
          store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
          initInstance();
        }
      }
    );

    const title = ref("Add Order");

    const store = useStore();

    let resOrderKey = -1;
    const curState = ref(eState.stateNone);
    watch(curState, () => {
      switch (curState.value) {
        case eState.stateSuccess:
          if (props.isModify) {
            console.log("Succeed to modify Order", resOrderKey);
            context.emit("on-modify", resOrderKey);
          } else {
            console.log("Succeed to add Order", resOrderKey);
            context.emit("on-add", resOrderKey);
          }
          resOrderKey = -1;
          curState.value = eState.stateNone;
          break;
        case eState.stateFail:
          console.log("Failed (%s)", MsgBoxInfo.msg);
          break;
        case eState.stateNone:
          break;
      }
    });

    // Style
    const getContentStyle = computed(() => {
      let styles = { overflow: "auto" };

      if (popupState.value == true) {
        styles.overflow = "visible";
      }

      return styles;
    });

    const isNoneBorder = ref(true);
    const isReadOnly = ref(true);

    const isShowSearchPatient = computed(() => {
      return !props.isModify;
    });
    const isShowGenerateAccNumber = ref(true);
    const isShowSearchRp = computed(() => {
      return !props.isModify;
    });

    const isShowCheckRp = ref(false);

    const isShowAdd = ref(true);
    const isShowModify = ref(false);
    const isShowCancel = ref(true);

    // For Requsted Procedures (Patient)
    const inputPatient = reactive({
      pt_key: -1,

      pt_id: "", // required
      pt_name: "", // required
      pt_sex: "",

      pt_age: "", // VR: AS(Age String, 4byte char)
      pt_birth_dttm: new Date(myUtils.initDateString), // required

      pt_weight: undefined,
      pt_size: undefined,

      pt_address: undefined,
      pt_tel: undefined,

      pt_state: undefined,
      pt_med_alert: undefined,
      pt_allergies: undefined,

      pt_comment: undefined,
      pt_responsible_person: undefined,

      // T_SPECIES
      species_type: undefined,
      species_code_value: undefined,
      species_scm_design: undefined,
      species_code_meaning: undefined,

      // T_BREED
      breed_code_value: undefined,
      breed_scm_design: undefined,
      breed_code_meaning: undefined,
    } as myTypes.IDbPatient);

    const inputPatientFirstName = ref("");
    const inputPatientLastName = ref("");
    const inputPatientBirthDate = ref("");

    // Order Info
    const inputAccNumber = ref("");
    const inputIssuer = ref("");

    const inputReqPhyc = ref("");
    const inputRefPhyc = ref("");

    // For Requsted Procedures (RP)
    const inputProcPlan = reactive({
      proc_plan_key: -1,
      proc_plan_id: "",
      proc_plan_desc: "",
    } as myTypes.IDbProcPlan);

    watch(
      () => inputProcPlan,
      () => {
        if (
          inputProcPlan.proc_plan_key != undefined &&
          inputProcPlan.proc_plan_key > 0
        ) {
          const reqQuery: myTypes.IMwlGetProtocolListQueryCondition = {
            proc_plan_key: inputProcPlan.proc_plan_key,
          };

          fetchProtocolList(reqQuery);
        }
      }
    );

    const inputProtocalKeys = reactive([] as number[]);

    const spsKeyListForTalble = ref("");
    const inputSpsList: myTypes.IDbSps[] = reactive([]);

    const isValidInput = (): string => {
      let err = "";

      if (inputAccNumber.value == undefined || inputAccNumber.value == "") {
        err = "Invalid accession number.";
      } else if (inputPatient.pt_id == undefined || inputPatient.pt_id == "") {
        err = "Invalid patient ID";
      } else if (
        inputProcPlan.proc_plan_id == undefined ||
        inputProcPlan.proc_plan_id == ""
      ) {
        err = "Invalid Procedure Plan ID";
      }

      if (err != "") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;

        if (props.isModify == true) {
          MsgBoxInfo.msg = `Failed to modify order.\n(Reason: ${err} )`;
        } else {
          MsgBoxInfo.msg = `Failed to add order.\n(Reason: ${err} )`;
        }
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
        //
        curState.value = eState.stateFail;
      }

      return err;
    };

    const flagUpdateRpTable = ref(false);
    const isInputManual = ref(true);
    const isSelectableSpsTable = ref(false);
    const isSearchableSpsTable = ref(false);
    const isSortableSpsTable = ref(false);
    const isNavigatableSpsTable = ref(true);
    const isPagenableSpsTable = ref(true);
    const isSchedulingTable = ref(true);
    const perPageDropdown = ref([3, 2, 1]);
    const defaultPage = ref(3);
    const spsRowList: myTypes.ITableRowState[] = [];

    watch(
      () => inputProtocalKeys.length,
      () => {
        while (spsRowList.length > 0) {
          spsRowList.pop();
        }

        if (
          inputProtocalKeys.values != undefined &&
          inputProtocalKeys.length <= 0
        ) {
          for (let idx = 0; idx < inputProtocalKeys.length; idx++) {
            spsRowList.push({
              index: idx,
              id: inputProtocalKeys[idx].toString(),
              isSelected: false,
            });
          }
        }

        flagUpdateRpTable.value = !flagUpdateRpTable.value;
      }
    );

    // For Add
    const onUpdateinputProtocolKeyList = (protocolKeyList: number[]): void => {
      while (inputProtocalKeys.length > 0) {
        inputProtocalKeys.pop();
      }

      for (const key of protocolKeyList) {
        inputProtocalKeys.push(key);
      }

      console.log("onUpdateinputProtocolKeyList: ", inputProtocalKeys);
    };

    // For Edit
    const onUpdateinputSpsKeyList = (spsKeyList: string): void => {
      spsKeyListForTalble.value = spsKeyList;

      console.log("onUpdateinputSpsKeyList: ", spsKeyListForTalble.value);
    };

    const onUpdateSpsInfo = (spsInfo: myTypes.IDbSps[]): void => {
      while (inputSpsList.length > 0) {
        inputSpsList.pop();
      }

      for (const sps of spsInfo) {
        inputSpsList.push(sps);
      }
    };

    const onRowSelectAllSpsList = (isSelect: boolean): void => {
      for (const protocolRow of spsRowList) {
        protocolRow.isSelected = isSelect;
      }

      console.log("onRowSelectAllSpsList: ", spsRowList);
    };

    const onRowClickSpsList = (rowState: myTypes.ITableRowState): void => {
      if (spsRowList.length <= rowState.index) return;

      console.log("onRowClickSpsList) ", spsRowList, rowState);

      spsRowList[rowState.index].isSelected = rowState.isSelected;
    };

    const popupState = ref(false);
    const onHandlePopupEvent = (state: boolean): void => {
      popupState.value = state;
    };

    const inputStudyDttm = ref("");
    const inputOrdReason = ref("");
    const searchedOrdReasonList: myTypes.IDbOrdReason[] = reactive([]);
    const inputPriority = ref("NONE");

    const maxLengthAccNum = ref(64);
    const maxLengthPatientId = ref(64);
    const maxLengthPatientName = ref(256);
    const maxLengthPhysName = ref(64);
    const maxLengthIssuer = ref(64);
    const maxLengthReason = ref(64);

    const optionsPriority = reactive([
      myTypes.parsePriority(myTypes.eOrderPriority.NONE),
      myTypes.parsePriority(myTypes.eOrderPriority.STAT),
      myTypes.parsePriority(myTypes.eOrderPriority.HIGH),
      myTypes.parsePriority(myTypes.eOrderPriority.ROUTINE),
      myTypes.parsePriority(myTypes.eOrderPriority.MEDIUM),
      myTypes.parsePriority(myTypes.eOrderPriority.LOW),
    ]);

    const isFocusedtoReqPhyc = ref(false);
    const isFocusedtoRefPhyc = ref(false);

    const getDisplayFullName = computed(() => {
      if (inputPatient.pt_name == undefined || inputPatient.pt_name == "")
        return undefined;

      const fullName =
        inputPatientFirstName.value + " " + inputPatientLastName.value;

      return fullName;
    });

    const getPatientFullName = computed(() => {
      const fullName = myUtils.GetPN(
        inputPatientLastName.value,
        inputPatientFirstName.value
      );

      return fullName;
    });

    const searchedPhysicianColums = computed(() => {
      return myTypes.popupPhysicianColumList;
    });

    const searchedPatientColums = computed(() => {
      return myTypes.popupPatientColumList;
    });

    const searchedProcPlanColums = computed(() => {
      return myTypes.popupProcPlanColumList;
    });

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Add Order Result",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "line-height: 2",

      msg: "Added order successfully.",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Add Order Result";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "line-height: 2";

      MsgBoxInfo.msg = "Added order successfully.";
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const onHandleTextChanged = (type: TInputType) => {
      switch (type) {
        case "PatientID":
          FetchPatientList(inputPatient.pt_id, "", false);

          if (inputPatient.pt_id === "") {
            inputPatient.pt_key = -1;
            updatePatient();
          }

          break;
        case "PatientFirstName":
          FetchPatientList("", getPatientFullName.value, false);
          break;
        case "PatientLastName":
          FetchPatientList("", getPatientFullName.value, false);
          break;
        case "ReqPhysician":
          FetchPhysicianList(inputReqPhyc.value);
          break;
        case "RefPhysician":
          FetchPhysicianList(inputRefPhyc.value);
          break;
        case "ProcPlanId":
          fetchProcPlanList(inputProcPlan.proc_plan_id, false);
          break;
        default:
          break;
      }
    };

    const initPatientInfo = () => {
      inputPatient.pt_key = -1;
      inputPatient.pt_id = ""; // required
      inputPatient.pt_name = ""; // required
      inputPatient.pt_sex = "";

      inputPatient.pt_age = ""; // VR: AS(Age String; 4byte char)
      inputPatient.pt_birth_dttm = new Date(myUtils.initDateString); // required

      inputPatient.pt_weight = undefined;
      inputPatient.pt_size = undefined;

      inputPatient.pt_address = undefined;
      inputPatient.pt_tel = undefined;

      inputPatient.pt_state = undefined;
      inputPatient.pt_med_alert = undefined;
      inputPatient.pt_allergies = undefined;

      inputPatient.pt_comment = undefined;
      inputPatient.pt_responsible_person = undefined;

      inputPatientFirstName.value = "";
      inputPatientLastName.value = "";
      inputPatientBirthDate.value = "";
    };

    const initProcPlanInfo = () => {
      inputProcPlan.proc_plan_key = -1;
      inputProcPlan.proc_plan_id = "";
      inputProcPlan.proc_plan_desc = "";

      while (inputProtocalKeys.length > 0) {
        inputProtocalKeys.pop();
      }
    };

    const initInstance = () => {
      initMsgBoxInfo();
      initControl();
      updatePatient();

      AsyncFetchOrdReasonList();
    };

    const initControl = () => {
      resOrderKey = -1;
      curState.value = eState.stateNone;
      inputPatient.pt_key = -1;

      initPatientInfo();
      initProcPlanInfo();

      inputAccNumber.value = "";
      //inputIssuer.value = curUserName();
      inputIssuer.value = "myRisWeb";

      inputReqPhyc.value = "";
      inputRefPhyc.value = "";

      inputStudyDttm.value = "";
      inputOrdReason.value = "";
      inputPriority.value = "NONE";

      spsKeyListForTalble.value = "";

      if (props.isModify) {
        isShowAdd.value = false;
        isShowModify.value = true;
        isShowGenerateAccNumber.value = false;

        title.value = "Edit Order";

        if (props.editOrdKey > -1) {
          AsyncGetOrder({
            ord_key: props.editOrdKey,
          });

          AsyncGetSpsList({
            ord_key: props.editOrdKey,
          });
        }
      } else {
        isShowAdd.value = true;
        isShowModify.value = false;
        isShowGenerateAccNumber.value = true;

        title.value = "Add Order";
      }
    };

    const updatePatient = () => {
      if (inputPatient.pt_key > -1) {
        AsyncGetPatient({
          pt_key: inputPatient.pt_key,

          pt_id: "",
          pt_name: "",

          is_strict_condition: false,
        });
      } else {
        inputPatient.pt_id = "";
        inputPatient.pt_sex = "";

        inputPatientFirstName.value = "";
        inputPatientLastName.value = "";
        inputPatientBirthDate.value = "";
      }
    };

    onMounted(initInstance);

    const getSearchedReqPhysicianList = computed(() => {
      if (!isFocusedtoReqPhyc.value) return [];

      let searchedPhysicians: myTypes.IDbUser[] =
        store.getters["UserModelModule/GET_SEARCHED_USERS"];

      let res: myTypes.IPhysicianTableRow[] = [];

      let iterator = 0;
      for (let physician of searchedPhysicians) {
        res.push(
          new myTypes.PhysicianTableRow(
            iterator++,
            physician.user_key,
            myTypes.parseUserLevel(physician.user_level),
            physician.user_id,
            physician.user_name
          )
        );
      }

      return res;
    });

    const getSearchedRefPhysicianList = computed(() => {
      if (!isFocusedtoRefPhyc.value) return [];

      let searchedPhysicians: myTypes.IDbUser[] =
        store.getters["UserModelModule/GET_SEARCHED_USERS"];

      let res: myTypes.IPhysicianTableRow[] = [];
      let iterator = 0;

      for (let physician of searchedPhysicians) {
        res.push(
          new myTypes.PhysicianTableRow(
            iterator++,
            physician.user_key,
            myTypes.parseUserLevel(physician.user_level),
            physician.user_id,
            physician.user_name
          )
        );
      }

      return res;
    });

    const onHandleReqPhysicianFocused = () => {
      isFocusedtoReqPhyc.value = true;
      isFocusedtoRefPhyc.value = false;
    };

    const onHandleReqPhysicianSelected = (param) => {
      console.log("onHandleReqPhysicianSelected: ", param.row);
      const physicianInfo: myTypes.PhysicianTableRow = param.row;

      inputReqPhyc.value = physicianInfo.name;
    };

    const onHandleRefPhysicianFocused = () => {
      isFocusedtoRefPhyc.value = true;
      isFocusedtoReqPhyc.value = false;
    };

    const onHandleRefPhysicianSelected = (param) => {
      const physicianInfo: myTypes.PhysicianTableRow = param.row;

      inputRefPhyc.value = physicianInfo.name;
    };

    async function FetchPhysicianList(physicianName: string) {
      let reqQuery: myTypes.IUserGetUserQueryCondition = {
        user_level: myTypes.eUserLevel.Physician,
        user_name: physicianName,

        is_strict_condition: false,
      };

      if (physicianName === "" || physicianName === undefined) {
        reqQuery.is_strict_condition = true;
      }

      store.dispatch("UserModelModule/fetchSearchedUsers", reqQuery);
    }

    const getSearchedPatientIDList = computed(() => {
      let res: myTypes.IPatientTableRow[] = [];

      let searchedPatients: myTypes.IDbPatient[] =
        store.getters["MwlModelModule/GET_SEARCHED_PATIENTS"];

      let iterator = 0;
      let birthDttmString: string | undefined = "";

      for (let patient of searchedPatients) {
        birthDttmString = myUtils.GetInputLocaleDateFormatFromDate(
          patient.pt_birth_dttm
        );

        if (birthDttmString == undefined) continue;

        res.push(
          new myTypes.PatientTableRow(
            iterator++,
            patient.pt_key,
            patient.pt_id,
            myUtils.GetDisplayFullNameFromPN(patient.pt_name),
            patient.pt_sex,
            "", // age
            birthDttmString,
            "", // weight
            "", // size
            "", // address
            "", // tel
            "", // state
            "", // med_alert
            "", // allergies
            "", // comment
            patient.pt_responsible_person,
            patient.pt_species_key,
            patient.pt_breed_key
          )
        );
      }

      return res;
    });

    const getSearchedPatientNameList = computed(() => {
      let res: myTypes.IPatientTableRow[] = [];

      let searchedPatients: myTypes.IDbPatient[] =
        store.getters["MwlModelModule/GET_SEARCHED_PATIENTS"];

      let iterator = 0;
      for (let patient of searchedPatients) {
        res.push(
          new myTypes.PatientTableRow(
            iterator++,
            patient.pt_key,
            patient.pt_id,
            myUtils.GetDisplayFullNameFromPN(patient.pt_name),
            patient.pt_sex,
            "", // age
            myUtils.GetInputLocaleDateFormatFromDate(patient.pt_birth_dttm),
            "", // weight
            "", // size
            "", // address
            "", // tel
            "", // state
            "", // med_alert
            "", // allergies
            "" // comment
          )
        );
      }

      return res;
    });

    const onHandlePatientSelected = (param) => {
      const patientInfo: myTypes.PatientTableRow = param.row;
      inputPatient.pt_key = patientInfo.pt_key;
      //patientKey.value = patientInfo.key;

      updatePatient();
    };

    async function AsyncGetOrder(
      reqQuery: myTypes.IMwlGetOrderListQueryCondition
    ) {
      const res = await MwlService.GetOrderList(reqQuery);

      let { result, data } = res.data;

      if (result === true) {
        if (data.length > 0) {
          inputAccNumber.value = data[0].ord_acc_num;
          if (data[0].ord_issuer == undefined) {
            inputIssuer.value = "";
          } else {
            inputIssuer.value = data[0].ord_issuer;
          }

          if (data[0].ord_requesting_phyc == undefined) {
            inputReqPhyc.value = "";
          } else {
            inputReqPhyc.value = data[0].ord_requesting_phyc;
          }

          if (data[0].ord_referring_phyc == undefined) {
            inputRefPhyc.value = "";
          } else {
            inputRefPhyc.value = data[0].ord_referring_phyc;
          }

          inputPatient.pt_key = data[0].pt_key;
          inputPatient.pt_id = data[0].pt_id;
          inputPatient.pt_name = data[0].pt_name;
          inputPatient.pt_sex = data[0].pt_sex;
          inputPatient.pt_age = data[0].pt_age;
          inputPatient.pt_birth_dttm = new Date(data[0].pt_birth_dttm);
          inputPatient.pt_weight = data[0].pt_weight;
          inputPatient.pt_size = data[0].pt_size;
          inputPatient.pt_address = data[0].pt_address;
          inputPatient.pt_tel = data[0].pt_tel;
          inputPatient.pt_state = data[0].pt_state;
          inputPatient.pt_med_alert = data[0].pt_med_alert;
          inputPatient.pt_allergies = data[0].pt_allergies;
          inputPatient.pt_comment = data[0].pt_comment;
          inputPatient.pt_responsible_person = data[0].pt_responsible_person;

          inputPatientFirstName.value = myUtils.GetFirstNameFromPN(
            data[0].pt_name
          );
          inputPatientLastName.value = myUtils.GetLastNameFromPN(
            data[0].pt_name
          );

          inputPatientBirthDate.value =
            myUtils.GetInputLocaleDateFormatFromDate(data[0].pt_birth_dttm);

          inputProcPlan.proc_plan_id = data[0].ord_rp_id;
          CheckProcPlanInfo();
        }
      } else {
        console.log("No Order information: ", reqQuery);
      }
    }

    async function AsyncGetSpsList(
      reqQuery: myTypes.IMwlGetSpsListQueryCondition
    ) {
      const res = await MwlService.GetSpsList(reqQuery);

      let { result, data } = res.data;

      if (result === true) {
        onUpdateSpsInfo(data);
        const tempSpsKeyArray: number[] = [];
        for (const sps of data) {
          tempSpsKeyArray.push(sps.sps_key);
        }
        spsKeyListForTalble.value = tempSpsKeyArray.join(myTypes.dataSeparator);
      } else {
        console.log("No SPS information: ", reqQuery);
      }

      flagUpdateRpTable.value = !flagUpdateRpTable.value;
    }

    async function AsyncGetPatient(
      reqQuery: myTypes.IMwlGetPatientListQueryCondition
    ) {
      const res = await MwlService.GetPatientList(reqQuery);

      let { result, data } = res.data;

      if (result === true) {
        if (data.length > 0) {
          const patient = data[0];

          inputPatient.pt_key = patient.pt_key;
          inputPatient.pt_id = patient.pt_id;
          inputPatient.pt_name = patient.pt_name;
          inputPatient.pt_sex = patient.pt_sex;
          inputPatient.pt_age = patient.pt_age;
          inputPatient.pt_birth_dttm = new Date(patient.pt_birth_dttm);
          inputPatient.pt_weight = patient.pt_weight;
          inputPatient.pt_size = patient.pt_size;
          inputPatient.pt_address = patient.pt_address;
          inputPatient.pt_tel = patient.pt_tel;
          inputPatient.pt_state = patient.pt_state;
          inputPatient.pt_med_alert = patient.pt_med_alert;
          inputPatient.pt_allergies = patient.pt_allergies;
          inputPatient.pt_comment = patient.pt_comment;
          inputPatient.pt_responsible_person = patient.pt_responsible_person;

          inputPatientFirstName.value = myUtils.GetFirstNameFromPN(
            patient.pt_name
          );
          inputPatientLastName.value = myUtils.GetLastNameFromPN(
            patient.pt_name
          );

          inputPatientBirthDate.value =
            myUtils.GetInputLocaleDateFormatFromDate(patient.pt_birth_dttm);
        }
      } else {
        console.log("No PATIENT INFO: ", reqQuery);
      }
    }

    async function FetchPatientList(
      patientId: string,
      patientName: string,
      isStrict: boolean
    ) {
      let reqQuery: myTypes.IMwlGetPatientListQueryCondition = {
        pt_key: -1,
        pt_id: patientId,
        pt_name: patientName,
        is_strict_condition: isStrict,
      };

      store.dispatch("MwlModelModule/fetchPatientInfo", reqQuery);
    }

    const getSearchedProcPlanList = computed(() => {
      let res: myTypes.IProcPlanTableRow[] = [];
      let iterator = 0;
      let protocol_ids = "";

      for (let procPlan of searchedProcPlanList) {
        protocol_ids = myUtils.GetProtocolIDsFromIDbProcPlan(procPlan);

        res.push(
          new myTypes.ProcPlanTableRow(
            iterator++,
            procPlan.proc_plan_key,
            procPlan.proc_plan_id,
            procPlan.proc_plan_desc || "",
            protocol_ids
          )
        );
      }

      return res;
    });

    const getOrdReasonOptions = computed(() => {
      let displayRowList: string[] = [];

      for (let ordReason of searchedOrdReasonList) {
        displayRowList.push(ordReason.ord_reason_desc);
      }

      return displayRowList;
    });

    async function AsyncFetchOrdReasonList() {
      let reqQuery: myTypes.IMwlGetOrdReasonListQueryCondition = {
        ord_reason_type: myTypes.eOrdReasonType.CREATE,
        is_strict_condition: true,
      };

      const res = await MwlService.GetOrdReasonList(reqQuery);

      let { result, data } = res.data;

      while (searchedOrdReasonList.length > 0) {
        searchedOrdReasonList.pop();
      }

      if (result === true) {
        for (const ordReason of data) {
          searchedOrdReasonList.push(ordReason);
        }
      } else {
        console.log("No OrdReason Data: ", reqQuery);
      }
    }

    // from Expand table
    const onHandleProcPlanSelected = (param) => {
      const procPlanDbInfo: myTypes.IDbProcPlan = param.row.convertToDbInfo();

      inputProcPlan.proc_plan_key = procPlanDbInfo.proc_plan_key;
      inputProcPlan.proc_plan_id = procPlanDbInfo.proc_plan_id;
      inputProcPlan.proc_plan_desc = procPlanDbInfo.proc_plan_desc;

      if (
        inputProcPlan.proc_plan_key != undefined &&
        inputProcPlan.proc_plan_key > 0
      ) {
        const reqQuery: myTypes.IMwlGetProtocolListQueryCondition = {
          proc_plan_key: inputProcPlan.proc_plan_key,
        };

        fetchProtocolList(reqQuery);
      }

      console.log("onHandleProcPlanSelected: ", inputProcPlan);
    };

    async function fetchProtocolList(
      reqQuery: myTypes.IMwlGetProtocolListQueryCondition
    ) {
      const res = await MwlService.GetProtocolList(reqQuery);

      let { result, data } = res.data;

      while (inputProtocalKeys.length > 0) {
        inputProtocalKeys.pop();
      }

      if (result === true) {
        for (const protocol of data) {
          inputProtocalKeys.push(protocol.prot_key);
        }
      } else {
        console.log("fetchProtocolList) No Protocols ");
      }
    }

    const searchedProcPlanList: myTypes.IDbProcPlan[] = reactive([]);

    async function fetchProcPlanList(procPlanId: string, isStrict: boolean) {
      let reqQuery: myTypes.IMwlGetProcPlanListQueryCondition = {
        proc_plan_id: procPlanId,
        proc_plan_desc: "",
        is_strict_condition: isStrict,
      };

      const res = await MwlService.GetProcPlanList(reqQuery);

      let { result, data } = res.data;

      while (searchedProcPlanList.length > 0) {
        searchedProcPlanList.pop();
      }

      if (result === true) {
        for (const procPlan of data) {
          searchedProcPlanList.push(procPlan);
        }
      } else {
        console.log("No Procedure Plan Data: ", reqQuery);
      }
    }

    async function AsyncAddOrder(
      order: myTypes.IDbOrder
      //protocol_ids: string | undefined
    ) {
      let reqQuery: myTypes.IMwlAddOrderRequest = {
        ord_key: -1,
        ord_pt_key: order.ord_pt_key,

        ord_acc_num: order.ord_acc_num,
        ord_issuer: order.ord_issuer,
        ord_create_dttm: order.ord_create_dttm,

        ord_status_flag: order.ord_status_flag,
        ord_requesting_phyc: order.ord_requesting_phyc,
        ord_referring_phyc: order.ord_referring_phyc,

        ord_study_uid: order.ord_study_uid,
        ord_study_dttm: order.ord_study_dttm,

        ord_reason: order.ord_reason,
        ord_priority: order.ord_priority,

        ord_rp_id: order.ord_rp_id,
        ord_rp_desc: order.ord_rp_desc,

        ord_pt_age: order.ord_pt_age,
        ord_pt_weight: order.ord_pt_weight,
        ord_pt_size: order.ord_pt_size,
      };

      resOrderKey = -1;

      // Add Order
      const addOrderRes = await MwlService.AddOrder(reqQuery);

      let result = addOrderRes.data.result;
      let err_code = addOrderRes.data.err_code;
      const ord_key = addOrderRes.data.ord_key;

      if (result === true) {
        for (const sps of inputSpsList) {
          sps.sps_ord_key = ord_key;
        }

        // Add Sps
        const reqAddSpsListQuery: myTypes.IMwlAddSpsListRequest = {
          sps_list: inputSpsList,
        };

        let resAddSps = await MwlService.AddSpsList(reqAddSpsListQuery);

        result = resAddSps.data.result;
        err_code = resAddSps.data.err_code;
        const sps_key_list = resAddSps.data.sps_key_list;

        if (result === true) {
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
          MsgBoxInfo.msg = "Added order successfully.";

          resOrderKey = ord_key;

          console.log(
            "Added order successfully.[key:%d, state: %d]",
            resOrderKey,
            curState.value
          );
          console.log(`Added Sps Keys.[${sps_key_list}]`);
        } else if (typeof err_code === "string") {
          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
          MsgBoxInfo.msg = `Failed to add order.\n(Reason: ${err_code} )`;
          //
          console.log("Unknown Err: ", err_code);
        } else if (err_code != undefined && err_code > 0) {
          const errDesc =
            store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
          MsgBoxInfo.msg = `Failed to add order.\n(Reason: ${errDesc} )`;
          //
          console.log("error code: ", err_code);
        }
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add order.\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add order.\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add order.\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      if (resOrderKey > -1) {
        curState.value = eState.stateSuccess;
      } else {
        curState.value = eState.stateFail;
      }
    }

    async function AsyncModifyOrder(order: myTypes.IDbOrder) {
      let reqQuery: myTypes.IMwlUpdateOrderRequest = order;

      const res = await MwlService.UpdateOrder(reqQuery);

      const { result, err_code, ord_key } = res.data;

      if (result === true) {
        for (const sps of inputSpsList) {
          sps.sps_ord_key = ord_key;
        }

        // Update Sps
        const reqUpdateSpsListQuery: myTypes.IMwlUpdateSpsListRequest = {
          sps_list: inputSpsList,
        };

        console.log("UpdateSpsList(query): ", reqUpdateSpsListQuery);

        let resUpdateSps = await MwlService.UpdateSpsList(
          reqUpdateSpsListQuery
        );

        console.log("UpdateSpsList(res): ", resUpdateSps);

        MsgBoxInfo.title = "Edit Order Result";
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = "Updated order successfully.";

        resOrderKey = ord_key;

        console.log(
          "Updated order successfully.[key:%d, state: %d]",
          resOrderKey,
          curState.value
        );
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to modify order.\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to modify order.\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to modify order.\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      if (resOrderKey > -1) {
        curState.value = eState.stateSuccess;
      } else {
        curState.value = eState.stateFail;
      }
    }

    async function AsyncGetNewAccNumber() {
      const res = await MwlService.GenerateAccNumber();

      const { result, err_code, acc_num } = res.data;

      if (result) {
        inputAccNumber.value = acc_num;
        console.log(`AsyncGetNewAccNumber Result: ${acc_num}`);
      } else {
        console.log("Failed to get Acc No (reason: ", err_code, ")");
      }
    }

    // ID Handler
    const onHandleGenerateAccNumber = () => {
      AsyncGetNewAccNumber();
    };

    const onHandleSearchPatient = () => {
      showSearchPatientDialog.value = true;

      console.log(
        "Search patient: ",
        showSearchPatientDialog.value,
        inputPatient.pt_id,
        getPatientFullName.value
      );
    };

    // RP Handler
    async function CheckProcPlanInfo() {
      let queryProcPlanId = "";

      queryProcPlanId = inputProcPlan.proc_plan_id;

      let reqQuery: myTypes.IMwlGetProcPlanListQueryCondition = {
        proc_plan_id: queryProcPlanId,
        proc_plan_desc: "",
        is_strict_condition: true,
      };

      const promiseResponse = await MwlService.GetProcPlanList(reqQuery);

      const response: myTypes.IMwlGetProcPlanListResponse =
        promiseResponse.data;

      if (!response) {
        console.log("Failed to Check RP");
      }

      const result: boolean = response.result;

      if (result) {
        const rows: myTypes.IDbProcPlan[] = response.data;

        if (rows.length > 0) {
          inputProcPlan.proc_plan_key = rows[0].proc_plan_key;
          inputProcPlan.proc_plan_id = rows[0].proc_plan_id;
          inputProcPlan.proc_plan_desc = rows[0].proc_plan_desc;
        }
      } else {
        console.log("No RP Data");
      }
    }

    const onHandleCheckProcPlan = () => {
      CheckProcPlanInfo();
    };

    const onHandleSearchRp = () => {
      console.log("Search RP", inputProcPlan.proc_plan_id);
      showSearchProcPlanDialog.value = true;
    };

    const onHandleAdd = () => {
      const err = isValidInput();

      if (err != "") {
        return;
      }

      if (
        inputProcPlan.proc_plan_key != undefined &&
        inputProcPlan.proc_plan_key <= 0 &&
        inputProcPlan.proc_plan_id != undefined &&
        inputProcPlan.proc_plan_id != ""
      ) {
        onHandleCheckProcPlan();

        if (inputProcPlan.proc_plan_key < 0) {
          console.log("Err: ", inputProcPlan.proc_plan_key);

          MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
          MsgBoxInfo.msg =
            "Invalid Procedure Plan Infomation (Not Registered RP)";
          MsgBoxInfo.isShow = true;
          store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

          return;
        }
      }

      const order: myTypes.IDbOrder = {
        ord_key: -1,
        ord_pt_key: inputPatient.pt_key,

        ord_acc_num: inputAccNumber.value,
        ord_issuer: inputIssuer.value,
        ord_create_dttm: new Date(),

        ord_status_flag: myTypes.eOrderStatus.SCHEDULED,
        ord_requesting_phyc: inputReqPhyc.value,
        ord_referring_phyc: inputRefPhyc.value,

        ord_study_uid: "",
        ord_study_dttm: new Date(),
        ord_priority: myTypes.reversePriority(
          inputPriority.value
        ) as myTypes.eOrderPriority,
        ord_reason: inputOrdReason.value,
        ord_rp_id: inputProcPlan.proc_plan_id,
        ord_rp_desc: inputProcPlan.proc_plan_desc,

        ord_pt_age: inputPatient.pt_age,
        ord_pt_weight: inputPatient.pt_weight,
        ord_pt_size: inputPatient.pt_size,
      };

      AsyncAddOrder(order);
    };

    const onHandleModify = () => {
      console.log(
        "onHandleModify: ",
        inputPatient.pt_key,
        inputPatient.pt_id,
        inputAccNumber.value,
        inputProcPlan
      );

      const err = isValidInput();
      if (err != "") {
        console.log("onHandleModify) err: ", err);
        return;
      }

      if (props.isModify) {
        if (spsKeyListForTalble.value == "") {
          console.log(
            "onHandleModify) spsKeyListForTalble: ",
            spsKeyListForTalble
          );
          return;
        }
      } else {
        if (inputProtocalKeys == undefined || inputProtocalKeys.length <= 0) {
          console.log("onHandleModify) inputProtocalKeys: ", inputProtocalKeys);
          return;
        }
      }

      const order: myTypes.IDbOrder = {
        ord_key: props.editOrdKey,
        ord_pt_key: inputPatient.pt_key,

        ord_acc_num: inputAccNumber.value,
        ord_issuer: inputIssuer.value,
        ord_create_dttm: new Date(),

        ord_status_flag: myTypes.eOrderStatus.SCHEDULED,
        ord_requesting_phyc: inputReqPhyc.value,
        ord_referring_phyc: inputRefPhyc.value,

        ord_study_uid: "",
        ord_study_dttm: new Date(),
        ord_priority: myTypes.reversePriority(
          inputPriority.value
        ) as myTypes.eOrderPriority,
        ord_reason: inputOrdReason.value,
        ord_rp_id: inputProcPlan.proc_plan_id,
        ord_rp_desc: inputProcPlan.proc_plan_desc,

        ord_pt_age: inputPatient.pt_age,
        ord_pt_weight: inputPatient.pt_weight,
        ord_pt_size: inputPatient.pt_size,
      };

      AsyncModifyOrder(order);
    };

    const onHandleCancel = () => {
      context.emit("on-cancel");
    };

    ///////////////////////////////////////////////
    // For Patient Dialog
    const showSearchPatientDialog = ref(false);

    const onHandleSelectPatient = (patient: myTypes.IDbPatient): void => {
      inputPatient.pt_key = patient.pt_key;

      updatePatient();

      showSearchPatientDialog.value = false;
    };

    const onHandleCancelPatient = (): void => {
      showSearchPatientDialog.value = false;
    };

    const curUserName = (): string => {
      const curUser: myTypes.IDbUser =
        store.getters["UserModelModule/GET_CUR_USER"];

      const res = myUtils.GetDisplayFullNameFromPN(curUser.user_name);

      return res;
    };

    // For Order Dialog
    const showSearchOrderDialog = ref(false);
    const onShowOrderDialog = () => {
      showSearchOrderDialog.value = true;
    };

    const onHandleSelectOrder = (order: myTypes.IDbOrder): void => {
      AsyncGetOrder({
        ord_key: order.ord_key,
      });

      AsyncGetSpsList({
        ord_key: order.ord_key,
      });

      updatePatient();

      showSearchOrderDialog.value = false;
    };

    const onHandleCancelOrder = (): void => {
      showSearchOrderDialog.value = false;
    };

    ///////////////////////////////////////////////
    // For Procedure Plan(PROC PLAN) Dialog
    const showSearchProcPlanDialog = ref(false);

    const onHandleSelectProcPlan = (procPlan: myTypes.IDbProcPlan): void => {
      inputProcPlan.proc_plan_key = procPlan.proc_plan_key;
      inputProcPlan.proc_plan_id = procPlan.proc_plan_id;
      inputProcPlan.proc_plan_desc = procPlan.proc_plan_desc;

      showSearchProcPlanDialog.value = false;

      if (
        inputProcPlan.proc_plan_key != undefined &&
        inputProcPlan.proc_plan_key > 0
      ) {
        const reqQuery: myTypes.IMwlGetProtocolListQueryCondition = {
          proc_plan_key: inputProcPlan.proc_plan_key,
        };

        fetchProtocolList(reqQuery);
      }
      //flagUpdateRpTable.value = !flagUpdateRpTable.value;

      console.log("onHandleSelectProcPlan: ", inputProcPlan);
    };

    const onHandleCancelProcPlan = (): void => {
      showSearchProcPlanDialog.value = false;
    };

    return {
      isShowModal,
      //
      title,
      //
      maxLengthAccNum,
      maxLengthPatientId,
      maxLengthPatientName,
      maxLengthPhysName,
      maxLengthIssuer,
      maxLengthReason,
      //
      //
      getContentStyle,
      isNoneBorder,
      isReadOnly,
      //
      isShowSearchPatient,
      isShowGenerateAccNumber,
      isShowSearchRp,
      isShowCheckRp,
      isShowAdd,
      isShowModify,
      isShowCancel,
      //

      //
      searchedPatientColums,
      getSearchedPatientIDList,
      getSearchedPatientNameList,
      onHandlePatientSelected,
      //
      searchedProcPlanColums,
      getSearchedProcPlanList,
      getOrdReasonOptions,
      onHandleProcPlanSelected,
      //
      searchedPhysicianColums,
      getSearchedReqPhysicianList,
      getSearchedRefPhysicianList,
      onHandleReqPhysicianFocused,
      onHandleReqPhysicianSelected,
      onHandleRefPhysicianFocused,
      onHandleRefPhysicianSelected,
      //

      inputPatient,
      getDisplayFullName,
      inputPatientBirthDate,

      inputAccNumber,
      inputIssuer,

      //inputStatusFlag,
      inputReqPhyc,
      inputRefPhyc,

      // For Modify, SPS ID LIst
      spsKeyListForTalble,

      // For Protocol Plan
      inputProcPlan,
      inputProtocalKeys,
      flagUpdateRpTable,
      isInputManual,
      isSelectableSpsTable,
      isSearchableSpsTable,
      isSortableSpsTable,
      isNavigatableSpsTable,
      isPagenableSpsTable,
      isSchedulingTable,
      perPageDropdown,
      defaultPage,
      onUpdateinputProtocolKeyList,
      onUpdateinputSpsKeyList,
      onUpdateSpsInfo,
      onRowSelectAllSpsList,
      onRowClickSpsList,
      onHandlePopupEvent,
      inputStudyDttm,
      inputOrdReason,
      searchedOrdReasonList,
      inputPriority,

      optionsPriority,

      //
      //
      MsgBoxInfo,

      onHandleTextChanged,

      //
      initControl,
      // ID
      onHandleGenerateAccNumber,
      // Patient
      onHandleSearchPatient,
      // RP
      onHandleCheckProcPlan,
      onHandleSearchRp,
      onHandleAdd,
      onHandleModify,
      onHandleCancel,

      // For Patient
      showSearchPatientDialog,
      onHandleSelectPatient,
      onHandleCancelPatient,
      // For Order
      showSearchOrderDialog,
      onShowOrderDialog,
      onHandleSelectOrder,
      onHandleCancelOrder,
      // For Rp Seq
      showSearchProcPlanDialog,
      onHandleSelectProcPlan,
      onHandleCancelProcPlan,
      //
      curUserName,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
