var express = require('express');
var router = express.Router();

var db=require("mongodb").MongoClient;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lottery', function(req, res, next) {
  res.render('lottery', { title: 'Express' });
});

router.get('/lottery/initList', function(req,res){
  var number = + req.param('number');
  db.connect("mongodb://127.0.0.1:27017/lottery",function(err,d) {
    if(err) {
      console.log(err);
      return;
    }
    var idn = Math.random();
    d.db("lottery").collection("list").find({id: { $gte : idn }}).limit(number).toArray((err,data)=>{
      result = data;
      if(data.length < number) {
        d.db("lottery").collection("list").find({id: { $lte  : idn }, level : ""}).limit(number-data.length).toArray((err,data)=>{
          result = result.concat(data);
          res.json(result);
        })
      }else{
        res.json(result)
      }
    });
  });
}) 

router.get('/lottery/winner', function(req,res){
  var number = + req.param('number');
  var level = req.param('level');
  switch (level)
  {
    case 'mystical':
      level = '神秘大奖';
      break;
    case 'special':
      level = '特等奖';
      break;
    case 'first':
      level = '一等奖';
      break;
    case 'second1':
      level = '二等奖ipad';
      break;
    case 'second2':
      level = '二等奖sony';
      break;
    case 'third':
      level = '三等奖';
      break;
    case 'four':
      level = '四等奖';
      break;
    case 'five':
      level = '五等奖';
      break;
    case 'six':
      level = '六等奖';
      break;
    case 'sunshine':
      level = '阳光普照奖';
      break;
  }
  db.connect("mongodb://127.0.0.1:27017/lottery",function(err,d)
  {
    if(err)
    {
      console.log(err);
      return;
    }
    var idn = Math.random();
    d.db("lottery").collection("list").find({id: { $gte : idn }, level : ""}).limit(number).toArray((err,data)=>{
      var result = [];
      var curData = {
        $set:{  
            level:level
        }
      }
      result = data;
      if(data.length < number){
        d.db("lottery").collection("list").find({id: { $lte  : idn }, level : ""}).limit(number-data.length).toArray((err,data)=>{
          result = result.concat(data);
          var data = [];
          result.forEach(item => {
            data.push(item.number);
          })
          d.db("lottery").collection("list").update({number:{ $in: data}}, curData, {multi : true}, function(err, result){
            if(err != null){
              console.log("更新失败");
              console.log(err);
            }
          })
          res.json(result);
        })
      }else{
        var data = [];
        result.forEach(item => {
          data.push(item.number);
        })
        d.db("lottery").collection("list").update({number:{ $in: data}}, curData, {multi : true}, function(err, result){
          if(err != null){
            console.log("更新失败");
            console.log(err);
          }
        })
        res.json(result)
      }
    });
  });

}) 

module.exports = router;
