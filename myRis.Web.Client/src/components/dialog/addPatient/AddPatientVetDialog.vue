<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="add-patient-vet-dialog">
        <div class="add-patient-vet-dialog__container">
          <span class="add-patient-vet-dialog__title">
            <h2>{{ $t(title) }}</h2>
            <div
              class="add-patient-vet-dialog__title__search-icon"
              v-show="isModify"
            >
              <SvgBaseIcon
                viewBox="0, 0, 512, 512"
                @click="onShowPatientDialog"
              >
                <template v-slot:default>
                  <MagnifyingGlass />
                </template>
              </SvgBaseIcon>
            </div>
          </span>
          <div class="add-patient-vet-dialog__content">
            <table class="add-patient-vet-dialog__content__table">
              <tr>
                <th class="add-patient-vet-dialog__content__table__field">
                  {{ $t("Field") }}
                </th>
                <th
                  colspan="2"
                  class="add-patient-vet-dialog__content__table__value"
                >
                  {{ $t("Value") }}
                </th>
              </tr>
              <tr>
                <td><LabelBase displayText="ID" markType="required" /></td>
                <td class="add-patient-vet-dialog__content__id">
                  <TextInputBox
                    v-model="inputPatient.pt_id"
                    placeholder="Patient ID"
                    inputStyle="table"
                    tabindex="1"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Patient Name" markType="required" />
                </td>
                <td class="add-patient-vet-dialog__content__patient-name">
                  <TextInputBox
                    v-model="inputPatientFirstName"
                    placeholder="First Name"
                    inputStyle="table"
                    tabindex="2"
                  />
                </td>
                <td class="add-patient-vet-dialog__content__patient-name">
                  <TextInputBox
                    v-model="inputPatientLastName"
                    placeholder="Last Name"
                    inputStyle="table"
                    tabindex="3"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Species" markType="required" />
                </td>
                <td
                  colspan="2"
                  class="add-patient-vet-dialog__content__species"
                >
                  <DropDownBase
                    placeholder="Species"
                    v-model="inputPatientSpecies"
                    :options="optionsSpecies"
                    :isNoneBorder="isNoneBorder"
                    @update:modelValue="onUpdateSpecies"
                    tabindex="4"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Breed" markType="required" />
                </td>
                <td colspan="2" class="add-patient-vet-dialog__content__breed">
                  <DropDownBase
                    placeholder="Breed"
                    v-model="inputPatient.breed_code_meaning"
                    :options="optionsBreedMeaningList"
                    :isNoneBorder="isNoneBorder"
                    @update:modelValue="onUpdateBreed"
                    tabindex="5"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Sex" markType="required" />
                </td>
                <td colspan="2" class="add-patient-vet-dialog__content__sex">
                  <DropDownBase
                    placeholder="Male / Female / Other"
                    v-model="inputPatient.pt_sex"
                    :options="optionsPatientSex"
                    :isNoneBorder="isNoneBorder"
                    tabindex="6"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Birth Day" markType="required" />
                </td>
                <td
                  colspan="2"
                  class="add-patient-vet-dialog__content__birthday"
                >
                  <DatePickerBase
                    v-model="inputPatientBirthDttm"
                    :isNoneBorder="isNoneBorder"
                    width="50%"
                    fontSize="14px"
                    :maxDttm="new Date()"
                    @update:modelValue="onUpdateBirthdate"
                    tabindex="7"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Age" markType="space" />
                </td>
                <td colspan="2" class="add-patient-vet-dialog__content__age">
                  <TextInputBox
                    v-model="inputPatient.pt_age"
                    placeholder="Patient Age"
                    :isReadonly="isReadOnly"
                    inputStyle="table"
                    tabindex="8"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase
                    displayText="Responsible Person"
                    markType="space"
                  />
                </td>
                <td
                  colspan="2"
                  class="add-patient-vet-dialog__content__resp-person"
                >
                  <TextInputBox
                    v-model="inputPatient.pt_responsible_person"
                    placeholder="Responsible Person Name"
                    inputStyle="table"
                    tabindex="9"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Address" markType="space" />
                </td>
                <td
                  colspan="2"
                  class="add-patient-vet-dialog__content__address"
                >
                  <TextInputBox
                    v-model="inputPatient.pt_address"
                    placeholder="Address"
                    inputStyle="table"
                    tabindex="10"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Tel" markType="space" />
                </td>
                <td colspan="2" class="add-patient-vet-dialog__content__tel">
                  <TextInputBox
                    v-model="inputPatient.pt_tel"
                    placeholder="Telephone Number"
                    inputType="tel"
                    inputStyle="table"
                    tabindex="11"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Medical Alert" markType="space" />
                </td>
                <td
                  colspan="2"
                  class="add-patient-vet-dialog__content__med-alert"
                >
                  <TextInputBox
                    v-model="inputPatient.pt_med_alert"
                    placeholder="Medical Alert (e.g., contagious condition, drug allergies, etc.)"
                    inputStyle="table"
                    tabindex="12"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Allergies" markType="space" />
                </td>
                <td
                  colspan="2"
                  class="add-patient-vet-dialog__content__allergies"
                >
                  <TextInputBox
                    v-model="inputPatient.pt_allergies"
                    placeholder="Allergies (e.g., egg allergy, latex allergy, etc.)"
                    inputStyle="table"
                    tabindex="13"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <LabelBase displayText="Comments" markType="space" />
                </td>
                <td
                  colspan="2"
                  class="add-patient-vet-dialog__content__comment"
                >
                  <TextInputBox
                    v-model="inputPatient.pt_comment"
                    placeholder="Comments"
                    inputStyle="table"
                    tabindex="14"
                  />
                </td>
              </tr>
            </table>
          </div>
          <div class="add-patient-vet-dialog__buttons">
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

  <SelectPatientDialog
    :show="showSearchPatientDialog"
    @onSelect="onHandleSelectPatient"
    @onCancel="onHandleCancelPatient"
  >
  </SelectPatientDialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, reactive } from "vue";
import * as myTypes from "@/types";
import * as myUtils from "@/utils/";
import { useStore } from "vuex";

import MwlService from "@/service/MwlService";

import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";
import DatePickerBase from "@/components/calendar/DatePickerBase.vue";
import LabelBase from "@/components/label/LabelBase.vue";

import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import MagnifyingGlass from "@/assets/etc/MagnifyingGlass.vue";

import SelectPatientDialog from "@/components/dialog/SelectPatientDialog.vue";

enum eState {
  stateNone = 0,
  stateSuccess = 1,
  stateFail,
}

export default defineComponent({
  name: "AddPatientVetDialog",

  components: {
    TextButton,
    TextInputBox,
    DropDownBase,
    DatePickerBase,
    LabelBase,
    SvgBaseIcon,
    MagnifyingGlass,
    SelectPatientDialog,
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

    editPtKey: {
      type: Number,
      default: -1,
    },
  },

  emits: ["on-add", "on-modify", "on-cancel"],

  setup(props, context) {
    const isShowModal = ref(false);
    watch(
      () => props.show,
      () => {
        isShowModal.value = props.show;

        if (props.show) {
          initInstance();
        }
      }
    );

    const title = ref("Add Patient");
    let resTargetPatientKey = -1;

    const store = useStore();

    const curState = ref(eState.stateNone);
    watch(curState, () => {
      switch (curState.value) {
        case eState.stateSuccess:
          if (props.isModify) {
            console.log("Succeed to modify Patient", resTargetPatientKey);
            context.emit("on-modify");
          } else {
            console.log("Succeed to add Patient", resTargetPatientKey);
            context.emit("on-add", resTargetPatientKey);
          }

          resTargetPatientKey = -1;
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
    const isNoneBorder = ref(true);
    const isReadOnly = ref(true);

    const isShowAdd = ref(true);
    const isShowModify = ref(false);
    const isShowCancel = ref(true);

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

    const inputPatientSpecies = ref(myTypes.eSpeciesType[1]);
    //
    const searchedBreedList: myTypes.IDbBreed[] = [];

    const inputPatientBirthDttm = ref("");

    const optionsSpecies = reactive(myTypes.getSpeciesTypeList());
    const optionsPatientSex = reactive(["Male", "Female", "Other"]);
    const optionsBreedMeaningList: string[] = reactive([]);

    const showSearchPatientDialog = ref(false);

    // [Message Box]
    const MsgBoxInfo: myTypes.IMessageBox = reactive({
      isShow: false,
      title: "Add Patient Result",
      msgType: myTypes.eMsgBoxMsgType.MsgTypeInfo,
      resType: myTypes.eMsgBoxResType.Ok,
      style: "line-height: 2",

      msg: "Added patient successfully.",
      res: myTypes.eMsgBoxRes.ResNone,
    });

    const initMsgBoxInfo = () => {
      MsgBoxInfo.isShow = false;
      MsgBoxInfo.title = "Add Patient Result";
      MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
      MsgBoxInfo.resType = myTypes.eMsgBoxResType.Ok;
      MsgBoxInfo.style = "line-height: 2";

      MsgBoxInfo.msg = "Added patient successfully.";
      MsgBoxInfo.res = myTypes.eMsgBoxRes.ResNone;
    };

    const isValidInput = (): string => {
      if (inputPatient.pt_id == undefined || inputPatient.pt_id == "")
        return "Invalid patient ID";

      if (
        inputPatientFirstName.value == undefined ||
        inputPatientFirstName.value == ""
      )
        return "Invalid patient first name";

      if (
        inputPatientLastName.value == undefined ||
        inputPatientLastName.value == ""
      ) {
        return "Invalid patient last name";
      }

      if (
        inputPatientSpecies.value == undefined ||
        inputPatientSpecies.value == "" ||
        myTypes.reverseSpeciesType(inputPatientSpecies.value) ==
          myTypes.eSpeciesType.INVALID
      ) {
        return "Invalid patient speices";
      }

      if (
        inputPatient.pt_breed_key == undefined ||
        inputPatient.pt_breed_key < 1 ||
        inputPatient.breed_code_value == "" ||
        inputPatient.breed_code_meaning == ""
      ) {
        return "Invalid patient breed";
      }

      if (inputPatient.pt_sex == undefined || inputPatient.pt_sex == "") {
        return "Invalid patient sex";
      }

      if (
        inputPatientBirthDttm.value == undefined ||
        inputPatientBirthDttm.value == ""
      )
        return "Invalid birth dttm";

      return "";
    };

    async function AsyncUpdateSpeciesInfo() {
      let speciesQuery: myTypes.IMwlGetSpeciesListQueryCondition = {
        species_type: inputPatient.species_type,
      };

      const res = await MwlService.GetSpeciesList(speciesQuery);

      const { data } = res.data;

      if (data.length < 1) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to update species Info.\n(Type: ${inputPatient.species_type})`;
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
        //
        curState.value = eState.stateFail;
        return;
      }

      inputPatient.pt_species_key = data[0].species_key;
      inputPatient.species_type = data[0].species_type;
      inputPatient.species_code_value = data[0].species_code_value;
      inputPatient.species_scm_design = data[0].species_scm_design;
      inputPatient.species_code_meaning = data[0].species_code_meaning;

      for (const speciesSeq of data) {
        if (
          speciesSeq.species_code_value ==
          myTypes.speciesDefaultCode.get(inputPatient.species_type)
        ) {
          inputPatient.pt_species_key = speciesSeq.species_key;
          inputPatient.species_type = speciesSeq.species_type;
          inputPatient.species_code_value = speciesSeq.species_code_value;
          inputPatient.species_scm_design = speciesSeq.species_scm_design;
          inputPatient.species_code_meaning = speciesSeq.species_code_meaning;
          break;
        }
      }
    }

    const onUpdateSpecies = (
      speciesMeaning: string,
      oldSpeciesMeaning: string
    ) => {
      const speciesType = myTypes.reverseSpeciesType(speciesMeaning);

      inputPatient.species_type = speciesType;

      AsyncUpdateSpeciesInfo();

      if (speciesMeaning != oldSpeciesMeaning) {
        inputPatient.breed_code_meaning = "";
        AsyncGetBreedList(speciesType);

        console.log(
          "onUpdateSpecies:",
          " (new)",
          speciesMeaning,
          " (old)",
          oldSpeciesMeaning
        );
      }
    };

    const onUpdateBreed = (breedMeaning: string, oldBreedMeaning: string) => {
      for (const breed of searchedBreedList) {
        if (breed.breed_code_meaning == breedMeaning) {
          inputPatient.pt_breed_key = breed.breed_key;
          inputPatient.breed_code_value = breed.breed_code_value;
          inputPatient.breed_scm_design = breed.breed_scm_design;
          inputPatient.breed_code_meaning = breed.breed_code_meaning;
        }
      }

      console.log(
        "onUpdateBreed:",
        " (new)",
        breedMeaning,
        " (old)",
        oldBreedMeaning
      );
    };

    const onUpdateBirthdate = (birth: string | undefined) => {
      if (birth == undefined || birth == "") {
        inputPatient.pt_age = "";
      } else {
        inputPatient.pt_age = myUtils.calcAge(new Date(birth));
      }
    };

    const onShowPatientDialog = () => {
      showSearchPatientDialog.value = true;
    };

    const onHandleSelectPatient = (patient: myTypes.IDbPatient): void => {
      showSearchPatientDialog.value = false;

      AsyncGetPatient({
        pt_key: patient.pt_key,
      });
    };

    const onHandleCancelPatient = () => {
      showSearchPatientDialog.value = false;
    };

    const initInstance = () => {
      initMsgBoxInfo();
      initControl();

      const speciesType = myTypes.reverseSpeciesType(inputPatientSpecies.value);

      inputPatient.species_type = speciesType;
      AsyncUpdateSpeciesInfo();
      AsyncGetBreedList(speciesType);
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

      inputPatient.pt_species_key = -1;
      inputPatient.pt_breed_key = -1;

      // JOINED DATA (For VET)
      // T_SPECIES
      inputPatient.species_type = myTypes.eSpeciesType.CANINE;
      inputPatient.species_code_value = undefined;
      inputPatient.species_scm_design = undefined;
      inputPatient.species_code_meaning = undefined;

      // T_BREED
      inputPatient.breed_code_value = undefined;
      inputPatient.breed_scm_design = undefined;
      inputPatient.breed_code_meaning = undefined;

      inputPatientFirstName.value = "";
      inputPatientLastName.value = "";
      inputPatientBirthDttm.value = "";
    };

    const initControl = () => {
      resTargetPatientKey = -1;
      curState.value = eState.stateNone;

      initPatientInfo();

      isShowAdd.value = !props.isModify;
      isShowModify.value = props.isModify;

      if (props.isModify) {
        inputPatient.pt_key = props.editPtKey;

        if (props.editPtKey > 0) {
          AsyncGetPatient({
            pt_key: props.editPtKey,
          });
        }

        resTargetPatientKey = props.editPtKey;

        title.value = "Edit Patient";
      } else {
        title.value = "Add Patient";
      }
    };

    async function AsyncGetPatient(
      reqQuery: myTypes.IMwlGetPatientListQueryCondition
    ) {
      const res = await MwlService.GetPatientList(reqQuery);

      let { result, data } = res.data;

      if (result === true) {
        let birthDttm = new Date(myUtils.initDateString);

        if (data.length > 0) {
          inputPatient.pt_key = data[0].pt_key;
          inputPatient.pt_id = data[0].pt_id;
          inputPatient.pt_name = data[0].pt_name;
          inputPatient.pt_sex = data[0].pt_sex;

          inputPatient.pt_species_key = data[0].pt_species_key;
          inputPatient.pt_breed_key = data[0].pt_breed_key;

          // JOINED DATA (For VET)
          // T_SPECIES
          inputPatient.species_type = data[0].species_type;
          inputPatient.species_code_value = data[0].species_code_value;
          inputPatient.species_scm_design = data[0].species_scm_design;
          inputPatient.species_code_meaning = data[0].species_code_meaning;

          // T_BREED
          inputPatient.breed_code_value = data[0].breed_code_value;
          inputPatient.breed_scm_design = data[0].breed_scm_design;
          inputPatient.breed_code_meaning = data[0].breed_code_meaning;

          birthDttm = new Date(data[0].pt_birth_dttm);
          inputPatient.pt_age = myUtils.calcAge(birthDttm);

          if (data[0].pt_address == undefined) {
            inputPatient.pt_address = "";
          } else {
            inputPatient.pt_address = data[0].pt_address;
          }

          if (data[0].pt_tel == undefined) {
            inputPatient.pt_tel = "";
          } else {
            inputPatient.pt_tel = data[0].pt_tel;
          }

          if (data[0].pt_med_alert == undefined) {
            inputPatient.pt_med_alert = "";
          } else {
            inputPatient.pt_med_alert = data[0].pt_med_alert;
          }

          if (data[0].pt_allergies == undefined) {
            inputPatient.pt_allergies = "";
          } else {
            inputPatient.pt_allergies = data[0].pt_allergies;
          }

          if (data[0].pt_comment == undefined) {
            inputPatient.pt_comment = "";
          } else {
            inputPatient.pt_comment = data[0].pt_comment;
          }

          if (
            data[0].pt_breed_key == undefined ||
            data[0].pt_species_key == undefined
          ) {
            inputPatient.breed_code_meaning = "";
            inputPatientSpecies.value = "";
          } else {
            inputPatient.pt_breed_key = data[0].pt_breed_key;

            if (data[0].species_type != undefined) {
              inputPatient.species_type = data[0].species_type;
            }

            if (data[0].breed_code_value != undefined) {
              inputPatient.breed_code_value = data[0].breed_code_value;
            }

            if (data[0].breed_scm_design != undefined) {
              inputPatient.breed_scm_design = data[0].breed_scm_design;
            }

            if (data[0].breed_code_meaning != undefined) {
              inputPatient.breed_code_meaning = data[0].breed_code_meaning;
            }
          }

          if (data[0].pt_responsible_person == undefined) {
            inputPatient.pt_responsible_person = "";
          } else {
            inputPatient.pt_responsible_person = data[0].pt_responsible_person;
          }
        } else {
          console.log("No Patient information: ", reqQuery);
        }

        inputPatientBirthDttm.value =
          myUtils.GetInputLocaleDateFormatFromDate(birthDttm);

        inputPatientFirstName.value = myUtils.GetFirstNameFromPN(
          data[0].pt_name
        );
        inputPatientLastName.value = myUtils.GetLastNameFromPN(data[0].pt_name);

        inputPatientSpecies.value = myTypes.parseSpeciesType(
          inputPatient.species_type
        );

        console.log("InputPatient: ", inputPatient);
      }
    }

    onMounted(initInstance);

    async function AsyncAddPatient() {
      let reqQuery: myTypes.IMwlAddPatientRequest = {
        pt_key: inputPatient.pt_key,

        pt_id: inputPatient.pt_id,
        pt_name: inputPatient.pt_name,
        pt_sex: inputPatient.pt_sex,

        pt_age: inputPatient.pt_age,
        pt_birth_dttm: new Date(inputPatientBirthDttm.value),

        pt_weight: inputPatient.pt_weight,
        pt_size: inputPatient.pt_size,

        pt_address: inputPatient.pt_address,
        pt_tel: inputPatient.pt_tel,

        pt_state: inputPatient.pt_state,
        pt_med_alert: inputPatient.pt_med_alert,
        pt_allergies: inputPatient.pt_allergies,

        pt_comment: inputPatient.pt_comment,
        pt_responsible_person: inputPatient.pt_responsible_person,

        pt_species_key: inputPatient.pt_species_key,
        pt_breed_key: inputPatient.pt_breed_key,

        // T_SPECIES
        species_type: inputPatient.species_type,
        species_code_value: inputPatient.species_code_value,
        species_scm_design: inputPatient.species_scm_design,
        species_code_meaning: inputPatient.species_code_meaning,

        // T_BREED
        breed_code_value: inputPatient.breed_code_value,
        breed_scm_design: inputPatient.breed_scm_design,
        breed_code_meaning: inputPatient.breed_code_meaning,
      };

      const res = await MwlService.AddPatient(reqQuery);

      const { result, err_code, pt_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = "Added patient successfully.";

        resTargetPatientKey = pt_key;

        console.log(
          "Added patient successfully.[key:%d, state: %d]",
          resTargetPatientKey,
          curState.value
        );
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add patient.\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code, reqQuery);
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add patient.\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add patient.\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      if (resTargetPatientKey > -1) {
        curState.value = eState.stateSuccess;
      } else {
        curState.value = eState.stateFail;
      }
    }

    async function AsyncUpdatePatient() {
      let reqQuery: myTypes.IMwlUpdatePatientRequest = {
        pt_key: inputPatient.pt_key,

        pt_id: inputPatient.pt_id,
        pt_name: inputPatient.pt_name,
        pt_sex: inputPatient.pt_sex,

        pt_age: inputPatient.pt_age,
        pt_birth_dttm: new Date(inputPatientBirthDttm.value),

        pt_weight: inputPatient.pt_weight,
        pt_size: inputPatient.pt_size,

        pt_address: inputPatient.pt_address,
        pt_tel: inputPatient.pt_tel,

        pt_state: inputPatient.pt_state,
        pt_med_alert: inputPatient.pt_med_alert,
        pt_allergies: inputPatient.pt_allergies,

        pt_comment: inputPatient.pt_comment,
        pt_responsible_person: inputPatient.pt_responsible_person,

        pt_species_key: inputPatient.pt_species_key,
        pt_breed_key: inputPatient.pt_breed_key,

        // T_SPECIES
        species_type: inputPatient.species_type,
        species_code_value: inputPatient.species_code_value,
        species_scm_design: inputPatient.species_scm_design,
        species_code_meaning: inputPatient.species_code_meaning,

        // T_BREED
        breed_code_value: inputPatient.breed_code_value,
        breed_scm_design: inputPatient.breed_scm_design,
        breed_code_meaning: inputPatient.breed_code_meaning,
      };

      console.log("AsyncUpdatePatient: ", reqQuery);

      const res = await MwlService.UpdatePatient(reqQuery);

      const { result, err_code, pt_key } = res.data;

      if (result === true) {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeInfo;
        MsgBoxInfo.msg = "Updated patient successfully.";

        console.log(
          "Updated patient successfully.[key:%d, state: %d]",
          resTargetPatientKey,
          curState.value
        );
      } else if (typeof err_code === "string") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to Update patient.\n(Reason: ${err_code} )`;
        //
        console.log("Unknown Err: ", err_code);
      } else if (err_code != undefined && err_code > 0) {
        const errDesc =
          store.getters["ErrorModule/GET_SERVICE_FAIL_REASON_DESC"](err_code);

        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to update patient.\n(Reason: ${errDesc} )`;
        //
        console.log("error code: ", err_code);
      } else {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to update patient.\n`;
      }

      MsgBoxInfo.isShow = true;
      store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);

      if (pt_key > 0) {
        curState.value = eState.stateSuccess;
      } else {
        curState.value = eState.stateFail;
      }
    }

    async function AsyncGetBreedList(speciestType: myTypes.eSpeciesType) {
      const reqQuery: myTypes.IMwlGetBreedListQueryCondition = {
        breed_species_type: speciestType,
      };

      const resGetBreedList = await MwlService.GetBreedList(reqQuery);

      let { data } = resGetBreedList.data;

      while (searchedBreedList.length > 0) {
        searchedBreedList.pop();
      }

      while (optionsBreedMeaningList.length > 0) {
        optionsBreedMeaningList.pop();
      }

      for (const breed of data) {
        searchedBreedList.push(breed);
        optionsBreedMeaningList.push(breed.breed_code_meaning);
      }

      if (
        inputPatient.breed_code_meaning == undefined ||
        inputPatient.breed_code_meaning == ""
      ) {
        inputPatient.pt_breed_key = searchedBreedList[0].breed_key;
        inputPatient.breed_scm_design = searchedBreedList[0].breed_scm_design;
        inputPatient.breed_code_value = searchedBreedList[0].breed_code_value;
        inputPatient.breed_code_meaning = optionsBreedMeaningList[0];
      }
    }

    const onHandleAdd = () => {
      const err = isValidInput();

      if (err != "") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to add patient.\n(Reason: ${err} )`;
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
        //
        curState.value = eState.stateFail;
        return;
      }

      inputPatient.pt_name = myUtils.GetPN(
        inputPatientLastName.value,
        inputPatientFirstName.value
      );
      inputPatient.species_type = myTypes.reverseSpeciesType(
        inputPatientSpecies.value
      );
      inputPatient.pt_birth_dttm = new Date(inputPatientBirthDttm.value);

      AsyncAddPatient();
    };

    const onHandleModify = () => {
      const err = isValidInput();

      if (err != "") {
        MsgBoxInfo.msgType = myTypes.eMsgBoxMsgType.MsgTypeError;
        MsgBoxInfo.msg = `Failed to update patient.\n(Reason: ${err} )`;
        MsgBoxInfo.isShow = true;
        store.dispatch("AppModelModule/setMsgBoxInfo", MsgBoxInfo);
        //
        curState.value = eState.stateFail;
        return;
      }

      inputPatient.pt_name = myUtils.GetPN(
        inputPatientLastName.value,
        inputPatientFirstName.value
      );
      inputPatient.species_type = myTypes.reverseSpeciesType(
        inputPatientSpecies.value
      );
      inputPatient.pt_birth_dttm = new Date(inputPatientBirthDttm.value);

      console.log("onHandleModify: ", inputPatient);

      AsyncUpdatePatient();
    };

    const onHandleCancel = () => {
      context.emit("on-cancel");
    };

    return {
      isShowModal,
      //
      title,
      //
      isNoneBorder,
      isReadOnly,
      //
      isShowAdd,
      isShowModify,
      isShowCancel,
      //
      inputPatient,
      inputPatientFirstName,
      inputPatientLastName,
      inputPatientSpecies,
      inputPatientBirthDttm,

      //
      optionsSpecies,
      optionsBreedMeaningList,
      optionsPatientSex,
      //
      showSearchPatientDialog,
      //
      onUpdateSpecies,
      onUpdateBreed,
      onUpdateBirthdate,
      onShowPatientDialog,
      onHandleSelectPatient,
      onHandleCancelPatient,
      //
      onHandleAdd,
      onHandleModify,
      onHandleCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
