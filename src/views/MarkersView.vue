<template>

    <div class="markers-block" v-if="markers">
        <h1>Total points : {{markers.length}}</h1>

        <!--<p class="fixed-block">
            loading status:{{loading}} <br>
            Total: {{totalCountMarkers}}<br>
            TotalLoaded: {{countLoadedMarkers}}<br>
            END: {{endLoad}}<br>
            ERROR: {{error}} <br>

        </p>-->


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

            <div class="loader-content" v-if="loading">
                <img src="../assets/gif-preloader.gif" >
            </div>

        </div>
    </div>


</template>

<script>


    import {UserService} from "@/api/main/api.service.js";


    export default {
        name: 'markersPoint',
        data() {
            return {
                error:'',
                loading: false,
                countPerPage: 5,
                markersData: []
            }
        },
        props: {
            markers: Array
        },
        computed:{

            endLoad(){
                return this.totalCountMarkers == this.countLoadedMarkers;
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
                let rangeCount = '';

                // TODO if throw error - do some in UI
                // If count per page bigger than total count markers
                if ( ( this.totalCountMarkers - this.countLoadedMarkers ) >   this.countPerPage  ) {
                    rangeCount = this.countLoadedMarkers + this.countPerPage;
                }else{
                    rangeCount = this.countLoadedMarkers + (this.totalCountMarkers - this.countLoadedMarkers) ;
                }


                for ( let item = this.countLoadedMarkers; item < rangeCount; item++) {

                    let pointPromise = new Promise( ( resolve, reject ) => {

                        let marker = this.markers[item];

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
                                this.error += 'get user error' + error + ' || ';
                                reject( 'get user error', error);
                            });

                    })

                    allPromisePoint.push( pointPromise  );

                }

                this.loading = true;
                Promise.all( allPromisePoint )
                    .then( data => {
                        for( let marker of data) {
                            this.markersData.push(marker);
                        }
                    }).catch( error => {
                        this.error += 'All promise ERROR' + error + ' || ';
                        console.log('All promise ERROR:',error);
                    }).finally( () => this.loading = false );




            },



            scroll () {

                window.onscroll = () => {

                    let scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
                    let bottomOfWindow = false;

                    if( (scrollHeight + window.innerHeight) >= document.documentElement.offsetHeight ){
                        bottomOfWindow = true;
                    }else{
                        bottomOfWindow = false;
                    }

                    if( bottomOfWindow && this.endLoad === false && this.loading === false ){
                        this.getDataProfiles();
                    }

                };
            },
        },

    }
</script>




<style scoped>


    .loader-content {
        position: relative;
        padding: 10px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loader-content img{
        width: 140px;
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
