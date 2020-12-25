<template>
  <div>
    <div class="row justify-center page-header-banner">
      <div class="self-center q-pt-xl text-h2 text-black text-weight-bolder">Seetings</div>
    </div>

    <q-card class="my-card q-pa-xl" flat bordered>
      <!-- Image Section-->

      <q-card-section vertical class="q-px-xl" align="left">
        <q-list>
          <q-item class="text-subtitle1 text-weight-bold" style="width: 596px">
            <q-item-section class="q-pl-xl">
              <q-item-label>Upload Image:</q-item-label>
            </q-item-section>
            <q-item-section>
              <div class="image-frame q-pa-sm">
                <div v-show="!hasImage" class="text-h6 text-center q-pt-lg text-grey-5 text-weight-bolder">Image</div>
                <canvas v-show="hasImage" ref="canvas" class="full-width full-height" height="80" width="120" />
              </div>
              <div class="text-center p-a-md q-my-md">
                <q-file dense label="chose an image" accept="image/*" v-model="uploadImageName" @input="showUploadImage" outlined>
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
              <div v-if="hasImage" class="text-h6 text-weight-bold" align="right">
                <q-btn color="warning" size="md" label="Upload " @click="updateUserInfo()" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <!-- Personal info Title -->

        <q-card-actions align="center" class="q-mt-xl q-pb-lg">
          <q-separator />
          <div class="text-h6 text-weight-bold text-center q-pt-sm q-my-sm">
            <q-btn flat :icon="editMode ? 'close' : 'img:icons/Layer 2.png'" :label="!editMode ? 'Edt' : 'cancel Edit'" @click="editMode =!editMode" />User Info
          </div>
        </q-card-actions>
        <q-separator />

        <q-list v-for="(item, name) in  mainInfo" :key="name">
          <q-item class="text-subtitle1 text-weight-bold" style="width: 596px">
            <q-item-section class="q-pl-xl">
              <q-item-label>{{name}}:</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-input
                :value="getAuthUser ? getAuthUser[item] : null"
                @input="updatedValue(item, $event)"
                :readonly="!editMode"
                :borderless="!editMode"
                :filled="editMode"
                placeholder="Insert Your Information"
                :error="form.errors.has(item)"
                :error-message="form.errors.get(item)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-list v-for="(item, name) in  subInfo" :key="name">
          <q-item class="text-subtitle1 text-weight-bold" style="width: 596px">
            <q-item-section class="q-pl-xl">
              <q-item-label>{{name}}:</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-input
                :value="getAuthUser && getAuthUser.profile ? getAuthUser.profile[item] : null"
                @input="updatedValue(item, $event)"
                :readonly="!editMode"
                :borderless="!editMode"
                :filled="editMode"
                placeholder="Insert Your Information"
                :error="form.errors.has(item)"
                :error-message="form.errors.get(item)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator />
        <div class="text-h6 q-pt-lg text-black text-weight-bolder">
          <u>Change Password</u>
        </div>
        <q-list v-for="(item, name) in  changePass" :key="name">
          <q-item class="text-subtitle1 text-weight-bold" style="width: 596px">
            <q-item-section class="q-pl-xl">
              <q-item-label>{{name}}:</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-input
                clearable
                v-model="form[item]"
                :readonly="!editMode"
                :borderless="!editMode"
                :filled="editMode"
                placeholder="Insert Your Information"
                :type="showPassword ? 'password' : 'text'"
                :error="form.errors.has(item)"
                :error-message="form.errors.get(item)"
              >
                <template v-if="editMode" v-slot:append>
                  <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section v-show="editMode" align="center" class="q-pa-xl">
        <div class="text-h6 text-weight-bold">
          <q-btn color="indigo-10" size="lg" label="Update Info" @click="updateUserInfo()" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from 'vform'
export default {
  name: 'Seetings',
  data () {
    return {
      hasImage: false,
      showPassword: true,
      editMode: false,
      uploadImageName: null,
      mainInfo: {
        'Name': 'name',
        'Eail': 'email',
        'Address': 'address',
        'Phone_num': 'phone_num',
      },
      subInfo: {
        'Company_name': 'company_name',
        'About': 'about',
      },
      changePass: {
        'OldPass': 'oldPass',
        'NewPass': 'newPass',
      },
      form: new Form({
      }),
    }
  },

  computed: {
    ...mapGetters('auth', ["getAuthUser", "isAuthenticated"]),
  },
  methods: {
    updatedValue (key, evt) {
      let newValue = {
        key: key,
        data: evt
      }
      this.$store.commit("auth/updatedAuthUserMutation", newValue);
      this.form[key] = evt
    },
    updateUserInfo () {
      this.$store.dispatch('auth/updateProfileAction', this.form)
        .then(success => {
          this.hasImage = false
          this.$q.notify({
            color: 'positive',
            message: 'Updated User Information Successfully',
            position: "top-right",
          })
          this.editMode = false
          this.uploadImageName = null
        })
    },

    // convert upload image 
    showUploadImage (file) {

      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')

      let reader = new FileReader()

      reader.onload = event => {

        let img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height

          context.drawImage(img, 0, 0)
        }
        this.hasImage = true
        img.src = event.target.result
        this.form.image = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
};
</script>
 <style  lang="stylus" scoped>
 .page-header-banner {
   height: 300px;
   background-image: url('https://photoadventure.co.nz/img/wedding/wedding-photography-auckland-raglan-03.jpg'); // photoadventure.co.nz/img/wedding/wedding-photography-auckland-raglan-03.jpg;
   background-position: center;
   background-repeat: no-repeat;
   background-size: cover;
 }

 .image-frame {
   height: 96px;
   width: 136px;
   border: 2px solid $grey-10;
   border-radius: 10px;
 }
</style>
