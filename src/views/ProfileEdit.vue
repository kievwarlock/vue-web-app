<template>
    <v-container>
        <div class="profile-page edit">

        <div class="profile-page-header" v-if="formData">

            <div class="profile-page-header-avatar-edit">
                <div class="profile-page-header-avatar-upload" >
                    <image-upload-item
                            @changeBlob="changeAvatar"
                            :props="{
                                item:'image1',
                                index:0,
                                sort:0,
                                url:avatarUrl
                            }"
                    ></image-upload-item>
                </div>
            </div>

            <!--<image-cropper></image-cropper>-->

            <div class="profile-page-header-info edit">



                <div class="profile-page-header-info-item">
                    <i class="material-icons">
                        contact_phone
                    </i>
                    <span>
                         <b>{{formData.phoneNumber}}</b>
                    </span>
                </div>
                <div class="profile-page-header-info-item">
                    <i class="material-icons">
                        person
                    </i>
                    <span>
                         <v-text-field
                                 v-model="formData.fullName"
                                 label="Full name"
                                 required
                         ></v-text-field>
                    </span>
                </div>

                <div class="profile-page-header-info-item">
                    <i class="material-icons">
                        person_pin
                    </i>
                    <span>
                       <v-text-field
                               v-model="formData.city"
                               label="City"
                               required
                       ></v-text-field>
                    </span>
                </div>
                <div class="profile-page-header-info-item">
                    <i class="material-icons">
                        language
                    </i>
                    <span>
                        <v-select
                                v-model="formData.locale"
                                :items="local"
                                label="Locale"
                        ></v-select>
                    </span>
                </div>

            </div>
            <v-btn

                    small
                    dark
                    fab
                    color="success"
                    @click="onSubmit"
            >
                <v-icon>save</v-icon>
            </v-btn>
            <v-btn
                    v-if="formData.id"
                    :to="{ name:'profile', params: { id: formData.id} }"
                    small
                    absolute
                    dark
                    fab
                    top
                    left
                    color="success"

            >
                <v-icon>arrow_back</v-icon>
            </v-btn>
        </div>


    </div>
    </v-container>

</template>

<script>

    import {UserService, LocaleService} from "@/api/main/api.service.js";
    import ImageUploadItem from '@/components/ImageUploadItem.vue'


    export default {
        components: {ImageUploadItem},
        data() {
            return {
                imageAvatar:'',
                avatarUpdate:false,
                formData: {},
                local: [],
                visibleStatus: [
                    {value: 'true', text: 'Visible'},
                    {value: 'false', text: 'Hidden'},
                ],
                topic: {}
            }
        },
        computed:{
          avatarUrl(){
              let src = '';
              if( this.formData.avatarId ){
                  src = this.$urlManager.getAvatarUrl(this.formData.avatarId, 'original' );
              }
              return src;
          }
        },
        async mounted() {
            await this.getUserData();
            await this.getLocale();
        },
        methods: {

            uploadAvatar() {

                return new Promise((resolve, reject) => {

                    let formData = new FormData();

                    formData.append('avatar', this.imageAvatar );

                    this.$store.dispatch('uploadAvatar', formData )
                        .then( () => {
                            resolve();
                        }).catch( () => {
                            reject();
                        });
                });


            },
            changeAvatar(item, blob) {
                this.avatarUpdate = true;
                this.imageAvatar = blob;
            },

            async getLocale() {
                let dataLocal = await LocaleService.getLocalList();
                this.local = dataLocal.data;
            },
            async getUserData() {
                let data = await Object.assign({}, this.$store.getters.currentUser);
                this.formData = data;
            },
            async onSubmit() {

                if( this.avatarUpdate && this.imageAvatar ){
                    await this.uploadAvatar();
                }
                this.$store.dispatch('updateUser', this.formData)
                    .then( () => {
                        this.$router.push('/profile')
                        this.avatarUpdate = false;
                    })
            },

        }

    }
</script>


<style>
    .profile-page-header-avatar-edit {
        max-width: 200px;
        margin: 10px auto;
    }
    .profile-page-header-avatar-upload {
        width: 100%;
        padding-bottom: 100%;
        position: relative;
    }
    .profile-page.edit .profile-avatar img {
        max-width: 200px;
        width:100%;
        height: 200px;
        display: block;
        margin: 0 auto;
    }
    .profile-page-header-info.edit {
        background: #fff;
        color:#222;
    }
    .v-responsive {
        height: auto !important;
    }

    .v-carousel {
        height: auto !important;
    }

    .profile-wall-content-card-date {
        color: #ccc;
        font-size: 9px;
        display: flex;
        align-items: center;
        text-align: left;
        padding: 5px 0px;
        text-transform: uppercase;
    }

    .profile-wall-content-card-date i {
        font-size: 12px;
    }

    .profile-wall-content-card-date span {
    }

    .profile-wall-content-card-topics {
        border-top: 1px solid #ccc;
        padding: 10px;
        margin-top: 10px;
    }

    .profile-wall-content-card-inner {
        padding: 5px 10px;
    }

    .profile-wall-content-card-text {
        text-align: left;
        color: #555;
        font-size: 12px;
        line-height: 1.3;
        max-height: 43px;
        overflow: hidden;
        margin: 10px 0px;
    }

    .profile-wall-content-card-info {
        display: flex;
        justify-content: space-between;
    }

    .profile-wall-content-card-info span {
        font-size: 12px;
    }

    .profile-wall-content-card-info i {
        font-size: 12px;

    }

    .profile-wall-content-card-info-item {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ccc;
    }

    .profile-wall-content-card-topic {
        background: #ccc;
        border-radius: 5px;
        display: inline-block;
        margin: 4px;
        padding: 2px 10px;
        font-size: 12px;
        color: #fff;
    }



    .profile-wall-content-card-images {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }

    .profile-wall-content-card-image {
        max-width: 100%;
        height: auto;
        display: block;
    }

    .profile-wall-item {
        padding: 10px;

    }

    .add-post:hover {
        text-decoration: none;
    }

    .profile-wall {
        padding: 0px;
        max-width: 600px;
        margin: 10px auto;
        margin-bottom: 50px;
    }

    .user-avatar-placeholder {
        background: #ccc;
    }

    .profile-avatar {
      /*  padding: 25px;
        border-radius: 10px;
        display: inline-block;
        box-shadow: 2px 2px 10px 1px #ccc;*/
    }



    .user-avatar {

    }


</style>