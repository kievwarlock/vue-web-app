<template>
    <v-container>
    <div class="create-post">
        <h1>
            Add post
        </h1>


        <form>
            <v-layout wrap>

                <v-flex xs12>

                    <!-- <ImageUpload @change="imagesUpdate"></ImageUpload>-->
                    <ImageUpload @change="imagesUpdate"></ImageUpload>
                    <!--<v-tabs
                            slot="extension"
                            v-model="tab"
                            color="cyan"
                            dark
                            :fixed-tabs="true"
                            slider-color="blue"
                    >
                        <v-tab ripple key="videoTab"  > Add images</v-tab>




                    </v-tabs>


                    <v-tabs-items :touchless="true"  v-model="tab" >
                        <v-tab-item key="imageTab" >
                            <v-card flat>
                                <v-card-text>
                                    <ImageUpload @change="imagesUpdate"></ImageUpload>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="videoTab" >
                            <v-card flat>
                                <v-card-text>
                                    <VideoInput @change="changeVideo"
                                                @changeScreen="changeScreenEvent"></VideoInput>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>-->

                </v-flex xs12>


                <v-flex xs12>
                    <v-textarea
                            v-model="ContentCardData.text"
                            name="input-7-1"
                            label="Description"
                            hint="Type text"
                    ></v-textarea>
                    <p>
                        {{ContentCardData.text.length}}
                    </p>
                </v-flex xs12>

                <v-flex xs12>
                    <v-select
                            v-model="ContentCardData.topicIds"
                            :items="topic"
                            :clearable="true"
                            label="Tags"
                            multiple
                            small-chips

                    >


                    </v-select>
                </v-flex>

                <v-flex xs12>
                    <v-btn @click="submit" :loading="loading" color="error">Add post</v-btn>
                </v-flex xs12>


            </v-layout wrap>
        </form>


    </div>
    </v-container>

</template>

<script>


    import VideoInput from '@/components/VideoInput.vue'

    import ImageUpload from '@/components/ImageUpload.vue'

    import {topicController, imageController, profileWallController, videoController } from '@/api/main/api.service.js'

    export default {
        name: 'VideoPage',
        data() {


            return {
                tab:0,
                ContentCardData: {
                    "imageIds": [],
                    "text": "",
                    "topicIds": [],
                    "videoId": ""
                },
                selectedTopic: [],
                searchInput: '',
                value: [],
                formData: {},
                videoData: {},
                videoScreenBlob: {},
                topic: [],
                imagesBlob: {},
                loading: false,
            }
        },
        mounted() {
            this.getTopics();
        },
        methods: {
            async submit() {

                this.loading = true;

                if( this.tab == 0 ){
                    try {
                        await this.addImages();
                    } catch (e) {
                        console.log('Add images error!', e);
                    }
                }
                if( this.tab == 1 ){
                    try {
                        await this.uploadVideo();
                    } catch (e) {
                        console.log('Add video error!', e);
                    }
                }

                try {
                    // If Image selected
                    if(  this.tab == 0 ){
                        this.ContentCardData.videoId = ''; // set video empty
                    }
                    // If Video selected
                    if(  this.tab == 1 ){
                        this.ContentCardData.imageIds = []; // set images empty
                    }

                    await profileWallController.addContentCard(this.ContentCardData);
                    this.$router.push({
                        name: 'profile',
                    });
                } catch (e) {
                    console.log('Add contant card error!', e);
                }

                this.loading = false;

            },
            addImages() {

                return new Promise(async (response, reject) => {

                    for (let item in this.imagesBlob) {
                        let formData = new FormData();
                        formData.append('image', this.imagesBlob[item]);
                        let imageData = await imageController.addImage(formData);

                        if (!imageData) reject(item + ': Image not loaded');

                        this.ContentCardData.imageIds.push(imageData.data.id)
                    }
                    ;
                    response();

                });


            },
            async getTopics() {
                let topics = await topicController.getTopic();
                for (let topicItem of topics.data) {
                    this.topic.push({
                        value: topicItem.id,
                        text: topicItem.text
                    });
                }
            },
            imagesUpdate(data) {
                this.imagesBlob = data;
            },
            changeVideo(data) {
                this.videoData = data;
                console.log('VIDEO:', this.videoData);

            },
            uploadVideo(){

                return new Promise(async (response, reject) => {

                    if( this.videoData ){

                        let formData = new FormData();
                        formData.append('video', this.videoData );
                        let videoData = await videoController.addVideo(formData);

                        if (!videoData) reject(item + ': Video not loaded');

                        this.ContentCardData.videoId = videoData.data.id;
                        console.log('SUCCESS:', this.ContentCardData.videoId);
                        response( videoData.data.id );
                    }
                    reject();


                });
            },
            changeScreenEvent(blob) {
                this.videoScreenBlob = blob;
            }
        },
        components: {
            VideoInput,
            ImageUpload
        }
    }
</script>


<style>

    .create-post {
        max-width: 600px;
        width: 100%;
        margin: 10px auto;
        padding: 15px;
    }

</style>