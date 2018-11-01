import Vue from "vue";
import Vuex from "vuex";


import auth from "./auth.module";
import geo from "./geo.module";


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        preloader: false,
    },
    modules: {
        auth,
        geo,
    },
    actions:{
        setPreloader(state, visible ){
            state.commit('setPreloader', visible );
        }
    },
    mutations:{
        setPreloader(state, visible) {
            state.preloader = visible;
        },
    }
});