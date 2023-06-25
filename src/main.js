import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase/firebase'
import BootstrapVueNext from 'bootstrap-vue-next'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import App from './App.vue'
import router from './router'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

library.add(faUserSecret)

import './assets/styles/form.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import "primevue/resources/themes/lara-light-indigo/theme.css";     
import "primevue/resources/primevue.min.css";

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ]
})
app.use(router)
app.use(BootstrapVueNext)
app.use(PrimeVue)
app.use(ToastService)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
