<template>
    <div class="mt-5">
        <Loading :active.sync="isLoading"></Loading>

        <div class="table-responsive">
            <table class="table mt-4">
                <thead>
                    <tr>
                        <th>購買時間</th>
                        <th>購買項目</th>
                        <th>購買款項</th>
                        <th>應付金額</th>
                        <th>是否付款</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, key) in sortOrder" :key="key"
                        v-if="orders.length"
                        :class="{'text-secondary': !item.is_paid}" >
                        <td>{{ item.create_at | date }}</td>
                        <td>  
                            <ul class="list-unstyled">
                                <li v-for="(product, i) in item.products" :key="i"> 
                                    {{ product.product.title }} 
                                    數量：{{ product.qty }}
                                    {{ product.product.unit }}
                                </li>
                            </ul>
                        </td>
                        <td class="text-right">
                            {{ item.total | currency }}
                        </td>
                        <td>
                            <strong v-if="item.is_paid" class="text-success">已付款</strong>
                            <span v-else class="text-muted">尚未啟用</span>
                        </td>
                        <td>
                            <a title="編輯" name="編輯" class="h4 mr-2 text-success hvr-grow"
                                @click="openOrderModal(item)"
                            ><i class="fas fa-edit"></i>
                            </a>
                            <!-- <a @click="openDelOrderModal(item)" title="刪除" name="刪除" class="h4 text-danger hvr-grow">
                                <i class="fas fa-times-circle"></i>
                            </a>-->
                        </td>
                        <td></td>
                    </tr>

                </tbody>
            </table>
        </div>
        <!--Pagination-->
        <Pagination :pages="pagination" @emitPages="getOrders"></Pagination>

    <!-- orderModal -->
    <div class="modal fade " id="orderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title " id="exampleModalLabel">修改訂單</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            <div class="row">
                
                
                <div class="col">
                    <div class="form-group">
                    <label for="name">客戶姓名</label>
                    <input type="text" class="form-control" id="name" 
                        v-model="tempOrder.user.name"
                    placeholder="請輸入客戶姓名">
                    </div>

                    <div class="form-group">
                    <label for="tel">客戶電話</label>
                    <input type="text" class="form-control" id="tel" 
                        v-model="tempOrder.user.tel"
                    placeholder="請輸入客戶電話">
                    </div>

                    <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="text" class="form-control" id="email" 
                        v-model="tempOrder.user.email"
                    placeholder="請輸入信箱">
                    </div>

                    <div class="form-group">
                    <label for="address">地址</label>
                    <input type="text" class="form-control" id="address" 
                        v-model="tempOrder.user.address"
                    placeholder="請輸入客戶地址">
                    </div>
                    <div class="form-group">
                    <label for="address">留言訊息</label>
                    <textarea 
                        type="text" class="form-control" id="content"
                        v-model="tempOrder.message"
                        placeholder="請輸入留言訊息"> 
                    </textarea>
                    </div>
                    <hr>
                    <div class="row" >
                    <div class="col-4">
                        <ol>
                            <label class="mr-3" for="title"> 購買款項</label>
                            <li class="mb-3" v-for="(prodId, index) in tempOrder.products" :key="index" >
                            <input type="text" class="form-control mr-3" disabled
                                v-model="prodId.product.title" placeholder="產品名稱">
                            </li>
                        </ol>
                    </div>
                    
                    <div class="col-4">
                        <ul>
                            <label class="mr-3" for="pay">小計</label>
                            <li class="mb-3" v-for="(prodId, index) in tempOrder.products" :key="index" >
                            <input type="text" class="form-control mr-3" disabled
                                v-model="prodId.final_total" placeholder="金額">
                            </li>
                        </ul>
                    </div>
                    <div class="col-4">
                        <ul>
                            <label class="mr-3" for="pay">數量</label>
                            <li class="mb-3" v-for="(prodId, index) in tempOrder.products" :key="index" >
                            <select class="form-control"  v-model="prodId.qty">
                                <option>{{item}}</option>
                            </select>
                            <!-- <input type="number" class="form-control mr-3"  
                                v-model="prodId.qty" placeholder="數量"> -->
                            </li>
                        </ul>
                    </div>
                    
                    </div>
                    
                <div class="form-group ">
                <div class="d-flex flex-row justify-content-center align-items-center">
                    <label class="mr-3" for="">應付款金額</label>          
                    <h3 class="text-primary">${{tempOrder.total}}</h3> 
                </div>  </div>
                
            
                    <div class="form-group ">
                        <div class="form-check">
                            <div class="custom-control custom-checkbox mb-3">
                                <input type="checkbox" class="custom-control-input"
                                    v-model="tempOrder.is_paid"
                                    :true-value= "1"
                                :false-value= "0"
                                    id="is_enabled" >
                            <label class="custom-control-label" for="is_enabled">是否付款</label>   
                            </div>                    
                        </div>     
                                
                    </div>
                </div>
                    
                </div>
            </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
                    <button type="button" @click="updateOrder" class="btn btn-primary">確認</button> 
                </div>
                
            </div>
            
            
            </div>
    </div>
    <!--delOrderModal-->
    <div class="modal fade" id="delOrderModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger">刪除訂單</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger"
                @click="delOrder">確認刪除</button>
            </div>
            </div>
        </div>
    </div>
</div>



</template>

<script>
import Pagination from '../Pagination';
export default {
    name:"Orders",
    components: {
        Pagination,
    },
    data() {
        return {
        orders: {},
        isNew: false,
        pagination: {},
        isLoading: false,
        tempOrder:{
            user:{}
        }
        };
    },
    methods: {
        getOrders(currentPage = 1) {
            const vm = this;
            //取得訂單列表
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${currentPage}`;
            vm.isLoading = true;
            this.$http.get(url,  vm.tempOrder).then((response) => {
                vm.orders = response.data.orders;
                vm.pagination = response.data.pagination;
                vm.isLoading = false;
                console.log(response);
            });
        },
        //editOrder
        openOrderModal(item) {
            const vm = this;  
            vm.isNew = false;
            vm.tempOrder = Object.assign({}, item);
            $('#orderModal').modal('show');
        },
        updateOrder() {
            const vm =this;
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${vm.tempOrder.id}`;
            this.$http.put(url,{ data: vm.tempOrder }).then(response =>{
            console.log(response.data);
                if(response.data.success){
                    vm.getOrders();
                    $('#orderModal').modal('hide');
                    console.log(response.data);

                }
            });  
        },
        //
        //delete
        openDelOrderModal(item) {
        const vm = this;
        $('#delOrderModal').modal('show');
        //Object.assign()被用來複製一個或多個物件自身所有可數的屬性到另一個目標物件。回傳的值為該目標物件
            vm.tempOrder = Object.assign({}, item);
        },
        delOrder() {
        const vm = this;
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${vm.vm.tempOrder.id}`;
        //this.$http.delete
            this.$http.delete(url).then((response) => {
                console.log(response, vm.tempOrder);
                $('#delProductModal').modal('hide');
                vm.isLoading = false;
                this.getOrders();
            });
        }
    },     
    computed: {
        sortOrder() {
            const vm = this;
            let newOrder = [];
            if (vm.orders.length) {
                newOrder = vm.orders.sort((a, b) => {
                const aIsPaid = a.is_paid ? 1 : 0;
                const bIsPaid = b.is_paid ? 1 : 0;
                return bIsPaid - aIsPaid;
                });
            }
            return newOrder;
        },
    },
    created() {
        this.getOrders();
        console.log(process.env.APIPATH);
    },
}
</script>

