<template>
  <div class="">
    <span class="badge badge-pill badge-danger">{{ amount }}</span>
  </div>
</template>

<script>
 export default {
    data() {
      return {
        amount: 0
      }
    },
    methods: {
      getCartAmount() {
        const vm = this
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
        this.$http.get(api).then((res) => {
          // console.log(res)
          vm.amount = res.data.data.carts.length
        })
      }
    },
    created() {
      const vm = this
      vm.getCartAmount()
      vm.$bus.$on('getTotal', vm.getCartAmount)
    }
  }
</script>

<style scoped>
.shop-icon{
  display: inline-block;
  border-radius:50%;
  padding: 4px 8px; 
  font-size:50%;
  background:#ddd;
  margin:auto auto auto -5px
}
</style>