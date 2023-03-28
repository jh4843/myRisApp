<template>
  <div class="layout-mwl">
    <MwlToolbar class="layout-mwl__toolbar" />
    <div class="layout-mwl__content">
      <transition name="content-drawer">
        <div class="layout-mwl__content__search-drawer" v-show="isDrawerShow">
          <MwlSearchDrawer />
        </div>
      </transition>
      <div class="layout-mwl__content__show-search-drawer-button__container">
        <div
          class="layout-mwl__content__show-search-drawer-button"
          @click.prevent="ShowHideDrawer()"
        >
          <SvgBaseIcon
            class="layout-mwl__content__show-search-drawer-button__icon"
            :class="{ 'is-opend': isDrawerShow }"
            iconName="ShowSearchDrawer"
            viewBox="0, 0, 7.51, 13.02"
            width="8px"
            height="12px"
          >
            <template v-slot:default>
              <LeftArrow />
            </template>
          </SvgBaseIcon>
        </div>
      </div>

      <div
        class="layout-mwl__content__table"
        :class="{ 'is-drawer-opend': isDrawerShow }"
      >
        <MwlMainTable
          tableType="main"
          class="layout-mwl__content__table__mwl-main-table"
          :needUpdate="flagUpdateMwlTable"
          :perPageDropdown="perPageDropdown"
          :defaultPage="defaultPage"
        />
        <!-- <MwlTableBase /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
//
import SvgBaseIcon from "@/components/icon/SvgBaseIcon.vue";
import LeftArrow from "@/assets/etc/LeftArrow.vue";
//
import MwlMainTable from "@/components/table/MwlMainTable.vue";
import MwlToolbar from "@/views/mwl/MwlToolbar.vue";
import MwlSearchDrawer from "@/views/mwl/MwlSearchDrawer.vue";

export default defineComponent({
  name: "MwlView",

  components: {
    MwlSearchDrawer,
    MwlMainTable,
    MwlToolbar,
    SvgBaseIcon,
    LeftArrow,
  },

  setup() {
    const store = useStore();
    let isDrawerShow = ref(false);

    const flagUpdateMwlTable = computed(() => {
      const res =
        store.getters["MwlModelModule/GET_IS_NEED_UPDATE_MWL_MAIN_TABLE"];
      return res;
    });

    const perPageDropdown = ref([5, 10]);
    const defaultPage = ref(10);

    const ShowHideDrawer = (): void => {
      isDrawerShow.value = !isDrawerShow.value;
    };

    onMounted(() => {
      store.dispatch("MwlModelModule/setUpdateMwlMainTable");
    });

    return {
      isDrawerShow,

      flagUpdateMwlTable,
      perPageDropdown,
      defaultPage,

      ShowHideDrawer,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/mwl.scss";
</style>
