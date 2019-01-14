import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import logout from './views/logout.vue'
import profile from './views/Profile.vue'
import profileEdit from './views/ProfileEdit.vue'
import userProfile from './views/user-profile.vue'
import googleMap from './views/googleMap.vue'
import MarkersView from './views/MarkersView.vue'
import NotFound from './views/404.vue'
import Video from './views/Video.vue'
import Images from './views/Images.vue'
import CreatePost from './views/CreateProfilePost.vue'
import SinglePostProfile from './views/SinglePostProfile.vue'
import UpdateProfilePost from './views/UpdateProfilePost.vue'


Vue.use(Router)




const routes = [
    {
        path: '/profile-post/:contentCardId',
        name: 'profile-post',
        component: SinglePostProfile,
        props: true
    },
    {
        path: '/create-post',
        name: 'create-post',
        component: CreatePost,
    },
    {
        path: '/update-profile-post/:id',
        name: 'update-profile-post',
        component: UpdateProfilePost,
    },
    {
        path: '/image',
        name: 'image',
        component: Images,
    },
    {
        path: '/video',
        name: 'video',
        component: Video,
        props: true
    },
    {
        path: '/markers',
        name: 'markers',
        component: MarkersView,
        props: true
    },
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/map',
        name: 'map',
        component: googleMap
    },
    {
        path: '/profile-other/:id',
        name:'other profiles',
        component: userProfile
    },
    {
        path: '/profile-edit',
        name: 'profileEdit',
        component: profileEdit
    },
    {
        path: '/profile/:id?',
        name: 'profile',
        component: profile,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/logout',
        name: 'logout',
        component: logout
    },
    { path: '/404', name: 'NotFound', component: NotFound },
];


const router = new Router({
    routes,
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (savedPosition) {
                    resolve(savedPosition)
                } else {
                    resolve({ x: 0, y: 0 })
                }
            }, 500)
        })

    }
});

router.beforeEach((to, from, next) => {
    if (!to.matched.length) {
        next('/404');
    } else {
        next();
    }
})



export default router
