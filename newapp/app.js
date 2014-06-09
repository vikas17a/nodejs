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
var cp2 = require('child_process');
var fs = require('fs');
//var fs2 = require('fs');

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


app.get('/', function(req, res){
	res.render('index.html');
});

//// Stats application  function to grap scv and insert into db  ///

function statsapp(){
	cp.exec('GET -C "healthkart:adw38&6cdQE" "http://api.healthkart.com/haproxy?stats;csv;norefresh" > csv', function(error, stdout, stderr){
		if (error || stderr){
			console.log("Did not recieve any data" + error + " " +stderr);
			throw error;
		}
		var csvFile = "./csv";
		var csvConverter = new Converter();
		csvConverter.on("end_parsed", function(jsonObj){
			for(var index in jsonObj){
				jsonObj[index]["timestamp"]  = Date.now();
				jsonObj[index]["# pxname"] = "api";
				db.apibox.insert(jsonObj[index], function(err, result){
					if (err) {
						console.log("Error data not inserted" + err);
					}
					console.log("API Cluster stats inserted to DB");
				});
			}
		});
		fs.createReadStream(csvFile).pipe(csvConverter);
		cp.exec('GET -C "healthkart:adw38&6cdQE" "http://healthkart.com/haproxy?stats;csv;norefresh" > csv2',function(error, stdout, stderr){
		if (error || stderr){
                        console.log("Did not recieve any data" + error + stderr);
                	throw error;
		}
                var csvFile = "./csv2";
                var csvConverter = new Converter();
                csvConverter.on("end_parsed", function(jsonObj){
                        for(var index in jsonObj){
                                jsonObj[index]["timestamp"]  = Date.now();
				if(jsonObj[index]["# pxname"] == "healthkart"){
					jsonObj[index]["# pxname"] = "prod";
				}
                                db.apibox.insert(jsonObj[index], function(err, result){
                                        if (err) {
                                                console.log("Error data not inserted" + err);
                                        }
                                        console.log("HK-PROD Cluster stats inserted to DB");
                                });
                        }
                });
                fs.createReadStream(csvFile).pipe(csvConverter);
		});
		setTimeout(statsapp, 5000);
	});
}

statsapp(); // kick to stats app function to get populate data in mongo

app.get('/api/', function(req, res){
	var server = req.query['svname'];
	var day = req.query['day'];
	var box = req.query['box'];
	var _cur_date = new Date();
        var _tommorow_date = new Date();
        if ( day == "today"){
        	_cur_date.setHours(00,00,00,00);
		//console.log(_cur_date);
        	_cur_date = Date.parse(_cur_date);
         	//console.log(_cur_date);
		_tommorow_date.setHours(23,59,59,59);
                //console.log(_tommorow_date);
		_tommorow_date = Date.parse(_tommorow_date);
		//console.log(_tommorow_date);
	}
	else if ( day == "lastday"){
		_cur_date.setHours(00,00,00,00);
		_cur_date.setHours(_cur_date.getHours() - 24);
                //console.log(_cur_date);
		_cur_date = Date.parse(_cur_date);
		_tommorow_date.setHours(23,59,59,59);
                _tommorow_date.setHours(_tommorow_date.getHours() - 24);
		//console.log(_tommorow_date);
		_tommorow_date = Date.parse(_tommorow_date);
		//console.log(_tommorow_date);
	}
	console.log(_cur_date);
	console.log(_tommorow_date);
	db.apibox.find({ "# pxname" : box, "svname" : server, "timestamp" : { $gt: _cur_date, $lt: _tommorow_date} }, function(err, result){
		//console.log(result);
		var obj = {};	
		if( day == "today" ){
			obj = {
				cols : [{"id" : 'xaxis', "label" : "Time", "type" : "datetime"},
					{"id" : 'today', "label" : "Today", "type" : "number"}
					],
				rows : [],
			}
		}
		else if ( day == "lastday"){
			 obj = {
                                cols : [{"id" : 'xaxis' ,"label" : "Time", "type" : "datetime"},
                                        {"id" : 'yesterday', "label" : "Yesterday", "type" : "number"}
                                        ],
                                rows : [],
                        }
		}
		for (var index in result){
			var _date = result[index]["timestamp"];
			var d ="Date(" + _date + ")";
			if(day == "lastday"){
				d = new Date(_date);
				d.setHours(d.getHours() + 24);
				_date = Date.parse(d);
				d = "Date(" + _date + ")";
			}
			obj.rows.push({"c" : [{"v" : d },{"v" : result[index]["rate"]}]});
		}
		res.send(obj);
		if(err){
			console.log(err);
		}
	});
	console.log("Data Recieved from API HAPROXY BOXES");		
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
