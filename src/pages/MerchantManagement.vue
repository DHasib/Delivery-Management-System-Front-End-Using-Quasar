<template>
  <div class="row">
    <!-- show all merchant user table  -->
    <div class="col-12 q-mb-xl">
      <allmerchant></allmerchant>
    </div>

    <!--service charge Table  -->
    <div class="col-4 q-my-xl q-pl-xl">
      <serviceCharge></serviceCharge>
    </div>
    <!--/service charge Table  -->
  </div>
</template>

<script>
import allmerchant from 'components/AllMerchant'
import serviceCharge from 'components/ServiceCharge'

import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "MerchantManagement",
  components: {
    allmerchant,
    serviceCharge,

  },
  computed: {
    ...mapGetters('auth', ["getAuthUser"]),
  },
  mounted () {
    setTimeout(() => {
      if (this.getAuthUser.role === '1') {
        this.$store.dispatch('auth/allMerchantUserAction')
        this.$store.dispatch('auth/getServiceChargeCategory')
      }
    }, 3000);
  }

}
</script>

