import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios";
import VueAxios from "vue-axios";
import VueSession from "vue-session";

axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

const options = {
    persist: true
};
Vue.use(VueSession, options);

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
    console.log("guard")
    console.log("from", from.name)
    console.log("to", to.name)
    console.log("user", localStorage.getItem("user"))

    // redirige l'utilisateur sur la page de login si il n'est pas connecté
    const loggedIn = !!localStorage.getItem("user")
    if (!loggedIn && to.name !== 'login' && to.name !== 'redirect') {
        next('/login')
    } else {
        next()
    }
})

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
