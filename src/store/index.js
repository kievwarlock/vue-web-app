import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth.module";
import geo from "./geo.module";
import tag from "./tag.module";
import adminUsers from "./admin-users.module";
import notification from "./notification.module.js";

Vue.use(Vuex);



export default new Vuex.Store({
    strict: true,
    state: {
        preloader: false,
    },
    modules: {
        notification,
        adminUsers,
        auth,
        geo,
        tag
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
    },

});