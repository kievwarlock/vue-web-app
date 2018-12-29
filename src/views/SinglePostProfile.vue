<template>
    <div class="single-post-profile">
        <h1>
            Single post :
            <p>
              ContentCardID:  {{contentCardId}}
            </p>

        </h1>

        <div class="single-post-profile-comment" v-if="commentLoadingStatus">
            <div class="single-post-profile-comment-add">
                <v-textarea
                        label="Comment"
                        v-model="commentText"
                        hint="Type your comment"
                >

                </v-textarea>
                <v-btn color="error" @click="addComment">Add comment</v-btn>
            </div>

            <div class="single-post-profile-comments">
                <div class="single-post-profile-comment-item"
                    v-for="comment of comments"
                >

                    <v-list-tile  avatar >
                        <v-list-tile-avatar>

                            <img
                                v-if="comment.author.avatarId"
                                :src="  `http://stage.gether.work:8010/avatar/preview/${comment.author.avatarId }`" >
                            <img  v-else src="../assets/avatar-placeholder.png" alt="" >
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title v-html="comment.author.fullName"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="comment.text"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>


                    <div class="single-post-profile-comment-item-footer">
                        {{timestampToDate(comment.creationTime)}}
                    </div>

                </div>

            </div>
        </div>
        <div class="single-post-profile-comment-preload" v-else >
            <p>Loading...</p>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
        </div>
    </div>


</template>

<script>


    import {topicController, profileWallController, commentController, UserService} from '@/api/main/api.service.js'
    import {DateConverter} from "@/global/date.js";


    export default {
        name: 'single-post',
        data() {
            return {
                commentLoadingStatus:false,
                commentText:'',
                comments:[],
                topic: [],
                loading: false,
            }
        },
        props: {
            contentCardId: String
        },
        mounted() {
            this.getTopics();
            this.getComments();
        },
        methods: {
            timestampToDate(timestamp){
                return DateConverter(timestamp);
            },
            async addComment(){
                if( this.commentText ){
                    try {
                        await commentController.addComment( this.contentCardId, this.commentText );
                        this.commentText = '';
                        this.getComments();
                    }catch (e) {
                        console.log('error addComment:', e);
                    }
                }
            },
            async getComments( ){

                this.commentLoadingStatus = false;
                try {

                    let commentsData = await commentController.getComments( this.contentCardId );
                    let newCommentDataObj = [];
                    for( let comment of commentsData.data){
                        let newCommentDataObjItem = comment;

                        if( comment.authorId ){
                            let author = await UserService.getUserProfile(comment.authorId)
                            commentsData.data = author.data;
                            newCommentDataObjItem['author'] = author.data
                        }
                        newCommentDataObj.push(newCommentDataObjItem);
                    }
                    this.comments = newCommentDataObj;
                }catch (e) {
                    console.log('error getComments:', e);
                }
                this.commentLoadingStatus = true;
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


    .single-post-profile-comment-item-footer {
        colot:#777;
        font-size: 10px;
        text-align: right;
    }
    .single-post-profile-comments {

    }
    .single-post-profile-comment-item {
        padding: 10px;
        margin: 15px 0px;
        background: #fff;
        text-align: left;
        border-radius: 10px;
        box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.14);
    }

</style>