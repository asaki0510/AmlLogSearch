<template>
  <div class="sas-log-app">
    <h1 class="text-center">AS400</h1>   
    <div class="row">
        <div class="form-group">
            <div class="col-md-2 col-md-offset-2">
                <p>400 Library</p>
                <input type="text" class="form-control" v-model="library">                    
            </div>
            <div class="col-md-2">
                <p>SCREEN NUMBER</p>                
                <select class="form-control" v-model="selected">
                <option v-for="value in scrNoList" :key="value.FSTUS_SCR_NO">{{value.FSTUS_SCR_NO}}</option>        
                </select>
            </div>
            <div class="col-md-2">
                <p>UPDATE NO</p>                                
                <input type="text" class="form-control" v-model="date">                    
            </div>
            <div class="col-md-2">
                <p>搜尋</p>
                <button class="btn btn-primary" @click="as400Search">Search</button>
            </div>
        </div>   
    </div> 
    <div class="row">
        <h1 class="text-center">FBLSTUS</h1> 
        <div class="col-md-11 col-md-offset-1">
            <form id="search">
            Search <input name="query" class="form-control" v-model="searchQuery">
            </form>
        </div>  
    </div>
    <div class="row">
        <br />        
        <p v-if="FBLSTUSLoading" class="text-center"><img src="../../../data/img/loading.gif" alt=""></p>
        <div class="col-md-10 col-md-offset-1" v-if="FBLSTUSLoading == false">
            <sasdatagrid
            :data="FBLSTUSList"
            :columns="FBLSTUSColumns"
            :filter-key="searchQuery"
            :hasButton="true"
            ></sasdatagrid>
        </div>        
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import sasdatagrid from '@/components/SubComponent/SasDataGrid'
export default {
    name: 'sas-log-app',
    data () {
    return {
        msg: "SasLog",
        library: "SASHKG1113",
        date: "180122",
        scrNoList: {},
        FBLSTUSList: [],                        
        selected: "",       
        searchQuery: '',
        FBLSTUSColumns: ['SCR_NO', 'TXN_KEY' , 'UPDATE_NO','STUS_CODE','CASE_ID','CASE_STUS','USER_ID','JRNL_NO','SND_DATE','SND_TIME','FAIL'],    
        FBLSTUSLoading: false
    }
    },
    methods: {
        getScrNo: function () {      
            axios.get('/api/as400log/' + this.library )
            .then((resp) => {
                this.scrNoList = resp.data
                // console.log(resp.data)  
            })
            .catch((err) => {
                console.log(err)
            })
        },
        as400Search: function () {   
            this.FBLSTUSLoading = true   
            this.searchQuery = ""
            axios.get('/api/as400log/'+ this.library + '/' + this.selected + '/' + this.date)
            .then((resp) => {               
                this.FBLSTUSList = resp.data 
                this.FBLSTUSLoading = false
                // console.log(resp.data)  
            })
            .catch((err) => {
                this.FBLSTUSLoading = false                
                console.log(err)
            })
        }
    },
    mounted () {
        this.getScrNo()
    },
    components: {
        sasdatagrid
    }
}
</script>

<style>

</style>
