<template>
<div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
        <input class="form-control form-control-dark w-75" type="text" placeholder="Search" aria-label="Search">
        <div class="lang-dropdown">
        <span><i class="fas fa-globe lang-icon"></i></span>
        <ul class="lang-dropdown-content">
            <li @click="changeLang('en')">en</li>
            <li @click="changeLang('tw')">tw</li>
        </ul>
        </div>
        <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
            <a @click.prevent="signout" class="nav-link" href="#">{{$t("navbar.Sign_out")}}</a>
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
            vm.$router.push('/login')
            }
        })
        } 
    }
}
</script>
