<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-10">
      <div class="col-md-6 mb-6" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-primary text-white float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-primary">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <!--加到購物車 addtoCart-->
            <button type="button" class="btn btn-outline-primary btn-sm ml-auto"
              @click="addtoCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
<!--Pagination-->
  <Pagination :pages="pagination" @emitPages="getProducts"></Pagination>
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
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
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
              小計 <strong>{{ product.num * product.price }}</strong> 元
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
    <!--table-->
    <div class="my-5 row justify-content-center">
      <div class="my-5 row justify-content-center">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts">
              
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div> 
              </td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
              <td class="align-middle">
                  <!--刪除購物車單筆id-->
                <button @click="removeCartItem(item.id)" type="button" class="btn btn-outline-danger btn-sm">
                  <i  class="far fa-trash-alt" ></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total }}</td>
            </tr>
            <!--假設最後的總價不等於總價才會出現-->
             <tr v-if="cart.final_total !== cart.total">
              <td colspan="3"  class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr> 
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input v-model="coupon_code" type="text" class="form-control" placeholder="請輸入優惠碼">
          <div class="input-group-append">
            <button @click="addCouponCode" class="btn btn-outline-secondary" type="button">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--form-->
    <div class="my-5 row justify-content-center">
      <!--
        1.綁定form 表單
        2.驗證required|email 表示,傳入 errors.first() 顯示錯誤訊息,使用 errors.first() 顯示 第一個 錯誤訊息
      -->
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input type="email" class="form-control" name="email" id="useremail"
            @blur="checkemail()" 
            :class="{ 'border-danger': isMailTransform }" 
            v-model="form.user.email" placeholder="請輸入 Email">
          <span :class="{ 'text-danger': isMailTransform, 'text-success':!isMailTransform }">
            {{msgmail}}
          </span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" id="username"
            @blur="checkName()" 
            :class="{ 'border-danger': isNameTransform }" 
            v-model="form.user.name" placeholder="輸入姓名">
          <span :class="{ 'text-danger': isNameTransform, 'text-success':!isNameTransform }">
            {{msgName}}
          </span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" id="usertel"
           @blur="checkTel()" 
           :class="{ 'border-danger': isTelTransform }" 
            v-model="form.user.tel" placeholder="請輸入電話">
          <span :class="{ 'text-danger': isTelTransform, 'text-success':!isTelTransform }">
            {{msgTel}}
          </span>
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input type="address" class="form-control" name="address"
            id="useraddress" 
             @blur="checkAddress()" 
            v-model="form.user.address" 
             :class="{ 'border-danger': isAddressTransform }" 
            placeholder="請輸入地址">
          <span :class="{ 'text-danger': isAddressTransform, 'text-success':!isAddressTransform }">
            {{msgAddress}}
          </span>
        </div>

        <div class="form-group">
          <label for="useraddress">留言</label>
          <textarea name="" id="" class="form-control" cols="30" rows="5"
            v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button :disabled="submitDisable" class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
import Pagination from '../Pagination';
let regEmail =/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
let regName =/^[\u4e00-\u9fa5A-Za-z]{2,32}$/; 
let regTel=/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
let regAddress =/^[\u4e00-\u9fa5A-Za-z]{2,32}$/; 
export default {
  data() {
    return {
      products: [],
      product: {},
      pagination: {},
      status: {
        loadingItem: '',
      },
      isLoading: false,
      cart: {},
      coupon_code: '',
      //
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      //
      msgmail:'',
      isMailTransform:false,
      msgName:'',
      isNameTransform:false,
      msgTel:'',
      isTelTransform:false,
      msgAddress:'',
      isAddressTransform:false,

    };
  },
  components: {
    Pagination,
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
    //
    checkemail(){     
      let vm = this;
       if (vm.form.user.email == "" || vm.form.user.email == undefined || 
            vm.form.user.email == null ||
            (vm.form.user.email.length>0 && vm.form.user.email.trim().length == 0)) {
              vm.msgmail = "X Email 不能為空";
              vm.isMailTransform=true;
        }else if(!regEmail.test(this.form.user.email)){
              vm.msgmail = "X 請輸入Email格式";
              vm.isMailTransform=true;
        }else {
              vm.msgmail = 'OK';
              vm.isMailTransform=false;
        }
      },
      checkTel(){ 
        let vm = this;
        if (vm.form.user.tel == "" || vm.form.user.tel == undefined || 
            vm.form.user.tel == null ||
            (vm.form.user.tel.length>0 && vm.form.user.tel.trim().length == 0)) {
              vm.msgTel = "X 電話不能為空";
              vm.isTelTransform=true;
        }else {
              vm.msgTel = 'OK';
              vm.isTelTransform=false;
         }
      },
      checkName(){
        let vm = this;
        if (vm.form.user.name == "" || vm.form.user.name == undefined || 
            vm.form.user.name == null ||
            (vm.form.user.name.length>0 && vm.form.user.name.trim().length == 0)) {
              vm.msgName = "X 姓名不能為空";
              vm.isNameTransform=true;
            }else if(!regName.test(this.form.user.name)){
              vm.msgName = "X 請輸入2個字以上中文或英文";
              vm.isNameTransform=true;
            }else {
              vm.msgName = 'OK';
              vm.isNameTransform=false;
        }
      },
      checkAddress(){
        let vm = this;
        if (vm.form.user.address == "" || vm.form.user.address == undefined || 
            vm.form.user.address == null ||
            (vm.form.user.address.length>0 && vm.form.user.address.trim().length == 0)) {
              vm.msgAddress = "X 地址不能為空";
              vm.isAddressTransform=true;
            }else if(!regAddress.test(this.form.user.address)){
              vm.msgAddress = "X 請輸入2個字以上中文或英文";
              vm.isAddressTransform=true;
            }else {
              vm.msgAddress = 'OK';
              vm.isAddressTransform=false;
        }
      },
      createOrder(){
         const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
          const vm= this; 
          const order = vm.form;
            this.$http.post(api, { data: order }).then((response) => {
            console.log('訂單已建立', response);
            if(response.data.success){
              vm.isLoading = false;
              this.$bus.$emit('getTotal')
                 vm.$router.push(`/customer_checkout/${response.data.orderId}`);
            }else{
              
              console.log('欄位不完整');
            }
            })
       }
    
  },
  created() {
    this.getProducts();
    this.getCart();
  },
   computed: {
      //submit必須username password都不能為空才可以按submit
      submitDisable() { 
        let vm = this;
        if (vm.form.user.email == ""  || vm.form.user.name == "" || vm.form.user.tel == "" || vm.form.user.address=="") {
          return true;      
        }
        else{
            return false;
        } 
      },
    },
    watch:{
      issueDatas(){
        let vm = this;
          if(vm.issueDatas.state==1){
              vm.submitDisable=true;
          }
      }
    }

};
</script>