<template>
    <div class="about">
        <div class="container"  v-if="isAuthenticated === false ">
            <h1>Login page</h1>
            <div class="form-login"  >

                <b-form
                        v-if="adminUsersList.length > 0"
                        @submit="onSelectUser"
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



    export default {
        data () {
            return {
                adminUsersList:{},
                form: {
                    user: '',
                },
                usersList:{},
            }
        },
        mounted(){
            this.getUsersList();
        },
        computed:{
            isAuthenticated(){
                return this.$store.getters.isAuthenticated;
            },
        },
        methods: {


            getUsersList(){
                AdminUsersService.get()
                    .then(({ data }) => {
                        if( data.status === true ){
                            this.adminUsersList = this.mapSelectList(data.data);
                            this.usersList = this.mapUserList(data.data);
                        };
                    })
                    .catch(error => {
                        throw new Error(error);
                    })

            },
            mapUserList( adminUsersList ){

                let returnSelectUsers = [];
                for( let val of adminUsersList){
                    returnSelectUsers[val.phoneNumber] = val;
                }
                return returnSelectUsers;
            },
            mapSelectList( adminUsersList ){

                let returnSelectUsers = [];
                for( let val of adminUsersList){
                    returnSelectUsers.push(
                        {
                            text: val.fullName + ' ' + val.phoneNumber,
                            value: val.phoneNumber
                        }
                    )
                }
                return returnSelectUsers;
            },

            getToken( phoneNumber, activationCode ){

                AdminUsersService.getToken( phoneNumber, activationCode )
                    .then((response) => {

                        if (response.status == 200 && response.data.status === true ) {
                            let token =  response.data.data;
                            let userData = this.usersList[this.form.user];
                            userData['token'] = token;


                            Promise.all( [ this.$store.dispatch('loginUser', userData ) ] )
                                .then( response => {
                                    this.$router.push('/')
                                }
                                ).catch(error => {
                                console.log('Promise all error:', error);
                            })

                        }else{
                            throw 'no Token'
                        }

                    }).catch( error => (
                        console.log('Get token ERROR', error)
                ))

            },

            onSelectUser(evt){

                evt.preventDefault();

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