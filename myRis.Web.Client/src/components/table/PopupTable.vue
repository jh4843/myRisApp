<template>
  <div class="popup-table" :class="{ 'is-none-border': isNoneBorder }">
    <div class="popup-table__container">
      <table class="popup-table__table">
        <tr v-show="isShowHeader" class="popup-table__table__header">
          <th
            v-for="(col, index) in getDisplayCols"
            :key="index"
            :style="{ width: col.width }"
          >
            {{ $t(col.label) }}
          </th>
        </tr>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          class="popup-table__table__items"
          @click="onRowClicked(rowIndex, row)"
        >
          <td
            v-for="(col, colIndex) in getDisplayCols"
            :key="colIndex"
            :style="{ width: col.width }"
          >
            {{ $t(getRowDate(rowIndex, colIndex)) }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  reactive,
  onMounted,
  PropType,
} from "vue";
import * as myTypes from "@/types";

export default defineComponent({
  name: "PopupTable",

  components: {},

  props: {
    rows: {
      type: Array as PropType<string[]>,
      required: true,
    },

    columns: {
      type: Array as PropType<myTypes.IPopupTableColumn[]>,
      required: true,
    },

    isShowHeader: {
      type: Boolean,
      default: true,
    },

    isSelectable: {
      type: Boolean,
      default: true,
    },

    isNoneBorder: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["on-row-click"],

  setup(props, context) {
    const displayCols: myTypes.IPopupTableColumn[] = reactive([]);
    const displayRows: string[] = reactive([]);

    const onRowClicked = (index, row) => {
      if (props.isSelectable) {
        context.emit("on-row-click", { row });
      }
    };

    watch(
      () => props.rows,
      () => {
        while (displayRows.length > 0) {
          displayRows.pop();
        }

        for (let i = 0; i < props.rows.length; i++) {
          displayRows.push(props.rows[i]);
        }
      }
    );

    watch(
      () => props.columns,
      () => {
        while (displayCols.length > 0) {
          displayCols.pop();
        }

        for (let i = 0; i < props.columns.length; i++) {
          displayCols.push(props.columns[i]);
        }
      }
    );

    const getRowDate = (rowIndex, colIndex) => {
      if (displayRows.length < 0) return "";

      if (colIndex < 0) return "";

      const col = displayCols[colIndex];
      return displayRows[rowIndex][col.field];
    };

    const getDisplayCols = computed(() => {
      return displayCols;
    });

    onMounted(() => {
      for (let i = 0; i < props.columns.length; i++) {
        if (props.columns[i].isShow) displayCols.push(props.columns[i]);
      }

      for (let i = 0; i < props.rows.length; i++) {
        displayRows.push(props.rows[i]);
      }
    });

    return {
      displayCols,

      onRowClicked,
      getRowDate,

      getDisplayCols,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/table.scss";
</style>
