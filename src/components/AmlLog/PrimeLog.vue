<template>
  <div class="sas-log-app container">
    <h1 class="text-center">AS400</h1>   
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
                   
                <span class="glyphicon glyphicon-refresh spinning" v-if="refLoading"></span>
                <select class="form-control" v-model="selectedRef" v-if="!refLoading">                   
                    <option v-for="item in swiftRefList" :key="item.FD300_OUR_REF_NO" v-if="swiftInOut == 'Out'">{{item.FD300_OUR_REF_NO}}</option>        
                    <option v-for="item in swiftRefList" :key="item.FD200_OUR_REF_NO" v-if="swiftInOut == 'In'">{{item.FD200_OUR_REF_NO}}</option>                            
                </select>          
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
export default {
    name: 'sas-log-app',
    data () {
    return {
        msg: "SasLog",
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
        selectedLibrary: "TCHICAGO", 
        selectedBrnCode: "0A3",    
        selectedShortBrn: "CGO",                   
        selectedRef: "",       
        refLoading: true,
        tableLoading: false,      
        swallowSearchQuery: "",        
        swallowList: [],  
        swallowColumns: ['TAG_20', 'SW_UMID' , 'MESG_TYPE','AML_SEND_DATE_TIME','AML_ACK_DATE_TIME'],        
        primeList:[],
        primeColumns: ['Ref', 'ReqTime' , 'TranTime','ConfirmTime']
    }
    },
    methods: {
        getSwtOutRef: function () {      
            this.swiftRefList = {}
            this.refLoading = true
            axios.get('/primeapi/as400SwiftOut/' + this.selectedLibrary )
            .then((resp) => {
                this.swiftRefList = resp.data
                this.refLoading = false
            })
            .catch((err) => {
                console.log(err)
                this.refLoading = false
            })
        },
        getSwtInRef: function () { 
            this.swiftRefList = {}
            this.refLoading = true            
            axios.get('/primeapi/as400SwiftIn/' + this.selectedLibrary )
            .then((resp) => {
                this.swiftRefList = resp.data
                this.refLoading = false
            })
            .catch((err) => {
                console.log(err)
                this.refLoading = false
            })
        },
        changeSelect: function() {
            if(this.swiftInOut === "Out"){
                this.getSwtOutRef()                
            }else{
                this.getSwtInRef()
            }
        },
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
            axios.get('/primeapi/swallowlog/out/' + this.selectedBrnCode + "/" + this.selectedRef)
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
            axios.get('/primeapi/swallowlog/in/' + this.selectedBrnCode + "/" + this.selectedRef)
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
        }
    },
    mounted () {
        this.getSwtOutRef()
    },
    components: {
        datagrid
    }
}
</script>

<style>

</style>
