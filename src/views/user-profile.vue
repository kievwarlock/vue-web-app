<template>
    <v-container>
        <div class="home">
        <div class="container">
            <h1> User profile</h1>
            <hr>


            <div class="profile-form" >

                <div class="row">

                    <div class="col-xs-12 col-sm-6">
                        <div>
                            <h4><b>Phone:</b> {{userData.phoneNumber}}</h4>
                            <div class="profile-avatar">
                                <img :src="avatar"  v-if="avatar" alt="" class="user-avatar">
                                <img  v-if="!avatar" alt="" class="user-avatar-placeholder">
                            </div>
                        </div>
                    </div>

                   <div class="col-xs-12 col-sm-6 text-left" >

                       <p>
                           <b>Full name: </b>{{userData.fullName}}
                       </p>
                       <p>
                           <b>City: </b>{{userData.city}}
                       </p>
                       <p>
                           <b>Locale: </b>{{userData.locale}}
                       </p>
                       <p>
                           <b>Visible: </b>{{userData.visible}}
                       </p>


                    </div>

                </div>

            </div>


        </div>





    </div>
    </v-container>
</template>

<script>

    import {UserService} from "@/api/main/api.service.js";

    export default {

        data(){
           return {
               avatar:false,
               userData:{}
           }
        },
        mounted () {
            this.setUserData()
        },

        methods: {



            setUserData(){

                UserService.getUserProfile( this.$route.params.id )
                    .then(({data}) => {

                        this.userData = data;
                        if( data.avatarId){
                            UserService.getAvatar(data.avatarId).then( avatar => {
                                if( avatar.status == 200 ){

                                    const reader = new FileReader();
                                    reader.onload = e => {
                                        this.avatar = e.target.result;
                                    };
                                    reader.readAsDataURL(avatar.data);

                                }
                            }).catch( error => {
                                console.log('Avatar error', error);
                            })
                        }

                    })
                    .catch(({error}) => {
                        console.log('get user error', error);
                    });

            },
            onSubmit(){
                this.$store.dispatch('updateUser', this.formData);
            }
        }

    }
</script>


<style scope>

    .profile-form {
        max-width: 800px;
        margin:0 auto;
    }

</style>