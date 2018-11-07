<template>
<!--
    @dismiss-count-down="countDownChanged"-->
    <div class="notifications-block">


        <b-alert
                v-for="(notification, index) in notifications"
                :show="notification.dismissCountDown"
                 fade
                @dismissed="notification.dismissCountDown=0"
                 :variant="notification.type"
                @dismiss-count-down="countDownChanged">
                @dismiss-count-down="countDown( notification.dismissCountDown, index)"
                >
            <div class="inner-notification">
                {{notification.text}}
                <p>
                    <button class="btn btn-sm btn-success" @click="remove(index)" > Close </button>
                </p>

            </div>

        </b-alert>
    </div>

</template>

<script>

    import { mapGetters } from 'vuex'
    export default {

        computed:{
            ...mapGetters({
                notifications: 'Notifications'
            }),

        },
        methods:{
            countDownChanged (dismissCountDown) {
                console.log(dismissCountDown);
            },
            countDown(dismissCountDown ,index ){
                console.log('dismissCountDown', dismissCountDown, index);
                this.$store.dispatch('dismissCountChange', { count:dismissCountDown, index: index} );
            },
            remove( index ){

                this.$store.dispatch('removeNotifications', index );
            }
        }
    }
</script>


<style scoped>
    .btn {
        position: absolute;
        bottom: 0;
        right: 0;
    }
    .inner-notification-count{
        background: #17a2b8 ;
        position: absolute;
        top: 0;
        left: 0;
        padding: 5px;
        min-width:26px;
        min-height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color:#fff;
        margin: 5px;
    }
    .notifications-block {
        position: fixed;
        top:auto;
        right: 0;
        max-width: 300px;
        font-size: 13px;
        z-index: 100;
    }
    .notifications-block .alert {
        width: 300px;
    }

</style>
