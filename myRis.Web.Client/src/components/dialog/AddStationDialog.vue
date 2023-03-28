<template>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-if="isShowModal" class="add-station-dialog">
        <div class="add-station-dialog__container">
          <div class="add-station-dialog__title">
            <h2>{{ $t(title) }}</h2>
          </div>
          <div class="add-station-dialog__content">
            <!-- AE Title -->
            <LabelBase
              class="add-station-dialog__content__ae-title-label"
              markType="required"
            >
              <template v-slot:label>
                <h3>{{ $t("Station AE Title") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-station-dialog__content__ae-title-input"
              v-model="inputStation.station_ae_title"
              :textMax="maxLengthStationAeTitle"
            />

            <!-- Name -->
            <LabelBase
              class="add-station-dialog__content__name-label"
              markType="space"
            >
              <template v-slot:label>
                <h3>{{ $t("Station Name") }}</h3>
              </template>
            </LabelBase>
            <TextInputBox
              class="add-station-dialog__content__name-input"
              v-model="inputStation.station_name"
              :textMax="maxLengthStationName"
            />
          </div>
          <div class="add-station-dialog__control-row">
            <div class="add-station-dialog__control-row__add">
              <TextButton
                :text="okButtonText"
                buttonStyle="primary"
                fontSize="16px"
                @click.prevent="onClickOkButton()"
              />
            </div>
            <div class="add-station-dialog__control-row__cancel">
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
import * as myTypes from "@/types";

import TextButton from "@/components/button/TextButton.vue";
import TextInputBox from "@/components/input/TextInputBox.vue";
import LabelBase from "@/components/label/LabelBase.vue";

export default defineComponent({
  name: "AddStationDialog",

  components: {
    TextButton,
    TextInputBox,
    LabelBase,
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

    curStation: {
      type: Object as PropType<myTypes.IDbStation>,
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

    const title = ref("Add Station");

    const maxLengthStationAeTitle = ref(16);
    const maxLengthStationName = ref(16);

    const inputStation = reactive({
      station_key: -1,
      station_ae_title: "",
      station_name: "",
    } as myTypes.IDbStation);

    const initControl = () => {
      if (props.isModify) {
        title.value = "Modify Station";

        inputStation.station_key = props.curStation.station_key;
        inputStation.station_ae_title = props.curStation.station_ae_title;
        inputStation.station_name = props.curStation.station_name;

        okButtonText.value = "Modify";

        console.log("[Add Station Dialog] initControl(Modify)");
      } else {
        title.value = "Add Station";

        inputStation.station_key = -1;
        inputStation.station_ae_title = "";
        inputStation.station_name = "";

        okButtonText.value = "Add";
      }
    };

    const okButtonText = ref("Add");

    const onClickOkButton = () => {
      const station: myTypes.IDbStation = inputStation;

      context.emit("on-ok", station);
    };

    const onClickCancelButton = () => {
      context.emit("on-cancel");
    };

    // Style
    return {
      isShowModal,
      //
      title,
      maxLengthStationAeTitle,
      maxLengthStationName,
      //
      inputStation,
      //
      okButtonText,
      onClickOkButton,
      onClickCancelButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/dialog";
</style>
