
<template>
  <q-dialog v-model="showRegFrm" maximized transition-show="slide-down" transition-hide="rotate">
    <q-card class="card-size">
      <q-card-section>
        <div class="row">
          <div class="col-11 text-center text-h5 text-weight-bold">Create New Account</div>
          <div class="col-1 text-right">
            <q-btn round color="red" icon="close" size="sm" v-close-popup />
          </div>
        </div>
      </q-card-section>

      <q-separator />
      <q-item-section>
        <div class="row q-ma-xl">
          <!-- left side input section -->
          <div class="col-6">
            <q-form @submit.prevent="attemptToRegister" @keydown="form.onKeydown($event)" class="q-gutter-md">
              <!-- first row -->
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-item-label class="text-bold">
                    Full Name
                    <strong class="text-red">*</strong>
                  </q-item-label>
                  <q-input
                    clearable
                    ref="name"
                    class="q-mt-md"
                    filled
                    v-model="form.name"
                    :rules="[val => !!val || 'Field is required']"
                    :error="form.errors.has('name')"
                    :error-message="form.errors.get('name')"
                  />
                </div>
                <div class="col">
                  <q-item-label class="text-bold">
                    Email Address
                    <strong class="text-red">*</strong>
                  </q-item-label>
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
              </div>

              <!-- second row -->
              <div class="row q-col-gutter-md q-mt-md">
                <div class="col">
                  <q-item-label class="text-bold">
                    Contact No
                    <strong class="text-red">*</strong>
                  </q-item-label>
                  <div class="col-7">
                    <q-input
                      clearable
                      ref="phone_num"
                      class="q-mt-md q-pa-none"
                      v-model="form.phone_num"
                      filled
                      mask="### - #### - ####"
                      unmasked-value
                      :rules="[val => !!val || 'Field is required']"
                      :error="form.errors.has('phone_num')"
                      :error-message="form.errors.get('phone_num')"
                    />
                  </div>
                </div>

                <div class="col">
                  <q-item-label class="text-bold">
                    Address
                    <strong class="text-red">*</strong>
                  </q-item-label>
                  <q-input
                    clearable
                    ref="address"
                    class="q-mt-md"
                    filled
                    v-model="form.address"
                    :rules="[val => !!val || 'Field is required']"
                    :error="form.errors.has('address')"
                    :error-message="form.errors.get('address')"
                  />
                </div>
              </div>

              <!-- 3rd row -->
              <div class="row q-col-gutter-md q-mt-md">
                <div class="col">
                  <q-item-label class="text-bold">
                    Password
                    <strong class="text-red">*</strong>
                  </q-item-label>
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
                <div class="col">
                  <q-item-label class="text-bold">
                    Confirm Password
                    <strong class="text-red">*</strong>
                  </q-item-label>
                  <q-input
                    class="q-mt-md"
                    clearable
                    ref="confirm_password"
                    v-model="form.password_confirmation"
                    filled
                    :type="showPasswordConfirmation ? 'password' : 'text'"
                    :rules="[(val) => !!val || 'Field is required']"
                    :error="form.errors.has('password')"
                    :error-message="form.errors.get('password')"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="
                          showPasswordConfirmation
                            ? 'visibility_off'
                            : 'visibility'
                        "
                        class="cursor-pointer"
                        @click="
                          showPasswordConfirmation = !showPasswordConfirmation
                        "
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- 4th row -->
              <div class="row q-mt-xl">
                <q-toggle
                  v-model="form.accept_terms"
                  color="green"
                  checked-icon="check"
                  label="Do you agree with the terms & conditions?"
                  unchecked-icon="clear"
                >
                  <template v-if="form.errors.has('accept_terms')">
                    <div class="text-caption" style="color:red">{{form.errors.get('accept_terms')}}</div>
                  </template>
                </q-toggle>
              </div>

              <div class="row q-mt-md">
                <q-btn color="primary" label="Get Started" type="submit" style="width: 556px" readonly />
              </div>
            </q-form>
          </div>

          <!-- right side logo section -->
          <div class="col-6 self-center text-center">
            <div class="text-h6 q-mb-lg">Alredy have an account?</div>
            <q-btn @click="showLoginForm" color="indigo-10">Login Now</q-btn>
          </div>
        </div>
      </q-item-section>
    </q-card>
  </q-dialog>
</template>


<script>
import Form from 'vform'

export default {
  Name: "Registration Form",
  data () {
    return {
      showPassword: true,
      showPasswordConfirmation: true,

      form: new Form({
        name: "",
        email: "",
        phone_num: "",
        password: "",
        password_confirmation: "",
        accept_terms: false,
      })
    }
  },
  computed: {
    //open registration form
    showRegFrm: {
      get () {
        return this.$store.getters["auth/getRegForm"];
      },
      set () {
        this.$store.commit("auth/regFrmMutation");
      },
    },
  },

  methods: {
    attemptToRegister () {
      if (this.form.accept_terms !== true) {
        this.$q.notify({
          color: 'negative',
          message: 'You need to accept Terms & Conditions to submit the form',
          position: "top",
        })
      } else {
        this.$store.dispatch('auth/attemptToRegister', this.form)
          .then(success => {
            this.$router.push('/dashboard')
            this.showRegFrm = false
            // window.location.href = '/#/UserProfile'
          })
      }
    },
    showLoginForm () {
      this.showRegFrm = false
      this.$store.commit("auth/loginFrmMutation")
    }
  },




};
</script>

<style lang="stylus" scoped>
.card-size {
  width: 1100px;
  height: 699px;
}

.radiuscheck {
  border-radius: 25px;
}
</style>
