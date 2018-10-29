import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ApiPhpService from "@/api/php/api.service";
import ApiService from "@/api/main/api.service";

ApiService.init();
ApiPhpService.init();


/*
import { AdminUsersService } from "@/api/php/api.service";
AdminUsersService.get()
    .then(({ data }) => {
        console.log(  data ) ;
    })
    .catch(error => {
        throw new Error(error);
    });*/

Vue.use(BootstrapVue);

Vue.config.productionTip = false


// Ensure we checked auth before each page load.
/*
router.beforeEach((to, from, next) => {
    return Promise.all([store.dispatch('checkAuthUser')]).then(next);
});
*/
// Ensure we checked auth before each page load.
/*router.beforeEach((to, from, next) => {
    console.log('First');
    //return Promise.all([store.dispatch(CHECK_AUTH)]).then(next);
});*/

router.beforeEach( (to, from, next ) => {

    Promise.all([store.dispatch('checkAuthUser')])
        .then(response => {

                if (to.path != '/login') {
                    if (store.getters.isAuthenticated === true) {
                        console.log('Auth true');
                        next();
                    } else {
                        console.log('Auth false! go to login');
                        next('login');
                    }
                } else {
                    console.log('You are on the login page!');
                    next(); // This is where it should have been
                }
            }
        ).catch(error => {
        console.log('Promise all error:', error);
    })

    /*
    if(to.path != '/login') {
        if( store.getters.isAuthenticated === true ) {
            console.log('Auth true');
            next();
        } else {
            console.log('Auth false! go to login');
            next('login');
        }
    } else {
        console.log('You are on the login page!');
        next(); // This is where it should have been
    }*/

});


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
