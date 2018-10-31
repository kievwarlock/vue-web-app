<template>
  <b-navbar class="main-navbar" toggleable="md" type="dark" variant="info" >

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">Gether</b-navbar-brand>

    <b-collapse v-if="isAuthenticated" is-nav id="nav_collapse">

      <b-navbar-nav>

        <b-nav-item to="/">
          Home
        </b-nav-item>

        <b-nav-item to="/map">
          Map
        </b-nav-item>
        <b-nav-item to="/Profile">
          Profile
        </b-nav-item>
       <!-- <b-nav-item to="/Login">
          Login
        </b-nav-item>
        <b-nav-item to="/404">
          404
        </b-nav-item>-->

      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">


        <b-nav-item-dropdown right >
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{user.fullName}}</em>
          </template>
          <b-dropdown-item to="/profile" >Profile</b-dropdown-item>
          <b-dropdown-item to="/logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>


      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
    computed:{
        isAuthenticated(){
            return this.$store.getters.isAuthenticated;
        },
        user(){
            return this.$store.getters.currentUser
        },
    },
}
</script>


<style scoped>

  .main-navbar{
    z-index: 100;
  }
</style>
