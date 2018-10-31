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
               <router-link :to="'profile/'+infoWindowProp.infoContent"> Profile ID: {{infoWindowProp.infoContent}}</router-link>
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
                    infoWindowPos: null,
                    infoWinOpen: false,
                },

                center: {lat: 45.508, lng: -73.587},
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
            },
            onMarkerClick(marker, index ){
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
            geolocate: function () {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });
            }

        }
    };
</script>

<style>
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