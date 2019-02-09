<template>
    <div class="my-5 row justify-content-center">
         <div class="container main-contant py-5 text-center">
       <h5 class="mb-2">訂購步驟</h5>
      <div class="form-row align-items-center text-center">    
        <div class="col"> 
         <router-link to="/first_orders">
          <div class="mb-0 text-primary">
            <div class="progress-icon">1</div>
            <div>訂單內容</div>
          </div>
          </router-link>
        </div>
        <div class="col">
            <router-link to="/two_orders">
          <div class="mb-0 text-primary" role="alert">
            <div class="progress-icon">2</div>
            <div>填寫結帳資訊</div>
          </div>
            </router-link>
        </div>
        <div class="col">
          <div class="mb-0 text-primary" role="alert">
            <div class="progress-icon">3</div>
            <div>完成</div>
          </div>
        </div>
        
      </div>
      <div class="row progress-suscessline"></div>
      
    </div>
        <form class="col-md-6" @submit.prevent="payOrder">
            <h5 class="py-3 mt-5 mb-2 text-center bg-light">
                確認訂購資料
            </h5>
        <table class="table">
            <thead>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
            </thead>
            <tbody>
            <tr v-for="item in order.products" :key="item.id">
                <td class="align-middle">{{ item.product.title }}</td>
                <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="2" class="text-right">總計</td>
                <td class="text-right">{{ order.total }}</td>
            </tr>
            </tfoot>
        </table>

        <table class="table">
            <tbody>
            <tr>
                <th width="100">Email</th>
                <td>{{ order.user.email }}</td>
            </tr>
            <tr>
                <th>姓名</th>
                <td>{{ order.user.name }}</td>
            </tr>
            <tr>
                <th>收件人電話</th>
                <td>{{ order.user.tel }}</td>
            </tr>
            <tr>
                <th>收件人地址</th>
                <td>{{ order.user.address }}</td>
            </tr>
            <tr>
                <th>付款狀態</th>
                <td>
                <span v-if="!order.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="text-right" v-if="order.is_paid === false">
             <router-link to="/" class="btn btn-secondary">繼續選購</router-link>
            <button class="btn btn-danger">確認付款去</button>
        </div>
        </form>
    </div>
</template>

<script>
export default {
    name:'CustomerCheckout',
    data() {
        return {
            order: {
                user: {},
            },
            orderId: '',
        }
    },
    methods: {
        getOrder() {
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${vm.orderId}`;
            vm.isLoading = true;
            this.$http.get(url).then((response) => {
                vm.order = response.data.order;
                console.log(response);
                vm.isLoading = false;
            });
        },
        payOrder() {
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/pay/${vm.orderId}`;
            vm.isLoading = true;
            this.$http.post(url).then((response) => {
                console.log(response);
                if (response.data.success) {
                vm.getOrder();
                }
                vm.isLoading = false;
            });
        },
    },
    created() {
        this.orderId = this.$route.params.orderId;
        this.getOrder();
        console.log(this.orderId);
    },
}
</script>
