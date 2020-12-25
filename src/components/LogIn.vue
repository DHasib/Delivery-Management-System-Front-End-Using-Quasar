<template>
  <q-dialog v-model="showloginFrm" maximized transition-show="slide-down" transition-hide="rotate">
    <q-card class="login-card-size">
      <q-card-section>
        <div class="row">
          <div class="col-11 text-center text-h5 text-weight-bold">Login To My Account</div>
          <div class="col-1 text-right">
            <q-btn round color="red" icon="close" size="sm" v-close-popup />
          </div>
        </div>
      </q-card-section>

      <q-separator />
      <q-item-section class="q-pa-none">
        <div class="row q-mx-xl q-mt-lg">
          <!-- left side input section -->
          <q-form @submit.prevent="attemptToLogin" @keydown="form.onKeydown($event)" class="q-gutter-md">
            <div class="col-6">
              <div class="text-h4 text-weight-bold q-pb-lg">Welcome Back!</div>
              <!-- 3rd row -->
              <div class="text-h6 text-red text-weight-bold q-pb-lg">{{form.errors.has('incorrect')? form.errors.get('incorrect') : null}}</div>

              <div class="col-12 q-mb-md">
                <q-item-label class="text-bold">Email Address</q-item-label>
                <q-input
                  clearable
                  ref="email"
                  class="q-mt-md"
                  filled
                  v-model="form.email"
                  :rules="[val => !!val || 'Field is required']"
                  :error="form.errors.has('email')"
                  :error-message="form.errors.get('email')"
                />
              </div>
              <div class="col-12 q-mb-md">
                <q-item-label class="text-bold">Password</q-item-label>
                <q-input
                  clearable
                  ref="password"
                  class="q-mt-md"
                  v-model="form.password"
                  filled
                  :type="showPassword ? 'password' : 'text'"
                  :rules="[(val) => !!val || 'Field is required']"
                  :error="form.errors.has('password')"
                  :error-message="form.errors.get('password')"
                >
                  <template v-slot:append>
                    <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
                  </template>
                </q-input>
              </div>

              <!-- 4th row -->
              <div class="col-12 q-mb-md">
                <div class="q-gutter-sm">
                  <q-toggle v-model="form.remember_me" label="Remember Password" />
                </div>
              </div>
              <div class="col-12 q-mb-md">
                <q-btn color="purple-10" label="Login" type="submit" size="md" style="width: 389px" />
              </div>
            </div>
          </q-form>
          <!-- right side logo section -->
          <div class="col-6 self-center text-center">
            <div class="text-h6 q-mb-lg">Don't have an account?</div>
            <q-btn @click="showRegisterForm" color="indigo-10">Regiter Now</q-btn>
          </div>
        </div>
      </q-item-section>
    </q-card>
  </q-dialog>
</template>



<script>
import Form from 'vform'
import { mapActions } from 'vuex'
export default {
  Name: "LogIn",

  data () {
    return {
      showPassword: true,
      form: new Form({
        email: "",
        password: "",
        remember_me: false,
      })
    };
  },
  computed: {
    //open registration form
    showloginFrm: {
      get () {
        return this.$store.getters['auth/getLoginForm']
      },
      set () {
        this.$store.commit("auth/loginFrmMutation")
      }
    },
  },
  methods: {
    attemptToLogin () {
      this.$store.dispatch('auth/attemptToLogin', this.form)
        .then(success => {
          this.$router.push('/dashboard')
          this.showloginFrm = false
          // window.location.href = '/#/UserProfile'
        })
    },
    showRegisterForm () {
      this.showloginFrm = false
      this.$store.commit("auth/regFrmMutation")
    }
  },
  // created () {
  //   if (localStorage.access_token) {
  //     this.$store.dispatch("auth/authUserAction")
  //   }
  // }

};
</script>

<style lang="stylus" scoped>
.login-card-size {
  width: 900px;
  height: 661px;
}
</style>
