import PhpApiService from "@/api/php/api.service";
import PhpJwtService from "@/api/php/jwt.service";
import ApiService, {UserService} from "@/api/main/api.service";
import JwtService from "@/api/main/jwt.service";


const state = {
    errors: null,
    user: {},
    //isAuthenticated:false
    isAuthenticated: !!JwtService.getToken()
};

const getters = {
    currentUser(state) {
        return state.user;
    },
    isAuthenticated(state) {
        return state.isAuthenticated;
    }
};

const actions = {
    userData(context) {
        UserService.getUserProfile(JwtService.getUserId())
            .then(({data}) => {
                console.log('setAuthUser TRUE');
                context.commit('setAuthUser', data);
            })
            .catch(({response}) => {
                console.log('SET_ERROR loginUser');
            });

    },
    loginUser(context, data) {

        if (data.token && data.id) {
            JwtService.saveUserId(data.id);
            JwtService.saveToken(data.token);
            ApiService.setHeader();
            UserService.getUserProfile(JwtService.getUserId())
                .then(({data}) => {
                    context.commit('setAuthUser', data);
                })
                .catch(({response}) => {
                    console.log('SET_ERROR loginUser');
                });

        }


        /*console.log('loginUser');
        JwtService.saveToken(token);
        ApiService.setHeader();
        context.commit( 'setAuthUser', {
            'name': 'Sergey'
        });*/

        /*return new Promise(resolve => {
            ApiService.post("users/login", { user: credentials })
                .then(({ data }) => {
                    context.commit(SET_AUTH, data.user);
                    resolve(data);
                })
                .catch(({ response }) => {
                    context.commit(SET_ERROR, response.data.errors);
                });
        });*/
    },
    logoutUser(context) {
        context.commit('purgeAuthUser');
    },
    registerUser(context, credentials) {
        /* return new Promise((resolve, reject) => {
             ApiService.post("users", { user: credentials })
                 .then(({ data }) => {
                     context.commit(SET_AUTH, data.user);
                     resolve(data);
                 })
                 .catch(({ response }) => {
                     context.commit(SET_ERROR, response.data.errors);
                     reject(response);
                 });
         });*/
    },
    checkAuthUser(context) {

        if (JwtService.getToken()) {
            ApiService.setHeader();
            UserService.getUserProfile(JwtService.getUserId())
                .then(({data}) => {
                    context.commit('setAuthUser', data);
                })
                .catch(({response}) => {
                    console.log('SET_ERROR loginUser');
                });

        } else {
            context.commit('purgeAuthUser');
        }

        /*if (JwtService.getToken()) {
            ApiService.setHeader();
            ApiService.get("user")
                .then(({ data }) => {
                    context.commit(SET_AUTH, data.user);
                })
                .catch(({ response }) => {
                    context.commit(SET_ERROR, response.data.errors);
                });
        } else {
            context.commit(PURGE_AUTH);
        }*/
    },
    updateUser(context, payload) {
        /*const { email, username, password, image, bio } = payload;
        const user = {
            email,
            username,
            bio,
            image
        };
        if (password) {
            user.password = password;
        }

        return ApiService.put("user", user).then(({ data }) => {
            context.commit(SET_AUTH, data.user);
            return data;
        });*/
    }
};

const mutations = {
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