import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';

import App from './App.vue';
import { router } from './router';

// Vuetify
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#F8F8F8',
    surface: '#fff',
    primary: '#456882',
    secondary: 'rgb(105 105 105)',
    error: '#d0494d',
    info: '#2196F3',
    success: '#4CAF50', // rgb(103 124 102)
    warning: '#EA9C27',
    iconBg: '#f2f2f2',
    title: 'rgb(105 105 105)',
  },
};

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#1E1E1E',
    surface: '#2C2C2C',
    primary: '#466472',
    secondary: 'rgb(80 80 80)',
    error: '#FF8A80',
    info: '#40C4FF',
    success: '#81C784',
    warning: '#FFD54F',
    iconBg: '#424242',
    title: '#b0b0b0',
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: myCustomLightTheme,
      dark: myCustomDarkTheme,
    },
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount('#app');
