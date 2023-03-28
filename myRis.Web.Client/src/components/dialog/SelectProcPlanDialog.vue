<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="select-proc-plan-dialog">
        <div class="select-proc-plan-dialog__container">
          <div class="select-proc-plan-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="select-proc-plan-dialog__content">
            <ProcPlanTable
              class="select-proc-plan-dialog__content__proc-plan-table"
              :needUpdate="flagUpdateTable"
              :isMultipleSelect="multipleSelectable"
              :perPageDropdown="perPageDropdown"
              :defaultPage="defaultPage"
              @selected-rows-change="onHandleSelChangeRow"
            />
          </div>
          <div class="select-proc-plan-dialog__control-row">
            <div class="select-proc-plan-dialog__control-row__add">
              <TextButton
                text="Select"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickSelectButton()"
              />
            </div>
            <div class="select-proc-plan-dialog__control-row__cancel">
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

import TextButton from "@/components/button/TextButton.vue";

import ProcPlanTable from "@/components/table/ProcPlanTable.vue";

export default defineComponent({
  name: "SelectProcPlanDialog",

  components: {
    TextButton,
    ProcPlanTable,
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

    const title = ref("Select Procedure Plan");

    const initControl = () => {
      title.value = "Select Procedure Plan";
    };

    const flagUpdateTable = ref(false);
    const multipleSelectable = ref(false);
    const perPageDropdown = ref([10, 5, 3]);
    const defaultPage = ref(5);
    let selectItem: myTypes.IDbProcPlan = {
      proc_plan_key: -1,
      proc_plan_id: "",
    };

    const onHandleSelChangeRow = (selProcPlan: myTypes.IDbProcPlan[]): void => {
      if (selProcPlan.length > 0) {
        selectItem = selProcPlan[0];
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
