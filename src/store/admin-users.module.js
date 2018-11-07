import {AdminUsersService} from "@/api/php/api.service";


// TODO:  mapUserList have to delete after ID will be in response authorization

const state = {
    adminUserList:{},
    mapUserList:{},

};

const getters = {
    AdminUsers(state) {
        return state.adminUserList;
    },
    MapUsers(state){
        return state.mapUserList;
    }
};

const actions = {


    getUsersList( content ){

        return new Promise( ( resolve, rejected) => {

            content.dispatch('setPreloader', true);

            AdminUsersService.get()
                .then(({ data }) => {
                    if( data.status === true ){

                        let adminUsersList = data.data.map(function(name) {
                            return {
                                text: name.fullName + ' ' + name.phoneNumber,
                                value: name.phoneNumber
                            };
                        });
                        let mapSelectUsers = {};
                        for( let val of data.data){
                            mapSelectUsers[val.phoneNumber] = val;
                        }
                        content.commit('setUserList',adminUsersList )
                        content.commit('setMapUserList', mapSelectUsers )
                        resolve();

                    };
                })
                .catch(error => {
                    throw new Error(error);
                    rejected();
                })
                .finally( () => {
                    content.dispatch('setPreloader', false);
                })
        });

    },


};

const mutations = {
    setUserList(state, list) {
        state.adminUserList = list;
    },
    setMapUserList( state, list ){
        state.mapUserList = list;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};