import PhpApiService from "@/api/php/api.service";
import PhpJwtService from "@/api/php/jwt.service";
import ApiService, {UserService} from "@/api/main/api.service";
import JwtService from "@/api/main/jwt.service";
import { AdminUsersService } from "@/api/php/api.service";

const state = {
    errors: null,
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


    loginUser(context, { phoneNumber, activationCode, userId } ) {

        //TODO  userId have to delete

        return new Promise((resolve, rejected) => {

            // TODO:  user: credentials Phone + code must be here

            // TODO: AdminUsersService - must rewrite to API server
            AdminUsersService.getToken( phoneNumber, activationCode )
                .then((response) => {

                    if (response.status == 200 && response.data.status === true ) {

                        JwtService.saveUserId(userId);
                        JwtService.saveToken( response.data.data );  // Set token
                        resolve();

                    }else{
                        rejected('Response status error!');
                    }

                }).catch( error => {
                    console.log('Response status error', error)
                    rejected('Response status error!'+ error )
                })

        });


    },


    checkAuthUser(context) {

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
                        console.log('User token error! Please login again', error);
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

    updateUser(context, payload) {

        const {id, fullName, phoneNumber, city, locale, visible} = payload;

        const userData = {
            fullName,
            city,
            locale,
            visible
        };
        //console.log('TOKEN', JwtService.getToken());
        //console.log('userData', userData);
        return ApiService.put("profile/" + id, userData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(({data}) => {
            console.log('RETURN DATA:', data);
        }).catch(error => {
            console.log('RETURN error:', error);
        });

    },

    uploadAvatar( context, formData ){
        return UserService.setAvatar(formData)
            .then( ( {data} ) => {
                if( data.avatarId ){
                    this.dispatch('setUserAvatar', data.avatarId );
                }
            })
            .catch(error => {
                console.log(' set Avatar error', error);

            });
    },

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
    setErrorUser(state, error) {
        state.errors = error;
    },
    setUserData(state, user) {
        state.user = user;
    },
    setAuthUser(state, user) {
        state.isAuthenticated = true;
        state.user = user;
        state.errors = {};
        //JwtService.saveToken(state.user.token);
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
    getters
};