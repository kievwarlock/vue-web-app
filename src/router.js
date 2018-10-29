import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import logout from './views/logout.vue'
import profile from './views/profile.vue'

import NotFound from './views/404.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/profile',
        name: 'profile',
        component: profile
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
    { path: '/404', component: NotFound },
];


const router = new Router({
    routes,
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    if (!to.matched.length) {
        next('/404');
    } else {
        next();
    }
})



export default router
