<template>
  <div>
    <q-card v-if="isAdmin" class="bg-transparent no-shadow no-border q-ma-lg">
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-sm">
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #3a9688" class="q-pa-none">
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{getTotalNewDelivery}} Taka</q-item-label>
                  <q-item-label>Total Profit</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="bar_chart" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #7cb342" class="q-pa-none">
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{getTotalNewDelivery}}</q-item-label>
                  <q-item-label>New Order</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="show_chart" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #f88c2b" class="q-pa-none">
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{getTotalMerchantUsers}}</q-item-label>
                  <q-item-label>Total Merchant</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="person" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="text-h5 text-center">system are Developing</div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "Dashboard",
  components: {

  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('auth', ["isAdmin", "getTotalMerchantUsers", "getTotalNewDelivery", "getTotalNewDelivery"]),
  },
  methods: {


  },
  mounted () {
    setTimeout(() => {
      if (this.isAdmin) {
        this.$store.dispatch('auth/allMerchantUserAction')
        this.$store.dispatch('auth/getLatestDeliveryAction')

      }
    }, 3000);
  }

}
</script>

<style lang="stylus" scoped></style>
