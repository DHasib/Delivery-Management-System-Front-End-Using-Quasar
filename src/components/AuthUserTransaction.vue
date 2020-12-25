<template>
  <div v-if="isMerchant" class="col-12">
    <!-- //Latest DeliveryTable Area  -->
    <div class="self-center q-px-xl q-pt-xl text-h4 text-black text-weight-bolder">My Transactions</div>
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
          <q-td key="reference_Id" :props="props">{{ props.row.reference_Id }}</q-td>
          <q-td key="status" :props="props">{{ props.row.transaction.status }}</q-td>
          <q-td key="net_amount" :props="props">{{ props.row.transaction.net_amount }}</q-td>
          <q-td key="service_charge" :props="props">{{ props.row.transaction.service_charge }}</q-td>
          <q-td key="due_amount" :props="props">{{ props.row.transaction.due_amount }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>

import latestOrder from 'components/AuthUserTransaction'
import { mapGetters } from 'vuex'


export default {
  name: "Transaction",
  components: {
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
    ...mapGetters('auth', ["isMerchant", "isAdmin", "authUserTransaction"]),
  },
  methods: {

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
        ? this.authUserTransaction.filter(row => row.reference_Id.includes(filter))
        : this.authUserTransaction.slice()

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
        return this.authUserTransaction.length
      }
      let count = 0
      this.authUserTransaction.forEach((treat) => {
        if (treat.reference_Id.includes(filter)) {
          ++count
        }
      })
      return count
    }

  },
  mounted () {
    setTimeout(() => {
      if (this.isMerchant) {
        this.$store.dispatch('auth/getMyTransactionAction')
        this.onRequest({
          pagination: this.pagination,
          filter: null
        })
      }
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
