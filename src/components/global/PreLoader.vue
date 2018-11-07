<template>

    <div class="pre-loader" v-if="preloader">
        <img alt="Vue logo" src="../../assets/gif-preloader.gif">
    </div>

</template>

<script>
    import { mapState } from 'vuex'
    export default {

        computed:{

            ...mapState({
                preloader: state => state.preloader
            }),

        }
    }
</script>


<style scoped>
    .pre-loader{
        position: fixed;
        background:rgba(255, 255, 255, 0.75);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
    .pre-loader img {
        opacity: 0.3;
    }
</style>
