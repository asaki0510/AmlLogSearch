<template>
  <!-- 產品列表 -->
        <div class="cart mb-3">
          <img class="cart-img-top"             
            style="height: 300px; display: block;  margin: 0 auto;"
            v-bind:src="aPigData.images"
          >
          <div class="cart-block">
            <h4 class="cart-title">{{aPigData.name}}</h4>
            <p class="cart-text">{{aPigData.description}}</p>
          </div>
          <div class="cart-footer text-center">
            <h4 class="cart-title text-center">NT$ {{aPigData.price}}</h4>
            <button type="button" class="btn btn-primary"            
            v-on:click="childToogleCart()">              
               <span v-if="aPigData.selected">取消選購</span> 
               <span v-else>選購</span> 
            </button>            
          </div>
          <br />
        </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: {   
    aPigData: {}
  },
  methods: {    
    childToogleCart: function() {      
      let self = this      
      self.$emit('childToogle')
    }
  }
}
</script>

