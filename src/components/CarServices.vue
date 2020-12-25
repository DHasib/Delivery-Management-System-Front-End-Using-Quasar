<template>
  <!--Car Services Category  Table  -->
  <div v-if="getAuthUser && getAuthUser.role === '1' ">
    <div class="self-center text-h5 text-black text-weight-bolder">Vehicle Services/Repair Details</div>
    <q-table title="CRUD Vehicle Services/Repair Table" class="q-my-xl" :data="getCarServices" :columns="columns" row-key="id" binary-state-sort>
      <template v-slot:top-right>
        <q-btn color="teal" glossy icon="add" dense @click="showCreateCarServiceForm =!showCreateCarServiceForm" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" clickable>
          <q-td key="model" :props="props">{{props.row.car_details ? props.row.car_details.model : 'Delete Car'}}</q-td>
          <q-td key="repair_hardware_name" :props="props">{{props.row.repair_hardware_name ? props.row.repair_hardware_name : "no Need" }}</q-td>
          <q-td key="repair_hardware_price" :props="props">{{props.row.repair_hardware_price ? props.row.repair_hardware_price : "no Need" }}</q-td>
          <q-td key="service_charge" :props="props">{{props.row.service_charge }}</q-td>
          <q-td key="garage_name" :props="props">{{props.row.garage_name }}</q-td>
          <q-td key="garage_address" :props="props">{{props.row.garage_address }}</q-td>
          <q-td key="garage_phone_num" :props="props">{{props.row.garage_phone_num }}</q-td>
          <q-td
            key="name"
            :props="props"
          >{{props.row.car_details && props.row.car_details.profile ? props.row.car_details.profile.user.name : "Not Assigened Yes" }}</q-td>
          <q-td key="action" :props="props">
            <q-btn class="q-ml-md" color="amber" glossy icon="edit" dense>
              <q-popup-edit
                :value="props.row.garage_name"
                transition-show="flip-up"
                transition-hide="flip-down"
                title="Update Vehicle Repair Details"
                max-width="450px"
              >
                <template v-slot="{ cancel }">
                  <q-select
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="form.model"
                    :options="getCarDetails"
                    option-label="model"
                    option-value="id"
                    label="Update Car Model"
                    emit-value
                    map-options
                    class="q-mt-xs"
                    outlined
                    :error="form.errors.has('model')"
                    :error-message="form.errors.get('model')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.repair_hardware_name"
                    hint="Edit Hardware Name"
                    @input="newCarService('repair_hardware_name' , $event)"
                    :error="form.errors.has('repair_hardware_name')"
                    :error-message="form.errors.get('repair_hardware_name')"
                    class="q-mt-md"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.repair_hardware_price "
                    hint="Edit Hardware Price"
                    @input="newCarService('repair_hardware_price' , $event)"
                    :error="form.errors.has('repair_hardware_price')"
                    :error-message="form.errors.get('repair_hardware_price')"
                    class="q-mt-md"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.service_charge "
                    hint="Edit Service Charge"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newCarService('service_charge' , $event)"
                    :error="form.errors.has('service_charge')"
                    :error-message="form.errors.get('service_charge')"
                    class="q-mt-md"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.garage_name "
                    hint="Edit Garage Name"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newCarService('garage_name' , $event)"
                    :error="form.errors.has('garage_name')"
                    :error-message="form.errors.get('garage_name')"
                    class="q-mt-md"
                  />

                  <q-input
                    autofocus
                    dense
                    :value="props.row.garage_address "
                    hint="Edit Garage Address"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newCarService('garage_address' , $event)"
                    :error="form.errors.has('garage_address')"
                    :error-message="form.errors.get('garage_address')"
                    class="q-mt-md"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.garage_phone_num "
                    hint="Edit Mobile Number"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newCarService('garage_phone_num' , $event)"
                    :error="form.errors.has('garage_phone_num')"
                    :error-message="form.errors.get('garage_phone_num')"
                    class="q-mt-md"
                  />
                  <q-btn class="q-mt-md" dense color="positive" label="Update" @click.stop="cancel" @click="updatCarService(props.row.id)" />
                </template>
              </q-popup-edit>
            </q-btn>
            <q-btn class="q-ml-md" color="red" glossy icon="delete" dense @click="deleteCarService(props.row.id)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- create new Service Charge Zone  -->
    <q-dialog v-model="showCreateCarServiceForm" persistent transition-show="flip-down" transition-hide="flip-up" class="full-width">
      <q-card class="my-card2">
        <q-bar class="bg-purple-10 text-white">
          <div class="text-h6 q-ma-xl">Create New Vehicle Repair</div>
          <q-space />
          <q-btn dense flat icon="close" color="red" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-select
            transition-show="flip-up"
            transition-hide="flip-down"
            v-model="form.car_id"
            :options="getCarDetails"
            option-label="model"
            option-value="id"
            label="Update Car Model"
            emit-value
            map-options
            outlined
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('car_id')"
            :error-message="form.errors.get('car_id')"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            autofocus
            dense
            v-model="form.repair_hardware_name"
            hint="Edit Hardware Name"
            :error="form.errors.has('repair_hardware_name')"
            :error-message="form.errors.get('repair_hardware_name')"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            autofocus
            dense
            v-model="form.repair_hardware_price "
            hint="Edit Hardware Price"
            :error="form.errors.has('repair_hardware_price')"
            :error-message="form.errors.get('repair_hardware_price')"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            autofocus
            dense
            v-model="form.service_charge "
            hint="Edit Service Charge"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('service_charge')"
            :error-message="form.errors.get('service_charge')"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            autofocus
            dense
            v-model="form.garage_name "
            hint="Edit Garage Name"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('garage_name')"
            :error-message="form.errors.get('garage_name')"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            autofocus
            dense
            v-model="form.garage_address "
            hint="Edit Garage Address"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('garage_address')"
            :error-message="form.errors.get('garage_address')"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            autofocus
            dense
            v-model="form.garage_phone_num "
            hint="Edit Mobile Number"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('garage_phone_num')"
            :error-message="form.errors.get('garage_phone_num')"
          />
        </q-card-section>

        <q-btn class="q-ma-md" color="primary" glossy label="save" dense @click="createNewCarService" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "CarServices",

  data () {
    return {
      showCreateCarServiceForm: false,
      form: new Form({
        id: ''
      }),
      columns: [
        { align: 'left', name: 'model', label: 'Car Model', field: 'model', },
        { align: 'left', name: 'repair_hardware_name', label: 'Repair Hardware Name ', field: 'repair_hardware_name', },
        { align: 'left', name: 'repair_hardware_price', label: 'Repair Hardware Price', field: 'repair_hardware_price', },
        { align: 'left', name: 'service_charge', label: 'Service Charge', field: 'service_charge', },
        { align: 'left', name: 'garage_name', label: 'Garage Name', field: 'garage_name', },
        { align: 'left', name: 'garage_address', label: 'Garage Address', field: 'garage_address', },
        { align: 'left', name: 'garage_phone_num', label: 'Garage Phone Number', field: 'garage_phone_num', },
        { align: 'left', name: 'name', label: 'Assigned Driver', field: 'name', },
        { align: 'right', name: 'action', label: 'Action', field: 'action', },
      ],

    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "getCarDetails", "getCarServices"]),
  },
  methods: {
    // Created CarDetails charge 
    createNewCarService () {
      this.$store.dispatch('auth/createNewCarServiceAction', this.form)
        .then(success => {
          this.showCreateCarServiceForm = false
        })
    },

    // assing CarDetails in form 
    newCarService (key, evt) {
      this.form[key] = evt
    },

    // Updated CarDetails charge 
    updatCarService (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateCarServiceAction', this.form)
    },

    // delete CarDetails charge 
    deleteCarService (id) {
      let Id = { id: id }
      this.$store.dispatch('auth/deleteCarServiceAction', Id)
    }

  },

}
</script>
<style lang="stylus" scoped>
.my-card2 {
  width: 17%;
  max-width: 1000px;
}</style>
