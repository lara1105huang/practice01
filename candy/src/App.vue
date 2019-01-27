<template>
  <div id="app">
    <Header/>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/Hearder'
export default {
  name: 'App',
  components:{
    Header,
  },

 
}

</script>

<style lang="scss">
@import './assets/scss/all';
</style>
