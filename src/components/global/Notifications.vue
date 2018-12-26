<template>

    <div class="notifications-block">



       <!-- :timeout="notification.dismissCountDown"-->
        <v-snackbar
                class="global-notification"
                v-for="(notification, index) in notifications"
                :key="index"
                v-model="notification.showDismissibleAlert"
                :color="notification.type"
                :right="true"
                :timeout="0"
                :top="true"
        >
            {{ notification.text }}
            <v-btn
                    color="white"
                    flat
                    @click="hide(index)"
            >
                <i class="material-icons">
                    close
                </i>
            </v-btn>
        </v-snackbar>
        <!--<v-snackbar
                v-model="snackbar"
                :bottom="y === 'bottom'"
                :left="x === 'left'"
                :multi-line="mode === 'multi-line'"
                :right="x === 'right'"
                :timeout="timeout"
                :top="y === 'top'"
                :vertical="mode === 'vertical'"
        >
            {{ text }}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>-->
        <!--<v-alert
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

        </v-alert>-->
    </div>

</template>

<script>

    import { mapGetters } from 'vuex'
    export default {

        computed:{
            ...mapGetters({
                notifications: 'Notifications'
            }),
            notificationsCount(){
                return this.notifications.length;
            }
        },
        watch:{
            notifications(notifications){
                this.notificationHide( notifications[this.notificationsCount - 1].dismissCountDown, this.notificationsCount - 1)
            }
        },
        methods:{

            notificationHide( time, index ){
                if (time) {
                    setTimeout(() => {
                        this.hide(index);
                    }, time)
                }
            },
            hide( index  ){
                this.$store.dispatch('removeNotifications', index );
            }
        }
    }
</script>


<style>
    .v-snack.global-notification {
        position: relative;
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
