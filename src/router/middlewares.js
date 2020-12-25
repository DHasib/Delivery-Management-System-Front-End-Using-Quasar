// src/middleware/auth.js
import {Notify,} from 'quasar'

  function auth({ next, store , router }) { /* { to, from, next, store } */

     let isAuthenticated = store.getters['auth/isAuthenticated']

   if (!localStorage.access_token && isAuthenticated !== true ) {
      
       Notify.create({
                   type: 'warning',
                   message: 'Warning!!  Yoy are Not Authorize To access This Route',
                   position: "top-right",
                  icon: 'announcement',
                  progress: true,
        })
         return next({ name: 'home' });
      }
   return next();
}

   function isAdmin({ next, store , router }) { /* { to, from, next, store } */

     let isAdmin = store.getters['auth/isAdmin']
  
   if (!localStorage.access_token &&  isAdmin != true ) {
       Notify.create({
                   type: 'warning',
                   message: 'Warning!!  Yoy are Not Authorize To access This Route',
                   position: "top-right",
                  icon: 'announcement',
                  progress: true,
        })

       return next({ path: '/home' });
   }
   return next();
}





 export {auth, isAdmin, }
