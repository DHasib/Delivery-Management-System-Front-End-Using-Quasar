<template>
  <!-- Zone Table  -->
  <div v-if="getAuthUser && getAuthUser.role === '1' ">
    <div class="self-center text-h5 text-black text-weight-bolder">Zoney Category</div>
    <q-table title="CRUD Zone Table" class="q-my-xl" :data="getZone" :columns="columns" row-key="id" binary-state-sort>
      <template v-slot:top-right>
        <q-btn color="teal" glossy icon="add" dense @click="showCreateZoneForm =!showCreateZoneForm" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">{{props.row.name}}</q-td>
          <q-td key="address" :props="props">{{props.row.address }}</q-td>
          <q-td key="phone_num" :props="props">{{props.row.phone_num }}</q-td>
          <q-td key="action" :props="props">
            <q-btn class="q-ml-md" color="amber" glossy icon="edit" dense>
              <q-popup-edit :value="props.row.name" transition-show="flip-up" transition-hide="flip-down" title="Update Zone" max-width="350px">
                <template v-slot="{ cancel }">
                  <q-input
                    autofocus
                    dense
                    :value="props.row.name"
                    hint="Edit Zone"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newZone('name' , $event)"
                    :error="form.errors.has('name')"
                    :error-message="form.errors.get('name')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.address "
                    hint="Edit address"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newZone('address' , $event)"
                    :error="form.errors.has('address')"
                    :error-message="form.errors.get('address')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.phone_num "
                    hint="Edit Mobile Number"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newZone('phone_num' , $event)"
                    :error="form.errors.has('phone_num')"
                    :error-message="form.errors.get('phone_num')"
                  />
                  <q-btn class="q-mt-md" dense color="positive" label="Update" @click.stop="cancel" @click="updateZone(props.row.id)" />
                </template>
              </q-popup-edit>
            </q-btn>
            <q-btn class="q-ml-md" color="red" glossy icon="delete" dense @click="deleteZone(props.row.id)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="showCreateZoneForm" persistent transition-show="flip-down" transition-hide="flip-up" class="full-width">
      <q-card>
        <q-bar class="bg-purple-10 text-white">
          <div class="text-h6 q-ma-xl">Add New Zone</div>
          <q-space />
          <q-btn dense flat icon="close" color="red" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-mt-md">
          <q-input
            autofocus
            dense
            v-model="form.name"
            hint="Insert Zone Name"
            placeholder="Insert Zone Name"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('name')"
            :error-message="form.errors.get('name')"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            dense
            v-model="form.address"
            hint="Insert Zone Address"
            placeholder="Insert Zone Address"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('address')"
            :error-message="form.errors.get('address')"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            dense
            v-model="form.phone_num"
            hint="Insert Contact Number"
            placeholder="Insert Contact Number"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('phone_num')"
            :error-message="form.errors.get('phone_num')"
          />
        </q-card-section>
        <q-btn class="q-ma-md" color="primary" glossy label="save" dense @click="createNewZone" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "Zone",
  data () {
    return {
      showCreateZoneForm: false,
      form: new Form({
        id: ''
      }),
      columns: [
        { align: 'left', name: 'name', label: 'Name', field: 'name', },
        { align: 'left', name: 'address', label: 'Address', field: 'address', },
        { align: 'left', name: 'phone_num', label: 'Mobile', field: 'phone_num', },
        { align: 'right', name: 'action', label: 'Action', field: 'action', },
      ],
    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "getZone"])
  },
  methods: {
    // Created Salary charge 
    createNewZone () {
      this.$store.dispatch('auth/createNewZoneAction', this.form)
      this.showCreateZoneForm = false
    },
    // assing Salary in form 
    newZone (key, evt) {
      this.form[key] = evt
    },
    // Updated Salary charge 
    updateZone (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateZoneAction', this.form)
    },
    // delete Salary charge 
    deleteZone (id) {
      let Id = { id: id }
      this.$store.dispatch('auth/deleteZoneAction', Id)
    }
  },


}
</script>

<style scoped>
</style>
