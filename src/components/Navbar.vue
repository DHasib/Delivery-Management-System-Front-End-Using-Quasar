<template>
  <div style="max-width: 300px">
    <q-list padding class="rounded-borders text-blue-grey-7">
      <q-item v-if="isAuthenticated" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <img :src="getAuthUser && getAuthUser.profile.image ?  getAuthUser.profile.image : 'avatar/User-avatar.png' " />
          </q-avatar>
        </q-item-section>
        <q-item-section>{{getAuthUser.name}}</q-item-section>
      </q-item>

      <q-item v-if="!isAuthenticated" clickable @click="showLoginForm()" v-ripple>
        <q-item-section avatar>
          <q-icon name="login" />
        </q-item-section>

        <q-item-section>login</q-item-section>
      </q-item>

      <q-item v-if="!isAuthenticated" clickable @click="showRegForm()" v-ripple>
        <q-item-section avatar>
          <q-icon name="how_to_reg" />
        </q-item-section>

        <q-item-section>Register</q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item clickable to="home" @click="link = 'Home'" :active="link === 'Home'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>

        <q-item-section>Home</q-item-section>
      </q-item>

      <q-item v-if="isAuthenticated" clickable to="dashboard" :active="link === 'Dashboard'" @click="link = 'Dashboard'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="dashboard" />
        </q-item-section>

        <q-item-section>Dashboard</q-item-section>
      </q-item>

      <q-item v-if="isAuthenticated" to="/orderManagement" clickable :active="link === 'Orders'" @click="link = 'Orders'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="local_shipping" />
        </q-item-section>

        <q-item-section>Delivery</q-item-section>
      </q-item>

      <q-item v-if="isAdmin" to="merchantManagement" clickable v-ripple :active="link === 'trash'" @click="link = 'trash'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="supervisor_account" />
        </q-item-section>

        <q-item-section>Merchant Management</q-item-section>
      </q-item>

      <q-item v-if="isAdmin" to="/employeeManagement" clickable :active="link === 'Employees'" @click="link = 'Employees'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="group_add" />
        </q-item-section>

        <q-item-section>Employee Management</q-item-section>
      </q-item>

      <q-item v-if="isAdmin" to="vehicleManagement" clickable :active="link === 'message'" @click="link = 'message'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="two_wheeler" />
        </q-item-section>

        <q-item-section>Vehicle Management</q-item-section>
      </q-item>

      <q-item v-if="isAuthenticated" to="/transaction" clickable :active="link === 'Transaction'" @click="link = 'Transaction'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="payment" />
        </q-item-section>

        <q-item-section>Transaction</q-item-section>
      </q-item>

      <q-item v-if="isAdmin" to="/income" clickable :active="link === 'Income'" @click="link = 'Income'" active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="point_of_sale" />
        </q-item-section>

        <q-item-section>Income</q-item-section>
      </q-item>

      <!-- Optional -->
      <q-separator spaced />

      <div v-if="isAuthenticated">
        <q-item to="/seeting" clickable v-ripple :active="link === 'settings'" @click="link = 'settings'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>Settings</q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="link === 'help'" @click="link = 'help'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>Help</q-item-section>
        </q-item>

        <!-- login regidtration -->
        <q-separator spaced />

        <q-item clickable @click="logOut()" v-ripple :active="link === 'logOut'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>LogOut</q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Navbar',
  data () {
    return {
      link: 'Home'
    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "isAuthenticated", "isAdmin"]),
  },
  methods: {

    // loggedUser () {
    //   if (this.user) {
    //     this.authUser = this.user
    //     this.authUser.isLoggedIn = true
    //     // Object.assign(this.authUser, this.user);
    //   }
    // },

    showRegForm () {
      this.$store.commit("auth/regFrmMutation")
    },
    showLoginForm () {
      this.$store.commit("auth/loginFrmMutation")
    },

    logOut () {
      this.$store.dispatch('auth/attemptToLogOut')
        .then((response) => {
          this.$router.push('/home')
        }).catch(error => {

        })
    },
  },

}
</script>

<style lang="sass" scoped>
.my-menu-link
  color: white
  background: $purple-10
</style>
