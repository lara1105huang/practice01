<template>
<div>
<form class="form-signin" @submit.prevent="signin" @keyup.enter="signin">
  <h1 class="h3 mb-3 font-weight-normal">{{$t("login.Please_sign_in")}}</h1>

  <div>
    <label for="inputEmail" class="mt-3">{{$t("login.Email_address")}}</label>
    <!--v-bind:class="{ '要加入的className': 判斷式 }"-->
    <input v-model.trim="user.username" @blur="checkemail()" @keyup.enter="checkemail" :class="{ 'border-danger': msgdanger }"  type="email" id="inputEmail" class="form-control" :placeholder="$t('login.Email_address')" required autofocus>
    <span class="fs-12" :class="{ 'text-danger': email_msgdanger, 'text-success':!email_msgdanger }">{{msgmail}}</span>
  </div>

  <div>
    <label for="inputPassword" class="mt-3">{{$t("login.Password")}}</label>
    <!--在v-model 後加入number 字串轉為數字-->
    <input v-model="user.password" @blur="checkpassword()" @keyup.enter="checkpassword" :class="{ 'border-danger': msgdanger }" type="password" id="inputPassword" class="form-control" :placeholder="$t('login.Password')" required>
    <span class="fs-12" :class="{ 'text-danger': password_msgdanger, 'text-success':!password_msgdanger }">{{msgpassword}}</span>
  </div>

  <div class="checkbox mb-3">
      <input type="checkbox" class="form-checkbox" :id="Remember_me"  
      v-model="Remember_me" :true-value="$t('login.Yes')"  :false-value="$t('login.No')">
      <label :for="Remember_me" class="mt-1">{{$t("Remember_me")}}</label>
  </div>

  <button :disabled="submitDisable" class="btn btn-lg btn-primary btn-block" type="submit">{{$t("login.Sign_in")}}</button>
  <p class="mt-5 mb-3 text-muted">&copy; 2018-2019 larahuang (vue 電商練習作業）</p>
</form>
    </div>
</template>
<script>
import { app } from '../../main'
import Vue from 'vue'
export default {
  
    data(){
        return{
            user:{
                username:'',
                password:''
            },
            Remember_me:'',
            msgmail:'',
            msgpassword: '',
            msgdanger:false,
            email_msgdanger:false,
            password_msgdanger:false,
        }
    },
    methods:{
      //i18n
        changeLang(lang){
            app.$i18n.locale=lang
        },
        checkemail(){
          let regEmail =/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (this.user.username == "") {
              this.msgmail = "X Email 不能為空";
              this.msgdanger=true;
              this.email_msgdanger=true;
            }else if(!regEmail.test(this.user.username)){
              this.msgmail = "X 請輸入Email格式";
              this.msgdanger=true;
              this.email_msgdanger=true;
            }else {
              this.msgmail = 'OK';
               this.msgdanger=false;
              this.email_msgdanger=false;
            }
        },
         checkpassword() {
          let regPassword =/^\d{8}$/;////^[A-Za-z0-9]{8,16}$/密碼的格式為6-12位，只能是字母、數字和下劃線
           // /^ 和 $/ 成對使用是表示要求整個字符串完全匹配定義的規則，而不是只匹配字符串中的一個子串。
          // \d表示數字
          // [ ]方括號表示查找範圍
          // n{X,} 匹配包含至少X個n的序列的字符串。
          if (this.user.password == "") {
            this.msgpassword = "X Password 不能為空";
            this.msgdanger=true;
            this.password_msgdanger = true;
          }else if(!regPassword.test(this.user.password)){
            this.msgpassword = "X Password 錯誤";
            this.msgdanger=true;
             this.password_msgdanger = true;
          }else{
            this.msgpassword = "ok";
            this.msgdanger=false;
            this.password_msgdanger = false;
          }
        },

        signin(){
            const api =`${ process.env.APIPATH }/admin/signin`;
            const vm= this; 
            this.$http.post(api,vm.user).then((response) => {
            console.log(response.data)
            if(response.data.success){
                vm.$router.push('/admin/products')
            }
            })
        }
    },
    computed: {
      //submit必須username password都不能為空才可以按submit
      submitDisable() { 
        let regPassword =/^\d{8}$/; 
        let regEmail =/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (this.user.username == "" || this.user.password == "") {
          return true;      
        }else if(!regEmail.test(this.user.username) || !regPassword.test(this.user.password)){
          return true;
        }
        else{
            return false;
        } 
      },
    },
    watch:{
      issueDatas(){
          if(this.issueDatas.state==1){
              this.submitDisable=true;
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
/*checkbox*/
.form-radio,.form-checkbox
{
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  position: relative;
  background-color: #f1f1f1;
  color: #666;
  top: 7px;
  height: 20px;
  width: 20px;
  border: 0;
  border-radius: 50px;
  cursor: pointer;     
  margin-right: 7px;
  outline: none;
}
.form-radio:checked::before, .form-checkbox:checked::before
{
  position: absolute;
  left: 11px;
  top: 0px;
  margin-top: -5px;
  content: '';
  width: 10px;        
  height: 20px;          
  border-bottom: 3px solid #4dc033;
  border-right: 3px solid #4dc033;
  transform: rotate(45deg);    
}
.form-radio:hover, .form-checkbox:hover
{
  background-color: #f7f7f7;
}
.form-radio:checked, .form-checkbox:checked{
     background-color: #f1f1f1;
}

</style>