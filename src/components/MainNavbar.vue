<template>

    <div>
        <v-navigation-drawer v-if="isAuthenticated"
                v-model="drawer"
                absolute
                temporary
        >
            <v-list class="pa-1">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img :src="avatar" alt="" v-if="avatar">
                        <img src="https://randomuser.me/api/portraits/men/85.jpg" v-else>
                    </v-list-tile-avatar>


                    <v-list-tile-content>
                        <v-list-tile-title><em>{{user.fullName}}</em></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>

            <v-list class="pt-0" dense>
                <v-divider></v-divider>

                <v-list-tile
                        v-for="item in items"
                        :key="item.title"
                        :to="{ name:item.link }"
                >
                    <v-list-tile-action >
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark color="error">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"  v-if="isAuthenticated" ></v-toolbar-side-icon>

            <v-toolbar-title class="white--text">Gether</v-toolbar-title>

            <v-spacer></v-spacer>


            <!--<v-btn icon @click="reload">
                <v-icon>refresh</v-icon>
            </v-btn>-->

        </v-toolbar>


    </div>

</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data () {
            return {
                drawer: null,
                items: [

                    {
                        title: 'Profile',
                        icon: 'person',
                        link: 'profile'
                    },
                    {
                        title: 'Add post',
                        icon: 'person_add',
                        link: 'create-post'
                    },
                    {
                        title: 'Image',
                        icon: 'image',
                        link: 'image'
                    },
                    {
                        title: 'Video',
                        icon: 'videocam',
                        link: 'video'
                    },
                    {
                        title: 'Logout',
                        icon: 'exit_to_app',
                        link: 'logout'
                    },

                ]
            }
        },
        computed: {
            ...mapGetters({
                isAuthenticated: 'isAuthenticated',
                user: 'currentUser',
                avatar: 'currentUserAvatar',
            }),

        },
        methods: {
            reload(){
                console.log('reload');
                location.reload();
            }
        }
    }
</script>


<style scoped>

    .small-image-profile {
        display: inline-block;
        padding: 0px 10px;
    }

    .small-image-profile img {
        max-width: 40px;
        border-radius: 50%;
    }

    .main-navbar {
        z-index: 100;
    }
</style>
