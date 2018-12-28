<template>
    <div class="profile-page">

        <div class="profile-page-header">
            <div class="visible-status" :class="visibleStatusClass">
            </div>
            <div class="profile-page-header-avatar">
                <img v-if="userData.avatarId"
                     :src="`http://stage.gether.work:8010/avatar/preview/${userData.avatarId }`" alt="">
                <img v-else src="../assets/avatar-placeholder.png" alt="">
            </div>
            <div class="profile-page-header-info">
                <div class="profile-page-header-info-item">
                    <i class="material-icons">
                        person_outline
                    </i>
                    <span>
                        {{userData.fullName}}
                    </span>
                </div>
                <div class="profile-page-header-info-item">
                    <i class="material-icons">
                        person_pin
                    </i>
                    <span>
                        {{userData.city}}
                    </span>
                </div>
                <div class="profile-page-header-info-item">
                    <i class="material-icons">
                        language
                    </i>
                    <span>
                        {{userData.locale}}
                    </span>
                </div>

            </div>
            <v-btn
                    to="profile-edit"
                    small
                    absolute
                    dark
                    fab
                    top
                    left
                    color="pink"
            >
                <v-icon>edit</v-icon>
            </v-btn>
        </div>


        <v-tabs
                slot="extension"
                v-model="tabs"
                fixed-tabs
                color="transparent"
        >

            <v-tab href="#profileWallTab" class="primary--text">
                <v-icon>widgets</v-icon>
            </v-tab>

            <v-tab href="#eventWallTab" class="primary--text">
                <v-icon>view_carousel</v-icon>
            </v-tab>

            <v-tab href="#chanelWallTab" class="primary--text">
                <v-icon>event_available</v-icon>
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabs" class="white elevation-1">
            <v-tab-item id="profileWallTab">
                <v-card>
                    <v-card-text>

                        <div class="profile-wall" v-if="profileWall.length > 0">

                      <!--      <div class="profile-wall-view">
                                <v-btn @click="updateGridWidth(400)" color="error">Full width</v-btn>
                                <v-btn @click="updateGridWidth(110)" color="error">MultiCol</v-btn>

                            </div>
-->
                            <stack
                                    ref="gridWall"
                                    :column-min-width="columnWidth"
                                    :gutter-width="10"
                                    :gutter-height="10"
                                    :monitor-images-loaded="true"
                            >
                                <stack-item v-for="(contentCard, i) in profileWall" :key="i">
                                    <div class="profile-wall-content-card">


                                        <div class="profile-wall-content-card-video" v-if="contentCard.videoId">
                                            <div class="profile-wall-content-card-video-inner">
                                                <video
                                                        poster="../assets/videoplaceholder.jpg"
                                                        controls
                                                        preload="none"
                                                        :src="`http://stage.gether.work:8010/video/${contentCard.videoId}`" >
                                                    Your browser doesn't support HTML5 video tag.
                                                </video>
                                            </div>

                                        </div>
                                        <div class="profile-wall-content-card-image-single" v-if="contentCard.imageIds.length > 0">
                                            <img class="profile-wall-content-card-image"
                                                 :src="`http://stage.gether.work:8010/image/preview/${contentCard.imageIds[0] }`"
                                                 alt="">
                                        </div>
                                        <!-- <div class="profile-wall-content-card-images" v-if="contentCard.imageIds.length > 0">
                                             <v-carousel hide-controls hide-delimiters >
                                                 <v-carousel-item v-for="(imageId,i) of contentCard.imageIds"  :key="i" >
                                                         <img class="profile-wall-content-card-image" :src="`http://stage.gether.work:8010/image/preview/${imageId}`" alt="" >
                                                 </v-carousel-item>
                                             </v-carousel>
                                         </div>-->

                                        <div class="profile-wall-content-card-inner">


                                            <div class="profile-wall-content-card-text" v-show="!!contentCard.text">
                                                {{contentCard.text}}
                                            </div>

                                            <div class="profile-wall-content-card-info">
                                                <div class="profile-wall-content-card-info-item">
                                                    <i class="material-icons">
                                                        thumb_down_alt
                                                    </i>
                                                    <span>
                                            251
                                        </span>
                                                </div>
                                                <div class="profile-wall-content-card-info-item">
                                                    <i class="material-icons">
                                                        thumb_up_alt
                                                    </i>
                                                    <span>
                                            41
                                        </span>
                                                </div>
                                                <div class="profile-wall-content-card-info-item">
                                                    <i class="material-icons">
                                                        mode_comment
                                                    </i>
                                                    <span>
                                            12
                                        </span>
                                                </div>
                                            </div>
                                            <div class="profile-wall-content-card-date">
                                    <span>
                                        {{timeConverter(contentCard.creationTime)}}
                                    </span>
                                            </div>
                                        </div>
                                        <!--<div class="profile-wall-content-card-date" >
                                            <i class="material-icons">
                                                date_range
                                            </i>
                                            <span>
                                                {{timeConverter(contentCard.creationTime)}}
                                            </span>
                                        </div>-->
                                        <!-- <div class="profile-wall-content-card-topics" v-if="contentCard.topicIds.length > 0">
                                         <span class="profile-wall-content-card-topic" v-for="topicId of contentCard.topicIds">
                                             {{topic[topicId]}}
                                         </span>
                                         </div>-->


                                    </div>
                                </stack-item>
                            </stack>
                        </div>


                        <div class="add">
                        <v-btn @click="loadMore" color="error">Load more</v-btn>
                        </div>


                        <v-btn color="error"
                               class="add-post"
                               dark
                               fab
                               absolute
                               bottom
                               right to="/create-post"
                        >
                            <v-icon>add</v-icon>
                        </v-btn>


                    </v-card-text>
                </v-card>
            </v-tab-item>

            <v-tab-item id="eventWallTab">
                <v-card>
                    <v-card-text>
                        eventWallTab
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <v-tab-item id="chanelWallTab">
                <v-card>
                    <v-card-text>
                        chanelWallTab
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>





    </div>


</template>

<script>

    import {UserService, LocaleService, topicController, profileWallController} from "@/api/main/api.service.js";
    import ImageCropper from "@/components/ImageCropper.vue";
    import {Stack, StackItem} from 'vue-stack-grid';

    export default {
        components: {ImageCropper, Stack, StackItem},
        data() {
            return {
                tabs: null,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                columnWidth: 200,
                profileWall: [],
                userData: {},
                local: [],
                visibleStatus: [
                    {value: 'true', text: 'Visible'},
                    {value: 'false', text: 'Hidden'},
                ],
                topic: {}
            }
        },
        computed: {
            visibleStatusClass() {
                return (this.userData.visible) ? 'active' : '';
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
                    let wall = await profileWallController.getProfileWall(this.userData.id, lastItemId);
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
                this.userData = data;
                this.getProfileWall(data.id);
            },
            onSubmit() {
                this.$store.dispatch('updateUser', this.userData);
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


<style>

    .profile-page-header {
        position: relative;
        background: #2d3e50;
        padding: 25px 10px;
        margin-top: 10px;
    }

    .visible-status.active {
        background: lightgreen;
    }

    .visible-status {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #ccc;
    }

    .profile-page-header-avatar {
        max-width: 150px;
        margin: 10px auto;
        border-radius: 50%;
        overflow: hidden;
        border: 5px solid #ffffff;
    }

    .profile-page-header-avatar img {
        width: 100%;
        height: 100%;
        display: block;
    }

    .profile-page-header-info {

        background: #ff5252;
        max-width: 300px;
        margin: 10px auto;
        color: #fff;
        font-size: 12px;
    }

    .profile-page-header-info-item {
        display: flex;
        align-items: center;
        padding: 5px;
        border: 1px solid #2d3e50;
    }

    .profile-page-header-info-item i {
        font-size: 24px;
    }

    .profile-page-header-info-item span {
        font-size: 11px;
        display: inline-block;
        padding: 2px 10px;
        text-transform: uppercase;
        line-height: 1;
        width: 100%;
    }


</style>
<style>

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
    .v-card__text {
        padding: 5px;
    }
    .profile-wall-content-card {
        border-radius: 5px;
        box-shadow: 1px 1px 5px 1px #ccc;
        background: #fff;
        overflow: hidden;
    }
    .profile-wall-content-card-video {

    }
    .profile-wall-content-card-video-inner {
        position: relative;
        padding-bottom: 57%;
    }
    .profile-wall-content-card-video video {
        width:100%;
        height:100%;
        position: absolute;
        top:0;
        left:0;
        background: #2d3e50;
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