<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="select-order-dialog">
        <div class="select-order-dialog__container">
          <div class="select-order-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="select-order-dialog__content">
            <OrderTable
              class="select-order-dialog__content__order-table"
              :needUpdate="flagUpdateTable"
              :isMultipleSelect="multipleSelectable"
              :perPageDropdown="perPageDropdown"
              :defaultPage="defaultPage"
              @selected-rows-change="onHandleSelChangeRow"
            />
          </div>
          <div class="select-order-dialog__control-row">
            <div class="select-order-dialog__control-row__add">
              <TextButton
                text="Select"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickSelectButton()"
              />
            </div>
            <div class="select-order-dialog__control-row__cancel">
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

import OrderTable from "@/components/table/OrderTable.vue";

export default defineComponent({
  name: "SelectOrderDialog",

  components: {
    TextButton,
    OrderTable,
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

    const title = ref("Select Order Dialog");

    const initControl = () => {
      title.value = "Select Order Dialog";
    };

    const flagUpdateTable = ref(false);
    const multipleSelectable = ref(false);
    const perPageDropdown = ref([10, 5, 3]);
    const defaultPage = ref(5);

    let selectItem: myTypes.IDbOrder = {
      ord_key: -1,
      ord_pt_key: -1,

      ord_acc_num: "",
      ord_issuer: "",
      ord_create_dttm: new Date(myUtils.initDateString),

      ord_status_flag: myTypes.eOrderStatus.NONE,
      ord_requesting_phyc: "",
      ord_referring_phyc: "",

      ord_study_uid: "",
      ord_study_dttm: new Date(myUtils.initDateString),
      ord_priority: myTypes.eOrderPriority.NONE,
      ord_reason: "",
      ord_rp_id: "",
      ord_rp_desc: "",

      ord_pt_age: "",
      ord_pt_weight: "",
      ord_pt_size: "",
    };

    const onHandleSelChangeRow = (selOrder: myTypes.IDbOrder[]): void => {
      if (selOrder.length > 0) {
        selectItem = selOrder[0];
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
