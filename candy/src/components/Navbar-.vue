<template>
<div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <!--  <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
        <input class="form-control form-control-dark w-75" type="text" placeholder="Search" aria-label="Search">
        <div class="lang-dropdown">
        <span><i class="fas fa-globe lang-icon hvr-grow" title="lang" name="lang"></i></span>
        <ul class="lang-dropdown-content">
            <li @click="changeLang('en')" title="En" name="en">en</li>
            <li @click="changeLang('tw')" title="Tw" name="en">tw</li>
        </ul>
        </div>-->
        <ul class="navbar-nav text-right">
            <li class="nav-item text-nowrap mt-3">
            <a @click.prevent="signout" class="nav-link h2 hvr-grow"  title="Sign out" name="Sign out" href="#">
                <i class="fas fa-sign-out-alt"></i>
            </a>
            </li>
        </ul>
    </nav>
</div>
</template>

<script>
import { app } from '../main'
import Vue from 'vue'
export default {
    name:'Navbar',
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
            vm.$router.push('/')
            }
        })
        } 
    }
}
</script>
