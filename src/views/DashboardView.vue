<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

import Button from 'primevue/button'
import LoginView from './authentication/LoginView.vue';
import DashboardLogin from '../components/dashboard/DashboardLogin.vue';

const { currentUser } = storeToRefs(useUserStore())

</script>

<template>
  <div>
    <div v-if="currentUser">
      <dashboard-login />
    </div>
    <div v-else>
      <div class="view d-flex flex-column justify-content-center align-items-center">
        <img src="../assets/logo.png" class="mb-4 text-center" height="90" />
        <p class="mb-1">Welcome to GainesvilleSafetyMaps</p>
        <p class="mb-3">Log in with your email to continue</p>
        <Button class="text-white" label="Log in" size="small"><a href="/login">Login</a></Button>
        <login-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.view {
  height: 100vh;
}

a {
  text-decoration: none;
  color: white
}
</style>
