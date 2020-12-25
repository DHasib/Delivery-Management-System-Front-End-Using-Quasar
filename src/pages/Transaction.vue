<template>
  <div class="row">
    <div class="col-12">
      <authUserTransaction></authUserTransaction>
    </div>

    <div v-if="isAdmin" class="col-12">
      <div class="self-center q-px-xl q-pt-xl text-h4 text-black text-weight-bolder">All Transactions</div>
      <q-table
        title="Total Transactions"
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
            <q-td key="reference_Id" :props="props">{{ props.row.delivery.reference_Id }}</q-td>
            <q-td key="status" :props="props">
              <q-btn
                :style="props.row.status === 'due' ? 'background-color:yellow' : props.row.status === 'paid' ? 'background-color:#00a300 ' : ''   "
                :label="props.row.status"
                dense
              />
              <q-popup-edit
                v-if="props.row.status === 'due'"
                :value="props.row.status"
                transition-show="flip-up"
                transition-hide="flip-down"
                title="Update Service  Charge"
              >
                <template v-slot="{ cancel }">
                  <q-select
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="form.status"
                    :options="status"
                    option-label="status"
                    label="select status"
                    option-value="id"
                    emit-value
                    map-options
                    class="q-mt-md"
                    outlined
                    :error="form.errors.has('status')"
                    :error-message="form.errors.get('status')"
                  />

                  <q-btn @click.stop="cancel" dense @click="updateStatus(props.row.id)" color="positive" label="Update" class="q-mt-md" />
                </template>
              </q-popup-edit>
            </q-td>
            <q-td key="net_amount" :props="props">{{ props.row.net_amount }}</q-td>
            <q-td key="service_charge" :props="props">{{ props.row.service_charge }}</q-td>
            <q-td key="due_amount" :props="props">{{ props.row.due_amount }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>

import authUserTransaction from 'components/AuthUserTransaction'
import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "Transaction",
  components: {
    authUserTransaction,
  },
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
      data: [],

      status: ['paid'],

      form: new Form({
        id: ''
      }),

      columns: [
        {
          name: 'reference_Id',
          label: 'Order Reference Id',
          align: 'left',
          field: row => row.name,
        },
        { align: 'left', name: 'status', label: 'Status ', field: 'status' },
        { align: 'left', name: 'net_amount', label: 'Net Amount', field: 'net_amount' },
        { align: 'left', name: 'service_charge', label: 'Service Charge', field: 'service_charge' },
        { align: 'left', name: 'due_amount', align: 'left', label: 'Due Amount', field: 'due_amount' },
      ],

    }
  },
  computed: {
    ...mapGetters('auth', ["isMerchant", "isAdmin", "getallTransaction"]),
  },
  methods: {
    updateStatus (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateTransactionStatusAction', this.form)
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
        ? this.getallTransaction.filter(row => row.delivery.reference_Id.includes(filter))
        : this.getallTransaction.slice()

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
        return this.getallTransaction.length
      }
      let count = 0
      this.getallTransaction.forEach((treat) => {
        if (treat.delivery.reference_Id.includes(filter)) {
          ++count
        }
      })
      return count
    }

  },
  mounted () {
    setTimeout(() => {
      if (this.isAdmin) {
        this.$store.dispatch('auth/getAllTransactionAction')
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
