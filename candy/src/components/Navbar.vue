<template>
<div class="fixed-top" style="background:#333">
    <ul class="navbar-nav text-right mr-3">
        <li class="nav-item text-nowrap mt-3">
            <a @click.prevent="signout" class="h2 hvr-grow"  title="Sign out" name="Sign out" href="#">
                <i class="fas fa-sign-out-alt text-nowrap"></i>
            </a>
        </li>
    </ul>
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
