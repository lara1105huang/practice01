<template>
  <div>
   <a @click.prevent="signout">登出</a>
  </div>
</template>

<script>
import { app } from '../main'
import Vue from 'vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      
    }
  },
  methods:{
    changeLang(lang){
        app.$i18n.locale=lang
    },
    signout(){
      const api =`${ process.env.APIPATH }/logout`;
      const vm= this; 
      this.$http.post(api).then((response) => {
      console.log(response.data)
        if(response.data.success){
          vm.$router.push('/login')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
}
li {
  display: block;
}
a {
  color: #42b983;
}
.lang-dropdown {
  position: relative;
  display: inline-block;
}
.lang-dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  margin-top: 0px;
  padding:10px 16px;
}
.lang-dropdown:hover .lang-dropdown-content {
  display: block;
}
</style>
