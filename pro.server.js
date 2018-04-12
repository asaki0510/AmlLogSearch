var express = require('express')
var port = 8088
var app = express();
var routes = express.Router();
routes.get('/',(req,res,next)=>{
    req.url = '/index.html'
    next()
})

app.use(routes)

var sasLogApi = require('./build/saslog-api-sit')
var primeLogApi = require('./build/primelog-api-sit')
app.use('/api',sasLogApi)
app.use('/primeapi',primeLogApi)

app.use('/api',routes)

app.use(express.static('./dist'))

module.express = app.listen(port,(err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('server start at http://localhost:' + port)
})