<template>
    <div class="home">
        <div class="container">
            <br>
            <h1> User profile</h1>

            <hr>




            <div class="row">

                <div class="col-xs-12 col-sm-6">
                    <div>
                        <h4><b>Phone:</b> {{formData.phoneNumber}}</h4>

                        <div>
                            <image-cropper></image-cropper>
                        </div>
                    </div>
                </div>

                <div class="col-xs-12 col-sm-6">

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

                        <b-form-group label="Locale:" class="text-left">
                            <b-form-select v-model="formData.locale" :options="local" class="mb-3"/>
                        </b-form-group>


                        <b-form-group label="Visible:" class="text-left">
                            <b-form-select v-model="formData.visible" :options="visibleStatus" class="mb-3"/>
                        </b-form-group>


                        <b-form-group class="text-right">
                            <b-button type="submit" variant="success">Update profile</b-button>
                        </b-form-group>

                    </b-form>

                </div>

            </div>

            addNote
        </div>


        <b-button type="submit"  @click.prevent="addNote()" variant="success">addNote</b-button>

    </div>
</template>

<script>

    import {UserService} from "@/api/main/api.service.js";
    import ImageCropper from "@/components/ImageCropper.vue";

    export default {
        components: {ImageCropper},
        data() {
            return {

                fileAvatar: {},
                formData: {},
                local: [
                    {value: 'de', text: 'DE'},
                    {value: 'us', text: 'US'},
                    {value: 'fr', text: 'FR'},
                    {value: 'es', text: 'ES'},
                    {value: 'it', text: 'IT'},
                    {value: 'ru', text: 'RU'},
                ],
                visibleStatus: [
                    {value: 'true', text: 'Visible'},
                    {value: 'false', text: 'Hidden'},
                ]
            }
        },

        mounted() {
            this.setUserData()
        },
        methods: {
            addNote(){
                this.$store.dispatch('addNotifications', {
                    text:' Hello mazafacker !',
                    type:'danger',
                })
            },
            setUserData() {
                return this.formData = this.$store.getters.currentUser;
            },
            onSubmit() {
                this.$store.dispatch('updateUser', this.formData);
            }
        }

    }
</script>


<style>

    .user-avatar-placeholder {
        background: #ccc;
    }

    .profile-avatar {
        padding: 25px;
        border-radius: 10px;
        display: inline-block;
        box-shadow: 2px 2px 10px 1px #ccc;
    }

    .profile-avatar img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
    }

    .user-avatar {

    }

    .profile-form {
        max-width: 800px;
        margin: 0 auto;
    }

</style>