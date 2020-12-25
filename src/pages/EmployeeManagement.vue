<template>
  <div class="row q-mx-xl q-mt-xl">
    <!-- //Employee Table Area  -->
    <div v-if="getAuthUser && getAuthUser.role === '1' ">
      <div class="self-center q-pt-xl text-h4 text-black text-weight-bolder">Employee Info</div>
      <q-table title="Employee Table" class="q-mt-xl" :data="getEmployee" :columns="columns" row-key="id" binary-state-sort>
        <template v-slot:top-right>
          <q-btn color="teal" glossy icon="add" dense @click="showCreateEmployeeForm =!showCreateEmployeeForm" />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="email" :props="props">{{ props.row.email }}</q-td>
            <q-td key="phone_num" :props="props">{{ props.row.phone_num }}</q-td>
            <q-td key="address" :props="props">{{ props.row.address }}</q-td>
            <q-td key="about" :props="props">
              <q-btn color="primary" icon="visibility" dense>
                <q-popup-edit :value="form.about" title="About His/Her Self">{{props.row.profile.about ? props.row.profile.about : '' }}</q-popup-edit>
              </q-btn>
            </q-td>
            <q-td key="image" :props="props">
              <q-avatar v-if="props.row.profile.image">
                <img :src="props.row.profile.image" />
              </q-avatar>
              <div v-else class="text-subtitle2">Empty!</div>
            </q-td>
            <q-td key="national_id_photo" :props="props">
              <q-avatar v-if="props.row.profile.national_id_photo">
                <img :src="props.row.profile.national_id_photo" />
              </q-avatar>
              <div v-else class="text-subtitle2">Empty!</div>
            </q-td>
            <q-td key="driving_license_photo" :props="props">
              <q-avatar v-if="props.row.profile.driving_license_photo">
                <img :src="props.row.profile.driving_license_photo" />
              </q-avatar>
              <div v-else class="text-subtitle2">Empty!</div>
            </q-td>
            <q-td key="salary_id" :props="props">{{ props.row.profile.employee_salary ? props.row.profile.employee_salary.salary_amount : "not set Yet" }}</q-td>
            <q-td key="zone_id" :props="props">{{ props.row.profile.zone ? props.row.profile.zone.name : "not set Yet" }}</q-td>
            <q-td key="assign_car" :props="props">{{ props.row.profile.assign_car ? props.row.profile.assign_car.reg_num : "Not Assigned Yet" }}</q-td>
            <q-td key="role" :props="props">{{ props.row.profile.user.role === "3" ? "Driver" : props.row.profile.user.role === "2" ? "Modarator" : "" }}</q-td>

            <q-td key="action" :props="props">
              <q-btn class="q-mr-md" color="amber" glossy icon="edit" dense>
                <q-popup-edit :value="props.row.name" transition-show="flip-up" transition-hide="flip-down" title="-Update Employee Details-">
                  <template v-slot="{ cancel }">
                    <q-input
                      autofocus
                      dense
                      :value="props.row.name"
                      hint="Edit Name"
                      :rules="[val => !!val || 'Field is required']"
                      @input="createNewEmployee('name' , $event)"
                      :error="form.errors.has('name')"
                      :error-message="form.errors.get('name')"
                    />
                    <q-input
                      autofocus
                      dense
                      :value="props.row.address"
                      hint="Edit Address"
                      :rules="[val => !!val || 'Field is required']"
                      @input="createNewEmployee('address' , $event)"
                      :error="form.errors.has('address')"
                      :error-message="form.errors.get('address')"
                    />
                    <q-input
                      autofocus
                      dense
                      :value="props.row.email"
                      hint="Edit Email"
                      :rules="[val => !!val || 'Field is required']"
                      @input="createNewEmployee('email' , $event)"
                      :error="form.errors.has('email')"
                      :error-message="form.errors.get('email')"
                    />
                    <q-input
                      autofocus
                      dense
                      :value="props.row.phone_num"
                      hint="Edit Mobile"
                      :rules="[val => !!val || 'Field is required']"
                      @input="createNewEmployee('phone_num' , $event)"
                      :error="form.errors.has('phone_num')"
                      :error-message="form.errors.get('phone_num')"
                    />
                    <q-input
                      autofocus
                      dense
                      :value="props.row.profile.about"
                      hint="Edit About"
                      :rules="[val => !!val || 'Field is required']"
                      @input="createNewEmployee('about' , $event)"
                      :error="form.errors.has('about')"
                      :error-message="form.errors.get('about')"
                    />

                    <q-file
                      class="q-mt-md"
                      hint="Update National Id Image"
                      :rules="[val => !!val || 'Field is required']"
                      v-model="national_id_imageName"
                      @input="convertImage('national_id_photo', $event)"
                      :error="form.errors.has('national_id_photo')"
                      :error-message="form.errors.get('national_id_photo')"
                      dense
                      label="chose an image"
                      accept="image/*"
                      outlined
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" />
                      </template>
                    </q-file>

                    <q-file
                      v-show="props.row.profile.user.role === '3' "
                      class="q-mt-md"
                      hint="Update Driving License Image"
                      :rules="[val => !!val || 'Field is required']"
                      v-model="driving_license_imageName"
                      @input="convertImage('driving_license_photo', $event)"
                      :error="form.errors.has('driving_license_photo')"
                      :error-message="form.errors.get('driving_license_photo')"
                      dense
                      label="chose an image"
                      accept="image/*"
                      outlined
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" />
                      </template>
                    </q-file>

                    <q-file
                      class="q-mt-md"
                      hint="Update Profile Image"
                      :rules="[val => !!val || 'Field is required']"
                      v-model="profile_imageName"
                      @input="convertImage('image', $event)"
                      :error="form.errors.has('image')"
                      :error-message="form.errors.get('image')"
                      dense
                      label="chose an image"
                      accept="image/*"
                      outlined
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" />
                      </template>
                    </q-file>

                    <q-select
                      transition-show="flip-up"
                      transition-hide="flip-down"
                      hint="Update Employee Type"
                      v-model="form.role"
                      :options="userType"
                      option-label="value"
                      option-value="id"
                      label="Update Employee Type"
                      emit-value
                      map-options
                      class="q-mt-xs"
                      outlined
                      :error="form.errors.has('role')"
                      :error-message="form.errors.get('role')"
                    />

                    <q-select
                      v-show="!!getAvailableCarDetails.length &&  props.row.profile.user.role === '3' "
                      transition-show="flip-up"
                      transition-hide="flip-down"
                      hint="Change Assigned Car"
                      v-model="form.assign_car_id"
                      :options="getAvailableCarDetails"
                      option-label="reg_num"
                      option-value="id"
                      label="Select to Change Car "
                      emit-value
                      map-options
                      class="q-mt-xs"
                      outlined
                      :error="form.errors.has('reg_num')"
                      :error-message="form.errors.get('reg_num')"
                    />

                    <q-select
                      transition-show="flip-up"
                      transition-hide="flip-down"
                      hint="Change Assigned Salary"
                      v-model="form.salary_id"
                      :options="getSalary"
                      option-label="salary_amount"
                      option-value="id"
                      label="Select to Change Salary"
                      emit-value
                      map-options
                      class="q-mt-xs"
                      outlined
                      :error="form.errors.has('salary_amount')"
                      :error-message="form.errors.get('salary_amount')"
                    />

                    <q-select
                      transition-show="flip-up"
                      transition-hide="flip-down"
                      hint="Change Assigned Zone"
                      v-model="form.zone_id"
                      :options="getZone"
                      option-label="name"
                      option-value="id"
                      label="Select to Change Zone "
                      emit-value
                      map-options
                      class="q-mt-xs"
                      outlined
                      :error="form.errors.has('name')"
                      :error-message="form.errors.get('name')"
                    />

                    <q-btn @click.stop="cancel" dense @click="updateEmployeeDetails(props.row.id)" color="positive" label="Update" class="q-mt-md" />
                    <span v-if="!getAvailableCarDetails.length" class="text-subtitle2">Car Not Available</span>
                  </template>
                </q-popup-edit>
              </q-btn>
              <q-btn dense @click="deleteEmployee(props.row.id)" color="red" icon="delete" />
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- create new car section  -->
      <q-dialog v-model="showCreateEmployeeForm" persistent transition-show="flip-down" transition-hide="flip-up">
        <q-card class="my-card2">
          <q-bar class="bg-purple-10 text-white">
            <div class="text-h6 q-ma-xl">Add New Employee</div>
            <q-space />
            <q-btn dense flat icon="close" color="red" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section class="q-mt-md">
            <q-input
              autofocus
              dense
              v-model="form.name"
              hint="Create Name"
              placeholder="add new Name"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('name')"
              :error-message="form.errors.get('name')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.address"
              hint="Create Address"
              placeholder="add new address"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('address')"
              :error-message="form.errors.get('address')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.email"
              hint="Create Email"
              placeholder="add new Email"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('email')"
              :error-message="form.errors.get('email')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.phone_num"
              hint="Create Mobile number"
              placeholder="add new Mobile number"
              :rules="[val => !!val || 'Field is required']"
              @input="createNewEmployee('phone_num' , $event)"
              :error="form.errors.has('phone_num')"
              :error-message="form.errors.get('phone_num')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.about"
              hint="Create About"
              placeholder="add Your Self"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('about')"
              :error-message="form.errors.get('about')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-file
              class="q-mt-md"
              hint="Update National Id Image"
              :rules="[val => !!val || 'Field is required']"
              v-model="national_id_imageName"
              @input="convertImage('national_id_photo', $event)"
              :error="form.errors.has('national_id_photo')"
              :error-message="form.errors.get('national_id_photo')"
              dense
              label="chose an image"
              accept="image/*"
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-file
              class="q-mt-md"
              hint="Update Driving License Image"
              :rules="[val => !!val || 'Field is required']"
              v-model="driving_license_imageName"
              @input="convertImage('driving_license_photo', $event)"
              :error="form.errors.has('driving_license_photo')"
              :error-message="form.errors.get('driving_license_photo')"
              dense
              label="chose an image"
              accept="image/*"
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-file
              class="q-mt-md"
              hint="Update Profile Image"
              :rules="[val => !!val || 'Field is required']"
              v-model="profile_imageName"
              @input="convertImage('image', $event)"
              :error="form.errors.has('image')"
              :error-message="form.errors.get('image')"
              dense
              label="chose an image"
              accept="image/*"
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              transition-show="flip-up"
              transition-hide="flip-down"
              hint="Change Assigned Car"
              v-model="form.assign_car_id"
              :options="getAvailableCarDetails"
              option-label="reg_num"
              option-value="id"
              label="Select to Change Car "
              emit-value
              map-options
              class="q-mt-xs"
              outlined
              :error="form.errors.has('assign_car_id')"
              :error-message="form.errors.get('assign_car_id')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              transition-show="flip-up"
              transition-hide="flip-down"
              hint="Update Employee Type"
              v-model="form.role"
              :options="userType"
              option-label="value"
              option-value="id"
              label="Update Employee Type"
              emit-value
              map-options
              class="q-mt-xs"
              outlined
              :error="form.errors.has('role')"
              :error-message="form.errors.get('role')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              transition-show="flip-up"
              transition-hide="flip-down"
              hint="Add Assigned Salary"
              placeholder="Assigned Salary"
              v-model="form.salary_id"
              :options="getSalary"
              option-label="salary_amount"
              option-value="id"
              label="Select to Change Salary"
              emit-value
              map-options
              class="q-mt-xs"
              outlined
              :error="form.errors.has('salary_id')"
              :error-message="form.errors.get('salary_id')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              transition-show="flip-up"
              transition-hide="flip-down"
              hint="add Assigned Zone"
              placeholder="Assigned Zone"
              v-model="form.zone_id"
              :options="getZone"
              option-label="name"
              option-value="id"
              label="Select to Change Zone "
              emit-value
              map-options
              class="q-mt-xs"
              outlined
              :error="form.errors.has('zone_id')"
              :error-message="form.errors.get('zone_id')"
            />
          </q-card-section>

          <q-btn class="q-ma-md" color="primary" glossy label="save" dense @click="addNewEmployee" />
        </q-card>
      </q-dialog>
    </div>

    <!-- Employee Salary Table  -->
    <div class="col-5 q-mt-xl q-pr-xl">
      <salary></salary>
    </div>
    <!-- /Employee Salary Table  -->

    <!-- Zone Table  -->
    <div class="col-6 q-mt-xl q-pr-xl">
      <zone></zone>
    </div>
  </div>
</template>

<script>
import salary from 'components/Salary'
import zone from 'components/Zone'

import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "EmployeeManagement",
  components: {
    salary,
    zone,
  },

  computed: {
    ...mapGetters('auth', ["getAuthUser", "getEmployee", "getAvailableCarDetails", 'getSalary', 'getZone']),
  },
  data () {
    return {
      showCreateEmployeeForm: false,
      national_id_imageName: null,
      driving_license_imageName: null,
      profile_imageName: null,

      userType: [
        {
          id: 3,
          value: "Driver"
        },
        {
          id: 2,
          value: " modarator"
        }
      ],

      form: new Form({
        id: ''
      }),

      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: row => row.name,
        },
        { align: 'left', name: 'email', align: 'left', label: 'E-mail', field: 'email' },
        { align: 'left', name: 'phone_num', label: 'Mobile', field: 'phone_num', },
        { align: 'left', name: 'address', label: 'Address', field: 'address', },
        { align: 'left', name: 'about', label: 'About', field: 'about' },
        { align: 'left', name: 'image', label: 'Image', field: 'image', },

        { align: 'left', name: 'national_id_photo', label: 'National Id', field: 'national_id_photo', },
        { align: 'left', name: 'driving_license_photo', label: 'Driving License', field: 'driving_license_photo', },
        { align: 'left', name: 'salary_id', label: 'Salary', field: 'salary_id', },
        { align: 'left', name: 'zone_id', label: 'Zone', field: 'zone_id', },
        { align: 'left', name: 'assign_car', label: 'Assigned Car', field: 'assign_car', },
        { align: 'left', name: 'role', label: 'Employee Type', field: 'role', },
        { align: 'right', name: 'action', label: 'Action', field: 'action' }
      ],

    }
  },
  methods: {
    // Create? AD  new Employee 
    addNewEmployee () {
      this.$store.dispatch('auth/createNewEmployeeAction', this.form)
        .then(success => {
          this.showCreateEmployeeForm = false
          this.national_id_imageName = null
          this.driving_license_imageName = null
          this.profile_imageName = null
        })

    },

    // assing Employee in form 
    createNewEmployee (key, evt) {
      this.form[key] = evt
    },

    // convert upload image 
    convertImage (key, file) {
      let reader = new FileReader()
      reader.onload = event => {

        this.form[key] = reader.result
      }
      reader.readAsDataURL(file)
    },

    // Updated Employee details charge 
    updateEmployeeDetails (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateEmployeeDetailsAction', this.form)
        .then(success => {
          this.national_id_imageName = null
          this.driving_license_imageName = null
          this.profile_imageName = null
        })
    },

    // delete  Car details 
    deleteEmployee (id) {

      let Id = { id: id }
      this.$store.dispatch('auth/deleteEmployeeAction', Id)
        .then(success => {
          this.national_id_imageName = null
          this.driving_license_imageName = null
          this.profile_imageName = null
        })
    },


  },
  mounted () {
    setTimeout(() => {
      if (this.getAuthUser.role === '1') {
        this.$store.dispatch('auth/carDetailsAction')
        this.$store.dispatch('auth/getSalary')//action
        this.$store.dispatch('auth/getZone')//action
        this.$store.dispatch('auth/getEmployeeAction')//action
        this.$store.dispatch('auth/getFreeCarAction')//action
      }
    }, 3000);
  }

}
</script>

<style lang="stylus" scoped>
.my-card2 {
  width: 20%;
  max-width: 1000px;
}
</style>
