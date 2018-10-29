import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        adminUsersList: '',
        user: {
            phoneNumber: '',
            token: '',
            activationCode:''
        },
        preloader: false,
    },
    mutations: {
        setAdminUsers(state, users) {
            state.adminUsersList = users;
        },
        set(state, {key, value}) {
            state[key] = value
        },
        setUserNumber( state, number){
            state.user.phoneNumber = number
        },
        setUserToken( state, token){
            state.user.token = token
        },
    },
    actions: {

        setLoader({commit}, value) {
            commit('set', {
                key: 'preloader',
                value: value
            })
        },
        setAdminUsersList({commit}) {
          /*  commit('set', {
                key: 'preloader',
                value: true
            });*/
           /* axios
                .get(
                    'http://webdata-v2/api/get-users/', {
                        headers: {
                            Authorization: '3bad8293-cb72-454f-a52c-9f9aa3d2e3cc',
                        }
                    })
                .then((response) => {

                    if (response.data.status === false) {
                        throw response.data.error
                    }
                    commit('setAdminUsers', response.data.data);

                }).catch(error => (
                     console.log('getUsers ERROR', error)
                )).finally(() => {

                   /!* commit('set', {
                        key: 'preloader',
                        value: false
                    });*!/
                })
*/

        }
    }
})
