<template>
    <div class="message-alert">
        <div class="alert alert-dismissible"
        :class="'alert-' + item.status"
        v-for="(item, i) in messages" :key="i">
        {{ item.message }}
        <button type="button" class="close" @click="removeMessage(i)" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
    </div>

</template>

<script>
export default {
    name: 'AlertMessage',
    data(){
        return{
            messages: [],
        }
    },
    methods: {
        //傳送訊息到使用者體驗時,會再將傳送的訊息移除
        updateMessage(message, status) {
            const timestamp = Math.floor(new Date() / 1000);//
            this.messages.push({
                message,
                status,
                timestamp,
            });
            this.removeMessageWithTiming(timestamp);
        },
        removeMessage(num) {
            this.messages.splice(num, 1);
        },
        //每當5秒將訊息移除
        removeMessageWithTiming(timestamp) {
            const vm = this;
            setTimeout(() => {
                //Foreach迴圈（Foreach loop）是電腦程式語言中的一種控制流程語句，通常用來迴圈遍歷陣列或集合中的元素。
                //foreach，只能一一取得數組中的元素，並不能利用這種語句改變數組所存儲的元素
                //http://www.runoob.com/jsref/jsref-foreach.html
                vm.messages.forEach((item, i) => {
                    if (item.timestamp === timestamp) {
                        vm.messages.splice(i, 1);
                    }
                });
            },5000);//
        }
    },
    created() {
        const vm = this;
        // 自定義名稱 'messsage:push'
        // message: 傳入參數
        // status: 樣式，預設值為 warning
        //用$bus.$on接收從products 傳來的訊息
        vm.$bus.$on('messsage:push', (message, status = 'warning') => {
            vm.updateMessage(message, status);
        });
        // vm.$bus.$emit('messsage:push');
    }
}
</script>

<style scope>

.message-alert {
    position: absolute;
    max-width: 50%;
    top: 56px;
    z-index: 1100;
    text-align: center;
    width: 100%;
    left: 25%;
}
</style>

