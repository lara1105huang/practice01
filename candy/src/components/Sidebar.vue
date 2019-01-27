<template>
<div>
    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between
        align-items-center px-3 mt-4 mb-1 text-muted">
        <span>{{$t("Administrator")}}</span>
        <a class="d-flex align-items-center text-muted" href="#">
          <span data-feather="plus-circle"></span>
        </a>
      </h6>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="/admin/products" class="nav-link">
              <i class="fas fa-box-open"></i> {{$t("sidebar.Product_List")}}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/orders" class="nav-link">
              <i class="far fa-list-alt"></i> {{$t("sidebar.Order_List")}}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/coupons" class="nav-link">
              <i class="fas fa-ticket-alt"></i> {{$t("sidebar.Coupon")}}
            </router-link>
          </li>
        
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>{{$t("sidebar.Analog_function")}}</span>
          <a class="d-flex align-items-center text-muted" href="#">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link to="/customer_order" class="nav-link">
              <i class="fas fa-shopping-cart"></i>{{$t("sidebar.Simulated_order")}}
            </router-link>
          </li>

        </ul>
      </div>
    </nav>
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

