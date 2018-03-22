var express = require('express')
var port = 8088
var app = express();
var routes = express.Router();
routes.get('/',(req,res,next)=>{
    req.url = '/index.html'
    next()
})

app.use(routes)

var goods = require('./data/goods.json')
var ratings = require('./data/ratings.json')
var seller = require('./data/seller.json')

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

app.use(express.static('./dist'))

module.express = app.listen(port,(err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('server start at http://localhost:' + port)
})