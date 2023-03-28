module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `
              @import "@/styles/common.scss";
              @import "@/styles/layout.scss";
            `,
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "i18n/locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
    },
  },
};
