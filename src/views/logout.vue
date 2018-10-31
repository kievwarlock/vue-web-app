<template>
    <div class="about">
        <div class="container"  v-if="isAuthenticated">
            <h1>Logout page</h1>

            <p>
                Do you want logout?
            </p>
            <b-button @click="logout" type="submit" variant="primary">Logout</b-button>
        </div>


    </div>

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