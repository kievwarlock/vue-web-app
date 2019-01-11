<template>
    <v-container>
        <div class="logout-page">
            <div class="logout-page-inner"  v-if="isAuthenticated">
                <h1>Logout page</h1>
                <p>
                    Do you want logout?
                </p>
                <v-btn  @click="logout" color="error">Logout</v-btn>
            </div>

        </div>
    </v-container>
</template>


<script>


    export default {
        computed:{
            isAuthenticated(){
                return this.$store.getters.isAuthenticated;
            },
        },
        methods:{
            logout(){
                this.$store.dispatch('logoutUser');
                return this.$router.push('/login');

            }
        }
    }
</script>