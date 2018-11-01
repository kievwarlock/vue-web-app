<template>
    <div class="map-container">

        <div class="map-search">

                <gmap-autocomplete class="map-search-input" @place_changed="setSearch" >
                </gmap-autocomplete>
                <button class="map-search-button btn btn-success" @click="searchOnMap">Search</button>

        </div>

        <gmap-map
                :center="center"
                :zoom="9"
                class="gmap-map-block"

                :options="{disableDefaultUI:true}"

        >

            <gmap-info-window :options="infoWindowProp.infoOptions" :position="infoWindowProp.infoWindowPos" :opened="infoWindowProp.infoWinOpen" @closeclick="infoWindowProp.infoWinOpen=false">


                <div class="marker-info-window">

                    <div class="marker-info-window-loaded"
                        v-if="infoWindowProp.infoData"
                        >

                        <div class="marker-info-window-inner">
                            <div class="marker-info-window-avatar">
                                <img :src="infoWindowProp.avatar" v-if="infoWindowProp.avatar"  class="marker-info-window-avatar-image" alt="">
                            </div>
                            <div class="marker-info-window-user">

                                <p>Name: <strong>{{infoWindowProp.infoData.fullName}}</strong></p>
                                <p>Locale: <strong>{{infoWindowProp.infoData.locale}}</strong></p>
                                <p>City: <strong>{{infoWindowProp.infoData.city}}</strong></p>

                                <router-link :to="'profile/'+infoWindowProp.infoContent">
                                    <button class="btn btn-xs btn-success">View profile</button>
                                </router-link>
                            </div>
                        </div>





                    </div>
                    <div class="marker-info-window-preloader" v-else>
                            <h2>Loading...</h2>
                    </div>
                </div>


            </gmap-info-window>

            <gmap-cluster
                    :zoom-on-click="true"
                    @click="onClusterClick">
                <gmap-marker
                        :key="index"
                        v-for="(m, index) in markers"
                        :position="{
                            lat:m.latitude,
                            lng:m.longitude,
                        }"
                        @click="onMarkerClick(m,index )"
                ></gmap-marker>

            </gmap-cluster>
        </gmap-map>
    </div>
</template>

<script>

    import {UserService} from "@/api/main/api.service.js";

    export default {
        name: "GoogleMap",
        data() {
            return {


                infoWindowProp:{
                    infoOptions: {
                        pixelOffset: {
                            width: 0,
                            height: -35
                        }
                    },
                    currentMidx: null,
                    infoContent:'',
                    avatar: false,
                    infoData:false,
                    infoWindowPos: null,
                    infoWinOpen: false,
                },

                center: {
                    lat: 50.401699,
                    lng: 30.252512
                },
                markers: [],
                search:'',

            };
        },

        mounted() {

            this.geolocate();
            this.getMarkers();

        },
        methods: {
            onClusterClick(e){
               console.log('onClusterClick', e);
            },
            toggleInfoWindow( marker, idx ) {

                this.infoWindowProp.infoWindowPos = {
                    lat: marker.latitude,
                    lng: marker.longitude,
                };

                this.infoWindowProp.infoContent = marker.ownerId;

                //check if its the same marker that was selected if yes toggle
                if (this.infoWindowProp.currentMidx == idx) {
                    this.infoWindowProp.infoWinOpen = !this.infoWindowProp.infoWinOpen;
                }
                //if different marker set infowindow to open and reset current marker index
                else {
                    this.infoWindowProp.infoWinOpen = true;
                    this.infoWindowProp.currentMidx = idx;
                }


                this.getUserData( marker.ownerId )
                    .then( data => {

                        this.infoWindowProp.infoData = data;

                        if( data.avatarId ){

                            UserService.getAvatar( data.avatarId )
                                .then( (avatar ) => {

                                    if( avatar.status == 200){

                                        let reader = new FileReader();
                                        reader.onload = e => {
                                            this.infoWindowProp.avatar =  e.target.result;
                                        };
                                        reader.readAsDataURL(avatar.data);

                                    }else{
                                        throw 'avatar.status not 200!'
                                    }

                                })
                                .catch((error) => {
                                    console.log('getUserAvatar error', error);
                                });


                        }

                    })
                    .catch( error => {
                        console.log(' Get user profile error', error);
                    })


            },

            onMarkerClick(marker, index ){

                this.infoWindowProp.avatar = false;
                this.infoWindowProp.infoData = false;
                this.toggleInfoWindow( marker, index );
                this.setCenter( {
                    lat: marker.latitude,
                    lng: marker.longitude,
                });
            },

            getMarkers(){
                let markers = this.$store.getters.Markers;
                if( Object.keys(markers).length > 0 ){
                    this.markers = markers;
                }else{
                    this.setMarkers();
                }

            },

            setMarkers() {
                return this.$store.dispatch('setMarkers').then(data => {
                    if (data.status === true) {
                        this.markers = data.data;
                    }
                }).catch(error => {
                    console.log('getMarkers error', error);
                })
            },

            setCenter(place) {
                this.center = place;
            },

            setSearch(search){
                this.search = search;
            },

            searchOnMap(){
                let search = this.search;
                let center = {
                    lat: search.geometry.location.lat(),
                    lng: search.geometry.location.lng()
                }
                this.center = center;
                console.log('Search click', search);
            },




            getUserData( profileId){

                return UserService.getUserProfile( profileId )
                    .then(({data}) => {
                        return data;
                    })
                    .catch(({error}) => {
                        console.log('get user error', error);
                    });

            },


            geolocate: function () {
                navigator.geolocation.getCurrentPosition( position => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });
            },


        }
    };
</script>

<style scoped>
    .marker-info-window-inner {
        display: flex;
        padding: 5px;
    }
    .marker-info-window-avatar-image{
        display: block;
        width:90px;
        height:90px;
    }
    .marker-info-window-avatar {
        display: block;
        background: #ccc;
        width:90px;
        height:90px;
    }
    .marker-info-window-user {
        padding-left: 10px;
        text-align: left;
    }
    .marker-info-window-user p {
        margin-bottom: 7px;

    }
    .marker-info-window-user .btn {
        padding: 2px 5px;
        font-size: 12px;
    }
    .marker-info-window-user p b{

    }
    .map-container {
        position: relative;
    }
    .map-search {
        position: absolute;
        top:0;
        right:0;
        z-index: 10;
        padding: 5px;
        display: flex;
    }
    .map-search-input {
        background: rgba(255, 255, 255, 0.9);
        padding: 5px 10px;
        border-radius: 3px;
        border:1px solid #ccc;
        border: 1px solid #28a745;
    }
    .map-search-button {

    }
    .gmap-map-block {
        width:100%;
        height: calc(100vh - 56px);
    }
</style>