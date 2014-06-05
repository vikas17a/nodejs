/*var exec = require('child_process').exec;
var child;
child = exec('cat app.js | wc -l', function(error, stdout, stderr){
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	if ( error != null ){
		console.log('exec error: ' + error);
	}
});
*/

var databaseUrl = "newapp";
var collections = ["testData"];
var db = require("mongojs").connect(databaseUrl, collections);

/*
db.testData.find({name: "vikas"}, function(err, users) {
	if ( err || !users ) console.log("No name with vikas found");
	else users.forEach( function(femaleUser){
		console.log(femaleUser);
	});
});

db.testData.save({name:"Renu"}, function(err, save){
	if (err || !save ) console.log("Not saved");
	else console.log("User saved !!!");
});*/
//export database;
/// Testing app from api healthkart ////////////

var Converter = require("csvtojson").core.Converter;

var fs=require("fs");
//var csvFileName = "./csv";
//var csvConverter = new Converter();

function my(){
	/*cp.exec('GET -C "healthkart:adw38&6cdQE" "http://api.healthkart.com/haproxy?stats;csv;" > csv', function(error, stdout, stderr){
		//console.log(stdout);
		
		var csvFileName = "./csv";
		
		var csvConverter = new Converter();

		csvConverter.on("end_parsed", function(jsonObj){
			
			var obj = {
				svname : {},
				scur : {},
				timestamp : {}
			}; 			
			obj.svname = jsonObj[0]["svname"];
			obj.scur = jsonObj[0]["scur"];
			obj.timestamp = dateFormat(new Date(), "%Y-%m-%dT%H:%M:%S", true);
			console.log(obj);
			db.testData.save(obj);	
		
			 var obj = {
                                svname : {},
                                scur : {},
                                timestamp : {}
                        };
			obj.svname = jsonObj[1]["svname"];
                        obj.scur = jsonObj[1]["scur"];
                        obj.timestamp = dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", true);
                        console.log(obj);
			db.testData.save(obj);

				
			 var obj = {
                                svname : {},
                                scur : {},
                                timestamp : {}
                        };
			obj.svname = jsonObj[2]["svname"];
                        obj.scur = jsonObj[2]["scur"];
                        obj.timestamp = dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", true);
                        console.log(obj);
			db.testData.save(obj);
			
			 var obj = {
                                svname : {},
                                scur : {},
                                timestamp : {}
                        };
			obj.svname = jsonObj[3]["svname"];
                        obj.scur = jsonObj[3]["scur"];
                        obj.timestamp = dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", true);
                        console.log(obj);
			db.testData.save(obj);
			
			 var obj = {
                                svname : {},
                                scur : {},
                                timestamp : {}
                        };
			obj.svname = jsonObj[4]["svname"];
                        obj.scur = jsonObj[4]["scur"];
                        obj.timestamp = dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", true);
                        console.log(obj);
			db.testData.save(obj);			
		});
		
		fs.createReadStream(csvFileName).pipe(csvConverter);

		setTimeout(my,3000);
	});*/
	
	cp.exec('GET -C "healthkart:adw38&6cdQE" "http://api.healthkart.com/haproxy?stats;csv;" > csv', function(error, stdout, stderr){
                var csvFile = "./csv";
                var csvConverter = new Converter();
                csvConverter.on("end_parsed", function(jsonObj){
                        for(var index in jsonObj){
                                db.apibox.insert(jsonObj[index]);
                        	console.log(jsonObj[index]);
			}
                });
		fs.createReadStream(csvFile).pipe(csvConverter);
		setTimeout(my,3000);
        });
}

/*function dateFormat (date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}*/

var cp = require('child_process');
my();


/*
var csvFileName = "./csv";
var csvConverter = new Converter();

csvConverter.on("end_parsed", function(jsonObj){
	console.log(jsonObj);
});

fs.createReadStream(csvFileName).pipe(csvConverter);

*/







