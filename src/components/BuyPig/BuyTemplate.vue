<template>
 <div>
    <div class="row">
      <div class="col-sm-8">
        <!-- 產品列表 -->
        <div class="card mb-3">
          <div class="card-img-top"></div>
          <div class="card-block">
            <h4 class="card-title">title</h4>
            <p class="card-text">description</p>
          </div>
          <div class="card-footer text-center">
            <h4 class="card-title text-center">NT$ price</h4>
            <button type="button" class="btn btn-primary">
              <span>已</span>
              選購
            </button>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <!-- 購物車 -->
        <table class="table">
          <tr>
            <td>
              <button type="button" class="btn btn-primary btn-sm">
                取消選購
              </button>
            </td>
            <td>
              <img class="card-img-top img-fluid" width="150" alt="Card image cap">
            </td>
            <td>
              字字字
            </td>
            <td class="text-right">
              NT$ price
            </td>
          </tr>
          <tr>
            <td colspan="4" class="text-right">
              NT$ 總價
            </td>
          </tr>
        </table>
        <!-- 訂購資訊 -->
        <div>
          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" placeholder="Enter email">
          </div>

          <div class="form-group">
            <label for="username">姓名</label>
            <input type="text" class="form-control" id="username" placeholder="輸入姓名">
          </div>

          <div class="form-group">
            <label for="address">地址</label>
            <input type="text" class="form-control" id="address" name="address" placeholder="請輸入地址">
          </div>

          <div class="text-right">
            <button class="btn btn-danger">送出</button>
          </div>
        </div>
        <!-- <pre>123</pre> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuyPig',
  data () {
    return {
      msg: '買山豬'
    }
  }
}
</script>
