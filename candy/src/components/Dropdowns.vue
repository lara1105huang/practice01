<template>
    <div class="dropdown-mobile">
<div class="btn-group">
  <button type="button" class="btn btn-primary  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Action
  </button>
  <div class="dropdown-menu">
        <router-link to="/admin/products" class="nav-link">
            <i class="fas fa-box-open"></i> 產品列表
        </router-link>
        <router-link to="/admin/orders" class="nav-link">
            <i class="far fa-list-alt"></i> 訂單列表
        </router-link>
        <router-link to="/admin/coupons" class="nav-link">
            <i class="fas fa-ticket-alt"></i> 優惠券
        </router-link>
   
  </div>
</div>
    </div>
</template>

<script>
export default {
    
}
</script>
<style scoped>
.dropdown-mobile{
    display: none;
}
@media (max-width: 767px){
    .dropdown-mobile{
        display: block;
        padding: 1.5rem;
        margin-right: 0;
        margin-left: 0;
        border-width: .2rem;
        width: 100%;
    }
    .dropdown-mobile .btn-group{
         width: 100%;
    }
    .dropdown-mobile .btn-group, .btn-group-vertical {
        width: 100%;
    }
    .dropdown-menu.show {
        display: block;
        width: 100%;
    }
}
</style>


