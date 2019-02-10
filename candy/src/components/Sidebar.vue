<template>
<div>
<div class="col-sm-2 col-md-2 col-lg-2 d-none d-md-block">
    <nav class="sidebar bg-light web">
      <div class="sidebar-sticky mt-5">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="/admin/products" class="nav-link">
              <i class="fas fa-box-open"></i> 產品列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/orders" class="nav-link">
              <i class="far fa-list-alt"></i> 訂單列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/coupons" class="nav-link">
              <i class="fas fa-ticket-alt"></i> 優惠券
            </router-link>
          </li>
        </ul>     
      </div>
    </nav>
</div>
</div>
</template>
<script>
import { app } from '../main'
import Vue from 'vue'
export default {
  name:'Sidebar',
  methods:{
    changeLang(lang){
    app.$i18n.locale=lang
    },
  }
}
</script>
<style scoped>

.dropdown-product {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  width:767px;
  font-size: 21px;
  background: #FA7268 ;
  padding: 30px auto;
  margin: 30px auto;
  line-height: 50px;
}
.dropdown-content-product {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px auto;;
  z-index: 1;
}
.dropdown-product:hover .dropdown-content-product {
  display: block;
}
</style>


