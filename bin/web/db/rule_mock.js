var is_open = 'open'  //open close
var mock_type = 'local';  //local or moco

var db = require("./mysql.js"); 
var fs=require('fs');
var request = require('request');
var URL = require('url');
var paths = require('path')

const random = require('string-random');

var api_url;
var api_name = "test";
var api_resp_method;
var api_resp_headers;
var api_resp_body;
var api_resp_time;
var api_enabled;
var api_status = 200;
var api_resp_type = 'json';

var api_req_url;
var api_req_method;
var api_req_headers;
var api_req_params;
var api_req_body;
var flag = 'n';
var api_req_type;
var localResponse;
var startDealTime;

//

module.exports = {
	startDealTime = new Date();
	console.log('start beforeSendRequest, ' + startDealTime);
	(async ()=>{
		console.log('mock status-----------------------------：' + is_open);
		var sql = 'select' + 

		console.log("sql= "+sql);
		let results = await db.query2(sql);
		if (results.length >= 1){
			for(var r=0;r<results.length;r++){
					api_req_params = results[r].req_params;
					var tmpSort = calcSort(api_req_params,api_req_body);
					
					if(tmpSort > max){
						max = tmpSort;
						api_name = results[r].mock_name;
						api_resp_method = results[r].req_type;
						api_resp_headers = results[r].resp_headers;
						api_resp_time = results[r].resp_time;
						api_enabled = results[r].enabled;
						api_resp_body = results[r].asw_result; //'{"hello": "this is local response"}';
						api_resp_type = results[r].req_type;
						api_status = 200;
					}			
			}
			console.log('api_resp_body:' + api_resp_body);
				
		}else{
			console.log('No found [' + api_name +'] info');
			return false;
		}
		
		console.log('api flag-----------------------------:' + flag);
		
	})();


	
	summary: '-------------mock-----------------'
};

