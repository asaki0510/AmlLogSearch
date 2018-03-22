<template>
    <div>
        <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="temp.email">
        </div>

        <div class="form-group">
        <label for="username">姓名</label>
        <input type="text" class="form-control" id="username" placeholder="輸入姓名" v-model="temp.username">
        </div>

        <div class="form-group">
        <label for="address">地址</label>
        <input type="text" class="form-control" id="address" name="address" placeholder="請輸入地址" v-model="temp.address">
        </div>

        <div class="text-right">
        <button class="btn btn-danger" v-on:click="submit()">送出</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'BuyPig',
  data () {
    return {    
      temp: {
        username: '',
        address: '',
        email: '',
        cart: []
      }
    }
  }
}
</script>

