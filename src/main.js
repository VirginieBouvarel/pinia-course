import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { PiniaHistoryPlugin } from "@/plugins/PiniaHistoryPlugin";

// Icons and Styles
import FontAwesomePlugin from "./plugins/FontAwesome";
import "./assets/main.pcss";

// App Wide Components
import AppButton from "./components/AppButton.vue";
import AppCountInput from "./components/AppCountInput.vue";
import AppModalOverlay from "./components/AppModalOverlay.vue";

//Init Pinia
const pinia = createPinia();
pinia.use(PiniaHistoryPlugin);

// Init App
const app = createApp(App);
app
  .use(pinia)
  .use(FontAwesomePlugin)
  .component("AppButton", AppButton)
  .component("AppCountInput", AppCountInput)
  .component("AppModalOverlay", AppModalOverlay)
  .mount("#app");

app.config.errorHandler = (error) => {
  console.log("%c CUSTOM UNCAUGHT", "color: orange", error);
};
