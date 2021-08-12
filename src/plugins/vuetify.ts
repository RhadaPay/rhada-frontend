import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  // adjust global themes here
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.lightGreen.base,
      },
      dark: {
        primary: colors.deepOrange,
        secondary: colors.grey.darken4,
      },
    },
  },
});
