var express = require('express');
var mysql = require('./dbcon.js');
var path=require('path');

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  partialsDir: ['views/partials/']
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/',function(req,res,next){
  var context = {};
  res.render('home',context);
});

app.get('/index',function(req,res,next){
  var context = {};
  res.render('home',context);
});

app.get('/monsters',function(req,res,next){
  var context = {};
  res.render('monsters',context);
});

app.get('/characters',function(req,res,next){
  var context = {};
  context.characters = [
    { characterID:1, name:"Robert Sandfield", race:"Human",
      class:"Wizard", level:5, party:"Database Comrades",
      strength:20, dexterity:20, constitution:20,
      intelligence:20, wisdom:20, charisma:20 },
    { characterID:2, name:"Salah Salamey", race:"Dinosaur",
      class:"Monk", level:5, party:"Database Comrades",
      strength:20, dexterity:20, constitution:20,
      intelligence:20, wisdom:20, charisma:20 },
    { characterID:3, name:"Jeff O'Saur", race:"Dinosaur",
      class:"Bard", level:3, party:"Derpestarians",
      strength:13, dexterity:8, constitution:15,
      intelligence:11, wisdom:8, charisma:20 },
    { characterID:4, name:"Bill", race:"Donkey",
      class:"Bourgeoisie", level:8, party:"Derpestarians",
      strength:14, dexterity:8, constitution:15,
      intelligence:7, wisdom:6, charisma:8 },
    { characterID:5, name:"Shrek", race:"Ogre",
      class:"Fighter", level:6, party:"Shronkey",
      strength:18, dexterity:11, constitution:16,
      intelligence:12, wisdom:9, charisma:8},
    { characterID:6, name:"Bard", race:"Donkey",
      class:"Bourgeoisie", level:8, party:"Shronkey",
      strength:14, dexterity:8, constitution:15,
      intelligence:11, wisdom:9, charisma:18 }
  ];

  res.render('characters',context);
});

app.get('/biomes', function (req, res, next) {
    var context = {};
    res.render('biomes', context);
});

app.get('/abilities', function (req, res, next) {
    var context = {};
    res.render('abilities', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
