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
      var sql = "SELECT DISTINCT FD200_OUR_REF_NO as OUR_REF_NO FROM " + req.params.library + ".FD200"
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
      var sql = "SELECT DISTINCT FD300_OUR_REF_NO as OUR_REF_NO FROM " + req.params.library + ".FD300"
      dbStmt.query(sql, [42], (err, data) => {
        if (err) {
          console.log(err)
        }
        dbStmt.close()
        res.send(data)
      })
    })
})

routes.get('/as400SwiftOut/:library/:queryref',(req,res) => {
    db.open(connectionString, (err, dbStmt) => {
      if (err) return console.log(err)
      var sql = "SELECT DISTINCT trim(FD300_OUR_REF_NO) as OUR_REF_NO FROM " + req.params.library + ".FD300 where FD300_OUR_REF_NO like '%" + req.params.queryref + "%' FETCH FIRST 10 ROWS ONLY"
      dbStmt.query(sql, [42], (err, data) => {
        if (err) {
          console.log(err)
        }
        dbStmt.close()
        res.send(data)
      })
    })
})

routes.get('/as400SwiftIn/:library/:queryref',(req,res) => {
    db.open(connectionString, (err, dbStmt) => {
      if (err) return console.log(err)
      var sql = "SELECT DISTINCT trim(FD200_OUR_REF_NO) as OUR_REF_NO FROM " + req.params.library + ".FD200 where FD200_OUR_REF_NO like '%" + req.params.queryref + "%' FETCH FIRST 10 ROWS ONLY"
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
        var sql = "select TAG_20," +
        "SW_UMID,MESG_TYPE," +
        "case AML_RESULT " +
        "when '000' then 'No Hit(000)' " +
        "when '001' then 'Wait Ack(001)' " +
        "when '002' then 'Accept(002)' " +
        "when '003' then 'Reject(003)' " +
        "when '008' then 'Non Check(008)' " +
        "else AML_RESULT end as AML_RESULT" +
         "," +
        "AML_SEND_DATE_TIME," +
        "AML_ACK_DATE_TIME" +
        " from SWMOMSG WHERE BRANCH = '" + req.params.brn + "' AND TAG_20 ='" + req.params.ref + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)
            //send records as a response
            if(data === undefined) {
              mssql.close()
              res.type('text/plain');
              res.status(500);
              res.send('500 Server Error');
            }
            else{
              mssql.close()
              res.json(data.recordsets)
            }
        })
    })
})


routes.get('/swallowlog/in/:brn/:ref',(req,res) => {
    const pool = new mssql.ConnectionPool(swallowConfig,function (err) {
        if(err) console.log(err)
        //create Request object
        var request=new mssql.Request(pool)
        var sql = "select TAG_20," +
        "SW_UMID,MESG_TYPE," +
        "case AML_RESULT " +
        "when '000' then 'No Hit(000)' " +
        "when '001' then 'Wait Ack(001)' " +
        "when '002' then 'Accept(002)' " +
        "when '003' then 'Reject(003)' " +
        "when '008' then 'Non Check(008)' " +
        "else AML_RESULT end as AML_RESULT" +
         "," +
        "AML_SEND_DATE_TIME," +
        "AML_ACK_DATE_TIME" +
        " from SWMIMSG WHERE BRANCH = '" + req.params.brn + "' AND TAG_20 ='" + req.params.ref + "'";
        // var sql = "select TAG_20,SW_UMID,MESG_TYPE,AML_RESULT,AML_SEND_DATE_TIME,AML_ACK_DATE_TIME from SWMIMSG WHERE BRANCH = '" + req.params.brn + "' AND TAG_20 ='" + req.params.ref + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)
            //send records as a response
            if(data === undefined) {
              mssql.close()
              res.type('text/plain');
              res.status(500);
              res.send('500 Server Error');
            }
            else{
              mssql.close()
              res.json(data.recordsets)
            }
        })
    })
})

routes.get('/primelog/:brn/:ref',(req,res) => {
    const pool = new mssql.ConnectionPool(primeConfig,function (err) {
        if(err) console.log(err)
        //create Request object
        var request=new mssql.Request(pool)
        var sql = "select SeqNumb,Ref,UserMessageReference,Source,Dept,ReqTime,ConfirmState,ConfirmTime from FilterTranTable WHERE Branch = '" + req.params.brn + "' AND Ref ='" + req.params.ref + "'";
        request.query(sql,function(err,data){
            if(err) console.log(err)
            //send records as a response
            if(data === undefined) {
              mssql.close()
              res.type('text/plain');
              res.status(500);
              res.send('500 Server Error');
            }
            else{
              mssql.close()
              res.json(data.recordsets)
            }
        })
    })
})

module.exports = routes;
