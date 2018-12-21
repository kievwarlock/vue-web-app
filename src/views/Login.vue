<template>
    <div class="about">
        <div class="container"  v-if="isAuthenticated === false ">
            <h1>Login page</h1>
            <div class="form-login"  >

                <b-form
                        v-if="adminUsersList"
                        @submit.prevent="onSelectUser"
                >
                    <b-form-group
                            label="Select user:"
                            label-for="exampleInput3">
                        <b-form-select id="exampleInput3"
                                       :options="adminUsersList"
                                       required
                                       v-model="form.user">
                        </b-form-select>
                    </b-form-group>
                    <b-button type="submit" variant="primary">Login</b-button>
                </b-form>
            </div>
        </div>
        <div class="container" v-if="isAuthenticated" >
            <h1>  Hello user</h1>
            <router-link to="/Logout">
                <b-button variant="primary">Logout</b-button>
            </router-link>

        </div>


    </div>

</template>


<script>

    import { AdminUsersService } from "@/api/php/api.service";
    import { UserService } from "@/api/main/api.service";

    import { mapGetters } from 'vuex'

    export default {
        data () {
            return {
                form: {
                    user: '',
                },

            }
        },
        mounted(){
            this.$store.dispatch('getUsersList');
        },
        computed:{

            ...mapGetters({
                isAuthenticated: 'isAuthenticated',
                adminUsersList:'AdminUsers',
                usersList: 'MapUsers',
            }),


        },
        methods: {


            getToken( phoneNumber, activationCode ){

                //TODO: after CORS change api request
                let userId = this.usersList[this.form.user].id;
                this.$store.dispatch('loginUser', {
                    phoneNumber,
                    activationCode,
                    userId
                })
                .then( () => {
                    this.$router.push('/profile')
                } )
                .catch( error => ( console.log(' getToken error ' + error ) ) )

            },

            onSelectUser(){

                UserService.getActivationCode( this.form.user ).then((response) => {
                    if( !response.data.activationCode ){
                        throw 'no activationCode'
                    }
                    if( response.data.activationCode ){
                      this.getToken( this.form.user, response.data.activationCode )
                    }

                }).catch( error => (
                    console.log('getUsers ERROR', error)
                ))


            },

        }
    }
</script>