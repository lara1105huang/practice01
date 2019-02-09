<template>
<div>
     <loading :active.sync="isLoading"></loading>
    <div class="mt-5">      
    </div>
    <!--搜尋-->
        <div class="input-group mb-3">
          <input type="text" v-model="search" class="form-control" placeholder="搜尋商品標題">
          <div class="input-group-append h2 text-primary ml-1 mt-1 hvr-grow">
            <i class="fas fa-search"></i>
          </div>
        </div>
    <!--table-->
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <td>分類</td>
                    <td>名稱
                        <a @click="reverseArray" class="hvr-icon-spin h5 mt-2 text-primary">
                            <i class="fa fa-chevron-down hvr-icon"></i>
                        </a>
                    </td>
                    <td>原價</td>
                    <td>特價</td>
                    <td>啟用</td>
                    <td>
                        <a @click="openModal(true)" title="新產產品" mame="新增產品" class="h2 text-primary ml-3 hvr-grow">
                            <i class="fas fa-plus-circle"></i>
                        </a>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in filter_products" :key="item.id">
                    <td>{{item.category}}</td>
                    <td>{{item.title}}</td>
                    <td>{{item.origin_price  | currency }}</td>
                    <td>{{item.price  | currency}}</td>
                    <td>
                        <a v-if="item.is_enabled">啟用</a>
                        <a v-else>未啟用</a>
                    </td>
                    <td >
                        <a @click="openModal(false, item)" title="編輯" name="編輯" class="h4 mr-2 text-success hvr-grow">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a @click="openDelProductModal(item)" title="刪除" name="刪除" class="h4 text-danger hvr-grow">
                            <i class="fas fa-times-circle"></i>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

<!--Pagination-->
  <Pagination :pages="pagination" @emitPages="getProducts"></Pagination>
<!--add edit Modal -->
<div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
          <!---->
        <div class="mw-center">
        <h5 class="modal-title text-center" id="exampleModalLabel">{{productsTitle}}</h5>
        </div>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <!---->
         <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image"
                    v-model="tempProduct.imageUrl"
                    @blur="checkImage()"
                    :class="{ 'border-danger': isImageTransform }"  
                    placeholder="請輸入圖片連結">
                    <span class="fs-12" 
                            :class="{ 'text-danger': isImageTransform, 'text-success':!isImageTransform }">
                    {{ msgimage }}
                    </span>
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading">
                    </i>
                    <span class="h2 text-primary ml-3 hvr-grow" 
                    title="上傳圖片" name="上傳圖片"
                    :class="{ 'text-success': status.fileUploadSuccess, 'text-danger':!status.fileUploadSuccess }">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </span>
                  </label>
                  <!--自定義 type="file" 將隱藏 修改label-->
                  <input type="file" id="customFile" class="form-control"
                    ref="files" @change="uploadFile">
                </div>
                <img
                  class="img-fluid" :src="tempProduct.imageUrl" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title"
                    @blur="checktitle()"
                    :class="{ 'border-danger': isTitleTransform }"  
                    v-model="tempProduct.title">
                    <span class="fs-12" 
                            :class="{ 'text-danger': isTitleTransform, 'text-success':!isTitleTransform }">
                    {{msgtitle}}
                    </span>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <select class="form-control" 
                    placeholder="請輸入分類"
                    v-model="tempProduct.category" 
                    @blur="checkcategory()" 
                    :class="{ 'border-danger': isCategoryTransform}"
                    >
                        <option value="" style="display: none" disabled></option>
                        <option value="馬卡龍類">馬卡龍類</option>
                        <option value="甜食類">甜食類</option>
                        <option value="禮盒">禮盒</option>
                    </select>
                    <span class="fs-12" 
                            :class="{ 'text-danger': isCategoryTransform, 'text-success':!isCategoryTransform }">
                    {{msgcategory}}
                    </span>
                  </div>

                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit"
                        @blur="checkunit()"
                        :class="{ 'border-danger': isUnitTransform }"  
                        v-model="tempProduct.unit"
                        placeholder="請輸入單位">
                    <span class="fs-12" 
                            :class="{ 'text-danger': isUnitTransform, 'text-success':!isUnitTransform }">
                    {{msgunit}}
                    </span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price"
                        @blur="checkoriginprice()"
                        :class="{ 'border-danger': isOriginPriceTransform }"  
                        v-model="tempProduct.origin_price"
                        placeholder="請輸入原價">
                        <span class="fs-12" 
                            :class="{ 'text-danger': isOriginPriceTransform, 'text-success':!isOriginPriceTransform }">
                        {{ msgOriginPrice }}
                        </span>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" 
                           @blur="checkprice()" 
                           :class="{ 'border-danger': isPriceTransform }"  
                           v-model="tempProduct.price" 
                           class="form-control" id="price"
                      placeholder="請輸入售價">
                    <span class="fs-12" 
                            :class="{ 'text-danger': isPriceTransform, 'text-success':!isPriceTransform }">
                        {{ msgPrice }}
                    </span>
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description"
                    @blur="checkdescription()" 
                    :class="{ 'border-danger': isDescriptTransform }"  
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"></textarea>
                    <span class="fs-12" 
                            :class="{ 'text-danger': isDescriptTransform, 'text-success':!isDescriptTransform }">
                        {{ msgDescription }}
                    </span>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content"
                    @blur="checkcontent()" 
                    :class="{ 'border-danger': isContentTransform }"  
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"></textarea>
                    <span class="fs-12" 
                            :class="{ 'text-danger': isContentTransform, 'text-success':!isContentTransform }">
                        {{ msgContent }}
                    </span>
                </div>

                <div class="form-group checkbox mt-3 mb-3">
                    <input type="checkbox" class="form-checkbox" 
                    id="is_enabled"  
                    v-model="tempProduct.is_enabled"
                    :true-value="1"
                    :false-value="0">
                    <label for="is_enabled" class="mt-1"> 是否啟用</label>
                </div>
              </div>
            </div>
      </div>
      <div  class="modal-footer">
        <button type="button" class="btn text-secondary fs-40" title="關閉" name="關閉" data-dismiss="modal">
            <i class="fas fa-times-circle"></i>
        </button>
        <button @click="updateProduct" :disabled="submitDisable" title="確認" name="確認" type="submit"  class="btn text-success fs-40">
            <i class="fas fa-check-circle"></i>
        </button>
      </div>
    </div>
  </div>
</div>
<!--delProductModal-->
<div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
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
            是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger"
              @click="delProduct">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { app } from '../../main'
import Vue from 'vue'
import Pagination from '../Pagination';
let regtitle =/^[\u4e00-\u9fa5\dA-Za-z]{2,32}$/; //最長不得超過15個漢字，或32個字節(數字，字母)正則表達式
let regcategory =/^[\u4e00-\u9fa5\dA-Za-z]{2,32}$/;
let regunit =/^[\u4e00-\u9fa5A-Za-z]{1,32}$/; //單位 只能是中文英文,不能數字
let regOriginPrice =/^(0 |[1-9][0-9]*)$/;//只能輸入零和非零開頭的數字
let regPrice =/^(0 |[1-9][0-9]*)$/;//只能輸入零和非零開頭的數字
let regDescription =/^[\u4e00-\u9fa5\dA-Za-z]{2,32}$/
let regContent =/^[\u4e00-\u9fa5\dA-Za-z]{2,32}$/
export default {
    name:"Products",
    components: {
        Pagination,
    },
    data(){
        return{
            products:[],
            tempProduct:{
                title:'',
            },
            pagination: {},
            isNew: false,
            isLoading:false,
            status: {
                fileUploading: false,
                fileUploadSuccess: false,
            },
            productsTitle:'',
            msgimage:'',
            msgtitle:'',
            msgcategory:'',
            msgunit:'',
            msgOriginPrice:'',
            msgPrice:'',
            msgDescription:'',
            msgContent:'',
            isImageTransform:false,
            isTitleTrans:false,
            isTitleTransform:false,
            isCategoryTransform:false,
            isUnitTransform:false,
            isOriginPriceTransform:false,
            isPriceTransform:false,
            isDescriptTransform:false,
            isContentTransform:false,  
            search: '',
        }
    },
    methods:{
        //i18n
        changeLang(lang){
            app.$i18n.locale=lang
        },
         //reverse反轉
        reverseArray(){
            this.products.reverse()
            console.log(this.arrayData)
        },
        /*驗證圖檔*/
        checkImage(){
            //let reghttp =/^http://([w-]+.)+ [w-]+(/[w- ./?%&=]*)?$/ //http://([w-]+.)+ [w-]+(/[w- ./?%&=]*)?
            let vm = this;
            if(vm.tempProduct.imageUrl=="" || vm.tempProduct.imageUrl == undefined || 
            vm.tempProduct.imageUrl == null ||
             (vm.tempProduct.imageUrl.length>0 && vm.tempProduct.imageUrl.trim().length == 0)){
                vm.msgimage="X 不能為空";
                vm.isImageTransform = true;
            }else{
                vm.msgimage = 'OK';
                vm.isImageTransform = false;
            }
        },
        //驗證標題
        checktitle(){
           let vm = this;
            if (vm.tempProduct.title == "" || vm.tempProduct.title == undefined || 
            vm.tempProduct.title == null 
            || (vm.tempProduct.title.length>0 && vm.tempProduct.title.trim().length == 0)) {
              vm.msgtitle = "X 不能為空";
              vm.isTitleTransform=true;
            }else if(!regtitle.test(vm.tempProduct.title)){
              vm.msgtitle = "X 請輸入超過2~32個字以內中文,字母或數字,不能是全形";
              vm.isTitleTransform=true;
            }else {
              vm.msgtitle = 'OK';
              vm.isTitleTransform=false;
            }
        },
        //驗證分類
        checkcategory(){
            let vm = this;
            if (vm.tempProduct.category == "" || vm.tempProduct.category == undefined || 
            vm.tempProduct.category == null || 
            (vm.tempProduct.category.length>0 && vm.tempProduct.category.trim().length == 0)) {
              vm.msgcategory = "X 不能為空";
              vm.isCategoryTransform=true;
            }else if(!regcategory.test(vm.tempProduct.category)){
              vm.msgcategory = "X 請選擇";
              vm.isCategoryTransform=true;
            }
            else {
              vm.msgcategory = 'OK';
              vm.isCategoryTransform=false;
            }
        },
         //驗證單位
        checkunit(){
            let vm = this;
            if (vm.tempProduct.unit == "" || vm.tempProduct.unit == undefined 
            || vm.tempProduct.unit == null 
            || (vm.tempProduct.unit.length>0 && vm.tempProduct.unit.trim().length == 0)) {
              vm.msgunit = "X 不能為空";
              vm.isUnitTransform=true;
            }else if(!regunit.test(vm.tempProduct.unit)){
              vm.msgunit = "X 請輸入超過1~32個字中文或字母,不能是數字";
              vm.isUnitTransform=true;
            }else {
              vm.msgunit = 'OK';
              vm.isUnitTransform=false;
            }
        },
        //驗證原價
        checkoriginprice(){
            let vm = this;
            if (vm.tempProduct.origin_price == "" || vm.tempProduct.origin_price == undefined 
            || vm.tempProduct.origin_price == null 
            || (vm.tempProduct.origin_price.length>0 && vm.tempProduct.origin_price.trim().length == 0)) {
              vm.msgOriginPrice = "X 不能為空";
              vm.isOriginPriceTransform=true;
            }else if(!regOriginPrice.test(vm.tempProduct.origin_price)){
              vm.msgOriginPrice = "X 請輸入大於0數字";
              vm.isOriginPriceTransform=true;
            }else {
              vm.msgOriginPrice = 'OK';
              vm.isOriginPriceTransform=false;
            }
        },
        checkprice(){
            let price = Number(this.tempProduct.price) ;
            let originPrice = Number(this.tempProduct.origin_price);
            let vm = this;
            if (vm.tempProduct.price == "" || vm.tempProduct.price == undefined || 
            vm.tempProduct.price == null || 
            (vm.tempProduct.price.length>0 && vm.tempProduct.price.trim().length == 0)) {
              vm.msgPrice = "X 不能為空";
              vm.isPriceTransform=true;
            }else if(!regPrice.test(vm.tempProduct.price)){
              vm.msgPrice = "X 請輸入大於0數字";
              vm.isPriceTransform=true;
            }else if(price ==originPrice){
               vm.msgPrice = "X 不能與原價相同";
               vm.isPriceTransform=true;
            }else if (price>originPrice){    
               vm.msgPrice = "X 特價不能大於原價";
               vm.isPriceTransform=true;
            }
            else {
              vm.msgPrice = 'OK';
              vm.isPriceTransform=false;
            }
        },
        //驗證描述
        checkdescription(){
            let vm = this;
            if(vm.tempProduct.description == ""|| vm.tempProduct.description == undefined || 
                vm.tempProduct.description == null || (vm.tempProduct.description.length>0 && vm.tempProduct.description.trim().length == 0)){
              vm.msgDescription = "X 不能為空";
              vm.isDescriptTransform=true;
            }else if(!regDescription.test(vm.tempProduct.description)){
              vm.msgDescription = "X 請輸入超過2~32個字以內中文,字母或數字,不能是全形";
              vm.isDescriptTransform=true;
            }else{
              vm.msgDescription = "ok";
              vm.isDescriptTransform=false;
            }
        },
        checkcontent(){
            let vm = this;
            if(vm.tempProduct.content == "" || vm.tempProduct.content == undefined || 
            vm.tempProduct.content == null ||
             (vm.tempProduct.content.length>0 && vm.tempProduct.content.trim().length == 0)){
              vm.msgContent = "X 不能為空";
              vm.isContentTransform=true;
            }else if(!regContent.test(vm.tempProduct.content)){
              vm.msgContent = "X 請輸入超過2~32個字以內中文,字母或數字,不能是全形";
              vm.isContentTransform=true;
            }else{
              vm.msgContent = "ok";
              vm.isContentTransform=false;
            }
        },
        //獲得api 
        getProducts(page = 1){
            const api =`${ process.env.APIPATH }/api/${ process.env.CUSTOMPATH }/admin/products?page=${page}`;
            const vm= this; 
            vm.isLoading = true;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH)
            this.$http.get(api,vm.products).then((response) => {
                console.log(response.data)
                if (response.data.success) {
                    vm.isLoading = false;
                    vm.products = response.data.products;
                    vm.pagination = response.data.pagination;
                }
            })
        },
        //根據tempproduct 判斷是不是新的
        openModal(isNew, item) {           
            if (isNew) {
                this.tempProduct = {};
                this.isNew = true;
                this.productsTitle="新增產品";
            } else {
                //Object.assign()複製一個或多個物件自身所有可數的屬性到另一個目標物件。回傳的值為該目標物件
                this.tempProduct = Object.assign({}, item);
                this.isNew = false;
                this.status.fileUploadSuccess = true;//更改上傳狀態
                this.productsTitle="編輯產品";
                
            }
            $('#productModal').modal('show')
        },
        //更新產品
        updateProduct() {
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`; // 'http://localhost:3000/api/casper/products';
            let httpMethod = 'post';
            const vm = this;
            //如果不是新的 api路徑串接為選擇的id,並且將http的方法改為put
            if (!vm.isNew) {        
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;               
                httpMethod = 'put';        
            }
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
                console.log(response.data);
                //如果獲取成功 就關閉modal 
                if (response.data.success) {
                    $('#productModal').modal('hide');
                    vm.getProducts();                  
                } else {
                $('#productModal').modal('hide');
                    vm.getProducts();
                    console.log('新增失敗');
                }
                // vm.products = response.data.products;
            });
        },
        uploadFile(){
            console.log(this);
            //已經上傳的檔案位置
            const uploadedFile = this.$refs.files.files[0];
            const vm = this;
            const formData = new FormData();
            //附加 file-to-upload name 欄位 uploadedFile為檔案名稱
            formData.append('file-to-upload', uploadedFile);
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
            //欄位加入以後 loading = true
            vm.status.fileUploading = true;
            vm.status.fileUploadSuccess = false;
            //將檔案post 出去
            this.$http.post(url, formData, {
                //將格式調整 解說：https://notfalse.net/39/http-message-format
                //Content-Type 內容類型 這份文件說明了在 HTTP POST 訊息中使用多種格式訊息的作法，它可以用在許多 REST-based API 的系統，它可以混合多種資料格式並一次傳送，當然非文字的資料必須要編碼為二進位字串。
                //https://dotblogs.com.tw/regionbbs/2010/12/20/implement_http_post_multipart_form_data
                //Forms: multipart/form-data，這份文件說明了在 HTTP POST 訊息中使用多種格式訊息的作法，它可以用在許多 REST-based API 的系統，它可以混合多種資料格式並一次傳送，當然非文字的資料必須要編碼為二進位字串。
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response)=>{
                console.log(response.data);
                vm.status.fileUploading = false;
                vm.status.fileUploadSuccess = false;
                if (response.data.success) {
                    // vm.tempProduct.imageUrl = response.data.imageUrl;
                    // console.log(vm.tempProduct);
                    //把欄位強制寫入
                    vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                    vm.status.fileUploadSuccess = true;
                }else{
                    //當上傳的圖檔經過判斷後錯誤方式,經由$bus.$emit傳送到alert 接收＄on出現錯誤訊息提示
                    this.$bus.$emit('messsage:push', response.data.message, 'danger');
                }
            });
        },
        //delete
        openDelProductModal(item) {
        const vm = this;
        $('#delProductModal').modal('show');
        //Object.assign()被用來複製一個或多個物件自身所有可數的屬性到另一個目標物件。回傳的值為該目標物件
            vm.tempProduct = Object.assign({}, item);
        },
        delProduct() {
        const vm = this;
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        //this.$http.delete
            this.$http.delete(url).then((response) => {
                console.log(response, vm.tempProduct);
                $('#delProductModal').modal('hide');
                vm.isLoading = false;
                this.getProducts();
            });
        },
        filterProduct(){
            const vm = this;
            vm.filterProducts = vm.Products.fliter(function(item){
                console.log(vm.filterText, item.title, item.title.match(vm.filterText) )
                //vm.filterText input 輸入的文字
                return item.title.match(vm.filterText);
            })
        },
      
       
    },
    created(){
        this.getProducts()
        //$bus 傳送
       // this.$bus.$emit('messsage:push','這是從products 傳來的訊息','success')
    },
    computed: {
       filter_products() {
            const vm = this;
            //返回 postList 過濾函數
            return this.products.filter(function (item){
                //toLowerCase()方法不會更改原始字符串。
                //註釋： indexOf()方法對大小寫敏感！如果要檢索的字符串值沒有出現，則該方法返回-1。
                return item.title.toLowerCase().indexOf(vm.search.toLowerCase())!== -1
            })
        },
        submitDisable() { 
        let vm = this;
        if ( vm.tempProduct.title == "" || vm.tempProduct.category == "" || vm.tempProduct.unit == "" || vm.tempProduct.origin_price == "" || vm.tempProduct.price == "" || vm.tempProduct.content == "" || vm.tempProduct.description == "") {
          return true;      
        }else if(!regtitle.test(vm.tempProduct.title) || !regcategory.test(vm.tempProduct.regcategory)  || !regunit.test(vm.tempProduct.unit) || !regOriginPrice.test(vm.tempProduct.origin_price) || !regPrice.test(vm.tempProduct.price) || !regContent.test(vm.tempProduct.content) || !regDescription.test(vm.tempProduct.description)){
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
          if(vm.issueDatas.state==1){ // 1 就是true
              vm.submitDisable=true;
          }
      }
    }
  
}
</script>

<style scoped>
/*上傳標籤修改*/
#customFile{
    display: none;
}
</style>


