<template>
    <v-container>
        <div class="create-post">
            <h1>
                Edit post
            </h1>

            <form>
                <v-layout wrap>
got

                    <v-flex xs12>
                        <v-textarea
                                v-model="ContentCardData.text"
                                name="input-7-1"
                                label="Description"
                                hint="Type text"
                        ></v-textarea>
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
                        <v-btn @click="submit" :loading="loading" color="error">Save post</v-btn>
                    </v-flex xs12>


                </v-layout wrap>
            </form>


        </div>
    </v-container>

</template>

<script>


    import {topicController, profileWallController, contentCardController} from '@/api/main/api.service.js'

    export default {
        name: 'UpdatePost',
        data() {


            return {

                ContentCardData: {

                },

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
            this.getPost();
        },
        methods: {
            async getPost(){

                let dataContentCard = await contentCardController.getContentCard( this.$route.params.id );
                this.ContentCardData = dataContentCard.data;

            },
            async submit() {

                this.loading = true;


                try {
                    await profileWallController.updateContentCard( this.$route.params.id, this.ContentCardData);
                    this.$router.push({
                        name: 'profile-post',
                        params:{
                            contentCardId:this.$route.params.id
                        }
                    });
                } catch (e) {
                    console.log('Update contant card error! ', e);
                }

                this.loading = false;

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

        },

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