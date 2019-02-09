<template>
<div class="mt-10">
        <!-- 左側選單 (List group) 
        <div class="list-group sticky-top" >
          <a v-for="item in categories"  :class="{'active': visiblity=='all'}" @click="visiblity='all'" class="list-group-item list-group-item-action" data-toggle="list" href="#list-gold">
            <i class="fa fa-suitcase" aria-hidden="true"></i> 全部
          </a>
          <a  :class="{'active': visiblity=='macaron'}" @click="visiblity='macaron'" class="list-group-item list-group-item-action" data-toggle="list" href="#list-gift">
            <i class="fa fa-gift" aria-hidden="true"></i> 禮品區
          </a>
          <a :class="{'active': visiblity=='gift'}" @click="visiblity='gift'" href="#"  class="list-group-item list-group-item-action disabled">
            <i class="fa fa-film" aria-hidden="true"></i> 影音商品
          </a>
          
        </div>-->
   <nav class="d-none d-md-block">
      <div class="sidebar-sticky">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="/" :class="{'active' : visibility == 'all'}" @click="visibility='all'" class="nav-link">
              <i class="fas fa-heart"></i> 特色產品
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" :class="{'active' : visibility == 'active'}" @click="visibility='active'" class="nav-link">
             <i class="fas fa-bullseye"></i> 甜點專區
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" :class="{'active' : visibility == 'completed'}"  @click="visibility='completed'" class="nav-link">
              <i class="fas fa-gift"></i>禮品專區
            </router-link>
          </li> 
        </ul>
      </div>
    </nav>
</div>
</template>
<script>
export default {
  name:'ListGroup',
  components:{
  },
  data(){
    return{
      visiblity:'all',
      categories:[
        {title:'馬卡龍類'},
        {title:'甜點類'},
        {title:'禮盒'},
      ],
      visibility:'all'
    }
  },
  computed:{
    filterCategory(){
       const vm = this;
      if (visibility=='all'){
        return vm.products;
      }
      return[];

    }
  }
}
</script>

