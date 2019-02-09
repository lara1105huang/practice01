<template>
<div class="container-flouid">
 <HomeNavar/>
<router-view/>
<Footer/>
</div>
</template>
<script>

import HomeNavar from '../HomeNavar'
import Footer from '../footer'
export default {
    name:'',
    data() {
        return {
        cart: {
            carts: [],
        },
        isLoading: false,
        };
    },
   components:{
       HomeNavar,
       Footer

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
}
</script>

<style>
.jumbotron-bg {
  /* banners.png */
  background: url('../../assets/img/a.png');
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
