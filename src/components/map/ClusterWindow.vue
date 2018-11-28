<template>
    <div class="cluster-window" v-show="!loading">

        <p>
            Loading:{{loading}}
        </p>


        <div class="marker-info-window-slider">
            <swiper :options="swiperOption" >
                <!-- slides -->
                <swiper-slide v-for="sliderItem of markersData">

                    <div class="inner-slider">
                        <div class="marker-info-window-inner">
                            <div class="marker-info-window-avatar">
                                <img :src="sliderItem.avatar" v-if="sliderItem.avatar"  class="marker-info-window-avatar-image" alt="">
                            </div>
                            <div class="marker-info-window-user">

                                <p>Name: <strong>{{sliderItem.fullName}}</strong></p>
                                <p>Locale: <strong>{{sliderItem.locale}}</strong></p>
                                <p>City: <strong>{{sliderItem.city}}</strong></p>

                                <a>
                                    <button class="btn btn-xs btn-success">View profile</button>
                                </a>
                            </div>
                        </div>

                    </div>

                </swiper-slide>

                <div v-if="markersData.length > 1" >
                    <div class="swiper-pagination" slot="pagination"></div>
                    <div class="swiper-button-prev" slot="button-prev"></div>
                    <div class="swiper-button-next" slot="button-next"></div>
                </div>


            </swiper>

            <div class="window-info-bottom">
                <div class="btn btn-success" @click="watchAll()"> Read more ({{markers.length}}) </div>
            </div>
        </div>
    </div>
</template>

<script>


    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    import {UserService} from "@/api/main/api.service.js";

    export default {
        name: 'ClusterWindow',
        data(){
          return {
              maxDataSize:2,
              markersData: [],
              loading:false,
              swiperOption: {

                  effect: 'flip',
                  grabCursor: true,
                  pagination: {
                      el: '.swiper-pagination',
                      type: 'progressbar'
                  },
                  nextButton:'.swiper-button-next',
                  prevButton:'.swiper-button-prev',
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


<style scoped>
    .marker-info-window-slider {
        max-width: 300px;
        width:100%;
    }
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
</style>
