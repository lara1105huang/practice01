<template>
<div class="mt-5">
    <Loading :active.sync="isLoading"></Loading>
    <div class="text-right ml-5 couponaddicon">
      <a class="h6 ml-5 hvr-grow" title="新增優惠券" name="新增優惠券" @click="openCouponModal(true)">
        <div class="h2 text-primary mt-1">
         <i class="fas fa-plus-circle"></i>
        </div>
        <!-- 新增-->
      </a>
    </div>
    <!--table-->
    <div class="table-responsive">
        <table class="table mt-1">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>折扣百分比</th>
                    <th>到期日</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, key) in coupons" :key="key">
                    <td>{{ item.title }}</td>
                    <td>{{ item.percent }}%</td>
                    <td>{{ item.due_date | date }}</td>
                    <td>
                        <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
                        <span v-else class="text-muted">未起用</span>
                    </td>
                    <td>
                        <a title="編輯" name="編輯" class="h4 mr-2 text-success hvr-grow"
                        @click="openCouponModal(false, item)"
                        ><i class="fas fa-edit"></i></a>
                         <a @click="openDelCouponModal(item)" title="刪除" name="刪除" class="h4 text-danger hvr-grow">
                            <i class="fas fa-times-circle"></i>
                        </a>

                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--couponModal-->
    <div class="modal fade" id="addcouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <!--modal-header-->
                <div class="modal-header">
                    <div class="mw-center">
                    <h5 class="modal-title text-center" id="exampleModalLabel">{{ modalTitle }}</h5>
                    </div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                 <!--modal-body-->
                <div class="modal-body">
                    <div class="form-group">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title" 
                        v-model="tempCoupon.title"
                        @blur="checktitle()"
                        :class="{ 'border-danger': isTitleTransform }"  
                            placeholder="請輸入標題">
                        <span class="fs-12" 
                                :class="{ 'text-danger': isTitleTransform, 'text-success':!isTitleTransform }">
                            {{ msgtitle }}
                        </span>
                        </div>
                        <div class="form-group">
                        <label for="coupon_code">優惠碼</label>
                        <input type="text" class="form-control" id="coupon_code" 
                        v-model="tempCoupon.code"
                          @blur="checkcode()"
                        :class="{ 'border-danger': isCodeTransform }"  
                            placeholder="請輸入優惠碼">
                        <span class="fs-12" 
                                :class="{ 'text-danger': isCodeTransform, 'text-success':!isCodeTransform }">
                            {{ msgcode }}
                        </span>
                        </div>
                        <div class="form-group">
                        <label for="due_date">到期日</label>
                        <input type="date" class="form-control" id="due_date"
                            @blur="checkDate()" v-model="tempCoupon.due_date" 
                            :class="{ 'border-danger': isDateTransform }"  >
                        </div>
                         <span class="fs-12" 
                                :class="{ 'text-danger': isDateTransform, 'text-success':!isDateTransform }">
                            {{ msgdate }}
                        </span>
                        <div class="form-group">
                        <label for="price">折扣百分比</label>
                        <input type="number" class="form-control" id="price"
                            v-model="tempCoupon.percent"
                            @blur="checkPercent()"
                            :class="{ 'border-danger': isPercentTransform }"  
                            placeholder="請輸入折扣百分比">
                        <span class="fs-12" 
                              :class="{ 'text-danger': isPercentTransform , 'text-success':!isPercentTransform  }">
                            {{ msgpercent }}
                        </span>
                        </div>
                        <div class="form-group">

                        <div class="form-group checkbox mt-3 mb-3">
                            <input type="checkbox" class="form-checkbox" 
                            id="is_enabled"  
                            v-model="tempCoupon.is_enabled"
                            :true-value="1"
                            :false-value="0">
                            <label for="is_enabled" class="mt-1"> 是否啟用</label>
                        </div>
                    </div>
                </div>
                <!--modal-footer-->
                <div class="modal-footer">
                    <button type="button" class="btn text-secondary fs-40" title="關閉" name="關閉" data-dismiss="modal">
                        <i class="fas fa-times-circle"></i>
                    </button>
                    <button @click="updateCoupon" :disabled="submitDisable" title="確認" name="確認" type="submit"  class="btn text-success fs-40">
                        <i class="fas fa-check-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!--delCouponModal-->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除優惠券</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger"
                @click="delCoupon">確認刪除</button>
            </div>
            </div>
        </div>
    </div>
     <Pagination :pages="pagination" @emitPages="getCoupons"></Pagination>

    
</div>
</template>

<script>
import Pagination from '../Pagination';
let regtitle =/^[\u4e00-\u9fa5\dA-Za-z]{2,32}$/; //最長不得超過15個漢字，或32個字節(數字，字母)正則表達式
let regcode =/^[\dA-Za-z]{1,32}$/;
let regdate = /^(\d{4})-(\d{2})-(\d{2})$/
let regPercent = /^([1-9]?\d|100)$/
//0-100之間保留兩位小數^(\d|[1-9]\d|100)(\.\d{1,2})?$
//0-100的數，且最多有兩位小數
export default {
    name:'Coupons',
    components: {
        Pagination,
    },
    props: {
        config: Object,
    },
    data() {
        return {
        coupons: {},
        tempCoupon: {
            title: '',
            is_enabled: 0,
            percent: 100,
            due_date: 0,
            code: '',
        },
        due_date: new Date(),
        isLoading:false,
        isNew: false,
        pagination: {},
        modalTitle:'',// 標題
        msgtitle:'',
        msgcode:'',
        msgdate:'',
        msgpercent:'',
        isTitleTransform:false,
        isCodeTransform:false,
        isDateTransform:false,
        isPercentTransform:false,
        };     
    },
    methods: {
         //驗證標題
        checktitle(){  
          let vm=this ;
            if (vm.tempCoupon.title == "" || vm.tempCoupon.title == undefined || 
            vm.tempCoupon.title == null || (vm.tempCoupon.title.length>0 && vm.tempCoupon.title.trim().length == 0)) {
              vm.msgtitle = "X 不能為空";
              vm.isTitleTransform=true;
            }else if(!regtitle.test(vm.tempCoupon.title)){
              vm.msgtitle = "X 請輸入超過2~32個字以內中文,字母或數字,不能是全形";
              vm.isTitleTransform=true;
            }else {
              vm.msgtitle = 'OK';
              vm.isTitleTransform=false;
            }
        },
        //驗證code
        checkcode(){    
            let vm=this ;
            if (vm.tempCoupon.code == "" || vm.tempCoupon.code == undefined || 
            vm.tempCoupon.code == null || (vm.tempCoupon.code.length>0 && vm.tempCoupon.code.trim().length == 0)) {
              vm.msgcode = "X 不能為空";
              vm.isCodeTransform=true;
            }else if(!regcode.test(vm.tempCoupon.code )){
              vm.msgcode  = "X 請輸入超過1~32個字母或數字,不能是全形";
              vm.isCodeTransform=true;
            }
            else {
              vm.msgcode = 'OK';
              vm.isCodeTransform=false;
            }
        },
        //驗證Date
        checkDate(){
            let vm =this ;
            if (vm.tempCoupon.due_date == "" || vm.tempCoupon.due_date == undefined || 
            vm.tempCoupon.due_date == null || (vm.tempCoupon.due_date.length>0 && vm.tempCoupon.due_date.trim().length == 0)) 
            {
                 vm.msgdate = "X 不能為空";
                 vm.isDateTransform =true;
            }else if(!regdate.test(vm.tempCoupon.due_date)){
                vm.msgdate="日期格式錯誤"
                vm.isDateTransform =true;
            }else{
                vm.msgdate="OK";
                vm.isDateTransform =false;
            }
        },
        //驗證Percent
        checkPercent(){
            let vm =this ;
            if (vm.tempCoupon.percent == "" || vm.tempCoupon.percent == undefined || 
            vm.tempCoupon.percent == null || (vm.tempCoupon.percent.length>0 && vm.tempCoupon.percent.trim().length == 0)) 
            {
                 vm.msgpercent = "X 不能為空";
                 vm.isPercentTransform =true;
            }else if(!regPercent.test(vm.tempCoupon.percent)){
                vm.msgpercent="格式錯誤"
                vm.isPercentTransform =true;
            }else{
                vm.msgpercent="OK";
                vm.isPercentTransform =false;
            }
        },
        openCouponModal(isNew, item) {
            const vm = this;  
            $('#addcouponModal').modal('show');
            vm.isNew = isNew;
            if (vm.isNew) {
                vm.tempCoupon = {};
                vm.modalTitle="新增優惠券";
            } else {
                vm.tempCoupon = Object.assign({}, item);
                vm.modalTitle="修改優惠券";
                const dateAndTime = new Date(vm.tempCoupon.due_date * 1000).toISOString().split('T');
                vm.due_date = dateAndTime[0];
            }
        },
        //page = 1 分頁
        getCoupons(page = 1) {
            const vm = this;
            vm.isLoading = true;
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
            this.$http.get(url, vm.coupons).then((response) => {
                vm.coupons = response.data.coupons;
                console.log(response);
                if (response.data.success) {
                    vm.isLoading = false;
                    vm.products = response.data.coupons;
                    vm.pagination = response.data.pagination;//分頁
                }
            });
        },
        updateCoupon() {
            const vm = this;
            if (vm.isNew) {
                const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
                this.$http.post(url, { data: vm.tempCoupon }).then((response) => {
                console.log(response, vm.tempCoupon);
                $('#addcouponModal').modal('hide');
                this.getCoupons();
                });
            } else {
                const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                vm.due_date = new Date(vm.tempCoupon.due_date * 1000);
                this.$http.put(url, { data: vm.tempCoupon }).then((response) => {
                console.log(response);
                $('#addcouponModal').modal('hide');
                this.getCoupons();
                });
            }
        },
        //delete
        openDelCouponModal(item) {
        const vm = this;
        $('#delCouponModal').modal('show');
        //Object.assign()被用來複製一個或多個物件自身所有可數的屬性到另一個目標物件。回傳的值為該目標物件
            vm.tempCoupon = Object.assign({}, item);
        },
        delCoupon() {
        const vm = this;
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;//admin/coupon/:coupon_id
        //this.$http.delete
            this.$http.delete(url).then((response) => {
                console.log(response, vm.tempCoupon);
                $('#delCouponModal').modal('hide');
                vm.isLoading = false;
                this.getCoupons();
            });
        }
    },
    created() {
        this.getCoupons();
    },
    computed: {
        submitDisable() { 
        let vm = this;
        if ( vm.tempCoupon.title == "" || vm.due_date == "" || vm.tempCoupon.code == "") {
          return true;      
        }else if(!regtitle.test(vm.tempCoupon.title) || !regcode.test(vm.tempCoupon.code ) || 
        !regdate.test(vm.tempCoupon.due_date) || !regPercent.test(vm.tempCoupon.percent)){
          return true;
        }
        else{
            return false;
        } 
      },
    },
    watch: {
        due_date() {
            const vm = this;
            const timestamp = Math.floor(new Date(vm.due_date) / 1000);
            vm.tempCoupon.due_date = timestamp;
        },
        issueDatas(){
            let vm = this;
            if(vm.issueDatas.state==1){ // 1 就是true
                vm.submitDisable=true;
            }
        }
    },

}
</script>

<style scoped>
.couponaddicon{
    margin-right:140px
}
</style>
