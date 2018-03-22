<template>
 <div>
    <div class="row">
      <div class="col-sm-8">
        <!-- 產品列表 -->
         <productlist 
         :key="pig.id" 
         :aPigData="pig" 
         @childToogle="toogleCart(pig,index)" 
         v-for="(pig,index) in pigData">
         </productlist>         
      </div>
      <div class="col-sm-4">  
          <!-- 購物車 -->
        <table class="table">
            <cartlist 
            :key="pig.id"
            v-if="pig.selected"
            :aPigData="pig" 
            @childToogle="toogleCart(pig,index)" 
            v-for="(pig,index) in pigData">
           </cartlist>
           <tr>
            <td colspan="4" class="text-right">
              總價 NT$ {{totalPrice}}
            </td>
          </tr>
        </table>                      
        <!-- 訂購資訊 -->
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
         <!-- <pre>{{temp}}</pre>  -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import productlist from './Template/ProductList'
import cartlist from './Template/CartList'
export default {
  name: 'BuyPig',
  data () {
    return {
      title: '嘉義騎山豬',
      pigData:{ 
      },
      temp: {
        username: '',
        address: '',
        email: '',
        cart: []
      }
    }
  },
  methods: {
    fetchData: function () {      
        axios.get('http://localhost:3000/products')
        .then((resp) => {
          this.pigData = resp.data
          console.log(resp)  
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toogleCart: function(item,index) {
      let pigData = this.pigData
      let self = this     
      self.$set(pigData[index], 'selected', !item.selected)
      self.temp.cart = pigData.filter((pigData)=>{
        return pigData.selected
      })
      self.temp.cart = pigData.filter(function(pigData){
         return pigData.selected
       })
    },
    submit: function(){
      let self = this
      self.temp.id = Math.random().toString(36).substring(7)
      axios.post('http://localhost:3000/orders',self.temp)
        .then((resp) => {
          console.log(resp)  
          alert("購買成功");
        })
        .catch((err) => {
          console.log(err)
          alert("購買失敗");
        })
    }
  },
  computed:{
    totalPrice: function(){
      let cart = this.temp.cart      
      let tempPrice = 0
      cart.forEach((item)=>{
        tempPrice = tempPrice + item.price
      })
      return tempPrice;
    }
  },
  mounted () {    
    this.fetchData()
  },
  components: {
    productlist,
    cartlist
  } 
}
</script>
