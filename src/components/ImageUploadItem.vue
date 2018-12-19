<template>

    <!--
        <div class="grid-item-order">
            {{props.sort+1}}
        </div>
        <div>Data: {{props.item}}</div>
        <div>{{props.index}} / {{props.sort}}</div>-->
    <div class="grid-item-inner">
        <div class="grid-item-order"> {{props.sort+1}}</div>

        <div class="image-upload-item">


            <div class="image-upload-item-view">
                <div class="image-upload-item-view-no-image" v-show="!uploadImage">
                    <input ref="inputImageFile" class="image-upload-item-input-hide" type="file" accept="image/*"
                           v-on:change="handleFileUpload">
                    <div class="image-upload-item-view-no-image-icon"></div>
                </div>
                <div class="image-upload-item-view-image-ready" v-if="!!uploadImage">
                    <div class="image-upload-item-view-image-ready-preview">
                        <img :src="uploadImage" class="upload-image-preview" alt="">
                    </div>
                    <div class="image-upload-item-view-image-ready-nav">
                        <i class="material-icons" @click="dialog = true">
                            crop_free
                        </i>
                        <i class="material-icons" @click="clearData">
                            close
                        </i>
                    </div>
                </div>

            </div>
        </div>

        <!-- <v-btn
                 color="primary"
                 dark
                 @click="dialog = true"
         >
             Open Dialog
         </v-btn>-->


        <v-dialog

                v-model="dialog"
                :width="boundary.width"
        >

            <v-card>
                <div class="crop-title">
                    Image Crop
                </div>




                <div class="crop-image-inner-modal">
                    <div class="crop-image-inner-modal-loader" v-show="!cropReady">
                        Loading image crop...
                    </div>
                    <vue-croppie

                            ref="croppieRef"
                            :enableResize="false"
                            :enableOrientation="true"
                            :showZoomer="true"
                            :enableExif="true"
                            :viewport="viewport"
                            :boundary="boundary"
                    ></vue-croppie>
                </div>

                <v-container fluid justify-center>


                    <v-btn color="primary"  @click="orientEvent">
                        <i class="material-icons">
                            compare_arrows
                        </i>
                    </v-btn>
                    <v-btn color="primary" @click="rotateEvent">
                        <i class="material-icons">
                            rotate_right
                        </i>
                    </v-btn>
                    <v-btn color="primary" @click="saveCrop">
                        <i class="material-icons">
                            save
                        </i>
                    </v-btn>
                    <v-btn color="primary" @click="dialog=false">
                        <i class="material-icons">
                            close
                        </i>
                    </v-btn>

                </v-container>
            </v-card>
        </v-dialog>

    </div>

</template>


<script>

    //import ImageUploadItem from '@/components/ImageUploadItem.vue'

    export default {
        name: 'ImageUploadItem',
        data() {
            return {

                mirror: false,
                dialog: false,
                cropViewDeley:1000,
                cropReady: false,
                uploadImage: '',
                //fileAvatar: '',
                boundary: {
                    width: 300,
                    height: 300
                },
                viewport: {
                    width: 300,
                    height: 300,
                    type: 'square'
                },
                saveCropOptions:{
                    type: 'base64',
                    format: 'jpeg',
                    size: {
                        width: 350,
                        height: 350
                    }
                },
                croppiePreview: {
                    type: 'base64',
                    format: 'jpeg',
                    size: {
                        width: 350, height: 350
                    }
                },
            }
        },
        props: {
            props: Object,
        },
        components: {
            //ImageUploadItem
        },
        methods: {
            rotateEvent() {
                this.$refs.croppieRef.rotate(-90);
            },
            orientEvent() {
                this.mirror = !this.mirror;
                if (this.mirror) {
                    this.$refs.croppieRef._data.croppie.data.orientation = 2
                    this.$refs.croppieRef.rotate(0);
                } else {
                    this.$refs.croppieRef._data.croppie.data.orientation = 1
                    this.$refs.croppieRef.rotate(0);
                }

            },
            async saveCrop() {
                this.uploadImage = await this.$refs.croppieRef.result(
                    this.saveCropOptions
                );
                this.dialog = false;
            },
            clearData() {
                this.uploadImage = '';
                this.$refs.inputImageFile.value = '';
            },
            handleFileUpload(e) {

                this.dialog = true;
                this.cropReady = false;

                let croppieInstanse = this.$refs.croppieRef;
                croppieInstanse.refresh()


                let reader = new FileReader();
                reader.onload = (e) => {


                    setTimeout( async () => {

                        await croppieInstanse.bind({
                            url: e.target.result
                        });
                        this.uploadImage = await croppieInstanse.result( this.croppiePreview );
                        this.cropReady = true;
                    }, this.cropViewDeley);


                };

                if (e.target.files[0]) {
                    reader.readAsDataURL(e.target.files[0]);
                }
            }
        }

    }
</script>

<style>

    .crop-image-inner-modal .croppie-container .cr-boundary {
        border-radius: 0px;
    }
</style>
<style scoped>
    .container {
        padding: 2px;
    }
    .v-btn {
        min-width: auto !important;
    }
</style>
<style>


    .crop-title {
        padding: 10px;
        background: #ffffff;
        color: #000;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: bold;
    }
    .crop-image-inner-modal {
        position: relative;
    }
    .crop-image-inner-modal-loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: #000;
        font-size: 13px;
        z-index: 100;
    }
    .image-upload-item-view-image-ready-nav {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
    }

    .fixed-block {
        position: fixed;
        top: 0;
        left: 0;
        background: #fff;
        border: 1px solid #ccc;
        padding: 10px;
        z-index: 10;
    }

    .image-upload-item-view-image-ready-preview {
        position: relative;
        z-index: -1;
    }

    .upload-image-preview {
        max-width: 100%;
        height: auto;
        border-radius: 0px;
    }

    .image-upload-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: grab;
    }

    .image-upload-item-input-hide {
        position: absolute;
        top: -40px;
        left: -40px;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        opacity: 0;
        z-index: 10;
        cursor: pointer;
    }

    .image-upload-item-view {

    }

    .image-upload-item-view-no-image {
        position: absolute;
        top: 30%;
        left: 30%;
        right: 30%;
        bottom: 30%;
        cursor: pointer;
        overflow: hidden;
    }

    .image-upload-item-view-no-image-icon:before {
        content: "";
        width: 80%;
        height: 2px;
        background: #17a2b8;
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        transition: background 0.4s ease-in-out;
    }

    .image-upload-item-view-no-image-icon:after {
        content: "";
        height: 80%;
        width: 2px;
        background: #17a2b8;
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        transition: background 0.4s ease-in-out;
    }

    .image-upload-item-view-no-image:hover .image-upload-item-view-no-image-icon {

    }

    .image-upload-item-view-no-image:hover .image-upload-item-view-no-image-icon:before {

    }

    .image-upload-item-view-no-image:hover .image-upload-item-view-no-image-icon:after {

    }

    .image-upload-item-view-no-image-icon {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: 2px solid #17a2b8;
        border-radius: 50%;
    }

    .image-upload-item-view-image-ready {
        overflow: hidden;
    }

    .grid-item-order {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        color: #fff;
        background: lightseagreen;
        margin: 0 auto;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .grid-item-inner {
        border-radius: 0px;
        border: 1px solid lightseagreen;
        height: 100%;
        position: relative;
        background: rgba(183, 183, 183, 0.1);
    }

    .grid-item-inner:hover {

    }

    .image-upload-item-view-image-ready-nav i:hover {
        background: #fff;
    }

    .image-upload-item-view-image-ready-nav i {
        background: rgba(255, 255, 255, 0.7490196078431373);
        padding: 5px;
        margin: 5px;
        cursor: pointer;
    }

</style>