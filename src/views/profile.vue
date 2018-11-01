<template>
    <div class="home">
        <div class="container">
            <br>
            <h1> User profile</h1>

            <hr>
            <b-form @submit.prevent="onSubmit" class="profile-form" >

                <div class="row">

                    <div class="col-xs-12 col-sm-6">
                        <div>
                            <h4><b>Phone:</b> {{formData.phoneNumber}}</h4>
                            <div class="profile-avatar">
                                <img :src="avatar"  v-if="avatar" alt="" class="user-avatar">
                                <img  v-if="!avatar" alt="" class="user-avatar-placeholder">
                            </div>
                        </div>
                    </div>

                   <div class="col-xs-12 col-sm-6">
                        <b-form-group label="Full name:" class="text-left">
                            <b-form-input
                                          type="text"
                                          v-model="formData.fullName"
                                          required
                                          placeholder="Full name">
                            </b-form-input>
                        </b-form-group>

                        <b-form-group label="City:" class="text-left">
                            <b-form-input
                                    type="text"
                                    v-model="formData.city"
                                    required
                                    placeholder="City">
                            </b-form-input>
                        </b-form-group>

                        <b-form-group label="Locale:" class="text-left">
                            <b-form-select v-model="formData.locale" :options="local" class="mb-3" />
                        </b-form-group>



                        <b-form-group label="Visible:" class="text-left">
                            <b-form-select v-model="formData.visible" :options="visibleStatus" class="mb-3" />
                        </b-form-group>




                        <b-form-group  class="text-right">
                            <b-button type="submit" variant="success">Update profile</b-button>
                        </b-form-group>


                    </div>

                </div>

            </b-form>

        </div>





    </div>
</template>

<script>

    import {UserService} from "@/api/main/api.service.js";

    export default {
        data(){
          return {
              formData:{
              },
              avatar:false,
              local: [
                  { value: 'de', text: 'DE' },
                  { value: 'us', text: 'US' },
                  { value: 'fr', text: 'FR' },
                  { value: 'es', text: 'ES' },
                  { value: 'it', text: 'IT' },
                  { value: 'ru', text: 'RU' },
              ],
              visibleStatus: [
                  { value: 'true', text: 'Visible' },
                  { value: 'false', text: 'Hidden' },
              ]
          }
        },

         mounted () {
            this.setUserData()
        },
        computed:{
           getAvatar(){
               return this.avatar;
           }
        },
        methods: {
            setUserData(){

                return this.$store.dispatch('getUserData').then( data => {
                        this.formData = data;
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
                }).catch( error => {
                    console.log('setUserData error', error);
                })
            },

            onSubmit(){
                this.$store.dispatch('updateUser', this.formData);
            }
        }

    }
</script>


<style>

    .user-avatar-placeholder {
        background: #ccc;
    }
    .profile-avatar {
        padding: 25px;
        border-radius: 10px;
        display: inline-block;
        box-shadow: 2px 2px 10px 1px #ccc;
    }
    .profile-avatar img{
        width:200px;
        height:200px;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
    }
    .user-avatar {

    }
    .profile-form {
        max-width: 800px;
        margin:0 auto;
    }

</style>