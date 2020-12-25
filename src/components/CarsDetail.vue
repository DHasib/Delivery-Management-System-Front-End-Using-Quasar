<template>
  <div v-if="getAuthUser && getAuthUser.role === '1' ">
    <div class="self-center q-pt-xl text-h4 text-black text-weight-bolder">Vehicle Info</div>
    <q-table
      title="CRUD Vehicle Table"
      class="q-mt-xl"
      :data="data"
      :columns="columns"
      row-key="index"
      binary-state-sort
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input class="q-mr-xl" borderless dense debounce="400" v-model="filter" placeholder="Search by Reg-Number">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn class="q-mr-lg" color="teal" glossy icon="add" dense @click="showCreateCarForm =!showCreateCarForm" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="reg_num" :props="props">{{ props.row.reg_num }}</q-td>
          <q-td key="chassis_num" :props="props">{{ props.row.chassis_num }}</q-td>
          <q-td key="model" :props="props">{{ props.row.model }}</q-td>
          <q-td key="insurance_image" :props="props">
            <q-avatar v-if="props.row.insurance_image != 'not set Yet'">
              <img :src="props.row.insurance_image" />
            </q-avatar>
            <div v-else class="text-subtitle">Empty!</div>
          </q-td>
          <q-td key="memo_image" :props="props">
            <q-avatar v-if="!!props.row.memo_image">
              <img :src="props.row.memo_image" />
            </q-avatar>
            <div v-else class="text-subtitle">Empty!</div>
          </q-td>
          <q-td key="status" :props="props">{{props.row.status }}</q-td>
          <q-td key="name" :props="props">{{props.row.profile ? props.row.profile.user.name : "Not Assigned Yet" }}</q-td>
          <q-td key="created_at" :props="props">{{ new Date(props.row.created_at).toLocaleDateString()}}</q-td>
          <q-td key="service_charges" :props="props">
            <q-btn v-if="!!props.row.car_services.length" color="primary" glossy icon="visibility" dense @click="showServicesTableByID(props.row.id)" />
            <div v-else class="text-subtitle2">Not Repair Yet</div>
          </q-td>
          <!-- update car details section  -->
          <q-td key="action" :props="props">
            <q-btn class="q-mr-md" color="amber" glossy icon="edit" dense>
              <q-popup-edit :value="props.row.reg_num" transition-show="flip-up" transition-hide="flip-down" title="---Update Car Details---">
                <template v-slot="{ cancel }">
                  <q-input
                    autofocus
                    dense
                    :value="props.row.reg_num"
                    hint="Edit Reg-number"
                    :rules="[val => !!val || 'Field is required']"
                    @input="createNewCar('reg_num' , $event)"
                    :error="form.errors.has('reg_num')"
                    :error-message="form.errors.get('reg_num')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.chassis_num"
                    hint="Edit Chassis Number"
                    :rules="[val => !!val || 'Field is required']"
                    @input="createNewCar('chassis_num' , $event)"
                    :error="form.errors.has('chassis_num')"
                    :error-message="form.errors.get('chassis_num')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.model"
                    hint="Edit Model"
                    :rules="[val => !!val || 'Field is required']"
                    @input="createNewCar('model' , $event)"
                    :error="form.errors.has('model')"
                    :error-message="form.errors.get('model')"
                  />
                  <q-file
                    class="q-mt-md"
                    hint="Update Insurance Image"
                    :rules="[val => !!val || 'Field is required']"
                    v-model="insurance_imageName"
                    @input="convertImage('insurance_image', $event)"
                    :error="form.errors.has('insurance_image')"
                    :error-message="form.errors.get('insurance_image')"
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
                    hint="Update Memo Image"
                    :rules="[val => !!val || 'Field is required']"
                    v-model="memo_imageName"
                    @input="convertImage('memo_image', $event)"
                    :error="form.errors.has('memo_image')"
                    :error-message="form.errors.get('memo_image')"
                    dense
                    label="chose an image"
                    accept="image/*"
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>

                  <q-btn @click.stop="cancel" dense @click="updateCarDetails(props.row.id)" color="positive" label="Update" class="q-mt-md" />
                </template>
              </q-popup-edit>
            </q-btn>
            <q-btn dense @click="deleteCarDetails(props.row.id)" color="red" icon="delete" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- popup table for show  selected car service/repair details  -->
    <q-dialog v-model="showServicesTable" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="my-card">
        <!-- header section -->
        <q-bar class="bg-purple-10 text-white">
          <div class="text-h6 q-ma-xl">Vehicle Services History for this - {{ getCarDetails[carId] ? getCarDetails[carId].reg_num: "empty" }}</div>
          <q-space />
          <q-btn dense flat icon="close" color="red" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Repaired At</th>
              <th class="text-right">Repair Hardware</th>
              <th class="text-right">Hardware Price</th>
              <th class="text-right">Service Charge</th>
              <th class="text-right">Garage Name</th>
              <th class="text-right">Garage Address</th>
              <th class="text-right">Garage Phone Number</th>
            </tr>
          </thead>
          <tbody>
            <!-- v-for="carServices in props.row.car_services" :key="carServices.id" getCarDetails -->
            <tr v-show="!!getCarDetails[carId]" v-for="carServices in getCarDetails[carId] ? getCarDetails[carId].car_services : [] " :key="carServices.id">
              <td class="text-left">{{ new Date(carServices.created_at).toLocaleDateString()}}</td>
              <td class="text-right">{{ carServices.repair_hardware_name ? carServices.repair_hardware_name : "---" }}</td>
              <td class="text-right">{{ carServices.repair_hardware_price ? carServices.repair_hardware_price : "---" }}</td>
              <td class="text-right">{{ carServices.service_charge }}</td>
              <td class="text-right">{{ carServices.garage_name }}</td>
              <td class="text-right">{{ carServices.garage_address }}</td>
              <td class="text-right">{{ carServices.garage_phone_num }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>
    </q-dialog>

    <!-- create new car section  -->
    <q-dialog v-model="showCreateCarForm" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="my-card2">
        <!-- header section  -->
        <q-bar class="bg-purple-10 text-white">
          <div class="text-h6 q-ma-xl">Add New Vehicle</div>
          <q-space />
          <q-btn dense flat icon="close" color="red" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-mt-md">
          <q-input
            autofocus
            dense
            hint="Create Reg-number"
            placeholder="Insert Reg-number "
            v-model="form.reg_num"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('reg_num')"
            :error-message="form.errors.get('reg_num')"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            dense
            v-model="form.chassis_num"
            hint="Create Chassis Number"
            placeholder="Insert Chassis Number"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('chassis_num')"
            :error-message="form.errors.get('chassis_num')"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            dense
            v-model="form.model"
            hint="Create Model"
            placeholder="Insert Model "
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('model')"
            :error-message="form.errors.get('model')"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-file
            class="q-mt-md"
            hint="Create Insurance Image"
            placeholder="Insert Insurance Image"
            :rules="[val => !!val || 'Field is required']"
            v-model="insurance_imageName"
            @input="convertImage('insurance_image', $event)"
            :error="form.errors.has('insurance_image')"
            :error-message="form.errors.get('insurance_image')"
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
            hint="Update Memo Image"
            placeholder="Insert Memo Image"
            :rules="[val => !!val || 'Field is required']"
            v-model="memo_imageName"
            @input="convertImage('memo_image', $event)"
            :error="form.errors.has('memo_image')"
            :error-message="form.errors.get('memo_image')"
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
        <q-btn class="q-ma-md" color="primary" glossy label="save" dense @click="addNewCar" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { date } from 'quasar'
import Form from 'vform'

export default {
  name: "CarsDetails",
  data () {
    return {
      insurance_imageName: null,
      memo_imageName: null,
      showCreateCarForm: false,
      showServicesTable: false,
      carId: 0,
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      data: [],

      form: new Form({
        id: '',
      }),
      columns: [
        { align: 'left', name: 'reg_num', label: 'Reg-Number', field: 'reg_num' },
        { align: 'left', name: 'chassis_num', label: 'Chassis-Number', field: 'chassis_num', },
        { align: 'left', name: 'model', label: 'Car Model', field: 'model', },
        { align: 'left', name: 'insurance_image', label: 'Insurance-Image ', field: 'insurance_image' },
        { align: 'left', name: 'memo_image', label: 'Memo-Image', field: 'memo_image' },
        { align: 'left', name: 'status', label: 'Status', field: 'status' },
        { align: 'left', name: 'name', label: 'Assigned Driver', field: 'name' },
        { align: 'left', name: 'created_at', label: 'Registered At', field: 'created_at' },
        { align: 'left', name: 'service_charges', label: 'Repair/Services', field: 'service_charges' },
        { align: 'left', name: 'action', label: 'Action', field: 'action' }
      ],

    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "getCarDetails"]),
  },
  methods: {

    // assigned id using method 
    showServicesTableByID (index) {
      this.carId = ''
      let dataIndex = this.getCarDetails.findIndex(
        (e) => e.id == index
      );
      this.carId = dataIndex
      this.showServicesTable = true
    },

    // Create? AD  new car 
    addNewCar () {
      this.$store.dispatch('auth/createNewCarAction', this.form)
        .then(success => {
          this.showCreateCarForm = false
          this.insurance_imageName = null
          this.memo_imageName = null

          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
        })

    },

    // assing Car in form 
    createNewCar (key, evt) {
      this.form[key] = evt
    },

    // convert upload image 
    convertImage (key, file) {
      let reader = new FileReader()
      reader.onload = event => {

        this.form[key] = reader.result

        // this.form.image = reader.result
      }
      reader.readAsDataURL(file)
    },

    // Updated Car details charge 
    updateCarDetails (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateCarDetailsAction', this.form)
        .then(success => {
          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
          this.insurance_imageName = null
          this.memo_imageName = null
        })
    },

    // delete  Car details 
    deleteCarDetails (id) {

      let Id = { id: id }
      this.$store.dispatch('auth/deleteCarDetailsAction', Id)
        .then(success => {
          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
        })
    },

    // Search  Car details 
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      this.loading = true

      setTimeout(() => {
        this.pagination.rowsNumber = this.getRowsNumberCount(filter)

        const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

        const startRow = (page - 1) * rowsPerPage

        const returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

        this.data.splice(0, this.data.length, ...returnedData)

        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending

        this.loading = false
      }, 1500)
    },

    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? this.getCarDetails.filter(row => row.reg_num.includes(filter))
        : this.getCarDetails.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
            ? (a, b) => (a.reg_num > b.reg_num ? -1 : a.reg_num < b.reg_num ? 1 : 0)
            : (a, b) => (a.reg_num > b.reg_num ? 1 : a.reg_num < b.reg_num ? -1 : 0)
          )
          : (descending
            ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
            : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          )
        data.sort(sortFn)
      }

      return data.slice(startRow, startRow + count)
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount (filter) {
      if (!filter) {
        return this.getCarDetails.length
      }
      let count = 0
      this.getCarDetails.forEach((treat) => {
        if (treat.reg_num.includes(filter)) {
          ++count
        }
      })
      return count
    }
  },

  mounted () {
    setTimeout(() => {
      if (this.getAuthUser.role === '1') {
        this.onRequest({
          pagination: this.pagination,
          filter: null
        })
      }
    }, 4000);
  }

}
</script>

<style lang="stylus" scoped>
.my-card {
  width: 100%;
  max-width: 1000px;
}

.my-card2 {
  width: 20%;
  max-width: 1000px;
}
</style>
