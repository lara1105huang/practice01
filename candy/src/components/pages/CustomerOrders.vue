<template>
<div class="container-flouid">
   <loading :active.sync="isLoading"></loading>
  <Jumb/>
  <div class="container">
    <!--搜尋-->
        <div class="row col-sm-12 input-group mb-3">
          <input type="text" v-model="search" class="form-control" placeholder="搜尋商品標題">
          <div class="input-group-append h2 text-primary ml-1 mt-1 hvr-grow">
            <i class="fas fa-search"></i>
          </div>
        </div>
       
    <!--單一產品-->
        <div class="row mt-2">
          <div class="col-md-4 mb-4" v-for="item in  filter_products" :key="item.id">
            <div class="card border-0 shadow-sm">
              <div class="cart-img"
                :style="{backgroundImage: `url(${item.imageUrl})`}">
                <div class="overlay">
                  <a href="#" @click="getProduct(item.id)" class="icon" title="甜點">
                  <i class="fas fa-search-plus"></i>
                  </a>
                </div>
              </div>
              <div class="card-body">
                <span class="badge badge-primary text-white float-right ml-2">{{ item.category }}</span>
                <h5 class="card-title">
                  <a href="#" class="text-primary">{{ item.title }}</a>
                </h5>
                <p class="card-text">{{ item.content }}</p>
                <div class="d-flex justify-content-between align-items-baseline">
                  <div class="h5" v-if="!item.price">{{ item.origin_price  | currency }} 元</div>
                  <del class="h6" v-if="item.price">原價 {{ item.origin_price  | currency }} 元</del>
                  <div class="h6 text-danger" v-if="item.price">特價 {{ item.price  | currency }} 元</div>
                </div>
              </div>
              <div class="card-footer d-flex">
                <button type="button" class="btn btn-outline-secondary btn-sm"
                  @click="getProduct(item.id)">
                  <i class="fas fa-search-plus"></i>
                  <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                  <span class="look-text">查看更多</span>
                </button>
                <!--加到購物車 addtoCart-->
                <button type="button" class="btn btn-outline-primary btn-sm ml-auto"
                  @click="addtoCart(item.id)">
                  <i class="fas fa-shopping-cart"></i>
                 <span class="shop-text"> <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                  加到購物車</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    <!--Pagination-->
        <Pagination :pages="pagination" @emitPages="getProducts"></Pagination>
      
    </div> 
    <!--productModal-->
     <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!--imageUrl-->
              <img :src="product.imageUrl" class="img-fluid" alt="">
              <blockquote class="blockquote mt-3">
                <p class="mb-0">{{ product.content }}</p>
                <footer class="blockquote-footer text-right">{{ product.description }}</footer>
              </blockquote>
              <div class="d-flex justify-content-between align-items-baseline">
                <div class="h4" v-if="!product.price">{{ product.origin_price  | currency }} 元</div>
                <del class="h6" v-if="product.price">原價 {{ product.origin_price  | currency }} 元</del>
                <div class="h4" v-if="product.price">現在只要 {{ product.price  | currency }} 元</div>
              </div>
              <select name="" class="form-control mt-3" v-model="product.num">
                <!--***num-->
                <option :value="num" v-for="num in 10" :key="num">
                  選購 {{num}} {{product.unit}}
                </option>
              </select>
            </div>
            <div class="modal-footer">
              <div class="text-muted text-nowrap mr-3">
                小計 <strong>{{ product.num * product.price  | currency }}</strong> 元
              </div>
              <button type="button" class="btn btn-primary"
                @click="addtoCart(product.id, product.num)">
                <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                加到購物車
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</div>
</template>

<script>
import Pagination from '../Pagination';
import Jumb from '../Jumbotron'
export default {
  data() {
    return {
      products: [
      ],
      product: {},
      pagination: {},
      status: {
        loadingItem: '',
      },
      isLoading: false,
      cart: {},
      coupon_code: '',
      search: '',
      visibility:'all'
    };
  },
  components: {
    Pagination,Jumb
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        console.log(response);
        vm.isLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
      //取得單一產品
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then((response) => {
        //讀取產品資料後,將modeal 打開
        vm.product = response.data.product;
        $('#productModal').modal('show');
        console.log(response);
        vm.status.loadingItem = '';
      });
    },
    //新增購物車
    addtoCart(id, qty = 1) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      vm.isLoading = true;
      this.$http.post(url, { data: cart }).then((response) => {
        vm.isLoading = false;
        if(response.data.success){
            this.$bus.$emit('getTotal')
        }
      });
    },
    getCart() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.cart = response.data.data;
        console.log(response);
        vm.isLoading = false;
      });
    },
    //刪除購物車單筆
    removeCartItem(id){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      //delete
      this.$http.delete(url).then(() => {
        //獲取購物車內容
        vm.isLoading = false;
        this.$bus.$emit('getTotal')
        vm.getCart();       
      });
    }, 
    addCouponCode(){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon ={
        code:vm.coupon_code,
      }
      vm.isLoading = true;
      //
      this.$http.post(url, { data:coupon } ).then((response) => {
       vm.isLoading = false;
        vm.getCart();
        console.log(response);
      });
    },
  },
  computed: {
    filter_products() {
      const vm = this;
            //返回 products 過濾函數
      return vm.products.filter(function (item){
                //toLowerCase()方法不會更改原始字符串。
                //註釋： indexOf()方法對大小寫敏感！如果要檢索的字符串值沒有出現，則該方法返回-1。
      return item.title.toLowerCase().indexOf(vm.search.toLowerCase())!== -1
      })
    },

  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>
<style scoped>
.look-text{
  display: inline-block
}
.shop-text{
  display: inline-block
}

@media (max-width:1000px){
  .look-text{
  display: none;
  }
  .shop-text{
    display: none;
  }
  .card-footer .btn .fa-search-plus,.card-footer .btn .fa-shopping-cart{
    font-size: 24px;
  }
  .btn-outline-secondary,.btn-outline-primary  {
    border-color: transparent;
  }
  .card-footer {
    border-top: 1px dashed #ddd;
}
}
</style>

