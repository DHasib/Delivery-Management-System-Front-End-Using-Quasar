import Vue from 'vue'
import axios from 'axios'
import { LocalStorage } from 'quasar';
import Form from 'vform'


const apiURL = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
})

if(localStorage.access_token){
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
}
export default async ({ Vue }) => {
  Vue.prototype.$axios = apiURL
}
// Vue.prototype.$axios = URL
  Form.axios = apiURL


  export { apiURL }


// Vue.prototype.$axios = axios
