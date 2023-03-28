<template>
  <AddPatientHumanDialog
    :show="isShowHumanModal"
    :isModify="isModify"
    :editPtKey="editPtKey"
    @onAdd="onHandlePatientDialogAdd()"
    @onModify="onHandlePatientDialogModify()"
    @onCancel="onHandlePatientDialogCancel()"
  >
  </AddPatientHumanDialog>
  <AddPatientVetDialog
    :show="isShowVetModal"
    :isModify="isModify"
    :editPtKey="editPtKey"
    @onAdd="onHandlePatientDialogAdd()"
    @onModify="onHandlePatientDialogModify()"
    @onCancel="onHandlePatientDialogCancel()"
  >
  </AddPatientVetDialog>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import * as myTypes from "@/types";
import { useStore } from "vuex";

import AddPatientHumanDialog from "@/components/dialog/addPatient/AddPatientHumanDialog.vue";
import AddPatientVetDialog from "@/components/dialog/addPatient/AddPatientVetDialog.vue";

export default defineComponent({
  name: "AddPatientDialog",

  components: {
    AddPatientHumanDialog,
    AddPatientVetDialog,
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
    const store = useStore();

    const isShowHumanModal = computed(() => {
      return (
        props.show &&
        getServerInfo.value.license_type == myTypes.eLicenseType.Human
      );
    });

    const isShowVetModal = computed(() => {
      const res =
        props.show &&
        (getServerInfo.value.license_type == myTypes.eLicenseType.Veterinary ||
          getServerInfo.value.license_type == myTypes.eLicenseType.Demo);

      return res;
    });

    const getServerInfo = computed(() => {
      const res: myTypes.IWebServerInfo =
        store.getters["AppModelModule/GET_SERVER_INFO"];

      return res;
    });

    const onHandlePatientDialogAdd = () => {
      context.emit("on-add");
    };

    const onHandlePatientDialogModify = () => {
      context.emit("on-modify");
    };

    const onHandlePatientDialogCancel = () => {
      context.emit("on-cancel");
    };

    return {
      isShowHumanModal,
      isShowVetModal,
      //
      onHandlePatientDialogAdd,
      onHandlePatientDialogModify,
      onHandlePatientDialogCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
