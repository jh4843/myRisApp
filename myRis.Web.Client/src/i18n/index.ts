// ref: https://medium.com/js-dojo/manage-vue-i18n-with-typescript-958b2f69846f

import * as myTypes from "@/types";

import en from "./locales/en.json";
import ko from "./locales/kr.json";

import { createI18n } from "vue-i18n";

export const messages = {
  [myTypes.eLocales.EN]: en,
  [myTypes.eLocales.KR]: ko,
};

export const defaultLocale = localStorage
  .getItem(myTypes.storageKeyClientLanguage)
  ?.toString();

const i18n = createI18n({
  locale: defaultLocale == undefined ? myTypes.eLocales.EN : defaultLocale,
  fallbackWarn: false,
  missingWarn: false,
  fallbackLocale: myTypes.eLocales.EN,
  messages: messages,
});

export default i18n;
