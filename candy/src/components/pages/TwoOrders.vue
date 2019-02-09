<template>
  <div class="mt-5">
    <loading :active.sync="isLoading"></loading>
    <div class="container main-contant py-5 text-center">
        <h5 class="mb-2">訂購步驟</h5>
        <div class="form-row align-items-center text-center">    
        <div class="col"> 
            <router-link to="/first_orders">
                <div class="mb-0 text-primary" role="alert">
                    <div class="progress-icon">1</div>
                    <div>訂單內容</div>
                </div>
            </router-link>
        </div>
        <div class="col">
          <div class="mb-0" role="alert">
            <div class="progress-icon">2</div>
            <div>填寫結帳資訊</div>
          </div>
        </div>
        <div class="col">
          <div class="mb-0" role="alert">
            <div class="progress-icon-2">3</div>
            <div>完成</div>
          </div>
        </div>
      </div>
      <div class="row progress-line"></div>
      <div class="row progress-basicline"></div>
    </div>

    <!--form-->
    <div class="my-2 row justify-content-center">
      <!--
        1.綁定form 表單
        2.驗證required|email 表示,傳入 errors.first() 顯示錯誤訊息,使用 errors.first() 顯示 第一個 錯誤訊息
      -->
      
      <form class="col-md-6" @submit.prevent="createOrder">
         <h5 class="py-3 mt-5 mb-2 text-center bg-light">
          訂購人資訊
        </h5>

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
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" id="usertel"
           @blur="checkTel()" 
           :class="{ 'border-danger': isTelTransform }" 
            v-model="form.user.tel" placeholder="請輸入電話">
          <span :class="{ 'text-danger': isTelTransform, 'text-success':!isTelTransform }">
            {{msgTel}}
          </span>
        </div>

       

        <div class="form-row">
            <div class="form-group col-md-4">
              <label for="state">國家</label>
              <select id="state" class="form-control" required>
                <option selected>台灣</option>
                <option>台灣離島</option>
                <option>日本</option>
              </select>
            </div>
            <div class="form-group col-md">
              <label for="city">城市</label>
              <select name="" id="city" class="form-control" required>
                <option value="台北市">台北市</option>
                <option value="台北市">台中市</option>
                <option value="台南市">台南市</option>
                <option value="高雄市">高雄市</option>
              </select>
            </div>
            <div class="form-group col-md">
              <label for="inputZip">郵遞區號</label>
              <input type="text" class="form-control" id="inputZip">
            </div>
          </div>
          <div class="form-group">
            <label for="inputAddress">地址</label>
            <input type="text" 
             @blur="checkAddress()" 
            v-model="form.user.address" 
             :class="{ 'border-danger': isAddressTransform }" 
            placeholder="請輸入地址"
            class="form-control" id="inputAddress" required>
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
           <router-link to="/" class="btn btn-secondary">繼續選購</router-link>
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