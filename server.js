var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var client = io.sockets;	


app.use('/static',express.static(__dirname + '/public'));  // for using static css files

app.get('/', function(req,res){     // routing
	 res.sendFile(__dirname+ '/index.html');  //res is send File from given absolute path , __dirname will give absolute path automatically
});

mongo.connect('mongodb://localhost/chat', function(err, db){  //connecting mongodb
	if(err) throw err;
	var col = db.collection('messages');  //initializing collection message
	client.on('connection', function(socket){  // socket.io connection 
		socket.on('input',function(data){   //receiving data from frontend using input as an event
			var name = data.name,			
				message = data.message;
				blankRegExp = /^\s*$/;		//Regular Expression for blanks

			if (blankRegExp.test(name) || blankRegExp.test(message)) {  // Check if name or message is blank 
					console.log("Invalid")
			}
			else{
					col.insert({name:name, message:message}, function(){ // mongodb insertion
					console.log("Inserted");
				})
			} 
			
		})
	})
})


http.listen(1337, function(){       // starting server in localhost at 1337
	console.log('listening on *: 1337');
});