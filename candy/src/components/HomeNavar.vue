<template>
<div>
 <nav class="navbar fixed-top bg-white borer-dashed-normal">
      <router-link class="lang-icon" to="/">
        <i class="fas fa-bullseye" aria-hidden="true"></i>
        六角糖心甜專賣店
      </router-link>
      <!-- 購物車內的數量 (Button 內包含 icon, 數量 badge) -->
      <div class="dropdown ml-auto">
         <router-link to="/first_orders" class="btn-sm btn-cart hvr-grow">
          <i class="fa fa-shopping-cart shop-icon text-primary fa-2x"></i>
          <Num/>
          <span class="sr-only">xx</span>
        </router-link>
        <!--
        <div class="dropdown-menu dropdown-menu-right p-3" style="min-width: 300px"
          data-offset="400">
          <h6>已選擇商品</h6>
          <table class="table table-sm">
            <tbody>
              <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts.length">
                <td class="align-middle text-center">
                  <a href="#" class="text-muted" @click.prevent="removeCart(item.id)">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </a>
                </td>
                <td class="align-middle">{{ item.product.title }}</td>
                <td class="align-middle">{{ item.qty }}{{item.product.unit}}</td>
                <td class="align-middle text-right">{{item.total}}</td>
              </tr>
            </tbody>
          </table>
          
          <router-link to="/first_orders" class="btn btn-primary btn-block">
            <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
          </router-link>
         
        </div>-->
      </div>
      <router-link to="/login" class="nav-link h2 text-primary ml-3 hvr-grow" href="#">
        <i class="fas fa-user-graduate"></i>
      </router-link>
    </nav>
   

</div>
</template>

<script>
import Num from './Num'
export default {

  data() {
    return {
      cart: {
        carts: [],
      },
      isLoading: false,
    };
  },
  components:{
    Num
  },
  methods: {
    getCart() {
      const vm = this;
      vm.isLoading = true;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(url).then((response) => {
        if (response.data.data.carts) {
          vm.cart = response.data.data;
        }
        vm.isLoading = false;
        console.log('取得購物車', response.data.data);
      });
    },
    removeCart(id) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then((response) => {
        vm.isLoading = false;
        vm.getCart();
        console.log('刪除購物車項目', response);
      });
    },
  },
  created() {
    this.getCart();
  },
};
</script>

<style>
.jumbotron-bg {
  /* banners.png */
  background: url('https://previews.dropbox.com/p/thumb/AAUBXfCNlKn-Uu73Uf2fZp-0bT8QEe0TAdznCyoGG1Dr6xK9aQC4eM74YSxif3bQff0o5E3yezhxvcTKvHuQ8cOmohpuAScXJWbFPE2edV16uLDmRicH_-5YteBgSFcioYwtD0MadVHGXDOFoy-R1bWhrexpEKg3WZgLFYwfkwn3gXsfWo45yVSUUTz0yln1hhqwKW5fYSYsnwnMHW6EH2R1JuINgPmgYBXmvJ_mokN4JQ/p.png');
  background-size: cover;
  background-position: center center;
  min-height: 400px;
}
/* 半透明背景 */
.bg-lighter {
  background-color: rgba(255, 255, 255, .45);
}
/* 購物車按鈕 */
.btn-cart {
  background-color: transparent;
  position: relative;
}
/* 購物車按鈕定位 */
.btn-cart .badge {
  position: absolute;
  top: 1px;
  right: 1px;
}
.main-content {
  min-height: calc(100vh - 56px - 176px)
}
.box-shadow {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, .05);
  transition: .3s linear;
}
.box-shadow:hover {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, .08);
}
.dropdown-menu-right {
  right: 0;
  left: auto;
}
.alert-rounded {
  border-radius: 50px;
}
</style>
