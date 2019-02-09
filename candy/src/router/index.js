import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Coupons from '@/components/pages/Coupons';
import Orders from '@/components/pages/Orders';
import CustomerOrder from '@/components/pages/CustomerOrders';
import CustomerCheckout from '@/components/pages/CustomerCheckout';
import ShopPage from '@/components/pages/ShopPage'
import FirstOrders from '@/components/pages/FirstOrders';
import TwoOrders from '@/components/pages/TwoOrders';
Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect:'login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },  
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children:[
        {
          path: 'products',
          name: 'Products',
          component:Products,
          meta: { requiresAuth: true }
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
      ] 
    },
    {
      path: '/',
      name: 'ShopPage',
      component: ShopPage,
      children: [
        {
          path: '/',
          name: 'CustomerOrder',
          component: CustomerOrder,
        },
        {
          path: 'first_orders',
          name: 'FirstOrders',
          component: FirstOrders,
        },
        {
          path: 'two_orders',
          name: 'TwoOrders',
          component: TwoOrders,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },
      ],
    },
  ]
})
