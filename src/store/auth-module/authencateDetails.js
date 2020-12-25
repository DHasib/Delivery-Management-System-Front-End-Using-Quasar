// import URL from "axios"
import axios from 'axios'
import {Notify, Loading,} from 'quasar'

import { apiURL } from 'boot/axios'

const state ={


  //set Authencation User Details
  authUser: null,
  merchantUsers:[],
  serviceCharges:[],
  salaries:[],
  zones:[],
  carDetails:[],
  carServices:[],
  employeeInfo:[],
  freeCarDetails:[],
  latestDeliveryInfo:[],
  doneAndCancleDeliveryInfo:[],
  authUserDeliveryInfo:[],
  authUserTransactionInfo:[],
  allTransactionInfo:[],
  incomeInfo:[],




  // declare global variables for the system/ multiple components
  globalVariables:{
      showRegistrationForm: false,
      showLoginForm: false,

  }

}

const mutations ={
    // Hide and Show Reg Form
      regFrmMutation(state){
        state.globalVariables.showRegistrationForm =  !state.globalVariables.showRegistrationForm
      },

    // Hide and Show Login Form
      loginFrmMutation(state){
        state.globalVariables.showLoginForm =  !state.globalVariables.showLoginForm
      },

      // Set AuthUser Details in state
       authUserMutation(state, value){
           state.authUser = value
       },

      // after LoggedOut Empty Sate Values
       LoggedOutValue(state, value){
           state.authUser = value
           state.merchantUsers = []
           state.serviceCharges = []
       },

      // Update AuthUser Details in state
       updatedAuthUserMutation(state, value){
         if (state.authUser.hasOwnProperty(value.key)) {
           state.authUser[value.key] =  value.data
         }
         else if(state.authUser.profile.hasOwnProperty(value.key)){
            state.authUser.profile[value.key] =  value.data
         }
       },

   // Get  merchantUsers from DB and set in State
    merchantUsersMutation(state, value){
      state.merchantUsers = []
      state.merchantUsers = value
    },

   // Get   serviceCharges from DB and set in State
    serviceChargesMutation(state, value){
      state.serviceCharges = []
      state.serviceCharges = value
    },

    // Get  salaryMutation from DB and set in State
     salaryMutation(state, value){
       state.salaries = []
       state.salaries = value
     },

    // Get  zonesMutation from DB and set in State
     zonesMutation(state, value){
       state.zones = []
       state.zones = value
     },

    // Get  carDetails from DB and set in State
     carDetailsMutation(state, value){
       state.carDetails = []
       state.carDetails = value
     },

    // Get  Free CarDetails from DB and set in State
     freeCarDetailsMutation(state, value){
       state.freeCarDetails = []
       state.freeCarDetails = value
     },

    // Get Car Services from DB and set in State
     carServisecsMutation(state, value){
       state.carServices = []
       state.carServices = value
     },

    // Get Employee from DB and set in State
     employeeMutation(state, value){
       state.employeeInfo = []
       state.employeeInfo = value
     },

    // Get Latest Delivery from DB and set in State
     latestDeliveryMutation(state, value){
       state.latestDeliveryInfo = []
       state.latestDeliveryInfo = value
     },

    // Get Done or Cancle Delivery from DB and set in State
     doneAndCancleDeliveryMutation(state, value){
       state.doneAndCancleDeliveryInfo = []
       state.doneAndCancleDeliveryInfo = value
     },

    // Get AuthUser Delivery from DB and set in State
     authUserDeliveryMutation(state, value){
       state.authUserDeliveryInfo = []
       state.authUserDeliveryInfo = value
     },

    // Get Auth User Transaction from DB and set in State
     authUserTransactionMutation(state, value){
       state.authUserTransactionInfo = []
       state.authUserTransactionInfo = value
     },

    // Get all Transaction from DB and set in State
     allTransactionMutation(state, value){
       state.allTransactionInfo = []
       state.allTransactionInfo = value
     },

    // Get all Transaction from DB and set in State
     incomeMutation(state, value){
       state.incomeInfo = []
       state.incomeInfo = value
     },
    
}

//============================================================================================================================================
//..................................................................Action Section............................................................
//============================================================================================================================================
const actions ={

  // Attempt To Registration
  attemptToRegister({commit}, payload){
     Loading.show();
     return new Promise(async (resolve, reject) => {
      await payload.post("/register")
          .then((response) => {
              Loading.hide();
                if (payload.successful) {
                   Loading.hide();
                  if (response.data.message.accessToken ) {
                       localStorage.setItem("access_token", response.data.message.accessToken)
                          let regData = {}
                          Object.assign( regData, response.data.data[0])
                        commit('authUserMutation', regData)
                  }
                  resolve(response)
                   payload.reset();
                   payload.clear();
                }
          })
          .catch((error) => {
             Loading.hide();
          })

    })
  },

  // Attempt To Login
  attemptToLogin({commit}, payload){
     Loading.show();
     return new Promise(async (resolve, reject) => {
      await payload.post("/login")
          .then((response) => {
              Loading.hide();
                if (payload.successful) {
                   Loading.hide();
                  if (response.data.message.accessToken ) {
                       localStorage.setItem("access_token", response.data.message.accessToken )
                          let logData = {}
                          Object.assign( logData, response.data.data[0])
                        commit('authUserMutation', logData)
                  }
                  resolve(response)
                   payload.reset();
                   payload.clear();
                }
          })
          .catch((error) => {
             Loading.hide();
          })

    })
  },

  //............................................... About User ..............................................................
  // Attempt To LogOut
  attemptToLogOut({commit, state}){
    if (Object.keys(state.authUser).length !== 0 && state.authUser.constructor === Object) {
      if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
        }

     Loading.show();
     return new Promise(async (resolve, reject) => {
      await apiURL.post("/logout")
          .then((response) => {
                  if (response.data.status === 'done') {
                     localStorage.removeItem("access_token")
                     let empty = null
                     commit('LoggedOutValue', empty)
                    }
                   resolve(response)
                 Loading.hide();
          })
          .catch((error) => {
             Loading.hide();
             reject(error)
          })

    })
   }
  },

  // Get authUser Details from DB
  authUserAction({commit,state}){
    if (!state.authUser && localStorage.access_token) {
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
      }
      Loading.show();
      apiURL.get("/authUser")
      .then((response) => {
              if (response.data.data) {
                let resData = {}
                 Object.assign( resData, response.data.data[0])
                  commit('authUserMutation', resData)
              }
              Loading.hide();
            })
            .catch(error => {
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Loggin and Try Again ',
                position: "top-right",
              })
              Loading.hide();
            })
       }

  },

  // Update User Inforamation in DB
   updateProfileAction({commit,dispatch,state}, payload){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
       }
        Loading.show();
        return new Promise(async (resolve, reject) => {
      await payload.patch("/users/"+ state.authUser.id)
            .then((response) => {
              if (payload.successful) {

                if (response.data.status === 'done') {
                    let empty = null
                    commit('authUserMutation', empty)
                     dispatch('authUserAction')
                     resolve(response)
                  }
                 payload.reset();
                   payload.clear();
              }
            })
            .catch(error => {
                 Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })

        })
  },

  // get  merchantUsers from DB 
  allMerchantUserAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/users")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('merchantUsersMutation', response.data.data)
                Loading.hide();
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },

  // Delete MerchantUser  From DB
    deleteMerchantUserAction({dispatch}, payload){
   
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        return new Promise(async (resolve, reject) => {
      await  apiURL.delete("/users/" + payload.id)
        .then((response) => {
            if (response.data.status === 'done') {
                dispatch('allMerchantUserAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Deleted',
                    position: "top-right",
                  })
                  resolve(response)
            }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
         })
          
      }
  },


  //.............................................About Service Charge..............................................................................................
  
   // get  Service Charge from DB
  getServiceChargeCategory({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/serviceCharges")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('serviceChargesMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },

 // Update User Service Charge in DB
    updateUserServiceChargeAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");


        return new Promise(async (resolve, reject) => {
      await  payload.post("/UserServiceChargeUpdate")
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('allMerchantUserAction')
                Loading.hide();
               resolve(response)
            }

             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
           })
      }
  },

 // Create new Service Charge in DB
    createNewServiceChargeAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        payload.post("/serviceCharges")
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getServiceChargeCategory')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Created ',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
      }
  },
 // Update Service Charge in DB
    updateServiceChargeAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        payload.patch("/serviceCharges/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getServiceChargeCategory')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
      }
  },

 // Delete Service Charge From DB
    deleteSrviceChargeAction({dispatch}, payload){
   
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

         apiURL.delete("/serviceCharges/" + payload.id)
        .then((response) => {
            if (response.data.status === 'done') {
                dispatch('getServiceChargeCategory')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Deleted',
                    position: "top-right",
                  })
            }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          
      }
  },

//.................................................. About Salary ..........................................................................................

  // get Salaryfrom DB
  getSalary({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/salary")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('salaryMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },
  
  // Create new Salary  in DB 
    createNewSalaryAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        payload.post("/salary")
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getSalary')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Created ',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
      }
  },

   // Update Salary in DB deleteSalaryAction
    updateSalaryAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        payload.patch("/salary/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getSalary')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
      }
  },

   // Delete Salary From DB
    deleteSalaryAction({dispatch}, payload){
   
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

         apiURL.delete("/salary/" + payload.id)
        .then((response) => {
            if (response.data.status === 'done') {
                dispatch('getSalary')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Deleted',
                    position: "top-right",
                  })
            }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          
      }
  },


//.................................... About Zones.......................................................................................................

  // get Zone from DB
  getZone({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/zone")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('zonesMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },
  
  // Create new Zone  in DB 
    createNewZoneAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        payload.post("/zone")
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getZone')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Created ',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
      }
  },

   // Update Zone in DB deleteSalaryAction
    updateZoneAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        payload.patch("/zone/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getZone')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
      }
  },

   // Delete Salary From DB
    deleteZoneAction({dispatch}, payload){
   
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

         apiURL.delete("/zone/" + payload.id)
        .then((response) => {
            if (response.data.status === 'done') {
                dispatch('getZone')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Deleted',
                    position: "top-right",
                  })
            }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          
      }
  },

//.................................... About CarDetails .......................................................................................................

  // get Free CarDetails from DB
  getFreeCarAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/freeCar")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('freeCarDetailsMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },
  // get CarDetails from DB
  carDetailsAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/carDetails")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('carDetailsMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },
  
  // Create new CarDetails  in DB 
    createNewCarAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        return new Promise(async (resolve, reject) => {
      await payload.post("/carDetails")
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('carDetailsAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Created ',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();

                 resolve(response)
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          })
      }
  },

   // Update CarDetails in DB deleteSalaryAction
    updateCarDetailsAction({dispatch}, payload){
     
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        return new Promise(async (resolve, reject) => {
      await payload.patch("/carDetails/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('carDetailsAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
                   resolve(response)
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
         })
      }
  },

   // Delete CarDetails From DB
    deleteCarDetailsAction({dispatch}, payload){
  
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

          return new Promise(async (resolve, reject) => {
      await apiURL.delete("/carDetails/" + payload.id)
        .then((response) => {
            if (response.data.status === 'done') {
                dispatch('carDetailsAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Deleted',
                    position: "top-right",
                  })
                 resolve(response)
            }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          })
          
      }
  },
  
//.................................... About Car-Service .......................................................................................................

  // get Car-Service from DB
  getCarServicesAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/carServices")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('carServisecsMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },
  
  // Create new Car-Service  in DB 
    createNewCarServiceAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        return new Promise(async (resolve, reject) => {
      await payload.post("/carServices")
        .then((response) => {
          
          if (payload.successful) {
             console.log(response.data)
            if (response.data.status === 'done') {
                dispatch('getCarServicesAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Created ',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();

                 resolve(response)
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          })
      }
  },

   // Update Car-Service in DB deleteSalaryAction
    updateCarServiceAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        payload.patch("/carServices/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getCarServicesAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
      }
  },

   // Delete Car-Service From DB
    deleteCarServiceAction({dispatch}, payload){
  
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

          return new Promise(async (resolve, reject) => {
      await apiURL.delete("/carServices/" + payload.id)
        .then((response) => {
            if (response.data.status === 'done') {
                dispatch('getCarServicesAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Deleted',
                    position: "top-right",
                  })
                 resolve(response)
            }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          })
          
      }
  },

//.................................... About Employee .......................................................................................................

  // get Employee from DB
  getEmployeeAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/employee")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('employeeMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },
  
  // Create new Employee  in DB 
    createNewEmployeeAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        return new Promise(async (resolve, reject) => {
      await payload.post("/employee")
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getEmployeeAction')
                dispatch('getFreeCarAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Created ',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();

                 resolve(response)
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          })
      }
  },

   // Update Employee in DB deleteSalaryAction
    updateEmployeeDetailsAction({dispatch}, payload){
 
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

         return new Promise(async (resolve, reject) => {
      await payload.patch("/employee/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getEmployeeAction')
                dispatch('getFreeCarAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             resolve(response)
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
         })
      }
  },

   // Delete Employee From DB
    deleteEmployeeAction({dispatch}, payload){
  
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

          return new Promise(async (resolve, reject) => {
      await apiURL.delete("/employee/" + payload.id)
        .then((response) => {
            if (response.data.status === 'done') {
                dispatch('getEmployeeAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Deleted',
                    position: "top-right",
                  })
                 resolve(response)
            }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          })
          
      }
  },


//.................................... About Delivery/Order .......................................................................................................

  // get Delivery/Order from DB
  getAuthUserDeliveryAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/authUserDeliveryDetails")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('authUserDeliveryMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },

  // get Delivery/Order from DB
  getLatestDeliveryAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/delivery")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('latestDeliveryMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },

  // get Delivery/Order from DB
  getDoneOrCancleDeliveryAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/cancelAndDoneDelivery")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('doneAndCancleDeliveryMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },
  
  // Create new Delivery/Order  in DB 
    createNewDeliveryAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

        return new Promise(async (resolve, reject) => {
      await payload.post("/delivery")
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getAuthUserDeliveryAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Created ',
                    position: "top-right",
                  })
            }
             payload.reset();
             payload.clear();

                 resolve(response)
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
          })
      }
  },

   // Update Delivery/Order Status in DB deleteSalaryAction
    updateDeliveryStatusAction({dispatch}, payload){
 
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

         return new Promise(async (resolve, reject) => {
      await payload.put("/updateDeliveryStatus/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getLatestDeliveryAction')
                dispatch('getDoneOrCancleDeliveryAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             resolve(response)
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
         })
      }
  },

   // Update My Delivery/Order in DB deleteSalaryAction
    updateMyDeliveryAction({dispatch}, payload){
 
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

         return new Promise(async (resolve, reject) => {
      await payload.put("/delivery/" + payload.id)
        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getAuthUserDeliveryAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             resolve(response)
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
         })
      }
  },


//.................................... About Transaction .......................................................................................................

  // get My Transaction= from DB
  getMyTransactionAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/authUserTransaction")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('authUserTransactionMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },


  // get all Transaction from DB
  getAllTransactionAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/transaction")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('allTransactionMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },

   // Update Transaction Status in DB deleteSalaryAction
    updateTransactionStatusAction({dispatch}, payload){
      Loading.show();
      if(localStorage.access_token){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");

    return new Promise(async (resolve, reject) => {
      await payload.put("/transaction/" + payload.id)

        .then((response) => {
          
          if (payload.successful) {
            
            if (response.data.status === 'done') {
                dispatch('getAllTransactionAction')
                Loading.hide();
                 Notify.create({
                    color: 'positive',
                    message: 'Successfully Updated',
                    position: "top-right",
                  })
            }
             resolve(response)
             payload.reset();
             payload.clear();
          }
            })
            .catch(error => {
                Loading.hide();
                Notify.create({
                    color: 'negative',
                    message: 'SomeThing Went Wrong !! Please  Try Again ',
                    position: "top-right",
                  })
            })
         })
      }
  },

//.................................... About Income .......................................................................................................

  // get  Income from DB
  getIncomeAction({commit}){
     if(localStorage.access_token){
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("access_token");
           Loading.show();

          apiURL.get("/income")
          .then((response) => {
              if (response.data.status === 'Success') {
                commit('incomeMutation', response.data.data)
                Loading.hide(); 
                }
            })
            .catch(error => {
               Loading.hide();
             Notify.create({
                color: 'negative',
                message: 'SomeThing Went Wrong !! Please  Try Again ',
                position: "top-right",
              })
            })
      }
  },


 






}


const getters = {

// Get reg  true or false value state
 getRegForm: state => state.globalVariables.showRegistrationForm,

 // Get Login form true or false value state
 getLoginForm: state => state.globalVariables.showLoginForm,

 // Get AuthUser Details form State
 getAuthUser: state =>  state.authUser,

 // Get serviceCharges  form State
 getServiceCharges: state =>  state.serviceCharges,

 // Get Salary  form State
 getSalary: state =>  state.salaries,

 // Get Zone  form State
 getZone: state =>  state.zones,

 // Get Car Details  form State
 getCarDetails: state =>  state.carDetails,

 // Get Free Car Details  form State
 getAvailableCarDetails: state =>  state.freeCarDetails,

 // Get employee Details  form State
 getEmployee: state =>  state.employeeInfo,

 // Get Latest Delivery Details  form State
 getLatestDelivery: state =>  state.latestDeliveryInfo,

 // Get Auth User Delivery Details  form State
 getAuthUserDelivery: state =>  state.authUserDeliveryInfo,
 
 // Get doneAndCancle Delivery Details  form State
 getdoneAndCancleDelivery: state =>  state.doneAndCancleDeliveryInfo,

 // Get Car Services  form State
 getCarServices: state =>  state.carServices,

 // Get authUser Transaction Info  form State
 authUserTransaction: state =>  state.authUserTransactionInfo,

 // Get All Transaction Info  form State
 getallTransaction: state =>  state.allTransactionInfo,


 // Get Income Info  form State
 getIncome: state =>  state.incomeInfo,

//check user loggedIn or not
isAuthenticated: state => {
  return state.authUser ? true : false
},

//check user Type or not
isAdmin: state => {
  return state.authUser && state.authUser.role === '1' ? true : false
},
//check user Type or not
isMerchant: state => {
  return state.authUser && state.authUser.role === '0' ? true : false
},


// get merchantUsers 
getMerchantUsers: state => state.merchantUsers,

// get Total Merchant 
getTotalMerchantUsers: state => {
 return state.merchantUsers.length
},

// get Total Merchant 
getTotalNewDelivery: state => {
 return state.latestDeliveryInfo.length
},

// get Total Merchant 
getTotalNewDelivery: state => {

let total = 0;

      state.incomeInfo.forEach(item => {
          total += item['service_charge'];
      });

  return total;



}

//check user loggedIn onot then
// authenticatedUserProfile: state => {
//   return state.authUser ? state.authUser.profile : null
// },


}


export default {
  namespaced: true,
  mutations,
  state,
  actions,
  getters
}
