import {AdminMarkerService} from "@/api/php/api.service";
import {UserService} from "@/api/main/api.service";
import JwtService from "@/api/main/jwt.service";


const state = {
    markers:{}
};

const getters = {
    Markers(state) {
        return state.markers;
    },
};

const actions = {

    setMarkers(context){
        return new Promise( (resolve, reject)=> {

            if (JwtService.getToken()) {

                this.dispatch('setPreloader', true );
                AdminMarkerService.get()
                    .then(({data}) => {
                        if( data.status === true ){

                            context.commit('setMarkers', data.data);
                            resolve(data);
                            this.dispatch('setPreloader', false );

                        }else{
                            reject('Get markers error - ' + data.error);
                        }

                    })
                    .catch(({response}) => {
                        reject('NO markers data' + response);
                    });
            }else{
                    reject('NO data');
            }
        });
    },



};

const mutations = {
    setMarkers(state, markers) {
        state.markers = markers;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};