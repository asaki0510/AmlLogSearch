var express = require('express')
var routes = express.Router()
var app = express()

//odbc
var db = require('odbc');
const SERVER_IP = "192.168.51.100"
const ID = "OBSXML"
const PASSWORD = "XMLOBS"
var connectionString = "Driver={iSeries Access ODBC Driver};System=192.168.51.100;Uid=OBSXML;Pwd=XMLOBS"

//mssql
var mssql=require('mssql');


var swallowConfig={
  user:'SA',
  password:'!qaz2wsx',
  server:'192.168.51.30',   
  database:'MEGA_OBSWDBT'
}

var sasConfig={
  user:'SA',
  password:'!qaz2wsx',
  server:'192.168.211.235',   
  database:'AMLHK0'
}

routes.get('/as400log/:library',(req,res) => {
    db.open(connectionString, (err, dbStmt) => {
      if (err) return console.log(err)
      var sql = "SELECT DISTINCT FSTUS_SCR_NO FROM " + req.params.library + ".FBLSTUS"
      console.log(sql);
      dbStmt.query(sql, [42], (err, data) => {
        if (err) {        
          console.log(err)    
        }
        dbStmt.close()
        res.json(data)
      })
    })
})  
  
routes.get('/as400log/:library/:scrno/:date',(req,res) => {
    db.open(connectionString, (err, dbStmt) => {
        if (err) return console.log(err)
        var sql = "SELECT FSTUS_SCR_NO as SCR_NO," +
        "FSTUS_TXN_KEY as TXN_KEY," +
        "FSTUS_UPDATE_NO as UPDATE_NO," +
        "FSTUS_AML_STUS_CODE as STUS_CODE," +
        "FSTUS_CASE_ID as CASE_ID," +
        "FSTUS_CASE_STUS as CASE_STUS," +
        "FSTUS_USER_ID as USER_ID," + 
        "FSTUS_JRNL_NO as JRNL_NO," + 
        "FSTUS_SND_AML_DATE as SND_DATE," + 
        "FSTUS_SND_AML_TIME as SND_TIME," +
        "FSTUS_SND_AML_FAIL as FAIL" + 
        " FROM " +
        req.params.library +".FBLSTUS WHERE FSTUS_SCR_NO ='" + req.params.scrno +"' AND FSTUS_UPDATE_NO LIKE '" + req.params.date + "%'"
        console.log(sql);
        dbStmt.query(sql, [42], (err, data) => {
            if (err) console.log(err)            
            dbStmt.close()
            res.json(data)
        })
    })
})

routes.get('/as400Flog/:library/:scrno/:refno/:updateno',(req,res) => {
    db.open(connectionString, (err, dbStmt) => {
        if (err) return console.log(err)
        var sql = "select VAS_SND_DATE,VAS_SND_TIME, VAS_MSG_BODY from "
        + req.params.library +".FVAMQSND where substr(VAS_MSG_BODY,1,4) = '" + req.params.scrno + "' and substr(VAS_MSG_BODY, 7, 70) like '" + req.params.refno + "%' and substr(VAS_MSG_BODY,77, 10) = '" + req.params.updateno + "'"
        console.log(sql);
        dbStmt.query(sql, [42], (err, data) => {
        if (err) {        
            console.log(err)    
        }
        dbStmt.close()
        res.json(data)
        })
    })
})

routes.get('/swallowlog/:scrno/:refno/:updateno',(req,res) => {
    const pool = new mssql.ConnectionPool(swallowConfig,function (err) {
        if(err) console.log(err)  
        //create Request object
        var request=new mssql.Request(pool)
        var sql = "select MESG_APPLI_MAIN_REFNO,"+
        "case AML_RESULT " + 
        "when '000' then 'No Hit(000)' " +        
        "when '001' then 'Wait Ack(001)' " +
        "when '002' then 'Accept(002)' " +
        "when '003' then 'Reject(003)' " +
        "when '008' then 'Non Check(008)' " +
        "else AML_RESULT end as AML_RESULT" +
         "," +       
        "AML_SEND_DATE_TIME,"+
        "AML_ACK_DATE_TIME"+
        " from [MEGA_OBSWDBT].[dbo].[SWHNMSG] where [MESG_APPLI_MAIN_REFNO] = '" + req.params.scrno + "-" + req.params.refno + "-" + req.params.updateno + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)  
            //send records as a response
            mssql.close()
            res.json(data.recordsets)            
        })
    })
})

routes.get('/saslog/:scrno/:refno/:updateno',(req,res) => {
    const pool = new mssql.ConnectionPool(sasConfig,function (err) {
        if(err) console.log(err)  
        //create Request object
        var request=new mssql.Request(pool)
        var sql = "select [REFERENCE_NUMBER],[TRANSACTION_DATE] from [AMLHK0].[NCSC].[NAME_CHECK_RECORD_MAIN] where [REFERENCE_NUMBER] ='" + req.params.scrno + "-" + req.params.refno + "-" + req.params.updateno + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)  
            //send records as a response
            mssql.close()
            res.json(data.recordsets)            
        })      
    })  
})   
  
module.exports = routes;