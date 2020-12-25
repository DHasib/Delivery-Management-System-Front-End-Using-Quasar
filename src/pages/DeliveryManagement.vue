<template>
  <div class="row">
    <div class="col-12">
      <latestOrder></latestOrder>
    </div>

    <div class="col-12">
      <!-- //Latest DeliveryTable Area  -->
      <doneAndCancelDelivery></doneAndCancelDelivery>
    </div>

    <div v-if="isMerchant" class="col-12">
      <!-- //Latest DeliveryTable Area  -->
      <div class="self-center q-px-xl q-pt-xl text-h4 text-black text-weight-bolder">My Delivery List</div>
      <q-table
        title="MyOrder Table"
        class="q-mx-xl q-mt-xl"
        :data="data"
        :columns="columns"
        row-key="id"
        binary-state-sort
        :pagination.sync="pagination"
        :loading="loading"
        :filter="filter"
        @request="onRequest"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="400" v-model="filter" placeholder="Search by Reference Number">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn class="q-ml-lg" color="teal" glossy icon="add" dense @click="showCreateOrderForm =!showCreateOrderForm" />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="pickup_address" :props="props">{{ props.row.pickup_address }}</q-td>
            <q-td key="delivery_address" :props="props">{{ props.row.delivery_address }}</q-td>
            <q-td key="delivery_mobile" :props="props">{{ props.row.delivery_mobile }}</q-td>
            <q-td key="pickup_mobile" :props="props">{{ props.row.pickup_mobile }}</q-td>
            <q-td key="amount_Collect" :props="props">{{ props.row.amount_Collect }}</q-td>
            <q-td key="reference_Id" :props="props">{{ props.row.reference_Id }}</q-td>
            <q-td key="instraction" :props="props">
              <q-btn color="primary" icon="visibility" dense>
                <q-popup-edit :value="props.row.instraction" title="About His/Her Self">{{props.row.instraction }}</q-popup-edit>
              </q-btn>
            </q-td>
            <q-td key="charge_amount" :props="props">{{props.row.profile.service_charge.charge_amount }}</q-td>

            <q-td key="status" :props="props">
              <q-btn
                :style="props.row.status === 'done' ? 'background-color:#00a300' : props.row.status === 'cancel' ? 'background-color:#ff3333' : props.row.status === 'pending' ? 'background-color:yellow'   :  'background-color:orange'   "
                :label="props.row.status"
                dense
              />
              <q-popup-edit
                v-if="props.row.status === 'pending'"
                :value="props.row.status"
                transition-show="flip-up"
                transition-hide="flip-down"
                title="Update Service  Charge"
              >
                <template v-slot="{ cancel }">
                  <q-input
                    autofocus
                    dense
                    :value="props.row.pickup_address"
                    hint="Edit Pickup Address"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newOrder('pickup_address' , $event)"
                    :error="form.errors.has('pickup_address')"
                    :error-message="form.errors.get('pickup_address')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.delivery_address"
                    hint="Edit Delivery Address"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newOrder('delivery_address' , $event)"
                    :error="form.errors.has('delivery_address')"
                    :error-message="form.errors.get('delivery_address')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.delivery_mobile"
                    hint="Edit Delivery  Phone Numbe"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newOrder('delivery_mobile' , $event)"
                    :error="form.errors.has('delivery_mobile')"
                    :error-message="form.errors.get('delivery_mobile')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.pickup_mobile"
                    hint="Edit Pickup Phone Number"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newOrder('pickup_mobile' , $event)"
                    :error="form.errors.has('pickup_mobile')"
                    :error-message="form.errors.get('pickup_mobile')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.amount_Collect"
                    hint="Edit  Amount Collect "
                    :rules="[val => !!val || 'Field is required']"
                    @input="newOrder('amount_Collect' , $event)"
                    :error="form.errors.has('amount_Collect')"
                    :error-message="form.errors.get('amount_Collect')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.reference_Id"
                    hint="Edit Pickup  Number/ memo-number "
                    :rules="[val => !!val || 'Field is required']"
                    @input="newOrder('reference_Id' , $event)"
                    :error="form.errors.has('reference_Id')"
                    :error-message="form.errors.get('reference_Id')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.instraction"
                    hint="Edit Pickup Instraction "
                    :rules="[val => !!val || 'Field is required']"
                    @input="newOrder('instraction' , $event)"
                    :error="form.errors.has('instraction')"
                    :error-message="form.errors.get('instraction')"
                  />

                  <q-btn @click.stop="cancel" dense @click="updateOrder(props.row.id)" color="positive" label="Update" class="q-mt-md" />
                </template>
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog v-model="showCreateOrderForm" persistent transition-show="flip-down" transition-hide="flip-up" class="full-width">
        <q-card class="my-card">
          <q-bar class="bg-purple-10 text-white">
            <div class="text-h6 q-ma-xl">Add New Order/Delivery</div>
            <q-space />
            <q-btn dense flat icon="close" color="red" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section class="q-mt-md">
            <q-input
              autofocus
              dense
              v-model="form.pickup_address"
              placeholder="Insert new Pickup Address"
              hint="Create Pickup Address"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('pickup_address')"
              :error-message="form.errors.get('pickup_address')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.delivery_address"
              hint="Create Delivery Address"
              placeholder="Insert new Delivery Address"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('delivery_address')"
              :error-message="form.errors.get('delivery_address')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.delivery_mobile"
              hint="Create Delivery  Phone Numbe"
              placeholder="Insert new Delivery  Phone Numbe"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('delivery_mobile')"
              :error-message="form.errors.get('delivery_mobile')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.pickup_mobile"
              hint="Create Pickup Phone Number"
              placeholder="Insert new Pickup Phone Number"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('pickup_mobile')"
              :error-message="form.errors.get('pickup_mobile')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.amount_Collect"
              hint="Create  Amount Collect "
              placeholder="Insert new  Amount Collec"
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('amount_Collect')"
              :error-message="form.errors.get('amount_Collect')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.reference_Id"
              hint="Create  Reference Number/ memo-number "
              placeholder="Insert new Reference Number/ memo-number "
              :rules="[val => !!val || 'Field is required']"
              :error="form.errors.has('reference_Id')"
              :error-message="form.errors.get('reference_Id')"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              dense
              v-model="form.instraction"
              hint="Create Pickup Instraction "
              :rules="[val => !!val || 'Field is required']"
              placeholder="Insert new Pickup Instraction"
              :error="form.errors.has('instraction')"
              :error-message="form.errors.get('instraction')"
            />
          </q-card-section>
          <q-btn class="q-ma-md" color="primary" glossy label="save" dense @click="createNewOrder" />
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>

import latestOrder from 'components/LatestOrder'
import doneAndCancelDelivery from 'components/DoneAndCancelDelivery'
import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "DeliveryManagement",
  components: {
    latestOrder,
    doneAndCancelDelivery,
  },
  data () {
    return {
      showCreateOrderForm: false,
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
        id: ''
      }),
      columns: [
        {
          name: 'pickup_address',
          label: 'Pickup Address',
          align: 'left',
          field: row => row.name,
        },
        { align: 'left', name: 'delivery_address', align: 'left', label: 'Delivery Address', field: 'delivery_address' },
        { align: 'left', name: 'delivery_mobile', label: 'Delivery Mobile', field: 'delivery_mobile' },
        { align: 'left', name: 'pickup_mobile', label: 'Pickup Mobile', field: 'pickup_mobile' },
        { align: 'left', name: 'amount_Collect', label: 'Amount Collect ', field: 'amount_Collect' },
        { align: 'left', name: 'reference_Id', label: 'Reference Number', field: 'reference_Id' },
        { align: 'left', name: 'instraction', label: 'Instraction', field: 'instraction' },
        { align: 'left', name: 'charge_amount', label: 'Service Charge', field: 'charge_amount' },
        { align: 'left', name: 'status', label: 'Status ', field: 'status' },
      ],

    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "isMerchant", "isAdmin", "getAuthUserDelivery"]),
  },
  methods: {
    // assing Delivery in form 
    newOrder (key, evt) {
      this.form[key] = evt
    },

    // Created Delivery charge 
    createNewOrder () {
      this.$store.dispatch('auth/createNewDeliveryAction', this.form)
        .then(success => {
          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
          this.showCreateOrderForm = false
        })
    },

    // update auth user Delivery 
    updateOrder (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateMyDeliveryAction', this.form)
        .then(success => {
          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
        })
    },
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

    // SELECT * FROM ... WHERE...LIMIT...reference_Id 
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? this.getAuthUserDelivery.filter(row => row.reference_Id.includes(filter))
        : this.getAuthUserDelivery.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
            ? (a, b) => (a.reference_Id > b.reference_Id ? -1 : a.reference_Id < b.reference_Id ? 1 : 0)
            : (a, b) => (a.reference_Id > b.reference_Id ? 1 : a.reference_Id < b.reference_Id ? -1 : 0)
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
        return this.getAuthUserDelivery.length
      }
      let count = 0
      this.getAuthUserDelivery.forEach((treat) => {
        if (treat.reference_Id.includes(filter)) {
          ++count
        }
      })
      return count
    }

  },
  mounted () {
    setTimeout(() => {
      if (this.getAuthUser.role === '1') {
        this.$store.dispatch('auth/getLatestDeliveryAction')
        this.$store.dispatch('auth/getDoneOrCancleDeliveryAction')
      }
      if (this.isMerchant) {

        this.$store.dispatch('auth/getAuthUserDeliveryAction')
      }
      this.onRequest({
        pagination: this.pagination,
        filter: null
      })
    }, 3000);
  }

}
</script>

<style lang="stylus" scoped>
.my-card {
  width: 25%;
  max-width: 1000px;
}
</style>
