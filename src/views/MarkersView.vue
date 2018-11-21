<template>

    <div class="markers-block" v-if="markers">
        <h1>Total points: {{markers.length}}</h1>
        <p class="fixed-block">
            loading status:{{loading}} <br>
            Total: {{totalCountMarkers}}<br>
            currentPage: {{currentPage}}<br>
            TotalLoaded: {{countLoadedMarkers}}<br>

        </p>

        <div class="loader" v-if="loading">

        </div>
        <div class="markers">
            <div class="marker-item"
                 v-for="(item, index) of markersData"
                 :ket="index"
            >
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <div class="profile-avatar">
                            <img :src="item.avatar" v-if="item.avatar" alt="" class="user-avatar">
                            <img v-if="!item.avatar" alt="" class="user-avatar-placeholder">
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 text-left">
                        <p>
                            Phone: {{item.phoneNumber}}
                        </p>
                        <p>
                            Name: {{item.fullName}}
                        </p>
                        <p>
                            locale: {{item.locale}}
                        </p>
                        <p>
                            City: {{item.city}}
                        </p>
                        <p>
                            Status: {{item.visible}}
                        </p>
                    </div>
                </div>


            </div>
        </div>
    </div>


</template>

<script>

    //import HelloWorld from '@/components/HelloWorld.vue'
    import {UserService} from "@/api/main/api.service.js";


    export default {
        name: 'markersPoint',
        data() {
            return {
                currentPage: 0,
                countPerPage: 10,
                markersData: []
            }
        },
        props: {
            markers: Array
        },
        computed:{
            loading(){
                return this.countPerPage * this.currentPage !== this.countLoadedMarkers
            },
            countLoadedMarkers(){
                return this.markersData.length;
            },
            totalCountMarkers(){
                return this.markers.length
            },
        },
        mounted() {

            if (this.markers && this.markers.length > 0) {
                this.getDataProfiles();
                this.scroll();
            } else {
                this.$router.push({
                    name: 'map',
                });
            }

        },
        methods: {

            getUserData(profileId) {

                return UserService.getUserProfile(profileId)
                    .then(({data}) => {
                        return data;
                    })
                    .catch(({error}) => {
                        console.log('get user error', error);
                    });

            },
            getUserAvatar(avatarId) {

                return new Promise((resolve, reject) => {
                    UserService.getAvatar(avatarId)
                        .then((avatar) => {

                            if (avatar.status == 200) {

                                let reader = new FileReader();
                                reader.onload = e => {
                                    return resolve(e.target.result);
                                };
                                reader.readAsDataURL(avatar.data);

                            } else {
                                throw 'avatar.status not 200!'
                            }

                        })
                        .catch((error) => {
                            reject('error:', error)
                            console.log('getUserAvatar error', error);
                        });
                })


            },
            getDataProfiles() {
                console.log('START GET DATA');

                this.currentPage++;

                for ( let item = this.countLoadedMarkers; item < this.countLoadedMarkers + this.countPerPage; item++) {

                //for (let marker of this.markers) {

                    let marker = this.markers[item];

                    if (marker.type == 'PROFILE') {

                        this.getUserData(marker.ownerId)
                            .then(data => {
                                let ownerData = data;

                                if (data.avatarId) {

                                    this.getUserAvatar(data.avatarId)
                                        .then(avatar => {
                                            ownerData.avatar = avatar;
                                            this.markerFrom++;
                                            this.markersData.push(ownerData);
                                        })
                                        .catch(error => {
                                            console.log(' Get user avatar error', error);
                                        })

                                } else {
                                    this.markerFrom++;
                                    this.markersData.push(ownerData);
                                }

                            })
                            .catch(error => {
                                console.log(' Get user profile error', error);
                            })
                    }

                }


            },
            scroll () {
                window.onscroll = () => {
                    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

                    if( bottomOfWindow ){
                        this.getDataProfiles();
                    }

                };
            },
        },

    }
</script>

<style scoped>


    .loader {
        position: fixed;
        z-index: 2000;
        top:0;
        right:0;
        width:100%;
        height:100%;
        background: rgba(255, 255, 255, 0.5);
    }

    .fixed-block {
        position: fixed;
        z-index: 100;
        top:0;
        right:0;
        background: #fff;
        border:1px solid #ccc;
        padding: 10px;
        color:#000;

    }
    .markers-block {

    }

    .markers {

    }

    .marker-item {
        padding: 10px;
        margin: 10px;
        border: 1px solid #ccc;
    }

    .marker-item-user-avatar {
        max-width: 300px;
    }

    .marker-item-user-avatar img {
        max-width: 100%;
        height: auto;
    }

</style>
