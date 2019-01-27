<template>
  <div class="text-right" style="width:89%">
    <div class="lang-dropdown">
      <span>＠</span>
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
  name: 'HelloWorld',
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
}
a {
  color: #42b983;
}
.lang-dropdown {
  position: relative;
  display: inline-block;
  margin: 20px 0px 0px 0px;
}
.lang-dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100px;
  margin: 0px 0px 0px -50px;
  padding:5px 5px;
  text-align: center
}
.lang-dropdown:hover .lang-dropdown-content {
  display: block;
}
</style>
