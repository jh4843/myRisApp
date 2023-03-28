<template>
  <div
    class="datepicker-base"
    :class="{ toggled: getShowCalendar }"
    @blur="setShowCalendar(false)"
    @keydown.esc="setShowCalendar(false)"
  >
    <div class="datepicker-base__container">
      <div
        class="datepicker-base__label"
        :class="{ disabled: isDisabled, 'is-none-border': isNoneBorder }"
      >
        <span v-if="displayDateTime" class="datepicker-base__label__text">{{
          displayDateTime
        }}</span>
        <span v-else class="datepicker-base__label__placeholder">{{
          dttmPlaceHolder
        }}</span>

        <SvgBaseIcon
          v-show="isNotEmpty"
          @click="onHanlderClear()"
          viewBox="0, 0, 8.5, 8.5"
          width="10px"
          height="10px"
          :isDisable="isDisabled"
        >
          <template v-slot:default>
            <EditClear />
          </template>
        </SvgBaseIcon>
        <div class="calendar-icon">
          <SvgBaseIcon
            @click="setShowCalendar(!isShowCalendar)"
            viewBox="0, 0, 14.75, 14.9"
            :isDisable="isDisabled"
          >
            <template v-slot:default>
              <CalendarImg />
            </template>
          </SvgBaseIcon>
        </div>
      </div>

      <div class="datepicker-base__calendar" v-show="getShowCalendar">
        <DatePicker
          v-model="pickedDate"
          :min-date="minDttm"
          :max-date="maxDttm"
          :mode="calMode"
          :model-config="modelConfig"
          :select-attribute="datePickerSelAttrs"
          :attributes="datePickerAttrs"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType, reactive } from "vue";
import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import CalendarImg from "@/assets/etc/CalendarIcon.vue";
import EditClear from "@/assets/etc/EditClear.vue";

import * as myTypes from "@/types/";
import * as myUtils from "@/utils/";

//import { Calendar, DatePicker } from "v-calendar";
import { DatePicker } from "v-calendar";

export type tCalendarMode = "date" | "dateTime" | "time";

export default defineComponent({
  name: "DatePickerBase",

  components: {
    SvgBaseIcon,
    CalendarImg,
    EditClear,

    //Calendar,
    DatePicker,
  },

  props: {
    modelValue: {
      type: String,
      default: "",
    },
    calMode: {
      type: String as PropType<tCalendarMode>,
      default: "date",
    },
    placeholder: {
      type: String,
      default: myUtils.getLocaleDateFormatString(),
    },
    dataType: {
      type: String as PropType<myTypes.tDateFormatType>, // "UTC" | "Locale" | "ISO-8859-1"
      default: "UTC",
    },
    displayType: {
      type: String as PropType<myTypes.tDateFormatType>, // "UTC" | "Locale" | "ISO-8859-1"
      default: "Locale",
    },
    isNoneBorder: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    timeAdjust: {
      type: String,
      default: "now",
    },
    minDttm: {
      type: Date,
      defulat: undefined,
    },
    maxDttm: {
      type: Date,
      default: undefined,
    },
  },

  emits: ["update:modelValue", "show-calendar"],

  setup(props, context) {
    const isShowCalendar = ref(false);

    const dttmPlaceHolder = ref(
      props.calMode == "date"
        ? myUtils.getLocaleDateFormatString()
        : myUtils.getLocaleDateTimeFormatString()
    );

    const modelConfig = reactive({
      timeAdjust: props.timeAdjust,
    });

    const datePickerSelAttrs = computed(() => {
      return {
        highlight: {
          color: "blue",
          fillMode: "solid",
        },
      };
    });

    const datePickerAttrs = reactive([
      {
        key: "today",
        dates: new Date(),
        dot: {
          color: "blue",
        },
      },
    ]);

    const pickedDate = ref(new Date(props.modelValue));
    const lastPickedDate = ref(new Date(props.modelValue));

    watch(pickedDate, () => {
      const selDttm = new Date(pickedDate.value);

      if (props.minDttm != undefined) {
        if (selDttm < props.minDttm) {
          console.log("Selected Datetime is lower than min-dttm");
          return;
        }
      }

      if (props.maxDttm != undefined) {
        if (selDttm > props.maxDttm) {
          console.log("Selected Datetime is higher than max-dttm");
          return;
        }
      }

      updateDateTime(selDttm);
    });

    const displayDateTime = computed(() => {
      if (!myUtils.isValidDateString(props.modelValue)) return "";

      const displayDttm = new Date(props.modelValue);
      let resDttm: string | undefined = displayDttm.toUTCString();

      if (props.calMode == "date") {
        if (props.displayType == "UTC") {
          resDttm = displayDttm.toDateString();
        } else if (props.displayType == "Locale") {
          //resDttm = displayDttm.toLocaleDateString(navigator.language);
          resDttm = myUtils.GetInputLocaleDateFormatFromDate(displayDttm);
        } else if (props.displayType == "ISO-8859-1") {
          resDttm = myUtils.GetDate(displayDttm, "YYYYMMDD", "-");
        }
      } else {
        if (props.displayType == "UTC") {
          resDttm = displayDttm.toUTCString();
        } else if (props.displayType == "Locale") {
          //resDttm = displayDttm.toLocaleString(navigator.language);
          resDttm = myUtils.GetInputLocaleDateTimeFormatFromDate(displayDttm);
        } else if (props.displayType == "ISO-8859-1") {
          resDttm = displayDttm.toISOString();
        }
      }

      return resDttm;
    });

    const isNotEmpty = computed(() => {
      if (props.modelValue === undefined || props.modelValue === "") {
        return false;
      }

      return true;
    });

    const updateDateTime = (date: Date) => {
      if (props.calMode == "date") {
        setShowCalendar(false);
      } else {
        let lastMin = lastPickedDate.value.getMinutes();

        if (lastMin != undefined && !isNaN(lastMin)) {
          if (lastMin != date.getMinutes()) setShowCalendar(false);
        }
      }

      lastPickedDate.value = date;

      context.emit("update:modelValue", date);
    };

    const setShowCalendar = (isShow: boolean) => {
      if (isShow) {
        document.body.addEventListener("click", clickDocument);
      } else {
        document.body.removeEventListener("click", clickDocument);
      }

      context.emit("show-calendar", isShow);
      isShowCalendar.value = isShow;
    };

    const getShowCalendar = computed(() => {
      return isShowCalendar.value;
    });

    const onHanlderClear = () => {
      context.emit("update:modelValue", "");
    };

    // let calendarArea = document.getElementById("datepicker-base-calendar");

    // calendarArea.addEventListener("keydown", (e) => {
    //   console.log(`Key "${e.key}" released  [event: keyup]`);
    // });

    const clickDocument = (event) => {
      let clickedElement = event.target.closest(".datepicker-base");

      if (clickedElement === undefined || clickedElement === null) {
        setShowCalendar(false);
      }
    };

    return {
      isShowCalendar,
      dttmPlaceHolder,
      modelConfig,
      datePickerSelAttrs,
      datePickerAttrs,
      isNotEmpty,

      //
      pickedDate,

      displayDateTime,

      updateDateTime,
      setShowCalendar,
      getShowCalendar,
      //
      onHanlderClear,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/datepicker";
</style>
