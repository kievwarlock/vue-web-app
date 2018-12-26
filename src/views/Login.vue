<template>
    <div class="login-page">
        <div class="login-page-inner" v-if="isAuthenticated === false ">
            <h1>Login page</h1>
            <div class="form-login">

                <v-form v-if="users">

                    <v-select
                            prepend-icon="person"
                            :items="users"
                            required
                            v-model="form.user"
                    ></v-select>

                    <v-btn color="error" @click="onSelectUser">
                        Login
                    </v-btn>


                </v-form>
            </div>
        </div>
        <div class="logout-page-inner" v-if="isAuthenticated">
            <h1> Do you want logout ?</h1>

            <router-link to="/Logout">
                <v-btn color="error">Logout</v-btn>
            </router-link>
        </div>


    </div>

</template>


<script>

    import {AdminUsersService} from "@/api/php/api.service";
    import {UserService} from "@/api/main/api.service";

    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                users: [],
                form: {
                    user: '',
                },

            }
        },
        mounted() {
            this.getUsers();
        },
        computed: {

            ...mapGetters({
                isAuthenticated: 'isAuthenticated',
                usersList: 'MapUsers',
            }),


        },
        methods: {

            async getUsers() {
                this.users = await this.$store.dispatch('getUsersList');
            },
            getToken(phoneNumber, activationCode) {

                //TODO: after CORS change api request
                let userId = this.usersList[this.form.user].id;
                this.$store.dispatch('loginUser', {
                    phoneNumber,
                    activationCode,
                    userId
                })
                    .then(() => {
                        this.$router.push('/profile')
                    })
                    .catch(error => (console.log(' getToken error ' + error)))

            },

            onSelectUser() {

                UserService.getActivationCode(this.form.user).then((response) => {
                    if (!response.data.activationCode) {
                        throw 'no activationCode'
                    }
                    if (response.data.activationCode) {
                        this.getToken(this.form.user, response.data.activationCode)
                    }

                }).catch(error => (
                    console.log('getUsers ERROR', error)
                ))


            },

        }
    }
</script>

<style>
    .login-page {
        max-width: 500px;
        width: 100%;
        margin: 10px auto;
    }
</style>