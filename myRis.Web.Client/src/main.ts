import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

import "../../myRis.Web.Common/helpers";
import i18n from "@/i18n";

const app = createApp(App).use(i18n);

//app.component(TextButton.name, TextButton);

//
//import { Button } from "ant-design-vue";
//import "ant-design-vue/dist/antd.css";
//
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//createApp(App).use(store).use(router).use(Button).mount("#app");
app.use(store).use(router).mount("#app");
