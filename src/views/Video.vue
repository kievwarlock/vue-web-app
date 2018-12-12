<template>
    <div class="video-page">



        <b-form @submit.prevent="onSubmit" class="profile-form">


            <b-form-group label="Full name:" class="text-left">
                <b-form-input
                        type="text"
                        v-model="formData.fullName"
                        required
                        placeholder="Full name">
                </b-form-input>
            </b-form-group>

            <b-form-group label="City:" class="text-left">
                <b-form-input
                        type="text"
                        v-model="formData.city"
                        required
                        placeholder="City">
                </b-form-input>
            </b-form-group>

            <b-form-group label="Video:" class="text-left">
                <VideoInput  @change="changeVideo" @changeScreen="changeScreenEvent" ></VideoInput>
            </b-form-group>

            <b-form-group class="text-right">
                <b-button type="submit" variant="success">Update profile</b-button>
            </b-form-group>

        </b-form>

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
        computed: {

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
