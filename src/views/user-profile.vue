<template>
    <div class="home">
        <div class="container">
            <h1> User profile</h1>

            <hr>


            <div class="profile-form" >

                <div class="row">

                    <div class="col-xs-12 col-sm-6">
                        <div>
                            <h4><b>Phone:</b> {{userData.phoneNumber}}</h4>
                            <b-img rounded="circle" blank width="75" height="75" blank-color="#777" alt="img" class="m-1" />
                            <p>Avatar ID:   {{userData.avatarId}}</p>
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
                       <p>
                           <b>Full name: </b>{{userData.fullName}}
                       </p>


                    </div>

                </div>

            </div>


        </div>





    </div>
</template>

<script>

    import {UserService} from "@/api/main/api.service.js";

    export default {

        data(){
           return {
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