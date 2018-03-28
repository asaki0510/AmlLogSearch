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

var primeConfig={
  user:'SA',
  password:'!qaz2wsx',
  server:'192.168.211.237',   
  database:'OFAC'
}

routes.get('/as400SwiftIn/:library',(req,res) => {
    db.open(connectionString, (err, dbStmt) => {
      if (err) return console.log(err)
      var sql = "SELECT DISTINCT FD200_OUR_REF_NO FROM " + req.params.library + ".FD200"
      console.log(sql);
      dbStmt.query(sql, [42], (err, data) => {
        if (err) {        
          console.log(err)    
        }
        dbStmt.close()
        res.send(data)
      })
    })
})  

routes.get('/as400SwiftOut/:library',(req,res) => {
    db.open(connectionString, (err, dbStmt) => {
      if (err) return console.log(err)
      var sql = "SELECT DISTINCT FD300_OUR_REF_NO FROM " + req.params.library + ".FD300"
      console.log(sql);
      dbStmt.query(sql, [42], (err, data) => {
        if (err) {        
          console.log(err)    
        }
        dbStmt.close()
        res.send(data)
      })
    })
})  

routes.get('/swallowlog/out/:brn/:ref',(req,res) => {
    const pool = new mssql.ConnectionPool(swallowConfig,function (err) {
        if(err) console.log(err)  
        //create Request object
        var request=new mssql.Request(pool)
        var sql = "select TAG_20,SW_UMID,MESG_TYPE,AML_SEND_DATE_TIME,AML_ACK_DATE_TIME from SWMOMSG WHERE BRANCH = '" + req.params.brn + "' AND TAG_20 ='" + req.params.ref + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)  
            //send records as a response
            mssql.close()
            res.json(data.recordsets)            
        })
    })
})


routes.get('/swallowlog/in/:brn/:ref',(req,res) => {
    const pool = new mssql.ConnectionPool(swallowConfig,function (err) {
        if(err) console.log(err)  
        //create Request object
        var request=new mssql.Request(pool)
        var sql = "select TAG_20,SW_UMID,MESG_TYPE,AML_SEND_DATE_TIME,AML_ACK_DATE_TIME from SWMIMSG WHERE BRANCH = '" + req.params.brn + "' AND TAG_20 ='" + req.params.ref + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)  
            //send records as a response
            mssql.close()
            res.json(data.recordsets)            
        })
    })
})

routes.get('/primelog/:brn/:ref',(req,res) => {
    const pool = new mssql.ConnectionPool(primeConfig,function (err) {
        if(err) console.log(err)  
        //create Request object
        var request=new mssql.Request(pool)
        var sql = "select Ref,ReqTime,TranTime,ConfirmTime from FilterTranTable WHERE Branch = '" + req.params.brn + "' AND Ref ='" + req.params.ref + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)  
            //send records as a response
            mssql.close()
            res.json(data.recordsets)            
        })
    })
})
  
module.exports = routes;