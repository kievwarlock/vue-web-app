<template>
    <div class="video-input">


        <div v-show="loadedScreenStatus"  >

            <canvas ref="canvas" class="video-screen-canvas" :class="rangeSlider.loading"></canvas>

            <div class="range-slider-container">
                <v-subheader class="pl-0">Выберите превью картинку</v-subheader>
                <v-slider
                        v-model="rangeSlider.currentTime"
                        :max="rangeSlider.max"
                        :min="rangeSlider.min"
                        :step="rangeSlider.step"
                        :always-dirty="true"
                        thumb-label="always"


                        @start="startChangeCurrentTime"
                        @end="endChangeCurrentTime"
                        @input="inputEvent"
                        @change="changeCurrentTime"

                ></v-slider>
            </div>

        </div>



        <div class="upload-block">
            <input type="file" class="file-upload-input" @change="inputFile" ref="fileinput" accept="video/*"/>
            <div class="upload-block-main">
                <div class="upload-block-main-info">
                    <b-alert show variant="primary" v-if="!filedata.name">
                        File not selected
                    </b-alert>
                    <b-alert show variant="success" v-if="filedata.name">
                        File selected !
                    </b-alert>
                </div>
                <div class="upload-block-main-btn btn btn-success">Upload</div>
            </div>
        </div>
        <div class="upload-block-info-video" v-show="!!videoPreview.url">
            <div >
                <div class="upload-clear-file btn btn-danger" @click="clearInput"> clear</div>
                <div class="upload-block-info-video-inner">
                    <video muted controls ref="fileVideo" id="videoid" @loadedmetadata="onLoadVideo"  @seeked="seekedEvent">
                        <source :src="videoPreview.url">
                        Your browser does not support HTML5 video.
                    </video>
                </div>
            </div>
        </div>
        <div class="upload-block-info" v-show="filedata.name" v-if="validation.errorStatus === false">
            <b-alert show class="upload-block-info-bottom" variant="success">
                File size: {{videoSize}} Mb <br>
                File name: {{filedata.name}} <br>
                File type: {{fileType}}
            </b-alert>
        </div>
        <div class="upload-error-validation" v-if="validation.errorStatus">
            <b-alert show variant="danger" v-for="error of validation.errorMsg">
                {{error}}
            </b-alert>
        </div>


    </div>

</template>

<script>

    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'



    export default {
        name: 'VideoInput',
        data() {
            return {
                rangeSlider:{
                    currentTime:0,
                    max:30,
                    min:0,
                    step:0.1,
                    loading:'loading',
                },
                loadedScreenStatus: false,
                videoScreensData: '',
                filedata: {},
                videoPreview: {
                    url: '',
                },
                validation: {
                    maxFileSize: {
                        value: 32,   // MB
                        errorMsg: ' File size more than 32mb',
                    },
                    validFileTypes: {
                        types: [
                            'video/mp4',
                            'video/webm',
                            'video/quicktime'
                        ],
                        errorMsg: ' File type not supported',
                    },
                    errorStatus: false,
                    errorMsg: []
                },


            }
        },
        components: {
            swiper,
            swiperSlide,
        },

        computed: {

            videoSize() {
                return parseFloat(this.filedata.size / 1024 / 1024).toFixed(2);
            },
            fileType() {
                return this.filedata.type;
            }
        },
        methods: {

            promiseSetTimeout( foo, time ){
                return new Promise( ( resolve, reject )=>{
                    setTimeout( ()=> {
                        try {
                            foo();
                            resolve();
                        } catch (err) {
                            reject('Error');
                        }
                    }, time)
                })
            },

            startChangeCurrentTime(e){
                this.rangeSlider.loading = 'loading';
            },
            inputEvent(){
                /*this.$refs.fileVideo.currentTime = this.rangeSlider.currentTime;
                this.updateCanvas();*/
            },
            endChangeCurrentTime(e){

            },
            changeCurrentTime(){
                this.$refs.fileVideo.currentTime = this.rangeSlider.currentTime;
                this.initUpdateCanvas();
                /* this.updateCanvas().then( () => {
                    this.rangeSlider.loading = '';
                });*/
            },



            updateCanvas(){


                return new Promise( ( resolve, reject )=> {

                    let video = this.$refs.fileVideo;
                    let canvas = this.$refs.canvas;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    let canvas2d = canvas.getContext('2d');

                    this.promiseSetTimeout( ()=>{
                        try {
                            if( video.readyState == 4 ){

                                this.promiseSetTimeout( ()=>{
                                    canvas2d.drawImage( video, 0, 0, video.videoWidth, video.videoHeight)
                                }, 200)
                                    .then( ()=> {
                                    resolve();
                                });


                            }else{
                                reject('Error');
                            }
                        } catch (err) {
                            reject('Error');
                        }
                    }, 100);

                });

            },
            initUpdateCanvas(){
                this.updateCanvas()
                    .then( () => {
                        this.loadedScreenStatus = true;
                        this.rangeSlider.loading = '';
                    }).catch( () => {
                        this.initUpdateCanvas()
                    });
            },
            seekedEvent(){
              console.log('seek');
            },
            onLoadVideo() {

                this.rangeSlider.max =  parseInt( this.$refs.fileVideo.duration );

                this.initUpdateCanvas();
               /* this.updateCanvas()
                    .then( () => {
                        alert('TRUUUE');
                        this.loadedScreenStatus = true;
                        this.rangeSlider.loading = '';
                    }).catch( () => {
                        this.updateCanvas()
                        alert('ERROR 1');
                    });*/

                /*this.promiseSetTimeout( ()=>{
                    this.updateCanvas();
                    this.loadedScreenStatus = true;
                }, 1000);
*/
/*

                return true;





                let duration = parseInt( video.duration );
                let diffSeconds = parseInt( duration / this.screenCount )
                alert('mut:' +  video.muted);
               /!* video.play().then( () => {
                    alert('TRUE');
                }).catch(()=>{
                    alert('111');
                });*!/
                alert('Before load');
                this.promiseSetTimeout( ()=>{
                    video.currentTime = 4;
                }, 1000 ).then( ()=> {
                    this.promiseSetTimeout( ()=>{
                        alert('CurrentState:'+video.readyState);
                        alert('CurrentTime:'+video.currentTime);

                        //this.addScreen();
                    }, 2000 ).catch( () => {
                        alert('ERROR3 ');
                    })
                }).catch( () => {
                    alert('ERROR2 ');
                })



                alert('width='+video.videoWidth);
                alert('height='+video.videoHeight);
                alert('duration='+duration);
                alert('maxI='+(this.screenCount));
                for (var i = 0; i <= (this.screenCount); i++) {
                    alert('loop'+i);
                    video.currentTime = i;
                    alert('TIME:' + video.currentTime);
                    await video.play()
                        .then( async () => {
                            video.pause();
                            alert('readyState'+video.readyState);
                            if (video.readyState == 4) {
                                canvas2d.drawImage(video, 0, 0, canvas.width, canvas.height);
                                this.videoScreensData.push(canvas.toDataURL("image/jpeg"))
                            } else {
                                await this.promiseSetTimeout( () => {
                                    canvas2d.drawImage( video, 0, 0, canvas.width, canvas.height);
                                    this.videoScreensData.push(canvas.toDataURL("image/jpeg"))
                                }, 500 );
                            }

                        })
                        .catch(() => {
                            console.log('Error!!!');
                        });

                    if ( this.videoScreensData.length == this.screenCount ) {
                        this.loadedScreenStatus = true;
                        this.$nextTick(() => {
                            const swiperTop = this.$refs.swiperTop.swiper
                            const swiperThumbs = this.$refs.swiperThumbs.swiper
                            swiperTop.controller.control = swiperThumbs
                            swiperThumbs.controller.control = swiperTop
                        })
                    }
                }*/



            },

            checkValidationError() {

                this.validation.errorMsg = [];
                this.validation.errorStatus = false;
                if (this.filedata.name) {
                    if (this.videoSize > this.validation.maxFileSize.value) {
                        this.validation.errorMsg.push(this.validation.maxFileSize.errorMsg + '; Your file size:' + this.videoSize + 'mb');
                    }

                    if (this.validation.validFileTypes.types.indexOf(this.fileType) == -1) {
                        this.validation.errorMsg.push(this.validation.validFileTypes.errorMsg);
                    }
                }

                // Return true if error exist
                this.validation.errorStatus = this.validation.errorMsg.length > 0;


            },
            createObjectURL(file) {

                return new Promise((resolve, reject) => {
                    if (window.webkitURL) {
                        resolve(window.webkitURL.createObjectURL(file));
                    } else if (window.URL && window.URL.createObjectURL) {
                        resolve(window.URL.createObjectURL(file));
                    } else {
                        reject('null');
                    }
                })

            },
            loadVideoPreview() {

                window.URL.revokeObjectURL(this.$refs.fileinput.files[0]);
                this.createObjectURL(this.$refs.fileinput.files[0])
                    .then((ObjectURL) => {
                        this.videoPreview.url = ObjectURL;
                        setTimeout(() => {
                            this.$refs.fileVideo.load();
                        }, 200);

                    })

            },
            inputFile(e) {

                this.videoPreview.url = '';
                if (e.target.files[0]) {

                    this.filedata = e.target.files[0];
                    this.checkValidationError();

                    if (this.validation.errorStatus === false) {
                        this.loadVideoPreview();
                    } else {
                        this.clearInput();
                    }

                } else {
                    this.clearInput();
                }

            },

            clearInput() {
                this.$refs.fileinput.value = '';
                this.filedata = {};
                this.videoPreview.url = '';
            },

        }

    }
</script>

<style scoped>

    .video-screen-canvas {
        width:100%;
        height:80%;
        margin: 10px auto;
        border:1px solid #ccc;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }
    .video-screen-canvas.loading {
        opacity: 0.5;
    }
    .range-slider-container {
        padding: 5px 15px;
    }
    .video-screen-canvas-image {
        width:100%;
        margin: 10px auto;
        border:1px solid #ccc;
    }
    .video-screen-canvas-image img {
        max-width: 100%;
        height:auto;
    }


    .success {
        background-color: #4caf50 !important;
        border-color: #4caf50 !important;
    }
    .swiper-slide-item img {
        width: 100%;
        max-width: 200px;
        height:auto;
        display: block;
        margin: 0 auto;
    }
    .gallery-top {
        height: 80%!important;
        width: 100%;
    }
    .gallery-thumbs {
        height: 20%!important;
        box-sizing: border-box;
        padding: 10px 0;
    }
    .gallery-thumbs .swiper-slide {
        width: 25%;
        height: 100%;
        opacity: 0.4;
    }
    .gallery-thumbs .swiper-slide-active {
        opacity: 1;
        border: 1px solid lightgreen;
    }


    .canvas {
        display: none;
    }

    .images-block {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }

    .image-video-screen-item {

        margin: 5px;
    }

    .image-video-screen-item img {
        max-width: 90px;
        height: auto;
        width: 100%;
    }

    .video-input {
        max-width: 400px;
        width: 100%;
        padding: 0px 10px;
    }

    .upload-block-info-bottom {
        max-width: 100%;
        overflow: hidden;
    }

    .upload-clear-file {
        position: absolute;
        top: 0;
        right: 0;
        margin: 5px;
        z-index: 20;
        opacity: 0.7;
    }

    .upload-clear-file:hover {
        opacity: 1;
    }

    .upload-block-info-video {
        position: relative;
        max-width: 400px;
        margin: 0 auto;
    }

    .upload-block-info-video-inner {
        position: relative;
        padding-bottom: 100%;
    }

    .upload-block-info-video-inner video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .video-input {
        display: inline-block;
    }

    .upload-block {
        position: relative;
        margin: 10px 0px;
    }

    .file-upload-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 10;
        cursor: pointer;
    }

    .upload-block-main {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .upload-block-main-btn {

    }

    .upload-block-info {

    }

    .upload-block-main-info {
        width: 100%;
    }

    .upload-block-main .alert {
        margin-bottom: 0px;
        margin-right: 5px;
    }

    @media screen and (max-width: 768px) {
        .upload-block-main {
            flex-direction: column;
        }

        .upload-block-main .alert {
            margin-bottom: 10px;
            margin-right: 0px;
        }

        .upload-block-main-btn {
            width: 100%;
        }
    }

</style>
