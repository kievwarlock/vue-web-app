<template>
    <div class="home">
        <h1> User profile</h1>
        <p>
            <label for="">Phone</label>
            {{getUserData.phoneNumber}}
        </p>
        <p>
            <label for="">Name</label>
            {{getUserData.fullName}}
        </p>
        <p>
            <label for="">locale</label>
            {{getUserData.locale}}
        </p>
        <p>
            <label for="">city</label>
            {{getUserData.city}}
        </p>
        <p>
            <label for="">visible</label>
            {{getUserData.visible}}
        </p>
        <p>
            <label for="">avatarId</label>
            {{getUserData.avatarId}}
        </p>

    </div>
</template>

<script>
    export default {
        computed: {
            getUserData(){
                return this.$store.getters.currentUser;
            }
        },
    }
</script>
