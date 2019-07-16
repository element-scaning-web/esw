const SQL = require('./db/SQL.js');

var express = require("express");
var nodeCmd = require('node-cmd');
var path = require('path');
var http = require('http');
var fs=require("fs");
var URL =require('url');
var qs =require('querystring'); 
var bodyParser = require("body-parser");  
var db = require("./db/mysql.js"); 
var nodeCmd = require('node-cmd');



//端口修改后需修改iframe.html 下 elementPage src
var app = express();
var port = 8081;


app.get('/', function (req, res) {
  res.send(
  	'<H5><font size="10" font-family="verdana" color="red">-----------------20190628-------------------------</font></H5>' + 
	'<H5>1. get /projects 		-- 		list all projects</H5>' + 
	'<H5>2. get /pages?projectId=14 		-- 		list all pages</H5>' +
	'<H5>3. get /elements?pageId=24 		-- 		list all elements</H5>' + 
	'<H5>4. post /page 		-- 		add one page</H5>' +
	'<H6>......method:post, params: projectId=14;pageName=test;projectName=UC</H6>' +
	'<H5>5. post /elements 		-- 		add elements to atp</H5>' + 
	'<H6>......method:post, params: pageId=24;elementName=test;elementType=1;elementFinder=1;elementValue=xpath;elementFrame=frame;elementIndex=1</H6>' +
	'<H5><font size="10" font-family="verdana" color="red">--------------------config.properties----------------------</font></H5>' + 
	'<H5>-------browser: chrome/ie   要启动的浏览器>-------</H5>' + 
	'<H5>-------defUrl   默认打开的链接地址，无需修改>-------</H5>' + 
	'<H5>-------types    高亮的元素标签，默认 input,a,button，当选择的类型不高亮时添加标签>-------</H5>' + 
	'<H5>-------collectInterval   任务执行频率，毫秒，默认3000>-------</H5>' + 
	'<H5>-------startServer：auto/mam   是否自动启动web服务，默认自动开启>-------</H5>' +
	'<H5><font size="10" font-family="verdana" color="red">--------------------db.properties----------------------</font></H5>' + 
	'<H5>-------properties path: /web/db/conf.js>-------<H5>' + 
	'<font size="5" face="arial" color="red">I am looking for a job, If you think I can, please contact me , email: llggww@126.com</font>'
  )
})


//获取项目
app.get('/projects', function (req, res) {
  var projectsql = SQL.SQLProject;
  console.log("sql= "+projectsql);
  
  (async ()=>{
		let results = await db.query2(projectsql);
		if (results.length >= 1){
			//res.send(''  + Array.isArray(results));
			//res.send(''  + JSON.parse(results));
			res.send(results);
		}else{
			res.send('');
		}
	})();
})

//获取页面
app.get('/pages', function (req, res) {
	var params = URL.parse(req.url, true).query;
	var pid = params.projectId;
	
	if(pid == undefined || pid == ''){
		res.send('projectId 不能为空');
		return false;
	}
	console.log("project id: " + pid.toString());
	
	//var sqlPage = 'select id,page_name from atp_page where project_id=' + pid;
	var sqlPage = SQL.SQLPage;
	var params = [pid];
	console.log("sql= "+sqlPage + ', params=' + params);
	
	(async ()=>{
		let results = await db.query2(sqlPage,params);
		if (results.length >= 1){
			res.send(results);
			/*for(var r=0;r<results.length;r++){
				//res.send(results[r].page_name);
				console.log(results[r].page_name);
			}*/
			//res.send(''  + JSON.parse(results));
			//res.end(results);
		}else{
			res.send('');
		}
	})();
	
	//res.send('Hello pages!')
})
//添加页面
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/page', urlencodedParser,function (req, res) {
	console.log(req.body);//{ age: '20', name: 'lambo' }---body是从客户端传过来的参数
	var pid = req.body.projectId;
	var pgNm = req.body.pageName;
	var pNm=req.body.projectName;
	console.log(pid);
	console.log(pgNm);
	console.log(pNm);

	if(pid == undefined || pid == ''){
		res.send('projectId 不能为空');
		return false;
	}
	if(pNm == undefined || pNm == ''){
		res.send('projectName 不能为空');
		return false;
	}
	if(pgNm == undefined || pgNm == ''){
		res.send('pageName 不能为空');
		return false;
	}
	
	var addPageSql = " insert into atp_page" +
					"(page_name,page_desc,project_id,project_name,create_time,create_emp,delete_flag) "  +
					" VALUES('" + pgNm  + "','" + pgNm + " desc','" + pid +"','" + pNm + "',now(),'third','0')";
	
	//var addPageSql = SQL.SQLAddPage;
	//var params = ["'" + pgNm  + "'","'" + pgNm + " desc'","'" + pid +"'","'" + pNm + "'",'now()',"'third'","'0'"];
	console.log("sql= " + addPageSql + ", params=" + params);
	
	(async ()=>{
		try {
			//let results = await db.query2(addPageSql);
			let results = await db.query2(addPageSql,params);
			res.send("{ result: 'success', msg: 'add success' }");
		}catch(e){
			res.send("{ result: 'fail', msg: '" + e + "' }");
		}
	})();
	
	//res.send('Hello pages!')
})


//获取元素
app.get('/elements', function (req, res) {
	var params = URL.parse(req.url, true).query;
	var pgid = params.pageId;
	if(pgid == undefined || pgid == ''){
		res.send('pageId 不能为空');
		return false;
	}
	console.log("page id: " + pgid.toString());

   /* var sqlElements = 'select id,element_name,element_value,element_frame,element_index, ' + 
	'(select type_name from omg_fsp_dict_data where type_class_code = "ELEMENT_FINDER_TYPE" and type_id = element_type) as element_finder, ' +
	'(select type_name from omg_fsp_dict_data where type_class_code = "ELEMENT_TYPE" and type_id = element_type) as element_type ' +
	' from atp_element where page_id=' + pgid ;*/
	
	var sqlElements = SQL.SQLElements;
	var params = [pgid];
	console.log("sql= "+sqlElements + ", params=" + params);
	
	(async ()=>{
		let results = await db.query2(sqlElements,params);
		if (results.length >= 1){
			res.send(results);
			//res.end(results);
		}else{
			res.send('');
		}
	})();

})


//添加元素
/*
app.post('/element', urlencodedParser, function (req, res) {
	console.log(req.body);//
	addOneElment(req.body,res);
})*/


app.use(bodyParser.json());
app.post('/elements', urlencodedParser, function (req, res) {
	res.header("Content-Type", "application/json; charset=utf-8");
	
	var response = {
		   "result":'fail2',
		   "msg":0
	};
	
	for(var i=0;i<req.body.length;i++){
		console.log('--'+req.body[i]);
		var id = req.body[i].id;
		/*var pgId = req.body[i].pageId;
		var eNm = req.body[i].elementName;
		var eType=req.body[i].elementType;
		var eFinder=req.body[i].elementFinder;
		var eValue=req.body[i].elementValue;
		var eFrame=req.body[i].elementFrame;
		var eIndex=req.body[i].elementIndex;*/
		var pgId = req.body[i].pageId;
		var id = req.body[i].id;
		var eNm = req.body[i].element_name;
		var eType=req.body[i].element_type;
		var eFinder=req.body[i].element_finder;
		var eValue=req.body[i].element_value;
		var eFrame=req.body[i].element_frame;
		var eIndex=req.body[i].element_index;
		var ctime='now()';
		var cemp='third';
		var deleteFlag='0';

		
		if(eNm == undefined || eNm == ''){
			//res.send('elementName 不能为空');
			//response = { "result":'fail',"msg": "elementName 不能为空"};
			response['result'] ='fail'; 
			response['msg'] ="elementName 不能为空"; 
			break;
		}
		if(eType == undefined || eType == ''){
			//res.send('elementType 不能为空');
			//return false;
			response = { "result":'fail',"msg": "元素[" + eNm + "] elementType 不能为空"};
			break;
		}
		if(eFinder == undefined || eFinder == ''){
			//res.send('elementFinder 不能为空');
			//return false;
			response = { "result":'fail',"msg": "元素[" + eNm + "] elementFinder 不能为空"};
			break;
		}else{
			if(eFinder == 'id'){
				eFinder = 1;
			}else if(eFinder == 'name'){
				eFinder = 2;
			}else if(eFinder == 'xpath'){
				eFinder = 3;
			}else{
				eFinder = 3;
			}
		}
		if(eValue == undefined || eValue == ''){
			//res.send('elementValue 不能为空');
			//return false;
			response = { "result":'fail',"msg": "元素[" + eNm + "] elementValue 不能为空"};
			break;
		}else{
			var reg1 = new RegExp("\'" , "g" );
			var reg2 = new RegExp('\"' , "g" )
			eValue = eValue.replace( reg1 , "\\'" );
			eValue = eValue.replace( reg2 , '\\"' );
		}
		if(eFrame == undefined){
			//res.send('elementFrame 不能为空');
			//return false;
			eFrame ='';
		}
		if(eIndex == undefined ){
			//res.send('elementIndex 不能为空');
			//return false;
			//response = { "result":'fail',"msg": "元素[" + eNm + "] elementIndex 不能为空"};
			//break;
			eIndex == '';
		}
		var ts = "select type_code from omg_fsp_dict_data where type_class_code = 'ELEMENT_TYPE' and type_name = '" + eType +"' ";
		
		var updateElementSql ="update atp_element set " +
							"element_name=" + "'" + eNm + "'" + "," + 
							"element_desc=" + "'" + eNm + "'," + 
							"element_type=" + "'" + 3 + "'," + 
							//"element_type=" + "(" + ts + ")," + 
							"element_finder=" + "'" + eFinder + "'," + 
							"element_value=" + "'" + eValue + "'," + 
							"element_frame=" + "'" + eFrame + "'," + 
							"element_index=" + "'" + eIndex + "'," + 
							"update_time=" + "" + ctime + "," + 
							"update_emp=" + "'" + cemp + "'" + 
							//"delete_flag=" + deleteFlag
						 " where id=" + id
		
		var addElementSql="insert into atp_element" +
						"(" +
							"page_id,"  +
							"element_name," + 
							"element_desc," + 
							"element_type," +
							"element_finder," + 
							"element_value," + 
							"element_frame," + 
							"element_index," +
							"create_time," + 
							"create_emp," + 
							"delete_flag" +
						")VALUES(" +
							"'" + pgId + "'," +
							"'" + eNm + "'," + 
							"'" + eNm + "描述'," + 
							//"'" + 2 + "'," + 
							"(" + ts + ")," +
							"'" + eFinder + "'," + 
							"'" + eValue + "'," + 
							"'" + eFrame + "'," + 
							"'" + eIndex + "'," + 
							"" + ctime + "," + 
							"'" + cemp + "'," + 
							"'" + deleteFlag + "'"
						+ ")"
		
		console.log('element id:'+id)

		var execSql = "";
		if(id ==undefined || id==''){
			console.log('new element');
			execSql = addElementSql;
			if(pgId == undefined || pgId == ''){
				response['result'] ='fail'; 
				response['msg'] ="元素[" + eNm + "] pageId 不能为空"; 
				break;
			}

		}else{
			console.log('update element');
			execSql = updateElementSql;
		}
		console.log("sql="+execSql);
		//var err ='';
		(async ()=>{
			try {
				let results = await db.query2(execSql);
			}catch(e){
				//err =e; 
			}
		})();
		
		response['result'] ='success'; 

		//console.log(response);
		//res.end(JSON.stringify(response));
	}
	console.log(response);
	res.end(JSON.stringify(response));
	
})


app.use(express.static("web"));
app.listen(port, ()=>{
	try{
		console.log("---------web服务启动成功-----------");
		console.log("url:" + "http://127.0.0.1:" + port + '/start.html');
	}catch(e){
		console.log('web服务启动失败...' + e);
	}
	
	try{
		//var s = 'cmd /c  && cd ' + path.resolve(__dirname, '..')  + '&& start /b java -jar oneKey.jar';
		//nodeCmd.run(s);
	}catch(e){
		console.log('启动浏览器失败...' + e);
	}

	console.log("-------启动成功, 请等待3秒后继续------");


});


process.on('SIGINT', function () {
	nodeCmd.run('taskkill /F /IM chromedriver.exe');
    console.log("-------退出成功-------");
    process.exit();
});
