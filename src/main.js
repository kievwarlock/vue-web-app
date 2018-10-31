import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import BootstrapVue from 'bootstrap-vue'
import ApiPhpService from "@/api/php/api.service";
import ApiService from "@/api/main/api.service";
import * as VueGoogleMaps from 'vue2-google-maps'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import GmapCluster from 'vue2-google-maps/dist/components/cluster' // replace src with dist if you have Babel issues

Vue.component('GmapCluster', GmapCluster)



ApiService.init();
ApiPhpService.init();

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCvC5__rcAbE0UAoVWTOREpJq6xkhY75to',
        libraries: 'places', // This is required if you use the Autocomplete plugin
        // OR: libraries: 'places,drawing'
        // OR: libraries: 'places,drawing,visualization'
        // (as you require)

        //// If you want to set the version, you can do so:
        // v: '3.26',
    },
    disableDefaultUI: true,
    mappedProps: {
        routeIndex: { type: Number },
        options: { type: Object },
        panel: { },
        directions: { type: Object },
        disableDefaultUI: true,
        //// If you have a property that comes with a `_changed` event,
        //// you can specify `twoWay` to automatically bind the event, e.g. Map's `zoom`:
        // zoom: {type: Number, twoWay: true}
    },
    //// If you intend to programmatically custom event listener code
    //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
    //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
    //// you might need to turn this on.
    // autobindAllEvents: false,

    //// If you want to manually install components, e.g.
    //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
    //// Vue.component('GmapMarker', GmapMarker)
    //// then disable the following:
    // installComponents: true,
})

Vue.use(BootstrapVue);
Vue.config.productionTip = false




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

});


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
