import Vue from "vue";
import Vuetify from "vuetify";
import { config } from "@vue/test-utils";

Vue.use(Vuetify);
Vue.config.devtools = false;
Vue.config.productionTip = false;
config.showDeprecationWarnings = false;
