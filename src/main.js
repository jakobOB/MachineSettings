import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import ToastService from 'primevue/toastservice';

import ConfirmationService from 'primevue/confirmationservice';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Tooltip from 'primevue/tooltip';
import DialogService from 'primevue/dialogservice';

// Custom CSS
import './style.css'
import Nora from '@primeuix/themes/nora';

import Button from "primevue/button";
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'
import Card  from 'primevue/card'
import Divider  from 'primevue/divider'
import Listbox from 'primevue/listbox'
import {Toast} from "primevue";

const app = createApp(App);

const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(PrimeVue, {
    theme: {
        preset: Nora
    }
});
app.use(ToastService)
app.use(DialogService);
app.use(ConfirmationService);

app.component('Button', Button);
app.component('Card', Card);
app.component('Divider', Divider);
app.component('InputNumber', InputNumber);
app.component('Listbox', Listbox);
app.component('Select', Select);
app.component('Slider', Slider);
app.component('Toast', Toast);

app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.mount('#app');