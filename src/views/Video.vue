<template>
    <div class="video-page">
        <h1>
            Video upload
        </h1>

        <b-form-group label="Video:" class="text-left">
            <VideoInput  @change="changeVideo" @changeScreen="changeScreenEvent" ></VideoInput>
        </b-form-group>



    </div>




</template>

<script>




    import VideoInput from '@/components/VideoInput.vue'



    export default {
        name: 'VideoPage',
        data(){
          return {

              formData:{},
              videoData:{},
              videoScreenBlob:{},

          }
        },

        methods:{
            changeVideo(data){
                this.videoData = data;
            },
            changeScreenEvent(blob){
                this.videoScreenBlob = blob;
            }
        },
        components: {
            VideoInput
        }
    }
</script>


<style>

    .video-page {
        max-width: 600px;
        width:100%;
        margin: 10px auto;
    }


</style>