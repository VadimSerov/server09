const io = require('socket.io');
const http=require('http');
const fs = require('fs');
const server=http.createServer();
var ios = io.listen(server);

port = 80;
host = 'localhost';

css = 'body{'+
	'margin:0;'+
	'padding:0;'+
	'text-align:center;} '+
	'h1{'+
	'background-color:#43853d;'+
	'color:white;'+
	'padding: .5em;'+
	'font-family:"Consolas";}';

htm='<!DOCTYPE html>'+
	'<html>'+
	'<head>'+
	'<meta charset="UTF-8">'+
	'<title>Первый сервер</title>'+
	'<link rel="stylesheet" href="app.css">'+
	'</head>'+
	'<body>'+
	'<h1>Основы node js</h1>'+
	'<button id="but01">Нажать</button>'+
	'<script src="app.js"></script>'+
	'</body>'+
	'</html>';

js='const but01=document.getElementById("but01");'+
	'but01.onclick=function(){'+
	'alert("Жесть")}';

function randint(a,b){
	return Math.floor( a+Math.random()*b );
}

server.on('request',function(request,response){
	//console.log(request.url);
	if(request.url=='/'){
		response.writeHead(200,{'Content-Type':'text/html'});
		fs.readFile('index.html',function(err0,data0){
			if(!isNaN(err0)){
				htm = data0;}
			response.end(htm);
		});
	}else if(request.url=='/app.js'){
		response.writeHead(200,{'Content-Type':'text/javascript'});
		fs.readFile('app.js',function(err1,data1){
			if(!isNaN(err1)){
				js = data1;}
			response.end(js);
		});
	}else if(request.url=='/app.css'){
		response.writeHead(200,{'Content-Type':'text/css'});
		fs.readFile('app.css',function(err2,data2){
			if(!isNaN(err2)){
				css = data2;}
			response.end(css);
		});
	}else {
		response.writeHead(200,{'Content-Type':'text/html'});
		response.end('Content not found...');
	}
});

server.listen(port,host,function(){ 
	console.log('Сервер работает. Слушает хост:',host,' ,  порт:',port)
});

//установить счётчик рассоединений
//n_disconnect=0;

ios.sockets.on('connection', function (socket) {

	socket.on('eventServer', function (data) {
		console.log(data);
		socket.emit('eventClient', { "data": 'Hello Client! You send: '+data });
	});
	socket.on("fnServer",function(data3){
		console.log("Filename: "+data3);
		try {
			var buf = fs.readFileSync(__dirname+'/files/'+data3,"utf8");
			err="";
		}catch{
			err = "No such file.";
			buf = "";
		}
		socket.emit("fnClient",{"err":err,"filename":data3,"data":buf});
	});
	socket.on("wrServer",function(data4){
		console.log("Write file "+data4.filename);
		try{
			fs.writeFileSync(__dirname+'/files/'+data4.filename,data4.data);
			err="";
		}catch{
			err = "Can't write file.";			
		}
		socket.emit("wrClient",{"err":err,"filename":data4.filename});
	});
	//задача file2 -- 1000 задач по программированию Часть II Абрамян М.Э. 2004 --
	socket.on("file2Server",function(data5){
		console.log("Write file "+data5.filename);
		try{
			var nex = 2
			var string5=String(nex);
			for(let i=1;i<data5.n;i++){
				nex += 2 ;
				string5 += " "+String(nex); 
			}
			fs.writeFileSync(__dirname+'/files/'+data5.filename,string5);
			err="";
		}catch{
			err = "Can't write file.";			
		}
		socket.emit("wrClient",{"err":err,"filename":data5.filename});
	});
	//задача file3 -- 1000 задач по программированию Часть II Абрамян М.Э. 2004 --
	socket.on("file3Server",function(data6){
		console.log("Write file "+data6.filename);
		try{
			var buf = [];
			var x=data6.a;
			for(let i=0;i<10;i++){
				buf.push(x);
				x += data6.b;
			}
			//преобразовать в JSON и записать в файл на сервере
			fs.writeFileSync(__dirname+'/files/'+data6.filename, JSON.stringify(buf));
			err="";
		}catch{
			err="Can't write file.";
		}
	});
	//задача file3 -- 1000 задач по программированию Часть II Абрамян М.Э. 2004 --
	socket.on("file6Server",function(data7){
		console.log("Write file "+data7.filename);
		try{
			var buf = [];
			var n = randint(0,30);
			for(let i=0;i<n;i++){
				buf.push(randint(0,1000));
			}
			//преобразовать в JSON и записать в файл на сервере
			fs.writeFileSync(__dirname+'/files/'+data7.filename, JSON.stringify(buf));
			err="";
			socket.emit('eventClient', { "data": 'Элемент номер '+String(data7.k)+' равен '+String(buf[data7.k]) });
		}catch{
			err="Can't write file.";
		}
	});
	// что делать при разъединении с браузером 
	socket.on('disconnect', function () {
		//console.log('user disconnected',n_disconnect++);
	});
});
