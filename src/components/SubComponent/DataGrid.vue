<template>
<div>
  <table>
    <thead>
      <tr>
        <th v-if="hasButton">Select</th>
        <th v-for="column in columns"
          @click="sortBy(column)"
          :class="{ active: sortKey == column }">
          {{ column | capitalize }}
          <span class="arrow" :class="sortOrders[column] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry,index) in filteredData">
        <td v-if="hasButton"><button class="btn btn-primary" @click="interraptSearch(index)">select</button></td>        
        <td v-for="column in columns">
          {{entry[column]}}          
        </td>
      </tr>
    </tbody>
  </table>
  
  <div v-if="showModal" @close="showModal = false">        
        <transition name="modal">
            <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    
                <div class="modal-header">
                    <slot name="header">
                    As400 FVAMQSND
                    </slot>
                    <button class="btn btn-danger" style="float: right;" @click="showModal=false">OK</button>                    
                </div>

                <div class="modal-body">
                    <slot name="body">                
                      <p v-if="as400HasData == false && as400Loading == false">FVAMQSND無資料</p>              
                      <table class="table"  v-if="as400HasData">
                        <thead>
                          <tr>
                            <th>VAS_MSG_BODY(1~86)</th>                            
                            <th>VAS_SND_DATE</th>
                            <th>VAS_SND_TIME</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in as400List">
                            <td>{{item.VAS_MSG_BODY.substring(0,86)}}</td>                            
                            <td>{{item.VAS_SND_DATE}}</td>
                            <td>{{item.VAS_SND_TIME}}</td>
                          </tr>                        
                        </tbody>
                      </table>                        
                      <p v-if="as400Loading"><img src="../../../data/img/loading.gif" alt=""></p>
                    </slot>
                </div>

                <div class="modal-header">
                    <slot name="header">Swallow</slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                    <p v-if="swallowHasData == false && swallowLoading == false">swallow無資料</p>                        
                    <p v-if="swallowHasRcvTime == false && swallowLoading == false">swallow無SAS回應資料</p>
                      <table class="table" v-if="swallowHasData">
                        <thead>
                          <tr>
                            <th>MESG_APPLI_MAIN_REFNO</th>
                            <th>AML_SEND_DATE_TIME</th>
                            <th>AML_ACK_DATE_TIME</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in swallowList">
                            <td>{{item.MESG_APPLI_MAIN_REFNO}}</td>
                            <td>{{item.AML_SEND_DATE_TIME}}</td>
                            <td>{{item.AML_ACK_DATE_TIME}}</td>
                          </tr>                        
                        </tbody>
                      </table>                                              
                    <p v-if="swallowLoading"><img src="../../../data/img/loading.gif" alt=""></p>
                    </slot>
                </div>


                <div class="modal-header">
                    <slot name="header">
                    Sas
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                    <p v-if="sasHasData == false && sasLoading == false">Sas無資料</p>         
                    <table class="table" v-if="sasHasData">
                        <thead>
                          <tr>
                            <th>REFERENCE_NUMBER</th>
                            <th>TRANSACTION_DATE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in sasList">
                            <td>{{item.REFERENCE_NUMBER}}</td>
                            <td>{{item.TRANSACTION_DATE}}</td>
                          </tr>                        
                        </tbody>
                      </table>      
                    <p v-if="sasLoading"><img src="../../../data/img/loading.gif" alt=""></p>
                    </slot>
                </div>

                <!-- <div class="modal-footer">
                    <slot name="footer">                   
                    
                    </slot>
                </div> -->

                </div>
            </div>
            </div>
        </transition>
    </div>
  </div>
   
</template>

<script>
  import axios from 'axios' 
  export default {
    props: {
        data: Array,
        columns: Array,
        filterKey: String,
        hasButton: false
      },
      data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
          sortOrders[key] = 1
        })
        return {
          sortKey: '',
          sortOrders: sortOrders,
          showModal: false,
          as400HasData: false,
          as400Loading: false,
          swallowHasData: false,
          swallowHasRcvTime: false,
          swallowLoading: true,
          sasHasData: false,
          sasLoading: true,
          swallowList: {},
          sasList: {},
          as400List: {},
        }
      },
      computed: {
        filteredData: function () {
          var sortKey = this.sortKey
          var filterKey = this.filterKey && this.filterKey.toLowerCase()
          var order = this.sortOrders[sortKey] || 1
          var data = this.data
          if (filterKey) {
            data = data.filter(function (row) {
              return Object.keys(row).some(function (key) {
                return String(row[key]).toLowerCase().indexOf(filterKey) > -1
              })
            })
          }
          if (sortKey) {
            data = data.slice().sort(function (a, b) {
              a = a[sortKey]
              b = b[sortKey]
              return (a === b ? 0 : a > b ? 1 : -1) * order
            })
          }
          return data
        }
      },
      filters: {
        capitalize: function (str) {
          return str.charAt(0).toUpperCase() + str.slice(1)
        }
      },
      methods: {
        sortBy: function (key) {
          this.sortKey = key
          this.sortOrders[key] = this.sortOrders[key] * -1
        },
        interraptSearch: function (index) {  
            console.log(index)
            var FSTUS_SCR_NO = this.filteredData[index].SCR_NO;
            var FSTUS_TXN_KEY = this.filteredData[index].TXN_KEY;
            var FSTUS_UPDATE_NO = this.filteredData[index].UPDATE_NO;
            this.as400HasData = false
            this.as400Loading = true            
            this.swallowHasData = false
            this.swallowHasRcvTime = false
            this.swallowLoading = true            
            this.sasHasData = false
            this.sasLoading = true

            var splitTxnKey = FSTUS_TXN_KEY.split(" ");
            var url = '/api/as400Flog/REMOTE/'+ FSTUS_SCR_NO.trim() + '/' + splitTxnKey[0] + '/' + FSTUS_UPDATE_NO;
            // console.log(url)
            axios.get(url)
            .then((resp) => {        
                this.as400List = resp.data
                // console.log(this.as400List)
                try{
                    this.as400HasData = (this.as400List[0].VAS_MSG_BODY != undefined) ? true : false                     
                }catch(e) {
                    this.as400HasData = false;
                }               
                this.as400Loading = false;                
            }).catch((err) => {
                console.log(err)                
            })

            
            url = '/api/swallowlog/'+ FSTUS_SCR_NO.trim() + '/' + FSTUS_TXN_KEY.trim() + '/' + FSTUS_UPDATE_NO;
            // console.log(url);
            axios.get(url)
            .then((resp) => {               
                this.swallowList = resp.data[0]
                console.log(this.swallowList);
                try{
                    this.swallowHasData = (this.swallowList[0].MESG_APPLI_MAIN_REFNO != undefined) ? true : false                     
                }catch(e) {
                    this.swallowHasData = false;
                }
                
                try{
                    this.swallowHasRcvTime = (this.swallowList[0].AML_ACK_DATE_TIME != undefined) ? true : false                        
                }catch(e) {
                    this.swallowHasData = false;
                }

                // console.log(this.swallowList)  
                this.swallowLoading = false;

                url = '/api/saslog/'+ FSTUS_SCR_NO.trim() + '/' + FSTUS_TXN_KEY.trim() + '/' + FSTUS_UPDATE_NO;
                // console.log(url);
                axios.get(url)
                .then((resp) => {
                    this.sasList = resp.data[0]
                    try{
                        this.sasHasData = (this.sasList[0].REFERENCE_NUMBER != null) ? true : false
                    }catch(e){
                        this.sasHasData = false;
                    }
                    // console.log(this.sasList)  
                    this.sasLoading = false;                
                })
                .catch((err) => {
                    console.log(err)
                    this.sasLoading = false;  
                })    
            })
            .catch((err) => {
                console.log(err)
                this.swallowLoading = false;                
            })
            this.showModal = true;
        }
      }
  } 
</script>

<style>
body {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #444;
}

table {
  border: 2px solid #428bca;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #428bca;
  color: rgba(255,255,255,0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th, td {
  min-width: 100%;
  max-width: 100%;
  padding: 10px 20px;
}

th, tr {
  min-width: 100%;
  max-width: 100%;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}


.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 900px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}


</style>
