<template>
    <div class="crop-image-file">
        <div :class="statusCroppie" >

            <vue-croppie
                    ref="croppieRef"
                    :enableResize="false"
                    :showZoomer="true"
                    :enableOrientation="false"
                    :enableExif="false"
                    :viewport="viewport"
                    :boundary="boundary"
                    :url="avatar"

            ></vue-croppie>

        </div>

        <div class="profile-avatar"  v-if="statusCroppie == 'hideCroppie'" >
            <img src="../assets/avatar-placeholder.png" class="user-avatar" alt="">
        </div>

        <div class="crop-image-file-upload">

            <div class="crop-image-file-upload-block">
                <div class="crop-image-file-upload-block-hide">
                    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
                </div>
                <div class="crop-image-file-upload-block-visible">
                    Upload avatar
                </div>
            </div>

            <div class="crop-image-file-upload-submit" v-if="statusCroppie != 'hideCroppie'">
                <v-btn color="primary" v-on:click="submitFile()">Save avatar</v-btn>
            </div>


        </div>

    </div>
</template>

<script>
    export default {


        data() {
            return {
                uploadAvatar: '',
                fileAvatar: '',
                boundary: {
                    width: 250,
                    height: 250
                },
                viewport: {
                    width: 200,
                    height: 200,
                    type:'square'
                },
                croppieReultOption: {
                    type:'blob',
                    format: 'jpeg',
                    size:{
                        width:1024, height:1024
                    }
                },
            }
        },

        computed: {
            statusCroppie() {

                if ( Object.keys(this.avatar).length  || this.uploadAvatar ) {
                    return 'activeCroppie';
                } else {
                    return 'hideCroppie';
                }
            },
            avatar() {
                return this.$store.getters.currentUserAvatar;
            }
        },
        mounted() {
            this.bind(this.avatar);
        },
        watch: {
            avatar() {
                this.bind(this.avatar);
            }
        },
        methods: {


            handleFileUpload() {

                let setAvatar = this.setCropAvatar;
                let reader = new FileReader();
                reader.onload = function (e) {
                    setAvatar(e.target.result);
                }
                if (this.$refs.file.files[0]) {
                    reader.readAsDataURL(this.$refs.file.files[0]);
                }

            },
            submitFile() {

                this.$refs.croppieRef.result( this.croppieReultOption )
                    .then( (blob) => {
                        let formData = new FormData();
                        formData.append('avatar', blob);
                        this.$store.dispatch('uploadAvatar', formData );
                    })
                    .catch((error) => {
                        console.log('error blob', error);
                    })

            },
            setCropAvatar(avatar) {

                this.uploadAvatar = avatar;
                this.$refs.croppieRef.bind({
                    url: avatar,
                })

            },
            bind(avatar) {

                if ( Object.keys(avatar).length ) {
                    this.$refs.croppieRef.bind({
                        url: avatar,
                    });
                }

            },

        }
    }
</script>


<style>
    .crop-image-file-upload {
        position: relative;
        max-width: 300px;
        margin: 0 auto;
    }

    .croppie-container .cr-boundary {
        /*box-shadow: 2px 2px 10px 1px #ccc;
        border-radius: 10px;*/
    }

</style>

<style scoped>

    .hideCroppie {

        opacity: 0;
        height: 0;
        width: 0;
        overflow: hidden;
    }

    .activeCroppie {

    }

    .croppie-container .cr-viewport, .croppie-container .cr-resizer {
        position: absolute;
        border: 2px solid #fff;
        margin: auto;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        box-shadow: 0 0 2000px 2000px rgb(255, 255, 255);
        z-index: 0;
        border-radius: 10px;
    }

    .crop-image-file-upload-block {
        position: relative;
        margin: 10px auto;
    }

    .crop-image-file-upload-block-hide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 10;
        cursor: pointer;
    }

    .crop-image-file-upload-block-hide input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        cursor: pointer;
    }

    .crop-image-file-upload-block-visible {
        background: #17a2b8;
        color: #ffff;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        text-transform: uppercase;
    }

    .crop-image-file-upload-submit {

    }

    .crop-image-file-upload-submit .btn {
        width: 100%;
        padding: 9px;
        text-transform: uppercase;
    }

</style>