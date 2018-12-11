<template>
    <div class="map-container">


        <div class="map-search" >

                <gmap-autocomplete class="map-search-input" @place_changed="setSearch" >
                </gmap-autocomplete>
                <button class="map-search-button btn btn-success" @click="searchOnMap">Search</button>

        </div>

        <gmap-map

                ref="mapRef"
                :center="center"

                :zoom="9"
                class="gmap-map-block"

                :options="{
                    clickableIcons:false,
                    disableDefaultUI:true,
                    gestureHandling:'greedy',
                }"

        >

            <gmap-info-window   :options="infoWindowProp.infoOptions" :position="infoWindowProp.infoWindowPos" :opened="infoWindowProp.infoWinOpen" @closeclick="closeInfoWindow">

                <div class="marker-info-window">

                    <div v-if="sliderData.length > 0 ">
                        <cluster-window :markers="sliderData" v-if="sliderData.length > 0"  />
                    </div>

                </div>

            </gmap-info-window>



            <gmap-cluster
                    :zoom-on-click="true"
                    @click="onClusterClick">



                    <gmap-marker
                            ref="theMarker"
                            :key="index"
                            v-for="(m, index) in markers"
                            :myData="index"
                            :options="m"
                            :position="{
                                lat:m.latitude,
                                lng:m.longitude,
                            }"
                         
                            :animation="4"
                            @click="onMarkerClick( $event , m, index)"
                    >

                    </gmap-marker>


            </gmap-cluster>
        </gmap-map>


    </div>
</template>

<script>



    import {UserService} from "@/api/main/api.service.js";
    import ClusterWindow from "@/components/map/ClusterWindow.vue";


    export default {

        name: "GoogleMap",
        components:{
            ClusterWindow
        },
        data() {
            return {
                sliderData:[],
                map:'',
                infoWindowProp:{
                    infoOptions: {
                        maxWidth:200,
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

                search:'',

            };
        },
        mounted(){
            this.$store.dispatch('setMarkers');
        },

        computed:{

            markers(){
                return this.$store.getters.Markers;
            },

        },

        methods: {
            closeInfoWindow(){
                this.infoWindowProp.infoWinOpen=false ;
                this.sliderData = [];
            },
            setHeatmap(){
                this.$store.dispatch('setMarkers').then( ({data}) => {

                    let mapData = [];

                    for( let val of data ){
                        mapData.push(
                            new google.maps.LatLng(val.latitude, val.longitude)
                        )
                    }

                    let heatmap = new google.maps.visualization.HeatmapLayer({
                        data:mapData,
                        map: this.$refs.mapRef.$mapObject
                    });
                    heatmap.set('opacity', 0.5);
                    heatmap.set('radius', 120);
                    let gradient = [
                        'rgba(0, 255, 255, 0)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(0, 191, 255, 1)',
                        'rgba(0, 127, 255, 1)',
                        'rgba(0, 63, 255, 1)',
                        'rgba(0, 0, 255, 1)',
                        'rgba(0, 0, 223, 1)',
                        'rgba(0, 0, 191, 1)',
                        'rgba(0, 0, 159, 1)',
                        'rgba(0, 0, 127, 1)',
                        'rgba(63, 0, 91, 1)',
                        'rgba(127, 0, 63, 1)',
                        'rgba(191, 0, 31, 1)',
                        'rgba(255, 0, 0, 1)'
                    ];
                    heatmap.set('gradient', gradient );

                    //console.log('mapData', mapData);

                });
            },
            mapLoad(){
                this.$refs.mapRef.$mapPromise.then((map) => {

                    //this.geolocate();
                    //this.getMarkers();

                })
            },

            onClusterClick(e){
                this.closeInfoWindow();
                let zoom = e.map_.getZoom();
                e.markerClusterer_.zoomOnClick_ = true;

                if( zoom == 22 ){

                    e.markerClusterer_.zoomOnClick_ = false;


                    this.sliderData = [];
                    this.setCenter( {
                        lat: e.center_.lat(),
                        lng: e.center_.lng(),
                    });

                    this.infoWindowProp.infoWindowPos = {
                        lat: e.center_.lat(),
                        lng: e.center_.lng(),
                    }

                    let markers = e.getMarkers();
                    let markersArray = [];
                    for( let marker of markers){

                        markersArray.push({
                            type:marker.type,
                            ownerId:marker.ownerId,
                        })

                    }
                    this.infoWindowProp.infoWinOpen = true;
                    setTimeout( ()=> {
                        this.sliderData = markersArray;
                    }, 10);


                    /* let markers = e.getMarkers()

                     let markersArray = [];
                     for( let marker of markers){

                         markersArray.push({
                             type:marker.type,
                             ownerId:marker.ownerId,
                         })

                     }

                     this.$router.push({
                         name: 'markers',
                         params: {
                             markers: markersArray
                         }
                     });*/



                }


            },


            toggleInfoWindow(  marker, idx ) {


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


                this.sliderData = [
                    {
                        type:marker.type,
                        ownerId:marker.ownerId,
                    }
                ];



            },

            onMarkerClick(event, marker, index ){

                this.toggleInfoWindow( marker, index );
                this.setCenter( {
                    lat: marker.latitude,
                    lng: marker.longitude,
                });

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


<style>

    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-in .5s reverse;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
<style scoped>


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