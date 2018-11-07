

const state = {
    notifications: [
        {

            showDismissibleAlert:true,
            dismissCountDown: 2,
            type:'success',
            text:'This alert will dismiss after seconds...'
        },
        {
            showDismissibleAlert:true,
            dismissCountDown: 2,
            type:'success',
            text:'This alert will '
        },
        {
            showDismissibleAlert:true,
            dismissCountDown: 2,
            type:'danger',
            text:'This alert will ERROR!! '
        }
    ],
};

const getters = {
    Notifications(state) {
        return state.notifications;
    },
};

const actions = {

    addNotifications( {commit} , notification ){
        commit('addNotifications', notification )
    },
    removeNotifications( {commit}, index ){
        commit('removeNotifications', index )
    },
    dismissCountChange( {commit} , payload  ){
        commit('countChange', payload )
    }

};

const mutations = {
    countChange(state , {count, index }){
        state.notifications[index].dismissCountDown = count;
    },
    addNotifications(state, {text, type }) {
        state.notifications.push(
            {
                showDismissibleAlert:true,
                dismissCountDown: 2,
                type:type,
                text:text
            }
        );
    },
    removeNotifications(state, index) {
        state.notifications.splice( index,  1  );
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};