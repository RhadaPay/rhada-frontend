import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  // adjust global themes here
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.lightGreen.lighten3,
      },
      dark: {
        primary: colors.deepOrange,
        secondary: colors.grey.darken4,
      },
    },
  },
});
