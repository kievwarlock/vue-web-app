<template>
    <div class="video-input">


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
            <div class="upload-clear-file btn btn-danger" @click="clearInput"> clear</div>
            <div class="upload-block-info-video-inner">
                <video controls ref="fileVideo"  >
                    <source :src="videoPreview.url">
                    Your browser does not support HTML5 video.
                </video>
            </div>
        </div>
        <div class="upload-block-info" v-show="filedata.name" v-if="validation.errorStatus === false">
            <b-alert show class="upload-block-info-bottom" variant="success">
                File size: {{videoSize}} Mb <br>
                File name: {{filedata.name}}
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
    export default {
        name: 'VideoInput',
        data() {
            return {
                filedata: {},
                videoPreview:{
                  url:'',
                },
                validation: {
                    maxFileSize: {
                        value: 32,   // MB
                        errorMsg: ' File size more than 32mb',
                    },
                    validFileTypes: {
                        types: [
                            'video/mp4',
                            //'video/m4a'
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
                this.validation.errorStatus = this.validation.errorMsg.length > 0 ;


            },
            createObjectURL ( file ) {

                return new Promise( (resolve, reject)=> {
                    if ( window.webkitURL ) {
                        resolve( window.webkitURL.createObjectURL( file ) );
                    } else if ( window.URL && window.URL.createObjectURL ) {
                        resolve(  window.URL.createObjectURL( file ) );
                    } else {
                        reject('null');
                    }
                })

            },
            loadVideoPreview(){

                window.URL.revokeObjectURL( this.$refs.fileinput.files[0] );
                this.createObjectURL( this.$refs.fileinput.files[0] )
                .then( (ObjectURL) => {
                    this.videoPreview.url = ObjectURL;
                    setTimeout( ()=>{
                        this.$refs.fileVideo.load();
                    }, 200);

                })

            },
            inputFile(e) {

                this.videoPreview.url = '';
                if( e.target.files[0]  ){

                    this.filedata = e.target.files[0];
                    this.checkValidationError();

                    if( this.validation.errorStatus === false ){
                        this.loadVideoPreview();
                    }else{
                        this.clearInput();
                    }

                }else{
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
