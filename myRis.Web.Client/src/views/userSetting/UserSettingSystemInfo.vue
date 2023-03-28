<template>
  <div class="system-info">
    <div class="system-info__title">
      <h2>{{ $t("System Information") }}</h2>
    </div>
    <div class="system-info__content-container">
      <LabelBase
        class="system-info__content-container__app-name-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Name") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="system-info__content-container__app-name-input"
        v-model="getServerInfo.alias"
        :isReadonly="readOnlyTrue"
      />
      <LabelBase
        class="system-info__content-container__host-name-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Host Name") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="system-info__content-container__host-name-input"
        v-model="getServerInfo.host_name"
        :isReadonly="readOnlyTrue"
      />

      <LabelBase
        class="system-info__content-container__port-no-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Port No.") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="system-info__content-container__port-no-input"
        v-model="getServerInfo.port_no"
        inputType="number"
        :isReadonly="readOnlyTrue"
      />

      <LabelBase
        class="system-info__content-container__license-type-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("License Type") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="system-info__content-container__license-type-input"
        v-model="getLicenseType"
        :isReadonly="readOnlyTrue"
      />

      <LabelBase
        class="system-info__content-container__version-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Version") }}</h3>
        </template>
      </LabelBase>
      <TextInputBox
        class="system-info__content-container__version-input"
        v-model="getServerInfo.version"
        :isReadonly="readOnlyTrue"
      />

      <LabelBase
        class="system-info__content-container__language-label"
        markType="space"
      >
        <template v-slot:label>
          <h3>{{ $t("Language") }}</h3>
        </template>
      </LabelBase>
      <DropDownBase
        class="system-info__content-container__language-input"
        v-model="getClientLocale"
        :options="getLocaleOptions"
        @update:modelValue="updateClientLocale"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import * as myTypes from "@/types";

import TextInputBox from "@/components/input/TextInputBox.vue";
import DropDownBase from "@/components/input/DropdownBase.vue";
import LabelBase from "@/components/label/LabelBase.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "UserSettingSystemInfo",

  components: {
    TextInputBox,
    DropDownBase,
    LabelBase,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    const readOnlyTrue = ref(true);

    const { locale } = useI18n({
      useScope: "global",
      inheritLocale: true,
      warnHtmlMessage: false,
    });

    const getLicenseType = computed(() => {
      return myTypes.parseLicenseType(getServerInfo.value.license_type);
    });

    const getServerInfo = computed(() => {
      const res: myTypes.IWebServerInfo =
        store.getters["AppModelModule/GET_SERVER_INFO"];

      return res;
    });

    const getLocale = ref(myTypes.LOCALES[0].caption);

    const getClientLocale = computed(() => {
      const res: myTypes.eLocales =
        store.getters["AppModelModule/GET_CLIENT_LOCALE"];

      return myTypes.getLocaleCaption(res);
    });

    const updateClientLocale = (strCaption: string) => {
      let locValue = myTypes.getLocaleValue(strCaption);

      store.dispatch("AppModelModule/fetClientLocale", locValue);

      if (locale.value != locValue) {
        locale.value = locValue;

        localStorage.removeItem(myTypes.storageKeyClientLanguage);
        localStorage.setItem(myTypes.storageKeyClientLanguage, locValue);
        console.log("updateClientLocale", locale, locValue);
        router.go(0);
      }
    };

    const getLocaleOptions = computed(() => {
      const options: string[] = [];

      for (let loc of myTypes.LOCALES) {
        options.push(loc.caption);
      }

      return options;
    });

    const initInstance = () => {
      store.dispatch("AppModelModule/fetServerInfo");

      const clientLocale = localStorage.getItem(
        myTypes.storageKeyClientLanguage
      );

      if (clientLocale != null && clientLocale != undefined) {
        const caption = myTypes.getLocaleCaption(clientLocale);

        updateClientLocale(caption);
      }
    };

    onMounted(initInstance);

    return {
      readOnlyTrue,
      getLicenseType,
      getServerInfo,
      getLocale,
      getClientLocale,
      getLocaleOptions,
      updateClientLocale,
      locale,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/view/userSetting.scss";
</style>
