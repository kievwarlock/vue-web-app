

const state = {
    notifications: [
    /*    {

            showDismissibleAlert:true,
            dismissCountDown: 5000,
            type:'success',
            text:'This alert will dismiss after seconds...'
        },
        {

            showDismissibleAlert:true,
            dismissCountDown: 0,
            type:'success',
            text:'SSSSSS This alert will dismiss after seconds...'
        },
        {
            showDismissibleAlert:true,
            dismissCountDown: 4000,
            type:'success',
            text:'This alert will '
        },
        {
            showDismissibleAlert:true,
            dismissCountDown: 3000,
            type:'danger',
            text:'This alert will ERROR!! '
        }*/
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
    addNotifications(state, {text, type = 'success', timer = 0 }) {
        state.notifications.push(
            {
                showDismissibleAlert:true,
                dismissCountDown: timer,
                type:type,
                text:text
            }
        );
    },
    removeNotifications(state, index) {
        state.notifications[index].showDismissibleAlert = false;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};