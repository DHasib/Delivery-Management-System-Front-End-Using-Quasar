<template>
  <div class="row">
    <div v-if="isAdmin" class="col-12">
      <div class="self-center q-px-xl q-pt-xl text-h4 text-black text-weight-bolder">All Income</div>
      <q-table title="Incomes" class="q-mx-xl q-mt-xl" :data="getIncome" :columns="columns" row-key="id" binary-state-sort>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="reference_Id" :props="props">{{ props.row.transaction.delivery.reference_Id }}</q-td>
            <q-td key="service_charge" :props="props">{{ props.row.service_charge }}</q-td>
            <q-td key="name" :props="props">{{ props.row.transaction.delivery.profile.user.name }}</q-td>
          </q-tr>
        </template>

        <template v-slot:bottom>
          <tr>
            <th>Total Profit.......................... =</th>
            <td>{{ getTotalNewDelivery }}</td>
          </tr>
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
  name: "Income",

  data () {
    return {
      columns: [
        {
          name: 'service_charge',
          label: 'Profit',
          align: 'left',
          field: row => row.name,
        },
        { align: 'left', name: 'reference_Id', align: 'left', label: 'Order Reference Id', field: 'reference_Id' },
        { align: 'left', name: 'name', label: 'Merchant User Name', field: 'name' },
        { align: 'left', name: 'total_profit', label: 'Total Profit', field: 'total_profit' },
      ],

    }
  },
  computed: {
    ...mapGetters('auth', ["isAdmin", "getIncome", "getTotalNewDelivery"]),

    countTotal () {
      return this.getIncome.service_charge
    }
  },
  methods: {


  },
  mounted () {
    setTimeout(() => {
      if (this.isAdmin) {
        this.$store.dispatch('auth/getAllTransactionAction')
        this.$store.dispatch('auth/getIncomeAction')
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
