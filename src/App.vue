<template>

    <div id="app">
        <v-app>
            <main-navbar></main-navbar>
            <PreLoader></PreLoader>
            <Notifications></Notifications>
            <transition

                    name="component-fade" mode="out-in"
            >


                    <router-view/>


            </transition>
        </v-app>
    </div>
</template>

<script>
    import MainNavbar from './components/MainNavbar.vue'
    import PreLoader from './components/global/PreLoader.vue'
    import Notifications from './components/global/Notifications.vue'

    export default {
        components: {
            MainNavbar,
            PreLoader,
            Notifications
        }
    }

</script>

<style>

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }

    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active до версии 2.1.8 */
    {
        opacity: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
