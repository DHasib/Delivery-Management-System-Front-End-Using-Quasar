import {auth, isAdmin} from './middlewares';


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', name:"home", component: () => import('pages/Index.vue') },
      { path: '/dashboard', component: () => import('pages/Dashboard.vue'),
          meta: {
                  middlewares: [auth]
                },
        },
      { path: '/seeting', name:"seeting",   component: () => import('pages/Settings.vue') ,
          meta: {
                  middlewares: [auth]
                },
        },

      { path: '/orderManagement', name:"orderManagement",  component: () => import('pages/DeliveryManagement.vue'),
        meta: {
                  middlewares: [auth]
                },
      },  

      { path: '/merchantManagement', name:"merchantManagement",  component: () => import('pages/MerchantManagement.vue'),
        meta: {
                  middlewares: [auth, isAdmin]
                },
      }, 
        
      { path: '/employeeManagement', name:"employeeManagement",  component: () => import('pages/EmployeeManagement.vue'),
          meta: {
                    middlewares: [auth, isAdmin]
              },
      }, 

      { path: '/vehicleManagement', name:"vehicleManagement",  component: () => import('pages/VehicleManagement.vue'),
          meta: {
                    middlewares: [auth, isAdmin]
                  },
      },    
      { path: '/transaction', name:"transaction",  component: () => import('pages/Transaction.vue'),
            meta: {
                      middlewares: [auth]
                    },
      },    
      { path: '/income', name:"income",  component: () => import('pages/Income.vue'),
            meta: {
                      middlewares: [ isAdmin]
                    },
      },    

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
