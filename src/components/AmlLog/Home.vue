<template>
  <div class="hello">
    <h1 class="text-center">{{ msg }}</h1>
    <div class="container">
      <h2 class="text-center">DB Name</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>400</th>
            <th>Swallow</th>
            <th>End</th>            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Prime</td>
            <td><p>FD200</p>FD300</td>
            <td><p>MEGA_OBSWDBT.SWMIMSG</p>
              MEGA_OBSWDBT.SWMOMSG
            </td>
            <td>OFAC.FilterTranTable</td>            
          </tr>
          <tr>
            <td>Sas</td>
            <td>
              <p>FBLSTUS</p>
              FVAMQSND
            </td>
            <td>MEGA_OBSWDBT.SWHNMSG</td>
            <td>AMLHK0.NAME_CHECK_RECORD_MAIN</td>
          </tr>
        </tbody>
      </table>
      <h2 class="text-center">IP Address</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>400</th>
            <th>Swallow</th>
            <th>End</th>            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Prime Sit</td>
            <td>192.168.51.100</td>
            <td>192.168.51.30</td>
            <td>192.168.211.237</td>            
          </tr>
          <tr>
            <td>Sas Sit</td>
            <td>192.168.51.100</td>
            <td>192.168.51.30</td>
            <td>192.168.211.235</td>
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
