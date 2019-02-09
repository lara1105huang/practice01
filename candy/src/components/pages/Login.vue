<template>
<div>
  <form class="form-signin" @submit.prevent="signin" @keyup.enter="signin">
    <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>

    <div>
      <label for="inputEmail" class="mt-3">電子郵件</label>
      <!--v-bind:class="{ '要加入的className': 判斷式 }"-->
      <input  v-model.trim="user.username" 
              @blur="checkemail()" 
              @keyup.enter="checkemail" 
              :class="{ 'border-danger': isMailTransform }"  
              placeholder="帳號：lara1105huang@gmail.com"
              id="inputEmail" 
              class="form-control" 
              type="email"
              title="email"
              name="email"
              required autofocus>
      <span class="fs-12" 
            :class="{ 'text-danger': isMailTransform, 'text-success':!isMailTransform }">
      {{msgmail}}
      </span>
    </div>

    <div>
      <label for="inputPassword" class="mt-3">密碼</label>
      <!--在v-model 後加入number 字串轉為數字-->
      <input v-model="user.password" 
      @blur="checkpassword()" 
      @keyup.enter="checkpassword" 
      :class="{ 'border-danger': isPwdTransform }" 
      type="password" id="inputPassword" 
      class="form-control" 
      title="password"
      name="name"
      placeholder="請寫mail通知我索取密碼" required autofocus>
      <span class="fs-12" 
            :class="{ 'text-danger': isPwdTransform, 'text-success':!isPwdTransform }">
      {{msgpassword}}
      </span>
    </div>

    <div class="checkbox mt-3 mb-3">
        <input type="checkbox" name="Remember me" title="Remember me" class="form-checkbox" id="Remember_me"  
        v-model="login.Remember_me" :true-value="1"  :false-value="0">
        <label for="Remember_me" class="mt-1">記住密碼</label>
    </div>

    <button :disabled="submitDisable" title="Sign in" name="Sign in" class="btn btn-lg btn-primary btn-block" type="submit">
      {{$t("login.Sign_in")}}
    </button>
    <p class="mt-5 mb-3 text-muted">&copy; 2018-2019 larahuang (vue 電商練習作業）</p>
  </form>
  <!-- Modal -->
<div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <div class="text-center mw-center">
          <h5 class="modal-title text-center"
          :class="{ 'text-danger': !error.isTransform}" 
           id="exampleModalLabel">{{error.msgTitle}}</h5>
        </div>
        <button type="button" class="close h2" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body text-center">
        <div class="text-center mt-5 mb-3">
          <span class="text-danger h1"><i class="fas fa-exclamation"></i></span>
          {{error.msgError}}
        </div>
      </div>
      <div class="mt-3 mb-5 text-center">
        <a class="h1 text-secondary mr-3" title="關閉" name="關閉" data-dismiss="modal">
          <i class="fas fa-times-circle"></i>
        </a>
        <a  class="h1 text-success" title="確認" name="確認">
          <i class="fas fa-check-circle"></i>
        </a>
      </div>
    </div>
  </div>
</div>
</div>
</template>
<script>
import { app } from '../../main'
import Vue from 'vue'
let regEmail =/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
let regPassword =/^[A-Za-z0-9]{8,42}$/;
///密碼的格式為8-42位，只能是字母、數字
// /^ 和 $/ 成對使用是表示要求整個字符串完全匹配定義的規則，而不是只匹配字符串中的一個子串。
// \d表示數字
// [ ]方括號表示查找範圍
// n{X,} 匹配包含至少X個n的序列的字符串。
///^\d{8}$/
export default {
    data(){
        return{
            user:{
                username:'',
                password:''
            },
            login:{Remember_me:'',},
            msgmail:'',
            msgpassword: '',
            isMailTransform:false,
            isPwdTransform:false,          
            error:{
              msgTitle:'',
              msgError:'',
              isTransform:false
            }
        }
    },   
    methods:{
      //i18n
        changeLang(lang){
            app.$i18n.locale=lang
        },
        checkemail(){     
          let vm = this;
            if (vm.user.username == "" || vm.user.username == undefined || 
            vm.user.username == null ||
            (vm.user.username.length>0 && vm.user.username.trim().length == 0)) {
              vm.msgmail = "X Email 不能為空";
              vm.isMailTransform=true;
            }else if(!regEmail.test(this.user.username)){
              vm.msgmail = "X 請輸入Email格式";
              vm.isMailTransform=true;
            }else {
              vm.msgmail = 'OK';
              vm.isMailTransform=false;
            }
        },
         checkpassword() {        
          let vm = this;
          if (vm.user.password == ""
           || vm.user.password == undefined || vm.user.password == null ||
            (vm.user.password.length>0 && vm.user.password.trim().length == 0)) {
            vm.msgpassword = "X Password 不能為空";
            vm.isPwdTransform=true;
          }else if(!regPassword.test(vm.user.password)){
            vm.msgpassword = "X Password 錯誤";
            vm.isPwdTransform=true;  
          }else{
            vm.msgpassword = "OK";
            vm.isPwdTransform=false;  
          }
        },
        signin(){
            const api =`${ process.env.APIPATH }/admin/signin`;
            const vm= this; 
            this.$http.post(api,vm.user).then((response) => {
            console.log(response.data)
            if(response.data.success){
                vm.$router.push('/admin/products')
            }else{
              $('#messageModal').modal('show')
              vm.error.msgTitle="錯誤訊息",
              vm.error.msgError="帳號或密碼錯誤"
              
            }
            })
        }
    },
    computed: {
      //submit必須username password都不能為空才可以按submit
      submitDisable() { 
        let vm = this;
        if (vm.user.username == "" || vm.user.password == "") {
          return true;      
        }else if(!regEmail.test(vm.user.username) || !regPassword.test(vm.user.password)){
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
}
</script>

<style scoped>
html,
body {
  height: 100%;
}
body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>