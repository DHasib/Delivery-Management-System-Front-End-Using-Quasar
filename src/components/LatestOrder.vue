<template>
  <!-- //Latest DeliveryTable Area  -->
  <div v-if="isAdmin">
    <div class="self-center q-px-xl q-pt-xl text-h4 text-black text-weight-bolder">Latest Delivery List</div>
    <q-table
      title="Pending & In Prograss Order Table"
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
          <q-td key="name" :props="props">{{props.row.profile.user.name }}</q-td>
          <q-td key="charge_amount" :props="props">{{props.row.profile.service_charge.charge_amount }}</q-td>

          <q-td key="status" :props="props">
            <q-btn
              :style="props.row.status === 'pending' ? 'background-color:yellow' : props.row.status === 'prograssing' ? 'background-color:orange' : ''   "
              :label="props.row.status"
              dense
            />
            <q-popup-edit
              :value="props.row.profile.service_charge.charge_amount"
              transition-show="flip-up"
              transition-hide="flip-down"
              title="Update Delivery Status"
            >
              <template v-slot="{ cancel }">
                <q-select
                  transition-show="flip-up"
                  transition-hide="flip-down"
                  v-model="form.status"
                  :options="status"
                  option-label="status"
                  label="select service charge"
                  option-value="id"
                  emit-value
                  map-options
                  class="q-mt-md"
                  outlined
                  :error="form.errors.has('status')"
                  :error-message="form.errors.get('status')"
                />

                <q-btn @click.stop="cancel" dense @click="updateDeliveryStatus(props.row.id)" color="positive" label="Update" class="q-mt-md" />
              </template>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "LatestDelivery",
  data () {
    return {
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      status: ['prograssing', 'done', 'cancel'],
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
        { align: 'left', name: 'name', label: 'Order From', field: 'name' },
        { align: 'left', name: 'charge_amount', label: 'Service Charge', field: 'charge_amount' },
        { align: 'left', name: 'status', label: 'Status ', field: 'status' },
      ],

    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "isAdmin", "getLatestDelivery"]),
  },
  methods: {

    updateDeliveryStatus (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateDeliveryStatusAction', this.form)
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
        ? this.getLatestDelivery.filter(row => row.reference_Id.includes(filter))
        : this.getLatestDelivery.slice()

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
        return this.getLatestDelivery.length
      }
      let count = 0
      this.getLatestDelivery.forEach((treat) => {
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

        this.onRequest({
          pagination: this.pagination,
          filter: null
        })
      }
    }, 3000);
  }


}
</script>

