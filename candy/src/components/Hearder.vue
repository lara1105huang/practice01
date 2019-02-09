<template>
  <div class="text-right sm-7">
    <div class="lang-dropdown">
      <span><i class="fas fa-globe lang-icon"></i></span>
      <ul class="lang-dropdown-content">
        <li @click="changeLang('en')">en</li>
        <li @click="changeLang('tw')">tw</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { app } from '../main'
import Vue from 'vue'
export default {
  name: 'Header',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    changeLang(lang){
        app.$i18n.locale=lang
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mr-20{
    margin-right: 150px
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
}
li {
  display: block;
  font-size: 16px;
}
a {
  color: #42b983;
}
.sm-7 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 62%;
    flex: 0 0 62%;
    max-width: 62%;
}
.lang-icon{
  font-size:25px; 
  color:#ff6761;
}
.lang-dropdown {
  position: relative;
  display: inline-block;
  margin: 20px 0px 0px 0px;
}
.lang-dropdown-content {
  display: none;
  position: absolute;
  background-color: #ff6761;
  min-width: 100px;
  margin: 0px 0px 0px -50px;
  padding:10px 5px;
  text-align: center
}
.lang-dropdown:hover .lang-dropdown-content {
  display: block;
}
.lang-dropdown:hover .lang-dropdown-content li {
  font-size: 16px;
}
@media (max-width:767px){
  .sm-7 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 70%;
    flex: 0 0 70%;
    max-width: 70%;
  }
}
@media (max-width:480px){
  .sm-7 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 80%;
    flex: 0 0 80%;
    max-width: 80%;
  }
}
@media (max-width:380px){
  .sm-7 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 85%;
    flex: 0 0 85%;
    max-width: 85%;
  }
}
</style>
