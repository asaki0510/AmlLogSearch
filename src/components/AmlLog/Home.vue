<template>
  <div class="hello">
    <h1 class="text-center">{{ msg }}</h1>
    <div class="container">
      <table class="table">
      <thead>
        <tr>
        <th scope="col">待更新IP資訊</th>

        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">待更新SQL資訊</th>

        </tr>
        <tr>
          <th scope="row">待更新</th>

        </tr>
        <tr>

        </tr>
      </tbody>
    </table>
    </div>    
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      msg: '洗錢防制傳送軌跡查詢'
    }
  }
}
</script>
