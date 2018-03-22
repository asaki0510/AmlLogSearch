require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

//odbj//
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
};

var sasConfig={
  user:'SA',
  password:'!qaz2wsx',
  server:'192.168.211.235',   
  database:'AMLHK0'
};



var app = express()
var goods = require('../data/goods.json')
var ratings = require('../data/ratings.json')
var seller = require('../data/seller.json')

var routes = express.Router()


var db = require('odbc');

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
    var sql = "SELECT FSTUS_SCR_NO,FSTUS_TXN_KEY,FSTUS_UPDATE_NO,FSTUS_AS400_AML_STUS FROM "
    + req.params.library +".FBLSTUS WHERE FSTUS_SCR_NO ='" + req.params.scrno +"' AND FSTUS_UPDATE_NO LIKE '" + req.params.date + "%'"
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
  mssql.close()
  mssql.connect(swallowConfig,function (err) {
    if(err) console.log(err)  
    //create Request object
    var request=new mssql.Request()
    var sql = "select [MESG_APPLI_MAIN_REFNO],[AML_ACK_DATE_TIME] from [MEGA_OBSWDBT].[dbo].[SWHNMSG] where [MESG_APPLI_MAIN_REFNO] = '" + req.params.scrno + "-" + req.params.refno + "-" + req.params.updateno + "'";
    console.log(sql);
    request.query(sql,function(err,data){
    if(err) console.log(err)  
    //send records as a response
    res.json(data.recordsets)
    })
  })  
 })

routes.get('/saslog/:scrno/:refno/:updateno',(req,res) => {
mssql.close()
mssql.connect(sasConfig,function (err) {
  if(err) console.log(err)  
  //create Request object
  var request=new mssql.Request()
  var sql = "select [REFERENCE_NUMBER] from [AMLHK0].[NCSC].[NAME_CHECK_RECORD_MAIN] where [REFERENCE_NUMBER] ='" + req.params.scrno + "-" + req.params.refno + "-" + req.params.updateno + "'";
  console.log(sql);
  request.query(sql,function(err,data){
  if(err) console.log(err)  
  //send records as a response
  res.json(data.recordsets)
  })
})  
})



routes.get('/Customer/:id',(req,res) => {
  db.open(connectionString, (err, dbStmt) => {
    if (err) return console.log(err)
    dbStmt.query("SELECT * FROM THONGKONG.F1000 WHERE CMST_CUST_ID = "+ req.params.id +" fetch first 1 row only", [42], (err, data) => {
      if (err) {        
        console.log(err)    
      }
      dbStmt.close()

      res.json(data)
    })
  })
})

routes.get('/goods',(req,res) => {
  res.json(goods)
})


routes.get('/ratings',(req,res) => {
  res.json(ratings)
})


routes.get('/seller',(req,res) => {
  res.json(seller)
})

app.use('/api',routes)


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
