<template>
  <div class="sas-log-app container">
    <h1 class="text-center">AS400 SWIFT WIRE</h1>   
    <div class="row">
        <div class="form-group">
            <div class="col-md-2 col-md-offset-2">
                <p>400 Library</p>
                <select class="form-control" v-model="selectedLibrary" @change="changeSelect()">
                    <option v-for="item in libraryList" :key="item.branch">{{item.branch}}</option>        
                </select>                  
            </div>
            <div class="col-md-2">
                <p>Swift In Out</p>                
                <select class="form-control" v-model="swiftInOut" @change="changeSelect()">
                    <option>In</option>
                    <option>Out</option>
                </select>
            </div>
            <div class="col-md-2">
                <p>Ref No</p>      
                <input id="refinput" class="form-control" type="text" placeholder="Type to search...">
                <typeahead v-model="model" target="#refinput" :async-function="(swiftInOut == 'Out' ? getSwtOutQuery : getSwtInQuery)" item-key="OUR_REF_NO">
                <template slot="item" slot-scope="props">
                    <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                    <a role="button" @click="props.select(item)">
                        <span v-html="props.highlight(item)"></span>
                    </a>
                    </li>
                </template>
                </typeahead>                           
                <!-- <span class="glyphicon glyphicon-refresh spinning" v-if="refLoading"></span>
                <select class="form-control" v-model="refText" v-if="!refLoading">                   
                    <option v-for="item in swiftRefList" :key="item.FD300_OUR_REF_NO" v-if="swiftInOut == 'Out'">{{item.FD300_OUR_REF_NO}}</option>        
                    <option v-for="item in swiftRefList" :key="item.FD200_OUR_REF_NO" v-if="swiftInOut == 'In'">{{item.FD200_OUR_REF_NO}}</option>                            
                </select>           -->
            </div>
            <div class="col-md-2">
                <p>搜尋</p>
                <button class="btn btn-primary" @click="searchLog">Search</button>
            </div>
        </div>   
    </div> 
        <h1 class="text-center" v-if="swiftInOut == 'Out'">D300</h1> 
        <h1 class="text-center" v-if="swiftInOut == 'In'">D200</h1> 
        <br />        
        <h1 class="text-center">Swallow</h1>         
        <p v-if="tableLoading" class="text-center"><img src="../../../data/img/loading.gif" alt=""></p>
        <div v-if="tableLoading == false">
            <datagrid
            :data="swallowList"
            :columns="swallowColumns"
            :filter-key="swallowSearchQuery"
            ></datagrid>               
        </div>
        <br />        
        <h1 class="text-center">Prime</h1>                 
        <p v-if="tableLoading" class="text-center"><img src="../../../data/img/loading.gif" alt=""></p>
        <div v-if="tableLoading == false">
            <datagrid
            :data="primeList"
            :columns="primeColumns"
            :filter-key="swallowSearchQuery"
            ></datagrid>               
        </div>
  </div>
</template>

<script>
import axios from 'axios'
import datagrid from '@/components/SubComponent/DataGrid'
import {Typeahead} from 'uiv'
export default {
    name: 'prime-log-app',
    data () {
    return {
        msg: "PrimeLog",
        libraryList: [{
            "branch":"TCHICAGO",
            "shortBrn":"CGO",
            "branchCode":"0A3"
        },
        {
            "branch":"TLOSANGEL",
            "shortBrn":"LAC",
            "branchCode":"0A4"
        },
        {
            "branch":"TSANJOSE",
            "shortBrn":"SVB",
            "branchCode":"0M2"
        }],
        swiftRefList: {},
        swiftInOut: "Out",       
        selectedLibrary: "TLOSANGEL", 
        selectedBrnCode: "0A4",    
        selectedShortBrn: "LAC",                   
        refText: "",       
        refLoading: true,
        tableLoading: false,      
        swallowSearchQuery: "",        
        swallowList: [],  
        swallowColumns: ['TAG_20', 'SW_UMID' , 'AML_RESULT', 'MESG_TYPE','AML_SEND_DATE_TIME','AML_ACK_DATE_TIME'],        
        primeList:[],
        primeColumns: ['SeqNumb','Ref','UserMessageReference','Source','Dept', 'ReqTime' ,'ConfirmTime'],
        model:""
    }
    },
    methods: {        
        searchLog: function () {   
            this.tableLoading = true   
            this.swallowSearchQuery = ""
            for(var i=0;i<this.libraryList.length;i++){
                if(this.selectedLibrary == this.libraryList[i].branch){
                    this.selectedBrnCode = this.libraryList[i].branchCode
                    this.selectedShortBrn = this.libraryList[i].shortBrn
                }
            }

            if(this.swiftInOut === "Out"){
                this.getSwallowSwtOut()                
            }else{
                this.getSwallowSwtIn()
            }
        },
        getSwallowSwtOut: function () {   
            var queryRef = (this.model.OUR_REF_NO == undefined ? this.model : this.model.OUR_REF_NO)            
            axios.get('/primeapi/swallowlog/out/' + this.selectedBrnCode + "/" + queryRef)
            .then((resp) => {
                this.swallowList = resp.data[0]
                this.tableLoading = false   
                this.primeList = []                
                for(let i=0;i<this.swallowList.length;i++){
                    this.getPrimeLog(this.swallowList[0].SW_UMID)                
                }
            })
            .catch((err) => {
                console.log(err)
                this.tableLoading = false   
            })
        },
        getSwallowSwtIn: function () {   
            var queryRef = (this.model.OUR_REF_NO == undefined ? this.model : this.model.OUR_REF_NO)
            axios.get('/primeapi/swallowlog/in/' + this.selectedBrnCode + "/" + queryRef)
            .then((resp) => {
                this.swallowList = resp.data[0]
                this.tableLoading = false   
                this.primeList = []
                for(let i=0;i<this.swallowList.length;i++){
                    this.getPrimeLog(this.swallowList[0].SW_UMID)                
                }
            })
            .catch((err) => {
                console.log(err)
                this.tableLoading = false   
            })
        },
        getPrimeLog: function (ref) {   
            axios.get('/primeapi/primelog/' + this.selectedShortBrn + "/" + ref)
            .then((resp) => {
                // this.primeList = resp.data[0][0]
                this.primeList.push(resp.data[0][0])
                this.tableLoading = false   
                console.log(this.primeList)
            })
            .catch((err) => {
                console.log(err)
                this.tableLoading = false   
            })
        },
        getSwtOutQuery (query, done) {
        query = query.toUpperCase()
        axios.get('/primeapi/as400SwiftOut/' + this.selectedLibrary + '/' + query)        
          .then(res => {
            done(res.data)
          })
          .catch(err => {
            // any error handler
          })
        },
        getSwtInQuery (query, done) {
        query = query.toUpperCase()
        axios.get('/primeapi/as400SwiftIn/' + this.selectedLibrary + '/' + query)        
          .then(res => {
            done(res.data)
          })
          .catch(err => {
            // any error handler
          })
        },
        changeSelect(){
            this.model = ""
        }
    },
    mounted () {
        
    },
    components: {
        datagrid,
        Typeahead
    }
}
</script>

<style>

</style>
