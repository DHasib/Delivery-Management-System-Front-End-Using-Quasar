<template>
  <div v-if="getAuthUser && getAuthUser.role === '1' ">
    <!-- Service Charge  Table  -->
    <div class="self-center text-h5 text-black text-weight-bolder">Service Charge Category</div>
    <q-table title="CRUD Service Charge Table" class="q-my-xl" :data="getServiceCharges" :columns="columns" row-key="id" binary-state-sort>
      <template v-slot:top-right>
        <q-btn color="teal" glossy icon="add" dense @click="showCreateServiceChargeForm =!showCreateServiceChargeForm" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="charge_amount" :props="props">{{props.row.charge_amount}} Taka</q-td>
          <q-td key="discount" :props="props">{{props.row.discount ? props.row.discount : "0"}}</q-td>
          <q-td key="action" :props="props">
            <q-btn class="q-ml-md" color="amber" glossy icon="edit" dense>
              <q-popup-edit :value="props.row.charge_amount" transition-show="flip-up" transition-hide="flip-down" title="Update Charge" max-width="350px">
                <template v-slot="{ cancel }">
                  <q-input
                    autofocus
                    dense
                    :value="props.row.charge_amount"
                    hint="Edit Charge Amount"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newServiceCharge('charge_amount' , $event)"
                    :error="form.errors.has('charge_amount')"
                    :error-message="form.errors.get('charge_amount')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.discount ? props.row.discount : 0"
                    hint="Edit Discount"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newServiceCharge('discount' , $event)"
                    :error="form.errors.has('discount')"
                    :error-message="form.errors.get('discount')"
                  />
                  <q-btn class="q-mt-lg" dense color="positive" label="Update" @click.stop="cancel" @click="updateServiceCharge(props.row.id)" />
                </template>
              </q-popup-edit>
            </q-btn>
            <q-btn class="q-ml-md" color="red" glossy icon="delete" dense @click="deleteServiceCharge(props.row.id)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="showCreateServiceChargeForm" persistent transition-show="flip-down" transition-hide="flip-up" class="full-width">
      <q-card>
        <q-bar class="bg-purple-10 text-white">
          <div class="text-h6 q-ma-xl">Add New Service Charge</div>
          <q-space />
          <q-btn dense flat icon="close" color="red" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-mt-md">
          <q-input
            autofocus
            dense
            v-model="form.charge_amount"
            hint="Insert Charge Amount"
            placeholder="Insert Charge Amount"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('charge_amount')"
            :error-message="form.errors.get('charge_amount')"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            dense
            v-model="form.discount"
            hint="Insert discount"
            placeholder="Insert discount"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('discount')"
            :error-message="form.errors.get('discount')"
          />
        </q-card-section>
        <q-btn class="q-ma-md" color="primary" glossy label="save" dense @click="createNewServiceCharge" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "ServiceCharge",
  data () {
    return {
      showCreateServiceChargeForm: false,
      form: new Form({
        id: ''
      }),
      columns: [
        { align: 'left', name: 'charge_amount', label: 'Charge Amount', field: 'charge_amount', },
        { align: 'left', name: 'discount', label: 'Discount %', field: 'discount', },
        { align: 'right', name: 'action', label: 'Action', field: 'action', },
      ],
    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "getServiceCharges"]),
  },
  methods: {
    // Create New service charge 
    createNewServiceCharge () {
      this.$store.dispatch('auth/createNewServiceChargeAction', this.form)
      this.showCreateServiceChargeForm = false
    },
    // Assign service charge in form
    newServiceCharge (key, evt) {
      this.form[key] = evt
    },
    // Updated service charge 
    updateServiceCharge (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateServiceChargeAction', this.form)
    },
    // delete service charge 
    deleteServiceCharge (id) {
      let Id = { id: id }
      this.$store.dispatch('auth/deleteSrviceChargeAction', Id)
    }
  }

}
</script>

<style scoped>
</style>
