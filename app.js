	/*
	const but01=document.getElementById("but01");
	const t001 = document.getElementById("t001");
	const t002 = document.getElementById("t002");
	const input = document.getElementById("input");
	const send = document.getElementById("send");
	const btnfnread = document.getElementById("btnfnread");
	const filenameread = document.getElementById("filenameread");
	const btnfnwrite = document.getElementById("btnfnwrite");
	const txtar = document.getElementById("txtar");
	const filenamewrite = document.getElementById("filenamewrite");
	const btnfile2 = document.getElementById("btnfile2");
	const inpn = document.getElementById("inpn");
	const inpfilename = document.getElementById("inpfilename");
	*/
	const socket = io();

	t001.innerHTML = "окно загружено ";
	but01.onclick = function(){
		t001.innerHTML = "Жесть от Node JS";
	}
	function emitToServer(){
		socket.emit("eventServer",input.value);
	}
	send.onclick = emitToServer;
	input.onchange = emitToServer;
	socket.on("eventClient",function(msg){
		t002.innerHTML += msg.data + "<br>";
		input.value = "";
	});
	//кнопка Прочитать файл
	btnfnread.onclick = function(){
		socket.emit("fnServer",filenameread.value);
	}
	//вдруг что топришло с сервера
	socket.on("fnClient",function(dann){
		filenamewrite.value = dann.filename ;
		if(dann.err == ""){
			txtar.value = dann.data ;
		} else {
			txtar.value = dann.data ;
			t002.innerHTML += "Error: " + dann.err + " " + dann.filename + "<br>";
			input.value = "";
		}
	});
	//Кнопка записать в файл
	btnfnwrite.onclick = function(){
		socket.emit("wrServer",{"filename":filenamewrite.value,"data":txtar.value});
	}
	//ответ с сервера как прошла запись
	socket.on("wrClient",function(datt){
		if(datt.err != ""){
			t002.innerHTML += "Error: " + datt.err + " " + datt.filename + "<br>";
			input.value = "";
		}
	});
	//задача file2 -- 1000 задач по программированию Часть II Абрамян М.Э. 2004 --
	//решение на стороне сервера, бинарные файлы не использовать
	btnfile2.onclick = function(){
		socket.emit("file2Server",{"n":Number(inpn.value),"filename":inpfilename.value});
	}
	//задача file2 -- 1000 задач по программированию Часть II Абрамян М.Э. 2004 --
	//решение на стороне сервера, бинарные файлы не использовать, 
	//обязательно использовать парсинг в JSON 
	btnfile3.onclick = function(){
		socket.emit("file3Server",{"a":Number(inpa.value),"b":Number(inpb.value),"filename":inpfilename3.value});
	}
