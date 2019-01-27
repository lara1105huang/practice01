<template>
<div>
     <loading :active.sync="isLoading"></loading>

    <div class="mt-3">
        <a @click="openModal(true)" class="btn btn-outline-primary btn-sm text-right">新增產品</a>
    </div>
<div class="table-responsive">
    <table class="table mt-4">
        <thead>
            <tr>
                <td>分類</td>
                <td>產品名稱</td>
                <td>原價</td>
                <td>特價</td>
                <td>是否啟用</td>
                <td>編輯</td>
            </tr>
        </thead>
        <tbody>
             <tr v-for="(item) in products" :key="item.id">
                <td>{{item.category}}</td>
                <td>{{item.title}}</td>
                <td>{{item.origin_price  | currency }}</td>
                <td>{{item.price  | currency}}</td>
                <td>
                    <a v-if="item.is_enabled">啟用</a>
                    <a v-else>未啟用</a>
                </td>
                <td>
                    <button  @click="openModal(false, item)" class="btn btn-outline-primary btn-sm">編輯</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!---->
  <Pagination :pages="pagination" @emitPages="getProducts"></Pagination>
<!-- Modal -->
<div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">add product</h5>
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
                    placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading">

                    </i>
                  </label>
                  <!---->
                  <input type="file" id="customFile" class="form-control"
                    ref="files" @change="uploadFile">
                </div>
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid" :src="tempProduct.imageUrl" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button @click="updateProduct" type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import Pagination from '../Pagination';
export default {
    name:"Products",
    components: {
        Pagination,
    },
    data(){
        return{
            products:[],
            tempProduct:{},
            pagination: {},
            isNew: false,
            isLoading:false,
            status: {
                fileUploading: false,
            },
        }
    },
    methods:{
        //i18n
        changeLang(lang){
            app.$i18n.locale=lang
        },
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
            } else {
                this.tempProduct = Object.assign({}, item);
                this.isNew = false;
            }
            $('#productModal').modal('show')
        },
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
            //欄位加入以後 oading = true
            vm.status.fileUploading = true;
            //將檔案post 出去
            this.$http.post(url, formData, {
                //將格式調整
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response)=>{
                console.log(response.data);
                vm.status.fileUploading = false;
                if (response.data.success) {
                    // vm.tempProduct.imageUrl = response.data.imageUrl;
                    // console.log(vm.tempProduct);
                    //把欄位強制寫入
                    vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                }else{
                    this.$bus.$emit('messsage:push', response.data.message, 'danger');
                }
            });
        },
    },
    created(){
        this.getProducts()
    }
}
</script>

