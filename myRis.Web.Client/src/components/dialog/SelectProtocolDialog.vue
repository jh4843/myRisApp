<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="select-protocol-dialog">
        <div class="select-protocol-dialog__container">
          <div class="select-protocol-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="select-protocol-dialog__content">
            <ProtocolTable
              tableStyle="select"
              :needUpdate="flagUpdateTable"
              :perPageDropdown="perPageDropdown"
              :defaultPage="defaultPage"
              @selected-rows-change="onHandleSelChangeRow"
            />
          </div>
          <div class="select-protocol-dialog__control-row">
            <div class="select-protocol-dialog__control-row__add">
              <TextButton
                text="Select"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickSelectButton()"
              />
            </div>
            <div class="select-protocol-dialog__control-row__cancel">
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
import ProtocolTable from "@/components/table/ProtocolTable.vue";

export default defineComponent({
  name: "SelectProtocolDialog",

  components: {
    TextButton,
    ProtocolTable,
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

    const title = ref("Select Protocol");

    const initControl = () => {
      title.value = "Select Protocol";
    };

    const flagUpdateTable = ref(false);
    const perPageDropdown = ref([10, 5, 3]);
    const defaultPage = ref(5);
    let selectedItemList: myTypes.IDbProtocol[] = [];
    const onHandleSelChangeRow = (
      selProtocolItems: myTypes.IDbProtocol[]
    ): void => {
      while (selectedItemList.length > 0) {
        selectedItemList.pop();
      }

      for (const protocol of selProtocolItems) {
        selectedItemList.push(protocol);
      }
    };

    const onClickSelectButton = () => {
      context.emit("on-select", selectedItemList);
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
