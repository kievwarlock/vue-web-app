//import {AdminMarkerService} from "@/api/php/api.service";
import {UserService,profileBaseController} from "@/api/main/api.service";
import JwtService from "@/api/main/jwt.service";


const state = {
    markers:{}
};

const getters = {
    Markers(state) {
        return state.markers;
    },
    MarkersPosition ( state ){

        let markers = [];

        if( Object.keys(state.markers).length > 0 ){
            for (let item of state.markers ) {
                markers.push({
                    lat: item.latitude,
                    lng: item.longitude,
                })
            }
        }
        return markers;
    }
};

const actions = {

    setMarkers(context){
        return new Promise( (resolve, reject)=> {

            if (JwtService.getToken()) {

                context.dispatch('setPreloader', true );
                profileBaseController.getAll()
                    .then(({data}) => {

                         console.log('data markers:', data);
                         context.commit('setMarkers', data);
                         resolve(data);
                         context.dispatch('setPreloader', false );



                    })
                    .catch(({response}) => {
                        reject('NO markers data ' + response);
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