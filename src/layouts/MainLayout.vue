<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-deep-purple-9">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          <!-- ------- -->
        </q-toolbar-title>

        <div>
          <div class="text-h4">FleeTexBD</div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <!-- <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-item-section>
        <q-item-section>User Name</q-item-section>
      </q-item>-->
      <navBar></navBar>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <registrationFormPopUp></registrationFormPopUp>
    <logIn></logIn>
  </q-layout>
</template>

<script>
import navBar from 'components/Navbar'
import registrationFormPopUp from "components/Register";
import logIn from "components/LogIn";


export default {

  name: 'MainLayout',
  components: {
    navBar,
    registrationFormPopUp,
    logIn,
  },
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  created () {
    if (localStorage.access_token) {
      this.$store.dispatch("auth/authUserAction")
    }
  },

}
</script>
