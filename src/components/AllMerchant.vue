<template>
  <!-- //Marchent User Table Area  -->
  <div v-if="getAuthUser && getAuthUser.role === '1' ">
    <div class="self-center q-px-xl q-pt-xl text-h4 text-black text-weight-bolder">Merchant User Info</div>
    <q-table
      title="Merchant User Table"
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
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search by Name">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="email" :props="props">{{ props.row.email }}</q-td>
          <q-td key="phone_num" :props="props">{{ props.row.phone_num }}</q-td>
          <q-td key="address" :props="props">{{ props.row.address }}</q-td>
          <q-td key="company_name" :props="props">{{ props.row.profile.company_name }}</q-td>
          <q-td key="about" :props="props">
            <q-btn color="primary" icon="visibility" dense>
              <q-popup-edit v-model="form.about" title="About His/Her Self">{{props.row.profile.about }}</q-popup-edit>
            </q-btn>
          </q-td>
          <q-td key="image" :props="props">
            <q-avatar>
              <img :src="props.row.profile.image ? props.row.profile.image : '0'" />
            </q-avatar>
          </q-td>
          <q-td key="service_charge" :props="props">
            {{props.row.profile.service_charge ? props.row.profile.service_charge.charge_amount : "0"}} Taka
            <span v-if="!!getServiceCharges.length">
              <q-btn color="amber" glossy icon="edit" dense />
              <q-popup-edit
                :value="props.row.profile.service_charge.charge_amount"
                transition-show="flip-up"
                transition-hide="flip-down"
                title="Update Service  Charge"
              >
                <template v-slot="{ cancel }">
                  <q-select
                    ref="charge_amount"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="form.service_charge_id"
                    :options="getServiceCharges"
                    option-label="charge_amount"
                    label="select service charge"
                    option-value="id"
                    emit-value
                    map-options
                    class="q-mt-md"
                    outlined
                    :error="form.errors.has('service_charge_id')"
                    :error-message="form.errors.get('service_charge_id')"
                  />

                  <q-btn @click.stop="cancel" dense @click="updateServiceCharge(props.row.profile.id)" color="positive" label="Update" class="q-mt-md" />
                </template>
              </q-popup-edit>
            </span>
          </q-td>
          <q-td
            key="discount"
            :props="props"
          >{{ props.row.profile.service_charge && props.row.profile.service_charge.discount ? props.row.profile.service_charge.discount : "0"}}</q-td>
          <q-td key="action" :props="props">
            <q-btn dense @click="deleteMerchantUser(props.row.id)" color="red" icon="delete" />
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
  name: "AllMerchant",
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

      form: new Form({
        service_charge_id: '',
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
        { align: 'left', name: 'company_name', label: 'Company Name', field: 'company_name' },
        { align: 'left', name: 'about', label: 'About', field: 'about' },
        { align: 'left', name: 'image', label: 'Image', field: 'image', },
        { align: 'left', name: 'service_charge', label: 'Delivery Charge', field: 'service_charge' },
        { align: 'left', name: 'discount', label: 'Discount %', field: 'discount' },
        { align: 'left', name: 'action', label: 'Action', field: 'action' }
      ],

    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "getMerchantUsers", "getServiceCharges"]),


  },
  methods: {
    updateServiceCharge (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateUserServiceChargeAction', this.form)
        .then(success => {
          this.onRequest({
            pagination: this.pagination,
            filter: null
          })
        })
    },
    // delete MerchantUser 
    deleteMerchantUser (id) {
      let Id = { id: id }
      this.$store.dispatch('auth/deleteMerchantUserAction', Id)
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

    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? this.getMerchantUsers.filter(row => row.name.includes(filter))
        : this.getMerchantUsers.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
            ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
            : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
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
        return this.getMerchantUsers.length
      }
      let count = 0
      this.getMerchantUsers.forEach((treat) => {
        if (treat.name.includes(filter)) {
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

