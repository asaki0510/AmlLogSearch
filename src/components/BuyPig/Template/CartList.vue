<template>  
    <tr>
        <td>
            <button type="button" class="btn btn-primary btn-sm" v-on:click="childToogleCart()">
            取消選購
            </button>
        </td>
        <td>
            <img class="card-img-top img-fluid" width="150" alt="card image cap" v-bind:src="aPigData.images">
        </td>
        <td>
            {{aPigData.name}}
        </td>
        <td class="text-right">
            NT$ {{aPigData.price}}
        </td>
    </tr>
</template>
<script>
export default {
  name: 'CartList',
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

