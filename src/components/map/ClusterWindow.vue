<template>
    <div class="cluster-window" v-if="!loading">

        <div class="info-windows-head">
            Some title marker
        </div>


        <div class="marker-info-window-slider">
            <swiper :options="swiperOption" >
                <!-- slides -->
                <swiper-slide v-for="sliderItem of markersData">


                    <div class="marker-info-window-inner">
                        <div class="marker-info-window-avatar">
                            <img :src="sliderItem.avatar" v-if="sliderItem.avatar"  class="marker-info-window-avatar-image" alt="">
                        </div>
                        <div class="marker-info-window-user">

                            <p>Name: <strong>{{sliderItem.fullName}}</strong></p>
                            <p>Locale: <strong>{{sliderItem.locale}}</strong></p>
                            <p>City: <strong>{{sliderItem.city}}</strong></p>

                            <router-link :to="'profile/'+sliderItem.id" class="more-link-to-profile">
                                View
                            </router-link>
                        </div>
                    </div>



                </swiper-slide>

                <div class="swiper-pagination" slot="pagination" v-if="markersData.length > 1"  ></div>
                <div class="swiper-button-prev" slot="button-prev" v-if="markersData.length > 1"></div>
                <div class="swiper-button-next" slot="button-next" v-if="markersData.length > 1"></div>




            </swiper>

            <div class="window-info-bottom" v-if="markersData.length > 1">
                <div class="window-info-bottom-all" @click="watchAll()"> Read more ({{markers.length}}) </div>
            </div>
        </div>
    </div>
</template>

<script>

    // TODO: add preloader content
    // TODO: add image placeholder
    // TODO: add custom style to info windows

    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    import {UserService} from "@/api/main/api.service.js";

    export default {
        name: 'ClusterWindow',
        data(){
          return {
              maxDataSize:4,
              markersData: [],
              loading:false,
              swiperOption: {

                  effect: 'flip',
                  grabCursor: true,
                  pagination: {
                      el: '.swiper-pagination'
                  },
                  navigation: {
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev'
                  }


              },

          }
        },

        mounted(){
            if ( this.markers && this.markers.length > 0) {
                this.getDataProfiles();
            }

            //this.initWindowClass();


        },
        props:{
            markers: Array,
        },
        components: {
            swiper,
            swiperSlide,
        },
        watch: {
            markers(newData) {
                if ( newData && newData.length > 0) {
                    this.getDataProfiles();
                }
            }
        },
        methods:{
            initWindowClass(){
                this.$nextTick( ()=> {
                    console.log('TRUE');
                    document.querySelector('.gm-style-iw').parentNode.className = 'gm-style-parent-style';
                })

            },
            watchAll(){
                this.$router.push({
                    name: 'markers',
                    params: {
                        markers: this.markers
                    }
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
            async getDataProfiles() {



                let allPromisePoint = [];


                for ( const item  in this.markers ) {

                    if( item == this.maxDataSize){
                        break
                    }

                    let marker = this.markers[item];

                    let pointPromise = new Promise( ( resolve, reject ) => {

                        UserService.getUserProfile(marker.ownerId)
                            .then( ( {data} ) => {


                                if( !data.avatarId ){
                                    resolve( data );
                                }else{

                                    this.getUserAvatar( data.avatarId )
                                        .then( ( avatarImage ) => {
                                            data.avatar = avatarImage;
                                            resolve( data );
                                        })
                                        .catch( error => {
                                            reject(error);
                                        });

                                }

                            })
                            .catch( ( error ) => {
                                reject( 'get user error', error);
                            });

                    })

                    allPromisePoint.push( pointPromise  );


                }


                this.loading = true;
                this.markersData = [];
                Promise.all( allPromisePoint )
                    .then( data => {
                        for( let marker of data) {
                            this.markersData.push(marker);
                        }
                    }).catch( error => {
                    console.log('All promise ERROR:',error);
                }).finally( () => this.loading = false );




            },


        }
    }
</script>

<!-- Map style info window-->
<style>

</style>

<style>
    .marker-info-window-slider .swiper-button-prev {
        left:0;
    }
    .marker-info-window-slider .swiper-button-next{
        right: 0;
    }
    .marker-info-window-slider .swiper-pagination {
        position: relative;
        text-align: center;
        -webkit-transition: 300ms opacity;
        -o-transition: 300ms opacity;
        transition: 300ms opacity;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        z-index: 10;
    }
    .marker-info-window-slider .swiper-pagination-bullet-active {
        opacity: 1;
        background: #17a2b8;
    }
    .marker-info-window-slider .swiper-pagination-bullet {
        width: 6px;
        height: 6px;
    }
    .marker-info-window-slider .swiper-button-prev, .swiper-button-next {
        position: absolute;
        top: 50%;
        width: 15px;
        height: 25px;
        margin-top: -22px;
        z-index: 10;
        cursor: pointer;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    .cluster-window {

    }

    .window-info-bottom-all:hover {
        background: #e67a7e;
        color: #fff;

    }
    .window-info-bottom-all {
        display: inline-block;
        background: #17a2b8;
        color: #fff;
        padding: 5px 10px;
        font-weight: bold;
        cursor: pointer;
    }
    .window-info-bottom {

    }
    .more-link-to-profile {

    }
    .info-windows-head {
        background: #ffffff;
        color: #17a2b8;
        font-size: 20px;
        font-weight: bold;
        padding: 10px;

        border-bottom: 1px solid #17a2b8;
        margin-bottom: 5px;
    }
    .gm-style-parent-style {
        box-shadow: 8px 7px 15px 3px rgba(0, 0, 0, 0.19);
    }
    .gm-style-parent-style > button {
        background: #e67a7e !important;
        border-radius: 50%;
        top: -15px !important;
        right: -14px !important;
        opacity: 1;
        display: -webkit-box !important;
        display: -ms-flexbox !important;
        display: flex !important;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 30px !important;
        height: 28px !important;
    }
    .gm-style-parent-style > button img {
        margin: 0 !important;
        width: 16px !important;
        height: 16px !important;
        opacity: 0.7;
    }

    .gm-style-parent-style div:nth-child(1) div:nth-child(1) {

    }
    .gm-style .gm-style-iw > div{
        display: block !important;
        max-width: 100% !important;
    }
    .gm-style .gm-style-iw {

        font-weight: 300;
        font-size: 13px;
        overflow: hidden;
        /* top: 5px !important;
       left: 0 !important;
        right: 0 !important;
        width: 100% !important;*/

    }
    .more-link-to-profile:hover {
        text-decoration: none;
        background: #28a745;
        color:#fff;
    }
    .more-link-to-profile {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 11px;
        background: #e67a7e;
        color: #fff;
        padding: 3px 10px;
        font-weight: bold;
        text-transform: uppercase;
    }
    .marker-info-window-slider {
        max-width: 300px;
        /*width:100%;*/
    }
    .marker-info-window-inner {
        padding: 10px 15px;

        position: relative;
    }
    .marker-info-window-avatar-image{
        display: block;
        width:90px;
        height:90px;
        border-radius: 10px;
    }
    .marker-info-window-avatar {
        display: block;
        background: #f9e7e7;
        width:90px;
        height:90px;
        margin: 0px auto;
        border-radius: 10px;

    }
    .marker-info-window-user {
        text-align: left;
        color: #000;
        padding: 5px;
        margin-top: 10px;
        border-top: 1px solid #17a2b8;
        font-size: 12px;
        border-bottom: 1px solid #17a2b8;
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
</style>
