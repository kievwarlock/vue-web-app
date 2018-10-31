<template>
    <div class="home">
        <div class="container">
            <br>
            <h1> User profile</h1>
            <div class="image">
                {{this.avatar}}
            </div>
            <hr>
            <b-form @submit.prevent="onSubmit" class="profile-form" >

                <div class="row">

                    <div class="col-xs-12 col-sm-6">
                        <div>
                            <h4><b>Phone:</b> {{formData.phoneNumber}}</h4>
                            <img :src="'data:image/jpg;base64,'+ avatar"  v-if="avatar" alt="">

                            <b-img v-if="!avatar"  rounded="circle" blank width="75" height="75" blank-color="#777" alt="img" class="m-1" />

                            <p>Avatar ID:   {{formData.avatarId}}</p>
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

        methods: {
            setUserData(){

                return this.$store.dispatch('getUserData').then( data => {
                        this.formData = data;
                        if( data.avatarId){
                            UserService.getAvatar(data.avatarId).then( avatar => {
                                if( avatar.status == 200 ){

                                    //console.log(avatar );

                                    /*//let imageBase64 = new Buffer(avatar.data, 'binary').toString('base64');
                                    var reader = new FileReader();
                                    reader.readAsDataURL(avatar.data);
                                    console.log('reader', reader);
                                    reader.onload = function () {
                                        console.log('GOOD:',reader.result);
                                    };
                                    reader.onerror = function (error) {
                                        console.log('Error: ', error);
                                    };

                                    this.avatar = imageBase64;*/

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


<style scope>

    .profile-form {
        max-width: 800px;
        margin:0 auto;
    }

</style>