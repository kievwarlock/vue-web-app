import JwtService from "@/api/main/jwt.service";
import {topicController} from "@/api/main/api.service";

const state = {
    topics:[]
};

const getters = {
    AssociativeObjectTopics(state) {
        let newObject = {};
        if( state.topics.length ){
            for (let topicItem of state.topics) {
                newObject[topicItem.id] = topicItem.text;
            }
        }
        return newObject;
    }
};

const actions = {

    getTopics(context){
        return new Promise( (resolve, reject)=> {

            if (JwtService.getToken()) {
                topicController.getTopic()
                    .then( ( {data} ) => {
                        context.commit('setTopics', data);
                        resolve(data);
                    })
                    .catch(({response}) => {
                        reject('NO Topics data' + response);
                    });
            }else{
                reject('NO getToken data');
            }
        });
    },



};

const mutations = {
    setTopics(state, tags) {
        state.topics = tags;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};