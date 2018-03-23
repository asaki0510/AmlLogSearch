<template>
  <div class="sas-log-app">
    <h1 class="text-center">AS400</h1>   
    <div class="row">
        <div class="form-group">
            <div class="col-md-3">
                <p>400 Library</p>
                <input type="text" class="form-control" v-model="library">                    
            </div>
            <div class="col-md-3">
                <p>SCREEN NUMBER</p>                
                <select class="form-control" v-model="selected">
                <option v-for="value in scrNoList" :key="value.FSTUS_SCR_NO">{{value.FSTUS_SCR_NO}}</option>        
                </select>
            </div>
            <div class="col-md-3">
                <p>UPDATE NO</p>                                
                <input type="text" class="form-control" v-model="date">                    
            </div>
            <div class="col-md-3">
                <p>搜尋</p>
                <button class="btn btn-primary" @click="as400Search">Search</button>
            </div>
        </div>   
    </div> 
    <div class="row">
        <h1 class="text-center">FBLSTUS</h1>   
        <table class="table">
            <thead>
            <tr>
                <th>Select</th>
                <th>FSTUS_SCR_NO</th>
                <th>FSTUS_TXN_KEY</th>
                <th>FSTUS_UPDATE_NO</th>
                <th>FSTUS_AS400_AML_STUS</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in FBLSTUSList">
                    <td><button class="btn btn-primary" @click="interraptSearch(index)">select</button></td>
                    <td>{{item.FSTUS_SCR_NO}}</td>
                    <td>{{item.FSTUS_TXN_KEY}}</td>
                    <td>{{item.FSTUS_UPDATE_NO}}</td>
                    <td>{{item.FSTUS_AS400_AML_STUS}}</td>                    
                </tr>           
            </tbody>
        </table>
    </div>

    <modal v-if="showModal" @close="showModal = false">        
        <transition name="modal">
            <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    
                <div class="modal-header">
                    <slot name="header">
                    As400 FVAMQSND
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                    <p v-if="as400HasData">FVAMQSND有資料</p>                        
                    <p v-if="as400Loading">讀取中</p>
                    </slot>
                </div>

                <div class="modal-header">
                    <slot name="header">
                    Swallow
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                    <p v-if="swallowHasData">swallow有資料</p>                        
                    <p v-if="swallowHasRcvTime">swallow有SAS回應資料</p>
                    <p v-if="swallowLoading">讀取中</p>
                    </slot>
                </div>


                <div class="modal-header">
                    <slot name="header">
                    Sas
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                    <p v-if="sasHasData">Sas有資料</p>         
                    <p v-if="sasLoading">讀取中</p>
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">                   
                    <button class="modal-default-button" @click="showModal=false">
                        OK
                    </button>
                    </slot>
                </div>

                </div>
            </div>
            </div>
        </transition>
    </modal>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'sas-log-app',
    data () {
    return {
        msg: "SasLog",
        library: "SASHKG1113",
        date: "180122",
        scrNoList: {},
        FBLSTUSList: {},
        swallowList: {},
        as400List: {},
        sasList: {},
        selected: "",
        showModal: false,
        as400HasData: false,
        as400Loading: false,
        swallowHasData: false,
        swallowHasRcvTime: false,
        swallowLoading: true,
        sasHasData: false,
        sasLoading: true,
    }
    },
    methods: {
        getScrNo: function () {      
            axios.get('/api/as400log/' + this.library )
            .then((resp) => {
                this.scrNoList = resp.data
                console.log(resp.data)  
            })
            .catch((err) => {
                console.log(err)
            })
        },
        as400Search: function () {      
            axios.get('/api/as400log/'+ this.library + '/' + this.selected + '/' + this.date)
            .then((resp) => {               
                this.FBLSTUSList = resp.data 
                console.log(resp.data)  
            })
            .catch((err) => {
                console.log(err)
            })
        },
        interraptSearch: function (index) {      
            var FSTUS_SCR_NO = this.FBLSTUSList[index].FSTUS_SCR_NO;
            var FSTUS_TXN_KEY = this.FBLSTUSList[index].FSTUS_TXN_KEY;
            var FSTUS_UPDATE_NO = this.FBLSTUSList[index].FSTUS_UPDATE_NO;
            this.as400HasData = false
            this.as400Loading = true
            
            this.swallowHasData = false
            this.swallowHasRcvTime = false
            this.swallowLoading = true            
            this.sasHasData = false
            this.sasLoading = true

            var splitTxnKey = FSTUS_TXN_KEY.split(" ");
            var url = '/api/as400Flog/REMOTE/'+ FSTUS_SCR_NO.trim() + '/' + splitTxnKey[0] + '/' + FSTUS_UPDATE_NO;
            console.log(url)
            axios.get(url)
            .then((resp) => {        
                this.as400List = resp.data[0]
                console.log(this.as400List)

                try{
                    this.as400HasData = (this.as400List.VAS_MSG_BODY != undefined) ? true : false                     
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
    },
    mounted () {
        this.getScrNo()
    }
}
</script>

<style>
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
  width: 300px;
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
