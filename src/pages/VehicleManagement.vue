<template>
  <div class="row q-mx-xl">
    <!-- show all car details in table  -->
    <div class="col-12 q-mt-xl">
      <carsDetail></carsDetail>
    </div>

    <!--Car Services Category  Table  -->
    <div class="col-12 q-mt-xl">
      <carServices></carServices>
    </div>
  </div>
</template>

<script>
import carsDetail from 'components/CarsDetail'
import carServices from 'components/CarServices'

import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "VehicleManagement",
  components: {
    carsDetail,
    carServices,
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser",]),
  },
  mounted () {
    setTimeout(() => {
      if (this.getAuthUser.role === '1') {
        this.$store.dispatch('auth/carDetailsAction')
        this.$store.dispatch('auth/getCarServicesAction')//action
      }
    }, 3000);
  }

}
</script>
