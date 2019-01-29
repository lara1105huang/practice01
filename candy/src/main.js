// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import App from './App'
import 'bootstrap'
import './bus';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';
import router from './router'
import VueI18n from 'vue-i18n'
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';
VeeValidate.Validator.localize('zh_TW', zhTWValidate);//驗證中文化
Vue.use(VeeValidate);

Vue.use(VueAxios, axios)
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.component('Loading',Loading)
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);
// init
Vue.use(VueI18n)
//語言
var i18n = new VueI18n({
 locale: 'en',
 messages:{
   'en':require('./lang/en.json'),
   'tw':require('./lang/tw.json')
 }
})
/* eslint-disable no-new */
export const  app=new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
//
router.beforeEach((to, from, next) => {
  console.log('to', to,'from', from,'next',next)
  if(to.meta.requiresAuth){
    const api =`${ process.env.APIPATH }/api/user/check`;
    const vm = this; 
    axios.post(api).then((response) => {
      console.log(response.data)
        if(response.data.success){
          next();
        }else{
          next(
            {
              path:('/login')
            }
          );
        }
    })
  }else{
    next();
  }
})
