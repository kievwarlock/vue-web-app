<template>

    <v-container>
        <div class="single-post-profile">
            <h1>
                <!-- Single post :
                 <p>
                   ContentCardID:  {{contentCardId}}
                 </p>
                 <p>
                     DATA: <br>
                     {{contentCardData}}
                 </p>-->

            </h1>
            <v-btn
                    :to="{ name:'update-profile-post', params:{ id: contentCardData.id } }"
                    v-if="ownerPost"
                    color="success"
                    @click="addComment"
            >
                Edit post
            </v-btn>
            <div class="single-post-profile-images-block" v-if="contentCardData.imageIds">
                <div v-for="imageId of contentCardData.imageIds" class="single-post-profile-image-item">
                    <img v-if="imageId" :src="imageUrl(imageId, 'original')" alt="">
                </div>
            </div>
            <div class="single-post-profile-description" v-if="contentCardData.text">
                {{contentCardData.text}}
                <div class="single-post-profile-date" v-if="contentCardData.creationTime">
                    {{timestampToDate(contentCardData.creationTime)}}
                </div>
            </div>
            <div class="single-post-profile-topic-block" v-if="contentCardData.topicIds">
                <div class="single-post-profile-topic-item"
                     v-for="topic of contentCardData.topicIds"
                > {{Topics[topic]}}
                </div>
            </div>
            <div class="single-post-profile-info">

                <div class="profile-wall-content-card-info" :class="contentCardData.currentProfileVote">
                    <div class="profile-wall-content-card-info-item DISLIKE" @click="dislikePost">
                        <i class="material-icons">
                            thumb_down_alt
                        </i>
                        <span>{{contentCardData.dislikesCount}} </span>
                    </div>
                    <div class="profile-wall-content-card-info-item LIKE" @click="likePost">
                        <i class="material-icons">
                            thumb_up_alt
                        </i>
                        <span> {{contentCardData.likesCount}} </span>
                    </div>
                    <div class="profile-wall-content-card-info-item">
                        <i class="material-icons">
                            mode_comment
                        </i>
                        <span>{{contentCardData.commentsCount}} </span>
                    </div>
                </div>
                <!--  <v-btn color="success" @click="likePost">Like post</v-btn>
                  <v-btn color="error" @click="dislikePost">Dislike post</v-btn>
                  <v-btn color="default" @click="unlikePost">Unlike Post</v-btn>-->
            </div>


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
                         v-for="comment of comments.slice().reverse()"
                    >

                        <v-list-tile avatar>
                            <v-list-tile-avatar>

                                <img
                                        v-if="comment.author.avatarId"
                                        :src="  `http://stage.gether.work:8010/avatar/preview/${comment.author.avatarId }`">
                                <img v-else src="../assets/avatar-placeholder.png" alt="">
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
            <div class="single-post-profile-comment-preload" v-else>
                <p>Loading...</p>
                <v-progress-linear :indeterminate="true"></v-progress-linear>
            </div>
        </div>
    </v-container>

</template>

<script>


    import {
        topicController,
        profileWallController,
        commentController,
        UserService,
        contentCardController
    } from '@/api/main/api.service.js';
    import {DateConverter} from "@/global/date.js";


    export default {
        name: 'single-post',
        data() {
            return {
                contentCardData: '',
                commentLoadingStatus: false,
                commentText: '',
                comments: [], // TODO reverse order
                topic: [],
                loading: false,
            }
        },
        computed: {
            ownerPost() {

                let ownerPost = false;
                let currentUserData = this.$store.getters.currentUser;
                if (currentUserData.id == this.contentCardData.ownerId) {
                    ownerPost = true;
                }
                return ownerPost;
            },
            Topics() {
                if (!Object.keys(this.$store.getters.AssociativeObjectTopics).length) {
                    this.$store.dispatch('getTopics');
                    console.log('dispatch');
                }
                console.log('get');
                return this.$store.getters.AssociativeObjectTopics;
            }
        },
        props: {
            contentCardId: String
        },
        mounted() {
            this.getContentCard();
            this.getTopics();
            this.getComments();
        },
        methods: {

            imageUrl(id, size = 'original') {
                return (id) ? this.$urlManager.getImageUrl(id, size) : false;
            },
            async likePost() {
                if (this.contentCardData.currentProfileVote == 'LIKE') {
                    this.unlikePost();
                } else {
                    await contentCardController.like(this.contentCardId);
                }
                this.getContentCard();
            },
            async dislikePost() {
                if (this.contentCardData.currentProfileVote == 'DISLIKE') {
                    this.unlikePost();
                } else {
                    await contentCardController.dislike(this.contentCardId);
                }
                this.getContentCard();

            },
            async unlikePost() {
                await contentCardController.unlike(this.contentCardId);
                this.getContentCard();
            },
            async getContentCard() {
                if (this.contentCardId) {
                    let CardData = await contentCardController.getContentCard(this.contentCardId);
                    this.contentCardData = CardData.data;
                }
            },
            timestampToDate(timestamp) {
                return DateConverter(timestamp);
            },
            async addComment() {
                if (this.commentText) {
                    try {
                        await commentController.addComment(this.contentCardId, this.commentText);
                        this.commentText = '';
                        this.getComments();
                        this.getContentCard();
                    } catch (e) {
                        console.log('error addComment:', e);
                    }
                }
            },
            async getComments() {

                this.commentLoadingStatus = false;
                try {

                    let commentsData = await commentController.getComments(this.contentCardId);
                    let newCommentDataObj = [];
                    for (let comment of commentsData.data) {
                        let newCommentDataObjItem = comment;

                        if (comment.authorId) {
                            let author = await UserService.getUserProfile(comment.authorId)
                            commentsData.data = author.data;
                            newCommentDataObjItem['author'] = author.data
                        }
                        newCommentDataObj.push(newCommentDataObjItem);
                    }
                    this.comments = newCommentDataObj;
                } catch (e) {
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
    .single-post-profile-topic-block {
        text-align: left;
        margin: 10px 0px;
    }

    .single-post-profile-topic-item {
        color: #222;
        font-size: 12px;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 5px 10px;
        display: inline-block;
    }

    .single-post-profile {
        max-width: 500px;
        margin: 0 auto;
    }

    .single-post-profile-date {
        color: #888;
        font-size: 14px;
        text-align: right;
    }

    .single-post-profile-info .profile-wall-content-card-info-item.DISLIKE, .single-post-profile-info .profile-wall-content-card-info-item.LIKE {
        cursor: pointer;
    }

    .single-post-profile-info .profile-wall-content-card-info {
        max-width: 300px;
        margin: 10px auto;
    }

    .single-post-profile-info i {
        font-size: 16px;
    }

    .single-post-profile-info span {
        font-size: 16px;
    }

    .single-post-profile-description {
        font-size: 18px;
        color: #222;
        padding: 10px;
        text-align: left;
        margin: 10px 0px;
        box-shadow: 1px 1px 3px 1px #ccc;
    }

    .single-post-profile-image-item {

    }

    .single-post-profile-image-item img {
        width: 100%;
    }

    .single-post-profile-comment-item-footer {
        colot: #777;
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