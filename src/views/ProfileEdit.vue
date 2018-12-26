<template>
    <div class="profile-page">

        <div class="profile-page-header">



            <image-cropper></image-cropper>

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
                    to="profile"
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


</template>

<script>

    import {UserService, LocaleService, topicController, profileWallController} from "@/api/main/api.service.js";
    import ImageCropper from "@/components/ImageCropper.vue";


    export default {
        components: {ImageCropper},
        data() {
            return {
                columnWidth: 200,
                profileWall: [],
                formData: {},
                local: [],
                visibleStatus: [
                    {value: 'true', text: 'Visible'},
                    {value: 'false', text: 'Hidden'},
                ],
                topic: {}
            }
        },
        async mounted() {
            await this.getTopics();
            await this.getUserData();
            await this.getLocale();
        },
        methods: {
            async loadMore() {

                let lastItemId = this.profileWall[this.profileWall.length - 1].id;

                try {
                    let wall = await profileWallController.getProfileWall(this.formData.id, lastItemId);
                    if (wall.data.length > 0) {
                        for (let wallItem of wall.data) {
                            this.profileWall.push(wallItem);
                        }
                    } else {
                        alert('Больше нет постов!');
                    }

                } catch (e) {
                    console.log('ErrorgetProfileWall:', e);
                }
            },
            updateGridWidth(width) {
                this.columnWidth = width;
                this.$refs.gridWall.update();
                //console.log('Wall:', this.$refs.gridWall );
            },
            timeConverter(UNIX_timestamp) {
                let a = new Date(UNIX_timestamp);
                let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                let year = a.getFullYear();
                let month = months[a.getMonth()];
                let date = a.getDate();
                let hour = a.getHours();
                let min = a.getMinutes();
                let sec = a.getSeconds();
                let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
                return time;
            },
            async getTopics() {
                try {
                    let topics = await topicController.getTopic();
                    for (let topicItem of topics.data) {
                        this.topic[topicItem.id] = topicItem.text;
                    }
                } catch (e) {
                    console.log('Error get topics!', e);
                }


            },
            async getLocale() {
                let dataLocal = await LocaleService.getLocalList();
                this.local = dataLocal.data;
            },
            async getUserData() {
                let data = await Object.assign({}, this.$store.getters.currentUser);
                this.formData = data;
                this.getProfileWall(data.id);
            },
            onSubmit() {
                this.$store.dispatch('updateUser', this.formData).then( () => {
                    this.$router.push('/profile')
                })
            },
            async getProfileWall(profileId) {
                try {
                    let wall = await profileWallController.getProfileWall(profileId);
                    this.profileWall = wall.data;
                } catch (e) {
                    console.log('ErrorgetProfileWall:', e);
                }

            }
        }

    }
</script>


<style scoped>


</style>
<style>

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
        padding: 25px;
        border-radius: 10px;
        display: inline-block;
        box-shadow: 2px 2px 10px 1px #ccc;
    }

    .profile-avatar img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
    }

    .user-avatar {

    }


</style>