var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//Shell child process
var cp = require('child_process');
var fs = require('fs');

//Converter from csv to json
var Converter = require("csvtojson").core.Converter;

//Database mongo db
var dbUrl = "stats";
var collections = ["apibox"];
var db = require("mongojs").connect(dbUrl, collections);

var app = express();

app.engine('html',require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/server/', function(req,res){	
	db.apibox.find({ "svname" : "vmn-411" }, function(err, result){
                var obj = {
                        cols : [{"label" : "Time", "type" : "string"},
                                {"label" : "Today", "type" : "number"}
                                ],
                        rows : []
                }
                for (var index in result){
                        var _date = result[index]["timestamp"];
                        var d = new Date(_date);
                        var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                        var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
                        var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
                        var formattedTime = hours + ":" + minutes;
                        obj.rows.push({"c" : [{"v" : formattedTime},{"v" : result[index]["rate"]}]});
                }
		res.render(obj);
	});
});




/*var obj = {
	     cols : [{"label" : "Time", "type" : "datetime"},
                     {"label" : "Today", "type" : "number"}
                    ],
             rows : []
         }

obj.rows.push({"c" : [{"v" : "Wed Jun  4 11:42:07 IST 2014"}, {"v" : "4"}]});
console.log(obj["rows"][0]);

/*
//ObjectId("538dd020a3a2b96f1d7a6919")
var 

//var obj = {
//	cols : [],
//	rows : []
//}
/*
db.testData.find({ svname :  "vmn-415"  }, function(err, result){
	console.log(result);
	for(var index in result){
		console.log(index + "  :  " + result[index]["scur"]);	
		
	}
});
*/



//console.log(o.getTimestamp());
	
//var obj = {
//	sname : {},
//	vname : {},
//	timestamp : {}
//}

//obj.sname = "hi";
//obj.vname = "kk";
//obj.timestamp = "29-May-2014";

//console.log(aobj)

/*var objectId = require('mongodb').ObjectId;
var obj = objectId();
console.log(obj.getTimestamp());
*/
/*var cp = require('child_process');
cp.exec('date', function(error, stdout, stderr){
	console.log(stdout);

});*/



