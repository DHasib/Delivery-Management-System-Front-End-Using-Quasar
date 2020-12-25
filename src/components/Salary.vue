<template>
  <div v-if="getAuthUser && getAuthUser.role === '1' ">
    <div class="self-center text-h5 text-black text-weight-bolder">Salary Category</div>
    <q-table title="CRUD Salary Table" class="q-my-xl" :data="getSalary" :columns="columns" row-key="id" binary-state-sort>
      <template v-slot:top-right>
        <q-btn color="teal" glossy icon="add" dense @click="showCreateSalaryForm =!showCreateSalaryForm" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="salary_amount" :props="props">{{props.row.salary_amount}} Taka</q-td>
          <q-td key="bonus" :props="props">{{props.row.bonus ? props.row.bonus : "0"}} Taka</q-td>
          <q-td key="action" :props="props">
            <q-btn class="q-ml-md" color="amber" glossy icon="edit" dense>
              <q-popup-edit
                :value="props.row.salary_amount"
                transition-show="flip-up"
                transition-hide="flip-down"
                title="Update Salary Amount"
                max-width="350px"
              >
                <template v-slot="{ cancel }">
                  <q-input
                    autofocus
                    dense
                    :value="props.row.salary_amount"
                    hint="Edit Salary Amount"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newSalary('salary_amount' , $event)"
                    :error="form.errors.has('salary_amount')"
                    :error-message="form.errors.get('salary_amount')"
                  />
                  <q-input
                    autofocus
                    dense
                    :value="props.row.bonus ? props.row.bonus : 0"
                    hint="Edit Bonus"
                    :rules="[val => !!val || 'Field is required']"
                    @input="newSalary('bonus' , $event)"
                    :error="form.errors.has('bonus')"
                    :error-message="form.errors.get('bonus')"
                  />
                  <q-btn class="q-mt-lg" dense color="positive" label="Update" @click.stop="cancel" @click="updateSalary(props.row.id)" />
                </template>
              </q-popup-edit>
            </q-btn>
            <q-btn class="q-ml-md" color="red" glossy icon="delete" dense @click="deleteSalary(props.row.id)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="showCreateSalaryForm" persistent transition-show="flip-down" transition-hide="flip-up" class="full-width">
      <q-card>
        <q-bar class="bg-purple-10 text-white">
          <div class="text-h6 q-ma-xl">Add New Salary Amount</div>
          <q-space />
          <q-btn dense flat icon="close" color="red" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-mt-md">
          <q-input
            autofocus
            dense
            v-model="form.salary_amount"
            hint="Insert Salary Amount"
            placeholder="Insert Salary Amount"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('salary_amount')"
            :error-message="form.errors.get('salary_amount')"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            dense
            v-model="form.bonus"
            hint="Insert bonus"
            placeholder="Insert bonus"
            :rules="[val => !!val || 'Field is required']"
            :error="form.errors.has('bonus')"
            :error-message="form.errors.get('bonus')"
          />
        </q-card-section>
        <q-btn class="q-ma-md" color="primary" glossy label="save" dense @click="createNewSalary" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  name: "Salary",
  data () {
    return {
      showCreateSalaryForm: false,
      form: new Form({
        id: ''
      }),
      columns: [
        { align: 'left', name: 'salary_amount', label: 'Salary Amount', field: 'salary_amount' },
        { align: 'left', name: 'bonus', label: 'Bonus', field: 'bonus', },
        { align: 'right', name: 'action', label: 'Action', field: 'action', },
      ],
    }
  },
  computed: {
    ...mapGetters('auth', ["getAuthUser", "getSalary"]),
  },
  methods: {
    // Updated Salary charge 
    createNewSalary () {
      this.$store.dispatch('auth/createNewSalaryAction', this.form)
      this.showCreateSalaryForm = false
    },
    // assing Salary in form 
    newSalary (key, evt) {
      this.form[key] = evt
    },
    // Updated Salary charge 
    updateSalary (id) {
      this.form.id = id
      this.$store.dispatch('auth/updateSalaryAction', this.form)
    },
    // delete Salary charge 
    deleteSalary (id) {
      let Id = { id: id }
      this.$store.dispatch('auth/deleteSalaryAction', Id)
    }
  },

}
</script>

<style scoped>
</style>
