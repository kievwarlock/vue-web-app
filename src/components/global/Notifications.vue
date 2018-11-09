<template>

    <div class="notifications-block">

        <b-alert
                v-for="(notification, index) in notifications"
                :show="notification.showDismissibleAlert"
                dismissible
                 fade
                 :variant="notification.type"
                :timer="notificationHide( notification.dismissCountDown, index, notification.showDismissibleAlert )"
                @dismissed="hide(index, notification.showDismissibleAlert)"
                >
            <div class="inner-notification">
                {{notification.text}}
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
            notificationHide( time, index, showDismissibleAlert ){
                if( showDismissibleAlert === true) {
                    if (time > 0) {
                        setTimeout(() => {
                            this.hide(index, showDismissibleAlert);
                        }, time)
                    }
                }

            },
            hide( index, showDismissibleAlert  ){
                if( showDismissibleAlert === true){
                    this.$store.dispatch('removeNotifications', index );
                }
            }
        }
    }
</script>


<style scoped>
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
