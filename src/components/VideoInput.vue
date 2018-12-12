<template>
    <div class="video-input">


        <div v-show="loaded"  >

            <div class="video-screen-selector">
                <canvas ref="canvas" class="video-screen-canvas" :class="rangeSlider.loading"></canvas>

                <div class="range-slider-container">
                    <v-slider
                            v-model="rangeSlider.currentTime"
                            :max="rangeSlider.max"
                            :min="rangeSlider.min"
                            :step="rangeSlider.step"
                            :always-dirty="true"
                            thumb-label="always"

                            @start="startChangeCurrentTime"
                            @change="changeCurrentTime"

                    ></v-slider>
                </div>
            </div>

        </div>



        <div class="upload-block">
            <input type="file" class="file-upload-input" @change="inputFile" ref="fileinput"  accept="video/*"   >
            <div class="upload-block-main">
                <div class="upload-block-main-info">
                    <b-alert show variant="primary" v-if="!filedata.name">
                        {{visualOption.notSelectedText}}
                    </b-alert>
                    <b-alert show variant="success" v-if="filedata.name">
                       {{visualOption.successSelectedText}}
                    </b-alert>
                </div>
                <div class="upload-clear-file btn btn-danger" v-if="filedata.name" @click="clearInput"> Clear</div>
                <div class="upload-block-main-btn btn btn-success" v-if="!filedata.name" >Upload</div>
            </div>
        </div>

        <div class="upload-block-info-video" v-show="visualOption.showVideoPreview" >
            <div class="upload-block-info-video-inner" v-show="!!videoPreview.url" >
                <video muted controls ref="fileVideo" id="videoid" @loadedmetadata="onLoadVideo"  @seeked="seekedEvent" >
                    <source :src="videoPreview.url">
                    Your browser does not support HTML5 video.
                </video>
            </div>
        </div>

        <div v-if="visualOption.showInfoBlock">
            <div class="upload-block-info" v-show="filedata.name" v-if="validation.errorStatus === false">
                <b-alert show class="upload-block-info-bottom" variant="success">
                    File size: {{videoSize}} Mb <br>
                    File name: {{filedata.name}} <br>
                    File type: {{fileType}}
                </b-alert>
            </div>
        </div>

        <div class="upload-error-validation" v-if="validation.errorStatus">
            <b-alert show variant="danger" v-for="error of validation.errorMsg">
                {{error}}
            </b-alert>
        </div>


    </div>

</template>

<script>



    export default {
        name: 'VideoInput',
        data() {
            return {

                visualOption:{
                    showVideoPreview: false,
                    notSelectedText:'File not selected',
                    successSelectedText:' File selected !',
                    showInfoBlock:true,
                },

                rangeSlider:{
                    currentTime:1,
                    max:30,
                    min:0,
                    step:0.1,
                    loading:'loading',
                },

                loaded: false,
                filedata: {},   // input file data
                screenData:'',
                videoPreview: {
                    url: '',  // URL from uploaded file
                },

                validation: {  // Validation date
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
            changeCurrentTime(){
                this.$refs.fileVideo.currentTime = this.rangeSlider.currentTime;
            },

            /*
            *  Event change video currentTime
            *  - canvas drawImage
            *  - get blob image
            */
            seekedEvent(e){

                return new Promise( ( resolve, reject ) => {
                    if( e.target.readyState == 4 ){

                        let canvas = this.$refs.canvas;
                        canvas.width = e.target.videoWidth;
                        canvas.height = e.target.videoHeight;

                        let canvas2d = canvas.getContext('2d');
                        canvas2d.drawImage( e.target, 0, 0, e.target.videoWidth, e.target.videoHeight)
                        this.loaded = true;
                        this.rangeSlider.loading = '';

                        canvas.toBlob( (blob)=>{
                            this.$emit('changeScreen', blob );
                        }, 'image/jpeg', 0.95 );


                        resolve();
                    }else{
                        reject('readyState not 4')
                    }
                })


            },

            /*
            *  event on video loaded
            *  wait to ready State 4 and set video duration - and init event @seekedEvent
            */
            onLoadVideo(e) {

                this.promiseSetTimeout( () => {
                    if(e.target.readyState == 4) {
                        this.rangeSlider.max = e.target.duration;
                        e.target.currentTime = this.rangeSlider.currentTime;
                    }else{
                        this.onLoadVideo(e);
                        console.log('ready state not 4');
                    }
                }, 100 )

            },


            /*
            * check Validation Error
            */
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

            /* create Object URL
            * - try with webkit for crossbrousers
            */
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

            /* load video preview
            * - create video url
            * - set url to variable which reactive with video tag
            * - try load video with new url
            */
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


            /* Event On Change input type file
            * - check if exist file
            * - validate file by rules
            * - load video preview
            */

            inputFile(e) {

                this.videoPreview.url = '';
                if (e.target.files[0]) {

                    this.filedata = e.target.files[0];
                    this.checkValidationError();

                    if (this.validation.errorStatus === false) {
                        this.loadVideoPreview();
                        this.$emit('change', this.filedata );
                    } else {
                        this.clearInput();
                    }

                } else {
                    this.clearInput();
                }


            },

            // Clear input file and clear all data to default
            clearInput() {

                this.$refs.fileinput.value = '';
                this.filedata = {};
                this.videoPreview.url = '';
                this.rangeSlider.loading = 'loading';
                this.rangeSlider.currentTime = 1;
                this.loaded = false;

                this.$emit('changeScreen', '' );
                this.$emit('change', this.filedata );

            },

        }

    }
</script>


<style>
    .range-slider-container .v-messages.theme--light {
        display: none;
    }
    .range-slider-container .v-input__slot {
        margin-bottom: 0px;
    }
    .range-slider-container .v-input--slider {
        margin-top: 0px;
    }
</style>


<style scoped>

    .video-screen-canvas {
        width:100%;
        height:80%;
        margin: 0px auto;
        border:1px solid #ccc;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }
    .video-screen-selector {
        position: relative;
        margin: 10px auto;
    }
    .range-slider-container {
        position: absolute;
        bottom: 8px;
        left: 0;
        width: 100%;
        display: block;
        padding: 0px 20px;
        background: rgba(0, 0, 0, 0.4);
    }

    .video-screen-canvas.loading {
        opacity: 0.4;
    }



    .video-screen-canvas-image img {
        max-width: 100%;
        height:auto;
    }



    .video-input {
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
