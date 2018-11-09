import PhpApiService from "@/api/php/api.service";
import PhpJwtService from "@/api/php/jwt.service";
import ApiService, {UserService} from "@/api/main/api.service";
import JwtService from "@/api/main/jwt.service";
import { AdminUsersService } from "@/api/php/api.service";
import { preloadBehavior } from "@/store/actions";

const state = {
    user: {},
    avatar:false,
    isAuthenticated: !!JwtService.getToken()
};

const getters = {
    currentUser(state) {
        return state.user;
    },
    currentUserAvatar(){
        return state.avatar;
    },
    isAuthenticated(state) {
        return state.isAuthenticated;
    }
};


const actions = {



    loginUser: preloadBehavior( (context, { phoneNumber, activationCode, userId } ) => {

        //TODO  userId have to delete

        return new Promise((resolve, rejected) => {

            UserService.getToken( {
                activationCode: activationCode,
                phoneNumber: phoneNumber
            } )
                .then(( {data} ) => {

                    if( data.authToken ){

                        JwtService.saveUserId( userId );
                        JwtService.saveToken( data.authToken );  // Set token

                        context.dispatch('addNotifications', {
                            text:'Wellcome to gether app !',
                            timer: '2000',
                        });
                        resolve();

                    }else{
                        throw('Token response status error!');
                    }

                }).catch( error => {

                    context.dispatch('addNotifications', {
                        text:' Response status error:' + error,
                        type: 'danger'
                    })
                    rejected('Response status error !'+ error )

            })



        });


    }),



    checkAuthUser(context){

        return new Promise((resolve) => {

            if (JwtService.getToken()) {

                ApiService.setHeader();

                UserService.getUserProfile( JwtService.getUserId() )
                    .then( ({data}) => {
                        context.commit('setAuthUser', data);
                        if( data.avatarId ){
                            context.dispatch( 'setUserAvatar', data.avatarId );
                        }
                        resolve();
                    })
                    .catch(error => {

                        context.dispatch('addNotifications', {
                            text:'User token error! Please login again' + error,
                            type: 'danger',
                        });
                        context.commit('purgeAuthUser');
                        resolve();
                    });

            } else {
                context.commit('purgeAuthUser');
                resolve();
            }

        })


    },


    /*registerUser(context, credentials) {
        /!* return new Promise((resolve, reject) => {
             ApiService.post("users", { user: credentials })
                 .then(({ data }) => {
                     context.commit(SET_AUTH, data.user);
                     resolve(data);
                 })
                 .catch(({ response }) => {
                     context.commit(SET_ERROR, response.data.errors);
                     reject(response);
                 });
         });*!/
    },*/


    logoutUser(context) {
        context.commit('purgeAuthUser');
    },


    updateUser: preloadBehavior( (context, payload) => {

        const {id, fullName, phoneNumber, city, locale, avatarId,  visible} = payload;

        const userData = {
            fullName,
            city,
            locale,
            avatarId,
            visible
        };


        return ApiService.put("profile/" + id, userData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then( ( {data} ) => {

            context.commit('setAuthUser', data);
            context.dispatch('addNotifications', {
                text:'Update success ',
                timer: 3000,
            });

        }).catch(error => {

            context.dispatch('addNotifications', {
                text:'Update error! ' + error ,
                type: 'danger',
            });

        })

    }),


    uploadAvatar: preloadBehavior( (context, formData) => {

        return UserService.setAvatar(formData)
            .then( ( {data} ) => {
                if( data.avatarId ){
                    context.dispatch('setUserAvatar', data.avatarId );
                    context.dispatch('addNotifications', {
                        text:'Upload avatar success ',
                        timer: 3000,
                    });
                }
            })
            .catch(error => {
                context.dispatch('addNotifications', {
                    text:'Upload avatar error '+ error,
                    timer: 3000,
                    type:'danger'
                });
            })

    }),

    setUserAvatar( context, avatarId ){

        return UserService.getAvatar( avatarId )
            .then( ( {data} )=> {

                let reader = new FileReader();
                reader.onload = e => {
                    return context.commit('setUserAvatar', e.target.result);
                };
                reader.readAsDataURL(data);

            }).catch(error => {
                console.log('Avatar error', error);
            })

    },

};

const mutations = {

    setUserAvatar( state, avatar ){
        state.avatar = avatar;
    },
    setUserData(state, user) {
        state.user = user;
    },
    setAuthUser(state, user) {
        state.isAuthenticated = true;
        state.user = user;
        state.errors = {};
    },
    purgeAuthUser(state) {
        state.isAuthenticated = false;
        state.user = {};
        state.errors = {};
        JwtService.destroyToken();
    }
};



export default {
    state,
    actions,
    mutations,
    getters,
};