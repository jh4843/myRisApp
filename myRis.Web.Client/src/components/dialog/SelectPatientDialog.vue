<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="select-patient-dialog">
        <div class="select-patient-dialog__container">
          <div class="select-patient-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="select-patient-dialog__content">
            <PatientTable
              class="select-patient-dialog__content__patient-table"
              :needUpdate="flagUpdateTable"
              :isMultipleSelect="multipleSelectable"
              :perPageDropdown="perPageDropdown"
              :defaultPage="defaultPage"
              @selected-rows-change="onHandleSelChangeRow"
            />
          </div>
          <div class="select-patient-dialog__control-row">
            <div class="select-patient-dialog__control-row__add">
              <TextButton
                text="Select"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickSelectButton()"
              />
            </div>
            <div class="select-patient-dialog__control-row__cancel">
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
import { defineComponent, ref, computed } from "vue";
import * as myTypes from "@/types";
import * as myUtils from "@/utils/";

import TextButton from "@/components/button/TextButton.vue";

import PatientTable from "@/components/table/PatientTable.vue";

export default defineComponent({
  name: "SelectPatientDialog",

  components: {
    TextButton,
    PatientTable,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["on-select", "on-cancel"],

  setup(props, context) {
    const isShowModal = computed(() => {
      if (props.show) {
        initControl();
      }

      return props.show;
    });

    const title = ref("Select Patient Dialog");

    const initControl = () => {
      title.value = "Select Patient Dialog";
    };

    const flagUpdateTable = ref(false);
    const multipleSelectable = ref(false);
    const perPageDropdown = ref([10, 5, 3]);
    const defaultPage = ref(5);

    let selectItem: myTypes.IDbPatient = {
      pt_key: -1,
      pt_id: "",

      pt_name: "",
      pt_sex: "",

      pt_age: "",
      pt_birth_dttm: new Date(myUtils.initDateString),
    };

    const onHandleSelChangeRow = (selPatient: myTypes.IDbPatient[]): void => {
      if (selPatient.length > 0) {
        selectItem = selPatient[0];
      }
    };

    const onClickSelectButton = () => {
      context.emit("on-select", selectItem);
    };

    const onClickCancelButton = () => {
      context.emit("on-cancel");
    };

    // Style
    return {
      isShowModal,
      //
      title,
      flagUpdateTable,
      multipleSelectable,
      perPageDropdown,
      defaultPage,
      onHandleSelChangeRow,
      //
      onClickSelectButton,
      onClickCancelButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
