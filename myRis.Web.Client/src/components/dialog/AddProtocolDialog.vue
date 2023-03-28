<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="add-protocol-dialog">
        <div class="add-protocol-dialog__container">
          <div class="add-protocol-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="add-protocol-dialog__content" :style="getContentStyle">
            <!-- ID -->
            <LabelBase
              class="add-protocol-dialog__content__id-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("ID") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-protocol-dialog__content__id-input"
              v-model="inputProtocol.prot_id"
              :textMax="maxLengthProtocolId"
            />

            <div class="add-protocol-dialog__content__id-buttons">
              <TextButton
                class="add-protocol-dialog__content__id-check-buttons"
                v-show="false"
                text="Check"
                buttonStyle="sub1"
                fontSize="11px"
                @click="onHandleCheckProtocolId()"
              />
              <TextButton
                class="add-protocol-dialog__content__id-generate-button"
                v-show="false"
                text="Generate"
                buttonStyle="sub1"
                fontSize="11px"
                @click="onHandleGenerateProtocolId()"
              />
            </div>
            <!-- Modality -->
            <LabelBase
              class="add-protocol-dialog__content__modality-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("Modality") }}</h3>
              </template>
            </LabelBase>
            <DropDownBase
              class="add-protocol-dialog__content__modality-input"
              v-model="inputProtocol.prot_modality"
              :options="modalityOptions"
              @popup="onHandlePopupDropDown"
            />
            <!-- BodyPart -->
            <LabelBase
              class="add-protocol-dialog__content__bodypart-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("Bodypart") }}</h3>
              </template>
            </LabelBase>
            <DropDownBase
              class="add-protocol-dialog__content__bodypart-input"
              v-model="inputBodypartMeaning"
              :options="getBodyPartSeqMeaningList"
              @onTextChanged="onHandleTextChanged('Bodypart')"
              @popup="onHandlePopupDropDown"
            />
            <!-- Station AE Title -->
            <LabelBase
              class="add-protocol-dialog__content__station-ae-title-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Station AE Title") }}</h3>
              </template>
            </LabelBase>
            <DropDownBase
              class="add-protocol-dialog__content__station-ae-title-input"
              v-model="inputProtocol.prot_station_ae_title"
              :options="getStationAeTitleList"
              @onTextChanged="onHandleTextChanged('StationAeTitle')"
              @popup="onHandlePopupDropDown"
            />
            <!-- Station Name -->
            <LabelBase
              class="add-protocol-dialog__content__station-name-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Station Name") }}</h3>
              </template>
            </LabelBase>
            <DropDownBase
              class="add-protocol-dialog__content__station-name-input"
              v-model="inputProtocol.prot_station_name"
              :options="getStationNameList"
              @onTextChanged="onHandleTextChanged('StationName')"
            />
            <!-- Perform Physician -->
            <LabelBase
              class="add-protocol-dialog__content__perform-physician-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Perform Physician") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-protocol-dialog__content__perform-physician-input"
              v-model="inputProtocol.prot_perform_phyc_name"
              expandWidth="180%"
              :textMax="maxLengthPhysName"
              :extTableCols="searchedPhysicianColums"
              :extTableRows="getPhysiciansList"
              @onTextChanged="onHandleTextChanged('PerformPhysician')"
              @onRowClick="onHandlePerformPhysicianSelected"
            />
            <!-- Duration -->
            <LabelBase
              class="add-protocol-dialog__content__duration-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Duration (.min)") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-protocol-dialog__content__duration-input"
              inputType="number"
              :numMax="maxNumDuration"
              :numMin="minNumDuration"
              v-model="inputProtocol.prot_duration"
            />
            <!-- Description -->
            <LabelBase
              class="add-protocol-dialog__content__desc-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Description") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-protocol-dialog__content__desc-input"
              v-model="inputProtocol.prot_desc"
              :textMax="maxLengthProtocolDesc"
            />
          </div>
          <div class="add-protocol-dialog__control-row">
            <div class="add-protocol-dialog__control-row__add">
              <TextButton
                :text="okButtonText"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickOkButton()"
              />
            </div>
            <div class="add-protocol-dialog__control-row__cancel">
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
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType } from "vue";
import MwlService from "@/service/MwlService";
import UserService from "@/service/UserService";
import { useStore } from "vuex";
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import LabelBase from "@/components/label/LabelBase.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";

type TInputType =
  | "StationAeTitle"
  | "StationName"
  | "PerformPhysician"
  | "Bodypart";

export default defineComponent({
  name: "AddProtocolDialog",

  components: {
    TextButton,
    TextInputBox,
    LabelBase,
    DropDownBase,
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

    curProtocol: {
      type: Object as PropType<myTypes.IDbProtocol>,
      required: true,
    },
  },

  emits: ["on-ok", "on-cancel"],

  setup(props, context) {
    const isShowModal = computed(() => {
      if (props.show) {
        initControl();
      }

      return props.show;
    });

    const store = useStore();

    const title = ref("Add Protocol");

    const maxLengthProtocolId = ref(16);
    const maxLengthProtocolDesc = ref(64);
    const maxLengthPhysName = ref(64);

    const maxNumDuration = ref(1440);
    const minNumDuration = ref(0);

    const inputBodypartMeaning = ref("");
    const inputProtocol = ref({
      prot_key: -1,

      prot_id: "",
      prot_station_ae_title: "",
      prot_station_name: "",
      prot_modality: "DX",

      prot_desc: "",
      prot_perform_phyc_name: "",
      prot_bp_key: -1,
      prot_duration: 0,
    } as myTypes.IDbProtocol);

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Protocol",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeError,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "",

      msg: "Invalid input data.",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const popupState = ref(false);
    const onHandlePopupDropDown = (state: boolean): void => {
      popupState.value = state;
    };
    const getContentStyle = computed(() => {
      let styles = { overflow: "auto" };

      if (popupState.value == true) {
        styles.overflow = "visible";
      }

      return styles;
    });

    const onHandleTextChanged = (type: TInputType) => {
      const physicianQuery: myTypes.IUserGetUserQueryCondition = {
        user_level: myTypes.eUserLevel.Physician,
        user_name: inputProtocol.value.prot_perform_phyc_name,
        is_strict_condition: false,
      };

      switch (type) {
        case "StationAeTitle":
          console.log(
            "Changed StationAeTitle: ",
            inputProtocol.value.prot_station_ae_title
          );

          if (
            inputProtocol.value.prot_station_ae_title == "" ||
            inputProtocol.value.prot_station_ae_title == "(none)"
          ) {
            inputProtocol.value.prot_station_ae_title = "";
            inputProtocol.value.prot_station_name = "";
          } else {
            for (const station of searchedStationList) {
              if (
                station.station_ae_title ===
                inputProtocol.value.prot_station_ae_title
              ) {
                inputProtocol.value.prot_station_name = station.station_name;
              }
            }
          }

          break;
        case "StationName":
          console.log(
            "Changed StationName: ",
            inputProtocol.value.prot_station_name
          );

          if (
            inputProtocol.value.prot_station_name == "" ||
            inputProtocol.value.prot_station_name == "(none)"
          ) {
            inputProtocol.value.prot_station_ae_title = "";
            inputProtocol.value.prot_station_name = "";
          } else {
            for (const station of searchedStationList) {
              if (
                station.station_name === inputProtocol.value.prot_station_name
              ) {
                inputProtocol.value.prot_station_ae_title =
                  station.station_ae_title;
              }
            }
          }

          break;
        case "PerformPhysician":
          console.log(
            "Changed PerformPhysician: ",
            inputProtocol.value.prot_perform_phyc_name
          );

          AsyncGetPhysicianList(physicianQuery);
          break;
        case "Bodypart":
          console.log("Changed Bodypart: ", inputBodypartMeaning.value);

          for (const bodypart of searchedBodyPartList) {
            if (bodypart.bp_code_meaning == inputBodypartMeaning.value) {
              inputProtocol.value.prot_bp_key = bodypart.bp_key;
              break;
            }
          }
          break;
      }
    };

    // For ID
    const onHandleCheckProtocolId = () => {
      console.log("onHandleCheckProtocolId");
    };

    const onHandleGenerateProtocolId = () => {
      console.log("onHandleGenerateProtocolId");
    };

    //For Body Part
    const bodyPartMeaning = ref("");
    const searchedBodyPartList: myTypes.IDbBodypart[] = reactive([]);

    const getBodyPartSeqMeaningList = computed(() => {
      let bodypartSeqMeaningList: string[] = [];

      for (const bodypart of searchedBodyPartList) {
        bodypartSeqMeaningList.push(bodypart.bp_code_meaning);
      }

      return bodypartSeqMeaningList;
    });

    async function AsyncGetBodyPartMeaningList(
      reqQuery: myTypes.IMwlGetBodypartListQueryCondition
    ) {
      const res = await MwlService.GetBodypartList(reqQuery);
      const { result, data } = res.data;

      while (searchedBodyPartList.length > 0) {
        searchedBodyPartList.pop();
      }

      if (result == true) {
        for (const bodyPart of data) {
          searchedBodyPartList.push(bodyPart);
        }
      }
    }

    // For Stations
    const searchedStationList: myTypes.IDbStation[] = reactive([]);
    const getStationAeTitleList = computed(() => {
      let stationAeTitleList: string[] = ["(none)"];

      for (const station of searchedStationList) {
        stationAeTitleList.push(station.station_ae_title);
      }

      return stationAeTitleList;
    });

    const getStationNameList = computed(() => {
      let stationNameList: string[] = ["(none)"];

      for (const station of searchedStationList) {
        stationNameList.push(station.station_name);
      }

      return stationNameList;
    });

    async function AsyncGetStationList(
      reqQuery: myTypes.IMwlGetStationListQueryCondition
    ) {
      const res = await MwlService.GetStationList(reqQuery);
      const { result, data } = res.data;

      while (searchedStationList.length > 0) {
        searchedStationList.pop();
      }

      if (result == true) {
        for (const station of data) {
          searchedStationList.push(station);
        }
      }
    }

    // For Physicians
    const searchedPhysicianUsers: myTypes.IDbUser[] = reactive([]);

    const searchedPhysicianColums = computed(() => {
      return myTypes.popupPhysicianColumList;
    });

    const getPhysiciansList = computed(() => {
      let physiciansList: myTypes.IPhysicianTableRow[] = [];
      let iterator = 0;

      for (const physician of searchedPhysicianUsers) {
        physiciansList.push(
          new myTypes.PhysicianTableRow(
            iterator++,
            physician.user_key,
            myTypes.parseUserLevel(physician.user_level),
            physician.user_id,
            physician.user_name
          )
        );
      }

      return physiciansList;
    });

    async function AsyncGetPhysicianList(
      reqQuery: myTypes.IUserGetUserQueryCondition
    ) {
      const res = await UserService.GetUser(reqQuery);
      const { result, users } = res.data;

      while (searchedPhysicianUsers.length > 0) {
        searchedPhysicianUsers.pop();
      }

      if (result == true) {
        for (const physician of users) {
          const user = {
            user_key: physician.user_key,
            user_level: physician.user_level,
            user_id: physician.user_id,
            user_pwd: physician.user_pwd,
            user_name: physician.user_name,
            user_create_dttm: new Date(physician.user_create_dttm),
          };
          searchedPhysicianUsers.push(user);
        }

        console.log("AsyncGetPhysicianList Res: ", searchedPhysicianUsers);
      }
    }

    const onHandlePerformPhysicianSelected = (param) => {
      console.log("onHandlePerformPhysicianSelected: ", param.row);

      let physiciansRow: myTypes.IPhysicianTableRow = param.row;

      inputProtocol.value.prot_perform_phyc_name = physiciansRow.name;
    };

    // Configuration
    let modalityOptions = reactive(myTypes.getSupportModalities(false));

    const okButtonText = ref("Add");

    const initControl = () => {
      AsyncGetBodyPartMeaningList({
        is_strict_condition: false,
      });

      AsyncGetStationList({
        is_strict_condition: false,
      });

      if (props.isModify) {
        title.value = "Modify Protocol";
        inputProtocol.value.prot_key = props.curProtocol.prot_key;
        inputProtocol.value.prot_id = props.curProtocol.prot_id;
        inputProtocol.value.prot_station_ae_title =
          props.curProtocol.prot_station_ae_title;
        inputProtocol.value.prot_station_name =
          props.curProtocol.prot_station_name;
        inputProtocol.value.prot_modality = props.curProtocol.prot_modality;

        inputProtocol.value.prot_desc = props.curProtocol.prot_desc;
        inputProtocol.value.prot_perform_phyc_name =
          props.curProtocol.prot_perform_phyc_name;
        inputProtocol.value.prot_bp_key = props.curProtocol.prot_bp_key;
        inputProtocol.value.prot_duration = props.curProtocol.prot_duration;

        for (const bodyPart of searchedBodyPartList) {
          if (bodyPart.bp_key == inputProtocol.value.prot_bp_key) {
            inputBodypartMeaning.value = bodyPart.bp_code_meaning;
            break;
          }
        }

        okButtonText.value = "Modify";

        console.log(
          "[Add Protocol Dialog] initControl(Modify)",
          props.curProtocol
        );
      } else {
        title.value = "Add Protocol";

        inputProtocol.value.prot_key = -1;
        inputProtocol.value.prot_id = "";
        inputProtocol.value.prot_station_ae_title = "";
        inputProtocol.value.prot_station_name = "";
        inputProtocol.value.prot_modality = "DX";

        inputProtocol.value.prot_desc = "";
        inputProtocol.value.prot_perform_phyc_name = "";
        inputProtocol.value.prot_duration = 0;
        inputProtocol.value.prot_bp_key = -1;
        inputBodypartMeaning.value = "";

        //
        bodyPartMeaning.value = "";

        okButtonText.value = "Add";
      }
    };

    const isValidInput = () => {
      if (inputProtocol.value.prot_bp_key < 1) {
        MsgBoxInfo.msg = "Invalid input data. (Bodypart)";
        return false;
      }

      return true;
    };

    const onClickOkButton = () => {
      const protocol: myTypes.IDbProtocol = inputProtocol.value;

      if (isValidInput() == false) {
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
        return;
      }

      context.emit("on-ok", protocol);
    };

    const onClickCancelButton = () => {
      context.emit("on-cancel");
    };

    // Style
    return {
      isShowModal,
      //
      title,
      maxLengthProtocolId,
      maxLengthProtocolDesc,
      maxLengthPhysName,
      maxNumDuration,
      minNumDuration,
      //
      inputProtocol,
      inputBodypartMeaning,
      onHandleTextChanged,

      onHandlePopupDropDown,
      getContentStyle,

      /////////////
      // ID
      /////////////
      onHandleCheckProtocolId,
      onHandleGenerateProtocolId,
      /////////////
      // Body Part
      /////////////
      bodyPartMeaning,
      modalityOptions,
      getBodyPartSeqMeaningList,
      /////////////
      // Stations
      /////////////
      getStationAeTitleList,
      getStationNameList,
      /////////////
      // Physicians
      /////////////
      getPhysiciansList,
      searchedPhysicianColums,
      onHandlePerformPhysicianSelected,
      //
      okButtonText,
      //
      onClickOkButton,
      onClickCancelButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
